/**
* Author: 倘若飘邈 
* <940461709@qq.com> <微信jiao_ao8>
*/

//----------------------------------公共模块----------------------------------
class trpm_publicModule{
    constructor(obj){
        this.data={
            "window_w": $(window).outerWidth(true),
            "window_h": $(window).outerHeight(true),
            "eventName": "click",
            "public_path":null, //公共路径
            "public_css":null
        };
        // $.extend(this.data, obj);
        this.init(obj);
    }
    //初始化
    init(obj){
        var _this=this;
        $.extend(_this.data, obj);
        //导入css
        let public_css=_this.data.public_css ? _this.data.public_css : _this.data.public_path+'/trpm/public/css/trpm-public.css';
        _this.loadCss({
            "id":"trpm-public-css",
            "href":public_css,
            "callBack":function(){
            }
        });
    }
    //判断设备
    userAgent() {
        var reObj={"mobile":false,"android":false,"apple":false,"weixin":false,"Opera":false,"IE":false,"Firefox":false,"Chrome":false,"Safari":false};
        var mobile_agent = ["Android", "iPhone","SymbianOS", "Windows Phone","iPad", "iPod"];
        var userAgentInfo = navigator.userAgent;
        for (var v = 0; v < mobile_agent.length; v++) {
            if (userAgentInfo.indexOf(mobile_agent[v]) > 0) {
                reObj.mobile=true;
                break;
            }
        }
        if (userAgentInfo.indexOf("Android") > 0) {
            reObj.android=true;
        }
        if (userAgentInfo.indexOf("iPhone") > 0||userAgentInfo.indexOf("iPad") > 0||userAgentInfo.indexOf("iPod") > 0) {
            reObj.apple=true;
        }
        if (userAgentInfo.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
            reObj.weixin=true;
        }

        //浏览器
        if (userAgentInfo.indexOf("Chrome") > -1){
            reObj.Chrome=true;
        }
        if (userAgentInfo.indexOf("Firefox") > -1) {
            reObj.Firefox=true;
        }
        if (userAgentInfo.indexOf("Safari") > -1) {
            reObj.Safari=true;
        }
        if (userAgentInfo.indexOf("Opera") > -1) {
           reObj.Opera=true;
        };
        if (userAgentInfo.indexOf("MSIE") > -1 || "ActiveXObject" in window || userAgentInfo.indexOf("Edg") > -1) {
            reObj.IE=true;
        };
        return reObj;
    }
    //发送ajax
    ajax(obj){
        let varObj=$.extend({
            "isPromise":false,
            "type": "POST",
            "async": true,
            "url": "",
            "params": {},
            "callBack": function (bkData) { }    //回调函数
        }, obj);
        let ajaxParams={
            type: varObj.type,
            async: varObj.async,
            url: varObj.url,
            data: varObj.params,
            success: function(reData){
                if (varObj && varObj.callBack && $.isFunction(varObj.callBack)) {
                    varObj.callBack({"params":varObj.params, "data":reData});
                }
            },
            error: function(rs, sta, err){
                if (varObj && varObj.callBack && $.isFunction(varObj.callBack)) {
                    varObj.callBack({"rs":rs, "sta":sta,"err":err});
                }
            }
        };
        if(!varObj.isPromise){
            $.ajax(ajaxParams);
        }
        else{
            return new Promise(function(resolve,reject){
                ajaxParams.success=function(res){
                    resolve({"params":varObj.params, "data":res});
                };
                ajaxParams.error=function(rs, sta, err){
                    reject(rs, sta, err);
                };
                $.ajax(ajaxParams);
            });
        }
    }
    //动态加载js并判断是否加载完成
    loadScript(obj) {
        var dom_id=obj.id;
        var target_id = obj.target_id ? obj.target_id : "";
        var verify_var=obj.verify_var!=undefined ? obj.verify_var : "";
        var node = null,target_node_load=false;
        var varObj=$.extend({
            "type":"text/javascript",
            "defer":true,
            "async":false,
            "callback": function () { }    //回调函数
        }, obj);
        
        if(dom_id){
            if($("#"+dom_id).length==0){
                createNode();
                if_target();
            }
            else{
                // node=$("#"+dom_id).get(0);
                callBack();
            }
        }
        else{
            createNode();
            if_target();
        }

        // if_target();
        function if_target(){
            if(target_id && $("#"+target_id).length>0){
                load_targetNode();
                function target_poll(){
                    if(!target_node_load){
                        setTimeout(function(){
                            target_poll();
                        },1);
                    }
                    else{
                        load_node();
                    }
                }
                target_poll();
            }
            else{
                load_node();
            }
        }

        function createNode(){
            node = document.createElement("script");
            if(varObj.id){
                node.setAttribute("id", varObj.id);
            }
            node.setAttribute("type", varObj.type);
            if(varObj.defer){
                node.setAttribute("defer", varObj.defer);
            }
            if(varObj.async){
                // node.setAttribute("async", varObj.async);
            }
            node.setAttribute("src", varObj.src);
            if(target_id && $("#"+target_id).length>0){
                $("#"+target_id).before(node);
            }
            else{
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(node);
            }
        }

        function load_node(){
            try {
                if(node.readyState){   //IE
                    node.onreadystatechange=function(){
                        if(node.readyState=='complete'||node.readyState=='loaded'){
                            node.onreadystatechange=null;
                            callBack();
                        }
                    }
                }
                else{    //非IE
                    node.onload=function(){
                        callBack();
                    };
                }
            } catch (error) {
                console.log(error);
            }
        }

        function load_targetNode(){
            try {
                let targetNode=$("#"+target_id).get(0);
                if(targetNode.readyState){   //IE
                    targetNode.onreadystatechange=function(){
                        if(targetNode.readyState=='complete'||targetNode.readyState=='loaded'){
                            targetNode.onreadystatechange=null;
                            target_node_load=true;
                        }
                    }
                }
                else{    //非IE
                    targetNode.onload=function(){
                        target_node_load=true;
                    }
                }
            } catch (error) {
                    
            }
        }

        function callBack(){
            if (varObj && varObj.callBack && $.isFunction(varObj.callBack)) {
                if(verify_var){
                    let eval_var = window[verify_var];
                    function bk_poll(){
                        if(!eval_var){
                            setTimeout(function(){
                                eval_var = window[verify_var];
                                bk_poll();
                            },10);
                        }
                        else{
                            varObj.callBack();
                        }
                    }
                    bk_poll();
                }
                else{
                    varObj.callBack();
                }  
            }
        }
    }
    //动态按顺序加载多个js
    loadScripts(obj){
        var _this=this;
        var files=obj.files;
        var cou=files.length;
        var this_obj={
            "cou":0,//加载成功数
            "next":true,//是否加载下一个  
        };

        var poll=function(){
            if(this_obj.cou==cou){
                if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                    obj.callBack();
                }
                return;
            }
            else{
                if(this_obj.next){
                    this_obj.next=false;
                    var curObj=files[this_obj.cou];
                    if(curObj){
                        var dom_id = curObj.id;
                        var target_id = curObj.target_id ? curObj.target_id : "";
                        var url=curObj.url;
                        var verify_var=curObj.verify_var ? curObj.verify_var : "";
                        trpm_publicModule.loadScript({"id":dom_id,"target_id":target_id,"src":url,"verify_var":verify_var,"callBack":function(){
                            this_obj.next=true;
                            this_obj.cou++;
                        }}); 
                    } 
                }
                setTimeout(function(){
                    poll();
                },100);
            }
        }
        poll();
    }
    //动态加载js并判断是否加载完成
    async loadScript2(obj) {
        let _this=this;
        let u=_this.userAgent();
        var varObj=$.extend({"type":"text/javascript"}, obj);
        let isAjax=varObj.isAjax ? varObj.isAjax : false;
        let dom_id=varObj.id,url=varObj.url;
        let node = null, is_target=false, target=null;
        if(varObj.target_id && $("#"+varObj.target_id).length>0){
            is_target=true;
            target=$("#"+varObj.target_id);
        }

        //创建script
        function createNode(){
            if(!u.IE && isAjax){ 
            }
            else{
                node = document.createElement("script");
                if(dom_id){
                    node.setAttribute("id", dom_id);
                }
                node.setAttribute("type", varObj.type);
                if(varObj.defer){
                    node.setAttribute("defer", varObj.defer);
                }
                if(varObj.async){
                    node.setAttribute("async", varObj.async);
                }
                node.setAttribute("src", url);
                if(is_target){
                    target.before(node);
                }
                else{
                    var head = document.getElementsByTagName("head")[0];
                    head.appendChild(node);
                }
            }
        }
        //加载script
        function load_node(o){
            let script=o && o.node ? o.node : node;
            let pm=new Promise(function(resolve,reject){
                try {
                    // if(script.readyState){   //IE
                    if(u.IE){ 
                        script.onreadystatechange=function(){
                            if(!script.readyState || script.readyState=='loaded' || script.readyState=='complete'){
                                script.onreadystatechange=null;
                                resolve({"u":"IE", "status":1, "info":"加载完成","url":url});
                            }
                        }
                    }
                    else{//非IE
                        if(isAjax){
                            $.ajax({
                              url: url,
                              dataType: "script",
                              cache: true
                            }).done(function(){
                                resolve({"u":"非IE", "status":1, "info":"加载完成","url":url});
                            });
                        }
                        else{
                            script.onload=function(){
                                resolve({"u":"非IE", "status":1, "info":"加载完成","url":url});
                            };
                        }
                    }
                } catch (error) {
                    reject({"status":0,"info":error,"url":url});
                }
            });
            return pm;
        }
        // 选择加载script
        async function switch_load_node(){
            let reData=null;
            if(is_target){
                let targetNode=target.get(0);
                await load_node({"node":targetNode}).catch(function(rej){
                    reData=rej;
                });
                reData= await load_node().catch(function(rej){
                    reData=rej;
                });
            }
            else{
                reData= await load_node().catch(function(rej){
                    reData=rej;
                });
            }
            return reData;
        }

        let resolveData=null;
        if(dom_id){
            if($("#"+dom_id).length==0){
                createNode();
                resolveData=await switch_load_node().catch(function(rej){
                    resolveData={"status":0,"info":"加载失败","url":url};
                });
            }
            else{
                resolveData={"status":1,"info":"已存在","url":url};
            }
        }
        else{
            createNode();
            resolveData=await switch_load_node().catch(function(rej){
                resolveData={"status":0,"info":"加载失败","url":url};
            });
        }

        // console.log(resolveData);
        return resolveData;
    }
    //动态按顺序加载多个js
    async loadScripts2(obj){
        let _this=this;
        let files=obj.files;
        let cou=files.length;
        let this_obj={
            "cou":0,//加载成功数
            "success":[],//成功的js
            "error":[]//失败的js
        };

        for(let i=0;i<cou;i++){
            let curObj=files[i];
            if(curObj){
                let dom_id = curObj.id;
                let target_id = curObj.target_id ? curObj.target_id : "";
                let url=curObj.url;
                let isAjax=curObj.isAjax ? curObj.isAjax : false;
                let params={"id":dom_id,"target_id":target_id,"url":url,"isAjax":isAjax};
                const res=await trpm_publicModule.loadScript2(params).catch(function(rej){
                    this_obj.error.push(params);
                });
                // console.log(res);
                if(res && res.status==1){
                    this_obj.cou++;
                    this_obj.success.push(params);
                }
            } 
        }
        return this_obj;
    }
    //动态按顺序加载单个css
    loadCss(obj) {
        var dom_id=obj.id;
        var target_id = obj.target_id ? obj.target_id : "";
        var varObj=$.extend({
            "type":"text/css",
            "rel":"stylesheet",
            "callback": function () { }    //回调函数
        }, obj);

        if(dom_id){
            if($("#"+dom_id).length==0){
                fun();
            }
            else{
                if (varObj && varObj.callBack && $.isFunction(varObj.callBack)) {
                    varObj.callBack();
                }
            }
        }
        else{
            fun();
        }

        function fun(){
            var node = document.createElement('link');
            node.id = varObj.id; //node.setAttribute("id", varObj.id);
            node.type = varObj.type;
			node.rel = varObj.rel;
            node.href = varObj.href;
            
            if(target_id && $("#"+target_id).length>0){
                $("#"+target_id).before(node);
            }
            else{
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(node);
            }

            if (varObj && varObj.callBack && $.isFunction(varObj.callBack)) {
                varObj.callBack();
            }
        }
    }
    loadCss2(obj) {
        var _this=this;
        var dom_id=obj.id;
        var target_id = obj.target_id ? obj.target_id : "";
        var node =null;
        var varObj=$.extend({
            "type":"text/css",
            "rel":"stylesheet",
            "callback": function () { }    //回调函数
        }, obj);

        if(dom_id){
            if($("#"+dom_id).length==0){
                createNode();
                load_node();
            }
            else{
                // node=$("#"+dom_id).get(0);
                // load_node();
                callBack();
            }
        }
        else{
            createNode();
            load_node();
        }

        function createNode(){
            node = document.createElement('link');
            node.id = dom_id; //node.setAttribute("id", dom_id);
            node.type = varObj.type;
            node.rel = varObj.rel;
            node.href = varObj.href;
            if(target_id && $("#"+target_id).length>0){
                $("#"+target_id).before(node);
            }
            else{
                var head = document.getElementsByTagName("head")[0];
                head.appendChild(node);
            }
        }

        function load_node(){
            if (node.attachEvent) {//IE
                node.attachEvent('onload', function () {
                    callBack();
                });
            } 
            else {//other browser
                setTimeout(function () {
                    poll(node);
                }, 0);
            }
        }

        function poll(node) {
            var isLoaded = false;
            if (/webkit/i.test(navigator.userAgent)) {//webkit
                if (node['sheet']) {
                    isLoaded = true;
                }
            } 
            else if (node['sheet']) {// for Firefox
                try {
                    if (node['sheet'].cssRules) {
                        isLoaded = true;
                    }
                } catch (ex) {
                    // if (ex.code === 1000) {
                    //     isLoaded = true;
                    // }
                    isLoaded = true;
                }
            }
            if (isLoaded) {
                setTimeout(function () {
                    callBack();
                }, 1);
            } else {
                setTimeout(function () {
                    poll(node);
                }, 10);
            }
        }

        function callBack(){
            if (varObj && varObj.callBack && $.isFunction(varObj.callBack)) {
                varObj.callBack();
            }
        }
    }
    //动态按顺序加载多个css
    loadCsss(obj){
        var _this=this;
        var fun=obj.fun ? obj.fun : 0;
        var files=obj.files;
        var cou=files.length;
        var this_obj={
            "cou":0,//加载成功数
            "next":true,//是否加载下一个
        };

        var poll=function(){
            if(this_obj.cou==cou){
                if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                    obj.callBack();
                }
            }
            else{
                if(this_obj.next){
                    this_obj.next=false;
                    var curObj=files[this_obj.cou];
                    if(curObj){
                        var dom_id = curObj.id;
                        var target_id = curObj.target_id ? curObj.target_id : "";
                        var href=curObj.href;
                        if(fun==2){
                            _this.loadCss2({"id":dom_id,"target_id":target_id,"href":href,"callBack":function(){
                                this_obj.next=true;
                                this_obj.cou++;
                            }});
                        }
                        else{
                            _this.loadCss({"id":dom_id,"target_id":target_id,"href":href,"callBack":function(){
                                this_obj.next=true;
                                this_obj.cou++;
                            }});
                        }
                    } 
                }
                setTimeout(function(){
                    poll();
                },100);
            }
        }
        poll();
    }
    //动态添加样式style {"css":'#div{width:30px;} .div{height:30px;}'}
    addStyle(obj){
        var css=obj.css;
        let styleDom=document.createElement('style');
        styleDom.innerText=css;
        document.body.appendChild(styleDom);
    }
    //弹框居中
    alertCenter(obj){
        var elem=obj.elem;
        var _left = parseInt($(window).innerWidth() / 2 - $(elem).innerWidth() / 2);
        var _top = parseInt($(window).height() / 2 - $(elem).height() / 2);
        $(elem).css({'left':_left,'top':_top,"opacity":1});
    }
    //消息弹框
    alertMsg(obj){
        var _this=this;
        var z_index=obj.z_index ? obj.z_index : 100000;
        var inforTxt='<div class="trpm-txt">'+obj.txt+'</div>';
        if(obj.ty==1){
            inforTxt='<div class="trpm-icon-d"><img class="trpm-icon" src="'+obj.icon+'"/></div>';
        }
        else if(obj.ty==2){
            inforTxt='<div class="trpm-icon-d" style="margin-bottom:6px;"><img class="trpm-icon" src="'+obj.icon+'"/></div>'+
                    '<div class="trpm-txt">'+obj.txt+'</div>';
        }
        var msgHtml='<div class="trpm-alert-msg" style="z-index:'+z_index+'">'+
                        '<div class="trpm-mc trpm-flex-xy">'+
                            '<div class="trpm-info">'+
                                inforTxt+
                            '</div>'+
                        '</div>'+
                    '</div>';
        $("body").append(msgHtml);
        _this.alertCenter({"elem":".trpm-alert-msg .trpm-mc"});
        var second=obj.second;
        if(second){
            setTimeout(function() {
                $(".trpm-alert-msg").remove();
            }, second);
        }
    }
    //选择
    select(obj){
        var _this = this;
        var dom=obj.dom;
        var name=obj.name;
        var user_Agent = _this.userAgent();
        if(user_Agent.mobile){
            _this.data.eventName="touchend";
        }
        var z_index=obj.z_index ? obj.z_index : 100;
        var timestamp = new Date().getTime();
        var element_id="trpm-select"+timestamp;
        var liHtml="";
        var reData=obj.data;
        for (var i=0;i<reData.length;i++) {
            var curObj=reData[i];
            liHtml+='<div class="trpm-flex-y option" data-val="'+curObj.val+'"><div class="txt">'+curObj.key+'</div></div>';
        }
        var selHtml='<div class="trpm-sel" id="'+element_id+'" data-name="'+name+'" data-val="">'+
                        '<div class="trpm-flex-y nm">'+
                            '<span class="lab">请选择</span>'+
                            '<span class="sj trpm-sj"></span>'+
                        '</div>'+
                        '<div class="options">'+
                            '<div class="scroll">'+
                                '<div class="list">'+
                                    liHtml+
                                '</div>'+
                            '</div>'+
                        '</div>'+
                    '</div>';
        $(dom).html(selHtml);
        //选择
        $("#"+element_id)
        //mouseover
        .on("mouseover",function(){
            let thisObj=$(this);
            thisObj.find(".options").show();
        })
        //mouseout
        .on("mouseout",function(){
            let thisObj=$(this);
            thisObj.find(".options").hide();
        })
        //click
        .on("click",".options .option",function(){
            var thisObj=$(this);
            var pObj=thisObj.parents(".trpm-sel");
            var val=thisObj.attr("data-val");
            var txt=thisObj.find(".txt").text();
            txt=txt ? txt : "全部";
            pObj.attr({"data-val":val}).find(".nm .lab").text(txt);
            pObj.find(".options").hide();
            //回调
            if (obj && obj.sel_callBack && $.isFunction(obj.sel_callBack)) {
                obj.sel_callBack({"val":val,"txt":txt});
            }
        })

        //回调
        if (obj && obj.callBack && $.isFunction(obj.callBack)) {
            obj.callBack({"elem":"#"+element_id});
        }
    }
    //选择弹框
    alertSelect(obj){
        var _this = this;
        var user_Agent = _this.userAgent();
        if(user_Agent.mobile){
            _this.data.eventName="touchend";
        }
        var z_index=obj.z_index ? obj.z_index : 100;
        var timestamp = new Date().getTime();
        var element_id="trpm-alert-select"+timestamp;
        var liHtml="";
        var reData=obj.data;
        for (var i=0;i<reData.length;i++) {
            var curObj=reData[i];
            liHtml+='<div class="trpm-li trpm-li'+curObj.val+'" val="'+curObj.val+'">'+curObj.key+'</div>';
        }
        var msgHtml='<div class="trpm-alert-select" id="'+element_id+'" style="z-index:'+z_index+'">'+
                        '<div class="trpm-bk"></div>'+
                        '<div class="trpm-mc">'+
                            liHtml+
                        '</div>'+
                    '</div>';
        $("body").append(msgHtml);
        $(".trpm-alert-select .trpm-mc").animate({ bottom: "0" }, 300,function(){});
        //关闭
        $("body").on(_this.data.eventName,".trpm-alert-select .trpm-bk",function(){
            $("#"+element_id).remove();
        });
        //回调
        if (obj && obj.callBack && $.isFunction(obj.callBack)) {
            obj.callBack({"elem":"#"+element_id});
        }
    }
    //弹框-隐藏
    alertHide(obj){
        if(obj && obj.elem){
            $(obj.elem).hide();
        }
    }
    //弹框-移除
    alertRemove(obj){
        if(obj && obj.elem){
            $(obj.elem).remove();
        }
    }
    //消息弹框-移除
    alertMsgRemove(obj){
        $(".trpm-alert-msg").remove();
    }
    //获取URL参数
    getUrlParam(obj) {
        var paramName=obj.name;
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        return r!=null ? r[2] : null; 
    }
    //url地址操作
    doUrl(obj) {
        var url=obj.url ? obj.url : window.location.href;
        var paramName=obj.name;
        var ty=obj.ty ? obj.ty : 0;
        var reObj = {
            "newUrl": url,
            "params": {},
        };
        if (url.indexOf("?") != -1) {
            let urlAry=url.split("?");
            let paramsAry = urlAry[1].split("&");
            for(let i = 0; i < paramsAry.length; i ++) {
                let curAry=paramsAry[i].split("=");
                reObj.params[curAry[0]]=curAry[1];
            }
        
            if(ty==1){
                reObj.params[paramName]=obj.val;
            }
            else if(ty==2){
                delete reObj.params[paramName];
            }

            var newUrl="";
            for(let key in reObj.params){
                let and=newUrl=="" ? "?" : "&";
                newUrl+=and+key+"="+reObj.params[key];
            };
            reObj.newUrl=newUrl ? urlAry[0]+newUrl : reObj.newUrl;
        }
        return reObj;
    }
    //替换字符串replace({'str':"%a%喜欢%b%","vals":[{"%a%":"小天"},{"%b%":"小美"}]})
    replace(obj){
        var newStr=obj.str;
        var vals=obj.vals;
        for(var i=0;i<vals.length;i++){
            var val=vals[i];
            for(var key in val) {
                let name=key;
                name=name.replace('[','\\[').replace(']','\\]').replace('(','\\(').replace(')','\\)');
                var reg=new RegExp(name,'g');
                newStr=newStr.replace(reg,val[key]);
            }
        }
        return newStr;
    }
    //整数格式成小数 {"num":111111,"bits":1}
    intFormat(obj){
        var num=obj.num;
        var bits=obj.bits ? obj.bits : 1;
        var wan=0;
        var temp=num/10000;
        if(temp>1){
            temp=temp.toFixed(bits);
            var ary=temp.split('.');
            if(ary[1]==0){
                wan=ary[0];
            }
            else{
                wan=temp;
            }
        }
        return wan;
    }
    //回到底部/顶部
    topBottom(obj){
        var dom=obj.dom;
        var direction=obj.direction ? obj.direction : "top";
        var domObj=$(dom).get(0);
        if(direction=="bottom"){
            domObj.scrollTop=domObj.scrollHeight;
        }
        else{
            domObj.scrollTop=0;
        }
    }
    //全屏/退出全屏
    fullscreen(obj){
        let isFullScreen=obj.isFullScreen ? obj.isFullScreen : 0; 
        let domObj=$(obj.dom).get(0);
        if (isFullScreen) { //进入全屏
            if (domObj.requestFullscreen) {
                domObj.requestFullscreen();
            } else if (domObj.webkitRequestFullScreen) {
                domObj.webkitRequestFullScreen();
            } else if (domObj.mozRequestFullScreen) {
                domObj.mozRequestFullScreen();
            } else if (domObj.msRequestFullscreen) {
                // IE11
                domObj.msRequestFullscreen();
            }
        } else { //退出全屏
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        //回调
        if (obj.callBack && $.isFunction(obj.callBack)) {
            obj.callBack({"isFullScreen":isFullScreen});
        }
    }
    //全屏-事件监听
    fullscreenchange(obj){
        // ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange'].forEach((item,index) => {
        //     window.addEventListener(item, () => fullscreenchange());
        // })
        ['fullscreenchange','webkitfullscreenchange','mozfullscreenchange'].forEach(function(item,index){
            window.addEventListener(item, function(){ fullscreenchange()});
        })
        function fullscreenchange() {
            let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            if (isFullScreen) { //进入全屏
              //回调
                if (obj.callBack && $.isFunction(obj.callBack)) {
                    obj.callBack({"isFullScreen":isFullScreen});
                }
            } else { //退出全屏
              //回调
                if (obj.callBack && $.isFunction(obj.callBack)) {
                    obj.callBack({"isFullScreen":isFullScreen});
                }
            }
        }
    }
    //全屏-是否全屏
    isFullscreen(obj){
        document.fullscreenElement    ||
                   document.msFullscreenElement  ||
                   document.mozFullScreenElement ||
                   document.webkitFullscreenElement || false;
        let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
        return isFullScreen;
    }
    //全屏-获取全屏div
    fullscreenDiv(obj){
        let div=document.fullscreenElement    || document.msFullscreenElement  || document.mozFullScreenElement || document.webkitFullscreenElement || false;
        return div;
    }
    //全屏-是否支持全屏
    fullscreenEnabled(obj){
        let isEnabled= document.fullscreenEnabled ||  document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled || false;
        return isEnabled;
    }
    //rgb转16进制
    colorHex(obj) {
        let _this=this;
        let color = obj.color;
        // RGB颜色值的正则
        let reg = /^(rgb|RGB)/;
        if (reg.test(color)) {
          var strHex = "#";
          // 把RGB的3个数值变成数组
          var colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
          // 转成16进制
          for (var i = 0; i < colorArr.length; i++) {
            var hex = Number(colorArr[i]).toString(16);
            if (hex === "0") {
              hex += hex;
            }
            strHex += hex;
          }
          return strHex;
        } else {
          return String(color);
        }
    }
    //16进制转rgb
    colorRgb(obj) {
        let _this=this;
        let color = obj.color;
        color = color.toLowerCase();
        let num = obj.num ? obj.num : 0;
        // 16进制颜色值的正则
        let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (reg.test(color)) {
          // 如果只有三位的值，需变成六位，如：#fff => #ffffff
          if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
              colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
          }
          // 处理六位的颜色值，转为RGB
          var colorChange = [];
          for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
          }
          let rgb="RGB(" + colorChange.join(",") + ")";
          if(num){
            rgb=colorChange;
          }
          return rgb;
        } else {
          return color;
        }
    }
}
