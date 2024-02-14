export const isObject = (value) => value !== null && typeof value === "object";
// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value) => typeof value === "function";
export const isString = (value) => typeof value === "string";
export const isBoolean = (value) => typeof value === "boolean";
export const isNumber = (value) => typeof value === "number";
export const isUndef = (value) => typeof value === "undefined";
