import { provide, inject } from "vue";

const key = Symbol("ld-basic-table");

/**
 * 无论组件层次结构多深，父组件都作为其所有子组件的数据依赖提供者
 * @param {*} instance
 */
export function createTableContext(instance) {
  provide(key, instance);
}
/**
 * 子组件使用父组件数据
 * @returns
 */
export function useTableContext() {
  return inject(key);
}
