// 获取常用时间
import dayjs from "dayjs";

export const LAST_7_DAYS = [
  dayjs().subtract(7, "day").format("YYYY-MM-DD"),
  dayjs().subtract(1, "day").format("YYYY-MM-DD"),
];

export const LAST_30_DAYS = [
  dayjs().subtract(30, "day").format("YYYY-MM-DD"),
  dayjs().subtract(1, "day").format("YYYY-MM-DD"),
];
/** 格式化时间 */
export const formatDateStr = (date = null, formate = "YYYY-MM-DD") => {
  return dayjs(new Date(date)).format(formate);
};
export const dateUtil = dayjs;
