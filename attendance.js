var common = require('../template/getCode.js');
var Bmob = require("../../utils/bmob.js");
var util = require('../../utils/util.js');
import {
	$wuxButton
}
from '../../components/wux'
var app = getApp();
var that;
var optionId; //物件的Id
var publisherId; //物件发布者的Id
var commentlist;
var joinlist;
var nojoinlist;
var likerlist;
let commentText; //提问输入框内容
var curIndex = 0;
var that;
const MENU_WIDTH_SCALE = 0.82;
const FAST_SPEED_SECOND = 300;
const FAST_SPEED_DISTANCE = 5;
const FAST_SPEED_EFF_Y = 50;
Page({
	data: {
		autoplay: true,
		ui: {
			windowWidth: 0,
			menuWidth: 0,
			offsetLeft: 0,
			tStart: true
		},
		statusIndex: 1,
		realname: "",
		contactValue: "",
		showTopTips: false, //是否显示提示
		TopTips: '', //提示的内容
		linkmainHe: false,
		linkjoinHe: false,
		//----------------
		tag_select: 0,
		limit: 5,
		showImage: false,
		loading: false,
		isdisabled: false,
		commentLoading: false,
		isdisabled1: false,
		recommentLoading: false,
		commentList: [],
		joinList: [],
		providerList: [],
		likerList: [],
		isZan: false,
		isFlower: false,
		postsShowSwiperList: [], //轮播图显示的物件
		// join: 0,
		isMe: false,
		isAdmin: false,
		isToResponse: false,
		isFavo: false,
		isJoin: false,
		status: 0, //tab切换按钮
		adminId: "",
		adminname: "",
		adcontactWay: "",
		adcontactValue: "",
		showCommentDialog: false, //提问输入框显示
		commentInputHolder: "您有什么关心的问题可以在这里先问老师", //提问输入框提示
		//----------------------------------
		index: 2,
		opened: !1,
		style_img: '',
		curIndex: 0,
		windowHeight1: 0,
		windowWidth1: 0
	},
	//首页切换图片
	onSwiperChange: function (event) {
		curIndex = event.detail.current
			this.setData({
				curIndex: curIndex
			})
	},
	//生成物件二维码
	showQrcode: function () {
		var path = '/pages/attendance/attendance?actid=' + optionId + "&pubid=" + publisherId;
		var width = 40;
		var that = this;
		Bmob.generateCode({
			"path": path,
			"width": width
		}).then(function (obj) {
			console.log(obj);
			that.setData({
				imageBytes: obj.imageBytes,
				codeHehe: true
			})
		}, function (err) {
			common.showTip('生成二维码失败' + err);
		});
	},

	//关闭二维码弹窗
	closeCode: function () {
		this.setData({
			codeHehe: false
		})
	},
	//打开物件群二维码弹窗
	showqrcode: function () {
		this.setData({
			qrcodeHe: true
		})
	},

	//关闭物件群二维码弹窗
	closeqrcode: function () {
		this.setData({
			qrcodeHe: false
		})
	},

	//打开发布者联系方式弹窗
	showmainLink: function () {
		this.setData({
			linkmainHe: true
		})
	},
	//关闭发布者联系方式弹窗
	closemainLink: function () {
		this.setData({
			linkmainHe: false
		})
	},

	//复制联系方式
	copyLink: function (e) {
		var value = e.target.dataset.value;
		wx.setClipboardData({
			data: value,
			success() {
				common.dataLoading("复制成功", "success");
				console.log('复制成功')
			}
		})
	},

	//切换tab操作
	changePage: function (e) {
		let id = e.target.id;
		this.setData({
			status: id
		});
	},
	addFlower: function () {
		console.log("add Flower!");
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// this.initButton()
		that = this;
		try {
			this.windowWidth = res.windowWidth;
			this.data.ui.menuWidth = this.windowWidth * MENU_WIDTH_SCALE;
			this.data.ui.offsetLeft = 0;
			this.data.ui.windowWidth = res.windowWidth;
			this.setData({
				ui: this.data.ui
			})
		} catch (e) {}
		// var that = this;
		//调用系统API获取设备的信息
		wx.getSystemInfo({
			success: function (res) {
				var kScreenW = res.windowWidth / 375
					var kScreenH = res.windowHeight / 603
					wx.setStorageSync('kScreenW', kScreenW)
					wx.setStorageSync('kScreenH', kScreenH)
			}
		})
		// 调用API从本地缓存中获取数据
		try {
			var value = wx.getStorageSync('user_openid')
				if (value) {}
				else {
					console.log('执行login1')
					wx.login({
						success: function (res) {
							if (res.code) {
								console.log('执行login2', res);
							}
						}
					});
					wx.login({
						success: function (res) {
							if (res.code) {
								Bmob.User.requestOpenId(res.code, {
									success: function (userData) {
										wx.getUserInfo({
											success: function (result) {
												var userInfo = result.userInfo
													var nickName = userInfo.nickName
													var avatarUrl = userInfo.avatarUrl
													var sex = userInfo.gender
													Bmob.User.logIn(nickName, userData.openid, {
														success: function (user) {
															try {
																wx.setStorageSync('user_openid', user.get('userData').openid)
																wx.setStorageSync('user_id', user.id)
																wx.setStorageSync('my_nick', user.get("nickname"))
																wx.setStorageSync('my_username', user.get("username"))
																wx.setStorageSync('my_sex', user.get("sex"))
																wx.setStorageSync('my_avatar', user.get("userPic"))
																wx.setStorageSync('user_isAdmin', user.get("isAdmin"))
															} catch (e) {}
															console.log("登录成功");
														},
														error: function (user, error) {
															if (error.code == '101') {
																var user = new Bmob.User(); //开始注册用户
																user.set('username', nickName);
																user.set('password', userData.openid);
																user.set("nickname", nickName);
																user.set("userPic", avatarUrl);
																user.set("userData", userData);
																user.set('sex', sex);
																user.set('feednum', 0);
																user.signUp(null, {
																	success: function (result) {
																		console.log('注册成功');
																		try { //将返回的3rd_session存储到缓存中
																			wx.setStorageSync('user_openid', user.get('userData').openid)
																			wx.setStorageSync('user_id', user.id)
																			wx.setStorageSync('my_nick', user.get("nickname"))
																			wx.setStorageSync('my_username', user.get("username"))
																			wx.setStorageSync('my_sex', user.get("sex"))
																			wx.setStorageSync('my_avatar', user.get("userPic"))
																			wx.setStorageSync('user_isAdmin', user.get("isAdmin"))
																		} catch (e) {}
																	},
																	error: function (userData, error) {
																		console.log("openid=" + userData);
																		console.log(error)
																	}
																});

															}
														}
													});
											}
										})
									},
									error: function (error) {
										console.log("Error: " + error.code + " " + error.message);
									}
								});
							} else {
								console.log('获取用户登录态失败1！' + res.errMsg)
							}
						},
						complete: function (e) {
							console.log('获取用户登录态失败2！' + e)
						}
					});
				}
		} catch (e) {
			console.log("登陆失败")
		}
		wx.checkSession({
			success: function () {},
			fail: function () {
				//登录态过期，重新登录
				wx.login()
			}
		})
		//optionID =Ixsz999F;
		//publisherId=35470fbd9d;
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.hideToast()
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var myInterval = setInterval(getReturn, 500); //半秒定时查询
		function getReturn() {
			clearInterval(myInterval); //清除定时器

			//查询物件信息
			var Attendance = Bmob.Object.extend("attendance");
			var query = new Bmob.Query(Attendance);
			query.equalTo("objectId", "Ixsz999F");
			query.include("publisher");
			query.find({
				success: function (result) {
					var title = result[0].get("title");
					var content = result[0].get("content");
					var publisher = result[0].get("publisher");
					//var isShow = result[0].get("isShow");
					var endtime = result[0].get("endTime");
					var strtime = result[0].get("strTime");
					var createdAt = result[0].createdAt;
					var pubtime = util.getDateDiff(createdAt);
					var address = result[0].get("address");
					var longitude = result[0].get("longitude"); //经度
					var latitude = result[0].get("latitude"); //纬度
					var joincount = result[0].get("joincount"); //已经加入的人数
					var nojoincount = result[0].get("nojoincount"); //已经加入的人数
					var zancount = result[0].get("zancount"); //已经加入的人数
					var askcount = result[0].get("askcount");
					var postsShowSwiperList = result[0].get("picArray");
					var url;
					var objectIds = publisher.id;
					var publisherName = publisher.nickname;
					var publisheropenid = publisher.userData.openid;
					var publisherPic;
					var jsonA;
					var molist = new Array();

					if (publisher.userPic) {
						publisherPic = publisher.userPic;
					} else {
						publisherPic = "/static/images/icon/user_defaulthead@2x.png";
					}
					if (result[0].get("actpic")) {
						url = result[0].get("actpic")._url;
					} else {
						url = "/static/images/more/cover1.png";
					}
					for (var i = 0; i < 5; i++) {
						jsonA = {
							"title": "title" || '',
							"actPic": "/static/images/more/title8.png" || ''
						}
						molist.push(jsonA);
					}
					that.setData({
						listTitle: title,
						listContent: content,
						listPic: url,
						zancount: zancount,
						askcount: askcount,
						endtime: endtime,
						address: address,
						longitude: longitude, //经度
						latitude: latitude, //纬度
						joinnum: joincount,
						nojoinnum: nojoincount,
						objectIds: objectIds,
						publisherPic: publisherPic,
						publisherName: publisherName,
						publisheropenid: molist,
						publishTime: pubtime,
						postsShowSwiperList: molist,
						loading: true
						// providernum: providernum,
						// peoplenum: peoplenum,
						// acttype: acttype,
						// acttypename: acttypename,
						//isShow: isShow,
					})
					if (askcount > 0) {
						that.commentQuery(result[0]);
					}
					if (joincount > 0) {
						that.joinDetail(result[0]);
					}
					//if (zancount > 0) {
					that.likerDetail(result[0]);
					//}
					if (nojoincount > 0) {
						that.nojoinDetail(result[0]);
					}
				},
				error: function (error) {
					that.setData({
						loading: true
					})
					console.log(error);
				}
			})

		}
	},

	//获取物件的加入详情信息
	nojoinDetail: function (event) {
		var nojoinlist = new Array();
		var Student = Bmob.Object.extend("student");
		var queryStudent = new Bmob.Query(Student);
		queryStudent.notEqualTo("attendance", event);
		queryStudent.descending("updatedAt");
		queryStudent.find({
			success: function (result) {
				for (var i = 0; i < result.length; i++) {

					var id = result[i].id;
					var realname = result[i].get("stuName"); //加入的人的真实姓名
					var contactWay = "contactWay"; //联系方式名称
					var contactValue = "contactValue"; //联系方式
					var joinusername = realname; //加入的人昵称
					var joinuserpic = "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqjEAyDlaibCbtWWdXuQgcfg9WXicFPicmLYL9TCob2BM9RcIQXAwv3TM8wByBiae5yTH80llmeWVeqoQ/132"; //加入的人头像
					var created_at = result[i].updatedAt;
					var jointime = util.getDateDiff(created_at);
					var linkjoinHe = false;
					var jsonA;
					jsonA = {
						"id": id,
						"realname": realname,
						"joinusername": joinusername,
						"joinuserpic": joinuserpic,
						"contactWay": contactWay,
						"contactValue": contactValue,
						"jointime": jointime,
						"linkjoinHe": linkjoinHe,
					}
					nojoinlist.push(jsonA)
					that.setData({
						nojoinList: nojoinlist,
						loading: true
					})
					//console.log("nojoinlist "+nojoinlist);
				}
			},
			error: function (error) {
				common.dataLoadin(error, "loading");
				console.log(error);
			}
		})
	},
	//获取物件的加入详情信息
	joinDetail: function (event) {
		var joinlist = new Array();
		var Student = Bmob.Object.extend("student");
		var queryStudent = new Bmob.Query(Student);
		queryStudent.equalTo("attendance", event);
		queryStudent.descending("updatedAt");
		queryStudent.find({
			success: function (result) {
				for (var i = 0; i < result.length; i++) {

					var id = result[i].id;
					var realname = result[i].get("stuName"); //加入的人的真实姓名
					var contactWay = "contactWay"; //联系方式名称
					var contactValue = "contactValue"; //联系方式
					var joinusername = realname; //加入的人昵称
					var joinuserpic = "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqjEAyDlaibCbtWWdXuQgcfg9WXicFPicmLYL9TCob2BM9RcIQXAwv3TM8wByBiae5yTH80llmeWVeqoQ/132"; //加入的人头像
					var created_at = result[i].updatedAt;
					var jointime = util.getDateDiff(created_at);
					var linkjoinHe = false;
					var jsonA;
					jsonA = {
						"id": id,
						"realname": realname,
						"joinusername": joinusername,
						"joinuserpic": joinuserpic,
						"contactWay": contactWay,
						"contactValue": contactValue,
						"jointime": jointime,
						"linkjoinHe": linkjoinHe,
					}
					joinlist.push(jsonA)
					that.setData({
						joinList: joinlist,
						loading: true
					})
					//console.log("joinlist "+joinlist);
				}
			},
			error: function (error) {
				common.dataLoadin(error, "loading");
				console.log(error);
			}
		})
	},
	//查询提问
	commentQuery: function (event) {
		var self = this;
		commentlist = new Array();
		var Question = Bmob.Object.extend("question");
		var queryComment = new Bmob.Query(Question);
		queryComment.equalTo("attendance", event);
		queryComment.limit(self.data.comPage);
		queryComment.skip(self.data.comPage * self.data.comCurPage);
		queryComment.descending("createAt");
		queryComment.include("publisher");
		queryComment.find({
			success: function (result) {
				for (var i = 0; i < result.length; i++) {
					var id = result[i].id;
					var pid = result[i].get("olderComment"); //被提问的提问
					var uid = result[i].get("publisher").objectId; //提问人的id
					var content = result[i].get("content");
					var created_at = result[i].createdAt;
					var pubtime = util.getDateDiff(created_at);
					var olderUserName;
					var userPic = result[i].get("publisher").userPic;
					var nickname = result[i].get("publisher").nickname;
					if (pid) {
						pid = pid.id;
						olderUserName = result[i].get("olderUserName");
					} else {
						pid = 0;
						olderUserName = "";
					}
					var jsonA;
					jsonA = {
						"id": id || '',
						"content": content || '',
						"pid": pid || '',
						"uid": uid || '',
						"created_at": pubtime || '',
						"pusername": olderUserName || '',
						"username": nickname || '',
						"avatar": userPic || '',
					}
					commentlist.push(jsonA)
					that.setData({
						commentList: commentlist,
						loading: true
					})
				}
			},
			error: function (error) {
				common.dataLoadin(error, "loading");
				console.log(error);
			}
		});
	},

	//---------------------------------------------------

	//获取物件的点赞详情信息
	likerDetail: function (event) {
		var likerlist = new Array();
		var isZan = false;
		wx.getStorage({
			key: 'user_id',
			success: function (ress) {
				var Zans = Bmob.Object.extend("zan");
				var queryLike = new Bmob.Query(Zans);
				queryLike.equalTo("attendance", event);
				queryLike.include("zaner");
				queryLike.descending("updatedAt");
				queryLike.find({
					success: function (result) {
						for (var i = 0; i < result.length; i++) {
							var id = result[i].id;
							var likerid = result[i].get("zaner").objectId; //加入的人的id
							var likername = result[i].get("zaner").username; //加入的人昵称
							var likerpic = result[i].get("zaner").userPic; //加入的人头像
							var created_at = result[i].updatedAt;
							var liketime = util.getDateDiff(created_at);
							var jsonA;
							jsonA = '{"id":"' + id + '","likerid":"' + likerid + '","likername":"' + likername + '","likerpic":"' + likerpic + '","liketime":"' + liketime + '"}';
							var jsonB = JSON.parse(jsonA);
							likerlist.push(jsonB)
							that.setData({
								likerList: likerlist,
								loading: true
							});
							//console.log(ress.data);
							//console.log(likerid);
							if (likerid == ress.data) {
								isZan = true;
								that.setData({
									isZan: true
								});
								//console.log("isZan： " + isZan)
							}

						}
					},
					error: function (error) {
						common.dataLoadin(error, "loading");
						console.log(error);
					}
				})
			}
		})
	},

	//点赞处理
	changeLike: function (event) {
		that.setData({
			style_img: 'transform:scale(1.5);'
		})
		setTimeout(function () {
			that.setData({
				style_img: 'transform:scale(1);'
			})
		}, 500)
		var isZan = that.data.isZan;
		wx.getStorage({
			key: 'user_id',
			success: function (ress) {
				var Diary = Bmob.Object.extend("attendance");
				var queryLike = new Bmob.Query(Diary);
				var Zan = Bmob.Object.extend("zan");
				var queryZan = new Bmob.Query(Zan);
				var optionId = "Ixsz999F";
				var event = new Diary();
				event.id = optionId;
				queryLike.equalTo("objectId", optionId);
				queryLike.find({
					success: function (result) {
						if (isZan == false) { //你还没有点过赞
							//console.log("thanks for your Zan!");
							result[0].set('zancount', result[0].get('zancount') + 1);
							result[0].save();
							that.setData({
								isZan: true,
								loading: true
							});
							var zan = new Zan();
							var me = new Bmob.User();
							me.id = ress.data;
							zan.set("zaner", me);
							zan.set("attendance", event);
							zan.save();
						} else { //你已经人点赞
							result[0].set('zancount', result[0].get('zancount') - 1);
							result[0].save();
							that.setData({
								isZan: false,
								loading: true
							});
							queryZan.equalTo("attendance", event);
							queryZan.destroyAll({
								success: function () {
									console.log("删除点赞表中的数据成功");
								},
								error: function (error) {
									console.log("删除点赞表的数据失败");
									console.log(error);
								}
							})

						}

					}
				});
				that.onShow();
			},
		})
	},

	//-----------------------------------------------------------
	showCommentDialog: function (e) { //显示我要提问弹窗
		this.setData({
			showCommentDialog: true,
			commentInputHolder: typeof e == 'string' ? e : "您有什么关心的问题可以在这里先问老师",
		})
	},
	hideCommentDialog: function () { //隐藏我要提问弹窗
		this.setData({
			showCommentDialog: false,
			isToResponse: false
		});
	},

	commentText: function (e) { //提问内容赋值
		commentText = e.detail.value
	},

	//点击提问itam
	commentTap: function (e) {
		let that = this;
		let item = e.currentTarget.dataset.item;
		let commentActions;
		if (item.uid == wx.getStorageSync('user_id')) { //自己的提问，可以删除
			commentActions = ["删除"]
		} else {
			commentActions = ["回复"]
		}
		wx.showActionSheet({
			itemList: commentActions,
			success: function (res) {
				let button = commentActions[res.tapIndex];
				if (button == "回复") {
					that.setData({
						pid: item.uid,
						isToResponse: true,
						responseName: item.username
					})

					that.showCommentDialog("回复" + item.username + "：");
				} else if (button == "删除") {
					//删除提问
					var Comments = Bmob.Object.extend("Comments");
					var comment = new Bmob.Query(Comments);
					comment.get(item.id, {
						success: function (result) {
							result.destroy({
								success: function (res) {
									common.dataLoading("删除成功", "success");
									console.log("删除成功");

								},
								error: function (res) {
									console.log("删除提问错误");
								}
							})
						}
					})
					//物件表中提问数量-1
					var Events = Bmob.Object.extend("Events");
					var queryEvents = new Bmob.Query(Events);
					queryEvents.get(optionId, {
						success: function (object) {
							object.set("commentnum", object.get("commentnum") - 1);
							object.save();
						}
					})
					that.onShow();
				}
			}
		});
	},

	//提问物件
	publishComment: function (e) {
		let that = this;
		var isReply = false;
		var optionId = "Ixsz999F";
		if (!commentText || commentText.length == 0) {
			this.setData({
				showTopTips: true,
				TopTips: '您有什么关心的问题可以在这里先问老师'
			});
			setTimeout(function () {
				that.setData({
					showTopTips: false
				});
			}, 3000);
		} else {
			that.setData({
				isdisabled: true,
				commentLoading: true
			})
			wx.getStorage({
				key: 'user_id',
				success: function (ress) {
					that.setData({
						commentLoading: false
					})
					var queryUser = new Bmob.Query(Bmob.User);
					//查询单条数据,第一个参数是这条数据的objectId的值
					queryUser.get(ress.data, {
						success: function (userObject) {
							//查询成功,调用get 方法获取对应属性的值
							var Quetion = Bmob.Object.extend("question");
							var question = new Quetion();
							var Attendance = Bmob.Object.extend("attendance");
							var attendance = new Attendance();
							attendance.id = optionId;
							var me = new Bmob.User();
							me.id = ress.data;
							question.set("publisher", me);
							question.set("attendance", attendance);
							question.set("content", commentText);
							console.log("commentText=" + commentText);
							if (that.data.isToResponse) { //如果是回复的提问
								isReply = true;
								var olderName = that.data.responseName;
								var Quetion1 = Bmob.Object.extend("question");
								var question1 = new Quetion1();
								question1.id = that.data.pid; //提问的提问Id
								question.set("olderUserName", olderName);
								question.set("olderComment", question1);
							}
							//添加数据,第一个路口参数是null
							question.save(null, {
								success: function (res) {
									var queryEvents = new Bmob.Query(Attendance);
									//查询单条数据,敌一个参数就是这条数据的objectId
									queryEvents.get(optionId, {
										success: function (object) {
											object.set("askcount", object.get("askcount") + 1);
											object.save();
											that.setData({
												commentText: ''
											})
											that.hideCommentDialog();
											that.onShow();
										},
										error: function (object, error) {
											//查询失败
											console.log(error);
										}
									});
									that.setData({
										publishContent: "",
										isToResponse: false,
										responeContent: "",
										isdisabled: false,
										commentLoading: false
									})
								},
								error: function (gameScore, error) {
									common.dataLoading(error, "loading");
									that.setData({
										publishContent: "",
										isToResponse: false,
										responeContent: "",
										isdisabled: false,
										commentLoading: false
									})
								}
							});
						},
						error: function (object, error) {
							console.log(error);
						}
					});
				},
			})
		}
		setTimeout(function () {
			that.setData({
				showTopTips: false
			});
		}, 1000);
		that.onShow();
	},

	bindKeyInput: function (e) {
		this.setData({
			publishContent: e.detail.value
		})
	},
	//查看我爱大图
	seeActBig: function (e) {
		wx.previewImage({
			current: that.data.listPic, // 当前显示图片的http链接
			urls: [that.data.listPic]// 需要预览的图片http链接列表
		})
	},
	//查看我爱大图
	seeqrCodeBig: function (e) {
		wx.previewImage({
			current: that.data.qrcode, // 当前显示图片的http链接
			urls: [that.data.qrcode]// 需要预览的图片http链接列表
		})
	},

	//查看物件地图位置
	viewActAddress: function () {
		let latitude = this.data.latitude;
		let longitude = this.data.longitude;
		wx.openLocation({
			latitude: latitude,
			longitude: longitude
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		wx.stopPullDownRefresh()
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		console.log(this.data.listTitle);
		return {
			title: this.data.listTitle,
			path: '/pages/attendance/attendance?actid=' + optionId + "&pubid" + publisherId,
			imageUrl: this.data.istPic,
			success: function (res) {
				// 转发成功
				wx.showToast({
					title: '转发成功',
					icon: 'success'
				});
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

	//-----------------加入与收藏------------
	//现在加入功能
	attend_click: function (event) {
		var join = that.data.join;
		var isMe = that.data.isMe;
		var publisheropenid = that.data.publisheropenid;
		var isJoin = that.data.isJoin;
		var isFavo = that.data.isFavo;
		if (that.data.peoplenum > 0 && (that.data.peoplenum - that.data.joinnumber) <= 0) { //如果人加入满了
			wx.showModal({
				title: '温馨提示',
				content: '此物件参加人数已满',
				showCancel: true,
			})
		} else if (isMe == true) {
			var statusIndex = that.data.statusIndex;
			if (statusIndex == 0) {
				var Statusname = "准备中";
			} else if (statusIndex == 1) {
				var Statusname = "进行中";
			} else if (statusIndex == 2) {
				var Statusname = "已结束";
			}
			var Diary = Bmob.Object.extend("EventMore");
			var query = new Bmob.Query(Diary);

			query.get(eventMoreId, {
				success: function (result) {
					result.set("Status", Number(statusIndex));
					result.set("Statusname", Statusname);
					result.save();
					if (Statusname == "已结束") { //如果物件状态为已结束，该物件将撤离首页
						var Events = Bmob.Object.extend("Events");
						var evnet = new Bmob.Query(Events);
						evnet.get(optionId, {
							success: function (result) {
								//result.set("isShow", 0);
								result.save();
								console.log("撤离成功");
							},
							error: function (object, error) {
								console.log("撤离失败" + error);
							}
						});
					}

					console.log("改变状态成功");
					common.dataLoading("改变成功", "success");
				},
				error: function (object, error) {
					console.log("改变状态失败" + error);
				}
			});
			that.onShow();
		} else if (isMe == false) {
			// else if (join == true) { //如果没有加入，弹出联系表单
			if (isJoin == false && isFavo == false) {
				wx.showModal({
					title: '温馨提示',
					content: '确定也加入一起买吗？',
					showCancel: true,
					success: function (res) {
						if (res.confirm) { //如果点击确认

							var join = that.data.join;
							var contactindex = that.data.accountIndex;
							// if (join == "0") { // 未加入，点击加入
							that.setData({
								isJoin: true,
								isFavo: true,
								join: 1,
								favo: 3 //表示无法提供货物
							})

							if (contactindex == 0) {
								var contactWay = "微信号";
							} else if (contactindex == 1) {
								var contactWay = "QQ号";
							} else if (contactindex == 2) {
								var contactWay = "手机号";
							}

							wx.getStorage({
								key: 'user_id',
								success: function (ress) {
									var Contacts = Bmob.Object.extend("Contacts");
									var contact = new Contacts();
									var Events = Bmob.Object.extend("Events");
									var event = new Events();
									var contactValue = wx.getStorageSync("my_username");
									event.id = optionId;
									// console.log(event);
									var me = new Bmob.User();
									me.id = ress.data;
									var pub = new Bmob.User();
									pub.id = publisherId;
									contact.set("publisher", pub);
									contact.set("currentUser", me);
									contact.set("event", event);
									contact.set("contactWay", contactWay);
									contact.set("contactValue", contactValue);

									contact.save(null, {
										success: function () {
											console.log("写入联系表成功");
											that.setData({
												accountIndex: 2,
												contactValue: "",
												realname: ""
											})
										},
										error: function (error) {
											console.log(error);
										}
									});

									//加入之后生成消息存在表中，默认未未读
									var isme = new Bmob.User();
									isme.id = ress.data;
									var value = wx.getStorageSync("my_avatar")
										var my_username = wx.getStorageSync("my_username")
										var Plyre = Bmob.Object.extend("Plyre");
									var plyre = new Plyre();
									plyre.set("behavior", 5); //消息通知方式
									plyre.set("noticetype", "参加物件");
									plyre.set("bigtype", 2) //动态大类,消息类
									plyre.set("avatar", value); //我的头像
									plyre.set("username", my_username); // 我的名称
									plyre.set("uid", isme);
									plyre.set("wid", optionId); //物件ID
									plyre.set("fid", publisherId); //
									// console.log("fid=" + publisherId)
									plyre.set("is_read", 0); //是否已读,0代表没有,1代表读了
									plyre.save();
									//将参加的人的消息写入物件表中,并更新参加人数
									var Diary = Bmob.Object.extend("Events");
									var queryLike = new Bmob.Query(Diary);
									queryLike.equalTo("objectId", optionId);
									queryLike.find({
										success: function (result) {
											var joinArray = result[0].get("joinArray");
											joinArray.push(ress.data);
											result[0].set('joinnumber', result[0].get('joinnumber') + 1);
											result[0].save();
										}
									})
								},
							})

							//报名成功后发送一条消息给当前用户
							wx.getStorage({
								key: 'user_openid',
								success: function (res) {
									var openid = res.data;
									//获取点击按钮的formId
									var formId = event.detail.formId;
									// var formId = 1536636783238;
									// console.log(formId);
									let actid = optionId;
									let pubid = publisherId;
									var title = that.data.listTitle;
									var currentUser = Bmob.User.current();
									var address = that.data.address;
									var adminname = that.data.adminname;
									var adcontactWay = that.data.adcontactWay;
									var adcontactValue = that.data.adcontactValue;
									var adcontact = adcontactWay + " : " + adcontactValue;
									// console.log(formId);
									var temp = {
										"touser": openid, //这里是填写发送对象的openid
										"template_id": "-DZTruLy-RAZNPD6V3Ze6fDaN0c4Kt9LCN1tVesXwkc", //这里填写模板ID，可以在小程序后台配置
										"page": "pages/detail/detail?actid=" + actid + "&pubid=" + pubid, //点击后跳转的页面
										"form_id": formId,
										"data": {
											"keyword1": {
												"value": title,
											},
											"keyword2": {
												"value": address
											},
											"keyword3": {
												"value": adminname
											},
											"keyword4": {
												"value": adcontact
											},
											"keyword5": {
												"value": "您已成功加入我爱,请及时与我爱人联系"
											}
										},
										"emphasis_keyword": ""
									}
									Bmob.sendMessage(temp).then(function (obj) {
										console.log(obj)
										console.log('发送成功')
									},
										function (err) {
										common.showTip('失败' + err)
									});
									var temp = {
										"touser": publisheropenid, //这里是填写发送对象的openid
										"template_id": "-DZTruLy-RAZNPD6V3Ze6fDaN0c4Kt9LCN1tVesXwkc", //这里填写模板ID，可以在小程序后台配置
										"page": "pages/detail/detail?actid=" + actid + "&pubid=" + pubid, //点击后跳转的页面
										"form_id": formId,
										"data": {
											"keyword1": {
												"value": title,
											},
											"keyword2": {
												"value": address
											},
											"keyword3": {
												"value": adminname
											},
											"keyword4": {
												"value": adcontact
											},
											"keyword5": {
												"value": "有人加入和你一起寻找物件！"
											}
										},
										"emphasis_keyword": ""
									}
									Bmob.sendMessage(temp).then(function (obj) {
										console.log(obj)
										console.log('发送成功')
									},
										function (err) {
										common.showTip('失败' + err)
									});
								},
							})

							wx.getStorage({
								key: 'my_username',
								success: function (ress) {
									var my_username = ress.data;
									wx.getStorage({
										key: 'user_openid',
										success: function (res) {
											var openid = res.data;
											var user = Bmob.User.logIn(my_username, openid, {
													success: function (user) {
														var joinArray = user.get("eventJoin");
														var isJoin = false;
														if (joinArray == null) {
															joinArray = [];
														}
														if (joinArray.length > 0) {
															for (var i = 0; i < joinArray.length; i++) {
																if (joinArray[i] == optionId) {
																	joinArray.splice(i, 1);
																	isJoin = true;
																	break;
																}
															}
															if (isJoin == false) {
																joinArray.push(optionId);
															}
														} else {
															joinArray.push(optionId);
														}
														user.set("eventJoin", joinArray);
														user.save(null, {
															success: function () {
																common.dataLoading("参加成功", "success");
															},
															error: function (error) {
																console.log("参加失败");
															}
														})

													}
												});
										},
									})
								},
							})
							// } randy
							setTimeout(function () {
								that.setData({
									showTopTips: false
								});
							}, 1000);
							that.onShow();
						}

					}
				})
			}
		}
	},

	//关闭弹出联系表单
	closeJoin: function () {
		this.setData({
			showDialog: !this.data.showDialog
		});
	},

	//关闭修改联系信息弹窗
	closeUpdJoin: function () {
		this.setData({
			showUpdDialog: false
		});
	},

	//关闭弹出改变状态表单
	closeChange: function () {
		this.setData({
			showStuDialog: false
		});
	},

	//改变我爱状态index
	changeStatus: function (e) {
		this.setData({
			statusIndex: e.detail.value
		})
	},

	//改变联系方式
	bindAccountChange: function (e) {
		this.setData({
			accountIndex: e.detail.value
		})
	},
	//改变修改信息时的联系方式
	updjoinChange: function (e) {
		this.setData({
			jocountIndex: e.detail.value
		})
	},

	//修改联系信息操作
	updSubmit: function (event) {
		var jocountIndex = that.data.jocountIndex;
		if (jocountIndex == 0) {
			var contactWay = "微信号";
		} else if (jocountIndex == 1) {
			var contactWay = "QQ号";
		} else if (jocountIndex == 2) {
			var contactWay = "手机号";
		}
		var realname = event.detail.value.joinname;
		var adminname = event.detail.value.joinname;
		var contactValue = event.detail.value.jocontactValue;
		var Contacts = Bmob.Object.extend("Contacts");
		var contact = new Bmob.Query("Contacts");
		contact.get(joinpId, {
			success: function (result) {
				result.set("realname", realname);
				result.set("contactWay", contactWay);
				result.set("contactValue", contactValue);
				result.save({
					success: function () {
						//加入之后生成消息存在表中，默认未未读
						var isme = new Bmob.User();
						isme.id = wx.getStorageSync("user_id");
						var value = wx.getStorageSync("my_avatar")
							var my_username = wx.getStorageSync("my_username")
							var Plyre = Bmob.Object.extend("Plyre");
						var plyre = new Plyre();
						plyre.set("behavior", 7); //消息通知方式
						plyre.set("noticetype", "修改信息");
						plyre.set("bigtype", 1) //动态大类,通知类
						plyre.set("avatar", value); //我的头像
						plyre.set("username", my_username); // 我的名称
						plyre.set("uid", isme);
						plyre.set("wid", optionId); //物件ID
						plyre.set("fid", publisherId); //
						console.log("fid=" + publisherId)
						plyre.set("is_read", 0); //是否已读,0代表没有,1代表读了
						plyre.save();
						console.log("修改成功");
						common.dataLoading("修改成功", "success");
					},
					error: function (error) {
						console.log("修改失败");
					}
				});
				that.onShow();
			},
		})
		that.setData({
			showUpdDialog: false
		})
		// }
		setTimeout(function () {
			that.setData({
				showTopTips: false
			});
		}, 1000);
	},

	//-----------------------------------------------------------------------------
	//删除物件
	deleteEvent: function () {
		wx.showModal({
			title: '是否删除该物件?',
			content: '删除后将不能恢复',
			showCancel: true,
			confirmColor: "#a07c52",
			cancelColor: "#646464",
			success: function (res) {
				if (res.confirm) {
					//删除此物件后返回上一页
					var Diary = Bmob.Object.extend("Events");
					var queryEvent = new Bmob.Query(Diary);
					queryEvent.get(optionId, {
						success: function (result) {
							result.destroy({
								//删除成功
								success: function (myObject) {
									common.dataLoading("删除成功", "success", function () {
										wx.navigateBack({
											delta: 1
										})
									});
								},
								//删除失败
								error: function (myObject, error) {
									console.log(error);
								}
							})
						},
						error: function (object, error) {
							console.log(error);
						}
					});
				} else {}
			}
		})
	},
	//----------------------悬浮按钮操作--------------------------------------
	initButton(position = 'bottomRight') {
		var isAdmin = wx.getStorageSync("user_isAdmin");
		console.log("admin? " + isAdmin);
		this.setData({
			opened: !1,
		})
		this.button = $wuxButton.init('br', {
				position: position,
				buttons: [{
						label: "群二维码",
						icon: "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/02/e049248040b452cd805877235b8b9e0c.png",
					}, {
						label: "修改信息",
						icon: "http://bmob-cdn-14867.b0.upaiyun.com/2017/12/02/9134d4a24058705f80a61ec82455fe47.png",
					},
				],
				// }
				buttonClicked(index, item) {
					if (index === 0) {
						if (that.data.qrcode == null) { //如果该物件没有上传群二维码
							if (that.data.isMe) { //如果是当前用户的我爱
								wx.showModal({
									title: '温馨提示',
									content: '您还未上传群二维码，如需上传，请点击修改信息',
								})
							} else {
								wx.showModal({
									title: '温馨提示',
									content: '该物件暂未上传群二维码，您可联系建群上传',
								})
							}
						} else { //如果该物件上传了群二维码
							that.showqrcode();
						}
					} else if (index === 1) {
						let actid = optionId;
						let pubid = publisherId;
						if (that.data.isMe) { //如果是当前用户的我爱
							wx.navigateTo({
								url: '/pages/updAct/updAct?actid=' + actid + "&pubid=" + pubid,
							})
						} else {
							that.setData({
								showUpdDialog: true
							})
						}
					}
					return true
				},
				callback(vm, opened) {
					vm.setData({
						opened,
					})
				},
			})
	},
	switchChange(e) {
		e.detail.value ? this.button.open() : this.button.close()
	},
	pickerChange(e) {
		const index = e.detail.value
			const position = this.data.types[index]
			this.initButton(position)
	},

})
