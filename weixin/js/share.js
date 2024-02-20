/**
* Author: 倘若飘邈 微信jiao_ao8
*/

//微信分享模块需要先引入微信js
var module_wxShare={
    data: {
        "userAgent": null, //判断设备
        "is_init": false, //是否初始化
        "wxParams": {
            debug: false,
            appId: "",
            timestamp: "",
            nonceStr: "",
            signature: "",
            jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","openLocation"]
        },
        "shareInfo":{
            "shareUrl": window.location.href,
            "shareTitle": "",
            "shareImg": "",
            "shareDesc": ""
        },
        "callback": function () { }    //回调函数
    },
    //初始化
    share: function(obj){
        var _this=this;
        _this.data.userAgent=module_public.navigator_userAgent();
        if(!_this.data.userAgent.isWeixin){
            return false;
        }
        _this.data.shareInfo=$.extend(_this.data.shareInfo, obj.shareInfo);
        if(obj.callback){
            _this.data.callback=obj.callback;
        }
        if(!_this.data.is_init){
            if(obj.wxParams){
                _this.data.wxParams=$.extend(_this.data.wxParams, obj.wxParams);
            }
            if(obj.ajax){
                $.ajax({
                    type: "POST",
                    url: obj.ajaxUrl,
                    data: obj.ajaxParams,
                    success:function(reData) {
                        if(reData.status == 1) {
                            _this.data.wxParams.appId=reData.wx.appId;
                            _this.data.wxParams.timestamp=reData.wx.timestamp;
                            _this.data.wxParams.nonceStr=reData.wx.nonceStr;
                            _this.data.wxParams.signature=reData.wx.signature;
                            //配置微信
                            wx.config(_this.data.wxParams);
                            //分享设置
                            _this.share_set({"ty":0});
                        }
                    }
                });
            }
            else{
                //配置微信
                wx.config(_this.data.wxParams);
                //分享设置
                _this.share_set({"ty":0});
            }
            _this.data.is_init=true;
        }
        else{
            //分享设置
            _this.share_set({"ty":1});
        }
    },
    //分享设置
    share_set: function(obj){
        var _this=this;
        var shareUrl = _this.data.shareInfo.shareUrl;
        var shareImg = _this.data.shareInfo.shareImg;
        var shareTitle = _this.data.shareInfo.shareTitle;
        var shareDesc = _this.data.shareInfo.shareDesc;
        function shareFriend() {
            wx.onMenuShareAppMessage({
                title: shareTitle,
                desc: shareDesc,
                link: shareUrl,
                imgUrl: shareImg,
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () {
                    _this.share_callBack();
                },
                cancel: function () {}
            });
        }
        function shareWeibo() {
            wx.onMenuShareWeibo({
                title: shareTitle,
                desc: shareDesc,
                link: shareUrl,
                imgUrl: shareImg,
                success: function () {
                    _this.share_callBack();
                },
                cancel: function () {}
            });
        }
        function shareTimeline() {
            wx.onMenuShareTimeline({
                title: shareDesc,
                link: shareUrl,
                imgUrl: shareImg,
                success: function () {
                    _this.share_callBack();
                },
                cancel: function () {}
            });
        }
        // 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
        wx.ready(function(){
            shareFriend();
            shareTimeline();
            shareWeibo();
            wx.error(function(res){
                //alert("ccc"+JSON.stringify(res));
            });
        });
        //ty不为1时，重写分享信息,用于业务逻辑需动态设置分享信息
        if(obj.ty==1){
            shareFriend();
            shareTimeline();
            shareWeibo();
        }
    },
    //分享回调
    share_callBack: function(obj){
        var _this=this;
        if ($.isFunction(_this.data.callback)) {
            _this.data.callback(obj);
        }
    }
}


//需要先引用<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
/*初始化及分享
module_wxShare.share({
    "ajax":false, //true为微信配置请求获得
    "ajaxUrl" : "{:U('Home/Service/doGetLiveWxJsSdkConfig')}", // "ajax":true必传false可不传
    "ajaxParams" : {"url": encodeURIComponent(window.location.href)}, // "ajax":true必传false可不传
    "wxParams" : {  //微信配置
        appId: "{$wx['appId']}",          //"ajax":true不传false必传
        timestamp: "{$wx['timestamp']}",  //"ajax":true不传false必传
        nonceStr: "{$wx['nonceStr']}",    //"ajax":true不传false必传
        signature: "{$wx['signature']}",  //"ajax":true不传false必传
        jsApiList: ["onMenuShareTimeline","onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","openLocation"] //可不传
    },
    "shareInfo":{  //分享信息
        "shareUrl": window.location.href,
        "shareTitle": "{$wxShare.title}",
        "shareImg": "{$wxShare.thumb_url}",
        "shareDesc": "{$wxShare.description}"
    },
    "callBack": function(obj){
        console.log("分享后回调我了");
        $.ajax({
            type: "POST",
            url: "{:U('Wasee/Waseehome/doSaveBodyCompound')}",
            data: {"share_count":1},
            success:function(argument) {
                // alert(JSON.stringify(argument));
            }
        });
    }
});
//已初始化修改分享信息
module_wxShare.share({
    "shareInfo":{
        "shareUrl": "自定义url",
        "shareTitle": "自定义标题",
    }
});*/