/* 常量层 */


// 标签类型
// 通知的优先级对应的标签类型
export const NOTIFICATION_TYPES = new Map([
  ['low', 'primary'],
  ['middle', 'warning'],
  ['high', 'danger'],
]);

// 通用请求头
export const ContentTypeEnum = {
  Json: "application/json;charset=UTF-8",
  FormURLEncoded: "application/x-www-form-urlencoded;charset=UTF-8",
  FormData: "multipart/form-data;charset=UTF-8",
};
