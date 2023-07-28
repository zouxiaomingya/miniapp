<template>
  <mescroll-uni
    @init="mescrollInit"
    :height="height"
    :down="downOption"
    @down="downCallback"
    :up="upOption"
    @up="upCallback"
  >
    <view class="container">
      <view v-if="subscribeList.length" class="subscription">
        <view class="title">我的订阅</view>
        <scroll-view scroll-x="true" class="scroll-content">
          <view
            class="text-wrap uCol"
            v-for="(subItem, index) in subscribeList"
            :key="index"
            @click="handleGoOfficialAccountPage(subItem.accountId)"
          >
            <image class="icon" :src="subItem.headImg" />
            <view class="text">{{ subItem.nickName }}</view>
          </view>
        </scroll-view>
      </view>
      <view class="list">
        <view v-if="!infoList.length" class="empty-wrap">
          <image
            class="empty"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/my/empty_data.png"
          />
        </view>
        <view v-for="(item, index) in infoList" class="info-item" :key="index">
          <view class="title-wrap uBet">
            <view
              class="uCenterY"
              @click="handleGoOfficialAccountPage(item.accountId)"
            >
              <image class="icon" :src="item.headImg" />
              <view class="title uCol">
                <view>{{ item.nickName }}</view>
                <view>{{ item.nickName }}</view>
              </view>
            </view>
            <view
              v-if="!item.subscriptionStatus"
              class="subscribe uCenterXY"
              @click="handleGoLoginPage(item, { index, goSubscribe: true })"
            >
              <uni-icons type="plusempty" size="16" color="#506DF3" />
              <text class="text"> 订阅</text>
            </view>
            <view
              v-else
              class="subscribe no-subscribe uCenterXY"
              @click="handleGoLoginPage(item, { index, goSubscribe: false })"
            >
              <uni-icons type="checkmarkempty" size="16" color="#999" />

              <text class="text"> 取消订阅</text>
            </view>
          </view>
          <view class="list">
            <view
              class="item uBet"
              v-for="_item in item.articles"
              :key="_item.id"
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
  </mescroll-uni>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";
import { mapGetters } from "vuex";
import {
  openPage,
  SUB_INFO_MORE,
  SUB_HOT_INFO,
  verifyIsLogin,
} from "@utils/open-uniapp-page";
import {
  queryAccountInfo,
  fetchSubscribeAccount,
  fetchUnSubscribeAccount,
  queryFindSubscribeAccount,
  fetchBrowseArticle,
} from "@api/index";

export default {
  mixins: [MescrollMixin, MescrollMoreItemMixin],
  props: {
    height: [Number, String],
    i: Number,
    searchValue: {
      type: String,
      default() {
        return "";
      },
    },
    index: {
      type: Number,
      default() {
        return 0;
      },
    },
  },
  data() {
    return {
      downOption: {
        auto: false,
        offset: 150,
        textColor: "#fff",
      },
      upOption: {
        auto: false,
        noMoreSize: 2,
        empty: {
          use: false,
        },
      },
      goods: [],

      subscribeList: [], // 订阅列表
      infoList: [], // 列表数据
    };
  },

  computed: {
    ...mapGetters({
      isTokenValid: "user/isTokenValid",
    }),
  },

  watch: {
    searchValue() {
      this.isNeedRestSign = true;
      if (this.index === this.i) {
        this.mescroll.resetUpScroll();
      }
    },
    index(val) {
      if (this.index === this.i && this.isNeedRestSign) {
        this.isNeedRestSign = false;
        this.mescroll.resetUpScroll();
      }
    },
  },

  methods: {
    /*下拉刷新的回调 */
    downCallback() {
      this.mescroll.resetUpScroll();
    },
    upCallback(page) {
      queryAccountInfo({
        data: {
          pageSize: page.size,
          pageNum: page.num,
          accountNameLike: this.searchValue,
        },
      })
        .then((res) => {
          this.mescroll.endBySize(res.records.length, res.total);
          if (page.num == 1) this.infoList = [];
          this.infoList = this.infoList.concat(res.records);
        })
        .catch(() => {
          this.mescroll.endErr();
        });
    },

    getSubscribeList() {
      if (!this.isTokenValid) return;
      queryFindSubscribeAccount({
        data: {
          pageNum: 1,
          pageSize: 100, // TODO 先不分页
        },
      }).then((res = {}) => {
        const { records } = res;
        this.subscribeList = records;
      });
    },

    handleGoMorePage() {
      openPage(SUB_INFO_MORE);
    },

    handleGoLoginPage(item, params) {
      const { accountId, nickName } = item;
      const { index, goSubscribe } = params;
      const _this = this;
      const filterInfoByKey = ({ list, key, value }) =>
        list.filter((item) => item[key] !== value);
      verifyIsLogin().then(() => {
        if (goSubscribe) {
          fetchSubscribeAccount({
            data: {
              accountId,
            },
          }).then(() => {
            _this.subscribeList = [item, ..._this.subscribeList];
            _this.infoList[index].subscriptionStatus = true;
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
                _this.subscribeList = filterInfoByKey({
                  list: _this.subscribeList,
                  key: "accountId",
                  value: accountId,
                });
                _this.infoList[index].subscriptionStatus = false;
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
    handleGoMorePage() {
      openPage(SUB_INFO_MORE);
    },
    handleGoOfficialAccountPage(_accountId) {
      openPage(SUB_HOT_INFO, { accountId: _accountId });
    },
  },
};
</script>

<style lang="less">
.container {
  .subscription {
    padding: 15px 15px 0 15px;
    background: #fff;
    color: #333333;

    .title {
      font-size: 30rpx;
    }
    .scroll-content {
      width: 100%;
      white-space: nowrap;
      padding: 40rpx 0;
      .text-wrap {
        width: 22%;
        display: inline-block;
        text-align: center;
        .icon {
          width: 30px;
          height: 30px;
        }
        .text {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 20rpx;
        }
      }
    }
  }
  .list {
    margin-top: 32rpx;
    .info-item {
      margin: 0 30rpx 0rpx 30rpx;
      margin-bottom: 16rpx;
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
          width: 80px;
          height: 30px;
          background: #ffffff;
          border: 1px solid #506df3;
          border-radius: 15px;
          image {
            width: 22rpx;
            height: 22rpx;
          }
          .text {
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
          .text {
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

    .empty-wrap {
      text-align: center;
      .empty {
        width: 400rpx;
        height: 320rpx;
        margin: 128rpx 0;
      }
    }
  }
}
</style>
