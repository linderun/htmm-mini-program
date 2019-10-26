<template>
	<div>
		<div class="searchbar flex">
			<button open-type="contact" class="contact">
				<image src="/static/images/kf.png" mode="aspectFit" />
			</button>

			<div class="flex-1">
				<div class="flex flex-align-center">
					<i class="search">
						<image src="/static/images/search.png" /></i>
					<input v-model="keyword" placeholder="请输入你想要的产品名称" type="text" confirm-type="search" @confirm="confirm($event)" />

				</div>
			</div>
			<!-- <a href="" class="filterBtn" @click="showfilter">筛选</a> -->
		</div>

		<div>
			<div class="grid flex ">
				<div class="submenu">
					<!--"-->
					<scroll-view scroll-y="true" class="scroll-view" :scroll-into-view="'head-'+indexSize">
						<ul>
							<li :class="{'active':indexSize==myitemIndex}" v-for="(item, myitemIndex) in menulist" :key='myitemIndex' @click="scrollTo(myitemIndex,item)"
							 :data-index="myitemIndex" :id="'head-'+myitemIndex">
								<i :class="{'show':item.num>0&&myitemIndex!=0&&isOpen==1}">{{item.num>100?'99+':item.num}}</i>
								<span class="flex flex-align-center flex-pack-center cate" v-bind:style="{ color: item.color}">
									{{item.name}}
								</span>
							</li>
						</ul>
					</scroll-view>
				</div>

				<div class="main flex-1" style="position: relative;">
					<div class="loading" v-if="isloading">
						<div class="spinner">
							<div class="bounce1"></div>
							<div class="bounce2"></div>
							<div class="bounce3"></div>
						</div>
					</div>
					<!--<div class="filterbar">
						快速找到你喜欢的产品>>
						<a href="" class="filterBtn" @click="showfilter">筛选</a>
					</div>-->
					<scroll-view scroll-y="true" class="goodslist" style="position: relative; z-index: 1;" :scroll-into-view="'goods-'+scrollTop"
					 @scrolltolower="loadgoodslist()" @scroll="scroll" @scrolltoupper="refresh()" :enable-back-to-top="false">
						<div v-show="!isMoregoods&&goodslist.length==0" class="nodata">
							<image src="/static/images/nodata.jpg" mode='aspectFit' />
						</div>
						<div class="goodsmod">

							<!-- <h4>{{goodType.cate_name}}</h4> -->
							<div class="goodslist-item" v-for="(goods, index) in goodslist" :key='index' :id="'goods-'+index">
								<div class="flex">
									<div class="goodimg" @click='showDetails(goods,index)'>
										<span class="goodstag" v-if='goods.attr==1||goods.attr==2||goods.attr==3' :class="{'goodstag2':goods.attr==1,'goodstag1':goods.attr==2,'goodstag3':goods.attr==3}">{{goods.attr==1?'热销':goods.attr==2?'新品':'推荐'}}</span>
										<image class="image" :src="goods.thumb_img" mode="aspectFit" lazy-load="true" />
									</div>
									<div class="goodinfo flex-1">
										<p class="name" v-bind:style="{ color: goods.color}"><strong>{{goods.title}}</strong></p>

										<p class="mt5 red" v-if="isOpen==1"><span style="font-weight: bold; font-size: 14px;">￥</span><span class="price">{{goods.price}}</span>元</p>
										<p class="red mt5 num" v-show="goods.goods_nums>0&&isOpen==1">供货量<span class="total">{{goods.goods_nums>300?'充足':goods.goods_nums+'扎'}}</span></p>
										<p class="red mt5 num" v-show="goods.goods_nums==0&&isOpen==1">今日已售完</span>
										</p>

									</div>
									<div class="edit" v-if="goods.goods_nums>0&&isOpen==1">
										<div class="minus" v-if="goods.num>0" @click.stop='minusnum(goods,index)'>
											<image src="/static/images/minus2.png" mode="widthFix" />
										</div>
										<input name="" id="" v-if="goods.num>0" type="number" v-model.lazy="goods.num" @change.stop='editnum(goods,index)' />
										<div class="add" @click.stop='addnum(goods,index)'>
											<image src="/static/images/add.png" mode="aspectFill" />
										</div>

									</div>

								</div>
								<p class="desc">
									<rich-text :nodes="goods.desc"></rich-text>
								</p>
							</div>

						</div>
					</scroll-view>
				</div>
			</div>

		</div>

		<!--提示-->
		<p class="isCannotice">蛋糕需要制作时间</p>
		<div class="list-footer flex ">
			<div class="flex-1" @click='openCar' v-if="isOpen==1">
				<div class="carbox" :class="{'active':totalnum>=1}">
					<div class="car">
						<image src="/static/images/22.png" />
						<div>{{totalnum>=100?'99+':totalnum}}</div>
					</div>
				</div>
				<div class="goodsnum" :class="{'active':totalnum>=1}">
					<p>共计￥{{totalprice}}元</p>
					<!-- <p class="tip">全场包邮到店，无需任何杂费</p> -->
				</div>
			</div>
			<!-- <button class="invoiceBtn" open-type="getUserInfo" @getuserinfo="onGotUserInfo" >去结算</button> -->
			<span class="invoiceBtn" @click='gotoInvo' :class="{'active':totalnum>=1}" v-if="isOpen==1">结算</span>
			<div v-if="isOpen==0" class="timetip" style="line-height: 120rpx;text-align: center;margin: 0 auto;">目前不在营业时间内</div>

		</div>
		<!--筛选-->
		<div class="filter" :class="{'active':isFilter}" @click.stop="closeFilter">
			<div @click.stop="stopclose">
				<div class="cont">
					<div class="filter-modbox mb10">
						<p>颜色</p>
						<div>
							<span @click="addfilter('color',item,index)" :class="{'active':item.sel==1}" v-for="(item,index) in filterlist['color']"
							 :key="index">{{item.name}}</span>
						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>价格</p>
						<div>
							<span @click="addfilter('price',item,index)" v-for="(item,index) in filterlist['price']" :key="index" :class="{'active':item.sel==1}">{{item.desc}}</span>

						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>用途</p>
						<div>
							<span @click="addfilter('use',item,index)" v-for="(item,index) in filterlist['use']" :key="index" :class="{'active':item.sel==1}">{{item.desc}}</span>

						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>标签</p>
						<div>
							<span @click="addfilter('attr',item,index)" v-for="(item,index) in filterlist['attr']" :key="index" :class="{'active':item.sel==1}">{{item.desc}}</span>

						</div>
					</div>
					<div class="filter-modbox mb10">
						<p>其他</p>
						<div>
							<span @click="addfilter('other',item,index)" v-for="(item,index) in filterlist['other']" :key="index" :class="{'active':item.sel==1}">{{item.desc}}</span>

						</div>
					</div>
				</div>
				<div class="btnbox">
					<span @click.stop="confirmFilter">确定</span>
					<span @click.stop="clearFilter">重置</span>
				</div>
			</div>

		</div>
		<div class="carlist" :class="{'active':isshowCar}" @click='closeCar' id="carbox">
			<div>

				<div class="flex flex-pack-justify">
					<!-- <div class="notice">本站满{{packnum}}扎包邮，不满{{packnum}}扎不发货</div> -->
					<div class="clearCar" @click="empty"><img src="/static/images/del.png" mode="widthFix"><span>清空购物车</span></div>
				</div>
				<ul class="mt10">
					<li class="flex flex-pack-justify flex-align-center" v-for="(item,index) in carlist" :key="index">
						<span class="name">{{item.title}}</span>
					
						<span class="price" v-if="isOpen==1">￥<span>{{item.price}}</span></span>
						<div class="edit" v-if="isOpen==1">
							<div class="minus" @click="minusCarnum(item)">
								<image src="/static/images/minus2.png" mode="widthFix" />
							</div>
							<input type="number" name="" id="" v-model.lazy="item.num" @change='editCarnum(item)'>
							<div href="javascript:;" class="add" @click="addCarnum(item)">
								<image src="/static/images/add.png" mode="widthFix" />
							</div>
						</div>
					</li>
				</ul>
				<div class="flex flex-pack-justify" v-if='lostgoods.length>0'>
					<div class="notice" style="color: #666;">以下产品已下架或库存不足</div>
					<div class="clearCar" @click="emptylost"><img src="/static/images/del.png" mode="widthFix"><span>清空失效商品</span></div>
				</div>
				<ul class="mt10" v-if='lostgoods.length>0'>
					<li class="flex flex-pack-justify flex-align-center" v-for="(item,index) in lostgoods" :key="index">
						<span class="name" style="color: #666;">{{item.title}}</span>
						<span class="taglist">
							<span class="tag">{{item.level}}</span>
							<span class="color">{{item.g_color}}</span>
						</span>
						<span class="price" v-if="isOpen==1" style="color: #666;">￥<span>--</span></span>
						<span style="color: #666;">已失效</span>
					</li>
				</ul>
			</div>
		</div>
		<!--商品详情-->
		<div class="goodsdetails" @click='closeGoodsdetails' :class="{'active':isDetails}" id="goodsdetails">
			<div id="goodsdetails2">
				<view class="slide">
					<swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color='#fff'
					 indicator-active-color='#ff5454'>
						<swiper-item v-for="(item, itemIndex) in Details.img" :key='itemIndex'>
							<image class="slide-image" :src="item" mode='widthFix' />
						</swiper-item>

					</swiper>
				</view>
				<div class="goodsInfo">
					<p><span class="name">{{Details.title}}</span>
						<!-- <span class="num">{{Details.danwei}}</span>
						<span class="tag">{{Details.level}}</span>
						<span class="color">{{Details.g_color}}</span> -->
					</p>
					<!-- <p class="desc">
						<rich-text :nodes="Details.desc"></rich-text>
					</p> -->
					<div class="flex flex-pack-justify mt10 flex-align-center">
						<p class="price" v-if="isOpen==1">￥<span>{{Details.price}}</span>元</p>
						<div v-if="isOpen==1">
							<div class="edit">
								<div class="minus" @click='minusnum(Details,DetailsIndex)' v-if="Details.num>0">
									<image src="/static/images/minus2.png" mode="widthFix" />
								</div>
								<input type="number" name="" id="" v-model.lazy="Details.num" @change='editnum(item,DetailsIndex)' v-if="Details.num>0">
								<div class="add" @click='addnum(Details,DetailsIndex)' v-if="Details.goods_nums>0">
									<image src="/static/images/add.png" mode="widthFix" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--搜索结果页面-->
		<div class="result" :class="{'active':isResult}">
			<span class="close" @click="isResult=!isResult">×</span>
			<h4>搜索结果</h4>
			<scroll-view scroll-y="true" class="resultlist" @scrolltolower="loadresult">
				<div class="goodslist-item" v-for="(goods, index) in searchlist" :key='index'>
					<div class="flex">
						<div class="goodimg" @click='showDetails(goods,itemIndex,index)'>
							<span class="goodstag" v-if='goods.attr==1||goods.attr==2||goods.attr==3' :class="{'goodstag2':goods.attr==1,'goodstag1':goods.attr==2,'goodstag3':goods.attr==3}">{{goods.attr==1?'热销':goods.attr==2?'新品':'推荐'}}</span>
							<image class="image" :src="goods.thumb_img" mode="widthFix" lazy-load="true" />
						</div>
						<div class="goodinfo flex-1">
							<p class="name"><strong>{{goods.title}}</strong></p>
							<p class="mt10">
								<span class="num">{{goods.danwei}}</span>
								<span class="tag">{{goods.level}}</span>
								<span class="color">{{goods.g_color}}</span>
							</p>
							<p class="mt10 red" v-if="isOpen==1">￥<span class="price">{{goods.price}}</span>元
								<!--<image class="echart" src="/static/images/21.png" mode="widthFix" v-if="goods.trend==1" @click="showChart(goods.id)" />-->
							</p>

							<p class="red" v-show="goods.goods_nums>0&&isOpen==1">供货量<span class="total">{{goods.goods_nums}}</span>扎</p>
							<p class="red" v-show="goods.goods_nums==0&&isOpen==1">今日已售完</p>

						</div>
						<div class="edit" v-if="goods.goods_nums>0&&isOpen==1">
							<div class="minus" v-if="goods.num>0" @click="minusResult(goods,index)">
								<image src="/static/images/minus2.png" mode="widthFix" />
							</div>
							<input name="" id="" v-if="goods.num>0" type="number" v-model.lazy="goods.num" @change='editResult(goods,index)' />
							<div class="add" @click="addResult(goods,index)">
								<image src="/static/images/add.png" mode="widthFix" />
							</div>

						</div>

					</div>
					<p class="desc">
						<rich-text :nodes="goods.desc"></rich-text>
					</p>
				</div>
			</scroll-view>
		</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				hiddenmodalput: true,
				subtitle: '请在此输入搜索内容',
				isFilter: false,
				filter: {
					color: [],
					price: '',
					use: [],
					attr: [],
					other: []
				},
				filterlist: {},
				menulist: [],
				classifySeleted: '',
				isTap: true,
				goodslist: [],
				isDetails: false,
				percent: 0.5,
				isAble: true,
				Details: {},
				DetailsIndex: '',
				DetailstypeIndex: '',
				searchlist: [],
				keyword: '',
				totalnum: 0,
				totalprice: 0,
				carlist: [],
				isshowCar: false,
				pageSize: 20,
				page: 1,
				isMore: true,
				isResult: false,
				isShowChart: false,
				oldscrollTop: -1,
				indexSize: 0,
				indicatorDots: false,
				autoplay: false,
				duration: 500,
				circular: true,
				heightArr: [],
				packnum: 1, //包邮数量
				goodspage: 1,
				cate_id: 0,
				isMoregoods: true,
				scrollTop: 0,
				isOpen: 1, //是否在营业时间
				isloading: false,
				lostgoods: [] //失效商品
			}
		},

		components: {},
		onLoad() {
			var that = this;
			let query = wx.createSelectorQuery().in(this);
			that.carlist = wx.getStorageSync("listcar") || [];
			that.lostgoods = wx.getStorageSync("lostgoods") || [];
			that.getOnegoods();
			wx.getSystemInfo({
				success: function(res) {
					that.percent = res.windowWidth / 750;

				}
			});
			that.goodsType();

			//that.searchSet();

		},
		onShow() {

		},
		methods: {
			cancelempty() {
				this.hiddenmodalput = true;
			},
			confirmempty() {
				this.hiddenmodalput = true;
				this.isshowCar = true;
			},
			/* 获取商品分类 */
			goodsType() {
				var that = this;
				that.menulist = [{
						"id": 0,
						"name": "今日特价",
						"color": "red"
					},
					{
						"id": "1344",
						"name": "生日蛋糕",
						"color": ""
					},
				];
				that.calunum();

			},
			/* 获取一个商品分类列表 */
			getOnegoods() {
				var that = this;
				var param = {
					cate_id: that.cate_id,
					pageSize: that.pageSize,
					page: that.goodspage
				}
				var newgoodslist = [];
				var lists = [
					[{
							"id": "344",
							"title": "生日蛋糕1",
							"color": "",
							"g_color": "白色",
							"thumb_img": "https://m.2yahua.com/data/upload/nopicture.jpg",
							"img": [],
							"price": "22.00",
							"level": "A",
							"danwei": "20支/扎",
							"attr": "0",
							"goods_nums": "75",
							"desc": "",
							"trend": "1",
							"cateName": "生日蛋糕",
							"today_tj": 0,
							"cate_id": 1344
						},
						{
							"id": "870",
							"title": "咖啡时间",
							"color": "",
							"g_color": "",
							"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180502/235ae95194c2262.png",
							"img": [
								"https://m.2yahua.com//data/upload/source/img/20180502/885ae951a863944.png"
							],
							"price": "60.80",
							"level": "B",
							"danwei": "20支/扎",
							"attr": "0",
							"goods_nums": "0",
							"desc": "",
							"trend": "1",
							"cateName": "生日蛋糕",
							"today_tj": 0,
							"cate_id": 1344
						},
						{
							"id": "870",
							"title": "咖啡时间",
							"color": "",
							"g_color": "",
							"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180502/235ae95194c2262.png",
							"img": [
								"https://m.2yahua.com//data/upload/source/img/20180502/885ae951a863944.png"
							],
							"price": "60.80",
							"level": "B",
							"danwei": "20支/扎",
							"attr": "1",
							"goods_nums": "1",
							"desc": "",
							"trend": "1",
							"cateName": "生日蛋糕",
							"today_tj": 0,
							"cate_id": 1344
						},
						{
							"id": "870",
							"title": "咖啡时间",
							"color": "",
							"g_color": "",
							"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180502/235ae95194c2262.png",
							"img": [
								"https://m.2yahua.com//data/upload/source/img/20180502/885ae951a863944.png"
							],
							"price": "60.80",
							"level": "B",
							"danwei": "20支/扎",
							"attr": "2",
							"goods_nums": "2",
							"desc": "",
							"trend": "1",
							"cateName": "生日蛋糕",
							"today_tj": 0,
							"cate_id": 1344
						},
						{
							"id": "870",
							"title": "咖啡时间",
							"color": "",
							"g_color": "",
							"thumb_img": "https://m.2yahua.com//data/upload/source/img/20180502/235ae95194c2262.png",
							"img": [
								"https://m.2yahua.com//data/upload/source/img/20180502/885ae951a863944.png"
							],
							"price": "60.80",
							"level": "B",
							"danwei": "20支/扎",
							"attr": "3",
							"goods_nums": "2",
							"desc": "",
							"trend": "1",
							"cateName": "生日蛋糕",
							"today_tj": 0,
							"cate_id": 1344
						}
					]
				];
				if (lists[0] && lists[0].length > 0) {
					newgoodslist = lists[0]
				}
				if (that.goodspage == 1) {
					that.goodslist = newgoodslist;
					that.scrollTop = 0;

				} else {
					that.goodslist = that.goodslist.concat(newgoodslist);
				}
				//that.uploadgoodslist();
				that.calunum('1')
				// 										if (that.goodslist.length >= da.data.count) {
				// 											that.isMoregoods = false;
				// 										} else {
				// 											that.goodspage++;
				// 										}
				//that.isloading = true;
				// 				api.getOnegoods(param).then(da => {
				// 					if (da.code == 200) {
				// 						
				// 
				// 					}
				// 					that.isloading = false;
				// 
				// 				})
			},
			loadgoodslist() {
				if (this.isMoregoods) {
					//this.getOnegoods();
				}
			},
			/*确认搜索*/
			confirm() {
				var that = this;
				that.page = 1;
				that.isMore = true;
				that.isResult = true;
				that.searchlist = [];
				that.searchGoods()
			},
			searchGoods() {
				var that = this;
				var param = {
					pageSize: that.pageSize,
					page: that.page,
					keyword: that.keyword,
					price: that.filter.price,
					color: that.filter.color.join(','),
					use: that.filter.use.join(','),
					attr: that.filter.attr.join(','),
					other: that.filter.other.join(',')
				}
				//console.log(2)
				/* api.searchGoods(param).then(da => {
					if (da.code == 200) {
						var list = da.data.lists;
						if (list.length > 0) {
							list.forEach(item => {
								item.num = 0;
								for (var i = 0; i < that.carlist.length; i++) {
									if (that.carlist[i].id == item.id) {
										item.num = that.carlist[i].num
										break;
									}
								}
								that.searchlist.push(item);
							});

							//that.searchlist.concat(list);
							//console.log(that.searchlist)
						}

						if (that.searchlist.length >= da.data.count) {
							that.isMore = false
						} else {
							that.page++
						}
					}
				}) */
			},
			addResult(goods, index) {
				var that = this;
				if (parseInt(goods.goods_nums) > parseInt(goods.num)) {
					goods.num++;
					that.$set(that.searchlist, index, goods);
					var carindex = -1;
					if (that.carlist && that.carlist.length > 0) {
						var carindex = that.carlist.findIndex(item => {
							return item.id == goods.id
						});

					}
					var onegoods = Object.assign({}, goods, {
						cate_id: goods.cid
					})

					if (carindex == -1) {
						that.carlist.push(onegoods)
					} else {
						that.$set(that.carlist, carindex, onegoods);
					}

					that.calunum('1');
				}
			},
			minusResult(goods, index) {
				var that = this;
				if (goods.num == 0) {
					return false;
				}
				goods.num--;
				//that.searchlist(index).num++;
				that.$set(that.searchlist, index, goods);
				var carindex = -1;
				if (that.carlist && that.carlist.length > 0) {
					var carindex = that.carlist.findIndex(item => {
						return item.id == goods.id
					});

				}
				if (carindex > -1) {
					that.carlist[carindex].num = goods.num;
				}

				that.calunum('1');
			},
			editResult(goods, index) {
				var that = this;
				var num = goods.num;
				if (goods.goods_nums < goods.num) {
					num = 0;
				}
				goods.num = num;
				that.$set(that.searchlist, index, goods);
				if (that.carlist && that.carlist.length > 0) {
					var carindex = that.carlist.findIndex(item => {
						return item.id == goods.id
					});

				}
				if (carindex > -1) {
					that.carlist[carindex].num = goods.num;
				}
				that.calunum('1');
			},
			/*加载更多筛选*/
			loadresult() {
				var that = this;
				if (that.isMore) {
					that.searchGoods()
				}
			},
			/*打开筛选框*/
			showfilter(e) {
				var that = this;
				that.isFilter = !that.isFilter;

			},
			//关闭筛选框
			closeFilter(e) {
				//console.log(234);
				var that = this;
				that.isFilter = !that.isFilter;

			},
			//确认筛选
			confirmFilter(e) {
				//console.log(123)
				//				var that=this;
				//	
				this.filter = {
					color: [],
					price: '',
					use: [],
					attr: [],
					other: []
				}
				for (var key in this.filterlist) {
					if (this.filterlist[key].length > 0) {
						this.filterlist[key].forEach(item => {
							if (item.sel == 1) {
								if (key == 'color') {
									this.filter.color.push(item.id)
								} else if (key == 'price') {
									this.filter.price = item.val
								} else {
									this.filter[key].push(item.val)
								}
							}

						})
					}
				}
				//console.log(JSON.stringify(this.filter))
				this.isFilter = !this.isFilter;
				this.confirm();

			},
			clearFilter(e) {
				this.filter = {
					color: [],
					price: '',
					use: [],
					attr: [],
					other: []
				}
				for (var key in this.filterlist) {
					if (this.filterlist[key].length > 0) {
						this.filterlist[key].forEach(item => {
							item.sel = 0
						})
					}
				}

			},
			stopclose(e) {
				//console.log(234);
			},
			closeGoodsdetails(e) {
				var that = this;
				//console.log(e)
				if (e.currentTarget.id == e.target.id)
					that.isDetails = !that.isDetails
			},
			showDetails(item, index) {

				//this.scrollTop = this.oldscrollTop;
				var that = this;
				this.isTap = true;
				this.classifySeleted = '';
				that.isDetails = !that.isDetails;
				that.Details = item;
				that.DetailsIndex = index;
				// that.DetailstypeIndex = index;
			},
			tapClassify(e) {
				this.classifySeleted = e.mp.currentTarget.dataset.id;
				this.isTap = true;
				//console.log(this.classifySeleted)
			},

			addnum(goods, index) {
				var that = this;
				//console.log(goods.goods_nums);
				//console.log(goods.num)
				if (parseInt(goods.goods_nums) > parseInt(goods.num)) {
					if (parseInt(goods.num) >= 30) {
						wx.showToast({
							title: '单个商品的上限为30扎',
							icon: 'none'
						});
						return false;
					}
					that.goodslist[index].num++;
					var carindex = -1;
					if (that.carlist && that.carlist.length > 0) {
						var carindex = that.carlist.findIndex(item => {
							return item.id == goods.id
						});

					}
					var onegoods = Object.assign({}, goods, {
						cate_id: goods.cate_id == 0 ? goods.cid : goods.cate_id
					})

					if (carindex == -1) {
						that.carlist.push(onegoods)
					} else {
						that.$set(that.carlist, carindex, onegoods);
					}

					//console.log(that.carlist);
					that.calunum();

				} else {
					wx.showToast({
						title: '已经是最大了',
						icon: 'none'
					})
				}

			},

			minusnum(goods, index) {
				var that = this;
				if (goods.num > 0) {
					goods.num--;

					if (goods.num >= 0) {
						var carindex = -1;
						if (that.carlist && that.carlist.length > 0) {
							var carindex = that.carlist.findIndex(item => {
								return item.id == goods.id
							});

						}
						var onegoods = Object.assign({}, goods, {
							cate_id: goods.cate_id == 0 ? goods.cid : goods.cate_id
						})
						if (carindex > -1) {
							that.$set(that.carlist, carindex, onegoods);
						}
					}
					//console.log(that.carlist)
					that.calunum();
				}

			},
			editnum(goods, index) {
				var that = this;
				var num = goods.num || 0;
				if (parseInt(goods.goods_nums) < parseInt(goods.num) || (parseInt(goods.num) > 30)) {
					goods.num = 0;
					num = 0;
				};
				goods.num = num;
				var carindex = -1;
				if (that.carlist && that.carlist.length > 0) {
					var carindex = that.carlist.findIndex(item => {
						return item.id == goods.id
					});

				}
				if (carindex > -1) {
					that.carlist[carindex].num = goods.num;
					//that.$set(that.carlist, carindex, onegoods);
				}
				that.calunum();
			},
			/*更新列表数据*/
			uploadgoodslist() {
				var that = this;
				for (var i = 0; i < that.goodslist.length; i++) {
					if (that.carlist && that.carlist.length > 0) {
						var index = that.carlist.findIndex(item => item.id == that.goodslist[i].id);
						if (index > -1) {
							that.goodslist[i].num = that.carlist[index].num
						} else {
							that.goodslist[i].num = 0
						}
					} else {
						that.goodslist[i].num = 0
					}
					//	if(that.goodslist[i].id)
				}
				//console.log(that.goodslist)
			},
			calunum(upload) {

				var that = this;
				/*重计算总数*/
				that.totalnum = 0;
				that.totalprice = 0;
				if (that.carlist && that.carlist.length > 0) {
					that.carlist = that.carlist.filter(item => {
						return parseInt(item.num) > 0
					})
				}
				for (var i = 0; i < that.carlist.length; i++) {
					that.totalnum = that.totalnum + parseInt(that.carlist[i].num);
					that.totalprice = that.totalprice + that.carlist[i].price * that.carlist[i].num;
				};
				that.menulist.forEach((item, index) => {
					var list = that.carlist.filter(subitem => subitem.cate_id == item.id);
					var total = 0;
					if (list && list.length > 0) {
						for (var i = 0; i < list.length; i++) {
							total = total + parseInt(list[i].num)
						}
						//list.reduce((total, listitem) => total = total + listitem.num, 0);

					}
					item.num = total;
					//console.log(total);
					that.$set(that.menulist, index, item);

				});
				//console.log(that.menulist)
				that.totalprice = that.totalprice.toFixed(2);
				wx.setStorageSync("listcar", that.carlist);

				if (upload) {
					that.uploadgoodslist();
				}
				/* 能够重新购买的无效产品清除 */
				var caridlists = that.carlist.map(item => item.id);
				var newlostgoods = [];
				for (var i = 0; i < that.lostgoods.length; i++) {
					if (caridlists.findIndex(item => {
							return item == that.lostgoods[i].id
						}) == -1) {
						newlostgoods.push(that.lostgoods[i])
					};

				}
				that.lostgoods = newlostgoods;
				wx.setStorageSync("lostgoods", that.lostgoods);

			},
			/*购物车中的添加*/
			addCarnum(goods) {
				var that = this;
				if (parseInt(goods.goods_nums) > parseInt(goods.num)) {
					if (goods.num >= 30) {
						wx.showToast({
							title: '单个商品的上限为30扎',
							icon: 'none'
						});
						return false;
					}
					/**/
					goods.num++;

				} else {
					wx.showToast({
						title: '已经是最大了',
						icon: 'none'
					});
				}
				that.calunum('1');

			},
			/*购物车中的删除*/
			minusCarnum(goods) {
				var that = this;
				if (parseInt(goods.num) > 0) {
					goods.num--;

				}
				//console.log(goods)
				that.calunum('1');
			},
			/*购物车中的编辑*/
			editCarnum(goods) {
				var that = this;
				var num = goods.num;
				if (parseInt(goods.num) > parseInt(goods.goods_nums) || parseInt(goods.num) > 30) {
					num = 0;

				}
				goods.num = num;
				/*var list = [];
				if(that.goodslist.length > 0) {
					that.goodslist.forEach((item, i) => {
						if(item.lists.length > 0) {
							item.lists.forEach(subitem => {
								if(subitem.id == goods.id) {
									subitem.num = num;
									list.push(i);
								}
							})
						}
					});
					//console.log(list);
					for(var i = 0; i < list.length; i++) {
						var total = 0;
						that.goodslist[list[i]].lists.forEach(item => {
							total = parseInt(total) + parseInt(item.num);
						});

						that.menulist[list[i]].num = total;
						console.log('shul' + that.menulist[list[i]].num)
					}

				}*/
				that.calunum('1');

			},
			/*关闭购物车*/
			closeCar(e) {
				var that = this;
				if (e.currentTarget.id == e.target.id) {
					that.isshowCar = false;
				}

			},
			/*打开购物车*/
			openCar() {
				var that = this;
				if (that.totalnum > 0) {
					that.isshowCar = true;
				}
			},
			empty() {
				var that = this;
				/*if(that.goodslist && that.goodslist.length > 0) {
					that.goodslist.forEach(item => {
						if(item.lists.length > 0) {
							item.lists.forEach(subitem => {
								subitem.num = 0
							})
						}
					});
				};
				if(that.menulist.length > 0) {
					that.menulist.forEach(item => item.num = 0)
				}*/


				that.isshowCar = false;
				that.carlist = [];
				that.calunum('1');
				/*清空缓存*/
				wx.removeStorageSync("listcar");
			},
			emptylost() {
				this.lostgoods = [];
				/*清空缓存*/
				wx.removeStorageSync("lostgoods");
			},

			gotoInvo() {
				/* 先判断是否登录过了 */
				if(wx.getStorageSync('isLogin')==1){
					/*结算*/
					var that = this;
					if (that.totalnum >= that.packnum) {
						/* 校验购物车状态 */
					const url = '/pages/orderdetails/main?type=1'
						wx.navigateTo({
							url
						})
					}
				}else{
					wx.showModal({
						title: '提示',
						content: '你还没有绑定手机号码，是否绑定？',
						success(res) {
							if (res.confirm) {
								const url = '/pages/reg/main';
								wx.navigateTo({
									url
								});
								// console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
				
			},
			/*搜索设置*/
			searchSet() {
				var that = this;
				/* api.searchSet().then(da => {
					if (da.code == 200) {
						that.filterlist = da.data
					}
				}) */
			},
			addfilter(type, item, index) {
				var that = this;

				if (type == 'price') {
					that.filterlist['price'].map(a => {
						a.sel = 0;
					})
				}
				var myitem = item;
				myitem.sel = (item.sel == 1) ? 0 : 1;
				that.$set(that.filterlist[type], index, myitem)

				//console.log(JSON.stringify(that.filter))
			},
			showChart(id) {
				this.isShowChart = true;
				this.classifySeleted = '';


			},
			closeChart(e) {
				if (e.currentTarget.id == e.target.id)
					this.isShowChart = !this.isShowChart
			},
			change(e) {

				this.indexSize = e.mp.detail.current;
			},
			scrollTo(myitemIndex, item) {
				this.indexSize = myitemIndex;
				this.classifySeleted = item.id;
				this.cate_id = item.id;
				this.isMoregoods = true;
				this.goodspage = 1;
				this.getOnegoods();
				this.isTap = true;

				//	console.log('hhhhhh')

			},
			stopTouchMove: function() {
				return false;
			},

			/*购物车状态*/
			shopCart(ids, type) {
				var that = this;

			},
			scroll(e) {
				//console.log(e.mp.detail.scrollTop);
				//this.oldscrollTop = e.mp.detail.scrollTop;
				this.scrollTop = '';
			},
			refresh() {
				this.goodspage = 1;
				this.isMoregoods = true;
				this.getOnegoods();
			},
			

		},

		created() {

		},

		computed: {

		},
		

	}
</script>

<style scoped>
	ec-canvas {
		width: 400px;
		height: 400px;
		background: #f00;
	}

	.mt5 {
		margin-top: 8px;
	}

	.loading {
		position: absolute;
		top: 0;
		height: 30px;
		left: 0;
		right: 0;
	}

	.searchbar {
		background: #ff5454;
		height: 120rpx;
		padding: 30rpx 20rpx;
	}

	.searchbar a {
		color: #fff;
		display: block;
		/*width: 4em;*/
		text-align: center;
	}

	.searchbar>div {
		height: 60rpx;
		background: #fff;
		border-radius: 6px;
		margin: 0 10px;
	}

	.searchbar .search {
		display: block;
		height: 40rpx;
		width: 40rpx;
		margin: 10rpx;
		line-height: 40rpx;
		font-size: 24rpx;
	}

	.searchbar .search image {
		height: 100%;
		width: 100%;
	}

	.searchbar input {
		border: none;
		background: none;
		width: 100%;
		font-size: 24rpx;
	}

	.grid {
		position: absolute;
		top: 120rpx;
		bottom: 130rpx;
		left: 0;
		right: 0;
		overflow: hidden;
	}

	.grid.bottom {
		bottom: 170rpx;
	}

	.grid .submenu {
		width: 160rpx;
		text-align: center;
		font-size: 28rpx;
		color: #434343;
		margin: 0 auto;
		height: 100%;
		overflow: hidden;
		border-right: 1px solid #e6e6e6;
		background: #fff;
	}

	.scroll-view {
		width: 100%;
		height: 100%;
	}

	.grid .submenu li {
		height: 90rpx;
		padding: 0 10rpx;
		border-bottom: 1px solid #e6e6e6;
		position: relative;
	}

	.grid .submenu li:before {
		content: '';
		height: 80%;
		width: 10rpx;
		background: transparent;
		display: inline-block;
		position: absolute;
		left: 10rpx;
		top: 10%;
	}

	.grid .submenu li.active:before {
		background: #ff5454;
	}

	.grid .submenu ul li>span {
		height: 90rpx;
		text-align: center;
		color: #434343;
		margin: 0 auto;
		overflow: hidden;
	}

	.grid .submenu ul li i {
		position: absolute;
		background: #ff5454;
		color: #fff;
		height: 16px;
		min-width: 16px;
		border-radius: 20px;
		padding: 0 3px;
		font-size: 10px;
		text-align: center;
		right: 1px;
		top: 4px;
		line-height: 16px;
		font-style: normal;
		display: none;
	}

	.grid .submenu ul li i.show {
		display: inline-block;
	}

	.grid .filterbar {
		background: #fff;
		font-size: 24rpx;
		line-height: 90rpx;
		text-align: center;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 99;
	}

	.grid .main {
		position: relative;
		height: 100%;
		background: #f6f6f6;
	}

	.searchbar .filterBtn {
		display: inline-block;
		background: #fff;
		border-radius: 5px;
		height: 60rpx;
		line-height: 60rpx;
		padding: 0 20rpx;
		color: #ff5454;
		font-size: 24rpx;
	}

	.grid .main .goodslist {
		/* position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0; */
		width: 100%;

		height: 100%;
		/*padding-top: 90rpx;*/
		box-sizing: border-box;
	}

	.grid .main .goodslist h4 {
		font-size: 30rpx;
		padding-left: 20rpx;
		height: 30rpx;
		line-height: 30rpx;
		padding-top: 20rpx;
	}

	.goodslist-item {
		background: #fff;
		margin-bottom: 20rpx;
		padding: 20rpx 20rpx 10rpx;
		position: relative;
		height: 190rpx;
	}

	.goodslist-item .goodimg {
		width: 160rpx;
		display: block;
		position: relative;
	}

	.goodslist-item .goodimg image {
		display: block;
		width: 100%;
		height: 160rpx;
	}

	.goodslist-item .goodimg .goodstag {
		position: absolute;
		right: 0;
		top: 0;
		color: #fff;
		font-size: 20rpx;
		line-height: 30rpx;
		padding: 0 10rpx;
	}

	.goodslist-item .goodimg .goodstag1 {
		background: #42d7a2;
	}

	.goodslist-item .goodimg .goodstag2 {
		background: #fdb116;
	}

	.goodslist-item .goodimg .goodstag3 {
		background: #bc6fe6;
	}

	.goodslist-item .goodinfo {
		margin-left: 10px;
		font-size: 10px;
	}

	.goodslist-item .desc {
		font-size: 10px;
		color: #999;
		height: 30rpx;
		line-height: 30rpx;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}

	.goodslist-item .price,
	.result .price {
		font-size: 16px;
	}

	.goodslist-item .edit {
		position: absolute;
		right: 20rpx;
		top: 110rpx;
	}

	.goodslist-item .name,
	.result .name {
		color: #434343;
		font-size: 16px;
	}

	.goodslist-item .num,
	.goodsdetails .num,
	.result .num {
		/* color: #b3b3b3; */
		font-size: 14px;
	}

	.goodslist-item .tag,
	.goodsdetails .tag,
	.carlist .tag,
	.taglist .tag,
	.result .tag {
		border: 1px solid #3cb878;
		color: #3cb878;
		font-weight: bold;
		border-radius: 2px;
		padding: 0 2px;
		font-size: 10px;
		margin: 0 5rpx
	}

	.goodslist-item .color,
	.goodsdetails .color,
	.carlist .color,
	.taglist .color,
	.result .color {
		border: 1px solid #ff5454;
		border-radius: 2px;
		padding: 0 2px;
		font-size: 10px;
		color: #ff5454;
	}

	.goodsdetails .edit .add,
	.goodslist-item .edit .add,
	.carlist .edit .add,
	.searchwin .edit .add,
	.result .edit .add {
		display: inline-block;
		width: 22px;
		height: 22px;
		background-size: 100% auto;
		vertical-align: middle;
	}

	.goodsdetails .edit .minus,
	.goodslist-item .edit .minus,
	.carlist .edit .minus,
	.searchwin .edit .minus,
	.goodsdetails .edit .plus,
	.goodsdetails .edit .minus,
	.result .edit .minus {
		display: inline-block;
		width: 22px;
		height: 22px;
		background-size: 100% auto;
		vertical-align: middle;
	}

	.edit image {
		height: 100%;
		width: 100%;
	}

	.goodsdetails .edit input[type=number],
	.goodslist-item .edit input[type=number],
	.carlist .edit input[type=number],
	.searchwin .edit input[type=number],
	.goodsdetails .edit input[type=number],
	.result .edit input[type=number] {
		width: 26px;
		border: none;
		text-align: center;
		vertical-align: middle;
		color: #434343;
		display: inline-block;
		font-size: 28rpx;
	}

	.echart {
		display: inline-block;
		height: 38rpx;
		width: 38rpx;
		padding-top: 10rpx;
		margin-left: 10rpx;
	}

	.list-footer {
		position: fixed;
		height: 120rpx;
		bottom: 0;
		left: 0;
		right: 0;
		color: #fff;
		background: #323332;
		z-index: 9999;
	}

	.list-footer .invoiceBtn {
		width: 200rpx;
		background: #666;
		color: #999;
		font-size: 33rpx;
		text-align: center;
		line-height: 120rpx;
	}

	.list-footer .invoiceBtn.active {
		background: #ff5454;
		color: #fff;
	}

	.list-footer .carbox .car {
		height: 120rpx;
		width: 120rpx;
		background: #666;
		border-radius: 100%;
		position: absolute;
		top: -20rpx;
		left: 10rpx;
		text-align: center;
	}

	.list-footer .carbox.active .car {
		background: #ff5454;
	}

	.list-footer .carbox .car image {
		width: 70rpx;
		height: 70rpx;
		margin-top: 25rpx;
	}

	.list-footer .carbox .car div {
		opacity: 0;
		position: absolute;
		right: -10rpx;
		top: 0;
	}

	.list-footer .carbox.active .car div {
		color: #010101;
		background: #fff100;
		border-radius: 20rpx;
		padding: 2rpx 8rpx;
		font-size: 22rpx;
		opacity: 1;
	}

	.list-footer .goodsnum {
		margin-left: 180rpx;
		line-height: 120rpx;
		color: #999;
		font-size: 30rpx;
	}

	.list-footer .goodsnum.active {
		color: #fff;
	}

	.list-footer .goodsnum .tip {
		font-size: 22rpx;
		margin-top: 10rpx;
	}

	.filter {
		position: fixed;
		background: rgba(0, 0, 0, .4);
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		display: none;
		opacity: 0;
		z-index: 999;
		font-size: 30rpx;
		/*transition: all .2s;*/
	}

	.filter.active {
		display: block;
		animation: fadeIn .3s forwards;
		/*transform: translateX(0);*/
	}

	.filter>div {
		position: absolute;
		left: 20%;
		right: 0;
		top: 0;
		bottom: 120rpx;
		background: #fff;
		padding-top: 30px;
		padding-left: 10px;
		transform: translateX(100%);
	}

	.filter.active>div {
		animation: slideInRight .3s forwards;
	}

	.filter.active>div>div:first-child {
		position: absolute;
		left: 10px;
		right: 0;
		top: 30px;
		bottom: 40px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.filter.active1>div {
		animation: slideOutRight .3s forwards;
	}

	@keyframes slideInRight {
		0% {
			transform: translate3d(100%, 0, 0);
			visibility: visible
		}

		to {
			transform: translateZ(0)
		}
	}

	@keyframes slideOutRight {
		0% {
			transform: translateZ(0);
			visibility: hidden;
		}

		to {
			transform: translate3d(100%, 0, 0);
			visibility: visible
		}
	}

	.filter>div .filter-modbox span {
		display: inline-block;
		background: #f1f0f0;
		color: #9e9d9d;
		padding: 16rpx 30rpx;
		border-radius: 5px;
		margin: 5px;
		font-size: 24rpx;
	}

	.filter>div .filter-modbox span.active {
		background: #ff5454;
		color: #fff;
	}

	.filter .btnbox {
		position: absolute;
		bottom: 0;
		overflow: hidden;
		width: 100%;
		left: 0;
	}

	.filter .btnbox span {
		float: left;
		width: 50%;
		text-align: center;
		height: 40px;
		background: #f1f0f0;
		line-height: 40px;
		color: #9e9d9d;
	}

	.filter .btnbox span:first-child {
		background: #ff5454;
		color: #fff;
	}

	.red {
		color: #ff5a5a;
	}

	.isCannotice {
		text-align: center;
		font-size: 24rpx;
		background: #fff2d1;
		width: 100%;
		margin: 0;
		position: fixed;
		bottom: 120rpx;
		left: 0;
		line-height: 60rpx;
		color: #010101;
		z-index: 99;
	}

	/*购物车*/

	.carlist {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		top: 0;
		background: rgba(0, 0, 0, .4);
		display: none;
		opacity: 0;
		z-index: 999;
		font-size: 28rpx;
	}

	.carlist.active {
		display: block;
		animation: fadeIn .3s forwards;
	}

	.carlist>div {
		background: #f6f6f6;
		position: absolute;
		bottom: 60px;
		left: 0;
		width: 100%;
		transform: translateY(100%);
	}

	.carlist.active>div {
		animation: slideInUp .3s both;
	}

	.carlist.active2 {
		/*animation: fadeOut .3s .1s forwards;*/
	}

	.carlist.active2>div {
		animation: slideOutDown .3s both;
	}

	.carlist .notice {
		padding-left: 20rpx;
		font-size: 28rpx;
	}

	.carlist>div ul {
		background: #fff;
		max-height: 200px;
		overflow: auto;
		-webkit-overflow-scrolling: auto;
	}

	.carlist>div ul li {
		border-bottom: 1px solid #e9e9e9;
		padding: 15px 10px;
	}

	.carlist>div ul li>span {
		width: 20%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.carlist>div ul li>span.name {
		width: 35%;
	}

	.carlist>div ul li .price {
		color: #ff5454;
	}

	.carlist>div ul li .edit {
		width: 25%;
		text-align: right;
	}

	.carlist>div ul li .edit a,
	.carlist>div ul li .edit input {
		display: inline-block !important;
	}

	/*清空购物车*/

	.clearCar {
		color: #ababab;
		margin-right: 20px;
	}

	.clearCar img {
		width: 14px;
		vertical-align: middle;
	}

	.clearCar span {
		vertical-align: middle;
	}

	.goodsdetails {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		background: rgba(0, 0, 0, .4);
		top: 0;
		display: none;
		opacity: 0;
		z-index: 9999;
	}

	.goodsdetails>div {
		background: #fff;
		position: absolute;
		bottom: 0;
		width: 100%;
		transform: translateY(100%);
		transition: all .3s;
	}

	.goodsdetails.active {
		display: block;
		animation: fadeIn .3s forwards;
	}

	.goodsdetails.active>div {
		animation: slideInUp .3s both;
	}

	.goodsdetails.active1>div {
		animation: slideOutDown .3s both;
	}

	.goodsdetails .swiper-container+div {
		padding: 20px;
	}

	.goodsdetails .swiper-container+div .info {
		font-size: 10px;
		color: #999;
	}

	.goodsdetails .price {
		color: #ff5454;
		font-size: 16px;
	}

	.goodsdetails .slide,
	.goodsdetails .slide .swiper {
		width: 100%;
		display: block;
		height: 750rpx;
	}

	.goodsdetails .slide .swiper .slide-image {
		/*height: 100%;*/
		width: 100%;
	}

	.goodsdetails .name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.goodsdetails .goodsInfo {
		padding: 20rpx;
		font-size: 28rpx;
	}

	.goodsdetails .goodsInfo .price {
		font-size: 28rpx;
	}

	.goodsdetails .goodsInfo .desc {
		font-size: 30rpx;
		color: #999;
	}

	@keyframes slideInUp {
		0% {
			transform: translate3d(0, 100%, 0);
			visibility: visible
		}

		to {
			transform: translateZ(0)
		}
	}

	@keyframes slideOutDown {
		0% {
			transform: translateZ(0);
			visibility: hidden;
		}

		to {
			transform: translate3d(0, 100%, 0);
			visibility: visible
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0
		}

		to {
			opacity: 1
		}
	}

	@keyframes fadeOut {
		0% {
			opacity: 1
		}

		to {
			opacity: 0
		}
	}

	.result {
		position: fixed;
		display: none;
		width: 100%;
		top: 0;
		left: 0;
		bottom: 120rpx;
		background: #fff;
		z-index: 999;
	}

	.result h4 {
		text-align: center;
		line-height: 60rpx;
	}

	.result.active {
		display: block;
	}

	.result .close {
		background: rgba(0, 0, 0, .4);
		border-radius: 100%;
		height: 50rpx;
		width: 50rpx;
		text-align: center;
		line-height: 40rpx;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		color: #fff;
		font-size: 24px;
	}

	.result .resultlist {
		position: absolute;
		top: 60rpx;
		left: 3%;
		bottom: 0;
		width: 94%;
		background: #f6f6f6;
	}

	.result .resultlist ul li {
		padding: 0 10rpx;
	}

	.result .resultlist ul li>span {
		width: 20%;
	}

	.result .resultlist ul li.name {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.result .resultlist ul li>span.edit {
		width: 40%;
	}

	.chartbox {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: rgba(0, 0, 0, .4);
		z-index: 9999;
		display: none;
	}

	.chartbox.active {
		display: block;
	}

	.chartbox>div {
		height: 500rpx;
		width: 100%;
		background: #fff;
		position: absolute;
		bottom: 0;
		left: 0;
	}

	.contact {
		padding: 0;
		line-height: 0;
		height: 60rpx;
		background: none;
		box-shadow: none;
		position: relative;
	}

	.contact image {
		width: 64rpx;
		height: 64rpx;
		border: none;
	}


</style>
