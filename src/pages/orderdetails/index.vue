<template>
	<div style="background: #f6f6f6;">
		<div class="pt10">
			<ul class="view arrow ml10 mr10">
				<li>
					<a href="/pages/addresslist/main?type">
						<i class="addr">
							<image src="/static/images/icon12.png" mode="widthFix" />
						</i>
						<span>{{addr.address}} </span></a>
				</li>
				<!-- <li class="mt5 noarrow">
					<div>
						<i class="time">
							<image src="/static/images/icon13.png" mode="widthFix" />
						</i>
						<span>发货时间 </span>
						<span class="tip">{{deliveryTimeInfo}}</span>
					</div>
				</li> -->
				<li class="mt5">
					<div class="flex flex-pack-justify js-selecpayway" @click="ispayway=!ispayway">
						<div><i class="payway">
								<image src="/static/images/icon14.png" mode="widthFix" />
							</i>
							<span>支付方式 </span></div>
						<span class="pay">{{payWaytxt}}</span>
					</div>
				</li>
			</ul>
			<div class="orderdetails">
				<div class="title">订单详情</div>

				<div class="ordergoodslist mt10" v-show="type==2">
					<div class="flex goodinfo mt5" v-for="(item ,itemIndex) in goods" :key='itemIndex'>
						<div class="imgbox">
							<image :src="item.thumb_img" mode='widthFix' />
						</div>
						<div class="flex-1 ml20">
							<p class="goodsname">{{item.title}}
							</p>
							<div class="flex flex-pack-justify"><span class="price">￥：{{item.tg_price}}元</span><span class="num red">购买数量：{{item.nums}}箱</span></div>
						</div>
					</div>

				</div>
				<ul v-show="type==1">
					<li class="flex" v-for="(item ,itemIndex) in goods" :key='itemIndex'>
						<div style="width:40%;text-align: left; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; padding-left: 10px;">{{item.title}}</div>

						<div style="width: 30%;">{{item.nums}}份</div>
						<div style="width: 30%;">￥{{item.price}}</div>
					</li>
				</ul>
			</div>

			<ul class="view view2 arrow ml10 mr10">
				<li>
					<a class="flex flex-pack-justify" @click="istransway=!istransway">
						<div><i class="transport">
								<image src="/static/images/icon15.png" mode="widthFix" />
							</i>
							<span>运输方式 </span>
						</div>
						<span class="pay">{{transwaytxt}}</span>
					</a>
				</li>
				<li class="mt5 noarrow">
					<a class="flex flex-pack-justify">
						<div><i class="transportmoney">
								<image src="/static/images/icon16.png" mode="widthFix" />
							</i>
							<span>运费价格</span></div>
						<span class="pay">0</span>
					</a>
				</li>
				<li class="mt5">
					<a class="flex flex-pack-justify" @click="iscanjuway=!iscanjuway">
						<div><i class="bzmoney">
								<image src="/static/images/icon17.png" mode="widthFix" />
							</i>
							<span>餐具增加</span></div>
						<span class="pay">{{canjuwaytxt}}</span>
					</a>
				</li>
			</ul>
			<div class="mt5 modbox">
				<span style="display: inline-block;">
					<span>总计：</span><span class="paynum">{{amount}}元</span></span>
				<span style="display: inline-block;"><span class="ml10">优惠：</span><span class="paynum">{{youhui}}元</span></span>
				<span style="display: inline-block;"><span class="ml10">实付：</span><span class="paynum">{{paynum}}元</span></span>

			</div>
			<div class="mt5 modbox flex flex-align-center"><label>备注</label>
				<input type="text" name="" id="" value="" class="flex-1 remark" v-model="remark" />
			</div>
			<div style="height: 60px;"></div>
		</div>
		<span class="gotopay" @click="payforOrder()">去支付￥{{paynum}}</span>
		<!--支付方式 star-->
		<div class="paywaybox" :class="{'active':ispayway}" @click="closepaywaybox" id="paywaybox">
			<div>
				<div class="title">付款方式</div>
				<div>
					<ul>
						<li>
							<a @click="setPayWay(2,'微信支付')" :class="{'active':payWay==2}">
								<image src="/static/images/icon19.png" mode="widthFix" class="weixi" />
								<span>微信支付</span>
							</a>
						</li>
						<li>
							<a @click="setPayWay(1,'余额支付')" :class="{'active':payWay==1}">
								<image src="/static/images/icon18.png" mode="widthFix" class="yue" />
								<span>余额支付</span>
							</a>
						</li>
						<li>
							<a @click="setPayWay(3,'积分支付')" :class="{'active':payWay==3}">
								<image src="/static/images/jf.png" mode="widthFix" class="yue" />
								<span>积分支付</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--支付方式 end-->
		<div class="transwaybox" :class="{'active':istransway}" @click="closetranswaybox">
			<div>
				<div class="title">运输方式</div>
				<div>
					<ul>
						<li>
							<a @click="settransway(1,'小哥配送')" :class="{'active':transway==1}">
								<span>小哥配送</span>
							</a>
						</li>
						<li>
							<a @click="settransway(2,'到店自取')" :class="{'active':transway==2}">
								<span>到店自取</span>
							</a>
						</li>
						<li>
							<a @click="settransway(3,'配送至单位')" :class="{'active':transway==3}">
								<span>配送至单位</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--运输方式 end-->
		<!-- 餐具增加 -->
		<div class="transwaybox" :class="{'active':iscanjuway}" @click="closecanjuwaybox">
			<div>
				<div class="title">餐具增加</div>
				<div>
					<ul>
						<li>
							<a @click="setcanjuway(1,'无')" :class="{'active':canjuway==1}">
								<span>无</span>
							</a>
						</li>
						<li>
							<a @click="setcanjuway(2,'蜡烛*5 2元')" :class="{'active':canjuway==2}">
								<span>蜡烛*5 2元</span>
							</a>
						</li>
						<li>
							<a @click="setcanjuway(3,'帽子*10 5元')" :class="{'active':canjuway==3}">
								<span>帽子*10 5元</span>
							</a>
						</li>
						<li>
							<a @click="setcanjuway(4,'餐盘*10 10元')" :class="{'active':canjuway==4}">
								<span>餐盘*10 10元</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<!--输入支付密码-->
		<div class="ftc_wzsf" :class="{'active':ispaypwdbyye}">
			<div class="srzfmm_box">
				<div class="qsrzfmm_bt clear_wl">
					<span class="tx close" @click="ispaypwdbyye=!ispaypwdbyye">×</span>
					<!--<img src="img/xx_03.jpg" class="tx close">-->
					<span>请输入支付密码</span></div>
				<div class="zfmmxx_shop">
					<!--<div class="mz">测试商品</div>-->
					<div class="zhifu_price">￥{{paynum}}</div>
				</div>
				<ul class="mm_box clearfix">
					<li v-for="(item ,itemIndex) in paypwd" :key='itemIndex' class="mmdd"></li>
					<li v-for="(item ,itemIndex) in nopaypwd" :key='itemIndex'></li>
					<!--<li></li>
					<li></li>
					<li></li>
					<li></li>-->
				</ul>
				<a href="/pages/paypwd/main" class="forgetpwd">忘记支付密码</a>
			</div>
			<div class="numb_box">
				<div class="xiaq_tb">
					<!--<img src="img/jftc_14.jpg" height="10">-->

				</div>
				<ul class="nub_ggg">
					<li>
						<span @click="addpwdStr(1)" class="zf_num">1</span>
					</li>
					<li>
						<span @click="addpwdStr(2)" class="zj_x zf_num">2</span>
					</li>
					<li>
						<span @click="addpwdStr(3)" class="zf_num">3</span>
					</li>
					<li>
						<span @click="addpwdStr(4)" class="zf_num">4</span>
					</li>
					<li>
						<span @click="addpwdStr(5)" class="zj_x zf_num">5</span>
					</li>
					<li>
						<span @click="addpwdStr(6)" class="zf_num">6</span>
					</li>
					<li>
						<span @click="addpwdStr(7)" class="zf_num">7</span>
					</li>
					<li>
						<span @click="addpwdStr(8)" class="zj_x zf_num">8</span>
					</li>
					<li>
						<span @click="addpwdStr(9)" class="zf_num">9</span>
					</li>
					<li>
						<span @click="clearpwdStr()" class="zf_empty">清空</span>
					</li>
					<li>
						<span @click="addpwdStr(0)" class="zj_x zf_num">0</span>
					</li>
					<li>
						<span @click="delpwdStr()" class="zf_del">删除</span>
					</li>
				</ul>
			</div>
			<div class="hbbj"></div>
		</div>

	</div>
</template>

<script>
	// import api from '@/utils/api'
	import {
		toBase64
	} from '@/utils/index'
	import {
		base64ToString
	} from '@/utils/index'
	export default {
		components: {

		},

		data() {
			return {
				addr: {},
				accessToken: '',
				goods: [],
				amount: 1000,
				ispayway: false, //是否显示支付方式弹出框
				istransway: false,
				iscanjuway: false,
				payWay: 2, //支付方式
				transway: 1,
				canjuway: 1,
				remark: '', //备注
				payWaytxt: '微信支付',
				transwaytxt: '小哥配送',
				canjuwaytxt: '无',
				youhui: 1000,
				paynum: 1000, //实际付款
				paypwd: [],
				nopaypwd: [0, 1, 2, 3, 4, 5],
				ispaypwdbyye: false, //是否显示余额支付弹出框
				orderId: '',
				type: 1,
				deliveryTimeInfo: '',

			}
		},

		created() {

		},
		onShow() {
			var addr = wx.getStorageSync("addr");
			if (addr) {
				this.addr = addr;
			}
		},
		onLoad() {
			var that = this;
			that.accessToken = wx.getStorageSync("accessToken");
			if (this.$root.$mp.query.type) {
				that.type = this.$root.$mp.query.type;
				that.createOrder();
			}
			that.createOrder();
		},
		methods: {
			/*生成订单*/
			createOrder() {
				var that = this;
				var carlist = [];
				if (that.type == 2) {
					/*获取团购购物车*/
					var bulkcar = wx.getStorageSync("bulkcar");

					if (bulkcar && bulkcar.length > 0) {
						carlist = bulkcar.map(item => {
							return {
								id: item.id,
								nums: item.num
							}
						});

					}
				} else {
					/*获取购物车*/
					var listcar = wx.getStorageSync("listcar");
					if (listcar && listcar.length > 0) {
						carlist = listcar.map(item => {
							return {
								id: item.id,
								nums: item.num
							}
						});

					}
				}
				that.getOrderInfo('1');

			},
			/*查询订单详情*/
			getOrderInfo(id) {
				var that = this;
				var data = {
					"address": {
						"address": "北京北京东城区Jdjjdhh",
						"addressId": "32"
					},
					"goods": [{
							"id": "55",
							"title": "玲珑-粉色",
							"danwei": "20支/扎",
							"level": "B",
							"price": "16.80",
							"nums": "2",
							"g_color": "粉色"
						},
						{
							"id": "60",
							"title": "粉绣球",
							"danwei": "1支/扎",
							"level": "B",
							"price": "12.80",
							"nums": "3",
							"g_color": "粉色"
						}
					],
					"amount": "72.00"
				};
				if (JSON.stringify(that.addr) == '{}' && data.address) {
					that.addr = data.address;
				}
				that.goods = data.goods;

				that.amount = 1000;
				that.youhui = 1000;

				// 				if (that.type == 2) {
				// 					that.paynum = data.amount; //需要付款
				// 					that.amount = data.originalAmount;
				// 					that.youhui = data.yAmount;
				// 				} else {
				// 					that.paynum = data.originalAmount; //需要付款
				// 					that.amount = data.originalAmount;
				// 					that.youhui = 0;
				// 				}
				that.amount = that.amount.toFixed(2);
				that.youhui = that.youhui.toFixed(2);

			},
			/*支付订单*/
			payOrder() {
				console.log('dizhi' + this.addr.addressId)
				if (!this.addr || !this.addr.addressId) {
					wx.showToast({
						title: '请选择地址',
						icon: 'none'
					});
					return false
				}
				var param = {
					accessToken: wx.getStorageSync("accessToken"),
					type: this.type,
					payType: this.payWay,
					addressId: this.addr.addressId,
					id: this.orderId,
					beizu: this.remark,
					paypass: this.paypwd.join('')
				}
				var that = this;

			},
			/*点击去支付*/
			payforOrder() {
				if (this.payWay != 2) {
					this.ispaypwdbyye = true;
					this.paypwd = [];
					this.nopaypwd = [0, 1, 2, 3, 4, 5];
				} else {
					this.payOrder()
				}
			},
			/*设置支付方式*/
			setPayWay(num, txt) {
				this.payWay = num;
				this.payWaytxt = txt;
				this.ispayway = false;
			},
			/*关闭支付方式弹出框*/
			closepaywaybox(e) {
				var that = this;
				console.log(e)
				if (e.currentTarget.id == e.target.id)
					that.ispayway = !that.ispayway
			},

			settransway(num, txt) {
				this.transway = num;
				this.transwaytxt = txt;
				this.istransway = false;
			},
			/* 关闭运输方式 */
			closetranswaybox(e) {
				var that = this;
				console.log(e)
				if (e.currentTarget.id == e.target.id)
					that.istransway = false
			},
			setcanjuway(num, txt) {
				this.canjuway = num;
				this.canjuwaytxt = txt;
				this.iscanjuway = false;
			},
			closecanjuwaybox(e) {
				var that = this;
				console.log(e)
				if (e.currentTarget.id == e.target.id)
					that.iscanjuway = false
			},
			/*支付密码*/
			addpwdStr(num) {
				if (this.paypwd.length < 6) {
					this.paypwd.push(num);
					this.nopaypwd = []
					for (var i = 0; i < (6 - this.paypwd.length); i++) {
						this.nopaypwd.push(i)
					}
				}
				if (this.paypwd.length == 6) {
					/*todo 支付*/
					this.payOrder();
					this.clearpwdStr()
				}

				//console.log(this.nopaypwd);
			},
			/*清空支付密码*/
			clearpwdStr() {
				this.paypwd = [];
				this.nopaypwd = []
				for (var i = 0; i < (6 - this.paypwd.length); i++) {
					this.nopaypwd.push(i)
				}
			},
			/*删除支付密码*/
			delpwdStr() {
				this.paypwd.pop();
				this.nopaypwd = []
				for (var i = 0; i < (6 - this.paypwd.length); i++) {
					this.nopaypwd.push(i)
				}
			}
		},

	}
</script>

<style scoped>
	.view li {
		display: block;
		position: relative;
		height: 60px;
		border-bottom: 1px solid #efefef;
		line-height: 60px;
		padding-left: 20px;
		background: #fff;
	}

	.view.arrow li:not(.noarrow):after {
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

	.view.arrow li>div,
	.view.arrow li a {
		color: #666;
		display: flex;
		align-items: center;
	}

	.view.arrow li>div i,
	.view.arrow li a i {
		display: inline-block;
		width: 40px;
		margin-right: 0;
		text-align: center;
		vertical-align: middle;
		height: 40px;
	}

	.view.arrow li>div span,
	.view.arrow li a span {
		vertical-align: middle;
		font-weight: bold;
	}

	.view.arrow li>div i image,
	.view.arrow li a i image {
		display: block;
		width: 40rpx;
		margin: 0 auto;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}

	.view.arrow li a i.addr,
	.view.arrow li>div i.time,
	.view.arrow li>div i.payway,
	.view2.arrow li>div i {
		height: 40px;
		vertical-align: middle;
		margin-right: 0;
		width: 30px;
	}

	.view.arrow li .tip {
		font-size: 14px;
		color: #ff5454;
		margin-left: 10px;
	}

	.view.arrow li .pay {
		margin-right: 40px;
		font-size: 14px;
	}

	.notice {
		width: 240px;
		margin: 10px 20px 0;
		line-height: 30px;
		color: #666;
	}

	.orderdetails {
		margin: 10px;
		background: #fff;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.orderdetails .title {
		background: #ff5454;
		color: #fff;
		text-align: center;
		line-height: 35px;
		border-top-left-radius: 8px;
		border-top-right-radius: 8px;
	}

	.orderdetails ul {
		background: #fff;
		border-collapse: collapse;
		width: 100%;
		text-align: center;
		line-height: 30px;
		margin-top: 20px;
	}

	.orderdetails ul li {
		font-size: 28rpx;
	}

	.modbox {
		background: #fff;
		line-height: 45px;
		padding: 0 20px;
		font-size: 28rpx;
	}

	.modbox .paynum {
		color: #ed145b;
		font-size: 18px;
		font-weight: bold;
	}

	.modbox .remark {
		border: none;
		padding: 0 10px;
		text-align: right;
	}

	.gotopay {
		background: #ff5454;
		line-height: 50px;
		position: fixed;
		left: 0;
		bottom: 0;
		color: #fff;
		text-align: center;
		font-size: 15px;
		width: 100%;
		z-index: 999;
	}

	.paywaybox,
	.transwaybox {
		position: fixed;
		bottom: 0;
		left: 0;
		top: 0;
		width: 100%;
		background: rgba(0, 0, 0, .4);
		z-index: 999;
		display: none;
		opacity: 0;
	}

	.paywaybox.active,
	.transwaybox.active {
		display: block;
		animation: fadeIn .3s forwards;
	}

	.paywaybox.active>div,
	.transwaybox.active>div {
		animation: slideInUp .3s both;
	}

	.paywaybox.active1>div,
	.transwaybox.active1>div {
		animation: slideOutDown .3s both;
	}

	.paywaybox>div,
	.transwaybox>div {
		position: absolute;
		bottom: 0;
		background: #fff;
		left: 0;
		right: 0;
	}

	.paywaybox>div .title,
	.transwaybox>div .title {
		text-align: center;
		line-height: 40px;
		border-bottom: 1px solid #efefef;
	}

	.paywaybox>div ul li,
	.transwaybox>div ul li {
		line-height: 40px;
		margin: 0 10px;
		border-bottom: 1px solid #efefef;
	}

	.paywaybox>div ul li a,
	.transwaybox>div ul li a {
		display: block;
		position: relative;
	}

	.paywaybox>div ul li>a span,
	.transwaybox>div ul li>a span {
		vertical-align: middle;
		color: #333;
		font-size: 12px;
	}

	.paywaybox>div ul li>a image,
	.transwaybox>div ul li>a image {
		display: inline-block;
		/*height: 40px;*/
		width: 40rpx;
		vertical-align: middle;
		margin-right: 20rpx;
		/*	background: no-repeat center center;
		background-size: 20px auto;*/
	}

	.paywaybox>div ul li>a.active:after,
	.transwaybox>div ul li>a.active:after {
		position: absolute;
		right: 10px;
		height: 4px;
		width: 12px;
		content: '';
		border: 3px solid transparent;
		border-left-color: #3cb878;
		border-bottom-color: #3cb878;
		transform: rotate(-45deg);
		top: 14px;
	}

	.taglist span {
		font-weight: bold;
		border-radius: 8rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
		margin: 0 5rpx;
		color: #666;
	}

	.taglist .tag {
		border: 1px solid #3cb878;
		color: #3cb878;
	}

	.taglist .color {
		border: 1px solid #ff5454;
		color: #ff5454;
	}

	.mt5 {
		margin-top: 10rpx
	}

	.ordergoodslist .goodinfo {
		background: #f9f9f9;
		padding: 0 10px;
		margin-bottom: 10rpx;
		font-size: 24rpx;
		color: #323332;
	}

	.ordergoodslist .goodinfo .imgbox {
		height: 64px;
		width: 64px;
		background: #f29b76;
	}

	.ordergoodslist .goodinfo .imgbox image {
		height: 64px;
		width: 64px;
	}

	.ordergoodslist .goodinfo .goodsname {
		min-height: 4em;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.ordergoodslist .totalprice {
		line-height: 50rpx;
		text-align: right;
		padding-right: 10px;
		border-bottom: 1rpx solid #efefef;
	}

	.ordergoodslist .goodinfo .num {
		color: #ff5454;
	}

	.ftc_wzsf {
		display: none;
		width: 100%;
		height: 100%;
		position: fixed;
		z-index: 999;
		top: 0;
		left: 0;
		min-width: 320px;
	}

	.ftc_wzsf.active {
		display: block;
	}

	.ftc_wzsf .hbbj {
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 8;
		background: #000;
		opacity: 0.4;
		top: 0;
		left: 0;
	}

	.ftc_wzsf .srzfmm_box {
		position: absolute;
		z-index: 10;
		background: #f8f8f8;
		width: 88%;
		left: 50%;
		margin-left: -44%;
		top: 20%;
	}

	.qsrzfmm_bt {
		font-size: 16px;
		border-bottom: 1px solid #c9daca;
		overflow: hidden;
		text-align: center;
		position: relative;
		line-height: 50px;
	}

	.qsrzfmm_bt a {
		display: block;
		width: 10%;
		padding: 10px 0;
		text-align: center;
	}

	.qsrzfmm_bt span.tx {
		width: 10%;
		/*padding: 10px 0;*/
		padding: 0;
		position: absolute;
		left: 10px;
		top: 0;
		font-size: 30px;
	}

	.qsrzfmm_bt span {
		padding: 15px 5px;
	}

	.zfmmxx_shop {
		text-align: center;
		font-size: 12px;
		padding: 10px 0;
		overflow: hidden;
	}

	.zfmmxx_shop .mz {
		font-size: 14px;
		float: left;
		width: 100%;
	}

	.zfmmxx_shop .zhifu_price {
		font-size: 24px;
		float: left;
		width: 100%;
	}

	.ml5 {
		margin-left: 5px;
	}

	.mm_box {
		width: 89%;
		margin: 10px auto;
		height: 40px;
		overflow: hidden;
		border: 1px solid #bebebe;
	}

	.mm_box li {
		border-right: 1px solid #efefef;
		height: 40px;
		float: left;
		width: 16.3%;
		background: #FFF;
	}

	.mm_box li.mmdd {
		background: #FFF center no-repeat;
		background-size: 25%;
		position: relative;
	}

	.mm_box li.mmdd:after {
		content: '';
		height: 20px;
		width: 20px;
		display: block;
		position: absolute;
		left: 50%;
		top: 50%;
		margin-left: -10px;
		margin-top: -10px;
		background: #000;
		border-radius: 100%;
	}

	.mm_box li:last-child {
		border-right: none;
	}

	.xiaq_tb {
		padding: 5px 0;
		text-align: center;
		border-top: 1px solid #dadada;
	}

	.numb_box {
		position: absolute;
		z-index: 10;
		background: #f5f5f5;
		width: 100%;
		bottom: 0px;
	}

	.nub_ggg {
		border: 1px solid #dadada;
		overflow: hidden;
		border-bottom: none;
	}

	.nub_ggg li {
		width: 33.3333%;
		border-bottom: 1px solid #dadada;
		float: left;
		text-align: center;
		font-size: 22px;
	}

	.nub_ggg li>span {
		display: block;
		color: #000;
		height: 50px;
		line-height: 50px;
		overflow: hidden;
	}

	.nub_ggg li>span:active {
		background: #e0e0e0;
	}

	.nub_ggg li>span.zj_x {
		border-left: 1px solid #dadada;
		border-right: 1px solid #dadada;
	}

	/*.nub_ggg li span {
		display: block;
		color: #e0e0e0;
		background: #e0e0e0;
		height: 50px;
		line-height: 50px;
		overflow: hidden;
	}
	*/

	.nub_ggg li span.del img {
		width: 30%;
	}

	.forgetpwd {
		color: #ff5454;
		float: right;
		padding-bottom: 18px;
		margin-right: 20px;
		font-size: 24rpx;
	}
</style>
