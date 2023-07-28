<template>
  <view class="hot-info">
    <view class="list">
      <view class="info-item">
        <view class="title-wrap uBet">
          <view class="uCenterY">
            <image class="icon" :src="info.headImg"></image>
            <view class="title uCol">
              <view>{{ info.nickName }}</view>
              <view>{{ info.nickName }}</view>
            </view>
          </view>
          <view
            v-if="!info.subscriptionStatus"
            class="subscribe uCenterXY"
            @click="handleGoLoginPage()"
          >
            <uni-icons type="plusempty" size="16" color="#506DF3" />
            <text> 订阅</text>
          </view>
          <view
            v-else
            class="subscribe no-subscribe uCenterXY"
            @click="handleGoLoginPage()"
          >
            <uni-icons type="checkmarkempty" size="16" color="#999" />

            <text> 取消订阅</text>
          </view>
        </view>
        <view class="list">
          <view
            class="item uBet"
            v-for="(_item, index) in info.articleVOList"
            :key="index"
            @click="handleJumpByLink(_item.link, _item.id)"
          >
            <view class="content uBet uCol">
              <view class="detail u-ellipsis-2">{{ _item.title }}</view>
              <view class="time uCenterY">{{ _item.createTime }}</view>
            </view>
            <view class="img uCenterY">
              <image :src="_item.cover" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { verifyIsLogin } from "@utils/open-uniapp-page";
import {
  fetchSubscribeAccount,
  fetchUnSubscribeAccount,
  fetchBrowseArticle,
  queryAccountArticleInfo,
} from "@api/index";
export default {
  data() {
    return {
      subscribeList: [],
      info: {
        accountId: "",
        articleVOList: [],
        headImg: "",
        nickName: "",
        subscriptionStatus: false,
        total: 0,
      },
    };
  },
  onLoad(option) {
    const { accountId } = option;
    this.getInfoList(accountId);
  },
  methods: {
    getInfoList(accountId) {
      queryAccountArticleInfo({
        data: {
          accountId,
          pageNum: 1,
          pageSize: 10,
        },
      }).then((res = {}) => {
        this.info = res;
      });
    },
    handleGoLoginPage() {
      const { accountId, nickName, subscriptionStatus } = this.info;
      const _this = this;
      verifyIsLogin().then(() => {
        if (!subscriptionStatus) {
          fetchSubscribeAccount({
            data: {
              accountId,
            },
          }).then(() => {
            _this.info.subscriptionStatus = !subscriptionStatus;
          });
        } else {
          uni.showModal({
            title: "提示",
            content: `确定取消${nickName}的资讯订阅`,
            success: function () {
              fetchUnSubscribeAccount({
                data: {
                  accountId,
                },
              }).then(() => {
                _this.info.subscriptionStatus = !subscriptionStatus;
              });
            },
          });
        }
      });
    },
    handleJumpByLink(link, articleId) {
      this.openWebView(link);

      // verifyIsLogin(false).then(() => {
      //   fetchBrowseArticle({
      //     data: {
      //       articleId,
      //     },
      //   });
      // });
    },
  },
};
</script>

<style scoped lang="less">
.hot-info {
  min-height: 100vh;
  background-color: #f7f8ff;
  .list {
    .info-item {
      margin: 0 30rpx 0rpx 30rpx;
      padding: 26rpx;
      border-radius: 16rpx;
      background-color: #ffffff;
      color: #333333;
      .title-wrap {
        .icon {
          width: 26px;
          height: 26px;
          margin-right: 14rpx;
          border-radius: 50%;
        }
        .title :first-child {
          padding-bottom: 6rpx;
          font-size: 26rpx;
          font-weight: 400;
          color: #333333;
        }
        .title :last-child {
          font-size: 22rpx;
          font-weight: 300;
          color: #999999;
        }
        .subscribe {
          width: 74px;
          height: 30px;
          background: #ffffff;
          border: 1px solid #506df3;
          border-radius: 15px;
          image {
            width: 22rpx;
            height: 22rpx;
          }
          text {
            margin-left: 4rpx;
            font-size: 22rpx;
            font-weight: bold;
            color: #506df3;
          }
        }
        .no-subscribe {
          border: none;
          background-color: #f5f5f5;
          font-size: 12px;
          text {
            color: #999;
          }
        }
      }
      .list {
        margin-top: 16rpx;
        .item {
          padding: 32rpx 0 32rpx 0;
          border-bottom: 2rpx solid #eeeeee;
          .content {
            font-weight: 400;
            margin-right: 10px;
            .time {
              font-size: 24rpx;
              color: #999999;
            }
            .detail {
              font-size: 28rpx;
              overflow: hidden;
            }
          }
          .img image {
            width: 240rpx;
            height: 186rpx;
          }
        }
      }
    }
  }
}
</style>
