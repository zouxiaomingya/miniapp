<template>
  <div class="confirm-login-page uCol uCenterY">
    <image
      class="icon"
      src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/qr-login-icon.png"
      mode="widthFix"
    />
    <view class="text">客户端登录确认</view>
    <view class="hint">请不要扫来源不明的二维码</view>
    <button class="btn" :loading="loading" @click="handleLogin">登录</button>
    <view class="btn cancel u-safe-m-btm" @click="handleCancel">取消登录</view>
  </div>
</template>

<script>
import { openPage } from "@utils/open-uniapp-page";
import { fetchLoginQrCodeV2 } from "@api";
import { LOGIN_METHOD_MAP, SOURCE_TYPE_MAP } from "@constant/login";
import { currentDeviceType } from "@constant/login";

export default {
  components: {},

  data() {
    return {
      loading: false,
    };
  },

  onLoad(options) {
    const { result } = options;
    const _result = decodeURIComponent(result); // 注意转码
    this.result = _result;
  },
  mounted() {},

  methods: {
    handleLogin() {
      if (this.loading) return;
      this.loading = true;
      let sourceType = "";
      // #ifdef MP-WEIXIN
      sourceType = SOURCE_TYPE_MAP.wechat;
      // #endif

      // #ifdef MP-ALIPAY
      sourceType = SOURCE_TYPE_MAP.alipay;
      // #endif

      fetchLoginQrCodeV2({
        data: {
          qrCode: this.result,
          equipment: "",
          loginMethod: LOGIN_METHOD_MAP.qrCode,
          devicetype: currentDeviceType,
          sourceType: sourceType,
        },
      })
        .then(() => {
          uni.showToast({
            title: "扫码成功",
            icon: "none",
          });
          setTimeout(() => {
            openPage("", {}, "navigateBack");
          }, 500);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleCancel() {
      openPage("", {}, "navigateBack");
    },
  },
};
</script>
<style lang="less" scoped>
.confirm-login-page {
  padding: 200rpx 64rpx 64rpx;
  min-height: 100vh;
  box-sizing: border-box;
  background: #f8f8f8;
  .icon {
    width: 242rpx;
    height: 180rpx;
  }

  .text {
    margin-top: 48rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
  }

  .btn {
    height: 80rpx;
    line-height: 80rpx;
    width: 100%;
    background: #4e6ff4;
    border-radius: 16px;
    color: #fff;
    text-align: center;
  }

  .cancel {
    margin-top: 48rpx;
    color: #000;
    background: #ffffff;
  }

  .hint {
    font-size: 28rpx;
    font-weight: bold;
    color: #999999;
    margin: 32rpx 0 120rpx;
  }
}
</style>
