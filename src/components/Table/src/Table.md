# Table 表格

对 `TDesign` 的 `t-table` 组件进行封装

:::tip 写在前面
- LdTable 是从 [Vben Admin](https://vvbin.cn/doc-next/) 迁移过来
- Vue-Vben-Admin 是一个基于 Vue3.0、Vite、 Ant-Design-Vue、TypeScript 的后台解决方案
:::

## 使用

```vue
<template>
  <LdTable @register="registerTable">
      <template #operate="{ row, rowIndex, colIndex }">
        <TableAction :actions="tableActionFun(row, rowIndex)"></TableAction>
      </template>
    </LdTable>
</template>

<script lang="jsx">
import { computed, defineComponent, reactive, toRefs, nextTick } from "vue";
import {
  getTeacherEduList,
  doUpdateTeacherEdu,
  doAddTeacherEdu,
  doDeleteEdu,
} from "@/api/teacher";
import { useMessage } from "@/landao/hooks";
import { useDialogInner } from "@/components/Dialog";
import { Input, Select, DateRangePicker } from "tdesign-vue-next";
import { useTable } from "@/components/Table";
import { useUserStore } from "@/store";

export default defineComponent({
  name: "TeacherEdu",
  setup() {
    const { dictionary } = useUserStore();
    const { createMessage } = useMessage();
    const columns = computed(() => [
      {
        title: "起止年月",
        colKey: "dates",
        align: "center",
        width: 300,
        cell: (h, { row }) => {
          return row.dates.join(" 至 ");
        },
        edit: {
          component: DateRangePicker,
          props: {
            placeholder: ["开始年月", "结束年月"],
            mode: "month",
            clearable: true,
            allowInput: true,
          },
          rules: [{ required: true, message: "请选择起止年月" }],
          showEditIcon: false,
        },
      },
      {
        title: "就读学校",
        colKey: "school_name",
        align: "center",
        edit: {
          component: Input,
          props: {
            clearable: true,
            allowInput: true,
          },
          rules: [
            { required: true, message: "不能为空" },
            { max: 50, message: "字符数量不能超过 50", type: "warning" },
          ],
          showEditIcon: false,
        },
      },
      {
        title: "专业",
        colKey: "discipline_name",
        align: "center",
        edit: {
          component: Input,
          props: {
            clearable: true,
            allowInput: true,
          },
          rules: [
            { required: true, message: "不能为空" },
            { max: 50, message: "字符数量不能超过 50", type: "warning" },
          ],
          showEditIcon: false,
        },
      },
      {
        title: "学历/学位",
        colKey: "edu_code",
        align: "center",
        cell: (h, { row }) =>
          dictionary?.educational_level.find((t) => t.value === row.edu_code)
            ?.label,
        edit: {
          component: Select,
          props: {
            clearable: true,
            autoWidth: true,
            options: dictionary?.educational_level ?? [],
          },
          // 校验规则，此处同 Form 表单
          rules: [{ required: true, message: "不能为空" }],
          showEditIcon: false,
        },
      },
      {
        title: "操作栏",
        colKey: "operate",
        align: "center",
        width: 150,
      },
    ]);

    const [
      registerTable,
      {
        reload,
        setCurrentSaveId,
        getEditableKeysMap,
        onCancelEditRow,
        getIsEditable,
        updateEditState,
        getCurrentSaveId,
        onEditRow,
        validateRowData,
        updateRowByIdx,
        deleteRowByIdx,
      },
    ] = useTable({
      api: getTeacherEduList,
      columns: columns,
      bordered: true,
      rowKey: "edu_id",
      pagination: false,
      immediate: false,
      afterFetch: (data) => {
        let dataSource = [];
        if (data.length > 0) {
          data.forEach((item) => {
            dataSource.push({
              edu_id: item.edu_id,
              dates: [item.start_date, item.end_date],
              school_name: item.school_name,
              discipline_name: item.discipline_name,
              edu_code: item.edu_code,
            });
          });
        }
        return dataSource;
      },
    });

    /**
     * 更新表格数据
     * @param {*} e
     */
    const onSave = (id) => {
      setCurrentSaveId(id);
      validateRowData(id).then(async (params) => {
        if (params.trigger === "parent" && !params.result.length) {
          const current = getEditableKeysMap();
          if (current) {
            const dates = {
              start_date: current.editedRow.dates[0],
              end_date: current.editedRow.dates[1],
            };
            await doUpdateTeacherEdu(id, {
              ...current.editedRow,
              ...dates,
            })
              .then((res) => {
                if (res.code == 200) {
                  //更新
                  updateRowByIdx(current.rowIndex, current.editedRow);
                  createMessage.success("更新成功");
                }
              })
              .catch((err) => {
                createMessage.error(err.message);
              });
          }
          updateEditState(getCurrentSaveId());
        }
      });
    };

    /**
     * 删除
     * @param {Object} row
     */
    const onDelete = async (row, rowIndex) => {
      const { work_id } = row;
      await doDeleteEdu(states.teacherId, work_id)
        .then((result) => {
          if (result.code == 200) {
            deleteRowByIdx(rowIndex);
            createMessage.success("删除成功");
          } else {
            createMessage.warning(result.message);
          }
        })
        .catch((err) => {
          createMessage.error(err.message);
        });
    };

    const states = reactive({
      teacherId: 0,
      title: "教育经历",
    });

    const [registerDialog] = useDialogInner(async (data) => {
      if (data?.teacherId) {
        states.teacherId = data.teacherId ?? 0;
        await reload({
          searchInfo: {
            tid: data?.teacherId,
          },
        });
        if (data.teacherName) states.title = `${data.teacherName} 教育经历`;
      }
    });

    const tableActionFun = (record, rowIndex) => {
      const editable = getIsEditable(record.edu_id);
      if (!editable) {
        return [
          {
            label: "编辑",
            onClick: onEditRow.bind(null, record.edu_id),
          },
          {
            label: "删除",
            theme: "danger",
            popConfirm: {
              content: "确认删除吗?删除后不可恢复",
              onConfirm: onDelete.bind(null, record, rowIndex),
            },
          },
        ];
      }
      return [
        {
          label: "保存",
          onClick: onSave.bind(null, record.edu_id),
        },
        {
          label: "取消",
          popConfirm: {
            content: "是否取消编辑",
            onConfirm: onCancelEditRow.bind(null, record.edu_id),
          },
        },
      ];
    };

    return {
      ...toRefs(states),
      registerDialog,
      registerTable,
      tableActionFun,
    };
  },
});
</script>
```

## Table 属性

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| api | `(...arg) => Promise<any>` | - | - | 请求接口，可以直接将src/api内的函数直接传入 |
| size | `string` | `small` | `small/medium/large` | 根据业务状态控制当前是否显示 |
| columns | `array` | `[]` | - | 	表单列信息，详见[Table-column](#table-column-属性) |
| pagination | `boolean` | `true` | - | 是否显示分页，分页配置,详见[t-pagination](https://tdesign.tencent.com/vue-next/components/pagination?tab=api) |
| emptyDesc | `string` | `暂无数据` | - | 数据为空展示 |
| rowKey | `string` | `` | - | 表格数据pk |
| afterFetch | `Function` | `` | - | 请求之后对返回值进行处理 |
| searchInfo  | `object` | `{}` | - | 额外的请求参数 |
| bordered | `boolean` | `true` | - | 是否显示边框 |
| stripe | `boolean` | `true` | - | 是否显示斑马线 |
| showIndexColumn | `boolean` | `false` | - | 是否显示序号,默认不显示 |
| immediate | `boolean` | `true` | - | 是否立即请求接口 |
| dataSource | `array` | `[]` | - | 表格数据，非 api 加载情况 |



## TableColumn 属性
> `Table-column 属性`全部继承于`t-table BaseTableCol属性`
见[Table-column 属性](https://tdesign.tencent.com/vue-next/components/table?tab=api#basetablecol)


### TableColumn 额外属性

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| auth | `array` | - | - | 权限校验 |
| ifShow | `boolean|((action) => boolean)` | - |  - | 根据业务状态控制当前是否显示 |

## TableAction 组件

用于表格右侧操作列渲染

### Props 

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| actions | `Array` | - | - | 	右侧操作列按钮列表，详见下方[action 属性](#actions-属性) |
| dropDownActions | `Object` | - |  - | 下拉菜单，详见下方[dropDownActions](#dropdownactions-下拉菜单属性) |

### actions 属性

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| label | `String` | - | - | 名称 |
| auth | `String/Array` | - |  - | 权限标识 |
| icon | `String` | - |  - | 按钮图标，详见[IconSvg](/frontend/components/IconSvg) |
| type | `String` | - |  - | 按钮类型，详见`el-button` |
| ifShow | `boolean\|((action) => boolean)` | - |  - | 根据业务状态控制当前是否显示 |
| tooltip | `String\|TTooltipProps` | - |  - | 按钮是否显示文字提示，传提示内容，或者[`TTooltipProps`所有配置](https://tdesign.tencent.com/vue-next/components/tooltip?tab=api) |
| popConfirm | `TPopconfirm ` | - |  - | 气泡确认框，属性详见[`t-popconfirm`所有配置](https://tdesign.tencent.com/vue-next/components/popconfirm?tab=api) |
| onClick | `Fn` | - |  - | 按钮事件 |

### dropDownActions 下拉菜单属性

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- | --- |
| label | `String` | - | - | 下拉菜单名，有传，文字后面自动加上`ArrayDown`图标，没有传。显示三个原点图标 |
| buttons | `Array` | - |  - | 下拉操作组，详见[dropDownItem](#dropdownitem-属性) |

### dropDownItem 属性

::: warning 注意

`command` 指令要传递对象，要告诉`@command`回传的当前操作的表格数据，和操作类型。

:::

```js
{
        label: "更多",
        buttons: [
          {
            label: "教育经历",
            auth: ["organ.teacher.edu.index"],
            command: { action: "edu", row },
          },
          {
            label: "工作经历",
            auth: ["organ.teacher.work.index"],
            command: { action: "work", row },
          },
        ],
      }
```
### dropDownActions 事件

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| command | 点击菜单项触发的事件回调 | dropdown-item 的指令 |


