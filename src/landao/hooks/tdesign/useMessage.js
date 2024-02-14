import { MessagePlugin, NotifyPlugin, DialogPlugin } from "tdesign-vue-next";

/**
 * 消息
 * @param {String} message
 */
const createInfoMsg = (message) => {
  MessagePlugin.info(message);
};
/**
 * 失败
 * @param {String} message
 */
const createErrorMsg = (message) => {
  MessagePlugin.error(message);
};
/**
 * 警示
 * @param {String} message
 */
const createWarningMsg = (message) => {
  MessagePlugin.warning(message);
};
/**
 * 加载中
 * @param {String} message
 */
const createLoagingMsg = (message) => {
  MessagePlugin.loading(message);
};
/**
 * 成功
 * @param {String} message
 */
const createSuccessMsg = (message) => {
  MessagePlugin.success(message);
};
/**
 * 询问
 * @param {String} message
 */
const createQuestionMsg = (message) => {
  MessagePlugin.question(message);
};
/** 关闭所有提示 */
const cloaseAllMessage = () => {
  MessagePlugin.closeAll();
};
/**
 * 消息通知
 * @param {String} title 标题
 * @param {String} content 自定义内容
 */
const createInfoNotify = (title, content = "") => {
  NotifyPlugin.info({ title, content });
};
/**
 * 警示通知
 * @param {String} title 标题
 * @param {String} content 自定义内容
 */
const createWarningNotify = (title, content = "") => {
  NotifyPlugin.warning({ title, content });
};
/**
 * 成功通知
 * @param {String} title 标题
 * @param {String} content 自定义内容
 */
const createSuccessNotify = (title, content = "") => {
  NotifyPlugin.success({ title, content });
};
/**
 * 失败通知
 * @param {String} title 标题
 * @param {String} content 自定义内容
 */
const createErrorNotify = (title, content = "") => {
  NotifyPlugin.error({ title, content });
};
/** 关闭所有消息通知 */
const cloaseAllNotify = () => {
  NotifyPlugin.closeAll();
};
export function useMessage() {
  return {
    createMessage: MessagePlugin,
    createInfoMsg,
    createErrorMsg,
    createWarningMsg,
    cloaseAllMessage,
    createLoagingMsg,
    createSuccessMsg,
    createQuestionMsg,
    craeteNotify: NotifyPlugin,
    createInfoNotify,
    createWarningNotify,
    createSuccessNotify,
    createErrorNotify,
    cloaseAllNotify,
    createMsgBox: DialogPlugin,
  };
}
