<template>
  <view class="person-auth">
    <view class="content">
      <view class="info-wrap">
        <view class="info">姓名：{{ userInfo.nickname }}</view>
        <view class="info">身份证号：{{ userInfo.idCard }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },

  computed: {
    ...mapState("user", ["userInfo"]),
  },

  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.person-auth {
  min-height: 100vh;
  background-color: #fff;
  .content {
    margin: 32rpx;
    height: 302rpx;
    background: url("https://api.yunshangnc.com/client-img/inc-miniapp/my/auth-bg2.png")
      no-repeat;
    background-size: 100% 302rpx;
    .info-wrap {
      padding-top: 186rpx;
      padding-left: 32rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      .info {
        padding-bottom: 16rpx;
      }
    }
  }
}
</style>