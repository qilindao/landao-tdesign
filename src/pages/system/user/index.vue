<template>
  <t-card :bordered="false">
    <LdTable @register="registerTable" :columns="columns">
      <template #toolbar>
        <t-button @click="handleAdd" v-auth="'manage.account.store'"
          ><template #icon><AddIcon /></template>新增</t-button
        >
      </template>
      <template #operation="{ row }">
        <TableAction :actions="tableActionFun(row)"></TableAction>
      </template>
    </LdTable>
  </t-card>
  <UserForm @register="registerForm" @success="handleSuccess" />
</template>

<script lang="jsx">
import { defineComponent, ref } from "vue";
import { useTable } from "@/components/Table";
import { AddIcon } from "tdesign-icons-vue-next";
import { useDialog } from "@/components/Dialog";

import { useMessage } from "@/landao/hooks";
import { getUserList } from "@/api/modules/manage/user";
import UserForm from "../components/UserForm";

export default defineComponent({
  name: "UserManage",
  components: {
    AddIcon,
    UserForm,
  },
  setup() {
    const columns = ref([
      {
        colKey: "manageId",
        title: "编号",
        ellipsis: true,
        width: 80,
      },
      {
        colKey: "username",
        title: "用户名",
        fixed: "left",
        align: "left",
        width: 300,
      },
      {
        colKey: "realname",
        title: "真实姓名",
        align: "center",
      },
      {
        colKey: "phone",
        title: "手机号",
        align: "center",
      },
      {
        colKey: "deptName",
        title: "部门",
        align: "center",
        cell: (h, { row }) => {
          return <t-tag variant="light">{row.department?.deptName}</t-tag>;
        },
      },
      {
        colKey: "roleName",
        title: "角色",
        align: "center",
        cell: (h, { row }) => {
          if (row.roles.length <= 0) return "";
          const roleList = row.roles.map((role) => (
            <t-tag>{role.roleName}</t-tag>
          ));
          return <t-space size="small">{roleList}</t-space>;
        },
      },
      {
        colKey: "lastLoginIp",
        title: "最近登录IP",
        align: "center",
      },
      {
        colKey: "lastLoginTime",
        title: "最近登录时间",
        align: "center",
      },
      {
        colKey: "regDate",
        title: "创建时间",
        align: "center",
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
      api: getUserList,
      actionButtons: ["refresh"],
      bordered: true,
      rowKey: "manageId",
    });

    const [registerForm, { openDialog }] = useDialog();

    const tableActionFun = (row) => {
      return [
        {
          label: "编辑",
          auth: ["manage.account.update"],
          ifShow: !row.isSuper,
          onClick: handleEdit.bind(null, row),
        },
        {
          label: "删除",
          theme: "danger",
          auth: "manage.account.destroy",
          ifShow: !row.isSuper,
          popConfirm: {
            content: "此操作将永久删除选中数据，是否继续?",
            onConfirm: handleDel.bind(null, row),
          },
        },
      ];
    };
    const { createMessage } = useMessage();
    const handleSuccess = async () => {
      reload();
    };

    /**
     * 新增菜单
     */
    const handleAdd = () => {
      openDialog(true, {
        userId: 0,
        parentId: 0,
      });
    };

    /**
     * 修改菜单
     * @param {*} record
     */
    const handleEdit = (record) => {
      openDialog(true, {
        record,
        userId: record.manageId,
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
