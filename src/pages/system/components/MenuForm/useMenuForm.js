import { reactive, getCurrentInstance } from "vue";
import { useDialogInner } from "@/components/Dialog";
import { useForm } from "@/components/Form";
import { getAuthPower, updateMenu, addMenu } from "@/api/modules/system/menu";
import { useMessage } from "@/landao/hooks";
import { MENU_TYPE, MENU_TYPE_OPTIONS } from "../../constants";
import { deepTree } from "@/landao/utils";
import { cloneDeep } from "lodash-es";

export function useMenuFormStates() {
  return reactive({
    menuId: 0,
    title: "新增菜单/权限",
  });
}
export function useMenuForm(states) {
  //获取视图路径
  const isDir = (type) => parseInt(type) === MENU_TYPE.DIR;
  const isMenu = (type) => parseInt(type) === MENU_TYPE.MENU;
  const isButton = (type) => parseInt(type) === MENU_TYPE.BUTTON;

  function getFormSchema() {
    return [
      {
        field: "type",
        component: "RadioGroup",
        label: "节点类型",
        defaultValue: 0,
        componentProps: {
          options: MENU_TYPE_OPTIONS,
        },
      },
      {
        field: "title",
        label: "菜单名称",
        component: "Input",
        required: true,
        defaultValue: "",
        colProps: {
          span: 12,
        },
        componentProps: {
          placeholder: "请输入菜单名称",
        },
      },
      {
        field: "name",
        label: "节点路由名",
        component: "Input",
        required: true,
        defaultValue: "",
        colProps: {
          span: 12,
        },
        componentProps: {
          placeholder: "请输入唯一英文字符串",
        },
      },
      {
        field: "path",
        label: "节点路由",
        required: true,
        component: "Input",
        defaultValue: "",
        ifShow: ({ values }) => {
          return isMenu(values.type);
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
            value: "menuId",
            label: "title",
          },
          data: [],
        },
      },
      {
        field: "keepAlive",
        label: "keep-alive",
        required: true,
        component: "Switch",
        defaultValue: true,
        colProps: {
          span: 12,
        },
        ifShow: ({ values }) => {
          return isMenu(values.type);
        },
      },
      {
        field: "hidden",
        label: "显示状态",
        required: true,
        component: "Switch",
        colProps: {
          span: 12,
        },
        defaultValue: false,
        ifShow: ({ values }) => {
          return isMenu(values.type);
        },
        componentProps: {
          label: ["隐藏", "显示"],
        },
      },
      {
        field: "component",
        label: "文件路径",
        required: true,
        defaultValue: "LAYOUT",
        component: "Input",
        showIndex: true,
        helpMessage: [
          "文件路径视图",
          "非具体页面路由，默认提供了LAYOUT、BLANK和IFRAME",
          "顶级目录：LAYOUT",
          "有三级菜单，二级设置：BLANK",
          "忽略pages/目录和.vue后缀",
        ], //标签名右侧温馨提示
        ifShow: ({ values }) => {
          return isMenu(values.type) || isDir(values.type);
        },
      },
      {
        field: "icon",
        label: "节点图标",
        defaultValue: "",
        slot: "menuIconSlot",
        ifShow: ({ values }) => {
          return isDir(values.type);
        },
      },
      {
        field: "authCode",
        label: "权限标识",
        required: true,
        component: "ApiSelect",
        defaultValue: "",
        componentProps: {
          placeholder: "请选择权限标识",
          api: getAuthPower,
          immediate: false,
          filterable: true,
          clearable: true,
        },
        ifShow: ({ values }) => {
          return isButton(values.type);
        },
      },
      {
        field: "orderNo",
        label: "排序",
        component: "InputNumber",
        defaultValue: 0,
        componentProps: {
          controlsPosition: "right",
          min: 0,
        },
        ifShow: ({ values }) => {
          return !isButton(values.type);
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
   * 设置上级菜单
   * @param {Array} menuData
   */
  const updateParentMenuList = async (menuData) => {
    let _list = [];
    cloneDeep(menuData).forEach((item) => {
      item["title"] = item["meta"]["title"];
      _list.push(item);
    });
    let menuList = _list.filter((item) => !isButton(item.type));
    menuList.unshift({
      menuId: 0,
      title: "顶级菜单",
    });
    await updateSchema({
      field: "parentId",
      componentProps: {
        data: deepTree(menuList, "menuId", "parentId", "orderNo"),
      },
    });
  };

  const [registerDialog, { setDialogProps, closeDialog }] = useDialogInner(
    async (data) => {
      resetFields();
      setDialogProps({ confirmLoading: false });
      states.menuId = data?.menuId;
      if (data?.menuList) {
        updateParentMenuList(data?.menuList);
      }
      if (states.menuId > 0) {
        states.title = "编辑菜单/权限";
        const { record } = data;
        await setFieldsValue({
          type: record.type,
          title: record.meta.title,
          name: record.name,
          parentId: record.parentId,
          keepAlive: record.meta.keepAlive,
          hidden: record.meta.hidden,
          component: record.component,
          icon: record.meta.icon,
          path: record.path,
          authCode: record.authCode,
          orderNo: record.meta.orderNo,
        });
      } else {
        states.title = "新增菜单/权限";
        //上级节点存在的情况，设置上级菜单
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
      if (states.menuId > 0) {
        await updateMenu(states.menuId, values)
          .then((res) => {
            createMessage.success(res.message);
            closeDialog();
            emit("success");
          })
          .catch((err) => {
            createMessage.error(err.message);
          });
      } else {
        await addMenu(values)
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
