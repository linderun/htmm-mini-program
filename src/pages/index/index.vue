<template>
	<div class="bgf8">
		<div class="wrap">
			<view class="slide">
				<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#fff" indicator-active-color="#ff5454">
					<swiper-item v-for="(item, itemIndex) in imglist" :key="itemIndex">
						<navigator :url="item.jump_url"><image class="slide-image" :src="host + item.image_url" /></navigator>
					</swiper-item>
				</swiper>
			</view>
			<div class="notice flex">
				公告:
				<div class="flex-1">
					<swiper class="swiper" :indicator-dots="false" :autoplay="true" :interval="3000" :duration="1000" :vertical="true">
						<swiper-item v-for="(item, itemIndex) in notice" :key="itemIndex">
							<p>{{ item.content }}</p>
						</swiper-item>
					</swiper>
				</div>
			</div>
			<div class="menubox flex">
				<div class="orderBtn" @click="showDialog = !showDialog"><image src="/static/images/11.jpg" class="bgimg" /></div>
				<div style="margin-left: 12rpx;" class="flex-1">
					<navigator class="bulkBtn" url="/pages/live/main"><image src="/static/images/14.jpg" class="bgimg" /></navigator>
					<div class="flex flex-pack-justify mt10">
						<navigator class="readBtn flex-1" url="/pages/jkarticlelist/main?type=0"><image src="/static/images/13.jpg" class="bgimg" /></navigator>
						<navigator class="transportBtn flex-1 ml10" url="/pages/jkarticlelist/main?type=1"><image src="/static/images/15.jpg" class="bgimg" /></navigator>
					</div>
				</div>
			</div>
			<!--今日特价-->
			<div class="modbox">
				<div class="modtitle flex flex-pack-justify">
					<div>产品推荐</div>
					<navigator class="more" url="/pages/list/main" open-type="switchTab">更 多 +</navigator>
				</div>
				<div style="margin: 10rpx;">
					<swiper
						class="subswiper"
						:indicator-dots="false"
						:autoplay="true"
						:circular="true"
						:interval="3000"
						:duration="1000"
						:display-multiple-items="todayTj.length > 4 ? 4 : todayTj.length"
					>
						<swiper-item v-for="(item, itemIndex) in todayTj" :key="itemIndex" style="text-align: left;">
							<div style="width: 180rpx; text-align: center;">
								<navigator url="/pages/list/main" open-type="switchTab">
									<image class="slide-image" :src="item.thumb_img" mode="aspectFit" />
									<text class="goods-text">{{ item.title }}</text>

									<text class="goods-price">￥{{ item.price }}</text>
								</navigator>
							</div>
						</swiper-item>
					</swiper>
				</div>
			</div>
			<div class="modbox mt10">
				<div class="modtitle flex flex-pack-justify"><div>个人团购</div></div>
				<div>
					<ul class="bulkList">
						<li v-for="(item, itemIndex) in tgGoods" :key="itemIndex">
							<navigator url="/pages/orderdetails/main" class="flex">
								<div class="imgbox"><image class="image" :src="item.thumb_img" @click="previewImage(item.thumb_img, item.thumb_img)" /></div>
								<div class="flex-1">
									<p class="name">{{ item.title }}</p>
									<p class="describe">团购套餐独立运营,不予分类订单合并,{{ goods_nums }}件起卖，有效期{{ item.day }},{{ item.day }}后拼团不成功可申请退款</p>
									<div class="btnbox flex flex-pack-justify flex-align-center">
										<div>
											<span class="savemoney">已团购数量{{ item.tg_num }}/{{ item.goods_nums }}</span>
											<span class="price">
												团购价：
												<span style="font-weight: bold; font-size: 14px;">￥</span>
												{{ item.tg_price }}元
											</span>
										</div>
										<span class="show">下单团购</span>
									</div>
								</div>
							</navigator>
						</li>
					</ul>
				</div>
			</div>
			<!--团购套餐-->
			<div class="modbox mt10">
				<div class="modtitle flex flex-pack-justify"><div>单位团购</div></div>
				<div>
					<ul class="bulkList">
						<li v-for="(item, itemIndex) in dwtgGoods" :key="itemIndex">
							<div class="flex">
								<div class="imgbox"><image class="image" :src="item.thumb_img" @click="previewImage(item.thumb_img, item.thumb_img)" /></div>
								<div class="flex-1">
									<p class="name">{{ item.title }}</p>
									<p class="describe">团购套餐独立运营,不予分类订单合并,{{ goods_nums }}件起卖，有效期{{ item.day }},{{ item.day }}后拼团不成功可申请退款</p>
									<div class="btnbox flex flex-pack-justify flex-align-center">
										<div>
											<span class="savemoney">已团购数量{{ item.tg_num }}/{{ item.goods_nums }}</span>
										</div>
										<span class="show" @click="hiddenmodalput = false">下单团购</span>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<modal :hidden="hiddenmodalput" title="请输入单位邀请码" confirm-text="确定" cancel-text="取消" @cancel="cancelempty" @confirm="confirmempty">
				<input type="text" placeholder="请输入单位邀请码" class="yqm" />
			</modal>
			<div class="dialog" v-if="showDialog">
				<div class="win-content">
					<img class="close-img" src="/static/images/dele_icon.png" @click="showDialog = !showDialog" />
					<div>
						<div>尺寸</div>
						<div>
							<span class="tag" :class="{ active: item == chicuntxt }" @click="chicuntxt = item" v-for="(item, index) in chicunlist" :key="index">{{ item }}</span>
						</div>
					</div>
					<div>水果夹心</div>
					<div>
						<span class="tag" @click="shuiguotxt = item" :class="{ active: item == shuiguotxt }" v-for="(item, index) in shuiguolist" :key="index">{{ item }}</span>
					</div>

					<div class="btn" @click="showDialog = !showDialog">接入人工服务下单订制</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import api from '@/utils/api';
import { host } from '@/utils/request';
export default {
	data() {
		return {
			host,
			userInfo: {},
			isLoad: false,
			hiddenmodalput: true,
			showDialog: false, //订制蛋糕
			imglist: [],
			notice: [],
			newGoods: [],
			todayTj: [
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕1'
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕2'
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕3'
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕4'
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕1'
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕2'
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕3'
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '蛋糕4'
				}
			],
			tgGoods: [
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4',
					tg_num: '1',
					day: '1',
					tg_price: '7.00',
					goods_nums: 3
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4',
					tg_num: '1',
					day: '1',
					tg_price: '7.00',
					goods_nums: 3
				},
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4',
					tg_num: '1',
					day: '1',
					tg_price: '7.00',
					goods_nums: 1
				}
			],
			dwtgGoods: [
				{
					thumb_img: '/static/images/page/goods.jpg',
					price: '12',
					title: '单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4单位团购蛋糕4',
					tg_num: '1',
					day: '1',
					tg_price: '7.00',
					goods_nums: 1
				}
			],
			pqReadId: '',
			transDescId: '',
			chicunlist: ['6寸', '8寸', '10寸', '12寸', '10+6寸', '12+8寸'],
			shuiguolist: ['水果', '芒果', '火龙果', '提子'],
			chicuntxt: '',
			shuiguotxt: ''
		};
	},

	components: {},
	onShow() {
		let that = this;
	},
	onLoad() {
		this.getmsglist();
		this.getbannerlist();
	},
	created() {
		// 只被创建一次
		wx.login({
			success: res => {
				console.log(res);
				api.getOpenId(res.code).then(da => {
					let param = JSON.parse(da.param);
					if (param.code == 200) {
						//console.log(da.data);
						var openid = param.data.openid;
						wx.setStorageSync('openid', openid);
						api.getMember(openid).then(da => {
							var data=da.param.data;
							if(da.param.code==200){
								wx.setStorageSync('isLogin', 1);
								wx.setStorageSync('userinfo', data.list[0]);
							    this.globalData.member_id = data.list[0].id;
							}
							
						});
					}
				});
			}
		});
		/* 设置初始常量 */
		this.globalData.userInfo = { name: '核桃妈妈', logo: 'http://test.htmm.hhst.xyz/storage/5c906ce579857/15692601221805.jpg' };
	   wx.setStorageSync('login_code', '5c906ce579857');
	},
	methods: {
		getmsglist() {
			api.getmsglist().then(da => {
				if (da.code == 0) {
					console.log(da.data);
					this.notice = da.data;
				}
			});
		},
		getbannerlist() {
			let that = this;
			api.getbannerlist().then(da => {
				if (da.code == 0) {
					console.log(da.data);
					if (da.data && da.data.length > 0) {
						that.imglist = da.data.map(item => {
							// item.image_url = host + item.image_url;
							return item;
						});
					}
				}
			});
		},
		previewImage: function(imgalist, current) {
			//var current = e.target.dataset.src;
			wx.previewImage({
				current:
					'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495693185410&di=e28cc03d2ae84130eabc26bf0fc7495f&imgtype=0&src=http%3A%2F%2Fpic36.photophoto.cn%2F20150814%2F0005018308986502_b.jpg', // 当前显示图片的http链接
				urls: [
					'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495693185410&di=e28cc03d2ae84130eabc26bf0fc7495f&imgtype=0&src=http%3A%2F%2Fpic36.photophoto.cn%2F20150814%2F0005018308986502_b.jpg'
				] // 需要预览的图片http链接列表
			});
		},
		getUserInfo() {
			// 调用登录接口
			wx.login({
				success: () => {
					wx.getUserInfo({
						success: res => {
							this.userInfo = res.userInfo;
						}
					});
				}
			});
		},
		clickHandle(msg, ev) {
			console.log('clickHandle:', msg, ev);
		},
		show() {
			this.isLoad = !this.isLoad;
		},
		cancelempty() {
			this.hiddenmodalput = true;
		},
		confirmempty() {
			this.hiddenmodalput = true;
			const url = '/pages/orderdetails/main';
			wx.navigateTo({
				url
			});
		}
	}
};
</script>

<style scoped>
.yqm {
	border-radius: 5px;
	border: 1px solid #ddd;
	line-height: 40px;
	height: 40px;
	font-size: 28rpx;
	padding: 0 10px;
}

.modbox {
	border-top: 1px solid #e5e5e5;
	border-bottom: 1px solid #e5e5e5;
	padding-top: 10px;
	background: #fff;
}

.swiper {
	height: 434rpx;
}

.swiper navigator {
	height: 100%;
}

.slide-image {
	height: 100%;
	width: 100%;
	display: block;
}

.subswiper {
	height: 210rpx;
}

.subswiper swiper-item {
	position: relative;
	padding: 5rpx 10rpx;
	box-sizing: border-box;
	text-align: center;
	font-size: 20rpx;
}

.subswiper swiper-item .slide-image {
	height: 150rpx;
}

.subswiper swiper-item .goods-text {
	width: 100%;
	display: block;
	/*	position: absolute;
		bottom: 0;*/
	color: #434343;
}

.subswiper swiper-item .goods-price {
	color: #ff5454;
}

.recomlist {
	padding: 0 10rpx;
}

.recomlist li {
	float: left;
	width: 33.33%;
	padding: 10rpx;
	box-sizing: border-box;
}

.recomlist li navigator {
	display: block;
	position: relative;
	width: 100%;
}

.recomlist li navigator .image {
	display: block;
	width: 100%;
	height: 200rpx;
}

.recomlist li navigator .goods-text {
	position: absolute;
	background: rgba(0, 0, 0, 0.7);
	left: 0;
	right: 0;
	bottom: 0;
	color: #fff;
	text-align: center;
	line-height: 40rpx;
	font-size: 18rpx;
}

.notice {
	color: #ff5454;
	height: 50rpx;
	background: #fff;
	border-bottom: 1px solid #eee;
	border-top: 1px solid #eee;
	line-height: 50rpx;
	font-size: 24rpx;
}

.notice:before {
	height: 50rpx;
	display: block;
	content: '';
	width: 12rpx;
	background: #ff5454;
}

.notice p {
	color: #434343;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.menubox {
	padding: 12rpx;
}

.menubox .orderBtn {
	width: 140px;
	height: 152px;
	text-align: center;
	color: #434343;
	font-size: 14px;
}

.menubox .orderBtn .bgimg {
	display: block;
	width: 140px;
	height: 150px;
}

.menubox .bulkBtn {
	display: block;
	width: 100%;
	height: 72px;
	color: #434343;
	font-size: 14px;
}

.menubox .readBtn {
	height: 72px;
	width: 104px;
	background: #ffedce;
}

.menubox .bgimg {
	height: 100%;
	width: 100%;
	display: block;
}

.menubox .transportBtn {
	height: 72px;
	width: 104px;
	text-align: center;
	background: #cdf4ff;
}

.modtitle {
	font-size: 18rpx;
	color: #fff;
}

.modtitle div {
	background: #ff5454;
	position: relative;
	height: 40rpx;
	line-height: 40rpx;
	display: inline-block;
	padding-left: 25rpx;
	padding-right: 10px;
}

.modtitle div:after {
	content: '';
	display: block;
	border: 21rpx solid transparent;
	border-left-color: #ff5454;
	position: absolute;
	right: -37rpx;
	top: 0;
}

.modtitle .more {
	border: 1px solid #ff5454;
	border-radius: 5px;
	color: #ff5454;
	display: inline-block;
	text-align: center;
	margin-right: 23rpx;
	width: 100rpx;
	line-height: 36rpx;
}

.bulkList li {
	margin: 20rpx;
}

.bulkList li .imgbox {
	position: relative;
	width: 225rpx;
	height: 225rpx;
}

.bulkList li .imgbox image {
	display: block;
	height: 100%;
	width: 100%;
}

.bulkList li .imgbox .num {
	height: 30rpx;
	line-height: 30rpx;
	background: rgba(0, 0, 0, 0.5);
	color: #fff;
	text-align: center;
	font-size: 18rpx;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}

.bulkList li .flex-1 {
	margin-left: 15rpx;
	position: relative;
	height: 225rpx;
}

.bulkList li .name {
	font-size: 24rpx;
	color: #434343;
	font-weight: bold;
	word-break: break-all;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.bulkList li .describe {
	font-size: 20rpx;
	color: #9c9c9c;
	margin-top: 0;
	word-break: break-all;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	overflow: hidden;
}

.bulkList li .btnbox {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
}

.bulkList li .btnbox .price {
	color: #ff5454;
	font-weight: bold;
	font-size: 24rpx;
	margin-top: 3rpx;
	display: block;
}

.bulkList li .btnbox .savemoney {
	color: #5c5c5c;
	font-size: 20rpx;
	margin-top: 3rpx;
	display: block;
}

.bulkList li .btnbox .show {
	height: 45rpx;
	width: 143rpx;
	background: #ffd260;
	color: #323332;
	font-size: 24rpx;
	text-align: center;
	line-height: 45rpx;
	border-radius: 5rpx;
}

.bulkList li .over {
	position: relative;
}

.bulkList li .over .overbox {
	background: rgba(0, 0, 0, 0.4);
	height: 100%;
	width: 100%;
	position: absolute;
	text-align: center;
	line-height: 100%;
}

.bulkList li .over .overbox .overimg {
	width: 80%;
	display: inline-block;
}

.copyright {
	text-align: center;
	font-size: 24rpx;
	color: #666;
	line-height: 80rpx;
}

.dialog {
	position: fixed;
	top: 0;
	width: 100%;
	left: 0;
	height: 100%;
	background: rgba(0, 0, 0, 0.8);
	z-index: 100;
}

.dialog .win-content {
	position: absolute;
	width: 90%;
	background: #fff;
	border-radius: 5px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	padding: 20px;
	box-sizing: border-box;
}

.dialog .close-img {
	position: absolute;
	right: -10px;
	top: -10px;
	width: 30px;
	height: 30px;
	z-index: 999;
}

.dialog .tag {
	color: #ff5555;
	border: 1px solid #ff5555;
	border-radius: 5px;
	margin: 20rpx 1%;
	padding: 10rpx 20rpx;
	display: inline-block;
	font-size: 40rpx;
	min-width: 25%;
	box-sizing: border-box;
	text-align: center;
}

.dialog .tag.active {
	background: #ff5555;
	color: #fff;
}

.dialog .btn {
	background: #f00;
	border-radius: 5px;
	color: #fff;
	text-align: center;
	font-size: 40rpx;
	line-height: 40px;
	height: 40px;
}
</style>
