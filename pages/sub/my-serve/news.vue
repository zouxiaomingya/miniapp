<template>
  <view class="news">
    <view class="list">
      <view
        class="item uCenterY uBet"
        v-for="item in list"
        :key="item.title"
        @click="handleJumpPage(item)"
      >
        <view class="uCenterY">
          <image class="img" :src="item.imgUrl" />
          <view class="title">{{ item.title }}</view>
        </view>
        <view class="number uCenterXY">{{ item.number }}</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/icon/news-1.png",
          title: "系统通知",
          number: 1,
        },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/icon/news-3.png",
          title: "服务通知",
          number: 2,
        },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/icon/news-4.png",
          title: "推广通知",
          number: 1,
        },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/icon/news-2.png",
          title: "其他消息",
          number: 3,
        },
      ],
    };
  },

  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.news {
  min-height: 100vh;
  background: #ffffff;
  .list {
    margin: 0 48rpx;
    border-radius: 16rpx;
    
    .item {
      padding: 32rpx 0;
      border-bottom: 2rpx solid #f6f6f6;
    }

    .img {
      width: 100rpx;
      height: 100rpx;
    }

    .title {
      padding-left: 32rpx;
      font-size: 36rpx;
      color: #333333;
    }
    .number {
      width: 34rpx;
      height: 34rpx;
      border-radius: 50%;
      font-size: 24rpx;
      color: #ffffff;
      background: #f3332e;
    }
  }
}
</style>