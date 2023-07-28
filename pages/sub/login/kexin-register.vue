<template>
  <view class="reset-password">
    <view class="container">
      <view class="content">
        <view class="input-item">
          <view class="title"> 登录账号 </view>
          <view class="input-wrap">
            <uni-easyinput
              v-model="loginname"
              :inputBorder="false"
              placeholder="请输入您的登录账号"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>
        <view class="input-item">
          <view class="title"> 姓名 </view>
          <view class="input-wrap">
            <uni-easyinput
              v-model="name"
              :inputBorder="false"
              placeholder="请输入您的姓名"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>
        <view class="input-item">
          <view class="title"> 证件号码 </view>
          <view class="input-wrap">
            <uni-easyinput
              v-model="papersnumber"
              :inputBorder="false"
              placeholder="请输入您的身份证号"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>
        <view class="input-item">
          <view class="title"> 手机号 </view>
          <view class="input-wrap">
            <uni-easyinput
              v-model="mobile"
              :inputBorder="false"
              type="number"
              placeholder="请输入您的手机号"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>
        <view class="input-item">
          <view class="title"> 验证码 </view>
          <view class="input-wrap uBet uCenterY">
            <uni-easyinput
              v-model="code"
              :inputBorder="false"
              type="number"
              placeholder="请输入验证码"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
            <view
              class="acquire"
              @click="onGetSmsCode"
              :class="{ count: !codeFlag }"
            >
              {{ codeTxt }}
            </view>
          </view>
        </view>
        <view class="input-item">
          <view class="title"> 密码 </view>
          <view class="input-wrap">
            <uni-easyinput
              v-model="password"
              :inputBorder="false"
              type="password"
              placeholder="必须包含大、小写字母、数字、特殊符号"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>
        <view class="input-item">
          <view class="title"> 确认密码 </view>
          <view class="input-wrap">
            <uni-easyinput
              v-model="confirmPassword"
              :inputBorder="false"
              type="password"
              placeholder="再次确认密码"
              placeholderStyle="color:#ccc; font-size:28rpx"
            />
          </view>
        </view>
        <view class="explain">
          密码仅支持8-18位大、小写字母、数字、特殊符号 (例如: @$!%*#_ ~?&^)组合
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
          <text class="path" @click="openH5Page()">《昌通码隐私权政策》</text>
        </view>
        <view class="btn" @click="handleSubmit">提交</view>
      </view>
    </view>
  </view>
</template>

<script>
import { fetchSendSmsCode, fetchKeXinRegister } from "@api/index";
import {
  SENDSMS_CATEGORY_MAP,
  DEVICE_TYPE_MAP,
  SOURCE_TYPE_MAP,
} from "@constant/login";
import { H5_URL_MAP } from "@constant/h5";
import { getCode } from "@utils/common";
import { jumpLoginPage } from "@utils/open-uniapp-page";
export default {
  data() {
    return {
      codeTxt: "获取验证码",
      codeFlag: true, // 控制按钮是否可点击
      loginname: "",
      name: "",
      papersnumber: "",
      mobile: "", // 手机号
      code: "", // 短信验证码
      password: "", // 密码
      confirmPassword: "", // 再次输入的密码
      checked: false,
    };
  },

  onLoad() {},

  mounted() {},

  methods: {
    handleSubmit() {
      if (!this.checked) {
        return uni.showToast({
          title: "请先阅读并勾选协议",
          icon: "none",
        });
      }
      const _this = this;
      const {
        loginname,
        name,
        papersnumber,
        mobile,
        code,
        key,
        password,
        confirmPassword,
      } = this;
      if (!loginname) {
        return uni.showToast({
          title: "请输入登录账号",
          icon: "none",
        });
      }
      if (!name) {
        return uni.showToast({
          title: "请输入姓名",
          icon: "none",
        });
      }

      if (!papersnumber) {
        return uni.showToast({
          title: "请输入证件号",
          icon: "none",
        });
      }

      if (!mobile) {
        return uni.showToast({
          title: "手机号不能为空",
          icon: "none",
        });
      }

      if (!code) {
        return uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
      }

      if (!confirmPassword || !password) {
        return uni.showToast({
          title: "请输入密码",
          icon: "none",
        });
      }
      if (password.length < 8 || password.length > 18) {
        return uni.showToast({
          title: "密码仅支持8-18位",
          icon: "none",
        });
      }
      // TODO 密码仅支持数字、大写字母，小写字母，特殊字符组合，并且长度需在8-18位之间，请重新输入新密码
      if (confirmPassword !== password) {
        return uni.showToast({
          title: "两次密码输入不一致",
          icon: "none",
        });
      }

      if (!key) {
        return uni.showToast({
          title: "请获取验证码",
          icon: "none",
        });
      }

      fetchKeXinRegister({
        data: {
          key: key,
          code: code,
          loginname: getCode(loginname),
          name: getCode(name),
          papersnumber: getCode(papersnumber),
          mobile: getCode(mobile),
          pwd: getCode(password),
          secondPwd: getCode(confirmPassword),
          devicetype: DEVICE_TYPE_MAP.wechatMiniProgram,
          sourceType: SOURCE_TYPE_MAP.wechat,
        },
      }).then(() => {
        uni.showToast({
          title: "修改成功",
          icon: "none",
        });
        _this.removeToken();
        setTimeout(() => {
          jumpLoginPage("", {}, "reLaunch");
        }, 1000);
      });
    },

    checkboxChange(e) {
      const { value } = e.detail;
      this.checked = value.includes("read");
    },

    onGetSmsCode() {
      const { mobile } = this;
      if (!mobile) {
        return uni.showToast({
          title: "手机号不能为空",
          icon: "none",
        });
      }
      fetchSendSmsCode({
        data: {
          phone: mobile,
          type: SENDSMS_CATEGORY_MAP.register,
        },
      }).then((res) => {
        uni.showToast({
          title: "验证码发送成功",
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

    openH5Page() {
      this.openWebView(H5_URL_MAP.privacyAgreement);
    },
  },
};
</script>

<style scoped lang="less">
.reset-password {
  min-height: 100vh;
  background: #fff;
  .container {
    padding: 24rpx 32rpx;
    .explain {
      padding: 16rpx 0 0 0;
      font-size: 28rpx;
      color: #999999;
    }
    .content {
      .input-item {
        padding: 10rpx 0 16rpx 0;
        border-bottom: 2rpx solid #eee;
        .title {
          font-size: 32rpx;
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
      .btn {
        padding: 24rpx 0;
        border-radius: 44rpx;
        text-align: center;
        font-size: 28rpx;
        background-color: #4e6ff4;
        color: #fff;
      }
    }
    .read {
      margin: 24rpx 0;
      font-size: 24rpx;
      font-weight: 600;
      .radio {
        transform: scale(0.6);
      }
      .path {
        color: #4975ff;
      }
    }
  }
}
</style>
