<template>
  <div class="booking uCenterXY">
    <img
      class="img"
      src="https://api.yunshangnc.com/client-img/inc-miniapp/my/empty_data.png"
    />
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>
<style lang="less" scoped>
.booking {
  min-height: 100vh;
  box-sizing: border-box;
  flex: 1 1 auto;
  border-radius: 8px;
  background: #fff;
  .img {
    margin-top: -100rpx;
    width: 200px;
    height: 160px;
  }
}
</style>
