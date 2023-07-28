import { defaultHost } from "../constant/operate";
import storage from "@utils/storage";
import { jumpLoginPage } from "@utils/open-uniapp-page";
import store from "../../store";
export const getFullUrl = (_url) => {
  return `${defaultHost}${_url}`;
};

export const request = (params) => {
  return new Promise((resolve, reject) => {
    let { url, type, data = {}, isNeedToken = true, header, ...rest } = params;
    const tempData = { ...data };
    if (isNeedToken) {
      header.Authorization = `${storage.get("token_type")} ${storage.get(
        "token"
      )}`;
    }
    const fullUrl = getFullUrl(url);
    uni.request({
      url: fullUrl,
      data,
      header,
      method: type,
      ...rest,
      success: (res = {}) => {
        uni.hideLoading();
        const { data = {}, statusCode } = res;

        // statusCode 开发者服务器返回的 HTTP 状态码
        if (statusCode !== 200) {
          uni.showToast({
            title: "网络繁忙，请稍后重试～",
            icon: "none",
          });
          console.error(`错误接口:${url}, 错误问题:`, data, "入参:", tempData);
          return reject(data);
        }

        // 无状态码
        if (!data.code) {
          uni.showToast({
            title: "网络繁忙，请稍后重试～",
            icon: "none",
          });
          return reject(data);
        }
        // 后端统一规则， code === 200 接口调用成功
        // success true 是判断业务是否执行成功
        if (+data.code === 200) {
          if (!data.success) {
            console.error(
              `错误接口:${url}, 错误问题:`,
              data,
              "入参:",
              tempData
            );
            reject(data);
            return uni.showToast({
              title: data.message || "网络繁忙，请稍后重试～",
              icon: "none",
            });
          }
          return resolve(data.data);
        }
        let msgTitle = "";
        if (+data.code === 401 || +data.code === 402 || +data.code === 403) {
          store.commit("user/REMOVE_TOKEN");
          msgTitle = "登录态异常，请重新登录";
          setTimeout(() => {
            jumpLoginPage("", {});
          }, 300);
        } else {
          // 其他的状态码 在继续增加
          msgTitle = data.message || "网络繁忙，请稍后重试～";
        }
        if (msgTitle) {
          uni.showToast({
            title: msgTitle,
            icon: "none",
          });
        }
        console.error(`错误接口:${url}, 错误问题:`, data, "入参:", tempData);
        return reject(data);
      },
      //请求失败
      fail: (e = {}) => {
        uni.showToast({
          title: "网络繁忙，请稍后重试～",
          icon: "none",
        });
        return reject(e.data);
      },
    });
  });
};

const { deviceType, deviceBrand, deviceModel, hostName, osName, osVersion } =
  uni.getSystemInfoSync();
const equipment = `deviceType:${deviceType},deviceBrand:${deviceBrand},deviceModel:${deviceModel},osNameAndVersion:${osName}-${osVersion},hostName:${hostName},`;

const apiByType =
  (type) =>
  (url) =>
  (option = {}) => {
    const {
      data = {},
      showLoading = false,
      loadingText = "加载中...",
      header,
      timeout = 6000,
      ...rest
    } = option;

    let _header = {};
    // 过滤 null、undefined、string的undefined、NaN的字段
    Object.keys(data).forEach((key) => {
      const val = data[key];
      if (
        val === null ||
        val === undefined ||
        val === "undefined" ||
        (typeof val === "number" && isNaN(val))
      ) {
        delete data[key];
      }
    });
    if (type == "GET") {
      _header["content-type"] = "application/x-www-form-urlencoded";
    } else {
      _header["content-type"] = "application/json";
    }

    if (showLoading) {
      // #ifdef MP-ALIPAY
      uni.showLoading();
      // #endif
      // #ifndef MP-ALIPAY
      uni.showLoading({
        title: "加载中...",
        mask: true, // 显示透明蒙层，防止触摸穿透
      });
      // #endif
    }

    return request({
      type,
      url,
      data,
      header: { equipment, ..._header, ...header },
      ...rest,
    });
  };

export const getApi = apiByType("GET");
export const postApi = apiByType("POST");
export default request;
