//获取应用实例
var app = getApp()
var Bmob = require("../../utils/bmob.js");
var common = require('../template/getCode.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var that;
var myDate = new Date();
//格式化日期
function formate_data(myDate) {
    let month_add = myDate.getMonth() + 1;
    var formate_result = myDate.getFullYear() + '-' +
        month_add + '-' +
        myDate.getDate()
    return formate_result;
}
Page({
    /**
     * 页面的初始数据
     */
    data: {
        notice_status: false,
        accounts: ["微信号", "QQ号", "手机号"],
        accountIndex: 0,
        peopleHide: false,
        isAgree: false,
        date: formate_data(myDate),
        address: '点击选择位置',
        longitude: 0, //经度
        latitude: 0, //纬度
        showTopTips: false,
        TopTips: '',
        noteMaxLen: 200, //备注最多字数
        content: "",
        noteNowLen: 0, //备注当前字数
        types: ["农产品", "手工品", "家用品", "闲置", "书籍", "出行", "电影", "音乐", "其他"],
        typeIndex: "0",
        showInput: false, //显示输入真实姓名,
    },

    tapNotice: function(e) {
        if (e.target.id == 'notice') {
            this.hideNotice();
        }
    },
    showNotice: function(e) {
        this.setData({
            'notice_status': true
        });
    },
    hideNotice: function(e) {
        this.setData({
            'notice_status': false
        });
    },


    //字数改变触发事件
    bindTextAreaChange: function(e) {
        var that = this
        var value = e.detail.value,
            len = parseInt(value.length);
        if (len > that.data.noteMaxLen)
            return;
        that.setData({
            content: value,
            noteNowLen: len
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        that = this;

        that.setData({ //初始化数据
            src: "",
            isSrc: false,
            ishide: "0",
            autoFocus: true,
            isLoading: false,
            loading: true,
            isdisabled: false
        })

        // 自己位置初始化
        // 实例化腾讯地图API核心类
        const qqmapsdk = new QQMapWX({
            key: 'TCCBZ-XUICJ-A6PFE-KL5IQ-PV4E6-BXF6P' // 必填
        });
        // console.log(qqmapsdk);
        // 查看位置
        wx.getLocation({
            type: 'wgs84', // 返回可以用于wx.openLocation的经纬度
            success: function(res) {
                // console.log("getLocation res: ", res);
                // 根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                // console.log(qqmapsdk.reverseGeocoder);
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    success: function(addressRes) {
                        const address = addressRes.result.formatted_addresses.recommend;
                        const {
                            lat: latitude,
                            lng: longitude
                        } = addressRes.result.location;
                        // console.log(address);
                        that.setData({
                            address: address,
                            longitude: longitude, //经度
                            latitude: latitude //纬度
                        })
                    }
                })
            },
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        wx.hideToast()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var myInterval = setInterval(getReturn, 500); ////半秒定时查询
        function getReturn() {
            wx.getStorage({
                key: 'user_openid',
                success: function(ress) {
                    if (ress.data) {
                        clearInterval(myInterval)
                        that.setData({
                            loading: true
                        })
                    }
                }
            })
        }
    },

    //上传物件图片
    uploadPic: function() { //选择图标
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                that.setData({
                    isSrc: true,
                    src: tempFilePaths
                })
            }
        })
    },

    //删除图片
    clearPic: function() { //删除图片
        that.setData({
            isSrc: false,
            src: ""
        })
    },

    //上传物件群二维码
    uploadCodePic: function() { //选择图标
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], //压缩图
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths
                that.setData({
                    isCodeSrc: true,
                    codeSrc: tempFilePaths
                })
            }
        })
    },

    //删除物件群二维码
    clearCodePic: function() {
        that.setData({
            isCodeSrc: false,
            codeSrc: ""
        })
    },

    //限制人数
    switch1Change: function(e) {
        if (e.detail.value == false) {
            this.setData({
                peopleHide: false
            })
        } else if (e.detail.value == true) {
            this.setData({
                peopleHide: true
            })
        }
    },

    //改变时间
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
    //改变物件类别
    bindTypeChange: function(e) {
        this.setData({
            typeIndex: e.detail.value
        })
    },
    //选择地点
    addressChange: function(e) {
        this.addressChoose(e);
    },
    addressChoose: function(e) {
        var that = this;
        wx.chooseLocation({
            success: function(res) {
                that.setData({
                    address: res.name,
                    longitude: res.longitude, //经度
                    latitude: res.latitude, //纬度
                })
                if (e.detail && e.detail.value) {
                    this.data.address = e.detail.value;
                }
            },
            fail: function(e) {},
            complete: function(e) {}
        })
    },

    //改变联系方式
    bindAccountChange: function(e) {
        this.setData({
            accountIndex: e.detail.value
        })
    },

    //同意相关条例
    bindAgreeChange: function(e) {
        this.setData({
            isAgree: !!e.detail.value.length,
            // showInput: !this.data.showInput
        });
    },

    //表单验证
    showTopTips: function() {
        var that = this;
        this.setData({
            showTopTips: true
        });
        setTimeout(function() {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },
    //提交表单
    submitForm: function(e) {
        var that = this;

        var title = e.detail.value.title;
        var endtime = this.data.date;
        var typeIndex = this.data.typeIndex;
        var acttype = 1 + parseInt(typeIndex);
        var acttypename = getTypeName(acttype); //获得类型名称
        var address = this.data.address;
        var longitude = this.data.longitude; //经度
        var latitude = this.data.latitude; //纬度
        var switchHide = e.detail.value.switchHide;
        var peoplenum = e.detail.value.peoplenum;
        // console.log(e.detail);
        var content = e.detail.value.content;
        //------发布者真实信息------
        var realname = e.detail.value.realname;
        var contactindex = this.data.accountIndex;
        if (contactindex == 0) {
            var contactWay = "微信号";
        } else if (contactindex == 1) {
            var contactWay = "QQ号";
        } else if (contactindex == 2) {
            var contactWay = "手机号";
        }
        var contactValue = e.detail.value.contactValue;
        //先进行表单非空验证
        if (title == "") {
            this.setData({
                showTopTips: true,
                TopTips: '请输入物件名称'
            });
        } else if (content == "") {
            this.setData({
                showTopTips: true,
                TopTips: '我爱香港种番薯10斤，联系电话13688889999'
            });
        } else {
            console.log('校验完毕');
            // console.log(contactValue);
            that.setData({
                isLoading: true,
                isdisabled: true
            })
            //向 Events 表中新增一条数据
            wx.getStorage({
                key: 'user_id',
                success: function(ress) {
                    var Diary = Bmob.Object.extend("Events");
                    var diary = new Diary();
                    var me = new Bmob.User();
                    me.id = ress.data;
                    diary.set("title", title);
                    diary.set("endtime", endtime);
                    diary.set("acttype", acttype + "");
                    diary.set("isShow", 1);
                    diary.set("address", address);
                    diary.set("longitude", longitude); //经度
                    diary.set("latitude", latitude); //纬度\
                    if (that.data.peopleHide) { //如果设置了人数
                        diary.set("peoplenum", peoplenum);
                    } else if (!that.data.peopleHide) {
                        diary.set("peoplenum", "-1");
                    }
                    diary.set("content", content);
                    diary.set("publisher", me);
                    diary.set("likenum", 0);
                    diary.set("commentnum", 0);
                    diary.set("liker", []);
                    diary.set("joinnumber", 0); //发布后初始加入人数为0
                    diary.set("joinArray", []);
                    diary.set("providernum", 0); //发布后初始有货人数为0
                    diary.set("providerArray", []);
                    if (that.data.isSrc == true) {
                        var name = that.data.src; //上传图片的别名
                        var file = new Bmob.File(name, that.data.src);
                        file.save();
                        diary.set("actpic", file);
                    }
                    //新增操作
                    diary.save(null, {
                        success: function(result) {
                            //物件扩展表中添加一条记录
                            var Diary = Bmob.Object.extend("EventMore");
                            var query = new Diary();
                            var Events = Bmob.Object.extend("Events");
                            var event = new Events();
                            event.id = result.id;
                            query.set("Status", 0);
                            query.set("Statusname", "进行中");
                            query.set("event", event);
                            //如果上传了群二维码
                            if (that.data.isCodeSrc == true) {
                                var name = that.data.codeSrc; //上传图片的别名
                                var file = new Bmob.File(name, that.data.codeSrc);
                                file.save();
                                query.set("qrcode", file);
                            }
                            query.save();

                            //再将发布者的信息添加到联系表中
                            wx.getStorage({
                                key: 'user_id',
                                success: function(ress) {
                                    var Contacts = Bmob.Object.extend("Contacts");
                                    var contact = new Contacts();
                                    var Events = Bmob.Object.extend("Events");
                                    var event = new Events();
                                    event.id = result.id;
                                    var me = new Bmob.User();
                                    var contactWay = "微信";
                                    var contactValue = wx.getStorageSync("my_username");
                                    me.id = ress.data;
                                    contact.set("publisher", me); //发布人是自己
                                    contact.set("currentUser", me); //参加的人也是自己
                                    contact.set("event", event);
                                    contact.set("realname", realname);
                                    contact.set("contactWay", contactWay);
                                    contact.set("contactValue", contactValue);
                                    contact.save();
                                    // console.log("contact table updated");
                                },
                            })

                            console.log("发布成功,objectId:" + result.id);
                            that.setData({
                                isLoading: false,
                                isdisabled: false,
                                eventId: result.id,
                            })

                            //报名成功后发送一条消息给当前用户
                            wx.getStorage({
                                key: 'user_openid',
                                success: function(res) {
                                    var openid = res.data;
                                    //获取点击按钮的formId
                                    var formId = e.detail.formId;
                                    // console.log(formId);
                                    // let actid = optionId;
                                    // let pubid = publisherId;
                                    var title = that.data.listTitle;
                                    var address = that.data.address;
                                    var adminname = that.data.adminname;
                                    var adcontactWay = that.data.adcontactWay;
                                    var adcontactValue = that.data.adcontactValue;
                                    var adcontact = adcontactWay + " : " + adcontactValue;
                                    // console.log(formId);
                                    var temp = {
                                        "touser": openid, //这里是填写发送对象的openid
                                        "template_id": "b4x0oP6JtSBXsxsiTuTvoh0OfvfsBNyT0FShs52neRE", //这里填写模板ID，可以在小程序后台配置
                                        "page": "pages/index/index", //这里填写formid
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
                                                "value": "成功发布你爱的物件，请耐心等候"
                                            }
                                        },
                                        "emphasis_keyword": ""
                                    }
                                    Bmob.sendMessage(temp).then(function(obj) {
                                            console.log('发送成功')
                                        },
                                        function(err) {
                                            common.showTip('失败' + err)
                                        });
                                },
                            })
                            // wx.redirectTo({
                            //           url:"../index/index"
                            // });
                            //添加成功，返回成功之后的objectId(注意，返回的属性名字是id,而不是objectId)
                            common.dataLoading("我爱成功发布", "success", function() {
                                //重置表单
                                that.setData({
                                    title: '',
                                    typeIndex: 0,
                                    address: '点击选择位置',
                                    longitude: 0, //经度
                                    latitude: 0, //纬度
                                    data: formate_data(myDate),
                                    isHide: true,
                                    peoplenum: 0,
                                    peopleHide: false,
                                    isAgree: false,
                                    accountIndex: 0,
                                    realname: "",
                                    content: "",
                                    contactValue: '',
                                    noteNowLen: 0,
                                    showInput: false,
                                    src: "",
                                    isSrc: false,
                                    codeSrc: "",
                                    isCodeSrc: false
                                });
                            });
                        },
                        error: function(result, error) {
                            //添加失败
                            console.log("发布失败发布=" + error);
                            common.dataLoading("我爱失败发布", "loading");
                            that.setData({
                                isLoading: false,
                                isdisabled: false
                            })
                        }

                    })
                },
            })
        }
        setTimeout(function() {
            that.setData({
                showTopTips: false
            });
        }, 1000);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})

//根据物件类型获取物件类型名称
function getTypeName(acttype) {
    var acttypeName = "";
    if (acttype == 1) acttypeName = "农产品";
    else if (acttype == 2) acttypeName = "手工品";
    else if (acttype == 3) acttypeName = "家用品";
    else if (acttype == 4) acttypeName = "闲置";
    else if (acttype == 5) acttypeName = "书籍";
    else if (acttype == 6) acttypeName = "出行";
    else if (acttype == 7) acttypeName = "电影";
    else if (acttype == 8) acttypeName = "音乐";
    else if (acttype == 9) acttypeName = "其他";
    return acttypeName;
}
