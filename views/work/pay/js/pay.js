/**
*  支付
*  Author: 倘若飘邈 <940461709@qq.com>
*/

var trpm_payModule={
    data:{
        "pay_vkey":paramObj.live_vkey, //支付vkey
        "order_Obj":{ //下单
            "order_id":null,
            "ajaxUrl":null,
            "params":{
                "obj_type":"",
                "obj_id":0,
                "needPayUrl":1,
                "page_url":"",
                "money":0,
            },
            "callBack": function(bkData){}
        },
        "balance_Obj":{ //余额
            "ajaxUrl":null,
            "params":{},
            "callBack": function(bkData){}
        },
        "wx_Obj":{ //微信
            "pay_status":false, //微信支付状态
            "ajaxUrl":null,
            "params":{}
        },
        "loading_icon": trpm_publicModule.data.public_path+"/trpm/public/img/loading.gif", //加载图标
        "callBack": function(bkData){} //支付完成回调
    },
    init: function(obj){
        var _this=this;
        _this.data=$.extend(true,_this.data, obj);

        $(function(){

        });
    },
    //生成支付订单
    subOrder:function(obj){
        var _this=this;
        if(obj){
            _this.data.order_Obj=$.extend(true,_this.data.order_Obj, obj);
        }
        var ajaxUrl=_this.data.order_Obj.ajaxUrl ? _this.data.order_Obj.ajaxUrl : '/p/Wasee/Index/orderConfirm';
        trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.loading_icon});
        var paramsObj={
            "type" : "POST",
            "url" : ajaxUrl,
            "params" : _this.data.order_Obj.params,
            "callBack" : function(reParams){
                // console.log(reParams);
                var reData=reParams.data;
                if(reData.status==1){
                    trpm_publicModule.alertMsgRemove();
                    _this.data.order_Obj.order_id=reData.order_id;
                    //支付方式
                    _this.payway(reData);

                    if (_this.data.order_Obj.callBack && $.isFunction(_this.data.order_Obj.callBack)) {
                        _this.data.order_Obj.callBack({});
                    }
                }
                else{
                    trpm_publicModule.alertMsg({"ty":0,"txt":"操作异常","second":1000});
                }
            }
        };
        trpm_publicModule.ajax(paramsObj);
    },
    //微信支付轮询
    wachatPayLoop:function(obj){
        var _this=this;
        _this.data.wx_Obj.params={"order_id":_this.data.order_Obj.order_id,"pay_vkey":_this.data.pay_vkey};
        if(obj){
            _this.data.wx_Obj=$.extend(true,_this.data.wx_Obj, obj);
        }
        var ajaxUrl=_this.data.wx_Obj.ajaxUrl ? _this.data.wx_Obj.ajaxUrl : '/p/Home/Service/queryOrderStatus';
        if(_this.data.wx_Obj.pay_status==false){
            var paramsObj={
                "type" : "POST",
                "url" : ajaxUrl,
                "params" : _this.data.wx_Obj.params,
                "callBack" : function(reParams){
                    // console.log(reParams);
                    var reData=reParams.data;
                    if(reData.status==1){
                        _this.data.wx_Obj.pay_status=true;
                        setTimeout(function(){
                            if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                                _this.data.callBack({});
                            }
                        },1000);
                    }
                    else{
                        setTimeout(function(){
                            _this.wachatPayLoop();
                        },2000);
                    }
                }
            };
            trpm_publicModule.ajax(paramsObj);
        }
    },
    //支付方式
    payway:function(obj){
        var _this=this;
        var balancepay_url=obj.balancepay_url;
        var wx_url=obj.wx_url;
        var wx_url_qrcode=obj.wx_url_qrcode;
        var ali_url=obj.ali_url;
        var money=obj.money ? obj.money : _this.data.order_Obj.params.money;
        var domHtml ='<div class="trpm-alert payway-alert">'+
                        '<div class="trpm-bk"></div>'+
                        '<div class="trpm-mc">'+
                            '<span class="trpm-x"></span>'+
                            '<div class="trpm-tl">支付方式</div>'+
                            '<div class="payway-price-d">待支付金额：<span class="payway-red">￥<span class="payway-price">'+money+'</span></span></div>'+
                            '<div class="payway-opt payway-surplus">'+
                                '<div class="payway-txt">余额支付（￥<span class="payway-mymoney">0.00</span>）</div>'+
                            '</div>'+
                            '<div class="payway-opt payway-alipay"><div class="payway-txt">支付宝</div></div>'+
                            '<div class="payway-opt payway-wachat">'+
                                '<div class="payway-txt">微信支付</div>'+
                                '<div class="payway-ewm-d">'+
                                    '<img class="payway-ewm" src=""/>'+
                                    '<div class="payway-tips">打开微信扫一扫</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div> ';
        $("body").append(domHtml);
        $(".payway-alert").show();
        $(".payway-alert .trpm-mc").css("opacity",1);
        // 余额
        var myMoney=0;
        _this.balance({
            "callBack":function(bkData){
                myMoney=bkData.city_money;
                $(".payway-alert .payway-mymoney").text(myMoney);
            }
        })
        //余额
        if(balancepay_url==""){
            $(".payway-alert .payway-surplus").remove();
        }
        else{
            $(".payway-alert .payway-surplus").attr("data-url",balancepay_url).css({"display":"flex"});
        }
        //支付宝
        if(ali_url==""){
            $(".payway-alert .payway-alipay").remove();
        }
        else{
            $(".payway-alert .payway-alipay").attr("data-url",ali_url).css({"display":"flex"});
        }
        //微信内置
        if(wx_url!=""){
            $(".payway-alert .payway-wachat").attr({"data-open":1,"data-url":wx_url}).css({"display":"flex"}).html('<div class="payway-txt">微信支付</div>');
        }
        else{
            //微信二维码支付
            if(wx_url_qrcode!=""){
                _this.data.wx_Obj.pay_status=false;
                $(".payway-alert .payway-wachat").attr({"data-open":0,"data-url":""}).css({"display":"flex"}).html('<div class="payway-txt">微信支付</div><div class="payway-ewm-d"><img class="payway-ewm" src="'+wx_url_qrcode+'"><div class="payway-tips">打开微信扫一扫</div></div>');
                // 微信支付轮循
                _this.wachatPayLoop();
            }
            else {
                $(".payway-alert .payway-wachat").remove();
            }
        }
        $(".payway-alert").show();
        //关闭
        $(".payway-alert").on("click",".trpm-x",function(){
            _this.data.wx_Obj.pay_status=true;
            $(".payway-alert").remove();
        });
        //余额支付
        $(".payway-alert").on("click",".payway-surplus",function(){
            if(Number(myMoney)<money){
                trpm_publicModule.alertMsg({"ty":0,"txt":"余额不足","second":1000});
                return false;
            }
            var _url=$(this).attr("data-url");
            if(_url!=""){
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.loading_icon});
                var paramsObj={
                    "type" : "POST",
                    "url" : _url,
                    "params" : {},
                    "callBack" : function(reParams){
                        // console.log(reParams);
                        trpm_publicModule.alertMsgRemove();
                        var reData=reParams.data;
                        if(reData.status==1){
                            // 支付成功回调
                            if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                                _this.data.callBack({});
                            }
                        }
                        else{
                            trpm_publicModule.alertMsg({"ty":0,"txt":reData.info,"second":1000});
                        }
                    }
                };
                trpm_publicModule.ajax(paramsObj);
            }
        })
        //支付宝支付
        $(".payway-alert").on("click",".payway-alipay",function(){
            var _url=$(this).attr("data-url");
            if(_url!=""){
                window.open(_url);
            }
        })
        //微信内置支付
        $(".payway-alert").on("click",".payway-wachat",function(){
            var thisObj=$(this);
            var _url=thisObj.attr("data-url");
            var open=thisObj.attr("data-open");
            if(open=="1"){
                window.location=_url;
            }
            else{
                thisObj.find(".payway-txt").hide();
                thisObj.find(".payway-ewm-d").show();
            }
        })
    },
    //余额
    balance:function(obj){
        var _this=this;
        if(obj){
            _this.data.balance_Obj=$.extend(true,_this.data.balance_Obj, obj);
        }
        var ajaxUrl=_this.data.balance_Obj.ajaxUrl ? _this.data.balance_Obj.ajaxUrl : '/p/Wasee/Index/getAnchorInfo';
        var paramsObj={
            "type" : "POST",
            "url" : ajaxUrl,
            "params" : _this.data.balance_Obj.params,
            "callBack" : function(reParams){
                // console.log(reParams);
                var reData=reParams.data;
                if(reData.status==1){
                    if (_this.data.balance_Obj.callBack && $.isFunction(_this.data.balance_Obj.callBack)) {
                        _this.data.balance_Obj.callBack(reData.data);
                    }
                }
                else{
                    console.log(resData.info);
                }
            }
        };
        trpm_publicModule.ajax(paramsObj);
    }
}
trpm_payModule.init();
/*初始化示例 注释部分非必传
trpm_payModule.init({
    "pay_vkey":paramObj.live_vkey, //支付vkey
    // "order_Obj": {
    //     "ajaxUrl":'/p/'+paramObj.pool+'/Wasee/Index/orderConfirm',
    //     "params":{
    //         "obj_type":"",
    //         "obj_id":0,
    //         "needPayUrl":1,
    //         "page_url":"",
    //         "money":0,
    //     },
    //     "callBack": function(bkData){}
    // },
    // "balance_Obj": {
    //     "ajaxUrl":'/p/'+paramObj.pool+'/Wasee/Index/getAnchorInfo',
    //     "params":{},
    //     "callBack": function(bkData){}
    // },
    // "wx_Obj": {
    //     "ajaxUrl":'/p/'+paramObj.pool+'/Home/Service/queryOrderStatus',
    //     "params":{},
    // },
    "callBack": function () { //支付完成回调
    }
});*/
/*其他函数可以单独调用 比如下单
trpm_payModule.subOrder({
    // "ajaxUrl":'/p/'+paramObj.pool+'/Wasee/Index/orderConfirm',
    // "params":{
    //     "obj_type":"",
    //     "obj_id":0,
    //     "needPayUrl":1,
    //     "page_url":"",
    //     "money":0,
    // },
    // "callBack": function(bkData){}
});*/