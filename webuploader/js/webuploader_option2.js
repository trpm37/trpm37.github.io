/**
 * 百度上传-带素材库
 * Author: 倘若飘邈 <940461709@qq.com>
*/

//先引入webuploader.css和webuploader.min.js
var trpm_webuploaderOptionModule={
    data: {
        "window_w": $(window).innerWidth(),
        "window_h": $(window).innerHeight(),
        "userAgent":null, //当前设备
        "eventName":"click", //点击事件名称
        "config_obj":{
            "resourcePublic":trpm_publicModule.data.public_path,
            "type":0, //0:上传  1:上传+公共/我的素材库  2:上传+公共素材库  3:上传+我的素材库  4:公共/我的素材库  5:公共素材库  6:我的素材库
            "propressSecond":1000, //进度关闭时间单位毫秒
        },
        "publicMaterial_obj": { //公共素材库 为null时无公共素材库
            "url":null, //请求url
            "data":{}, //存储数据
            "params":{
                "pageIndex" : 1,
                "pageSize":60,
                "type":1
            }
        },
        "privateMaterial_obj": { //我的素材库 为null时无我的素材库
            "url":null, //请求url
            "data":{}, //存储数据
            "params":{
                "pageIndex" : 1,
                "pageSize":60,
                "type":1
            }
        },
        "material_callBack": function(bkData){ //素材回调函数
        },
        "upload_obj": {
            "obj":null, //上传对象
            "option":{}, //上传配置项
            "callBack": { //回调函数对象
                "fileQueued": function(bkData){},
                "uploadSuccess": function(bkData){},
                "uploadError": function(bkData){},
                "uploadProgress": function(bkData){}
            }
        }   
    },
    //初始化
    init: function(obj){
        var _this = this;
        if(obj.config){
            $.extend(_this.data.config_obj, obj.config);
        }
        _this.data.publicMaterial_obj.url= '/p/Wasee/Base/getPublicResourceList';
        _this.data.privateMaterial_obj.url= '/p/Wasee/Index/getResourceList';

        _this.data.userAgent=trpm_publicModule.userAgent();
        if(_this.data.userAgent.mobile){
            _this.data.eventName="touchend";
        }

        if(obj.upload_option){
            $.extend(_this.data.upload_obj.option, obj.upload_option);
        }

        if(obj.publicMaterial){
            if(obj.publicMaterial.url){
                _this.data.publicMaterial_obj.url=obj.publicMaterial_obj.url;
            }
            $.extend(_this.data.publicMaterial_obj.params, obj.publicMaterial_obj.params);
        }
        
        if(obj.privateMaterial){
            if(obj.privateMaterial.url){
                _this.data.privateMaterial_obj.url=obj.privateMaterial.url;
            }
            $.extend(_this.data.privateMaterial_obj.params, obj.privateMaterial.params);
        }

        // 素材回调
        if(obj.material_callBack){
            _this.data.material_callBack=obj.material_callBack;
        }
    
        // 事件回调
        if(obj.upload_callBack){
            $.extend(_this.data.upload_obj.callBack, obj.upload_callBack);
        }

        // 上传初始化
        _this.uploadInit();

        // 初始化回调
        if (obj && obj.callBack && $.isFunction(obj.callBack)) {
            obj.callBack();
        }

        //进度
        _this.dom({"ty":4})
    },
    //修改初始参数
    setInit: function(obj){
        var _this = this;
        if(obj.config){
            $.extend(_this.data.config_obj, obj.config);
        }

        if(obj.upload_option){
            $.extend(_this.data.upload_obj.option, obj.upload_option);
        }

        if(obj.publicMaterial){
            if(obj.publicMaterial.url){
                _this.data.publicMaterial_obj.url=obj.publicMaterial_obj.url;
            }
            $.extend(_this.data.publicMaterial_obj.params, obj.publicMaterial_obj.params);
        }

        if(obj.privateMaterial){
            if(obj.privateMaterial.url){
                _this.data.privateMaterial_obj.url=obj.privateMaterial.url;
            }
            $.extend(_this.data.privateMaterial_obj.params, obj.privateMaterial.params);
        }

        if(obj.material_callBack){
            _this.data.material_callBack=obj.material_callBack;
        }

        if(obj.upload_callBack){
            $.extend(_this.data.upload_obj.callBack, obj.upload_callBack);
        }

        if(obj.upload_option){
            for(var key in obj.upload_option){
                var val=obj.upload_option[key];
                _this.data.upload_obj.obj.option(key,val);
            }
            // 上传初始化
            // _this.uploadInit();
        }        
    },
    //上传初始化
    uploadInit: function(obj) {
        var _this=this;
        var option={
            auto: true, // 选完文件后，是否自动上传
            swf: _this.data.config_obj.resourcePublic+'/trpm/webuploader/lib/Uploader.swf', // swf文件路径
            server: '/p/Wasee/Index/doUploadResource?type=1&method=1', // 文件接收服务端
            formData: {}, //上传请求参数
            method: "POST", //文件上传方式，POST或者GET。
            // pick: { id: "#webuploader-upBtn", innerHTML: "选择文件",multiple: false}, // 指定选择文件的按钮容器,multiple {Boolean} 是否开起同时选择多个文件能力
            // 只允许选择图片文件。
            accept: {
                title: '图片',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            threads: 3,//上传并发数。允许同时最大上传进程数。
            fileNumLimit: "undefined",//上传文件数量限制 默认值：undefined
            fileSingleSizeLimit: 5242880,//单个文件大小限制
            duplicate: true,//是否允许重复的文件 
            chunked: false, //是否要分片处理大文件上传。
            chunkSize: 5242880, //分片每片大小 默认大小为5M
            chunkRetry: 2, //如果某个分片由于网络问题出错，允许自动重传多少次 默认2次
            compress: false, //配置压缩的图片的选项，为false则图片在上传前不进行压缩
        };
        if(obj){
            _this.data.upload_obj.option=$.extend(option, obj);
        }
        else{
            _this.data.upload_obj.option=$.extend(option, _this.data.upload_obj.option);
        }

        //销毁
        // _this.destroy();
        _this.data.upload_obj.obj = WebUploader.create(_this.data.upload_obj.option);
        _this.events();
    },
    //事件
    events: function(obj){
        var _this=this;
        //当文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列。
        _this.data.upload_obj.obj.on( 'beforeFileQueued', function( file) {
            // console.log(file);
            _this.beforeFileQueued({"file":file});
        });
        //当文件被加入队列以后触发。
        _this.data.upload_obj.obj.on( 'fileQueued', function( file ) {
            // console.log(file);
            _this.fileQueued({"file":file});
        });
        //当文件被移除队列后触发。
        _this.data.upload_obj.obj.on( 'fileDequeued', function( file ) {
            // console.log(file);
            _this.fileDequeued({"file":file});
        });
        //发送前触发，主要用来询问是否要添加附带参数
        _this.data.upload_obj.obj.on( 'uploadBeforeSend', function( obj,data,headers ) {
            // console.log(file);
            _this.uploadBeforeSend({"obj":obj,"data":data,"obj":headers});
        });
        //当开始上传流程时触发。
        _this.data.upload_obj.obj.on( 'startUpload', function( ) {
            _this.startUpload({});
        });
        //当开始上传流程暂停时触发。
        _this.data.upload_obj.obj.on( 'stopUpload', function( ) {
            _this.stopUpload({});
        });
        //某个文件开始上传前触发，一个文件只会触发一次。
        _this.data.upload_obj.obj.on( 'uploadStart', function( file ) {
            // console.log(file);
            // _this.uploadStart({"file":file});
        });
        //当所有文件上传结束时触发。
        _this.data.upload_obj.obj.on( 'uploadFinished', function( ) {
            _this.uploadFinished({});
        });
        //当文件上传成功时触发。
        _this.data.upload_obj.obj.on( 'uploadSuccess', function( file , response ) {
            // console.log(file);
            _this.uploadSuccess({"file":file,"response":response});
        });
        //不管成功或者失败，文件上传完成时触发。
        _this.data.upload_obj.obj.on( 'uploadComplete', function( file ) {
            // console.log(file);
            _this.uploadComplete({"file":file});
        });
        //上传过程中触发，携带上传进度。
        _this.data.upload_obj.obj.on( 'uploadProgress', function( file, percentage ) {
            // console.log(file);
            _this.uploadProgress({"file":file,"percentage":percentage});
        });
        //当文件上传出错时触发。
        _this.data.upload_obj.obj.on( 'uploadError', function( file, reason ) {
            // console.log(file);
            _this.uploadError({"file":file,"reason":reason});
        });
        //错误报告
        _this.data.upload_obj.obj.on( 'error', function( type, a, b ) {
            // console.log(type);
            _this.error({"type":type,"a":a,"b":b});
        });
    },
    //添加上传按钮
    addButton: function(obj){
        var _this=this;
        var pick=obj.pick;
        if(obj.hideBtn){
            if( !$(pick.id).attr("data-tempId") ){
                var timestamp = new Date().getTime();
                $(pick.id).attr("data-tempId",timestamp);
                $("body").append('<div id="webuploader-upBtn'+timestamp+'" data-tempId="'+timestamp+'"></div>');
                pick.id="#webuploader-upBtn"+timestamp;
                _this.data.upload_obj.obj.addButton(pick);
                // $("body").on("click", pick.id, function(){
                //     console.log("点击了");
                //     $("#webuploader-upBtn"+timestamp+" input[type=file][name=file]").click();
                //     return false;
                // });
            }
        }
        else{
            if(!$(pick.id).hasClass("webuploader-container")){
                _this.data.upload_obj.obj.addButton(pick);
            }
        }

        if (obj && obj.callBack && $.isFunction(obj.callBack)) {
            obj.callBack();
        }
    },
    //上传
    upload: function(obj){
        var _this=this;
        _this.data.upload_obj.obj.upload();
    },
    //停止
    stop: function(obj){
        var _this=this;
        _this.data.upload_obj.obj.stop();
    },
    //销毁
    destroy: function(obj){
        var _this=this;
        if(_this.data.upload_obj.obj){
            _this.data.upload_obj.obj.destroy();
        }
    },
    //文件被加入队列之前触发
    beforeFileQueued: function(obj){
        var _this=this;
        console.log("beforeFileQueued：文件被加入队列之前触发");
        console.log(obj);
        $(".webuploader-propress").show();
        var file_id = obj.file.id;
        var file_name = obj.file.name;
        var per = 0;
        var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
        if (curDom.length==0) {
            $(".webuploader-propress .webuploader-propress-ul").append('<div class="webuploader-propress-li" data-id="'+file_id+'">'+
                                                        '<div class="webuploader-propress-tl trpm-flex-y">'+
                                                            '<div class="webuploader-propress-lab">上传文件：</div>'+
                                                            '<div class="webuploader-propress-name">'+file_name+'</div>'+
                                                            '<div class="webuploader-propress-sta"></div>'+
                                                            '<div class="webuploader-propress-cancel">取消上传</div>'+
                                                        '</div>'+
                                                        '<div class="webuploader-propress-propress trpm-flex-y">'+
                                                            '<div class="webuploader-propress-lab">上传进度：</div>'+
                                                            '<div class="webuploader-propress-bar"><div class="webuploader-propress-per" style="width:'+per+'">'+per+'%</div></div>'+
                                                        '</div>'+
                                                    '</div>');
        }
        else{
            curDom.find(".webuploader-propress-per").css("width",per+"%").text(per+"%");
        }

        if (_this.data.upload_obj.callBack.beforeFileQueued && $.isFunction(_this.data.upload_obj.callBack.beforeFileQueued)) {
            _this.data.upload_obj.callBack.beforeFileQueued({"data":obj});
        }
    },
    //文件被加入队列以后触发
    fileQueued: function(obj){
        var _this=this;
        console.log("fileQueued：文件被加入队列以后触发");

        if (_this.data.upload_obj.callBack.fileQueued && $.isFunction(_this.data.upload_obj.callBack.fileQueued)) {
            _this.data.upload_obj.callBack.fileQueued({"data":obj});
        }
    },
    //文件被移除队列后触发
    fileDequeued: function(obj){
        var _this=this;
        console.log("fileDequeued：文件被移除队列后触发");
        console.log(obj);
        if (_this.data.upload_obj.callBack.fileDequeued && $.isFunction(_this.data.upload_obj.callBack.fileDequeued)) {
            _this.data.upload_obj.callBack.fileDequeued({"data":obj});
        }
    },
    //发送前触发，主要用来询问是否要添加附带参数
    uploadBeforeSend: function(obj){
        var _this=this;
        console.log("uploadBeforeSend：发送前触发，主要用来询问是否要添加附带参数");
        console.log(obj);
        if (_this.data.upload_obj.callBack.uploadBeforeSend && $.isFunction(_this.data.upload_obj.callBack.uploadBeforeSend)) {
            _this.data.upload_obj.callBack.uploadBeforeSend({"data":obj});
        }
    },
    //开始上传流程时触发
    startUpload: function(obj){
        var _this=this;
        console.log("startUpload：开始上传流程时触发");
        // $(".webuploader-propress").show();

        if (_this.data.upload_obj.callBack.startUpload && $.isFunction(_this.data.upload_obj.callBack.startUpload)) {
            _this.data.upload_obj.callBack.startUpload({"data":obj});
        }
    },
    //开始上传流程暂停时触发
    stopUpload: function(obj){
        var _this=this;
        console.log("stopUpload：开始上传流程暂停时触发");

        if (_this.data.upload_obj.callBack.stopUpload && $.isFunction(_this.data.upload_obj.callBack.stopUpload)) {
            _this.data.upload_obj.callBack.stopUpload({"data":obj});
        }
    },
    //所有文件上传结束时触发
    uploadFinished: function(obj){
        var _this=this;
        console.log("uploadFinished：所有文件上传结束时触发");
        if(_this.data.config_obj.propressSecond>0){
            setTimeout(function(){
                $(".webuploader-propress").hide();
                $(".webuploader-propress .webuploader-propress-ul").html('');
            },_this.data.config_obj.propressSecond);
        }

        if (_this.data.upload_obj.callBack.uploadFinished && $.isFunction(_this.data.upload_obj.callBack.uploadFinished)) {
            _this.data.upload_obj.callBack.uploadFinished({"data":obj});
        }
    },
    //不管成功或者失败，文件上传完成时触发。
    uploadComplete: function(obj){
        var _this=this;
        // console.log("uploadComplete：不管成功或者失败，文件上传完成时触发。");

        if (_this.data.upload_obj.callBack.uploadComplete && $.isFunction(_this.data.upload_obj.callBack.uploadComplete)) {
            _this.data.upload_obj.callBack.uploadComplete({"data":obj});
        }
    },
    //当文件上传成功时触发。
    uploadSuccess: function(obj){
        var _this=this;
        console.log("uploadSuccess：当文件上传成功时触发。");
        console.log(obj);
        var file_id = obj.file.id;
        $(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"] .webuploader-propress-sta").css("color","blue").text("上传成功");
        $(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"] .webuploader-propress-cancel").hide();
        
        if (_this.data.upload_obj.callBack.uploadSuccess && $.isFunction(_this.data.upload_obj.callBack.uploadSuccess)) {
            _this.data.upload_obj.callBack.uploadSuccess({"data":obj});
        }
    },
    //当文件上传出错时触发。
    uploadError: function(obj){
        var _this=this;
        console.log("uploadError：当文件上传出错时触发。");
        console.log(obj);
        var file_id = obj.file.id;
        var response = obj.response;
        $(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"] .webuploader-propress-sta").text("上传失败:"+response);

        if (_this.data.upload_obj.callBack.uploadError && $.isFunction(_this.data.upload_obj.callBack.uploadError)) {
            _this.data.upload_obj.callBack.uploadError({"data":obj});
        }
    },
    //上传进度
    uploadProgress: function(obj){
        console.log(obj);
        var _this=this;
        console.log("uploadProgress：上传进度");
        var file_id = obj.file.id;
        var file_name = obj.file.name;
        var per = (obj.percentage*100).toFixed(0);
        var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
        if (curDom.length>0) {
            curDom.find(".webuploader-propress-per").css("width",per+"%").text(per+"%");
        }

        if (_this.data.upload_obj.callBack.uploadProgress && $.isFunction(_this.data.upload_obj.callBack.uploadProgress)) {
            _this.data.upload_obj.callBack.uploadProgress({"data":obj});
        }
    },
    //错误报告
    error: function(obj){
        var _this=this;
        console.log("error：错误报告");
        console.log(obj);
        var file=obj.a;
        var type = obj.type,errorInfo="上传失败："+obj.type;
        if(type=="Q_TYPE_DENIED"){
            errorInfo="上传失败：文件类型不符合";
        }
        else if(type=="F_EXCEED_SIZE"){
            file=obj.b;
            errorInfo="上传失败：超出大小限制";
        }
        else if(type=="Q_EXCEED_NUM_LIMIT"){
            file=obj.b;
            errorInfo="上传失败：超出数量限制";
        }
        var file_id = file.id;
        var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
        curDom.attr("data-sta",type);
        curDom.find(".webuploader-propress-sta").text(errorInfo);

        if (_this.data.upload_obj.callBack.error && $.isFunction(_this.data.upload_obj.callBack.error)) {
            _this.data.upload_obj.callBack.error({"data":obj});
        }
    },
    //执行 0:上传  1:上传+公共/我的素材库  2:上传+公共素材库  3:上传+我的素材库  4:公共/我的素材库  5:公共素材库  6:我的素材库
    run: function(obj){
        var _this = this;
        if(obj){
            //修改初始参数
            _this.setInit(obj);
        }
        var type=_this.data.config_obj.type;
        // console.log("type："+type);
        if(type==0){
            // trpm_publicModule.alertMsg({"ty":0,"txt":"直接上传","second":2000});
        }
        else if(type==1){
            trpm_publicModule.alertSelect({
                "data":[
                    {"key":"上传","val":1},
                    {"key":"素材库","val":2},
                    {"key":"取消","val":0}
                ],
                "callBack":function(reData){
                    var elem=reData.elem;
                    $(elem).find(".trpm-li[val=0]").css("margin-top","10px");
                    $(elem).find(".trpm-li[val=1]").addClass("uploadBtn");
                    //添加按钮
                    _this.addButton({ 
                        "pick":{id: elem+" .uploadBtn",innerHTML:"",multiple:false}
                    });
                    //点击
                    $("body").on("click",elem+" .trpm-li",function(){
                        var thisObj=$(this)
                        var val=thisObj.attr("val");
                        if(val==0){
                            trpm_publicModule.alertRemove({"elem":elem});
                        }
                        else if(val==1){
                            trpm_publicModule.alertHide({"elem":elem});
                        }
                        else if(val==2){
                            trpm_publicModule.alertRemove({"elem":elem});
                            //素材库选择
                            _this.dom({"ty":1});
                        }
                    });
                }
            });
        }
        else if(type==2){
            trpm_publicModule.alertSelect({
                "data":[
                    {"key":"上传","val":1},
                    {"key":"公共素材库","val":2},
                    {"key":"取消","val":0}
                ],
                "callBack":function(reData){
                    var elem=reData.elem;
                    $(elem).find(".trpm-li[val=0]").css("margin-top","10px");
                    $(elem).find(".trpm-li[val=1]").addClass("uploadBtn");
                    //添加按钮
                    _this.addButton({ 
                        "pick":{id: elem+" .uploadBtn",innerHTML:"",multiple:false}
                    });
                    //点击
                    $("body").on("click",elem+" .trpm-li",function(){
                        var thisObj=$(this)
                        var val=thisObj.attr("val");
                        console.log("val"+val);
                        if(val==0){
                            trpm_publicModule.alertRemove({"elem":elem});
                        }
                        else if(val==1){
                            trpm_publicModule.alertHide({"elem":elem});
                        }
                        else if(val==2){
                            trpm_publicModule.alertRemove({"elem":elem});
                            //公共素材库
                            _this.dom({"ty":2});
                        }
                    });
                }
            });
        }
        else if(type==3){
            trpm_publicModule.alertSelect({
                "data":[
                    {"key":"上传","val":1},
                    {"key":"我的素材库","val":2},
                    {"key":"取消","val":0}
                ],
                "callBack":function(reData){
                    var elem=reData.elem;
                    $(elem).find(".trpm-li[val=0]").css("margin-top","10px");
                    $(elem).find(".trpm-li[val=1]").addClass("uploadBtn");
                    //添加按钮
                    _this.addButton({ 
                        "pick":{id: elem+" .uploadBtn",innerHTML:"",multiple:false}
                    });
                    //点击
                    $("body").on("click",elem+" .trpm-li",function(){
                        var thisObj=$(this)
                        var val=thisObj.attr("val");
                        console.log("val"+val);
                        if(val==0){
                            trpm_publicModule.alertRemove({"elem":elem});
                        }
                        else if(val==1){
                            trpm_publicModule.alertHide({"elem":elem});
                        }
                        else if(val==2){
                            trpm_publicModule.alertRemove({"elem":elem});
                            //我的素材库
                            _this.dom({"ty":3});
                        }
                    });
                }
            });
        }
        else if(type==4){
            //素材库选择
            _this.dom({"ty":1});
        }
        else if(type==5){
            //公共素材库
            _this.dom({"ty":2})
        }
        else if(type==6){
            //我的素材库
            _this.dom({"ty":3})
        }
    },
    //dom
    dom: function(obj){
        var _this = this;
        var ty=obj.ty; //{1:素材库选择 2:公共素材库 3:我的素材库 4:进度}
        if(obj.ty==1){
            var domHtml ='<div class="webuploader-material selBox">'+
                            '<div class="webuploader-material-mc">'+
                                '<div class="webuploader-material-top">'+
                                    '<div class="webuploader-material-col webuploader-material-lf" style="flex:none;"><span class="webuploader-material-backBtn webuploader-material-jt">返回</span></div>'+
                                    '<!--<div class="webuploader-material-col webuploader-material-rg"><span class="webuploader-material-okBtn">确定</span></div>-->'+
                                '</div>'+
                                '<div class="webuploader-material-ul">'+
                                    '<div class="webuploader-material-li" atr="1"><div class="webuploader-material-txt">公共素材库</div><div class="webuploader-material-jt"></div></div>'+
                                    '<div class="webuploader-material-li" atr="2"><div class="webuploader-material-txt">我的素材库</div><div class="webuploader-material-jt"></div></div>'+
                                '</div>'+
                            '</div>'+
                        '</div> ';
            $("body").append(domHtml);
            $(".webuploader-material.selBox").animate({ right: "0" }, 300,function(){});
            //关闭
            $(".webuploader-material.selBox").on("click",".webuploader-material-backBtn",function(){
                $(".webuploader-material.selBox").animate({ right: "-100%" }, 300,function(){});
            });
            //我的素材库
            $(".webuploader-material.selBox").on("click",".webuploader-material-li",function(){
                var atr=$(this).attr("atr");
                if(atr==1){
                    //公共素材库
                    _this.dom({"ty":2});
                }
                else if(atr==2){
                    //我的素材库
                    _this.dom({"ty":3});
                }
            });
        }
        else if(obj.ty==2){
            _this.data.publicMaterial_obj.params.pageIndex=1;
            var domHtml ='<div class="webuploader-material publicMaterial">'+
                            '<div class="webuploader-material-mc">'+
                                '<div class="webuploader-material-top">'+
                                    '<div class="webuploader-material-col webuploader-material-lf" style="flex:none;"><span class="webuploader-material-backBtn webuploader-material-jt">返回</span></div>'+
                                    '<div class="webuploader-material-col webuploader-material-rg"><span class="webuploader-material-okBtn">确定</span></div>'+
                                '</div>'+
                                '<div class="webuploader-material-list-box">'+
                                    '<div class="webuploader-material-scroll">'+
                                        '<div class="webuploader-material-list">'+
                                            '<!--<div class="webuploader-material-li" idd="1">'+
                                                '<div class="webuploader-material-gou"></div>'+
                                                '<img class="webuploader-material-img" src="'+_this.data.config_obj.resourcePublic+'/images/v_ktv.jpg"/>'+
                                            '</div>'+
                                            '<div class="webuploader-material-li ck" idd="2">'+
                                                '<div class="webuploader-material-gou"></div>'+
                                                '<img class="webuploader-material-img" src="'+_this.data.config_obj.resourcePublic+'/images/v_ktv.jpg"/>'+
                                            '</div>-->'+
                                        '</div>'+
                                        '<div class="webuploader-material-loadMore">下拉加载更多...</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div> ';
            $("body").append(domHtml);
            $(".webuploader-material.publicMaterial").animate({ right: "0" }, 300,function(){});
            //公共素材库
            _this.publicMaterial();
            //滚动加载下一页
            _this.pageScroll({"dom":".webuploader-material.publicMaterial"});
            //关闭
            $(".webuploader-material.publicMaterial").on("click",".webuploader-material-backBtn",function(){
                $(".webuploader-material.publicMaterial").animate({ right: "-100%" }, 300,function(){
                    $(".webuploader-material.privateMaterial").remove();
                });
            });
            //选择图片
            $(".webuploader-material.publicMaterial").on("click",".webuploader-material-li",function(){
                $(this).addClass("ck").siblings().removeClass("ck");
            });
            //确定
            $(".webuploader-material.publicMaterial").on("click",".webuploader-material-okBtn",function(){
                var ckObj=$(".webuploader-material.publicMaterial .ck");
                if(ckObj.length>0){
                    var id=ckObj.attr("idd");
                    var src=ckObj.attr("src");
                    var backParams={"type":2, "data":{"id":id,"src":src}};
                    if (_this.data.material_callBack && $.isFunction(_this.data.material_callBack)) {
                        _this.data.material_callBack(backParams);
                    }
                    $(".webuploader-material.selBox").remove();
                    $(".webuploader-material.publicMaterial").animate({ right: "-100%" }, 300,function(){
                        $(".webuploader-material.publicMaterial").remove();
                    });
                }
                else{
                    trpm_publicModule.alertMsg({"ty":0,"txt":"请先选择图片","second":2000});
                }
            });
        }
        else if(obj.ty==3){
            _this.data.privateMaterial_obj.params.pageIndex=1;
            var domHtml ='<div class="webuploader-material privateMaterial">'+
                            '<div class="webuploader-material-mc">'+
                                '<div class="webuploader-material-top">'+
                                    '<div class="webuploader-material-col webuploader-material-lf" style="flex:none;"><span class="webuploader-material-backBtn webuploader-material-jt">返回</span></div>'+
                                    '<div class="webuploader-material-col webuploader-material-rg"><span class="webuploader-material-okBtn">确定</span></div>'+
                                '</div>'+
                                '<div class="webuploader-material-list-box">'+
                                    '<div class="webuploader-material-scroll">'+
                                        '<div class="webuploader-material-list">'+
                                            '<!--<div class="webuploader-material-li" idd="1">'+
                                                '<div class="webuploader-material-gou"></div>'+
                                                '<img class="webuploader-material-img" src="'+_this.data.config_obj.resourcePublic+'/images/v_ktv.jpg"/>'+
                                            '</div>'+
                                            '<div class="webuploader-material-li .ck" idd="2">'+
                                                '<div class="webuploader-material-gou"></div>'+
                                                '<img class="webuploader-material-img" src="'+_this.data.config_obj.resourcePublic+'/images/v_ktv.jpg"/>'+
                                            '</div>-->'+
                                        '</div>'+
                                        '<div class="webuploader-material-loadMore">下拉加载更多...</div>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div> ';
            $("body").append(domHtml);
            $(".webuploader-material.privateMaterial").animate({ right: "0" }, 300,function(){});
            //私有素材库
            _this.privateMaterial();
            //滚动加载下一页
            _this.pageScroll({"dom":".webuploader-material.privateMaterial"});
            //关闭
            $(".webuploader-material.privateMaterial").on("click",".webuploader-material-backBtn",function(){
                $(".webuploader-material.privateMaterial").animate({ right: "-100%" }, 300,function(){
                    $(".webuploader-material.privateMaterial").remove();
                });
            });
            //选择图片
            $(".webuploader-material.privateMaterial").on("click",".webuploader-material-li",function(){
                $(this).addClass("ck").siblings().removeClass("ck");
            });
            //确定
            $(".webuploader-material.privateMaterial").on("click",".webuploader-material-okBtn",function(){
                var ckObj=$(".webuploader-material.privateMaterial .ck");
                if(ckObj.length>0){
                    var id=ckObj.attr("idd");
                    var src=ckObj.attr("src");
                    var backParams={"type":3, "data":{"id":id,"src":src}};
                    if (_this.data.material_callBack && $.isFunction(_this.data.material_callBack)) {
                        _this.data.material_callBack(backParams);
                    }
                    $(".webuploader-material.selBox").remove();
                    $(".webuploader-material.privateMaterial").animate({ right: "-100%" }, 300,function(){
                        $(".webuploader-material.privateMaterial").remove();
                    });
                }
                else{
                    trpm_publicModule.alertMsg({"ty":0,"txt":"请先选择图片","second":2000});
                }
            });
        }
        else if(obj.ty==4){
            var domHtml ='<div class="webuploader-propress">'+
                            '<div class="webuploader-propress-x">+</div>'+
                            '<div class="webuploader-propress-mc trpm-flex-xy">'+
                                '<div class="webuploader-propress-ul">'+
                                    '<!--<div class="webuploader-propress-li" data-id="1">'+
                                        '<div class="webuploader-propress-tl trpm-flex-y">'+
                                            '<div class="webuploader-propress-lab">上传文件：</div>'+
                                            '<div class="webuploader-propress-name"></div>'+
                                            '<div class="webuploader-propress-sta"></div>'+
                                            '<div class="webuploader-propress-cancel">取消上传</div>'+
                                        '</div>'+
                                        '<div class="webuploader-propress-propress trpm-flex-y">'+
                                            '<div class="webuploader-propress-lab">上传进度：</div>'+
                                            '<div class="webuploader-propress-bar"><div class="webuploader-propress-per">0%</div></div>'+
                                        '</div>'+
                                    '</div>-->'+
                                '</div>'+
                            '</div>'+
                        '</div> ';
            $("body").append(domHtml);
            //关闭
            $(".webuploader-propress").on("click",".webuploader-propress-x",function(){
                var thisObj=$(this);
                $(".webuploader-propress").hide();
                $(".webuploader-propress .webuploader-propress-ul").html('');
            });
            //取消上传
            $(".webuploader-propress").on("click",".webuploader-propress-cancel",function(){
                var thisObj=$(this);
                var curDom=thisObj.parents(".webuploader-propress-li");
                var file_id=curDom.attr("data-id");
                var sta=curDom.attr("data-sta");
                if(!sta){
                    _this.data.upload_obj.obj.cancelFile( file_id );
                }
                curDom.remove();
                var cou=$(".webuploader-propress .webuploader-propress-li").length;
                if(cou==0){
                    $(".webuploader-propress").hide();
                }
            });
        }
    },
    //公共素材库
    publicMaterial: function(obj){
        var _this=this;
        var params=_this.data.publicMaterial_obj;
        var paramsObj={
            "type" : "GET",
            "url" : _this.data.publicMaterial_obj.url,
            "params" : _this.data.publicMaterial_obj.params,
            "callBack" : function(reParams){
                var listObj = $(".webuploader-material.publicMaterial");
                var params=reParams.params;
                var pageIndex = params.pageIndex;
                var pageSize=params.pageSize;
                var reData=reParams.data;
                if(reData.status==1){
                    var count = reData.count;
                    var totalPage = reData.totalPage;
                    var total = reData.total;
                    // console.log("pageIndex:"+pageIndex+"，totalPage:"+totalPage+"，total:"+total+"，count:"+count);
                    if(count==0){
                        listObj.find(".webuploader-material-list").html('');
                        listObj.find(".webuploader-material-loadMore").html('').hide();
                        return false;
                    }
                    if(totalPage > 1){
                        listObj.find(".webuploader-material-list-box").attr("isMore","1");
                        if(pageIndex==totalPage) {
                            listObj.find(".webuploader-material-list-box").attr("isMore","0");
                        }
                    }
                    else {
                        listObj.find(".webuploader-material-list-box").attr("isMore","0");
                    }
                    pageIndex++;
                    _this.data.publicMaterial_obj.params.pageIndex=pageIndex;

                    var listHtml="";
                    var list=reData.data;
                    var cou=list.length;
                    for(var i=0; i<list.length; i++){
                        var curObj = list[i];
                        var id = curObj.id;
                        _this.data.publicMaterial_obj.data[id]=curObj;
                        var image_url = curObj.url;
                        listHtml +='<div class="webuploader-material-li" idd="'+id+'" src="'+image_url+'">'+
                                        '<div class="webuploader-material-gou"></div>'+
                                        '<img class="webuploader-material-img" src="'+image_url+'"/>'+
                                    '</div>';
                    }
                    if(cou>0){
                        listObj.find(".webuploader-material-list").append(listHtml);
                    }
                }
                else{
                    // console.log(reData.info);
                }
            },
            "errorBack" : function(reParams){
                trpm_publicModule.alertMsg({"ty":0,"txt":reData.info,"second":2000});
            }
        };
        trpm_publicModule.ajax(paramsObj);
    },
    //私有素材库
    privateMaterial: function(obj){
        var _this=this;
        var params=_this.data.privateMaterial_obj;
        var paramsObj={
            "type" : "GET",
            "url" : _this.data.privateMaterial_obj.url,
            "params" : _this.data.privateMaterial_obj.params,
            "callBack" : function(reParams){
                var listObj = $(".webuploader-material.privateMaterial");
                var params=reParams.params;
                var pageIndex = params.pageIndex;
                var pageSize=params.pageSize;
                var reData=reParams.data;
                if(reData.status==1){
                    var count = reData.count;
                    var totalPage = reData.totalPage;
                    var total = reData.total;
                    // console.log("pageIndex:"+pageIndex+"，totalPage:"+totalPage+"，total:"+total+"，count:"+count);
                    if(count==0){
                        listObj.find(".webuploader-material-list").html('');
                        listObj.find(".webuploader-material-loadMore").html('').hide();
                        return false;
                    }
                    if(totalPage > 1){
                        listObj.find(".webuploader-material-list-box").attr("isMore","1");
                        if(pageIndex==totalPage) {
                            listObj.find(".webuploader-material-list-box").attr("isMore","0");
                        }
                    }
                    else {
                        listObj.find(".webuploader-material-list-box").attr("isMore","0");
                    }
                    pageIndex++;
                    _this.data.privateMaterial_obj.params.pageIndex=pageIndex;

                    var listHtml="";
                    var list=reData.data;
                    var cou=list.length;
                    for(var i=0; i<list.length; i++){
                        var curObj = list[i];
                        var id = curObj.id;
                        _this.data.privateMaterial_obj.data[id]=curObj;
                        var image_url = curObj.url;
                        listHtml +='<div class="webuploader-material-li" idd="'+id+'" src="'+image_url+'">'+
                                        '<div class="webuploader-material-gou"></div>'+
                                        '<img class="webuploader-material-img" src="'+image_url+'"/>'+
                                    '</div>';
                    }
                    if(cou>0){
                        listObj.find(".webuploader-material-list").append(listHtml);
                    }
                }
                else{
                    // console.log(reData.info);
                }
            },
            "errorBack" : function(reParams){
                trpm_publicModule.alertMsg({"ty":0,"txt":reData.info,"second":2000});
            }
        };
        trpm_publicModule.ajax(paramsObj);
    },
    //滚动加载下一页
    pageScroll: function(obj){
        var _this=this;
        var dom=obj.dom;
        $(dom).find(".list-box").scroll(function () {
            var thisObj=$(this);
            var scrollTop = thisObj.scrollTop();
            var boxHeight = thisObj.height();
            var listBoxHeight = $(dom).find(".webuploader-material-list-box .webuploader-material-scroll").height();
            // console.log(scrollTop+"--"+boxHeight+"--"+listBoxHeight);
            if (scrollTop + boxHeight >= listBoxHeight) {
                var isMore=thisObj.attr("isMore");
                if(isMore=="1"){
                    //下一页
                    thisObj.find(".webuploader-material-loadMore").html("加载中...").show();
                    if(dom==".webuploader-material.publicMaterial"){
                        _this.publicMaterial();
                    }
                    else if(dom==".webuploader-material.privateMaterial"){
                        _this.privateMaterial();
                    }
                }
                else {
                    thisObj.find(".webuploader-material-loadMore").html("已加载所有").show();
                }
            }
        });
    }
}

/*初始化上传示例 注释部分非必传
trpm_webuploaderOptionModule.init({
    // "config":{
    //     "resourcePublic":paramObj.resourcePublic,
    //     "type":0,
    // },
    // "upload_option":{
    //     "server":'/p/'+paramObj.pool+'/Wasee/Index/doUploadSpecialImage?type=1&method=1',
    //     "pick": { id: ".base-d .user-img", innerHTML: "" ,"multiple":false},
    //     "compress":{
    //         "width": 1600,
    //         "height": 1600,
    //         "crop": false, //是否允许裁剪。
    //         "compressSize": 0, //单位字节，如果图片大小小于此值，不会采用压缩。
    //     }
    // },
    // "publicMaterial": {
    //     "url":'/p/'+paramObj.pool+'/Wasee/Base/getPublicResourceList',
    //     "params":{
    //         "type":1
    //     }
    // },
    // "privateMaterial": {
    //     "url":'/p/'+paramObj.pool+'/Wasee/Index/getResourceList',
    //     "params":{
    //         "type":1
    //     }
    // },
    // "callBack": function () {
    //     //添加按钮(无素材库是需要提前添加按钮)
    //     trpm_webuploaderOptionModule.addButton({
    //         "pick":{id: ".base-d .user-img",innerHTML: "",multiple: false},
    //         "callBack": function () {}
    //     });
    // },
    // "upload_callBack": {
    //     "fileQueued": function(bkData){},
    //     "uploadSuccess": function(bkData){},
    //     "uploadError": function(bkData){},
    //     "uploadProgress": function(bkData){}
    // },
    // "material_callBack": function (bkData) {
    //     console.log(bkData);
    //     console.log(123);
    // }
});*/
/*执行上传示例 注释部分非必传
trpm_webuploaderOptionModule.run({
    // "config":{
    //     "type":0,
    // },
    // "upload_option":{
    //     "server":'/p/'+paramObj.pool+'/Wasee/Index/doUplboadSpecialImage?type=1&method=1',
    //     "formData":{"c":2},
    // },
    // "upload_callBack": {
    //     "fileQueued": function(bkData){},
    //     "uploadSuccess": function(bkData){},
    //     "uploadError": function(bkData){},
    // }
});*/
