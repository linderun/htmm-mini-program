<template>
	<div style="background: #f6f6f6;">
		<div class="userInfo flex flex-align-center">
			<div class="imgbox">
				<open-data type="userAvatarUrl"></open-data>
			</div>
			<div class="flex-1">
				<p class="name">
					<open-data type="userNickName"></open-data>
				</p>
				<p>122334556</p>
			</div>
		</div>
		<navigator :url="accountUrl" class="accountlink ">
			<div class="flex flex-align-center">
				<image src="/static/images/icon26.png" />
				<div class="flex-1 ml20">
					<p class="flex flex-pack-justify"><span class="title">账户余额</span>
						<span class="red"></span>
					</p>
				</div>
			</div>
			<p class="tip red">{{activity}}</p>
		</navigator>
		<ul class="usertab clearfix mt5">
			<li>
				<a href="/pages/order/main">
					<image src="/static/images/icon28.png" mode="aspectFit" />
					<p>我的订单</p>
				</a>
			</li>
			<li>
				<a href="/pages/score/main">
					<image src="/static/images/jf.png" mode="aspectFit" />
					<p>积分</p>
				</a>
			</li>
			<li>
				<a href="/pages/aftersale/main">
					<image src="/static/images/icon30.png" mode="aspectFit" />
					<p>售后服务</p>
				</a>
			</li>
			<li>
				<a @click="callphone">
					<image src="/static/images/icon25.png" mode="aspectFit" />
					<p>客服热线</p>
				</a>
			</li>
		</ul>
		<ul class="arrow view mt5">
			<li>
				<a href="/pages/addresslist/main"><span>收货地址管理</span>
				</a>

			</li>
			<li class="mt5">
				<a href="/pages/setphone/main"><span>设置手机号码</span>
				</a>

			</li>

			<li class="mt5">
				<a :href="'/pages/paypwd/main?phone='+phone"><span>设置密码</span>
				</a>

			</li>
			<li class="mt5">
				<a href="/pages/articlelist/main?ReadId=547"><span>常见问题</span>
				</a>

			</li>

		</ul>
	</div>
</template>

<script>
	export default {

		data() {
			return {
				canIUse: wx.canIUse('button.open-type.getUserInfo'),
				accountUrl: '',
				money: '',
				phone: '',
				userId: '',
				activity: '累积充值满5000享受终生9折优惠'

			}
		},
		methods: {
			callphone() {
				wx.makePhoneCall({
					phoneNumber: '17708513056'
				})
			},
			bindGetUserInfo: function(e) {
				//					console.log(e.detail.userInfo)
			},
			getRecharge: function() {
				let that = this;
				/* api.getRecharge({
					accessToken: wx.getStorageSync("accessToken")
				}).then(function(da) {
					if(da.code = 200) {
						that.money = da.data.money;
						that.accountUrl = `/pages/account/main?money=${that.money}&chargeId=${da.data.chargeId}`;
						that.activity = da.data.activity
					}
				}) */
				that.money = '10';
				that.accountUrl = `/pages/account/main?money=${that.money}&chargeId=111`;
			},
			//查询员工信息
			/* getUserInfo: function() {
				let that = this;
				api.getUserInfo({
					accessToken: wx.getStorageSync("accessToken")
				}).then(function(da) {
					if(da.code = 200) {
						that.phone = da.data.username.username;
						that.userId = da.data.uid;
					}
				})
			}, */

		},
		created() {

		},
		onLoad() {
			this.getRecharge();
		}


	}
</script>

<style scoped>
	.mt5 {
		margin-top: 5px;
	}
.red{
	color: #f00;
}
	/*个人信息*/

	.userInfo {
		background: #ff5454;
		color: #fff;
		height: 200rpx;
		font-size: 28rpx;
	}

	.userInfo .name {
		font-size: 36rpx;
	}

	.userInfo .imgbox {
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		overflow: hidden;
		margin: 0 40rpx;
	}

	.usertab {
		background: #fff;
	}

	.usertab li {
		float: left;
		width: 25%;
	}

	.usertab li a {
		display: block;
		text-align: center;
		font-size: 12px;
		padding: 20rpx 0;
		color: #434343;
	}

	.usertab li a image {
		display: block;
		width: 60rpx;
		height: 68rpx;
		background: no-repeat center center;
		background-size: 30px auto;
		margin: 0 auto 10px;
	}

	.usertab li a i.icon1 {
		/*background-image: url(../img/icon28.png);*/
	}

	.usertab li a i.icon2 {
		/*background-image: url(../img/icon29.png);*/
	}

	.usertab li a i.icon3 {
		/*background-image: url(../img/icon30.png);*/
	}

	.usertab li a i.icon4 {
		/*background-image: url(../img/icon25.png);*/
	}

	.accountlink {
		background: #fff;
		position: relative;
		padding: 15px 40px 15px 30px;
		display: block;
		color: #434343;
		font-size: 15px;
	}

	.accountlink image {
		vertical-align: middle;
		width: 52rpx;
		height: 59rpx;
	}

	.accountlink:after {
		content: '';
		display: block;
		height: 8px;
		width: 8px;
		border: 3px solid transparent;
		border-top-color: #ff5454;
		border-right-color: #ff5454;
		transform: rotate(45deg);
		right: 20px;
		position: absolute;
		top: 25px;
	}

	.accountlink .tip {
		font-size: 10px;
		text-align: center;
	}

	.copyright {
		text-align: center;
		font-size: 24rpx;
		color: #666;
		line-height: 80rpx;
	}
</style>
