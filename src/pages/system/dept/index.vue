<template>
  <t-card :bordered="false">
    <LdTable
      @register="registerTable"
      :columns="columns"
      :pagination="false"
      :isTreeTable="true"
    >
      <template #toolbar>
        <t-button @click="handleAdd" v-auth="'manage.dept.store'"
          ><template #icon><AddIcon /></template>新增</t-button
        ></template
      >
      <template #operation="{ row }">
        <TableAction :actions="tableActionFun(row)"></TableAction>
      </template>
    </LdTable>
    <DeptForm @register="registerForm" @success="handleSuccess" />
  </t-card>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useTable } from "@/components/Table";
import { AddIcon } from "tdesign-icons-vue-next";
import { useDialog } from "@/components/Dialog";
import { useMessage } from "@/landao/hooks";
import { getDeptList } from "@/api/modules/manage/dept";
import { deepTree } from "@/landao/utils";
import { cloneDeep, isNil } from "lodash-es";
import DeptForm from "../components/DeptForm";

export default defineComponent({
  name: "DeptManage",
  components: {
    AddIcon,
    DeptForm,
  },
  setup() {
    const deptList = ref([]);

    const columns = ref([
      {
        colKey: "deptId",
        title: "编号",
        ellipsis: true,
        width: 80,
      },
      {
        colKey: "deptName",
        title: "部门名",
        fixed: "left",
        align: "left",
        width: 300,
      },
      {
        title: "备注",
        align: "center",
        colKey: "deptDesc",
      },
      {
        title: "排序",
        align: "center",
        colKey: "deptOrder",
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
      api: getDeptList,
      actionButtons: ["refresh"],
      bordered: true,
      rowKey: "deptId",
      tree: {
        treeNodeColumnIndex: 1,
      },
      afterFetch: (data) => {
        deptList.value = cloneDeep(data);
        return deepTree(data, "deptId", "parentId", "deptOrder");
      },
    });

    const [registerForm, { openDialog }] = useDialog();

    const tableActionFun = (row) => {
      return [
        {
          label: "新增下级部门",
          auth: ["manage.dept.store"],
          onClick: handleAddSub.bind(null, row),
        },
        {
          label: "编辑",
          auth: ["manage.dept.update"],
          onClick: handleEdit.bind(null, row),
        },
        {
          label: "删除",
          theme: "danger",
          auth: "manage.dept.destroy",
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
      reload();
    };

    /**
     * 新增菜单
     */
    const handleAdd = () => {
      openDialog(true, {
        deptId: 0,
        parentId: 0,
        deptList: deptList.value,
      });
    };

    /**
     * 新增下级菜单
     */
    const handleAddSub = (row) => {
      openDialog(true, {
        deptId: 0,
        deptList: deptList.value,
        parentId: row.deptId,
      });
    };

    /**
     * 修改菜单
     * @param {*} record
     */
    const handleEdit = (record) => {
      openDialog(true, {
        record,
        deptId: record.deptId,
        parentId: 0,
        deptList: deptList.value,
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
