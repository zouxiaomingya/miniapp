// (平台类型(1.安卓,2.IOS,3.支付宝，4.微信小程序,5.开发平台,6.运维平台,7.官网,8.社保卡)
export const DEVICE_TYPE_MAP = {
  android: 1,
  ios: 2,
  alipay: 3,
  wechatMiniProgram: 4,
  developmentPlatform: 5,
  operationPlatform: 6,
  officialWebsite: 7,
  socialSecurityCard: 8,
};

//登录方式(1.用户名密码，2.手机验证码（个人），3.社保卡密码，4.二维码，5.手机验证码（企业），6.支付宝授权登录，7.支付宝人脸登录，12: 微信授权登录)
export const LOGIN_METHOD_MAP = {
  password: 1,
  phoneAuth: 2,
  socialCardPassword: 3,
  qrCode: 4,
  enterprisePhoneAuth: 5,
  alipayAuthLogin: 6,
  alipayFaceLogin: 7,
  wechatAuthLogin: 12,
};

// 来源(1.APP,2.支付宝,3.微信,4.PC)
export const SOURCE_TYPE_MAP = {
  app: 1,
  alipay: 2,
  wechat: 3,
  pc: 4,
  ctm: 15,
};

// 短信发送类别(register,login,password,social,face)
export const SENDSMS_CATEGORY_MAP = {
  register: "register",
  login: "login",
  password: "password",
  social: "social",
  face: "face",
  close: "close", // 注销
};

// -1、首次人脸登录注册并登入，0、人脸核验并登入，1、人脸核验， 2、身份认证并入库（certName、certNo必输项）
export const FACE_AUTH_TYPE = {
  verify: 1,
  authentication: 2,
};

let mpType = 5;
// #ifdef MP-WEIXIN
mpType = DEVICE_TYPE_MAP.wechatMiniProgram;
// #endif

// #ifdef MP-ALIPAY
mpType = DEVICE_TYPE_MAP.alipay;
// #endif

export const currentDeviceType = mpType;

export const LOGIN_TYPE = {
  authCode: "authCode",
  password: "password",
  wechat: "wechat",
  alipay: "alipay",
  kexin: "kexin",
};

// 埋点事件
export const EVENT_LOGIN_OBJ = {
  [LOGIN_TYPE.authCode]: "E0002",
  [LOGIN_TYPE.password]: "E0001",
  [LOGIN_TYPE.wechat]: "E9003",
  [LOGIN_TYPE.alipay]: "E9002",
};

// 埋点事件
export const EVENT_LOGIN_MODE = {
  [LOGIN_TYPE.authCode]: "verifyCode",
  [LOGIN_TYPE.password]: "password",
  [LOGIN_TYPE.wechat]: "wechatLogin",
  [LOGIN_TYPE.alipay]: "alipayLogin",
  [LOGIN_TYPE.kexin]: "reliableTrust",
};
