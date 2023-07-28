import storage from "@utils/storage";

const USER_INIT_INFO = {
  headimgurl:
    "https://api.yunshangnc.com/client-img/inc-miniapp/img/default.png", // 手头像 TODO 图片访问不了
  nickname: "", // 昵称
  phone: "", // 手机号
  phoneExt: "",
  socialCard: "", // 社保卡
  level: 0, // 认证等级 认证等级(0.未认证,1.人脸实名,2.运营商认证,3.银行卡认证,5.社保卡认证,6.OCR认证)
  authLevel: 0, // 2-L2 3-L3 4-L4
};
export default {
  namespaced: true,

  state: {
    token: storage.get("token"),
    tokeType: storage.get("token_type"),
    tokenExpired: storage.get("token_expired"),
    userInfo: USER_INIT_INFO,
    areaString: "南昌市",
  },

  getters: {
    isTokenValid(state) {
      return !!state.token && state.tokenExpired > Date.now();
    },
  },

  // 同步事件
  mutations: {
    SET_TOKEN: (state, { token, tokeType, tokenExpired }) => {
      state.token = token;
      state.tokeType = tokeType;
      state.tokenExpired = tokenExpired;
      storage.set("token", token);
      storage.set("token_type", tokeType);
      storage.set("token_expired", tokenExpired);

      // 保存一份 办事对接需要这个token, 他们是这个key
      uni.setStorageSync("access_token", token);
    },

    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      // state.userInfo.authLevel = 0;
    },

    UPDATE_USER_INFO: (state, userInfo) => {
      state.userInfo = { ...state.userInfo, ...userInfo };
    },

    REMOVE_TOKEN: (state) => {
      state.token = "";
      state.tokeType = "";
      state.tokenExpired = -1;
      storage.remove("token");
      storage.remove("token_type");
      storage.remove("token_expired");
      state.userInfo = USER_INIT_INFO;

      // 办事对接需要这个token, 他们是这个key
      uni.removeStorageSync("access_token");
    },

    SET_AREA: (state, areaString) => {
      state.areaString = areaString;
    },
  },

  // 异步事件
  actions: {},
};
