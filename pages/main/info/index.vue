<template>
  <view class="info">
    <mescroll-body
      ref="mescrollRef"
      @down="downCallback"
      @up="upCallback"
      :down="downOption"
      :up="upOption"
    >
      <view class="container-wrap">
        <view class="card" v-if="hotInfoList.length">
          <view class="hot-info-list">
            <view
              class="item uBet"
              v-for="(_item, index) in hotInfoList"
              :key="index"
              @click="handleJumpByLink(_item.link, _item.id)"
            >
              <view class="content uBet uCol">
                <view class="detail u-ellipsis-2">{{ _item.title }}</view>
                <view class="uBet uCenterY">
                  <view class="time uCenterY">{{ _item.accountName }}</view>
                  <view class="time uCenterY">{{ _item.createTime }}</view>
                </view>
              </view>
              <image class="hot-img" :src="_item.cover" mode="aspectFill" />
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>
    <view class="tab-bar-space" />
  </view>
</template>

<script>
import MescrollMixin from "@uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { queryArticlePage } from "@api/index";
export default {
  mixins: [MescrollMixin],
  data() {
    return {
      hotInfoList: [],
      downOption: {
        offset: 150,
        textColor: "#fff",
      },

      upOption: {
        empty: {
          use: false,
        },
        toTop: {
          bottom: 240,
        },
      },
    };
  },

  watch: {},
  mounted() {},
  methods: {
    downCallback() {
      this.mescroll && this.mescroll.resetUpScroll();
    },

    upCallback(option) {
      const _this = this;
      this.getHotInfo(option)
        .then((res) => {
          const { total, records = [] } = res;
          _this.mescroll && _this.mescroll.endByPage(records.length, total);
        })
        .catch(() => {
          _this.mescroll && _this.mescroll.endErr();
        });
    },
    getHotInfo(option) {
      const { num: pageNum = 1, size: pageSize = 20 } = option;
      return queryArticlePage({
        data: {
          pageNum,
          pageSize,
        },
      }).then((res) => {
        const { records } = res;
        if (+pageNum === 1) {
          this.hotInfoList = records;
        } else {
          this.hotInfoList.push(...records);
        }
        return res;
      });
    },

    handleJumpByLink(link, articleId) {
      this.openWebView(link);
    },
  },
};
</script>

<style scoped lang="less">
.info {
  width: 100%;
  min-height: 100vh;
  background-color: #f7f8ff;
  color: #333333;

  .container-wrap {
    padding: 0 30rpx 30rpx;
    background: #fff;
    .card {
      border-radius: 16rpx;
      background: #fff;
      .hot-info-list {
        .item {
          width: 100%;
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
          .hot-img {
            width: 168rpx;
            height: 160rpx;
            flex-shrink: 0;
          }
        }
      }
    }
  }
}
</style>
