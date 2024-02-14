export function useEnum(enums) {
  let valueMap = {};
  let labelMap = {};

  function createEnum() {
    Object.keys(enums).forEach((key) => {
      valueMap = [];
      labelMap = {};
      enums.forEach((event) => {
        valueMap[event.value] = event.label;
        labelMap[event.label] = event.value;
      });
    });
  }

  createEnum();

  /**
   * 根据key和值获取label
   * @param {string|number} value 值
   * @returns
   */
  function getLabelByValue(value) {
    return valueMap[value] ?? "";
  }

  function getValueByLabel(label) {
    return labelMap[label] ?? "";
  }

  return {
    getLabelByValue,
    getValueByLabel,
  };
}
