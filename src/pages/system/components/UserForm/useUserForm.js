import { reactive, getCurrentInstance, nextTick } from "vue";
import { useForm } from "@/components/Form";
import { deepTree } from "@/landao/utils";
import { useMessage } from "@/landao/hooks";
import { useDialogInner } from "@/components/Dialog";
import { getDeptList } from "@/api/modules/manage/dept";
import { getRoleList } from "@/api/modules/manage/role";
import { addUser, updateUser } from "@/api/modules/manage/user";
export function useUserFormStates() {
  return reactive({
    userId: 0,
    title: "新增管理员",
  });
}

export function useUserForm(states) {
  function getFormSchema() {
    return [
      {
        field: "username",
        label: "用户名",
        component: "Input",
        defaultValue: "",
        helpMessage: "用于后台登录",
        required: true,
        colProps: {
          span: 6,
        },
        help:"默认密码：123qwe@ASD",
        componentProps: {
          placeholder: "请输入登录用户名",
        },
      },
      {
        field: "realname",
        label: "真实姓名",
        component: "Input",
        defaultValue: "",
        required: true,
        colProps: {
          span: 6,
        },
        componentProps: {
          placeholder: "请输入真实姓名",
        },
      },
      {
        field: "nickname",
        label: "昵称",
        component: "Input",
        defaultValue: "",
        colProps: {
          span: 6,
        },
        componentProps: {
          placeholder: "请输入昵称",
        },
      },
      {
        field: "deptId",
        label: "所属部门",
        component: "ApiTreeSelect",
        defaultValue: "",
        required: true,
        colProps: {
          span: 6,
        },
        componentProps: {
          placeholder: "请选择部门",
          api: getDeptList,
          filterable: true,
          labelField: "deptName",
          valueField: "deptId",
          immediate: true,
          afterFetch: (treeData) => {
            if (!treeData) return [];
            return deepTree(treeData, "deptId", "parentId", "deptOrder");
          },
        },
      },
      {
        field: "phone",
        label: "手机号",
        component: "Input",
        defaultValue: "",
        colProps: {
          span: 6,
        },
        componentProps: {
          placeholder: "请输入手机号",
        },
      },
      {
        field: "manageStatus",
        label: "状态",
        component: "RadioGroup",
        defaultValue: 1,
        colProps: {
          span: 6,
        },
        componentProps: {
          options: [
            { label: "启用", value: 1 },
            { label: "禁用", value: 0 },
          ],
        },
      },
      {
        field: "roles",
        label: "角色",
        component: "ApiSelect",
        defaultValue: [],
        helpMessage: "最多选择3项",
        required: true,

        componentProps: {
          placeholder: "请选择角色",
          api: getRoleList,
          multiple: true,
          max: 3,
          labelField: "roleName",
          valueField: "roleId",
          immediate: true,
        },
      },
      {
        field: "introduce",
        label: "备注",
        component: "Textarea",
        defaultValue: "",
        componentProps: {
          placeholder: "请输入用户说明",
        },
      },
    ];
  }

  const [
    registerForm,
    { resetFields, validate, getFieldsValue, setFieldsValue },
  ] = useForm({
    labelPosition: "right",
    labelWidth: "100px",
    schemas: getFormSchema(),
    showActionButtonGroup: false,
  });

  const [registerDialog, { setDialogProps, closeDialog }] = useDialogInner(
    async (data) => {
      resetFields();
      setDialogProps({ confirmLoading: false });
      states.userId = data?.userId;
      if (states.userId > 0) {
        states.title = "编辑管理员";
        const { record } = data;
        nextTick(async () => {
          await setFieldsValue({
            username: record.username,
            realname: record.realname,
            deptId: record.deptId,
            roles: record.roles.map((item) => {
              return item.roleId;
            }),
            nickname: record.nickname,
            phone: record.phone,
            manageStatus: record.manageStatus,
            introduce: record.introduce,
          });
        });
      } else {
        states.title = "新增管理员";
      }
    }
  );

  const { createMessage } = useMessage();
  const instance = getCurrentInstance();
  const emit = instance.emit;

  /**
   * 新增/编辑管理员
   */
  const doSubmit = async () => {
    try {
      await validate();
      const values = getFieldsValue();
      setDialogProps({ confirmLoading: true });
      if (states.userId > 0) {
        await updateUser(states.userId, values)
          .then((res) => {
            createMessage.success(res.message);
            closeDialog();
            emit("success");
          })
          .catch((err) => {
            createMessage.error(err.message);
          });
      } else {
        await addUser(values)
          .then((res) => {
            createMessage.success(res.message);
            closeDialog();
            emit("success");
          })
          .catch((err) => {
            createMessage.error(err.message);
          });
      }
    } finally {
      setDialogProps({ confirmLoading: false });
    }
  };

  return {
    registerForm,
    registerDialog,
    doSubmit,
  };
}
