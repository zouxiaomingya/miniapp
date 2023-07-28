import { getPlatform, PLAT_FORM_MAP } from "@utils/common";
const zoumingMacHost = "http://192.168.1.106:8080";
const chencongMacHost = "http://192.168.20.11:8080";
const caifangxiongHost = "http://192.168.20.10:8080";
const xiecongHost = "http://192.168.1.124:8080";
const fangruiHost = "http://192.168.20.9:8080";

const devHost = "http://10.20.113.206:8200";

const prodHost = "https://icity.yunshangnc.com";
let host = prodHost;

if (process.env.NODE_ENV === "development") {
  // host = devHost;
  if (getPlatform() === PLAT_FORM_MAP.h5) {
    host = "/api";
  }
}
console.log(`当前环境：${process.env.NODE_ENV}，当前服务地址：${host}`);

// 根据情况调整
export const defaultHost = host;
export { prodHost };
