<template>
  <view class="myPop-box">
    <one-popup ref="popup">
      <view class="popup-content">
        <view class="modelWrap">
          <view class="pop-title">实名认证</view>
          <view class="pop-img"
            ><image
              src="https://nccsdn.yunshangnc.com/cityBrainItems-api/cityProfile/upload/2022/static/serve/pop.png"
            ></image
          ></view>
          <view class="pop-text">因业务需要，使用本服务前需完成实名认证</view>
          <view class="btn-box">
            <view class="btn-base btn1" @tap="popHandle('close')">取消</view>
            <view class="btn-base btn2" @tap="popHandle('confirm')">确认</view>
          </view>
        </view>
      </view>
    </one-popup>
  </view>
</template>

<script>
import onePopup from "../one-popup/one-popup.vue";
export default {
  name: "myPop",
  components: {
    onePopup,
  },
  data() {
    return {};
  },
  methods: {
    open() {
      this.$refs.popup.open();
    },
    popHandle(str) {
      this.$refs.popup.close();
      str == "close"
        ? ""
        : uni.navigateTo({ url: "/pagesA/personCenter/authentication" });
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-content {
  background-color: white;
  border-radius: 20rpx;
  .modelWrap {
    padding: 30rpx 40rpx 20rpx;
    .pop-title {
      font-size: 34rpx;
      color: #333333;
      text-align: center;
      font-weight: bold;
    }
    .pop-img {
      margin-top: 20rpx;
      display: flex;
      width: 380rpx;
      height: 137rpx;
      background-color: #ebf3fa;
      border-radius: 20rpx;
      justify-content: center;
      image {
        width: 236rpx;
        height: 139rpx;
      }
    }
    .pop-text {
      width: 380rpx;
      font-size: 24rpx;
      color: #333333;
      margin-top: 30rpx;
    }
    .btn-box {
      margin-top: 40rpx;
      display: flex;
      justify-content: space-between;
      .btn-base {
        width: 160rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: 26rpx;
        border-radius: 15rpx;
        margin: 0;
        border: none;
        outline: none;
        &:active {
          opacity: 0.8;
        }
      }
      .btn1 {
        color: #333333;
        background-color: white;
        border: 2rpx solid #333333;
        &:active {
          background-color: rgba(51, 51, 51, 0.1);
        }
      }
      .btn2 {
        color: white;
        background-color: #007aff;
      }
    }
  }
}
</style>
