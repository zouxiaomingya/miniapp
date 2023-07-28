<template>
  <view class="face-auth">
    <view class="container">
      <view class="title">未实名认证</view>
      <view class="prompt">提升账号安全，保障合法权益</view>
      <view class="content">
        <view class="text">使用有效身份证证件信息认证</view>
        <view class="input-content">
          <view class="input-item border uCenterY">
            <view class="label"> 真实姓名 </view>
            <view>
              <uni-easyinput
                v-model="name"
                :disabled="!!userInfo.idCard"
                :inputBorder="false"
                type="text"
                placeholder="请输入姓名"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="input-item uCenterY">
            <view class="label"> 身份证号 </view>
            <view>
              <uni-easyinput
                v-model="idNo"
                :disabled="!!userInfo.idCard"
                :inputBorder="false"
                type="text"
                placeholder="请输入身份证号"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="btn" @click="handleSubmit">下一步</view>
        </view>
      </view>
      <view class="mind">
        为满足相关法律法规政策及相关主管部门的要求，我们需要收集您的姓名、身份证件号码、有关身份证明材料，以证实您的个人身份。
      </view>
    </view>
  </view>
</template>

<script>
import { fetchThirdCertifyUrl, fetchThirdFaceResultUrl } from "@api/index";
import { getCode } from "@utils/common";
import { mapState, mapActions } from "vuex";
import { openPage, SUB_AUTH_SUCCESS } from "@utils/open-uniapp-page";
import { FACE_AUTH_TYPE, currentDeviceType } from "@constant/login";
import { debounce } from "lodash";
import { LOGGER_NAME } from "@constant/storageKey";
export default {
  data() {
    return {
      name: "", // 真实姓名
      idNo: "", // 身份证号
    };
  },

  computed: {
    ...mapState("user", ["userInfo"]),
  },

  mounted() {
    // 有身份证号 就一定有nickname。用户就不能修改，直接进行认证
    if (this.userInfo.idCard) {
      this.name = this.userInfo.nickname;
      this.idNo = this.userInfo.idCard;
    }
  },
  methods: {
    ...mapActions({
      _getCurrentUserInfo: "app/getCurrentUserInfo",
    }),

    handleLogger() {
      const cacheParams = this.storage.get(LOGGER_NAME);
      this.storage.set(LOGGER_NAME, {
        ...cacheParams,
        moduleId: "M0000",
        buriedPointType: "auth",
        // "realNameMode":"" operators(运营商) face(人脸认证)
        param: {
          key: "realName",
          phone: this.userInfo.phone,
          realNameMode: "face",
        },
      });
      this.logger();
    },
    handleSubmit: debounce(function () {
      const that = this;
      const { name, idNo } = this;
      if (!name || !idNo) {
        return uni.showToast({
          title: "请填写姓名和身份证号",
          icon: "none",
        });
      }

      const { idCard, idCardEncode, nicknameEncode } = this.userInfo;
      fetchThirdCertifyUrl({
        data: {
          bizCode: "FACE",
          certName: !idCard ? getCode(name) : nicknameEncode,
          certNo: !idCard ? getCode(idNo) : idCardEncode,
          devicetype: currentDeviceType,
          type: FACE_AUTH_TYPE.authentication,
          sourceType: 15,
          returnUrl: "https://api.yunshangnc.com/",
        },
      }).then((res) => {
        // #ifdef MP-ALIPAY
        const { certifyId, url } = res;
        my.startAPVerify({
          url,
          certifyId: certifyId,
          success: function () {
            fetchThirdFaceResultUrl({
              data: {
                certifyId,
                devicetype: currentDeviceType,
                sourceType: 15,
              },
            }).then(() => {
              that._getCurrentUserInfo().then(() => {
                openPage(SUB_AUTH_SUCCESS, {}, "redirectTo");
              });
              that.handleLogger();
            });
          },
          fail: function (err) {
            console.log(err, "error");
          },
        });
        //#endif

        // #ifdef MP-WEIXIN
        const { certifyId } = res;
        wx.startFacialRecognitionVerify({
          userIdKey: certifyId,
          success(res) {
            const { verifyResult } = res;
            fetchThirdFaceResultUrl({
              data: {
                certifyId,
                verifyKey: verifyResult,
                devicetype: currentDeviceType,
                sourceType: 15,
              },
            }).then(() => {
              that._getCurrentUserInfo().then(() => {
                openPage(SUB_AUTH_SUCCESS, {}, "redirectTo");
              });
              that.handleLogger();
            });
          },
          fail(err) {
            console.log(err, "error");
          },
        });
        //#endif
      });
    }, 300),
  },
};
</script>

<style scoped lang="less">
.face-auth {
  min-height: 100vh;
  background: linear-gradient(180deg, #47a8ff 0%, #157dff 100%);
  font-size: 32rpx;
  .container {
    padding: 0 48rpx;
    background: url("https://api.yunshangnc.com/client-img/inc-miniapp/my/auth-v2.png")
      right top no-repeat;
    background-position-y: 32rpx;
    background-size: 212rpx 304rpx;
    .title {
      padding-top: 80rpx;
      font-size: 48rpx;
      font-weight: bold;
      color: #ffffff;
    }
    .prompt {
      padding-top: 16rpx;
      padding-bottom: 60rpx;
      color: rgba(255, 255, 255, 0.6);
    }
    .content {
      border-radius: 24rpx;
      background: #ffffff;
      .text {
        padding: 28rpx 32rpx 28rpx;
        background: #eaf0ff;
        font-size: 28rpx;
        border-top-left-radius: 24rpx;
        border-top-right-radius: 24rpx;
      }
      .input-content {
        padding: 0 28rpx 48rpx;
        .input-item {
          margin-top: 38rpx;
          padding-bottom: 24rpx;
          padding-left: 20rpx;
          .label {
            flex-shrink: 0;
          }
        }
        .border {
          border-bottom: 1px solid #f6f6f6;
        }
        .btn {
          margin-top: 30rpx;
          height: 108rpx;
          line-height: 108rpx;
          border-radius: 54rpx;
          text-align: center;
          background: linear-gradient(90deg, #47a8ff 0%, #157dff 100%);
          color: #fff;
        }
      }
    }
    .mind {
      margin-top: 48rpx;
      padding: 36rpx 26rpx;
      border-radius: 24rpx;
      background: #0872eb;
      font-size: 28rpx;
      color: #ffffff;
    }
  }
}
</style>
