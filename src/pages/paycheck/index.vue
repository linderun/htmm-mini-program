<template>
	<div>
		<div class="text-center">
		<span class="payitem" v-for="(item,index) in list" @click="selectnum(index)" :key="index" :class="{'active':item.sel}">{{item.name}}
		<view>售价：￥{{item.money}}</view></span>
	</div><div class="paybtn" @click="paymoney">充值</div>
	</div>
</template>

<script>
	export default {
	
		data() {
			return {
				list: [{
					name: 100,
					money:100,
					sel: false
				}, {
					name: 300,money:100,
					sel: false
				},{
					name: 500,money:500,
					sel: false
				},{
					name: 1000,money:1000,
					sel: false
				},{
					name: 2000,money:2000,
					sel: false
				},{
					name: 5000,money:5000,
					sel: false
				}],
				money:0
			}
		},
		onShow() {
			
		},
		mounted() {
		
		},
		onUnload() {
			
		},
		methods: {
			selectnum(index){
				
				if(this.list[index].sel){
					this.list[index].sel=!this.list[index].sel;
					this.money=0;
				}else{
					this.list.forEach(item=>item.sel=false);
					this.list[index].sel=true;
					this.money=this.list[index].name
				}
			},
			paymoney(){
				if(this.money>0){
					
				}else{
					wx.showToast({
						title: '请选择充值金额',
						icon: 'none'
					});
				}
			}
		},
		watch: {

		},
		computed: {

		}
	}
</script>

<style scoped>
	.text-center{
		text-align: center;
	}
	.payitem{
		color: #ff5555;
		border: 1px solid #ff5555;
		border-radius: 5px;
		margin: 10rpx .5%;
		padding: 10rpx 20rpx;
		display: inline-block;
		font-size: 40rpx;
		width: 30%;
		box-sizing: border-box;
		
	}.payitem view{
		color: #999;
		font-size: 30rpx;
	}
	.payitem.active{
		background: #ff5555;
		color: #fff;
	}	.payitem.active view{
		color: #fff;
	}
	.paybtn{
		background: #ff5555;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		border-radius: 10rpx;
		margin: 10px 20px;
	}
</style>
