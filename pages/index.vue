<template>
  <view class="home">
    客户经常会有大额应收需要开票
    ，但是单张发票有金额限制，一旦单笔业务销售额超过其增值税发票的最高开票限额时，
    就必须拆分成多张发票开具。大多数财务都是手工拆分发票，使得开票过程变得更加复杂，
    财务人员不仅开票压力大，工作量繁重，且无法保证开票数据的100%准确。
    今天就给大家分享一个发票超限额自动拆分的功能，下面就来看一下怎么操作,
    点击下方【发票】，输入发票所需数据点击自动拆分，系统将会拆分好所需数据
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },

  computed: {},

  mounted() {},
  methods: {},
};
</script>

<style scoped lang="less">
.home {
  padding: 36rpx;
  line-height: 48rpx;
  color: #333;
}
</style>
