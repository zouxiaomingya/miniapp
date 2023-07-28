<template>
  <view class="login uCol uBet u-safe-btm">
    <view class="logo-wrap">
      <view class="login-logo uCenterXY">
        <image
          class="logo"
          src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/login-logo2.png"
        />
      </view>
      <view class="title">天下英雄城</view>
      <view class="prompt">欢迎登录，体验更多功能</view>
    </view>
    <view class="content">
      <view v-if="loginTypeKey === 'wechat'">
        <view
          v-if="!checked"
          class="btn wechat-btn uCenterXY"
          @click="handleLogin"
        >
          <image
            class="icon"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/my/wechat.png"
          />微信登录
        </view>
        <button
          v-else
          class="btn wechat-btn uCenterXY"
          open-type="getPhoneNumber"
          @getphonenumber="onGetPhoneNumber"
        >
          <image
            class="icon"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/my/wechat.png"
          />微信登录
        </button>
      </view>
      <view class="read uCenterXY">
        <checkbox-group @change="checkboxChange">
          <checkbox
            value="read"
            :checked="checked"
            color="#1E4FD6"
            style="transform: scale(0.7)"
          />
        </checkbox-group>
        我已阅读并同意
        <text class="path" @click="openH5PageByType('userAgreement')">
          《服务协议》
        </text>
        和
        <text class="path" @click="openH5PageByType('privacyAgreement')">
          《隐私政策》
        </text>
      </view>
      <view class="other-wrap">
        <view class="text">
          <view>其他登录方式</view>
        </view>
        <view class="other uCenterX uS">
          <view class="item uCenterXY uCol" @click="handleKeXinLoginPage()">
            <image
              src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/kexin_login.png"
            />
            <view> 可信身份认证登录 </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { openPage, MAIN_MY, SUB_KEXIN_LOGIN } from "@utils/open-uniapp-page";
import { fetchAuthLogin, queryUserInfo } from "@api/index";
import { H5_URL_MAP } from "@constant/h5";
import { mapMutations, mapState } from "vuex";
import {
  LOGIN_METHOD_MAP,
  DEVICE_TYPE_MAP,
  SOURCE_TYPE_MAP,
} from "@constant/login";
import { getPlatform, PLAT_FORM_MAP } from "@utils/common";
import { LOGGER_NAME } from "@constant/storageKey";
import { EVENT_LOGIN_OBJ, LOGIN_TYPE, EVENT_LOGIN_MODE } from "@constant/login";
import { judgeIsCanJump } from "@utils/open-web-view";

// 微信小程序登录方式
let loginTypeList = [
  {
    key: LOGIN_TYPE.kexin,
    title: "可信身份认证登录",
    iconSrc:
      "https://api.yunshangnc.com/client-img/inc-miniapp/icon/kexin_login.png",
  },
];
if (getPlatform() === PLAT_FORM_MAP.wechat) {
  loginTypeList = [
    {
      key: LOGIN_TYPE.wechat,
      title: "微信登录",
      iconSrc:
        "https://api.yunshangnc.com/client-img/inc-miniapp/icon/wechat_login.png",
    },
    ...loginTypeList,
  ];
}
export default {
  onLoad(option) {
    const { src } = option;
    this.src = src;
  },

  data() {
    return {
      checked: false,
      phone: "", // 手机号
      code: "", // 短信验证码
      password: "", // 密码
      loginTypeKey: loginTypeList[0].key,
      loginTypeList: loginTypeList,
    };
  },

  computed: {
    ...mapState("app", ["qrCodeInfo"]),
  },

  mounted() {
    uni.setNavigationBarTitle({
      title: loginTypeList[0].title,
    });
  },

  methods: {
    ...mapMutations({
      setToken(commit, tokenInfo) {
        commit("user/SET_TOKEN", tokenInfo);
      },
      setUserInfo(commit, userInfo) {
        commit("user/SET_USER_INFO", userInfo);
      },
    }),

    loginSuccessCallBack(res = {}) {
      const { access_token, token_type, expires_in } = res;
      this.setToken({
        token: access_token,
        tokeType: token_type,
        // expires_in 是多久时间后过期（单位是秒）
        tokenExpired: +new Date() + expires_in * 1000,
      });

      queryUserInfo().then((res) => {
        this.setUserInfo(res);
        uni.showToast({
          title: "登录成功",
          icon: "none",
        });
        setTimeout(() => {
          if (this.qrCodeInfo.address) {
            return judgeIsCanJump(this.qrCodeInfo);
            // return this.openWebView(
            //   decodeURIComponent(this.src),
            //   {},
            //   "redirectTo"
            // );
            // return judgeIsCanJump({
            //   address: decodeURIComponent(this.src),
            //   isLogin: "0",
            // });
          }
          // 如果有回退页就回退,没有就去<<我的>>页面
          if (getCurrentPages().length > 1) {
            openPage("", {}, "navigateBack");
          } else {
            openPage(MAIN_MY, {}, "switchTab");
          }
        }, 500);

        const cacheParams = this.storage.get(LOGGER_NAME);
        this.storage.set(LOGGER_NAME, {
          ...cacheParams,
          eventId: EVENT_LOGIN_OBJ[this.loginTypeKey],
          moduleId: "M0000",
          buriedPointType: "auth",
          param: {
            key: "login",
            phone: res.phoneExt,
            loginMode: EVENT_LOGIN_MODE[this.loginTypeKey],
          },
        });
        this.logger();
      });
    },

    handleLogin() {
      const { checked } = this;
      if (!checked) {
        return uni.showToast({
          title: "请先阅读并勾选协议",
          icon: "none",
        });
      }
    },

    onGetPhoneNumber({ detail }) {
      const _this = this;

      if (detail.errMsg.indexOf("getPhoneNumber:fail") != -1) {
        if (detail.errMsg.indexOf("user cancel") != -1) {
          uni.showToast({
            title: "请不要重复点击、以免取消微信授权",
            icon: "none",
          });
        } else if (detail.errMsg.indexOf("fail no permission") != -1) {
          // 小程序未获取资质
          uni.showToast({
            title: "不支持获取手机信息，请尝试其他登录方式",
            icon: "none",
          });
        } else if (detail.errMsg.indexOf("fail user deny") != -1) {
          uni.showToast({
            title: "允许授权将获得更好的服务",
            icon: "none",
          });
        } else {
          uni.showToast({
            title: "未获取手机信息，请尝试其他登录方式",
            icon: "none",
          });
        }
      } else {
        fetchAuthLogin({
          data: {
            code: detail.code,
            devicetype: DEVICE_TYPE_MAP.wechatMiniProgram,
            equipment: "",
            loginMethod: LOGIN_METHOD_MAP.wechatAuthLogin,
            sourceType: SOURCE_TYPE_MAP.ctm,
          },
          showLoading: true,
          loadingText: "登录中...",
          isNeedToken: false,
        }).then(_this.loginSuccessCallBack);
      }
    },

    checkboxChange(e) {
      const { value } = e.detail;
      this.checked = value.includes("read");
    },

    openH5PageByType(type) {
      this.openWebView(H5_URL_MAP[type]);
    },
    handleKeXinLoginPage() {
      openPage(SUB_KEXIN_LOGIN);
    },
  },
};
</script>

<style scoped lang="less">
.login {
  min-height: 100vh;
  box-sizing: border-box;
  background: url("https://api.yunshangnc.com/client-img/inc-miniapp/my/login-bg.png")
    no-repeat;
  background-size: 100% 744rpx;

  .logo-wrap {
    padding-top: 62rpx;
    padding-left: 48rpx;
    .login-logo {
      width: 112rpx;
      height: 114rpx;
      border-radius: 32rpx;
      background: #074aff;
      box-shadow: 0px 4px 8px 0px #cccccc;
      .logo {
        width: 60rpx;
        height: 60rpx;
      }
    }
    .title {
      padding: 40rpx 0 10rpx;
      font-size: 48rpx;
      font-weight: bold;
      color: #3d3d3d;
    }
    .prompt {
      font-size: 32rpx;
      color: #999999;
    }
    .kexin-logo {
      width: 512rpx;
      height: 88rpx;
      margin: 70rpx 0;
    }
  }

  .content {
    .read {
      padding-top: 56rpx;
      font-size: 24rpx;
      color: #999999;
      .radio {
        transform: scale(0.6);
      }
      .path {
        color: #3458df;
      }
    }
    .auto {
      margin-left: 10rpx;
      font-size: 24rpx;
      color: #333333;
    }
    .btn {
      height: 112rpx;
      line-height: 112rpx;
      padding: 0 190rpx;
      margin-top: 74rpx;
      font-size: 30rpx;
      border-radius: 56rpx;
      text-align: center;
      background: linear-gradient(89deg, #f75350 0%, #f3332e 99%);
      color: #ffffff;
    }

    .wechat-btn {
      margin: 0 42rpx;
      // background: #52ae3f;
      background: linear-gradient(90deg, #76e859 0%, #33d10a 99%);
      &::after {
        content: "";
        border: none;
        height: 0;
      }
      .icon {
        width: 68rpx;
        height: 68rpx;
        margin-right: 10rpx;
      }
    }
  }
  .other-wrap {
    width: 100%;
    padding-top: 60rpx;
    font-size: 22rpx;
    color: #333;
    .other {
      padding-bottom: 52rpx;
    }
    .text {
      width: 100%;
      display: flex;
      box-sizing: border-box;
      padding: 54rpx 50rpx;
    }
    .text view {
      line-height: 0rpx;
      padding: 0 32rpx;
      color: #333;
    }
    .text:after {
      flex: 1;
      content: "";
      height: 2rpx;
      background-color: #cccccc;
    }
    .text::before {
      flex: 1;
      content: "";
      height: 2rpx;
      background-color: #cccccc;
    }
    .item {
      // 由于目前只有一种其他登录方式，所以不设置宽度
      // width: 90rpx;
      padding: 0 20rpx;
    }

    .item image {
      width: 72rpx;
      height: 72rpx;
      margin-bottom: 6rpx;
    }
  }
}
</style>