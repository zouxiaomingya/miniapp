<template>
  <view class="reset-password">
    <view class="content">
      <view class="input-item">
        <view class="title"> 手机号 </view>
        <view class="input-wrap">
          <uni-easyinput
            v-model="phone"
            :inputBorder="false"
            type="number"
            placeholder="请输入您的手机号"
            placeholderStyle="color:#ccc; font-size:28rpx"
          />
        </view>
      </view>
      <view class="input-item">
        <view class="title"> 验证码 </view>
        <view class="input-wrap uBet uCenterY">
          <uni-easyinput
            v-model="code"
            :inputBorder="false"
            type="number"
            placeholder="请输入短信验证码"
            placeholderStyle="color:#ccc; font-size:28rpx"
          />
          <view
            class="acquire"
            @click="onGetSmsCode"
            :class="{ count: !codeFlag }"
          >
            {{ codeTxt }}
          </view>
        </view>
      </view>
      <view class="btn" @click="handleSubmit">确认注销</view>
    </view>
  </view>
</template>

<script>
import { fetchSendSmsCode, fetchCloseAccount } from "@api/index";
import { SENDSMS_CATEGORY_MAP } from "@constant/login";
import { openPage, MAIN_HOME } from "@utils/open-uniapp-page";
import store from "@store";
import { mapMutations } from "vuex";
export default {
  onLoad() {},

  data() {
    return {
      codeTxt: "获取验证码",
      codeFlag: true, // 控制按钮是否可点击
      phone: store.state.user.userInfo.phoneExt, // 手机号
      code: "", // 短信验证码
    };
  },

  mounted() {},
  methods: {
    ...mapMutations({
      removeToken(commit) {
        commit("user/REMOVE_TOKEN");
      },
    }),
    handleSubmit() {
      const _this = this;
      const { phone, code, key } = this;
      if (!phone) {
        return uni.showToast({
          title: "手机号不能为空",
          icon: "none",
        });
      }

      if (!code) {
        return uni.showToast({
          title: "请输入验证码",
          icon: "none",
        });
      }

      if (!key) {
        return uni.showToast({
          title: "请获取验证码",
          icon: "none",
        });
      }

      fetchCloseAccount({
        data: {
          key,
          code,
          phone,
        },
      }).then(() => {
        uni.showToast({
          title: "注销成功",
          icon: "none",
        });
        _this.removeToken();
        setTimeout(() => {
          openPage(MAIN_HOME);
        }, 1000);
      });
    },
    onGetSmsCode() {
      const { phone } = this;
      if (!phone) {
        return uni.showToast({
          title: "手机号不能为空",
          icon: "none",
        });
      }
      fetchSendSmsCode({
        data: {
          phone: phone,
          type: SENDSMS_CATEGORY_MAP.close,
        },
      }).then((res) => {
        uni.showToast({
          title: "验证码发送成功",
          icon: "success",
        });

        const { key } = res;
        this.key = key;
        let time = 60;
        this.codeFlag = false;
        this.codeTxt = `${time}(S)`;
        let timer = setInterval(() => {
          if (time <= 1) {
            this.codeTxt = "获取验证码";
            this.codeFlag = true;
            clearInterval(timer);
          } else {
            time--;
            this.codeTxt = `${time}(S)`;
          }
        }, 1000);
      });
    },
  },
};
</script>

<style scoped lang="less">
.reset-password {
  min-height: 100vh;
  background: #fff;
  .content {
    padding: 128rpx 48rpx 0;
    .input-item {
      padding: 32rpx 0;
      border-bottom: 2rpx solid #eee;
      .title {
        padding: 12rpx 0;
        font-size: 32rpx;
      }
      .input-wrap {
        font-size: 28rpx;
        flex: 1 1 auto;
        /deep/ .uni-easyinput__content-input {
          padding-left: 0px !important;
          font-size: 28rpx !important;
        }
        .acquire {
          color: #3458df;
        }
        .count {
          color: #ccc;
        }
      }
    }
    .btn {
      margin-top: 144rpx;
      padding: 24rpx 0;
      border-radius: 44rpx;
      text-align: center;
      font-size: 28rpx;
      background: #3458df;
      color: #fff;
    }
  }
}
</style>
