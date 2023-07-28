<template>
  <view class="login uCol uCenterY">
    <view class="logo-wrap uCol uCenterY">
      <image
        class="kexin-logo"
        src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/kexin-logo.png"
      />
    </view>

    <view class="content">
      <view>
        <view class="input-item uCenterY">
          <image
            src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/cellphone_number.png"
          />
          <view class="input-wrap">
            <uni-easyinput
              v-model="phone"
              :inputBorder="false"
              placeholder="请输入您的账号"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>

        <view class="input-item uCenterY">
          <image
            src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/code.png"
          />
          <view class="input-wrap uCenterY">
            <uni-easyinput
              v-model="password"
              :inputBorder="false"
              type="password"
              placeholder="请输入您的密码"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>
      </view>
      <view class="register" @click="JumpRegisterPage">注册账号</view>
      <view class="btn" @click="handleLogin"> 登录 </view>
      <view class="read uCenterXY">
        <checkbox-group @change="checkboxChange">
          <checkbox
            value="read"
            :checked="checked"
            color="#E82020"
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
    </view>
  </view>
</template>

<script>
import { openPage, SUB_KEXIN_REGISTER, MAIN_MY } from "@utils/open-uniapp-page";
import { queryUserInfo, fetchKeXinLogin, fetchSendSmsCode } from "@api/index";
import { H5_URL_MAP } from "@constant/h5";
import { getCode } from "@utils/common";
import { mapMutations } from "vuex";
import {
  LOGIN_METHOD_MAP,
  DEVICE_TYPE_MAP,
  SOURCE_TYPE_MAP,
  SENDSMS_CATEGORY_MAP,
} from "@constant/login";
import { LOGGER_NAME } from "@constant/storageKey";
import { EVENT_LOGIN_OBJ, EVENT_LOGIN_MODE } from "@constant/login";
export default {
  data() {
    return {
      codeTxt: "获取验证码",
      codeFlag: true, // 控制按钮是否可点击
      checked: false,
      phone: "", // 手机号
      code: "", // 短信验证码
      password: "", // 密码
    };
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
          openPage(MAIN_MY, {}, "switchTab");
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
            loginMode: "reliableTrust",
          },
        });
        this.logger();
      });
    },

    handleLogin() {
      const { phone, password, checked } = this;
      if (!checked) {
        return uni.showToast({
          title: "请先阅读并勾选协议",
          icon: "none",
        });
      }

      if (!phone) {
        return uni.showToast({
          title: "手机号不能为空",
          icon: "none",
        });
      }
      if (!password) {
        return uni.showToast({
          title: "密码不能为空",
          icon: "none",
        });
      }
      fetchKeXinLogin({
        data: {
          password: getCode(password),
          username: getCode(phone),
          devicetype: DEVICE_TYPE_MAP.wechatMiniProgram,
          equipment: "",
          loginMethod: LOGIN_METHOD_MAP.password,
          sourceType: SOURCE_TYPE_MAP.wechat,
        },
      }).then(this.loginSuccessCallBack);
    },

    onGetSmsCode() {
      const { phone } = this;
      if (!phone) {
        return uni.showToast({
          title: "请输入手机号",
          icon: "none",
        });
      }
      if (this.codeFlag == false) return;

      fetchSendSmsCode({
        data: {
          phone: phone,
          type: SENDSMS_CATEGORY_MAP.login,
        },
      }).then((res) => {
        uni.showToast({
          title: "获取成功",
          icon: "success",
        });
        const { key } = res;
        this.key = key;
        let time = 60;
        this.codeFlag = false;
        this.codeTxt = `${time}(S)`;
        let timer = setInterval(() => {
          if (time <= 1) {
            this.codeTxt = "获取验证码";
            this.codeFlag = true;
            clearInterval(timer);
          } else {
            time--;
            this.codeTxt = `${time}(S)`;
          }
        }, 1000);
      });
    },

    checkboxChange(e) {
      const { value } = e.detail;
      this.checked = value.includes("read");
    },

    // TODO 注册可信账号
    JumpRegisterPage() {
      openPage(SUB_KEXIN_REGISTER);
    },

    openH5PageByType(type) {
      this.openWebView(H5_URL_MAP[type]);
    },
  },
};
</script>

<style scoped lang="less">
.login {
  min-height: 100vh;
  background: #fff;
  .logo-wrap {
    padding-top: 54rpx;
    color: #333333;
    .kexin-logo {
      width: 512rpx;
      height: 88rpx;
      margin: 70rpx 0;
    }
    .title {
      font-size: 36rpx;
      font-weight: 600;
      padding: 40rpx 0;
    }
  }

  .content {
    min-height: 480rpx;
    .input-item {
      width: 560rpx;
      margin-bottom: 30rpx;
      padding: 0 0 20rpx 0;
      border-bottom: 2rpx solid #eee;
      input {
        font-size: 28rpx;
        flex: 1 1 auto;
      }
      image {
        width: 36rpx;
        height: 42rpx;
        margin-right: 36rpx;
      }
      .input-wrap {
        font-size: 28rpx;
        flex: 1 1 auto;
        /deep/ .uni-easyinput__content-input {
          padding-left: 0px !important;
          font-size: 28rpx !important;
        }
        .acquire {
          color: #4e70f5;
        }
        .count {
          color: #ccc;
        }
      }
    }

    .read {
      padding-top: 80rpx;
      font-size: 24rpx;
      color: #999999;
      .radio {
        transform: scale(0.6);
      }
      .path {
        color: #1e4fd6;
      }
    }
    .auto {
      margin-left: 10rpx;
      font-size: 24rpx;
      color: #333333;
    }
    .btn {
      height: 84rpx;
      line-height: 84rpx;
      padding: 0 190rpx;
      font-size: 30rpx;
      border-radius: 44rpx;
      text-align: center;
      // background: linear-gradient(89deg, #f75350 0%, #f3332e 99%);
      background: #3458df;
      color: #ffffff;
    }

    .register {
      text-align: right;
      font-size: 28rpx;
      color: #1e4fd6;
      margin: 32rpx 0;
    }
  }
}
</style>
