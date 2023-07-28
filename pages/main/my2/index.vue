<template>
  <view class="invoice">
    <view class="container">
      <view class="title">大额发票拆分</view>
      <view class="content">
        <view class="text"
          >输入开票信息（默认单张是10万元额度，增值税13%）</view
        >
        <view class="input-content">
          <view class="input-item border uCenterY">
            <view class="label required"> 开票单位</view>
            <view class="input-wrap">
              <uni-easyinput
                v-model="form.companyName"
                :inputBorder="false"
                type="text"
                placeholder="为了展示提醒作用"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="input-item border uCenterY">
            <view class="label required"> 首张发票号码</view>
            <view class="input-wrap">
              <uni-easyinput
                v-model="form.order"
                :inputBorder="false"
                type="number"
                placeholder="开票软件与真实发票核对"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="input-item border uCenterY">
            <view class="label required"> 数量 </view>
            <view class="input-wrap">
              <uni-easyinput
                v-model="form.amount"
                :inputBorder="false"
                type="digit"
                placeholder="请输入数量"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="input-item border uCenterY">
            <view class="label required"> 单位 </view>
            <view class="input-wrap">
              <uni-easyinput
                v-model="form.type"
                :inputBorder="false"
                type="text"
                placeholder="请输入单位（千克、件等）"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="input-item border uCenterY">
            <view class="label required"> 单价 </view>
            <view class="input-wrap">
              <uni-easyinput
                v-model="form.price"
                :inputBorder="false"
                type="digit"
                placeholder="请输入单价（元）"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="input-item border uCenterY">
            <view class="label required"> 总金额 </view>
            <view class="input-wrap">
              <uni-easyinput
                v-model="form.totalPrice"
                :inputBorder="false"
                type="digit"
                placeholder="请输入总金额"
                placeholderStyle="color:#ccc; font-size:28rpx"
              />
            </view>
          </view>
          <view class="btn" @click="handleSubmit">自动拆分</view>
        </view>
      </view>
      <view class="list" v-if="list.length">
        <view class="name">{{ form.companyName }}</view>
        <view v-for="(item, index) of list" class="uCenterY uBet item">
          <view class="num">{{ index + 1 }}</view>

          <view class="content">
            <view>
              <text class="one-num"> 数量：{{ item.oneNum }} </text>
              <!-- <text class="sign">{{ item.type }}</text> -->
              <text class="type"> 单位：{{ item.type }} </text>
              <text class="order"> No.{{ Number(form.order) + index }} </text>
            </view>
            <view>单价(￥)：{{ item.price }}</view>
            <view>金额(￥)：{{ item.oneSumPrice }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
const sum = 507720.92;
const amount = 3924;
const price = 129.3886;
import { debounce } from "lodash";
import Big from "big.js";

const initData = {
  companyName: "宁波丰滕",
  order: "28400420",
  amount: "3924", // 数量
  type: "件", // 单位
  price: "129.3886", // 单价
  totalPrice: "507720.92", // 总价
};

const INIT_DATA = {
  companyName: "",
  order: "",
  amount: "", // 数量
  type: "", // 单位
  price: "", // 单价
  totalPrice: "", // 总价
};
export default {
  data() {
    return {
      form: { ...INIT_DATA, ...initData },
      list: [],
    };
  },

  computed: {},

  mounted() {},
  methods: {
    handleSubmit: debounce(function () {
      const { amount, type, price, totalPrice } = this.form;

      if (!amount || !type || !price || !totalPrice) {
        return uni.showToast({
          title: "输入框信息请输入完整",
          icon: "none",
        });
      }

      this.list = this.getNumList({
        amount,
        type,
        price,
        totalPrice,
      });
    }, 300),

    getNumList(params) {
      const { totalPrice, price, type } = params;
      console.log(params, "params>>>>>>");
      let { amount } = params;

      const maxPrice = 99999;
      const rate = 0.13;
      const MAX_PRICE_TAX = maxPrice * (1 + rate);
      // 一张的实际数量
      const oneAmount = Math.floor(MAX_PRICE_TAX / (totalPrice / amount));
      const list = [];
      let tempSumPrice = new Big(0);

      do {
        if (amount > oneAmount) {
          const oneSumPrice = oneAmount * price;
          list.push({
            type,
            oneNum: oneAmount,
            price: new Big(oneSumPrice).div(oneAmount).toString(),
            oneSumPrice,
          });
          tempSumPrice = tempSumPrice.plus(oneSumPrice);
        } else {
          const _price = new Big(totalPrice)
            .minus(tempSumPrice.toString())
            .toString();
          list.push({
            type,
            oneNum: amount, // 数量
            price: new Big(_price).div(amount).toString(), // 单价
            oneSumPrice: _price, // 总价
          });
        }
        amount -= oneAmount;
      } while (amount > 0);
      console.log(list, "list>>>>>>");

      return list;
    },
  },

  onShareAppMessage() {
    return {
      title: "发票拆分工具，快来体验", //分享标题
      path: "/pages/main/my2/index", //分享链接
    };
  },
};
</script>

<style scoped lang="less">
.invoice {
  min-height: 100vh;
  background: linear-gradient(180deg, #47a8ff 0%, #157dff 100%);
  font-size: 32rpx;
  .container {
    padding: 48rpx;
    .title {
      margin-bottom: 48rpx;
      font-size: 48rpx;
      font-weight: bold;
      color: #ffffff;
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
          padding: 20rpx;
          .label {
            flex-shrink: 0;
            &.required::after {
              padding-left: 2px;
              content: "*";
              color: red;
            }
          }
          .input-wrap {
            flex: 1 1 auto;
          }
        }
        .border {
          border-bottom: 1px solid #f6f6f6;
        }
        .btn {
          margin-top: 30rpx;
          height: 88rpx;
          line-height: 88rpx;
          border-radius: 54rpx;
          text-align: center;
          background: linear-gradient(90deg, #47a8ff 0%, #157dff 100%);
          color: #fff;
        }
      }
    }
    .list {
      margin-top: 48rpx;
      padding: 0 26rpx;
      border-radius: 24rpx;
      background: #fff;
      font-size: 28rpx;
      color: #333;

      .name {
        padding-top: 36rpx;
        font-size: 40rpx;
        text-align: center;
        color: red;
      }
      .item {
        padding: 30rpx 0;
        border-bottom: 1px solid #ccc;
        line-height: 48rpx;
        color: #333;
        &:last-child {
          border: none;
        }
        .content {
          flex: 1 1 auto;
          padding-left: 20rpx;

          .type,
          .order {
            padding-left: 32rpx;
          }

          .order {
            padding-left: 32rpx;
            color: #248aff;
            font-size: 30rpx;
          }
          .sign {
            color: red;
            padding-left: 4rpx;
            font-size: 36rpx;
          }
        }
      }
      .num {
        font-size: 40rpx;
        text-align: center;
        line-height: 80rpx;
        color: #faab00;
      }
    }
  }
}
</style>
