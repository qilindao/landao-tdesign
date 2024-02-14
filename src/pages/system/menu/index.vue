<template>
  <t-card :bordered="false">
    <LdTable
      @register="registerTable"
      :columns="columns"
      :pagination="false"
      :isTreeTable="true"
    >
      <template #toolbar>
        <t-button @click="handleAdd" v-auth="'manage.menu.store'"
          ><template #icon><AddIcon /></template>新增</t-button
        ></template
      >
      <template #operation="{ row }">
        <TableAction :actions="tableActionFun(row)"></TableAction>
      </template>
    </LdTable>
    <MenuForm @register="registerForm" @success="handleSuccess" />
  </t-card>
</template>

<script lang="jsx">
import { defineComponent, ref } from "vue";
import { useTable } from "@/components/Table";
import { getMenuList, deleteMenu } from "@/api/modules/system/menu";
import { AddIcon } from "tdesign-icons-vue-next";
import { MENU_TYPE, MENU_TYPE_OPTIONS } from "../constants";
import { useEnum } from "@/landao/enums";
import { deepTree } from "@/landao/utils";
import MenuForm from "../components/MenuForm";
import { useDialog } from "@/components/Dialog";
import { cloneDeep, isNil } from "lodash-es";
import { useMessage } from "@/landao/hooks";
import { getPermissionStore } from "@/store";

export default defineComponent({
  name: "SysMenu",
  components: {
    MenuForm,
    AddIcon,
  },
  setup() {
    const { getLabelByValue } = useEnum(MENU_TYPE_OPTIONS);

    const menuList = ref([]);

    const columns = ref([
      {
        colKey: "menuId",
        title: "编号",
        ellipsis: true,
        width: 80,
      },
      {
        colKey: "title",
        title: "标题",
        fixed: "left",
        align: "left",
        width: 300,
        cell: (h, { row }) => {
          return row.meta.title;
        },
      },
      {
        colKey: "name",
        title: "名称",
        width: 200,
      },
      {
        colKey: "type",
        title: "类型",
        width: 120,
        cell: (h, { row }) => {
          return (
            <t-tag theme="success" variant="light">
              {getLabelByValue(row.type)}
            </t-tag>
          );
        },
      },
      {
        title: "组件路径",
        width: 200,
        align: "center",
        colKey: "component",
      },
      {
        title: "路由路径",
        width: 200,
        align: "center",
        colKey: "path",
      },
      {
        title: "按钮权限",
        width: 200,
        align: "center",
        colKey: "authCode",
        cell: (h, { row }) => {
          return row.authCode !== "" ? (
            <t-tag theme="danger" variant="light">
              {row.authCode}
            </t-tag>
          ) : (
            ""
          );
        },
      },
      {
        colKey: "keepAlive",
        title: "keep-alive",
        width: 130,
        align: "center",
        cell: (h, { row }) => {
          return (
            <t-tag
              theme={row.meta.keepAlive ? "success" : "danger"}
              variant="light"
            >
              {row.meta.keepAlive ? "是" : "否"}
            </t-tag>
          );
        },
      },
      {
        colKey: "orderNo",
        title: "排序",
        cell: (h, { row }) => {
          return row.meta.orderNo;
        },
      },
      {
        colKey: "operation",
        title: "操作",
        align: "center",
        width: 200,
        fixed: "right",
      },
    ]);

    const [registerTable, { reload }] = useTable({
      api: getMenuList,
      actionButtons: ["refresh"],
      bordered: true,
      rowKey: "menuId",
      tree: {
        treeNodeColumnIndex: 1,
      },
      afterFetch: (data) => {
        menuList.value = cloneDeep(data);
        return deepTree(data);
      },
    });

    const [registerForm, { openDialog }] = useDialog();

    const tableActionFun = (row) => {
      return [
        {
          label: "新增下级菜单",
          ifShow: parseInt(row.type) != MENU_TYPE.BUTTON,
          auth: ["manage.menu.store"],
          onClick: handleAddSub.bind(null, row),
        },
        {
          label: "编辑",
          auth: ["manage.menu.update"],
          onClick: handleEdit.bind(null, row),
        },
        {
          label: "删除",
          theme: "danger",
          auth: "manage.menu.destroy",
          ifShow: isNil(row.children),
          popConfirm: {
            content: "此操作将永久删除选中数据，是否继续?",
            onConfirm: handleDel.bind(null, row),
          },
        },
      ];
    };
    const { createMessage } = useMessage();
    const handleSuccess = async () => {
      await getPermissionStore().buildAsyncRoutes();
      reload();
    };

    /**
     * 新增菜单
     */
    const handleAdd = () => {
      openDialog(true, {
        menuId: 0,
        parentId: 0,
        menuList: menuList.value,
      });
    };

    /**
     * 新增下级菜单
     */
    const handleAddSub = (row) => {
      openDialog(true, {
        menuId: 0,
        menuList: menuList.value,
        parentId: row.menuId,
      });
    };

    /**
     * 修改菜单
     * @param {*} record
     */
    const handleEdit = (record) => {
      openDialog(true, {
        record,
        menuId: record.menuId,
        parentId: 0,
        menuList: menuList.value,
      });
    };

    async function handleDel(row) {
      await deleteMenu(row.menuId)
        .then((res) => {
          createMessage.success(res.message);
          reload();
        })
        .catch((err) => {
          createMessage.error(err);
        });
    }

    return {
      registerTable,
      columns,
      handleAdd,
      handleSuccess,
      registerForm,
      tableActionFun,
    };
  },
});
</script>

<style scoped></style>
