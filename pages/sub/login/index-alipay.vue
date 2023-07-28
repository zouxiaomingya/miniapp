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
      <view class="btn uCenterXY" @click="handleLogin">
        <image
          class="icon"
          src="https://api.yunshangnc.com/client-img/inc-miniapp/my/alipay.png"
        />支付宝登录
      </view>
      <view class="read uCenterXY">
        <checkbox-group @change="checkboxChange">
          <checkbox
            value="read"
            :checked="checked"
            color="#4e70f5"
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
          <view class="item uCenterXY uCol" @click="jumpKeXinLogin()">
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
import { openPage, SUB_KEXIN_LOGIN } from "@utils/open-uniapp-page";
import { fetchAuthLogin, queryUserInfo } from "@api/index";
import { mapMutations, mapState } from "vuex";
import { H5_URL_MAP } from "@constant/h5";
import { EVENT_LOGIN_OBJ, EVENT_LOGIN_MODE } from "@constant/login";

import {
  LOGIN_METHOD_MAP,
  DEVICE_TYPE_MAP,
  SOURCE_TYPE_MAP,
} from "@constant/login";
import { LOGGER_NAME } from "@constant/storageKey";
import { judgeIsCanJump } from "@utils/open-web-view";
export default {
  data() {
    return {
      checked: false,
    };
  },

  computed: {
    ...mapState("app", ["qrCodeInfo"]),
  },

  mounted() {},

  methods: {
    ...mapMutations({
      setToken(commit, tokenInfo) {
        commit("user/SET_TOKEN", tokenInfo);
      },
      setUserInfo(commit, userInfo) {
        commit("user/SET_USER_INFO", userInfo);
      },
    }),

    handleLogin() {
      if (!this.checked) {
        return uni.showToast({
          title: "请先阅读并勾选协议",
          icon: "none",
          duration: 4000,
        });
      }
      my.getAuthCode({
        scopes: "auth_user",
        success: (res) => {
          fetchAuthLogin({
            data: {
              code: res.authCode,
              devicetype: DEVICE_TYPE_MAP.alipay,
              equipment: "",
              loginMethod: LOGIN_METHOD_MAP.alipayAuthLogin,
              sourceType: SOURCE_TYPE_MAP.ctm,
            },
            showLoading: true,
            loadingText: "登录中...",
            isNeedToken: false,
          }).then((res = {}) => {
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
              const cacheParams = this.storage.get(LOGGER_NAME);
              this.storage.set(LOGGER_NAME, {
                ...cacheParams,
                eventId: EVENT_LOGIN_OBJ.alipay,
                moduleId: "M0000",
                buriedPointType: "auth",
                param: {
                  key: "login",
                  phone: res.phoneExt,
                  loginMode: "alipayLogin",
                },
              });
              this.logger();
              setTimeout(() => {
                if (this.qrCodeInfo.address) {
                  return judgeIsCanJump(this.qrCodeInfo);
                }
                openPage("", {}, "navigateBack");
              }, 500);
            });
          });
        },
      });
    },

    checkboxChange(e) {
      const { value } = e.detail;
      this.checked = value.includes("read");
    },
    openH5PageByType(type) {
      this.openWebView(H5_URL_MAP[type]);
    },

    jumpKeXinLogin() {
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
      padding-top: 32rpx;
      font-size: 24rpx;
      color: #999999;

      .path {
        color: #4975ff;
      }
    }

    .btn {
      margin: 0 52rpx;
      height: 112rpx;
      line-height: 112rpx;
      color: #ffffff;
      font-size: 32rpx;
      border-radius: 56rpx;
      background: linear-gradient(90deg, #748ff3 0%, #2f54dd 99%);
      .icon {
        width: 64rpx;
        height: 64rpx;
        margin-right: 10rpx;
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

  .kexin-login {
    text-align: center;
    font-size: 13px;
    color: #1f59d8;
    margin-top: 40rpx;
  }
}
</style>
