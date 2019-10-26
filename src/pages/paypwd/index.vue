<template>
	<div class="loginbox">
		<form>
			<div>绑定账号:{{phone}}</div>
			<!-- <div class="group flex flex-align-center">
				<i class="phone"><image src="/static/images/icon1.png" mode="aspectFit"/></i>
				<input class="flex-1" type="text" value="" placeholder="请输入手机号码" v-model="phone" />
			</div> -->
			<div class="clearfix codebox mt20">
				<div class="group flex flex-align-center">
					<i class="code">
						<image src="/static/images/icon7.png" mode="aspectFit" /></i>
					<input type="text" value="" placeholder="验证码" class="flex-1" v-model='code' />
				</div>

				<button class="getcode" :disabled="isAble=='0'" :class="{'active':isAble=='1'}" @click="getCode()">{{codetxt}}</button>
			</div>

			<div class="group flex flex-align-center mt20">
				<i class="lock">
					<image src="/static/images/icon2.png" mode="aspectFit" /></i>
				<input class="flex-1 pwd" type="password" value="" placeholder="请输入6位数字" v-model="pwd" />
			</div>
			<div class="group flex flex-align-center mt20">
				<i class="lock">
					<image src="/static/images/icon2.png" mode="aspectFit" /></i>
				<input class="flex-1 compwd" type="password" placeholder="请输入6位数字" v-model="confirmpwd" />
			</div>
			<div class="submitBtn" @click="setPayPwd()">确定</div>
		</form>
	</div>
</template>

<script>
	
	export default {
		components: {

		},

		data() {
			return {
				code: '',
				phone: '',
				pwd: '',
				confirmpwd: '',
				isAble: '0',
				codetxt: '获取验证码'
			}
		},
		onShow() {
			this.getUserInfo();
		},
		mounted() {
			// 			this.phone = this.$root.$mp.query.phone;
			// 			console.log(this.phone)
		},
		onUnload() {
			this.code = '';
			this.phone = '';
			this.pwd = '';
			this.confirmpwd = '';
			this.isAble = '0';
			this.codetxt = '获取验证码';
		},
		methods: {
			//查询员工信息
			getUserInfo: function() {
			
			},
			getCode() {
				
			},
			setPayPwd() {
				
			}
		},
		watch: {
			
		},
		computed: {

		}
	}
</script>

<style scoped>
	.loginbox {
		width: 540rpx;
		margin: 0 auto;
		padding-top: 40px;
	}

	.loginbox .logo,
	.loginbox .logo img {
		display: block;
		width: 175px;
		margin: 0 auto;
	}

	.loginbox form {
		margin-top: 50px;
	}

	.loginbox .group {
		height: 40px;
		border-radius: 5px;
		border: 1px solid #ff5454;
		background: #fff;
		font-size: 30rpx;
	}

	.loginbox .group i {
		display: block;
		height: 20px;
		width: 36px;
	}

	.loginbox .group i image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.mt20 {
		margin-top: 40rpx;
	}

	.loginbox .group input {
		background: none;
		border: none;
		width: 100%;
		height: 100%;
	}

	.loginbox .codebox>div {
		width: 55%;
		float: left;
	}

	.loginbox .codebox>button {
		float: right;
		width: 40%;
		background: #ff5454;
		line-height: 40px;
		color: #fff;
		border-radius: 5px;
		text-align: center;
		font-size: 30rpx;
		opacity: .8;
	}

	.loginbox .codebox>button.active {
		opacity: 1;
	}

	.loginbox .submitBtn {
		display: block;
		width: 100%;
		background: #ff5454;
		color: #fff;
		line-height: 80rpx;
		height: 80rpx;
		text-align: center;
		border-radius: 10rpx;
		border: none;
		margin-top: 70rpx;
	}
</style>
