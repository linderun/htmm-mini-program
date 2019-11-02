<template>
  <div>
    <div class="text-center">
		<span class="payitem" v-for="(item,index) in list" @click="selectnum(index)" :key="index"
          :class="{'active':item.sel}">{{item.recharge + item.money}}
		<view>售价：￥{{item.recharge}}</view></span>
    </div>
    <div class="paybtn" @click="paymoney">充值</div>
  </div>
</template>

<script>
    import api from '@/utils/api'

    export default {

        data() {
            return {
                list: [],
                money: 0
            }
        },
        onShow() {

        },
        mounted() {
            var that = this;
            api.getRechargeAmount().then(function (data) {
                var da = data.param;
                if (da.code == 200) {
                    da.data.each(function (i, v) {
                        da.data[i]["sel"] = false
                    });
                    that.list = da.data;
                } else {
                    wx.showToast({
                        title: '获取充值金额失败',
                        icon: 'none'
                    });
                }
            })
        },
        onUnload() {

        },
        methods: {
            selectnum(index) {

                if (this.list[index].sel) {
                    this.list[index].sel = !this.list[index].sel;
                    this.money = 0;
                } else {
                    this.list.forEach(item => item.sel = false);
                    this.list[index].sel = true;
                    this.money = this.list[index].name
                }
            },
            paymoney() {
                if (this.money > 0) {

                } else {
                    wx.showToast({
                        title: '请选择充值金额',
                        icon: 'none'
                    });
                }
            }
        },
        watch: {},
        computed: {}
    }
</script>

<style scoped>
  .text-center {
    text-align: center;
  }

  .payitem {
    color: #ff5555;
    border: 1px solid #ff5555;
    border-radius: 5px;
    margin: 10 rpx .5%;
    padding: 10 rpx 20 rpx;
    display: inline-block;
    font-size: 40 rpx;
    width: 30%;
    box-sizing: border-box;

  }

  .payitem view {
    color: #999;
    font-size: 30 rpx;
  }

  .payitem.active {
    background: #ff5555;
    color: #fff;
  }

  .payitem.active view {
    color: #fff;
  }

  .paybtn {
    background: #ff5555;
    color: #fff;
    text-align: center;
    line-height: 80 rpx;
    border-radius: 10 rpx;
    margin: 10px 20px;
  }
</style>
