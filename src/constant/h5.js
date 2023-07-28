let baseUrl = "https://icity.yunshangnc.com/citizen/#/icity";

// const test = true;
// if (test) {
//   baseUrl = "http://192.168.1.130:8080/h5/#/icity";
// }

export const H5_URL_MAP = {
  ride: `${baseUrl}/home/ride/index`, // 乘车助手
  priceList: `${baseUrl}/home/price-list`, // 民生指数
  advice: `${baseUrl}/my/advice`, // 反馈建议
  evaluation: `${baseUrl}/my/evaluation`, // 服务评价
  weather: `${baseUrl}/home/weather`, // 天气
  ganTongCode: "https://elecard.hcctm.com/inanchang/ctm/onescreencode.html", // 赣通码 h5 外部链接
  businessAuth: `${baseUrl}/my/enterprise-auth/index`, // 企业认证
  userAgreement: `${baseUrl}/my/user-agreement`, // 用户协议
  privacyAgreement: `${baseUrl}/my/privacy-policy`, // 隐私权政策
  didi: "https://v.didi.cn/p/QXO7Zwq", //滴滴优惠券
  tongcheng:
    "https://wx.17u.cn/flightactivities/newAuth/couponNew?equityCode=CI221111OBS0U3103822", //同程优惠券
  userLogOut: `${baseUrl}/my/user-log-out`, // 用户注销协议
};
