import { ref } from "vue";
import CryptoJS from "@/landao/utils/crypto";
import { useUserStore } from "@/store";

export function useCryptoJSRow(
  defaultValue = {},
  defaultKey = [],
  defaultAesKey = "",
  options
) {
  const DefaultOptions = {
    mode: "encrypt",
    valueType: "string",
    onSuccess: () => {},
  };

  const finalOptions = { ...DefaultOptions, ...options };
  const { mode, onSuccess } = finalOptions;

  //用户token
  const { token } = useUserStore();
  //机密key
  const aesKey = defaultAesKey === "" ? token : defaultAesKey;

  const refValue = ref({});
  let aesValue = {};

  //设置值
  const setValue = (value) => {
    refValue.value = value;
    aesValue = value;
  };

  function decrypt() {
    let list = [];
    if (defaultValue instanceof Array) {
      for (const item of defaultValue) {
        for (const [key, value] of Object.entries(item)) {
          item[key] = defaultKey.includes(key)
            ? CryptoJS.aesDecrypt(value, aesKey)
            : value;
        }
        list.push(item);
      }
      setValue(list);
      onSuccess(list, { mode });
    } else {
      for (let [key, value] of Object.entries(defaultValue)) {
        defaultValue[key] = defaultKey.includes(key)
          ? CryptoJS.aesDecrypt(value, aesKey)
          : value;
      }
      setValue(defaultValue);
      onSuccess(defaultValue, { mode });
    }
  }

  function encrypt() {
    let encryptData = {};
    defaultKey.forEach((val) => {
      if (defaultValue[val] && defaultValue[val] != "") {
        encryptData[val] = CryptoJS.aesEncrypt(defaultValue[val], aesKey);
      }
    });

    setValue(encryptData);
    onSuccess(encryptData, { mode });
  }

  //对数组或对象进行解密
  if (mode === "decrypt") {
    decrypt();
  }

  //对字符串加密
  if (mode === "encrypt") {
    encrypt();
  }

  return {
    refValue,
    aesValue,
  };
}
