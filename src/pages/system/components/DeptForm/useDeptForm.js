import { reactive, getCurrentInstance } from "vue";
import { useDialogInner } from "@/components/Dialog";
import { useForm } from "@/components/Form";
import { addDept, updateDept } from "@/api/modules/manage/dept";
import { useMessage } from "@/landao/hooks";
import { deepTree } from "@/landao/utils";
import { cloneDeep } from "lodash-es";

export function useDeptFormStates() {
  return reactive({
    deptId: 0,
    title: "新增部门",
  });
}
export function useDeptForm(states) {
  function getFormSchema() {
    return [
      {
        field: "deptName",
        label: "部门名称",
        component: "Input",
        required: true,
        defaultValue: "",
        componentProps: {
          placeholder: "请输入部门名称",
        },
      },

      {
        field: "parentId",
        label: "上级节点",
        required: true,
        defaultValue: 0,
        component: "TreeSelect",
        defaultValue: 0,
        componentProps: {
          placeholder: "请选择上级节点",
          filterable: true,
          keys: {
            value: "deptId",
            label: "deptName",
          },
          data: [],
        },
      },
      {
        field: "deptOrder",
        label: "排序",
        component: "InputNumber",
        defaultValue: 0,
        componentProps: {
          controlsPosition: "right",
          min: 0,
        },
      },
      {
        field: "deptDesc",
        label: "备注",
        component: "Textarea",
        defaultValue: "",
        componentProps: {
          placeholder: "部门说明",
          defaultValue: "",
        },
      },
    ];
  }

  //注册表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue, updateSchema },
  ] = useForm({
    labelWidth: "120px",
    schemas: getFormSchema(),
    showActionButtonGroup: false,
  });

  /**
   * 设置上级部门
   * @param {Array} deptData
   */
  const updateParentDeptList = async (deptData) => {
    let _list = cloneDeep(deptData);
    _list.unshift({
      deptId: 0,
      deptName: "顶级部门",
    });
    await updateSchema({
      field: "parentId",
      componentProps: {
        data: deepTree(_list, "deptId", "parentId", "deptOrder"),
      },
    });
  };

  const [registerDialog, { setDialogProps, closeDialog }] = useDialogInner(
    async (data) => {
      resetFields();
      setDialogProps({ confirmLoading: false });
      states.deptId = data?.deptId;
      if (data?.deptList) {
        updateParentDeptList(data?.deptList);
      }
      if (states.deptId > 0) {
        states.title = "编辑部门";
        const { record } = data;
        await setFieldsValue(record);
      } else {
        states.title = "新增部门";
        if (data.parentId > 0)
          await setFieldsValue({ parentId: data.parentId });
      }
    }
  );

  const { createMessage } = useMessage();
  const instance = getCurrentInstance();
  const emit = instance.emit;

  /**
   * 提交数据
   */
  const doSubmit = async () => {
    try {
      await validate();
      const values = getFieldsValue();
      setDialogProps({ confirmLoading: true });
      if (states.deptId > 0) {
        await updateDept(states.deptId, values)
          .then((res) => {
            createMessage.success(res.message);
            closeDialog();
            emit("success");
          })
          .catch((err) => {
            createMessage.error(err.message);
          });
      } else {
        await addDept(values)
          .then((res) => {
            createMessage.success(res.message);
            closeDialog();
            emit("success");
          })
          .catch((err) => {
            createMessage.error(err.message);
          });
      }
    } catch (error) {
    } finally {
      setDialogProps({ confirmLoading: false });
    }
  };

  return {
    registerDialog,
    registerForm,
    doSubmit,
  };
}
