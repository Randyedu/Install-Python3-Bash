import * as echarts from '../../ec-canvas/echarts';
var Bmob = require("../../utils/bmob.js");
const app = getApp();
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var lineChart = null;
var pieChart = null;
var line1Chart = null;
var widthL;
var heightL;
var luckydate = [];
var luckysequence = [];
var luckycount = [];
var luckycount1 = [];
var luckyserier = [];
var luckynumber = [];
var luckynum1 = [];
var luckynum2 = [];
var luckynum3 = [];
var luckynum4 = [];
var luckynum5 = [];
var luckynum6 = [];
var luckyprofit = [];
var luckypro1 = [];
var luckypro2 = [];
var luckypro3 = [];
var luckypro4 = [];
var luckypro5 = [];
var luckypro6 = [];
var luckyInform = [];
//获取应用实例
var a = -1;
var b = -1;
var c = -1;
var d = -1;
var states = 0;
Page({
	data: {
		ecLine: {
			onInit: initlineChart
		},
		ecPie: {
			onInit: initline1Chart
		},
		direction: {
			onInit: initpieChart
		},
		list1: [1, 2, 3, 4, 5, 6, 7, 8, 9],
		list2: [11, 12, 13, 14, 15, 16, 17, 18, 19],
		list3: [21, 22, 23, 24, 25, 26, 27, 28, 29],
		list4: [31, 32, 33, 34, 35, 36, 37, 38, 39],
		list5: [41, 42, 43, 44, 45, 46, 47, 48, 49],
		tabs: ["一", "二", "三", "四", "五", "六", "特"],
		tabs1: ["十", "半百", "百", "月", "季", "半", "年"],
		activeIndex: 1,
		activeIndex1: 1,
		//sliderOffset: 0,
		luckydate: [],
		luckysequence: [],
		luckynumber: [],
		luckynum1: [],
		luckynum2: [],
		luckynum3: [],
		luckynum4: [],
		luckynum5: [],
		luckynum6: [],
		luckyprofit: [],
		luckypro1: [],
		luckypro2: [],
		luckypro3: [],
		luckypro4: [],
		luckypro5: [],
		luckypro6: [],
		luckyserier: [],
		luckycount: [],
		luckycount1: [],
		luckybig: 0,
		luckysml1: 0,
		luckysml2: 0,
		luckysml3: 0,
		luckysml4: 0,
		luckysml5: 0,
		luckysml6: 0,
		luckyday: 0,
		luckyseq: 0,
		states: 0,
		sliderLeft: 0
	},

	onReady() {
		//setTimeout(this.getData, 500);
	},
	onLoad: function () {
		//get and load the whole year data
		this.getData("年");
	},
	periodChange1: function (e) {
		//console.log("periodChange " + e.detail.value);
		this.setData({
			activeIndex: e.currentTarget.id
		});
		this.getChart(e.detail.value);
	},
	periodChange: function (e) {
		//console.log("periodChange " + e.detail.value);
		this.setData({
			activeIndex: e.currentTarget.id
		});
		this.getData(e.detail.value);
	},
	numberChange: function (e) {
		//console.log("numberChange " + e.detail.value);
		this.setData({
			activeIndex1: e.currentTarget.id
		});

		this.loadData(e.detail.value);
	},
	numberPick1: function (e) {
		var list = this.data.list1;
		this.loadChart(list[e.detail.value]);
	},
	numberPick2: function (e) {
		var list = this.data.list2;
		this.loadChart(list[e.detail.value]);
	},
	numberPick3: function (e) {
		var list = this.data.list3;
		this.loadChart(list[e.detail.value]);
	},
	numberPick4: function (e) {
		var list = this.data.list4;
		this.loadChart(list[e.detail.value]);
	},
	numberPick5: function (e) {
		var num = e.target.dataset.num;
		console.log(num);
		var list = this.data.list5;
		this.loadChart(list[e.detail.value]);
	},
	//getData方法里发送ajax
	getData(type) {
		var limitrow = 0;
		if (type == "年") {
			limitrow = 155;
		} else if (type == "半百") {
			limitrow = 50;
		} else if (type == "十") {
			limitrow = 10;
		} else if (type == "月") {
			limitrow = 15;
		} else if (type == "季") {
			limitrow = 45;
		} else if (type == "半") {
			limitrow = 78;
		};
		var queryJoin = new Bmob.Query("marksix");
		queryJoin.order("-luckydate");
		queryJoin.limit(limitrow);
		queryJoin.find().then(result => {
			var j = 0;
			var reresult = [];
			for (var i = result.length - 1; i >= 0; i--) {
				reresult[j] = result[i];
				j++;
			};
			this.getProfit(reresult);
			this.getStrLucky(reresult);
			this.loadData("特");
		});
	},
	//getData方法里发送ajax
	getChart(type) {
		var limitrow = 0;
		if (type == "年") {
			limitrow = 155;
		} else if (type == "半百") {
			limitrow = 50;
		} else if (type == "十") {
			limitrow = 10;
		} else if (type == "月") {
			limitrow = 15;
		} else if (type == "季") {
			limitrow = 45;
		} else if (type == "半") {
			limitrow = 78;
		};
		var queryJoin = new Bmob.Query("marksix");
		queryJoin.order("-luckydate");
		queryJoin.limit(limitrow);
		queryJoin.find().then(result => {
			var j = 0;
			var reresult = [];
			for (var i = result.length - 1; i >= 0; i--) {
				reresult[j] = result[i];
				j++;
			};
			this.getAllProfit(reresult);
			this.loadchart("特");
		});
	},
	loadChart(luckynumber) {
		var id = luckynumber;
		console.log(id);
		wx.showLoading({
			title: '加载中...',
		});
		var luckynumber = this.data.luckynumber;
		var luckynumber1 = this.data.luckynumber;
		for (var i = 0; i < luckynumber1.length; i++) {
			if (luckynumber1[i] != id) {
				luckynumber1[i] = 0;
			}
		}
		var luckycount = this.data.luckycount;
		var title = "特码";
		var luckyprofit = this.data.luckyprofit;
		//lucknumber = this.data.luckysml6;
		var luckyserier = this.data.luckyserier;
		var luckydate = this.data.luckydate;

		// Update the first line chart
		var lineop = {
			title: {
				text: title + '号码走势',
			},
			xAxis: {
				data: luckydate,
			},
			series: [{
					type: 'bar',
					data: luckynumber1,
				}
			]
		};

		lineChart.setOption(lineop);
		// Update the second line chart
		var line1op = {
			title: {
				text: title + id + "运势"
			},
			xAxis: {
				data: luckydate,
			},
			series: [{
					data: luckyprofit
				}
			]
		};

		line1Chart.setOption(line1op);

		//update the 3rd chart
		var pieop = {
			title: {
				text: title + "热度(出现次数)"
			},
			xAxis: [{
					data: luckyserier,
				}
			],
			series: [{
					data: luckycount
				}
			]
		};

		pieChart.setOption(pieop);
		wx.hideLoading();
	},
	loadData(ma_type) {
		var id = ma_type;
		wx.showLoading({
			title: '加载中...',
		});
		var title = "";
		var lucknumber = 0;
		if (id == "特") {
			var luckynumber = this.data.luckynumber;
			var luckycount = this.data.luckycount;
			title = "特码";
			lucknumber = this.data.luckybig;
			var luckyprofit = this.data.luckyprofit;
		} else if (id == "一") {
			var luckynumber = this.data.luckynum1;
			var luckycount = this.data.luckycount1;
			title = "正一码";
			lucknumber = this.data.luckysml1;
			var luckyprofit = this.data.luckypro1;
		} else if (id == "二") {
			var luckynumber = this.data.luckynum2;
			var luckycount = this.data.luckycount1;
			title = "正二码";
			lucknumber = this.data.luckysml2;
			var luckyprofit = this.data.luckypro2;
		} else if (id == "三") {
			var luckynumber = this.data.luckynum3;
			var luckycount = this.data.luckycount1;
			title = "正三码";
			lucknumber = this.data.luckysml3;
			var luckyprofit = this.data.luckypro3;
		} else if (id == "四") {
			var luckynumber = this.data.luckynum4;
			var luckycount = this.data.luckycount1;
			title = "正四码";
			var luckyprofit = this.data.luckypro4;
			lucknumber = this.data.luckysml4;
		} else if (id == "五") {
			var luckynumber = this.data.luckynum5;
			var luckycount = this.data.luckycount1;
			title = "正五码";
			var luckyprofit = this.data.luckypro5;
			lucknumber = this.data.luckysml5;
		} else if (id == "六") {
			var luckynumber = this.data.luckynum6;
			var luckycount = this.data.luckycount1;
			title = "正六码";
			var luckyprofit = this.data.luckypro6;
			lucknumber = this.data.luckysml6;
		};
		var luckyserier = this.data.luckyserier;
		var luckydate = this.data.luckydate;
		// Update the first line chart
		var lineop = {
			title: {
				text: title + '号码走势',
			},
			xAxis: {
				data: luckydate,
			},
			series: [{
					data: luckynumber,
				}
			]
		};

		lineChart.setOption(lineop);
		// Update the second line chart
		var line1op = {
			title: {
				text: title + lucknumber + "运势"
			},
			xAxis: {
				data: luckydate,
			},
			series: [{
					data: luckyprofit
				}
			]
		};

		line1Chart.setOption(line1op);

		//update the 3rd chart
		var pieop = {
			title: {
				text: title + "热度(出现次数)"
			},
			xAxis: [{
					data: luckyserier,
				}
			],
			series: [{
					data: luckycount
				}
			]
		};

		pieChart.setOption(pieop);
		wx.hideLoading();
	},
	changeBoxBtn: function (e) {

		var num = e.target.dataset.num;
		var states = 0;
		if (num == 0) {
			states = 0;
			a += 1;
			b = -1;
			c = -1;
			d = -1;
			if (a % 2 == 1) {
				states = 6;
			};
			this.setData({
				tabs: ["一", "二", "三", "四", "五", "六", "特"],
			})

			this.loadData("特");
		} else if (num == 1) {
			states = 1;
			a = -1;
			b += 1;
			c = -1;
			d = -1;
			if (b % 2 == 1) {
				states = 6;
			}
			this.setData({
				tabs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
			});
			wx.showToast({
				title: '功能在开发之中',
				icon: 'success'
			});
		} else if (num == 2) {
			states = 2;
			a = -1;
			b = -1;
			c += 1;
			d = -1;
			if (c % 2 == 1) {
				states = 6;
			}

		} else if (num == 3) {
			states = 3;
			a = -1;
			b = -1;
			c = -1;
			d += 1;
			if (d % 2 == 1) {
				states = 6;
			}
			wx.showToast({
				title: '功能在开发之中',
				icon: 'success'
			});
		}
		//console.log(states)
		this.setData({
			states: states
		})
	},
	onShareAppMessage: function (res) {
		wx.showShareMenu({
			withShareTicket: true
		})
		if (res.from == 'button') {
			//console.log(res.target)
		}

		return {
			title: "六合神剑",
			path: '/pages/mychart/mychart',
			//imageUrl: this.data.istPic,
			success: function (res) {
				wx.getShareInfo({
					shareTicket: res.shareTickets,
					success(res) {
						wx.Bmob.User.decryption(res).then(res => {
							console.log(res);
						})
						// 转发成功
						wx.showToast({
							title: '转发成功',
							icon: 'success'
						});
					}
				})

			},
			fail: function (res) {
				// 转发失败
				wx.showToast({
					title: '转发失败',
					icon: 'fail'
				});
			}
		}
	},
	getStrLucky: function (result) {
		//console.log(result);
		var current = result.length - 1;
		var luckyday = result[current].luckydate;
		var luckyseq = result[current].luckysequence;
		var luckybig = result[current].luckynumber;
		var luckysml1 = result[current].luckynum1;
		var luckysml2 = result[current].luckynum2;
		var luckysml3 = result[current].luckynum3;
		var luckysml4 = result[current].luckynum4;
		var luckysml5 = result[current].luckynum5;
		var luckysml6 = result[current].luckynum6;
		this.setData({
			luckyday: luckyday,
			luckyseq: luckyseq,
			luckybig: luckybig,
			luckysml1: luckysml1,
			luckysml2: luckysml2,
			luckysml3: luckysml3,
			luckysml4: luckysml4,
			luckysml5: luckysml5,
			luckysml6: luckysml6,
		});
	},
	getAllProfit: function (result) {
		// lucky history arrays
		var luckydate = [];
		var luckysequence = [];
		var luckynumber = [];
		var luckynum1 = [];
		var luckynum2 = [];
		var luckynum3 = [];
		var luckynum4 = [];
		var luckynum5 = [];
		var luckynum6 = [];
		// lucky profits arrays
		var allluckyprofit = [];
		var allluckycount = [];
		var luckyserier = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
		var profit = [];
		for (var i = 0; i < result.length; i++) {
			luckydate.push(result[i].luckydate);
			luckysequence.push(result[i].luckysequence);
			luckynumber.push(result[i].luckynumber);
			luckynum1.push(result[i].luckynum1);
			luckynum2.push(result[i].luckynum2);
			luckynum3.push(result[i].luckynum3);
			luckynum4.push(result[i].luckynum4);
			luckynum5.push(result[i].luckynum5);
			luckynum6.push(result[i].luckynum6);

			for (var j = 0; j < 50; j++) {
				if (result[i].luckynumber = j) {
					profit[j] = profit[j] + 42;
				} else {
					profit[j] = profit[j] - 1;
				};
				allluckyprofit[j].push(profit[j]);
			};

		};
		console.log(allluckyprofit[0]);
	},
	getProfit: function (result) {
		//current lucky detail
		var luckyday = this.data.luckyday;
		var luckyseq = this.data.luckyseq;
		var luckybig = this.data.luckybig;
		var luckysml1 = this.data.luckysml1;
		var luckysml2 = this.data.luckysml2;
		var luckysml3 = this.data.luckysml3;
		var luckysml4 = this.data.luckysml4;
		var luckysml5 = this.data.luckysml5;
		var luckysml6 = this.data.luckysml6;
		// lucky history arrays
		var luckydate = [];
		var luckysequence = [];
		var luckynumber = [];
		var luckynum1 = [];
		var luckynum2 = [];
		var luckynum3 = [];
		var luckynum4 = [];
		var luckynum5 = [];
		var luckynum6 = [];
		// lucky profits arrays
		var luckyprofit = [];
		var luckypro1 = [];
		var luckypro2 = [];
		var luckypro3 = [];
		var luckypro4 = [];
		var luckypro5 = [];
		var luckypro6 = [];
		var luckycount1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var luckycount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		var luckyserier = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
		var profit = 0;
		var pro1 = 0;
		var pro2 = 0;
		var pro3 = 0;
		var pro4 = 0;
		var pro5 = 0;
		var pro6 = 0;
		var tmpcount = 0;
		for (var i = 0; i < result.length; i++) {
			luckydate.push(result[i].luckydate);
			luckysequence.push(result[i].luckysequence);
			luckynumber.push(result[i].luckynumber);
			luckynum1.push(result[i].luckynum1);
			luckynum2.push(result[i].luckynum2);
			luckynum3.push(result[i].luckynum3);
			luckynum4.push(result[i].luckynum4);
			luckynum5.push(result[i].luckynum5);
			luckynum6.push(result[i].luckynum6);

			if (result[i].luckynumber == luckybig) {
				profit = profit + 42;
			} else {
				profit = profit - 1;
			};
			luckyprofit.push(profit);

			if ((result[i].luckynum1 == luckysml1) || (result[i].luckynum2 == luckysml1) || (result[i].luckynum3 == luckysml1) || (result[i].luckynum4 == luckysml1) || (result[i].luckynum5 == luckysml1) || (result[i].luckynum6 == luckysml1)) {
				pro1 = pro1 + 7;
			} else {
				pro1 = pro1 - 1;
			};
			luckypro1.push(pro1);
			if ((result[i].luckynum1 == luckysml2) || (result[i].luckynum2 == luckysml2) || (result[i].luckynum3 == luckysml2) || (result[i].luckynum4 == luckysml2) || (result[i].luckynum5 == luckysml2) || (result[i].luckynum6 == luckysml2)) {
				pro2 = pro2 + 7;
			} else {
				pro2 = pro2 - 1;
			};
			luckypro2.push(pro2);
			if ((result[i].luckynum1 == luckysml3) || (result[i].luckynum2 == luckysml3) || (result[i].luckynum3 == luckysml3) || (result[i].luckynum4 == luckysml3) || (result[i].luckynum5 == luckysml3) || (result[i].luckynum6 == luckysml3)) {
				pro3 = pro3 + 7;
			} else {
				pro3 = pro3 - 1;
			};
			luckypro3.push(pro3);
			if ((result[i].luckynum1 == luckysml4) || (result[i].luckynum2 == luckysml4) || (result[i].luckynum3 == luckysml4) || (result[i].luckynum4 == luckysml4) || (result[i].luckynum5 == luckysml4) || (result[i].luckynum6 == luckysml4)) {
				pro4 = pro4 + 7;
			} else {
				pro4 = pro4 - 1;
			};
			luckypro4.push(pro4);
			if ((result[i].luckynum1 == luckysml5) || (result[i].luckynum2 == luckysml5) || (result[i].luckynum3 == luckysml5) || (result[i].luckynum4 == luckysml5) || (result[i].luckynum5 == luckysml5) || (result[i].luckynum6 == luckysml5)) {
				pro5 = pro5 + 7;
			} else {
				pro5 = pro5 - 1;
			};
			luckypro5.push(profit);
			if ((result[i].luckynum1 == luckysml6) || (result[i].luckynum2 == luckysml6) || (result[i].luckynum3 == luckysml6) || (result[i].luckynum4 == luckysml6) || (result[i].luckynum5 == luckysml6) || (result[i].luckynum6 == luckysml6)) {
				pro6 = pro6 + 7;
			} else {
				pro6 = pro6 - 1;
			};
			luckypro6.push(pro6);
			//Update luckybig number count
			tmpcount = luckycount[result[i].luckynumber - 1] + 1;
			luckycount[result[i].luckynumber - 1] = tmpcount;
			//Update small lucky number count
			tmpcount = luckycount1[result[i].luckynum1 - 1] + 1;
			luckycount1[result[i].luckynum1 - 1] = tmpcount;
			tmpcount = luckycount1[result[i].luckynum2 - 1] + 1;
			luckycount1[result[i].luckynum2 - 1] = tmpcount;
			tmpcount = luckycount1[result[i].luckynum3 - 1] + 1;
			luckycount1[result[i].luckynum3 - 1] = tmpcount;
			tmpcount = luckycount1[result[i].luckynum4 - 1] + 1;
			luckycount1[result[i].luckynum4 - 1] = tmpcount;
			tmpcount = luckycount1[result[i].luckynum5 - 1] + 1;
			luckycount1[result[i].luckynum5 - 1] = tmpcount;
			tmpcount = luckycount1[result[i].luckynum6 - 1] + 1;
			luckycount1[result[i].luckynum6 - 1] = tmpcount;
		};
		this.setData({
			luckydate: luckydate,
			luckysequence: luckysequence,
			luckynumber: luckynumber,
			luckynum1: luckynum1,
			luckynum2: luckynum2,
			luckynum3: luckynum3,
			luckynum4: luckynum4,
			luckynum5: luckynum5,
			luckynum6: luckynum6,
			luckyprofit: luckyprofit,
			luckypro1: luckypro1,
			luckypro2: luckypro2,
			luckypro3: luckypro3,
			luckypro4: luckypro4,
			luckypro5: luckypro5,
			luckypro6: luckypro6,
			luckyserier: luckyserier,
			luckycount: luckycount,
			luckycount1: luckycount1
		});
	}
});

//var lineop = {};
function initlineChart(canvas, width, height) {

	lineChart = echarts.init(canvas, null, {
			width: width,
			height: height
		});
	canvas.setChart(lineChart);

	var lineop = {
		title: {
			text: '号码走势',
			left: 'center'
		},
		color: ["#37A2DA"],
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
			axisTick: {
				show: true
			},
			// show: false
		},
		yAxis: {
			x: 'center',
			type: 'value',
			axisTick: {
				show: true
			},
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			}
			// show: false
		},
		series: [{
				name: '2018',
				type: 'line',
				label: {
					normal: {
						show: true,
						position: 'inside'
					}
				},
				smooth: true,
				data: [],
			}
		]
	};

	lineChart.setOption(lineop);
	wx.hideLoading();
	return lineChart;

}
function initline1Chart(canvas, width, height) {

	line1Chart = echarts.init(canvas, null, {
			width: width,
			height: height
		});
	canvas.setChart(line1Chart);

	var line1op = {
		title: {
			text: '号码运势',
			left: 'center'
		},
		color: ["#37A2DA"],
		/* legend: {
		data: ['2018'],
		top: 50,
		left: 'center',
		backgroundColor: 'red',
		z: 100
		}, */
		grid: {
			containLabel: true
		},
		tooltip: {
			show: true,
			trigger: 'axis'
		},
		xAxis: {
			type: 'category',
			boundaryGap: false,
			data: [],
			axisTick: {
				show: true
			},
			// show: false
		},
		yAxis: {
			x: 'center',
			type: 'value',
			axisTick: {
				show: true
			},
			splitLine: {
				lineStyle: {
					type: 'dashed'
				}
			}
			// show: false
		},
		series: [{
				name: '号码运势',
				type: 'line',
				label: {
					normal: {
						show: true,
						position: 'inside'
					}
				},
				smooth: true,
				data: [],
			}
		]
	};

	line1Chart.setOption(line1op);
	wx.hideLoading();
	return lineChart;
}
function initpieChart(canvas, width, height) {

	pieChart = echarts.init(canvas, null, {
			width: width,
			height: height
		});
	canvas.setChart(pieChart);

	var pieop = {
		title: {
			text: "号码热度",
			left: 'center'
		},
		color: ['#37a2da'],
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		/* legend: {
		data: ['热度']
		}, */
		grid: {
			left: 20,
			right: 20,
			bottom: 15,
			top: 40,
			containLabel: true
		},
		yAxis: [{
				type: 'value',
				axisLine: {
					lineStyle: {
						color: '#999'
					}
				},
				axisLabel: {
					color: '#666'
				}
			}
		],
		xAxis: [{
				type: 'category',
				axisTick: {
					show: true
				},
				data: [],
				axisLine: {
					lineStyle: {
						color: '#999'
					}
				},
				axisLabel: {
					color: '#666'
				}
			}
		],
		series: [{
				name: '热度',
				type: 'bar',
				label: {
					normal: {
						show: true,
						position: 'inside'
					}
				},
				data: [],
				itemStyle: {
					// emphasis: {
					//   color: '#37a2da'
					// }
				}
			}
		]
	};

	pieChart.setOption(pieop);
	return pieChart;
}
