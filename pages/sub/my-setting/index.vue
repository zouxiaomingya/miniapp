<template>
  <view class="setting">
    <view class="yun-avatar-wrap">
      <yun-avatar
        @upload="uploadImage"
        ref="avatar"
        avatarStyle="height: 0"
        noTab="true"
      />
    </view>
    <view class="list-wrap">
      <view class="item uCenterY uBet" @click="handleAvatar">
        <view>更换头像</view>
        <view class="uCenterY">
          <image
            class="avatar right-distance"
            :src="userInfo.headimgurl"
            mode="aspectFit"
          />
          <image
            class="arrow"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/right_arrow.png"
          />
        </view>
      </view>
      <view class="item uCenterY uBet">
        <view>用户姓名</view>
        <view class="info uCenterY"> {{ userInfo.nickname }} </view>
      </view>
      <view class="item uCenterY uBet" @click="handleGoAuthPage">
        <view>实名认证</view>
        <view class="uCenterY">
          <image
            class="rank-icon"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/my/level-blue.png"
          />
          <text class="right-distance uCenterY">
            等级L{{ userInfo.authLevel }}
          </text>
          <image
            class="arrow"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/right_arrow.png"
          />
        </view>
      </view>
      <view class="item uCenterY uBet" @click="handleLogoutAccount">
        <view>账号注销</view>
        <view class="uCenterY">
          <view class="info right-distance">注销后无法恢复，请谨慎操作</view>
          <image
            class="arrow"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/right_arrow.png"
          />
        </view>
      </view>

      <view class="item uCenterY uBet" @click="handleGoAboutPage">
        <view>关于我们</view>
        <view class="uCenterY">
          <image
            class="arrow"
            src="https://api.yunshangnc.com/client-img/inc-miniapp/icon/right_arrow.png"
          />
        </view>
      </view>
    </view>
    <view class="logout" @click="handleGoExit"> 退出登录 </view>
    <view class="main-bottom uCenterXY">
      <view class="policy" @click="openH5PageByType('privacyAgreement')">
        隐私权政策
      </view>
      <view class="treaty" @click="openH5PageByType('userAgreement')">
        用户协议
      </view>
    </view>
  </view>
</template>

<script>
import {
  openPage,
  SUB_ABOUT,
  SUB_PASSWORD_MANAGE,
  SUB_PERSON_AUTH,
  SUB_LOG_OUT,
} from "@utils/open-uniapp-page";
import { H5_URL_MAP } from "@constant/h5";
import { queryLogOut } from "@api/index";
import { mapState, mapMutations } from "vuex";
import { uploadFullUrl, fetchAvatar } from "@api/index";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState("user", ["userInfo"]),
  },
  mounted() {},
  methods: {
    ...mapMutations({
      removeToken(commit) {
        commit("user/REMOVE_TOKEN");
      },
      updateUserInfo(commit, userInfo) {
        commit("user/UPDATE_USER_INFO", userInfo);
      },
    }),

    handleGoAuthPage() {
      openPage(SUB_PERSON_AUTH);
    },
    handleGoAboutPage() {
      openPage(SUB_ABOUT);
    },

    handleLogoutAccount() {
      openPage(SUB_LOG_OUT);
    },

    handleGoExit() {
      const _this = this;
      uni.showModal({
        title: "提示",
        content: "你确定要退出登录",
        success: function (res) {
          if (res.confirm) {
            queryLogOut().then(() => {
              // 回退到上一页
              uni.showToast({
                title: "退出成功",
                icon: "none",
              });
              _this.removeToken();
              setTimeout(() => {
                openPage("", {}, "navigateBack");
              }, 500);
            });
          }
        },
      });
    },

    handleAvatar() {
      this.$refs.avatar.fChooseImg(0, {
        selWidth: "300rpx",
        selHeight: "300rpx",
        expWidth: "150px",
        expHeight: "150px",
        canRotate: false,
        stretch: "short",
      });
    },

    uploadImage(rsp) {
      const _this = this;
      // TODO 这种上传 H5 不兼容
      this.upload(rsp.path).then((res) => {
        const { url } = res;
        if (!url) {
          return uni.showToast({
            title: "头像更新失败，请稍后重试",
            icon: "none",
          });
        }
        fetchAvatar({ data: { headimgurl: url } }).then((avatarUrl) => {
          _this.updateUserInfo({ headimgurl: avatarUrl });
          return uni.showToast({
            title: "头像上传完成",
            icon: "none",
          });
        });
      });
    },

    upload(thumb) {
      const token = `${this.storage.get("token_type")} ${this.storage.get(
        "token"
      )}`;
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: uploadFullUrl,
          filePath: thumb,
          name: "file",
          fileType: "image",
          formData: {
            bucketType: "ncbd",
          },
          header: {
            "Content-Type": "multipart/form-data",
            Authorization: token,
          },
          success: (res) => {
            try {
              res = JSON.parse(res.data);
            } catch (e) {
              reject({
                type: "minio:uploadFile",
                code: -99999,
                msg: "JSON解析错误",
              });
              console.error({
                type: "minio:uploadFile",
                code: -99999,
                msg: "JSON解析错误",
              });
            }
            if (+res.code === 200) {
              return resolve(res.data);
            } else if (+res.code === 403) {
              reject({
                type: "minio:uploadFile 403",
                code: res.code,
                msg: res.msg,
              });
              return uni.showToast({
                title: "身份失效，登录后再操作",
                icon: "none",
              });
            } else {
              reject({
                type: "minio:uploadFile",
                code: res.code,
                msg: res.msg,
              });
            }
            uni.hideLoading();
          },
          fail: (res) => {
            uni.showToast({
              title: "头像更新失败，请稍后重试",
              icon: "none",
            });
            return reject({
              type: "wx:uploadFile",
              code: -99999,
              msg: res.errMsg,
            });
          },
        });
      });
    },

    openH5PageByType(type) {
      this.openWebView(H5_URL_MAP[type]);
    },
  },
};
</script>

<style scoped lang="less">
.setting {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 40rpx;
  background-color: #f7f8ff;

  .yun-avatar-wrap {
    height: 0;
    overflow: hidden;
  }
  .list-wrap {
    padding: 0 32rpx;
    border-radius: 16rpx;
    background-color: #fff;
    .item {
      padding: 32rpx 0;
      border-bottom: 2rpx solid #eeeeee;
      color: #333;
      &:last-child {
        border-bottom: none;
      }
      .arrow {
        width: 12rpx;
        height: 24rpx;
      }
      .avatar {
        width: 50rpx;
        height: 50rpx;
      }
      .rank-icon {
        width: 38rpx;
        height: 47rpx;
        margin-right: 12rpx;
      }
      .info {
        color: #999;
        font-size: 24rpx;
      }
      text {
        color: #5da47a;
      }
      .right-distance {
        margin-right: 30rpx;
      }
    }
  }
  .logout {
    height: 100rpx;
    line-height: 100rpx;
    margin-top: 32rpx;
    border-radius: 16rpx;
    text-align: center;
    color: #e13725;
    background-color: #fff;
  }
  .main-bottom {
    margin-top: 36rpx;
    font-size: 20rpx;
    color: #999999;
    view {
      padding: 0 20rpx;
    }
    .treaty {
      border-left: 2rpx solid #999999;
    }
  }
}
</style>
