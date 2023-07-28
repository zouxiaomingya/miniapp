import { queryUserInfo } from "@api/index";

export default {
  namespaced: true,
  state: {
    version: "1.0", // 当前应用版本
    loginMethod: "", // 登录方式
    equipment: "", // 设备 手机型号，浏览器型号等
    deviceType: "", // 平台类型。 android ios wechat alipay
    statusBarHeight: 20, // 手机状态栏高度
    navBarHeight: 44, // 各平台的导航栏高度
    qrCodeInfo: {
      address: "",
    }, // 扫码进入小程序识别参数缓存
  },
  mutations: {
    UPDATE_APP_STATE: (state, { key, value }) => {
      state[key] = value;
    },

    REMOVE_QR_CODE_INFO: (state) => {
      state.qrCodeInfo = {};
    },
  },

  actions: {
    getCurrentUserInfo({ commit }) {
      return queryUserInfo().then((res) => {
        commit("user/SET_USER_INFO", res, {
          root: true,
        });
      });
    },
  },
};
