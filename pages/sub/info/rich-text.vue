<template>
  <view class="rich-text u-safe-btm">
    <view class="title">{{ info.mtitl }}</view>
    <view class="hint uCenterXY">
      <text class="text">来源：{{ info.ly }} </text>
      <text class="text">发布日期{{ info.updateTime }} </text>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view v-html="info.contentInfo"></view>
    <!-- #endif -->

    <!-- #ifdef MP-ALIPAY -->
    <mp-html :content="info.contentInfo" />
    <!-- #endif -->
  </view>
</template>

<script>
import { INFO_KEY } from "@constant/storageKey";

// #ifdef MP-ALIPAY
// import mpHtml from "@/components/mp-html/mp-html";
import mpHtml from "@/uni_modules/mp-html/mp-html";

// #endif

export default {
  // #ifdef MP-ALIPAY
  components: {
    mpHtml,
  },
  // #endif

  data() {
    return {
      info: {},
    };
  },

  mounted() {
    this.info = this.storage.get(INFO_KEY);
  },

  methods: {},
};
</script>
<style lang="less" scoped>
.rich-text {
  padding: 32rpx;
  min-height: 100vh;
  box-sizing: border-box;
  .title {
    text-align: center;
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
  }

  .hint {
    margin: 20rpx 0 32rpx;
    color: #999;
    font-size: 24rpx;
    .text {
      padding-right: 16rpx;
    }
  }
}
</style>
