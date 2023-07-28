<template>
  <view class="about"> 当前版本 {{ version }} </view>
</template>

<script>
import { version } from "../../../package.json";
export default {
  data() {
    return {
      version: version || "1.0.0",
    };
  },

  mounted() {},
  methods: {},
};
</script>

<style>
.about {
  padding: 20px;
  font-size: 14px;
}
</style>
