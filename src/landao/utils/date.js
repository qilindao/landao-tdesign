import dayjs from "dayjs";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
const DATE_FORMAT = "YYYY-MM-DD";

export function formatToDateTime(date, format = DATE_TIME_FORMAT) {
  return dayjs(date).format(format);
}

export function formatToDate(date, format = DATE_FORMAT) {
  return dayjs(date).format(format);
}

export const LAST_7_DAYS = [
    dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  ];
  
  export const LAST_30_DAYS = [
    dayjs().subtract(30, "day").format("YYYY-MM-DD"),
    dayjs().subtract(1, "day").format("YYYY-MM-DD"),
  ];
  /**
   * 时间问候语
   * @param param 当前时间，new Date() 格式
   * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
   * @returns 返回拼接后的时间字符串
   */
  export const formatAxis = (param) => {
    let hour = new Date(param).getHours();
    if (hour < 6) return "凌晨好";
    else if (hour < 9) return "早上好";
    else if (hour < 12) return "上午好";
    else if (hour < 14) return "中午好";
    else if (hour < 17) return "下午好";
    else if (hour < 19) return "傍晚好";
    else if (hour < 22) return "晚上好";
    else return "夜里好";
  };
  /** 格式化时间 */
  export const formatDateStr = (date = null, formate = "YYYY-MM-DD") => {
    return dayjs(new Date(date)).format(formate);
  };

export const dateUtil = dayjs;
