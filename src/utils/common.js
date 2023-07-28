import JSEncrypt from "./jsencrypt";

// 前端定义的字典
export const PLAT_FORM_MAP = {
  wechat: 1,
  alipay: 2,
  h5: 3,
};

export function getPlatform() {
  // 平台

  let mpType = "";
  // #ifdef MP-WEIXIN
  mpType = PLAT_FORM_MAP.wechat;
  // #endif

  // #ifdef MP-ALIPAY
  mpType = PLAT_FORM_MAP.alipay;
  // #endif

  // #ifdef H5
  mpType = PLAT_FORM_MAP.h5;
  // #endif
  return mpType;
}

export function getCode(str) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCoO+ySg77qo14J2rfBvypESH57ekOSZBeYIfrfU/8iMcjHafZGtk6cRwgLJ7/U+RbYWyufwaRe+2yie96YdA7QlhxJaxRjIpnwWNu5V9S9GtDph3du53jycSbw49wV52/RKGnExOSyyT//sokJtY9OTo3ZwojkkIXO1up5D3i4QIDAQAB"
  );
  return encrypt.encrypt(str);
}

export function group(array, subGroupLength) {
  let index = 0;
  let newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
}
