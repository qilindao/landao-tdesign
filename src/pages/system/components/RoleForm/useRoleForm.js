import { reactive, getCurrentInstance } from "vue";
import { useDialogInner } from "@/components/Dialog";
import { useForm } from "@/components/Form";
import { addRole, updateRole } from "@/api/modules/manage/role";
import { useMessage } from "@/landao/hooks";

export function useRoleFormStates() {
  return reactive({
    roleId: 0,
    title: "新增角色",
  });
}

export function useRoleForm(states) {
  function getFormSchema() {
    return [
      {
        field: "roleName",
        label: "角色名称",
        component: "Input",
        required: true,
        defaultValue: "",
        componentProps: {
          placeholder: "请输入角色名称",
        },
      },
      {
        field: "roleDesc",
        label: "备注",
        component: "Textarea",
        defaultValue: "",
        componentProps: {
          placeholder: "请输入角色说明",
          defaultValue: "",
        },
      },
    ];
  }

  //注册表单
  const [
    registerForm,
    { resetFields, setFieldsValue, validate, getFieldsValue },
  ] = useForm({
    labelWidth: "90px",
    schemas: getFormSchema(),
    showActionButtonGroup: false,
  });

  const [registerDialog, { setDialogProps, closeDialog }] = useDialogInner(
    async (data) => {
      resetFields();
      setDialogProps({ confirmLoading: false });
      states.roleId = data?.roleId;
      if (states.roleId > 0) {
        states.title = "编辑角色";
        await setFieldsValue({ ...data.record });
      } else {
        states.title = "新增角色";
      }
    }
  );
  const instance = getCurrentInstance();
  const emit = instance.emit;
  const { createMessage } = useMessage();

  const doSubmit = async () => {
    try {
      await validate();
      const values = getFieldsValue();
      setDialogProps({ confirmLoading: true });
      if (states.roleId > 0) {
        await updateRole(states.roleId, values)
          .then((res) => {
            closeDialog();
            emit("success");
          })
          .catch((error) => {
            createMessage.error(error.message);
          });
      } else {
        await addRole(values)
          .then((res) => {
            closeDialog();
            emit("success");
          })
          .catch((error) => {
            createMessage.error(error.message);
          });
      }
    } finally {
      setDialogProps({ confirmLoading: false });
    }
  };

  return {
    registerForm,
    doSubmit,
    registerDialog,
  };
}
