<template>
  <!-- 
	swiper中的transfrom会使fixed失效,此时用height固定高度; 
	swiper中无法触发mescroll-mixins.js的onPageScroll和onReachBottom方法,只能用mescroll-uni,不能用mescroll-body
	-->
  <!-- ref动态生成: 字节跳动小程序编辑器不支持一个页面存在相同的ref (如不考虑字节跳动小程序可固定值为 ref="mescrollRef") -->
  <!-- top的高度等于悬浮菜单tabs的高度 -->
  <mescroll-uni
    :ref="'mescrollRef' + i"
    @init="mescrollInit"
    :height="height"
    :down="downOption"
    @down="downCallback"
    :up="upOption"
    @up="upCallback"
    @emptyclick="emptyClick"
  >
    <view class="channel-content">
      <image class="img" :src="info.imgUrl" />
      <view v-if="!list.length" class="empty-wrap">
        <image
          class="empty"
          src="https://api.yunshangnc.com/client-img/inc-miniapp/my/empty_data.png"
        />
      </view>
      <view
        class="item uCol"
        v-for="item in list"
        :key="item.maid"
        @click="handleJumpByInfo(item)"
      >
        <view class="title u-ellipsis-2">{{ item.mtitl }}</view>
        <view class="text-wrap uBet">
          <text>{{ item.ly }}</text>
          <text>{{ item.mtime }}</text>
        </view>
      </view>
    </view>
  </mescroll-uni>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollMoreItemMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mixins/mescroll-more-item.js";

import { queryGetManuscriptPage } from "@api/index";
import { INFO_KEY } from "@constant/storageKey";
import { openPage, SUB_INFO_RICH_TEXT } from "@utils/open-uniapp-page";
export default {
  mixins: [MescrollMixin, MescrollMoreItemMixin], // 注意此处还需使用MescrollMoreItemMixin (必须写在MescrollMixin后面)
  props: {
    i: Number, // 每个tab页的专属下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
    index: {
      // 当前tab的下标 (除了支付宝小程序必须在这里定义, 其他平台都可不用写, 因为已在MescrollMoreItemMixin定义)
      type: Number,
      default() {
        return 0;
      },
    },

    height: [Number, String], // mescroll的高度
    info: {
      type: Object,
      default() {
        return {};
      },
    },
    searchValue: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      downOption: {
        auto: false, // 不自动加载 (mixin已处理第一个tab触发downCallback)
        offset: 150,
        textColor: "#fff",
      },
      upOption: {
        auto: false, // 不自动加载
        // page: {
        // 	num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
        // 	size: 10 // 每页数据的数量
        // },
        noMoreSize: 4, //如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
        empty: {
          use: false,
        },
      },
      list: [], //列表数据
    };
  },

  watch: {
    searchValue() {
      // isNeedRestSign 场景 在第一个页面搜索后，到第二个页面清空搜索。第一个页面的数据还是搜索的数据，回来的时候搜索又是清空的所以需要
      if (this.index === this.i) {
        this.isNeedRestSign = true;
        this.mescroll.resetUpScroll();
      }
    },
    index() {
      if (this.index === this.i && this.isNeedRestSign) {
        this.isNeedRestSign = false;
        this.mescroll.resetUpScroll();
      }
    },
  },

  methods: {
    /*下拉刷新的回调 */
    downCallback() {
      // 这里加载你想下拉刷新的数据, 比如刷新轮播数据
      // loadSwiper();
      // 下拉刷新的回调,默认重置上拉加载列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
      this.mescroll.resetUpScroll();
    },
    /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
    upCallback(page) {
      queryGetManuscriptPage({
        data: {
          pageSize: page.size,
          pageNum: page.num,
          chid: this.info.chid,
          keyword: this.searchValue,
        },
      })
        .then((res) => {
          this.mescroll.endBySize(res.records.length, res.total);
          if (page.num == 1) this.list = [];
          this.list = this.list.concat(res.records);
        })
        .catch(() => {
          //联网失败, 结束加载
          this.mescroll.endErr();
        });
    },
    //点击空布局按钮的回调
    emptyClick() {
      uni.showToast({
        title: "点击了按钮,具体逻辑自行实现",
      });
    },
    handleJumpByInfo(item) {
      this.storage.set(INFO_KEY, item);
      openPage(SUB_INFO_RICH_TEXT);
    },
  },
};
</script>
<style lang="less">
.channel-content {
  padding: 32rpx;
  margin: 32rpx;
  border-radius: 16rpx;
  background: #fff;
  .img {
    width: 622rpx;
    height: 174rpx;
  }

  .item {
    padding: 26rpx 0;
    border-bottom: 2rpx solid #eeeeee;
    .title {
      font-size: 28rpx;
      color: #333;
    }
    .text-wrap {
      padding-top: 54rpx;
      font-size: 24rpx;
      color: #999999;
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
</style>
