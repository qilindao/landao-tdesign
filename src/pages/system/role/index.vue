<template>
  <t-row :gutter="10">
    <t-col :span="8">
      <t-card :bordered="false">
        <LdTable @register="registerTable" :columns="columns">
          <template #toolbar>
            <t-button @click="handleAdd" v-auth="'manage.role.store'"
              ><template #icon><AddIcon /></template>新增</t-button
            ></template
          >
          <template #operation="{ row }">
            <TableAction :actions="tableActionFun(row)"></TableAction>
          </template>
        </LdTable>
      </t-card>
    </t-col>
    <t-col :span="4">
      <t-card
        :bordered="false"
        :title="
          selectRole.roleName
            ? '角色(' + selectRole.roleName + ')'
            : '未选择角色'
        "
        header-bordered
      >
        <template #actions>
          <t-button
            v-auth="'manage.role.updateRoleAuth'"
            theme="primary"
            @click="handleUpdateAuth"
            :disabled="!selectRole.roleName"
            :loading="saveAuthLoading"
            >{{ saveAuthBtnText }}</t-button
          >
        </template>
        <div v-adaptive>
          <RoleAuth v-model="selectRole.menus" />
        </div> </t-card
    ></t-col>
    <RoleForm @register="registerForm" @success="handleSuccess" />
  </t-row>
</template>

<script>
import { defineComponent, ref, unref } from "vue";
import { useTable } from "@/components/Table";
import { AddIcon } from "tdesign-icons-vue-next";
import { useDialog } from "@/components/Dialog";
import { useMessage } from "@/landao/hooks";
import { useBoolean, useToggle } from "@landao/hooks";
import {
  getRolePage,
  deleteRole,
  updateRoleAuth,
} from "@/api/modules/manage/role";
import RoleForm from "../components/RoleForm";
import RoleAuth from "../components/RoleAuth";

export default defineComponent({
  name: "SysRole",
  components: {
    AddIcon,
    RoleForm,
    RoleAuth,
  },
  setup() {
    const columns = ref([
      {
        colKey: "roleId",
        title: "编号",
        ellipsis: true,
        width: 80,
      },
      {
        colKey: "roleName",
        title: "角色名",
        fixed: "left",
        align: "left",
        width: 300,
      },
      {
        colKey: "createdAt",
        title: "创建时间",
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
      api: getRolePage,
      actionButtons: ["refresh"],
      bordered: true,
      rowKey: "roleId",
    });

    const [registerForm, { openDialog }] = useDialog();

    const tableActionFun = (row) => {
      return [
        {
          label: "编辑",
          auth: ["manage.role.update"],
          ifShow: () => {
            return !row.isDefault;
          },
          onClick: handleEdit.bind(null, row),
        },
        {
          label: "删除",
          theme: "danger",
          auth: "manage.role.destroy",
          ifShow: () => {
            return !row.isDefault;
          },
          popConfirm: {
            content:
              "如果存在关联该角色的用户，请先取消关联在进行删除，删除角色将删除角色关联的所有权限数据，此操作不可逆，是否继续?",
            onConfirm: handleDel.bind(null, row),
          },
        },
        {
          label: "设置权限",
          auth: ["manage.role.update"],
          ifShow: () => {
            return !row.isDefault;
          },
          onClick: handleSetRoleAuto.bind(null, row),
        },
      ];
    };
    const { createMessage } = useMessage();
    const handleSuccess = async () => {
      reload();
    };

    /**
     * 当前选中角色
     */
    const selectRole = ref({});
    const [saveAuthLoading, { setTrue, setFalse }] = useBoolean(false);
    const [saveAuthBtnText, { setLeft, setRight }] = useToggle(
      "保存",
      "更新权限中..."
    );

    const handleUpdateAuth = async () => {
      if (selectRole?.menus && selectRole.menus.length <= 0) {
        createMessage.warning("角色未选择权限");
      } else {
        setTrue();
        setRight();
        try {
          const { roleId, menus } = unref(selectRole);
          await updateRoleAuth(roleId, menus).then((result) => {
            createMessage.success("更新权限成功");
          });
        } catch (error) {
          createMessage.error(error.message);
        } finally {
          setFalse();
          setLeft();
        }
      }
    };

    /**
     * 设置权限
     * @param {*} record
     */
    const handleSetRoleAuto = (record) => {
      selectRole.value = record;
    };

    /**
     * 新增菜单
     */
    const handleAdd = () => {
      openDialog(true, {
        roleId: 0,
      });
    };

    /**
     * 修改菜单
     * @param {*} record
     */
    const handleEdit = (record) => {
      openDialog(true, {
        record,
        roleId: record.roleId,
      });
    };

    async function handleDel(row) {
      await deleteRole(row.roleId)
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
      selectRole,
      saveAuthLoading,
      saveAuthBtnText,
      handleUpdateAuth,
    };
  },
});
</script>

<style scoped></style>
