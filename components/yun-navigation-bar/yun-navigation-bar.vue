<template>
  <view
    class="yun-navigation-bar"
    :style="[
      {
        height: navBarHeight + 'px',
        paddingTop: statusBarHeight + 'px',
      },
      navStyle,
    ]"
  >
    <view class="nav uBet">
      <view class="slot">
        <slot />
      </view>
      <view
        v-if="isMockCapsule"
        class="mock-capsule"
        :style="{ width: fixedWidth + 'px' }"
      />
    </view>
  </view>
</template>

<script>
import { mapMutations } from "vuex";
// 防止使用多次 getMenuButtonBoundingClientRect 读取不到信息的bug，第一次就把他缓存下来
let cacheRect;
export default {
  props: {
    navStyle: {
      type: [Object, null],
      default() {
        return {};
      },
    },
    isMockCapsule: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  data() {
    return {
      statusBarHeight: 20,
      navBarHeight: 44,
      fixedWidth: 96, // 微信胶囊位置， 支付宝是胶囊 + 收藏 + 间距
    };
  },
  created() {
    const systemInfo = uni.getSystemInfoSync(); // 手机设备信息
    if (!cacheRect) {
      cacheRect = uni.getMenuButtonBoundingClientRect(); // 胶囊的位置信息
    }

    const navBarHeight = (function () {
      //导航栏高度
      const gap = cacheRect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
      return 2 * gap + cacheRect.height;
    })();

    this.statusBarHeight = systemInfo.statusBarHeight;
    this.navBarHeight = navBarHeight;
    this.fixedWidth = systemInfo.windowWidth - cacheRect.left;

    // #ifdef MP-ALIPAY
    this.fixedWidth += (function () {
      //导航栏高度
      const gap = cacheRect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
      return gap + cacheRect.height;
    })();

    // 安卓机 减3个 px
    if (systemInfo.platform === "android") {
      this.fixedWidth -= 3;
    }
    // #endif
  },
  watch: {
    statusBarHeight(val) {
      this.setAppState({ key: "statusBarHeight", value: val });
    },
    navBarHeight(val) {
      this.setAppState({ key: "navBarHeight", value: val });
    },
  },
  methods: {
    ...mapMutations({
      setAppState(commit, info) {
        commit("app/UPDATE_APP_STATE", info);
      },
    }),
  },
};
</script>

<style scoped lang="less">
.yun-navigation-bar {
  .nav {
    height: 100%;
  }

  .slot {
    flex: 1 1 auto;
    height: 100%;
  }
  .mock-capsule {
    flex-shrink: 0;
    height: 100%;
  }
}
</style>
