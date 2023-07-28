<template>
  <view class="log-out">
    <view class="uCenterY uCol">
      <image
        class="logo"
        src="https://api.yunshangnc.com/client-img/inc-miniapp/my/log-out.png"
      />
      <view class="title">将{{ userInfo.phone }}所绑定的账号注销</view>
      <view class="prompt"> 注意，注销账号后以下信息将被清空且无法找回 </view>
    </view>

    <view class="info">
      <view>· 昌通码产品将无法使用此账号</view>
      <view class="text">· 身份、账户信息</view>
      <view>· 事项办理记录</view>
    </view>

    <view class="uCenterY uCol">
      <button class="btn" @click="handleSubmit">确认注销</button>
      <view class="read">
        点击【确认注销】即代表你已经同意
        <text class="path" @click="openH5Page()">《用户注销协议》</text>
      </view>
    </view>
  </view>
</template>

<script>
import { openPage, SUB_CONFIRM_LOG_OUT } from "@utils/open-uniapp-page";
import { mapState, mapGetters, mapActions } from "vuex";
import { H5_URL_MAP } from "@constant/h5";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapGetters({
      isTokenValid: "user/isTokenValid",
    }),
  },
  mounted() {},
  methods: {
    ...mapActions({
      _getCurrentUserInfo: "app/getCurrentUserInfo",
    }),
    handleSubmit() {
      openPage(SUB_CONFIRM_LOG_OUT);
    },
    openH5Page() {
      this.openWebView(H5_URL_MAP.userLogOut);
    },
  },
};
</script>

<style scoped lang="less">
.log-out {
  min-height: 100vh;
  color: #3d3d3d;
  font-size: 24rpx;
  .logo {
    width: 120rpx;
    height: 120rpx;
    margin: 48rpx 0;
  }
  .title {
    font-size: 36rpx;
    font-weight: 500;
    color: #3d3d3d;
  }
  .btn {
    margin: 48rpx 0;
    padding: 0 260rpx;
    font-size: 32rpx;
    color: #ffffff;
    border-radius: 100rpx;
    background: #3458DF;
  }
  .prompt {
    padding: 16rpx 0 40rpx;
    color: #666666;
  }
  .info {
    margin: 0 52rpx;
    padding: 32rpx;
    border-radius: 16rpx;
    background: rgba(52, 88, 223, 0.1);
    color: #333333;
    .text {
      padding: 16rpx 0;
    }
  }
  .read {
    color: #999999;
    .path {
      color: #3458DF;
    }
  }
}
</style>
