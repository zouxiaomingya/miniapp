/*eslint-disable*/
import { getApi, postApi } from "@src/utils/request.js";
import store from '@store'
import { getFullUrl } from "@utils/request";
import { defaultHost, prodHost } from "@src/constant/operate";
import { currentDeviceType ,DEVICE_TYPE_MAP} from "@constant/login";

// 授权登录
export const fetchAuthLogin = postApi("/api/third/auth/login");

// 获取用户信息
export const queryUserInfo = getApi("/api/users/curinfo");

// 用户名，密码登录
export const fetchAccountLogin = postApi("/api/login/account");

// 可信平台用户名，密码登录
export const fetchKeXinLogin = postApi("/api/prov/credible/account/login");

// 可信平台用户名，账号注册
export const fetchKeXinRegister = postApi("/api/prov/credible/account/register");

// 发送短信验证码(无图形验证码)
export const fetchSendSmsCode = postApi("/apiSms/sendSmsCode");

// 短信验证码登录
export const fetchSmsLogin = postApi("/api/login/sms");

// 密码重置
export const fetchResetPassword = postApi("/api/member/resetPassword");

// 修改密码(新)
export const fetchChangePassword = postApi("/api/member/newPassword");

// 账号注销
export const fetchCloseAccount = postApi("/api/member/closeAccount");

// 运营商认证
export const fetchCarrierAuth = postApi("/apiFile/telecomOperator/verify/factor");

// 退出登录
export const queryLogOut = getApi("/api/accessLogout");

// 身份认证链接 - 人脸认证的第一步
export const fetchThirdCertifyUrl = postApi("/api/third/face/certify/url");

// 身份识别结果 - 人脸认证的第二步
export const fetchThirdFaceResultUrl = postApi("/api/third/face/certify/result");


// 首页接口 获取所有栏目下-上架的应用或者应用组信息
export const queryHomeModuleInfoList = getApi("/apiEeopApp/eeopApp/tModule/getModuleInfoList");

// 首页接口 获取所有栏目下-上架的应用或者应用组信息 V2
export const queryHomeModuleInfoListV2 = getApi("/apiEeopApp/eeopApp/tModule/getNewModuleInfoList");

export const queryHomeModuleInfoListV3 = getApi(`/homeData/${currentDeviceType === DEVICE_TYPE_MAP.wechatMiniProgram?'wx':'alipay'}.json`)

export const queryHomeModuleInfoListV4 = getApi("/apiEeopApp/eeopApp/tModule/getNewHomeList");


// 获取所有栏目下-上架的应用或者应用组详情(更多)
export const queryModulesInfoById = getApi("/apiEeopApp/eeopApp/tModule/getModuleInfoById");

// 首页，搜索，查询关键字关联的应用信息
export const queryApplicationInfoByHotSearch = getApi("/apiEeopApp/eeopApp/hotSearch/getApplicationInfoByHotSearch");

// 首页，搜索，关键字List
export const queryHomeHotSearchList = getApi("/apiEeopApp/eeopApp/hotSearch/getHotSearchList");

// 首页热门资讯-微信小程序端展示
export const queryArticlePage = getApi("/apiReptile/reptile/findArticlePage");

// 民生指数 - 菜价
export const queryLiveliHoodPage = getApi(
  "/apiEeopApp/eeopApp/tModule/getLiveliHoodPage"
);


// 根据应用组id获取应用列表信息
export const queryAppListByGroupId = getApi("/apiEeopApp/eeopApp/tModule/getAppListByGroupId");

// 验证登陆二维码
export const fetchLoginQrCode = postApi("/api/incQRCode/verifyLoginQRCode");

// 验证登陆二维码
export const fetchLoginQrCodeV2 = postApi("/apiFile/incQRCode/verifyQRCode");

// 资讯，热门资讯  查询公众号分页 (未登录)
export const queryFindAccountPage = getApi("/apiReptile/reptile/findAccountPage");

// 资讯，热门资讯  查询公众号分页 (登录)
export const queryFindAccountPageByToken = getApi("/apiReptile/reptile/getAccountPageByToken");

// 资讯，热门资讯  查询公众号分页 (登录、未登录)
export const queryAccountInfo = (params) => {
  if (store.getters["user/isTokenValid"]) {
    return queryFindAccountPageByToken(params);
  } else {
    return queryFindAccountPage(params);
  }
};

// 资讯，用户订阅公众号
export const fetchSubscribeAccount = postApi("/apiReptile/publicAccount/subscribePublicAccount");

// 资讯，用户取消订阅公众号
export const fetchUnSubscribeAccount = postApi("/apiReptile/publicAccount/unSubscribePublicAccount");

// 资讯，查看用户订阅公众号列表
export const queryFindSubscribeAccount = getApi("/apiReptile/publicAccount/findSubscribeAccount");

// 资讯-更多，用户收藏文章
export const fetchCollectArticle = postApi("/apiReptile/article/subscribeArticle");

// 资讯-更多，用户取消收藏文章
export const fetchUnCollectArticle = postApi("/apiReptile/article/unSubscribeArticle");

// 资讯-更多，查看用户收藏文章
export const queryFindCollectArticle = getApi("/apiReptile/article/findSubscribeArticlePage");

// 资讯-更多，用户浏览文章 埋点 上传
export const fetchBrowseArticle = postApi("/apiReptile/browse/browseArticle");

// 资讯-更多，查看用户浏览文章
export const queryFindBrowseArticle = getApi("/apiReptile/browse/findBrowseArticlePage");

// 热门资讯 根据公众号id查询公众号下的文章分页（未登录）
export const queryFindArticlePage = getApi("/apiReptile/reptile/findArticleInfoPageByAccountId");

// 热门资讯 根据公众号id查询公众号下的文章分页（登录）
export const queryFindArticlePageByToken = getApi("/apiReptile/reptile/queryArticlePageByAccountIdToken");

// 热门资讯 根据公众号id查询公众号下的文章分页（登录、未登录）
export const queryAccountArticleInfo = (params) => {
  if (store.getters["user/isTokenValid"]) {
    return queryFindArticlePageByToken(params);
  } else {
    return queryFindArticlePage(params);
  }
};

// 资讯（今日南昌、头条新闻等）-查询某条资讯详情
export const queryGetManuscript = getApi("/apiReptile/thirdPart/getManuscriptById");

// 资讯（今日南昌、头条新闻等）-查询资讯列表
export const queryGetManuscriptPage = getApi("/apiReptile/thirdPart/getManuscriptPageByChannelId");

// 企业认证 我的企业分页列表
export const queryGetEnterpriseList = getApi("/api/enterpriseAuth/getAuthenticationInfoNew");

// 企业认证 我的授权
export const queryGetAuthList = getApi("/api/enterpriseAuth/queryWarrant");

// 企业认证 被授权
export const queryGetAuthorizedList = getApi("/api/enterpriseAuth/queryWarranted");

// 企业认证 企业信息
export const queryEnterpriseInfo = getApi("/api/enterpriseAuth/getIdCard");

// 企业认证 授权他人使用执照
export const fetchAuthLicense = postApi("/api/enterpriseAuth/warrant");

// 企业认证 取消授权
export const queryCancelAuth = getApi("/api/enterpriseAuth/cancelWarrant");

// 企业认证 重新授权 
export const queryReAuth = getApi("/api/enterpriseAuth/reWarrant");

// 企业认证 需要的id 
export const queryGetQRid = getApi("/api/enterpriseAuth/getQRid");

// 钱包管理：查询银行列表及开通情况
export const queryGetBankList = getApi("/apiEPay/accountTrade/getMoneyBagList");

// 文件上传
export const fetchUpload = postApi("/apiFile/minio/upload");
// 修改头像
export const fetchAvatar = postApi("/api/member/updateHeadPortrait");

// 我的其他模块功能
// 反馈建议
export const fetchSuggestInsert = postApi("/apiEeopApp/eeopApp/suggest/insert");

// 获取场景
export const queryAppLicationList = getApi("/apiEeopApp/eeopApp/tsceneEvalue/getApplicationList");

// 服务评价
export const fetchEvaluation = postApi("/apiEeopApp/eeopApp/tsceneEvalue/insert");

// const apiUrl = defaultHost !== prodHost ? '/apiFile/minio/upload' : '/apiFilePre/minio/upload';
// 陈聪说没有上面区别了
export const uploadFullUrl = getFullUrl('/apiFile/minio/upload')

// 获取公积金信息
export const queryPublicFund = getApi("/apiEeopApp/eeopApp/tmydataWarrant/getPublicFund");

// 埋点
export const queryLogPoint = getApi("/api/buried/point/up");

// 查询发布的弹窗记录
export const queryAlertWindow = getApi("/apiEeopApp/eeopApp/tAlertWindow/getAlertWindow");


export const fetchAuthCode = postApi("/api/auth/code");
