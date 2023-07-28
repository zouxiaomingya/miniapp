import { getFullUrl } from "@utils/request";
import store from "../../store";
import storage from "@utils/storage";
import { version } from "../../package.json";
import { LOGGER_NAME } from "@constant/storageKey";

const logUrl = "/api/buried/point/up";
const logger = (params, isClearStorage) => {
  const isTokenValid = store.getters["user/isTokenValid"];

  if (params) {
    storage.set(LOGGER_NAME, params);
  }
  if (!isTokenValid) return;

  const cacheParams = storage.get(LOGGER_NAME);
  const userInfo = store.state.user.userInfo;
  const { uuid, phoneExt } = userInfo;
  const {
    address,
    name,
    buriedId,
    moduleId,
    eventId,
    param,
    residenceTimeOfApplication,
    buriedPointType = "click",
  } = params || cacheParams;
  const timestamp = +new Date();
  const next = (obj = {}) => {
    const { longitude, latitude } = obj;
    const config = {
      param,
      longitude,
      latitude,
      appKey: "iNC",
      buriedPointType,
      uuid,
      timestamp,
      telphone: phoneExt,
      phoneModel: uni.getSystemInfoSync().model,
      jumpPageUrl: address,
      jumpApplicationName: name,
      applicationVersionNumber: version,
      applicationId: buriedId,
      moduleId,
      eventId,
      residenceTimeOfApplication,
      // #ifdef MP-WEIXIN
      clientType: "wx",
      // #endif
      // #ifdef MP-ALIPAY
      clientType: "alipay",
      // #endif
    };

    // 过滤 null、undefined、string的undefined、NaN的字段
    Object.keys(config).forEach((key) => {
      const val = config[key];
      if (
        val === null ||
        val === undefined ||
        val === "undefined" ||
        (typeof val === "number" && isNaN(val))
      ) {
        delete config[key];
      }
    });

    uni.request({
      url: getFullUrl(logUrl),
      method: "POST",
      timeout: 6000,
      header: {
        "content-type": "application/json",
        Authorization: `${storage.get("token_type")} ${storage.get("token")}`,
      },
      data: config,
      success: () => {
        if (isClearStorage) {
          storage.removeAsync(LOGGER_NAME);
        }
      },
      complete: (result) => {
      },
    });
  };
  uni.getLocation({
    geocode: true,
    // highAccuracyExpireTime: 3000,
    success: (res) => {
      // // 将自己需要的数据存起来
      // this.position.longitude = res.longitude; // 经度
      // this.position.latitude = res.latitude; // 纬度
      // this.position.city = res.address.city;
      // this.position.district = res.address.district;
      next(res);
    },
    fail: (err) => {
      next();
    },
  });
};

export default logger;
