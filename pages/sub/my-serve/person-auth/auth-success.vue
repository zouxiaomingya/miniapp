<template>
  <view class="auth-success">
    <view class="content uCenterY uCol">
      <image
        class="logo"
        src="https://api.yunshangnc.com/client-img/inc-miniapp/my/auth_success.png"
        mode="scaleToFill"
      />
      <view class="title"> 已通过实名认证 </view>
      <view class="prompt"> 尽情使用所有功能吧~ </view>
      <view class="info-wrap">
        <view class="info">证件姓名：{{ userInfo.nickname }} </view>
        <view>证件号码：{{ userInfo.idCard }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

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
  },
};
</script>

<style scoped lang="less">
.auth-success {
  min-height: 100vh;
  background: #fff;
  font-size: 28rpx;
  color: #333333;
  .content {
    padding-top: 64rpx;
    .logo {
      width: 370rpx;
      height: 396rpx;
    }
    .title {
      padding: 32rpx 0 16rpx;
      font-size: 48rpx;
    }
    .prompt {
      font-size: 32rpx;
      color: rgba(51, 51, 51, 0.4);
    }
    .info-wrap {
      padding-top: 72rpx;
      .info {
        padding-bottom: 32rpx;
      }
    }
  }
}
</style>
