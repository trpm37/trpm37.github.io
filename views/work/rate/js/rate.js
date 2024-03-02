/**
* Author: 倘若飘邈 
* <940461709@qq.com> <微信jiao_ao8>
*/

(function(){
    //加载数据
    function Load_data(obj){
        var _this = this;
        _this.data=$.extend(true,{
            "load_type":0,
            "fill_type":0,
            "scroll":true,
            "scroll_bar":true,
            "scroll_barStyle": {},
            "dom": null,
            "url": null,
            "listParams": {"pageIndex":1,"pageSize":30},
            "listData": {},
            "format_callBack": function () {
            },
            "callback": function () {
            }    
        }, obj);
        if(_this.data.scroll_bar){
            var scroll_barStyle={
                autohidemode:false,
                horizrailenabled:false,
                cursorwidth: "4px",
                cursorcolor:"rgba(0,0,0,0.3)",
                background: "transparent",
                cursorborder: "none",
                cursorborderradius: "10px",
            };
            $.extend(scroll_barStyle,_this.data.scroll_barStyle);
            $(_this.data.dom+" .scroll").niceScroll(scroll_barStyle);
        }
        
        if(_this.data.scroll){
            if(_this.data.load_type==0){
                //向下滚动加载下一页
                var scroll_dom=$(_this.data.dom+" .scroll");
                scroll_dom.scroll(function(){
                    var scroll_top=scroll_dom[0].scrollTop;
                    var scroll_height=scroll_dom.height();
                    var list_height=scroll_dom.find(".list").height();
                    var loading=scroll_dom.attr("data-loading");
                    // console.log(scroll_top+"|"+scroll_height+"|"+list_height+"|"+(scroll_top+scroll_height));
                    if (scroll_top + scroll_height >= list_height-30) {
                        if(loading=="true") return;
                        scroll_dom.attr("data-loading","true");
                        var isMore=scroll_dom.attr("isMore");
                        if(isMore=="1"){
                            //下一页
                            scroll_dom.find(".loadMore").html("加载中...").show();
                            _this.scroll_data({});
                        }
                        else {
                            scroll_dom.find(".loadMore").html("已加载所有").show();
                        }
                    }
                }) 
            }
            else if(_this.data.load_type==1){
                //向上滚动加载下一页
                var scroll_dom=$(_this.data.dom+" .scroll");
                scroll_dom.scroll(function(){
                    var scroll_top=scroll_dom[0].scrollTop;
                    var loading=scroll_dom.attr("data-loading");
                    if(scroll_top==0){
                        if(loading=="true") return;
                        scroll_dom.attr("data-loading","true");
                        var isMore=scroll_dom.attr("isMore");
                        if(isMore=="1"){
                            //下一页
                            scroll_dom.find(".loadMore").html("加载中...").show();
                            _this.scroll_data({});
                        }
                        else {
                            scroll_dom.find(".loadMore").html("已加载所有").show();
                        }
                    }
                }) 
            }
        }
    }
    Load_data.prototype = {
        constructor: Load_data,
        //滚动获取数据
        scroll_data: function(obj) {
            var _this=this;
            var param_cover=obj.param_cover ? obj.param_cover : false;
            if(param_cover==1){
                _this.data.listParams={};
            }
            if(obj.callBack){
                _this.data.callBack=obj.callBack;
            }
            var params=$.extend(_this.data.listParams, obj.params);
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.url,
                "params" : params,
                "callBack" : function(reParams){
                    var params=reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize=params.pageSize;
                    var reData=reParams.data;
                    if(reData.status==1){
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        // console.log("pageIndex:"+pageIndex+"，totalPage:"+totalPage+"，total:"+total+"，count:"+count);
                        if(count==0){
                            $(_this.data.dom).find(".scroll .list").html('');
                            $(_this.data.dom).find(".loadMore").html('').hide();
                        }
                        else{
                            if(totalPage > 1){
                                $(_this.data.dom).find(".scroll").attr("isMore","1");
                                if(pageIndex==totalPage) {
                                    $(_this.data.dom).find(".scroll").attr("isMore","0");
                                    $(_this.data.dom).find(".loadMore").html('已加载所有').show();
                                }
                            }
                            else {
                                $(_this.data.dom).find(".scroll").attr("isMore","0");
                                $(_this.data.dom).find(".loadMore").html('已加载所有').show();
                            }
                
                            pageIndex++;
                            _this.data.listParams.pageIndex=pageIndex;
                        }
                        var listHtml="";
                        var list=reData.data;
                        if(list){
                            var cou=list.length;
                            for(var i=0; i<cou; i++){
                                var curObj = list[i];
                                if(curObj.id){
                                    var id = curObj.id;
                                    _this.data.listData[id]=curObj; 
                                }
                                if (_this.data.format_callBack && $.isFunction(_this.data.format_callBack)) {
                                    var reHtml=_this.data.format_callBack({"index":i, "data":curObj});
                                    if(reHtml){
                                        listHtml+=reHtml;
                                        if(_this.data.fill_type==1){
                                            $(_this.data.dom).find(".scroll .list").append(reHtml);
                                        }
                                    }
                                }
                            }
                        }
                        if(_this.data.fill_type==0){
                            $(_this.data.dom).find(".scroll .list").append(listHtml);
                        }
                        $(_this.data.dom).find(".scroll").attr("data-loading","false");
                    }
                    else{
                        // console.log(reData.info);
                    }
                    if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                        _this.data.callBack({"data":reData});
                    }
                    if(_this.data.scroll_bar){
                        $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        setTimeout(function(){
                            $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        },1000);
                    }
                }
            };
            trpm_publicModule.ajax(paramsObj);
        },
        //分页获取数据
        page_data: function(obj) {
            var _this=this;
            var param_cover=obj.param_cover ? obj.param_cover : false;
            if(param_cover==1){
                _this.data.listParams={};
            }
            if(obj.callBack){
                _this.data.callBack=obj.callBack;
            }
            var params=$.extend(_this.data.listParams, obj.params);
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.url,
                "params" : params,
                "callBack" : function(reParams){
                    var params=reParams.params;
                    var pageIndex = params.pageIndex;
                    var pageSize=params.pageSize;
                    var reData=reParams.data;
                    if(reData.status==1){
                        var totalPage = reData.totalPage;
                        var count = reData.count;
                        var total = reData.total;
                        // console.log("pageIndex:"+pageIndex+"，totalPage:"+totalPage+"，total:"+total+"，count:"+count);
                        if(count==0){
                            $(_this.data.dom).find(".scroll .list").html('');
                            $(_this.data.dom).find(".pagination-box .pagination").html('');
                        }
                        else{
                            if(totalPage > 1){
                                $(_this.data.dom).find(".pagination-box").show();
                            }
                            //分页
                            $(_this.data.dom+' .pagination-box .pagination').pagination({
                                // pageCount: totalPage,
                                current: pageIndex,
                                totalData: count,
                                showData: pageSize,
                                count:2,
                                coping: true,
                                // jump: true,
                                // jumpBtn:"跳转",
                                //homePage: '首页',
                                //endPage: '末页',
                                //prevContent: '上一页',
                                //nextContent: '下一页',
                                keepShowPN: true,
                                isHide: false,
                                callback: function (res) {
                                    // console.log(res.getCurrent());
                                    _this.data.listParams.pageIndex=res.getCurrent();
                                    _this.page_data({"params":obj.params});
                                }
                            });
                            pageIndex++;
                            _this.data.listParams.pageIndex=pageIndex;
                        }
                        var listHtml="";
                        var list=reData.data;
                        if(list){
                            var cou=list.length;
                            for(var i=0; i<cou; i++){
                                var curObj = list[i];
                                if(curObj.id){
                                    var id = curObj.id;
                                    _this.data.listData[id]=curObj; 
                                }
                                if (_this.data.format_callBack && $.isFunction(_this.data.format_callBack)) {
                                    var reHtml=_this.data.format_callBack({"index":i, "data":curObj});
                                    if(reHtml){
                                        listHtml+=reHtml;
                                        if(_this.data.fill_type==1){
                                            $(_this.data.dom).find(".scroll .list").append(reHtml);
                                        }
                                    }
                                }
                            }
                        }
                        if(_this.data.fill_type==0){
                            $(_this.data.dom).find(".scroll .list").html(listHtml);
                            $(_this.data.dom).find(".scroll").scrollTop(0);
                        }
                    }
                    else{
                        // console.log(reData.info);
                    }
                    if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                        _this.data.callBack({"data":reData});
                    }
                    if(_this.data.scroll_bar){
                        $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        setTimeout(function(){
                            $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        },1000);
                    }
                }
            };
            trpm_publicModule.ajax(paramsObj);
        },
        //获取数据
        list_data: function(obj) {
            var _this=this;
            delete _this.data.listParams.pageIndex;
            delete _this.data.listParams.pageSize;
            var param_cover=obj.param_cover ? obj.param_cover : false;
            if(param_cover==1){
                _this.data.listParams={};
            }
            if(obj.callBack){
                _this.data.callBack=obj.callBack;
            }
            var params=$.extend(_this.data.listParams, obj.params);
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.url,
                "params" : params,
                "callBack" : function(reParams){
                    var params=reParams.params;
                    var reData=reParams.data;
                    if(reData.status==1){
                        var listHtml="";
                        var list=reData.data;
                        if(list){
                            var cou=list.length;
                            for(var i=0; i<cou; i++){
                                var curObj = list[i];
                                if(curObj.id){
                                    var id = curObj.id;
                                    _this.data.listData[id]=curObj; 
                                }
                                if (_this.data.format_callBack && $.isFunction(_this.data.format_callBack)) {
                                    var reHtml=_this.data.format_callBack({"index":i, "data":curObj});
                                    if(reHtml){
                                        listHtml+=reHtml;
                                        if(_this.data.fill_type==1){
                                            $(_this.data.dom).find(".scroll .list").append(reHtml);
                                        }
                                    }
                                }
                            }
                        }
                        if(_this.data.fill_type==0){
                            $(_this.data.dom).find(".scroll .list").html(listHtml);
                            $(_this.data.dom).find(".scroll").scrollTop(0);
                        }
                    }
                    else{
                        // console.log(reData.info);
                    }
                    if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
                        _this.data.callBack({"data":reData});
                    }
                    if(_this.data.scroll_bar){
                        $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        setTimeout(function(){
                            $(_this.data.dom+" .scroll").getNiceScroll().resize();
                        },1000);
                    }
                }
            };
            trpm_publicModule.ajax(paramsObj);
        }
    }

    //评论模块
    var rateModule = {
        data: {
            "resourcePublic":paramObj.resourcePublic,
            "resourceWasee":paramObj.resourceWasee,
            "icon_load": paramObj.resourcePublic+"/images/loading2.gif",
            "login_userId":null, //登录用户id
            "login_auth_id":null, //授权用户id
            "login_nickname":null, //登录用户名
            "login_headimgurl":null, //登录用户头像
            "wxAuthCode":null,
            "list_ajaxUrl":'/Wasee/VRHome/getCommentList',
            "add_ajaxUrl":'/Wasee/VRIndex/addComment',
            "praise_ajaxUrl":'/Wasee/VRHome/doPraise',
            "loadFile":false,//文件是否加载完成
            "load_comment":null,
            "data_comment":null,
            "listParams":{"pageIndex":1,"pageSize":30},
            "waitReply":{"id":0,"pid":0,"uid":0,"uName":""},//待回复信息
            "emojiObj":null,
            "addCallBack":function(bkData){},//添加评论回调
        },
        //初始化
        init: function(obj){
            var _this = this;
            if(obj){
                // Object.assign(this.data, obj);
                $.extend(true,this.data, obj);
            }
            //导入文件
            _this.import_file({
                "callBack": function(){
                    _this.data.loadFile=true;
                    _this.data.emojiObj=new EmojiModule();
                }
            });
        },
        //导入文件
        import_file: function(obj){
            var _this=this;
            //导入css
            trpm_publicModule.loadCsss({
                "files":[
                    {"id":"rate_css","href":_this.data.resourcePublic+'/trpm/rate/css/rate.css?ver='+new Date().getTime()},
                ],
                "callBack":function(){
                    // console.log("css已加载");
                    //导入js
                    trpm_publicModule.loadScripts({
                        "files":[
                            {"id":"nicescroll_script","url":_this.data.resourcePublic+'/trpm/jquery-nicescroll/jquery.nicescroll.min.js'},
                            {"id":"emoji_script","url":_this.data.resourcePublic+'/trpm/emoji/js/emoji.js?ver='+new Date().getTime()}
                        ],
                        "callBack":function(){
                            // console.log("js已加载");
                            //回调
                            if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                                obj.callBack();
                            }
                        }
                    });
                }
            }); 
        },
        //显示dom
        dom: function(obj){
            var _this = this;
            function _A(){
                if(!_this.data.loadFile){
                    setTimeout(function(){
                        _A();
                    },1000);
                    return;
                }
                else{
                    mainFun();
                }
            }
            _A();
            // mainFun();
            function mainFun(){
                _this.data.login_userId=paramObj.session_anchor_id;
                _this.data.login_auth_id=paramObj.session_anchor_auth_id;
                _this.data.login_nickname=paramObj.base_anchor_nickname;
                _this.data.login_headimgurl=paramObj.base_anchor_headimgurl;
                _this.data.wxAuthCode=paramObj.wxAuthCode;
                if(obj){
                    $.extend(true,_this.data, obj);
                }
                try {
                    $("#rate-box").remove();
                    var domHtml='<div class="trpm-alert rate-alert" id="rate-box">'+
                                    '<div class="trpm-bk"></div>'+
                                    '<div class="trpm-flex trpm-mc">'+
                                        '<div class="trpm-x">'+
                                            '<span class="trpm-flex-xy">'+
                                                '<span class="icon-d"><i class="iconfont icon_close"></i></span>'+
                                            '</span>'+
                                        '</div>'+
                                        '<div class="trpm-tl trpm-none"><span class="txt">标题</span></div>'+
                                        '<div class="total"><span>0</span>条评论</div>'+
                                        '<div class="list-rate">'+
                                            '<div class="ul-box scroll">'+
                                                '<div class="ul list">'+
                                                    
                                                '</div>'+
                                                '<div class="loadMore">加载更多</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="trpm-flex-y bm-box">'+
                                            '<div class="trpm-flex-y lf">'+
                                                '<div class="inp-d"><input class="inp" id="rate-inp" type="text" placeholder="喜欢你就说出来！"></div>'+
                                                '<div class="trpm-btn btn-send">评论</div>'+
                                            '</div>'+
                                            '<div class="face-btn"></div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                } catch (error) {
                }
                $("body").append(domHtml);
                // $("#rate-box").show();
                $("#rate-box .trpm-mc").animate({ bottom: "0" }, 400,function(){

                });

                // 事件
                _this.events();

                _this.getComment({});
            }
        },
        //事件
        events: function(obj){
            var _this=this;
            $("#rate-box")
            //关闭
            .on("click",".trpm-bk, .trpm-x",function(event) {
                $("#rate-box .trpm-mc").animate({ bottom: "-100%" }, 300,function(){
                    $("#rate-box").remove();
                });
            })
            //点赞
            .on("click",".zan",function(event) {
                if(!_this.login()) return;
                var thisObj=$(this);
                var idd=thisObj.attr("data-id");
                var is_praise=thisObj.attr("data-praise");
                var params={"obj_id":idd,"op":1};
                if(is_praise==1){
                    params.op=2;
                }
                _this.doPraise({
                    "params":params,
                    "callBack":function(bkData){
                        var cou=thisObj.find(".cou").text();
                        if(params.op==1){
                            thisObj.addClass("on").attr({"data-praise":1}).find(".cou").text(Number(cou)+1);
                        }
                        else if(params.op==2){
                            thisObj.removeClass("on").attr({"data-praise":0}).find(".cou").text(Number(cou)-1);
                        }
                    }
                });
            })
            //点击项目
            .on("click",".list .li .head-d,.list .li .info",function(event) {
                var thisObj=$(this);
                var pObj=thisObj.parent();
                var idd=pObj.attr("data-id");
                var uid=pObj.attr("data-uid");
                var uName=pObj.find(".tl:eq(0)").text();
                var pid=idd;
                if(pObj.hasClass("two-li")){
                    pid=thisObj.parents(".one-li").attr("data-id");
                }
                _this.data.waitReply={"id":idd,"pid":pid,"uid":uid,"uName":uName};
                $("#rate-box .bm-box .inp").attr({"placeholder":"@"+uName}).val("@"+uName+" ").focus();
            })
            //失去光标
            .on("blur",".bm-box .inp",function(event) {
                var thisObj=$(this);
                var val=thisObj.val();
                // if(!val){
                //     _this.data.waitReply={"id":0,"pid":0,"uid":0,"uName":""};
                //     thisObj.attr({"placeholder":"喜欢你就说出来！"});
                // }
            })
            //文本改变
            .on("input",".bm-box .inp",function(event) {
                var thisObj=$(this);
                var val=thisObj.val();
                if(!val){
                    _this.data.waitReply={"id":0,"pid":0,"uid":0,"uName":""};
                    thisObj.attr({"placeholder":"喜欢你就说出来！"});
                }
            })
            //添加评论
            .on("click",".btn-send",function(event) {
                if(!_this.login()) return;
                $("#rate-box .bm-box .face-btn").attr("data-atr",0);
                _this.data.emojiObj.hide();
                var val=$("#rate-box .bm-box .inp").val();
                if(!val){
                    trpm_publicModule.alertMsg({"ty":0,"txt":"请输入评论内容","second":1500});
                    return false;
                }
                else{
                    var pid=_this.data.waitReply.pid;
                    var uid=_this.data.waitReply.uid;
                    var uName=_this.data.waitReply.uName;
                    var params={"content":val};
                    if(pid>0){
                        let tempName='@'+uName+' ';
                        if(val==tempName){
                            trpm_publicModule.alertMsg({"ty":0,"txt":"请输入评论内容","second":1500});
                            return false;
                        }
                        params.content=val.replace(tempName,'');
                        params.pid=pid;
                        params.reply_anchor_id=uid;
                    }
                    _this.addRate({
                        "params":params,
                        "callBack":function(bkData){
                            if(pid==0){
                                trpm_publicModule.topBottom({"dom":"#rate-box .scroll"});
                            }
                            _this.data.waitReply={"id":0,"pid":0,"uid":0,"uName":""};
                            $("#rate-box .bm-box .inp").attr({"placeholder":"请输入评论内容"}).val("");
                            $("#rate-box .total span").text(Number($("#rate-box .total span").text())+1);
                            //评论回调
                            if (_this.data.addCallBack && $.isFunction(_this.data.addCallBack)) {
                                _this.data.addCallBack(bkData);
                            }
                        }
                    });
                }
            })
            //表情-打开
            .on("click", ".bm-box .face-btn",function(){
                if(!_this.login()) return;
                var thisObj=$(this);
                let atr=thisObj.attr("data-atr");
                if(atr==1){
                    thisObj.attr("data-atr",0);
                    _this.data.emojiObj.hide();
                }
                else{
                    thisObj.attr("data-atr",1);
                    _this.data.emojiObj.dom({"dom":"#rate-box .bm-box","inp":"#rate-inp"});
                }
            })
            //表情-关闭
            .on("click",".bm-box .inp-d",function(){
                var thisObj=$(this);
                $("#rate-box .bm-box .face-btn").attr("data-atr",0);
                _this.data.emojiObj.hide();
            })
        },
        //获取评论列表
        getComment: function (obj) {
            var _this = this;
            let params=obj.params ? obj.params : _this.data.listParams;
            _this.data.load_comment=new Load_data({
                "load_type":0,
                "fill_type":2,
                "dom": "#rate-box",
                "url": _this.data.list_ajaxUrl,
                "listParams": params,
                "format_callBack": function(bkData){
                    var curObj=bkData.data;
                },
                "callBack": function(bkData){
                    var reData = bkData.data;
                    var count = reData.count;
                    _this.data.data_comment=_this.data.load_comment.data.listData; 
                    trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                    $("#rate-box .total span").html(count);
                    formatData(bkData);
                }
            });
            trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
            _this.data.load_comment.scroll_data({"params":params});

            function formatData(bkData){
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "";
                    var list = reData.data;
                    var cou = list.length;
                    for(var i=0; i<list.length; i++){
                        var curObj = list[i];
                        var id = curObj.id;
                        var anchor_info=curObj.anchor_info;
                        var anchor_id = anchor_info.id;
                        var nickname = anchor_info.nickname;
                        var image_url = anchor_info.headimgurl ? anchor_info.headimgurl : _this.data.resourceWasee+"/images/waseeLogo.png";
                        var praise = curObj.praise,praiseIcon="";
                        if(praise==1){
                            praiseIcon="on";
                        }
                        var praise_count = curObj.praise_count;
                        var content = curObj.content;
                        content= _this.data.emojiObj.getEmojiImage({str:content});
                        var create_time = curObj.create_time;
                        var subList = curObj.sub;
                        var subHtml='';
                        if(subList.length>0){
                            for(var j=0; j<subList.length; j++){
                                var curObj2 = subList[j];
                                var id2 = curObj2.id;
                                var anchor_info2=curObj2.anchor_info;
                                var anchor_id2 = anchor_info2.id;
                                var nickname2 = anchor_info2.nickname;
                                var image_url2 = anchor_info2.headimgurl ? anchor_info2.headimgurl : _this.data.resourceWasee+"/images/waseeLogo.png";
                                var praise2 = curObj2.praise,praiseIcon2="";
                                if(praise2==1){
                                    praiseIcon2="on";
                                }
                                var praise_count2 = curObj2.praise_count;
                                var content2 = curObj2.content;
                                content2= _this.data.emojiObj.getEmojiImage({str:content2});
                                var create_time2 = curObj2.create_time;
                                subHtml+='<div class="trpm-flex li two-li" data-id="'+id2+'" data-uid="'+anchor_id2+'">'+
                                            '<div class="head-d">'+
                                                '<img src="'+image_url2+'" alt="">'+
                                            '</div>'+
                                            '<div class="info">'+
                                                '<div class="tl">'+nickname2+'</div>'+
                                                '<div class="tips">'+content2+'<span class="tm">'+create_time2+'</span></div>'+
                                            '</div>'+
                                            '<div class="btn-d">'+
                                                '<div class="zan '+praiseIcon2+'" data-id="'+id2+'" data-praise="'+praise2+'">'+
                                                    '<div class="icon"></div>'+
                                                    '<div class="cou">'+praise_count2+'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                            }
                        }
                        listHtml+='<div class="trpm-flex li one-li" data-id="'+id+'" data-uid="'+anchor_id+'">'+
                                    '<div class="head-d">'+
                                        '<img src="'+image_url+'" alt="">'+
                                    '</div>'+
                                    '<div class="info">'+
                                        '<div class="tl">'+nickname+'</div>'+
                                        '<div class="tips">'+content+'<span class="tm">'+create_time+'</span></div>'+
                                        '<div class="sub-ul">'+
                                            subHtml+
                                        '</div>'+
                                    '</div>'+
                                    '<div class="btn-d">'+
                                        '<div class="zan '+praiseIcon+'" data-id="'+id+'" data-praise="'+praise+'">'+
                                            '<div class="icon"></div>'+
                                            '<div class="cou">'+praise_count+'</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                    }
                    if (cou > 0) {
                        $("#rate-box .list").append(listHtml);
                    }
                }
                else {
                    // console.log(reData.info);
                }
            }
        },
        //添加数据
        addRate: function(obj){
            var _this=this;
            var params={};
            $.extend(params,obj.params);
            var pid=params.pid;
            var content=params.content;
            content= _this.data.emojiObj.getEmojiImage({str:content});
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.add_ajaxUrl,
                "params" : params,
                "callBack" : function(bkData){
                    var id=bkData.data.id;
                    var create_time="";
                    if(pid){
                        var subItemHtml='<div class="trpm-flex li two-li" data-id="'+id+'" data-uid="'+_this.data.login_userId+'">'+
                                            '<div class="head-d">'+
                                                '<img src="'+_this.data.login_headimgurl+'" alt="">'+
                                            '</div>'+
                                            '<div class="info">'+
                                                '<div class="tl">'+_this.data.login_nickname+'</div>'+
                                                '<div class="tips"><span class="nm">回复 '+_this.data.waitReply.uName+'</span>'+content+'<span class="tm">'+create_time+'</span></div>'+
                                            '</div>'+
                                            '<div class="btn-d">'+
                                                '<div class="zan" data-id="'+id+'" data-praise="0">'+
                                                    '<div class="icon"></div>'+
                                                    '<div class="cou">0</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        var curItem=$("#rate-box .list .li[data-id="+pid+"]");
                        curItem.find(".sub-ul").prepend(subItemHtml);
                    }
                    else{
                        var itemHtml='<div class="trpm-flex li one-li" data-id="'+id+'" data-uid="'+_this.data.login_userId+'">'+
                                        '<div class="head-d">'+
                                            '<img src="'+_this.data.login_headimgurl+'" alt="">'+
                                        '</div>'+
                                        '<div class="info">'+
                                            '<div class="tl">'+_this.data.login_nickname+'</div>'+
                                            '<div class="tips">'+content+'<span class="tm">'+create_time+'</span></div>'+
                                            '<div class="sub-ul">'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="btn-d">'+
                                            '<div class="zan" data-id="'+id+'" data-praise="0">'+
                                                '<div class="icon"></div>'+
                                                '<div class="cou">0</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>';
                        $("#rate-box .list").prepend(itemHtml);
                    }
                    //回调
                    if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                        obj.callBack(bkData);
                    }
                }
            };
            trpm_publicModule.ajax(paramsObj);
        },
        //点赞
        doPraise: function(obj){
            var _this=this;
            var params={"web":1};
            $.extend(params,obj.params);
            var paramsObj={
                "type" : "POST",
                "url" : _this.data.praise_ajaxUrl,
                "params" : params,
                "callBack" : function(reParams){
                    var reData=reParams.data;
                    if(reData.status==1){
                        if ($.isFunction(obj.callBack)) {
                            obj.callBack({});
                        }
                    }
                    else{
                        trpm_publicModule.alertMsg({"ty":0,"txt":reData.info,"second":1500});
                    }
                }
            };
            trpm_publicModule.ajax(paramsObj);
        },
        //登录-是否登录和授权
        login: function(obj){
            var _this=this;
            var isTrue=false;
            if(_this.data.login_userId==""){
                if(_this.data.login_auth_id==""){
                    // var paramsObj={
                    //     "type" : "POST",
                    //     "async": false,
                    //     "url" : '/Wasee/Base/getAuthCode?code='+_this.data.wxAuthCode,
                    //     "params" : {},
                    //     "callBack" : function(reParams){
                    //         var reData=reParams.data;
                    //         if(reData.status==1){
                    //             window.location='/Wasee/Auth/wxAuth?code='+reData.data+'&returnUrl='+encodeURIComponent(window.location);
                    //         }
                    //         else{
                    //             trpm_publicModule.alertMsg({"ty":0,"txt":reData.info,"second":1500});
                    //         }
                    //     }
                    // };
                    // trpm_publicModule.ajax(paramsObj);
                    window.location.href='/Wasee/Public/loginwasee?returnUrl=' + encodeURIComponent(window.location.href);
                }
                else{
                    window.location='/Wasee/Public/cityLogin?returnUrl='+encodeURIComponent(window.location);
                }
            }
            else{
                isTrue=true;
            }
            return isTrue;
        }
    }
    window.rateModule=rateModule;
}())