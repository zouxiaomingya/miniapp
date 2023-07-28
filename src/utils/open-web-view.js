import { fetchThirdCertifyUrl, fetchThirdFaceResultUrl } from "@api/index";
import store from "../../store";
import {
  WEB_VIEW,
  SUB_LOGIN,
  openPage,
  jumpLoginPage,
  SUB_FACE_AUTH,
  SUB_CARRIER_AUTH,
  SUB_PERSON_AUTH,
  MAIN_INFO,
} from "./open-uniapp-page";
import { addQuery } from "./parse-url.js";
import storage from "./storage";
import {
  currentDeviceType,
  DEVICE_TYPE_MAP,
  FACE_AUTH_TYPE,
} from "@constant/login";
import { WEB_VIEW_ITEM } from "@constant/storageKey";

const hasDomain = (url) => url.indexOf("http") === 0 || url.indexOf("//") === 0;

const prefixDomain = (url, domain = defaultOptions.domain) => {
  if (domain && !hasDomain(url)) {
    url = domain + url;
  }

  // 小程序的服务器域名只支持 https
  // 开发环境就不要 https 测试本地 h5 通常都是 http
  if (url.startsWith("http://") && process.env.NODE_ENV !== "development") {
    url = url.replace("http://", "https://");
  }

  return url;
};
const defaultOptions = {
  title: "",
  domain: "https://yunshangnc.com", // h5 页面 host
  webViewPage: WEB_VIEW,
};

/**
 * 打开 WebView 页面
 * @param {string} url
 * @param {object} options
 * ```
 *  openWebView('/path/page', {
 *    title:'页面标题',             // 页面标题
 *    domain:'xxx.xxx.com', // 域名，默认为 https://yunshangnc.com
 *    query: {                     // queryString 参数
 *      name: 'zm'
 *    }
 *  });
 * ```
 */
export function openWebView(url, options = {}, type) {
  type = type || "navigateTo"; // redirectTo 多个参数类型
  options = {
    ...defaultOptions,
    ...options,
  };

  // 配置跳转内部地址，活动等开发文件统一放到sub文件夹中
  if (url.indexOf("/pages/sub") !== 0) {
    url = prefixDomain(url, options.domain);
  }
  const token = storage.get("token");

  if (!token) {
    console.error("----------webView token 获取失败-----------");
  }

  const { query = {} } = options;

  if (url === "https://nc.tpms.jxangyi.cn/tpmswx-webapp/?comefrom=inc") {
    //货车通行证
    url = addQuery(url, {
      ...query,
      openId: store.state.user.userInfo.uuid,
      devicetype: currentDeviceType,
    });
  } else if (url === "https://yunshangnc.comctmxwzx") {
    openPage(MAIN_INFO);
    return;
  } else {
    url = addQuery(url, {
      ...query,
      token: token,
      devicetype: currentDeviceType,
    });
  }

  const _query = {
    src: url,
    title: options.title,
  };
  store.commit("app/REMOVE_QR_CODE_INFO");

  openPage(options.webViewPage, _query, type);
}

export const judgeIsCanJump = (_item) => {
  const {
    belongType,
    isLogin,
    level,
    isFace,
    address,
    name = "",
    jumpPage,
    _judgeType = "navigateTo",
    commingSoon,
  } = _item;

  const isTokenValid = store.getters["user/isTokenValid"];
  const authLevel = store.state.user.userInfo.authLevel;

  // if (belongType === "0") {
  //   uni.showToast({
  //     title: "正在维护中，给您带来的不便，敬请谅解",
  //     icon: "none",
  //   });
  //   return false;
  // }

  // 将 web-view 的参数缓存，跳转到 web-view 需要根据这些数据来做处理
  // isLogin 后端 1 是表示不用登录， 0 表示需要登录
  storage.set(WEB_VIEW_ITEM, _item);
  if (isLogin === "1") {
    return openWebView(
      address,
      {
        title: name,
      },
      _judgeType
    );
  }

  if (isLogin === "0" && !isTokenValid) {
    jumpLoginPage(SUB_LOGIN, { src: address }, _judgeType);
    return false;
  }

  // 是否敬请期待 0是 1否
  if (commingSoon === "0") {
    return uni.showToast({
      title: "感谢关注，敬请期待！",
      icon: "none",
    });
  }

  if (!address) {
    return uni.showToast({
      title: "页面不存在",
      icon: "none",
    });
  }

  if (level && level > authLevel) {
    if (+level === 4 || +level === 3) {
      openPage(SUB_FACE_AUTH);
    }
    return false;
  }

  if (isFace === "0") {
    const nicknameEncode = store.state.user.userInfo.nicknameEncode;
    const idCardEncode = store.state.user.userInfo.idCardEncode;
    fetchThirdCertifyUrl({
      data: {
        bizCode: "FACE",
        certName: nicknameEncode,
        certNo: idCardEncode,
        devicetype: currentDeviceType,
        type: FACE_AUTH_TYPE.verify,
        returnUrl: "https://api.yunshangnc.com/",
      },
    }).then((res) => {
      const { certifyId, url } = res;

      // #ifdef MP-ALIPAY
      my.startAPVerify({
        url,
        certifyId,
        success: function () {
          fetchThirdFaceResultUrl({
            data: {
              certifyId,
              devicetype: currentDeviceType,
            },
          }).then(() => {
            openWebView(
              address,
              {
                title: name,
              },
              _judgeType
            );
          });
        },
        fail: function (err) {
          console.log(err, "error");
        },
      });
      //#endif

      // #ifdef MP-WEIXIN
      wx.startFacialRecognitionVerify({
        userIdKey: certifyId,
        success(res) {
          const { verifyResult } = res;
          fetchThirdFaceResultUrl({
            data: {
              certifyId,
              verifyKey: verifyResult,
              devicetype: currentDeviceType,
            },
          }).then(() => {
            openWebView(
              address,
              {
                title: name,
              },
              _judgeType
            );
          });
        },
        fail(err) {
          console.log(err, "error");
        },
      });
      //#endif
    });

    return false;
  }
  openWebView(
    address,
    {
      title: name,
    },
    _judgeType
  );
};
