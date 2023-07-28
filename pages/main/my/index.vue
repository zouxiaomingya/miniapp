<template>
  <view class="my-wrap">
    <view class="my">
      <!-- <view class="login-wrap uCenterY">
        <view class="login uCenterY">
          <image class="avatar" mode="aspectFit" :src="userInfo.headimgurl" />
          <template v-if="isTokenValid">
            <view class="name-wrap" v-if="userInfo.phone">
              <view class="name">
                {{ userInfo.nickname || userInfo.phone }}
              </view>
              <view class="phone">{{ userInfo.phone }}</view>
            </view>
            <view class="name-wrap" v-else @click="_getCurrentUserInfo">
              加载用户信息
            </view>
          </template>
          <view v-else class="name-wrap" @click="handleGoLoginPage">
            点击登录
          </view>
        </view>
      </view> -->

      <view class="list">
        <view
          class="item uCenterY uBet"
          v-for="item in list"
          :key="item.name"
          @click="handleJumpPage(item)"
        >
          <view class="uCenterY">
            <image class="img" :src="item.imgUrl" />
            <view class="name">{{ item.name }}</view>
          </view>
          <u-icon name="arrow-right" color="#ccc"></u-icon>
        </view>
      </view>
    </view>
    <view class="tab-bar-space" />
  </view>
</template>

<script>
import {
  openPage,
  jumpLoginPage,
  verifyIsLogin,
  SUB_LOGIN,
  SUB_SETTING,
  SUB_PERSON_AUTH,
  SUB_BOOKING,
  SUB_FACE_AUTH,
  SUB_HOME_CONFIRM_LOGIN_PAGE,
} from "@utils/open-uniapp-page";
import { mapState, mapGetters, mapActions } from "vuex";
import { H5_URL_MAP } from "@constant/h5";
export default {
  data() {
    return {
      list: [
        // {
        //   imgUrl:
        //     "https://api.yunshangnc.com/client-img/inc-miniapp/my/icon2-1.png",
        //   name: "实名认证",
        //   linkPath: SUB_PERSON_AUTH,
        //   isNeedLogin: true,
        //   eventId: "E0035",
        // },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/my/icon2-2.png",
          name: "工具",
          linkPath: SUB_BOOKING,
          isNeedLogin: true,
          eventId: "E0036",
        },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/my/icon2-3.png",
          name: "财务",
          eventId: "E0029",
          isNeedLogin: true,
          webPath: H5_URL_MAP.evaluation,
        },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/my/icon2-4.png",
          name: "发票",
          webPath: H5_URL_MAP.advice,
          isNeedLogin: true,
          eventId: "E0032",
        },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/my/icon2-5.png",
          name: "咨询",
          key: "call",
          eventId: "E0033",
        },
        {
          imgUrl:
            "https://api.yunshangnc.com/client-img/inc-miniapp/my/icon2-6.png",
          name: "清除缓存",
          key: "cache",
        },
      ],
    };
  },

  computed: {
    ...mapState("user", ["userInfo"]),
    ...mapGetters({
      isTokenValid: "user/isTokenValid",
    }),
  },

  methods: {
    ...mapActions({
      _getCurrentUserInfo: "app/getCurrentUserInfo",
    }),

    handleGoLoginPage() {
      jumpLoginPage(SUB_LOGIN, { name: 1, type: "" });
    },
    openScanCode() {
      this.logger({ eventId: "E0005", moduleId: "M0001" });
      verifyIsLogin().then(() => {
        uni.scanCode({
          success: function (res) {
            try {
              const { result, charSet } = res;
              // charSet: "ISO8859-1";
              // errMsg: "scanCode:ok";
              // rawData: "bmNjYjAwMTpDUk4xcTFsdmtSditNOTFIbjhVWmZFZTFSTDlHRVNoYWRTRU4zMmpDaU1PMTh2Nzd3eWhBRm9udHEvdU5EVUo0Rm9uVUZkSFdiMTlXZXlEZFJMejl3QT09";
              // result: "nccb001:CRN1q1lvkRv+M91Hn8UZfEe1RL9GEShadSEN32jCiMO18v77wyhAFontq/uNDUJ4FonUFdHWb19WeyDdRLz9wA==";
              // scanType: "QR_CODE";
              if (result && result.indexOf("nc") !== -1) {
                return openPage(SUB_HOME_CONFIRM_LOGIN_PAGE, { result });
              }

              uni.showModal({
                title: "扫码返回结果",
                confirmText: "复制",
                content: result || charSet,
                success: function (res) {
                  if (res.confirm) {
                    uni.setClipboardData({
                      data: result || charSet,
                      success: function () {
                        uni.showToast({
                          title: "复制成功",
                          icon: "none",
                        });
                      },
                    });
                  }
                },
              });
            } catch (error) {
              uni.showToast({
                title: "二维码解析异常",
                icon: "none",
              });
            }
          },
          fail(err) {
            uni.showToast({
              title: "无效二维码",
              icon: "none",
            });
          },
        });
      });
    },
    handleGoSettingPage() {
      verifyIsLogin()
        .then(() => {
          openPage(SUB_SETTING);
        })
        .catch(() => {
          uni.showToast({
            title: "请登录",
            icon: "none",
          });
        });
    },
    handleJumpPage(_item) {
      return uni.showToast({
        title: "待开发",
        icon: "none",
      });
      const { linkPath, webPath, name, key, isNeedLogin, eventId } = _item;
      if (eventId) {
        this.logger({ eventId, moduleId: "M0004" });
      }

      const callback = () => {
        if (linkPath) {
          return openPage(linkPath);
        }
        if (webPath) {
          this.openWebView(webPath, {
            title: name,
            query: {},
          });
        }
        if (key === "call") {
          return uni.makePhoneCall({
            phoneNumber: "12345",
          });
        }
        if (key === "cache") {
          this.storage.removeAsync(key);
          return uni.showToast({
            title: "清除完成",
            icon: "none",
          });
        }
      };

      if (isNeedLogin) {
        return verifyIsLogin()
          .then(() => {
            callback();
          })
          .catch(() => {
            uni.showToast({
              title: "请登录",
              icon: "none",
            });
          });
      }

      callback();
    },
    handleJumpAuthPage() {
      verifyIsLogin()
        .then(() => {
          if (+this.userInfo.authLevel === 4) {
            return openPage(SUB_PERSON_AUTH);
          }
          openPage(SUB_FACE_AUTH);
        })
        .catch(() => {
          uni.showToast({
            title: "请登录",
            icon: "none",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.my-wrap {
  min-height: 100vh;
  background: #fff;

  .my {
    .icon-wrap {
      padding: 16rpx;

      .icon {
        width: 48rpx;
        height: 48rpx;
      }
    }
    .login-wrap {
      padding: 0 32rpx 48rpx;

      .login {
        margin-left: 10rpx;
      }

      .avatar {
        width: 96rpx;
        height: 96rpx;
        border-radius: 50%;
      }

      .name-wrap {
        padding-left: 32rpx;

        .name {
          padding-bottom: 12rpx;
          font-size: 32rpx;
          font-weight: bold;
          color: #333333;
        }

        .phone {
          padding-top: 8rpx;
          font-size: 28rpx;
          color: #999999;
        }
      }
    }
    .auth-wrap {
      margin: 0 32rpx;
      padding: 32rpx;
      background: #363636;
      border-radius: 16px 16px 0px 0px;
    }
    .no-auth {
      margin: 0 32rpx;
      padding: 32rpx;
      background: url("https://api.yunshangnc.com/client-img/inc-miniapp/my/no-auth-bg.png")
        no-repeat;
      background-size: 100% 102rpx;
    }
    .auth-icon {
      width: 46rpx;
      height: 38rpx;
    }
    .title {
      padding-left: 16rpx;
      font-size: 32rpx;
      color: #ffffff;
    }
    .status {
      padding-right: 16rpx;
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.8);
    }
    .list {
      padding: 64rpx 32rpx 0;
      border-radius: 16rpx;
      background: #ffffff;

      .item {
        padding-bottom: 68rpx;

        &:last-child {
          padding-bottom: 0;
        }
      }

      .img {
        width: 48rpx;
        height: 48rpx;
      }

      .name {
        padding-left: 16rpx;
        font-size: 30rpx;
        color: #333333;
      }
    }
  }
}
</style>
