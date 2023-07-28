// 该页面阻止了 eslint 格式化 需要修改到 .prettierignore 里面修改

import { addQuery } from "./parse-url.js";
import { getPlatform, PLAT_FORM_MAP } from "./common";
import store from "../../store";

/**
 * @description: 页面跳转统一处理方法
 * @param {string} url - 统一路径定义在这个文件内
 * @param {string|Object} [query] - 页面参数 ('a=b  | '?a=b' | { a: b }')
 * @param {string} [type] - 路由方法，和 uniapp 保持一致
 * @param {string} [options] -  https://uniapp.dcloud.io/api/router.html 其他 uniapp[type] 对应的其他参数
 * @return {*}
 * 示例：
  openPage(HOME_PAGE);
  openPage(HOME_PAGE, 'a=3');
	openPage(HOME_PAGE, { a: 3});
  openPage(HOME_PAGE, { a: 3}, 'navigateTo');
	openPage(HOME_PAGE, { a: 3}, 'navigateTo', option);
	option 参数参考 https://uniapp.dcloud.io/api/router?id=navigateto
 */
/**
 * type类型
 * 1. navigateBack 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages() 获取当前的页面栈，决定需要返回几层。
 * 2. redirectTo 关闭当前页面，跳转到应用内的某个页面。
 */
export const openPage = (url, query, type = "navigateTo", options = {}) => {
  // navigateBack 方法不需要 url
  if ((!url || typeof url !== "string") && type !== "navigateBack") {
    return console.error("url should be string");
  }

  const queryType = typeof query;
  if (queryType === "string") {
    if (query.startsWith("?")) {
      url += query;
    } else {
      url = `${url}?${query}`;
    }
  } else if (queryType === "object") {
    url = addQuery(url, query);
  } else if (query) {
    return console.error("query should be string or object");
  }

  uni[type]({
    url,
    ...options,
  });
};

export const MAIN_HOME = "/pages/index"; // 首页
export const MAIN_MY = "/pages/main/my/index"; // 我的
export const MAIN_INFO = "/pages/main/info/index"; // 资讯
export const MAIN_WORK = "/pages/main/work/index"; // 办事
export const WEB_VIEW = "/pages/main/web-view/index"; // web-view 中转页

//sub
export const SUB_LOGIN = "/pages/sub/login/index"; // 微信小程序登录页
export const SUB_ALIPAY_LOGIN = "/pages/sub/login/index-alipay"; // 支付宝小程序登录页
export const SUB_SETTING = "/pages/sub/my-setting/index"; // 设置
export const SUB_ABOUT = "/pages/sub/my-setting/about"; // 关于我们
export const SUB_LOG_OUT = "/pages/sub/my-setting/log-out"; // 注销
export const SUB_CONFIRM_LOG_OUT = "/pages/sub/my-setting/confirm-log-out"; // 注销-输入
export const SUB_MORE = "/pages/sub/my-more/index"; // 我的数据-更多
export const SUB_NEWS = "/pages/sub/my-serve/news"; // 我的消息
export const SUB_BOOKING = "/pages/sub/my-serve/booking"; // 我的预约
export const SUB_PERSON_AUTH = "/pages/sub/my-serve/person-auth/index"; // 实名认证
export const SUB_PERSON_OTHER_AUTH = "/pages/sub/my-serve/person-auth/other/index"; // 其他实名认证
export const SUB_CARRIER_AUTH = "/pages/sub/my-serve/person-auth/other/carrier-auth"; // 运营商认证
export const SUB_FACE_AUTH = "/pages/sub/my-serve/person-auth/face-auth"; // 人脸认证
export const SUB_AUTH_SUCCESS = "/pages/sub/my-serve/person-auth/auth-success"; // 实名认证成功

export const SUB_ENTERPRISE_AUTH = "/pages/sub/my-serve/enterprise-auth/index"; // 企业认证
export const SUB_ENTERPRISE_AUTH_INFO = "/pages/sub/my-serve/enterprise-auth/enterprise-info"; // 企业信息
export const SUB_ENTERPRISE_AUTH_LICENSE = "/pages/sub/my-serve/enterprise-auth/enterprise-license"; // 授权他人使用执照
export const SUB_PASSWORD_MANAGE = "/pages/sub/my-serve/password-manage"; // 密码管理
export const SUB_EVALUATION = "/pages/sub/my-other/evaluation"; // 服务评价
export const SUB_ENQUIRE = "/pages/sub/my-other/enquire"; // 联系客服
export const SUB_ADVICE = "/pages/sub/my-other/advice"; // 反馈建议
export const SUB_RESET = "/pages/sub/login/reset-password"; // 重置密码
export const SUB_KEXIN_REGISTER = "/pages/sub/login/kexin-register"; // kexin 账号注册
export const SUB_KEXIN_LOGIN = "/pages/sub/login/kexin-login"; // kexin 登录

export const SUB_CHANGE_PASSWORD = "/pages/sub/login/change-password"; // 修改密码
export const SUB_WALLET = "/pages/sub/my-serve/my-wallet/index"; // 我的钱包
export const SUB_WALLET_MANAGE = "/pages/sub/my-serve/my-wallet/wallet-manage/index"; // 钱包管理
export const SUB_REAL_NAME_AUTH = "/pages/sub/my-serve/my-wallet/wallet-manage/real-name-auth"; // 开通银行卡实名认证
export const SUB_PERSONAL_INFO = "/pages/sub/my-serve/my-wallet/wallet-manage/personal-info"; // 填写个人信息
export const SUB_BIND_BANK_CARD = "/pages/sub/my-serve/my-wallet/wallet-manage/bind-bank-card"; // 绑定银行卡
export const SUB_BANK_CARD_DETAIL = "/pages/sub/my-serve/my-wallet/wallet-manage/bank-card-detail"; // 银行卡详情
export const SUB_MY_BILL = "/pages/sub/my-serve/my-wallet/my-bill/index"; // 我的账单
export const SUB_BILL_MORE = "/pages/sub/my-serve/my-wallet/my-bill/more"; // 我的账单-更多


export const SUB_SEARCH = "/pages/sub/home/search"; // 首页搜索页面
export const SUB_SERVER_ZONE = "/pages/sub/home/serve-zone"; // 首页服务专区页面
export const SUB_SERVER_MORE = "/pages/sub/home/serve-more"; // 首页服务专区 更多
export const SUB_DOWNLOAD = "/pages/sub/home/download"; // 下载引导页
export const SUB_HOME_CONFIRM_LOGIN_PAGE = "/pages/sub/home/confirm-login-page"; // 确认登录页
export const SUB_HOME_RIDE_ASSISTANT = "/pages/sub/home/ride-assistant/index"; // 乘车助手
export const SUB_HOME_SAFETY_NOTICE = "/pages/sub/home/ride-assistant/safety-notice"; // 安全须知
export const SUB_HOME_STATION_LIST = "/pages/sub/home/ride-assistant/station-list"; // 站点列表
export const SUB_HOME_STATION_INFO = "/pages/sub/home/ride-assistant/station-info"; // 站点信息

export const SUB_INFO_MORE = "/pages/sub/info/more"; // 资讯-更多
export const SUB_INFO_RICH_TEXT = "/pages/sub/info/rich-text"; // 展示富文本页面（今日南昌，头条新闻等打开页面需要用到）
export const SUB_HOT_INFO = "/pages/sub/info/hot-info"; // 热门资讯

// 下面是兼容多端 不同路由的跳转
export const jumpLoginPage = (url, query, type = "navigateTo", options = {}) => {
  const plat = getPlatform();
  let path = url;

  if (plat === PLAT_FORM_MAP.wechat) {
    path = SUB_LOGIN;
  } else if (plat === PLAT_FORM_MAP.alipay) {
    path = SUB_ALIPAY_LOGIN;
  }

  openPage(path, query, type, options);
};

export const verifyIsLogin = (isNeedJumpLoginPage = true) => {
  return new Promise((resolve, reject) => {
    const isTokenValid = store.getters["user/isTokenValid"];
    if (isTokenValid) {
      resolve({ isTokenValid: true });
    } else {
      reject({ message: "暂未登录", isTokenValid: false });
      if(isNeedJumpLoginPage){
        jumpLoginPage(SUB_LOGIN);
      }
    }
  });
};
