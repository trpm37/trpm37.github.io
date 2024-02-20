/**
* Author: 倘若飘邈 
* <940461709@qq.com> <微信jiao_ao8>
*/

//先引入webuploader.css和webuploader.min.js
(function() {
    function Trpm_webuploaderModule(obj) {
        var _this = this;
        _this.data={
            "window_w": $(window).outerWidth(true),
            "window_h": $(window).outerHeight(true),
            "userAgent":null, //当前设备
            "eventName":"click", //事件名称
            "public_path":trpm_publicModule.data.public_path,
            "isInit":false, //从新设置上传参数时是否初始化
            "propressShow":true, //是否显示进度
            "propressCloseTime":1000, //进度关闭时间单位毫秒
            "upload_obj":null,//上传对象
            "upload_option":{}, //上传配置项
            "upload_fileQueued": function(bkData){}, //当文件被加入队列以后触发
            "uploadBeforeSend": function(bkData){}, //发送前触发主要用来询问是否要添加附带参数
            "upload_uploadSuccess": function(bkData){}, //当文件上传成功时触发
        }
        _this.data.userAgent=trpm_publicModule.userAgent();
        if(_this.data.userAgent.mobile){
            _this.data.eventName="touchend";
        }
        // Object.assign(this.data, obj);
        $.extend(true,this.data, obj);

        //导入文件
        _this.import_file({
            "callBack": function(){
                // 上传初始化
                _this.uploadInit();
            }
        });
    }

    Trpm_webuploaderModule.prototype = {
        constructor: Trpm_webuploaderModule,
        //导入文件
        import_file: function(obj){
            var _this=this;
            //导入css
            trpm_publicModule.loadCsss({
                "files":[
                    {"id":"webuploader_css","href":_this.data.public_path+'/trpm/webuploader/lib/webuploader1.1.css?ver='+new Date().getTime()},
                ],
                "callBack":function(){
                    // console.log("webuploader.css已加载");
                }
            });
            //导入js
            trpm_publicModule.loadScripts({
                "files":[
                    {"id":"webuploader_script","verify_var":"WebUploader","url":_this.data.public_path+'/trpm/webuploader/lib/webuploader.min.js?ver='+new Date().getTime()}
                ],
                "callBack":function(){
                    // console.log("webuploader.js已加载");
                    //回调
                    if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                        obj.callBack();
                    }
                }
            });
        },
        //上传初始化
        uploadInit: function(obj) {
            var _this=this;
            var option={
                auto: true, // 选完文件后，是否自动上传
                swf: _this.data.public_path+'/trpm/webuploader/lib/Uploader.swf', // swf文件路径
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
                _this.data.upload_option=$.extend(true,option, obj);
            }
            else{
                _this.data.upload_option=$.extend(true,option, _this.data.upload_option);
            }
            _this.data.upload_obj = WebUploader.create(_this.data.upload_option);
            //上传回调事件
            _this.uploadEvents();
            //进度
            _this.dom({"ty":1})
        },
        //上传回调事件
        uploadEvents: function(){
            var _this=this;
            //文件被加入队列之前触发，此事件的handler返回值为false，则此文件不会被添加进入队列
            _this.data.upload_obj.on( 'beforeFileQueued', function( file) {
                // console.log({"beforeFileQueued":"文件被加入队列之前触发","file":file});
                if(_this.data.propressShow){
                    $(".webuploader-propress").show();
                }
                var file_id = file.id;
                var file_name = file.name;
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
                                                                    '<div class="webuploader-propress-lab">上传速度：</div>'+
                                                                    '<div class="webuploader-propress-bar">'+
                                                                        '<div class="webuploader-propress-per" style="width:'+per+'"></div>'+
                                                                        '<div class="webuploader-propress-txt">'+per+'%</div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>');
                }
                else{
                    curDom.find(".webuploader-propress-per").css("width",per+"%");
                    curDom.find(".webuploader-propress-txt").html(per+"%");
                }

                if (_this.data.upload_beforeFileQueued && $.isFunction(_this.data.upload_beforeFileQueued)) {
                    _this.data.upload_beforeFileQueued({"file":file});
                }
            });
            //文件被加入队列以后触发
            _this.data.upload_obj.on( 'fileQueued', function( file ) {
                // console.log({"fileQueued":"文件被加入队列以后触发","file":file});
                if (_this.data.upload_fileQueued && $.isFunction(_this.data.upload_fileQueued)) {
                    _this.data.upload_fileQueued({"file":file});
                }
            });
            //当一批文件添加进队列以后触发。
            _this.data.upload_obj.on( 'filesQueued', function( file ) {
                // console.log({"filesQueued":"当一批文件添加进队列以后触发。","file":file});
                if (_this.data.upload_filesQueued && $.isFunction(_this.data.upload_filesQueued)) {
                    _this.data.upload_filesQueued({"file":file});
                }
            });
            //文件被移除队列后触发
            _this.data.upload_obj.on( 'fileDequeued', function( file ) {
                // console.log({"fileDequeued":"文件被移除队列后触发","file":file});
                if (_this.data.upload_fileDequeued && $.isFunction(_this.data.upload_fileDequeued)) {
                    _this.data.upload_fileDequeued({"file":file});
                }
            });
            //发送前触发主要用来询问是否要添加附带参数
            _this.data.upload_obj.on( 'uploadBeforeSend', function( obj,data,headers ) {
                // console.log({"uploadBeforeSend":"发送前触发主要用来询问是否要添加附带参数","obj":obj,"data":data,"headers":headers});
                if (_this.data.upload_uploadBeforeSend && $.isFunction(_this.data.upload_uploadBeforeSend)) {
                    _this.data.upload_uploadBeforeSend({"obj":obj,"data":data,"headers":headers});
                }
            });
            //开始上传流程时触发
            _this.data.upload_obj.on( 'startUpload', function( ) {
                // console.log({"startUpload":"开始上传流程时触发"});
                if (_this.data.upload_startUpload && $.isFunction(_this.data.upload_startUpload)) {
                    _this.data.upload_startUpload({});
                }
            });
            //开始上传流程暂停时触发
            _this.data.upload_obj.on( 'stopUpload', function( ) {
                // console.log({"stopUpload":"开始上传流程暂停时触发"});
                if (_this.data.upload_stopUpload && $.isFunction(_this.data.upload_stopUpload)) {
                    _this.data.upload_stopUpload({});
                }
            });
            //某个文件开始上传前触发，一个文件只会触发一次
            _this.data.upload_obj.on( 'uploadStart', function( file ) {
                // console.log({"uploadStart":"某个文件开始上传前触发，一个文件只会触发一次","file":file});
                if (_this.data.upload_uploadStart && $.isFunction(_this.data.upload_uploadStart)) {
                    _this.data.upload_uploadStart({"file":file});
                }
            });
            //所有文件上传结束时触发
            _this.data.upload_obj.on( 'uploadFinished', function( ) {
                // console.log({"uploadFinished":"所有文件上传结束时触发"});
                if(_this.data.propressCloseTime>0){
                    setTimeout(function(){
                        $(".webuploader-propress").hide();
                        $(".webuploader-propress .webuploader-propress-ul").html('');
                    },_this.data.propressCloseTime);
                }

                if (_this.data.upload_uploadFinished && $.isFunction(_this.data.upload_uploadFinished)) {
                    _this.data.upload_uploadFinished({});
                }
            });
            //文件上传成功时触发
            _this.data.upload_obj.on( 'uploadSuccess', function( file , response ) {
                // console.log({"uploadSuccess":"文件上传成功时触发","file":file,"response":response});
                var file_id = file.id;
                $(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"] .webuploader-propress-sta").css("color","#5085fb").text("上传成功");
                $(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"] .webuploader-propress-cancel").hide();
                
                if (_this.data.upload_uploadSuccess && $.isFunction(_this.data.upload_uploadSuccess)) {
                    _this.data.upload_uploadSuccess({"file":file,"response":response});
                }
            });
            //不管成功或者失败，文件上传完成时触发
            _this.data.upload_obj.on( 'uploadComplete', function( file ) {
                // console.log({"uploadComplete":"不管成功或者失败，文件上传完成时触发","file":file});
                if (_this.data.upload_uploadComplete && $.isFunction(_this.data.upload_uploadComplete)) {
                    _this.data.upload_uploadComplete({"file":file});
                }
            });
            //上传进度，上传过程中触发
            _this.data.upload_obj.on( 'uploadProgress', function( file, percentage ) {
                // console.log({"uploadProgress":"上传进度，上传过程中触发","file":file,"percentage":percentage});
                var file_id = file.id;
                var file_name = file.name;
                var file_size = (file.size/1024/1024).toFixed(2);
                var per = (percentage*100).toFixed(0);
                var mb = (file_size*percentage).toFixed(2);
                let curTime=new Date();
                if(!file.startTime){
                    file.startTime=curTime
                    file.endTime=curTime;
                }
                else{
                    file.endTime=curTime;
                }
                var per_mb=mb;
                if(file.endTime.getTime()>file.startTime.getTime()){
                    per_mb=(mb/((file.endTime.getTime()-file.startTime.getTime())/1000)).toFixed(2);
                }
                var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
                if (curDom.length>0) {
                    curDom.find(".webuploader-propress-per").css("width",per+"%");
                    curDom.find(".webuploader-propress-txt").html("大小："+mb+"MB/"+file_size+"MB &nbsp;&nbsp;&nbsp;&nbsp;上传速度："+per_mb+"MB/s");
                }
                if (_this.data.upload_uploadProgress && $.isFunction(_this.data.upload_uploadProgress)) {
                    _this.data.upload_uploadProgress({"file":file,"percentage":percentage});
                }
            });
            //文件上传出错时触发
            _this.data.upload_obj.on( 'uploadError', function( file, reason ) {
                // console.log({"uploadError":"文件上传出错时触发","file":file,"reason":reason});
                var file_id = file.id;
                var file_size = (file.size/1024/1024).toFixed(2);
                var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
                curDom.find(".webuploader-propress-sta").text("上传失败:"+reason);
                curDom.find(".webuploader-propress-txt").html("大小：0MB/"+file_size+"MB");

                if (_this.data.upload_uploadError && $.isFunction(_this.data.upload_uploadError)) {
                    _this.data.upload_uploadError({"file":file,"reason":reason});
                }
            });
            //错误报告
            _this.data.upload_obj.on( 'error', function( type, a, b ) {
                // console.log({"error":"错误报告","type":type,"a":a,"b":b});
                var file=a;
                var errorInfo="上传失败："+type;
                if(type=="Q_TYPE_DENIED"){
                    errorInfo="上传失败：文件类型不符合";
                }
                else if(type=="F_EXCEED_SIZE"){
                    file=b;
                    errorInfo="上传失败：超出大小限制";
                }
                else if(type=="Q_EXCEED_NUM_LIMIT"){
                    file=b;
                    errorInfo="上传失败：超出数量限制";
                }
                var file_id = file.id;
                var curDom=$(".webuploader-propress .webuploader-propress-li[data-id="+file_id+"]");
                curDom.attr("data-sta",type);
                curDom.find(".webuploader-propress-sta").text(errorInfo);
                curDom.find(".webuploader-propress-txt").html(errorInfo);

                if (_this.data.upload_error && $.isFunction(_this.data.upload_error)) {
                    _this.data.upload_error({"type":type,"a":a,"b":b});
                }
            });
        },
        //设置参数
        setOption: function(obj){
            var _this = this;
            // Object.assign(this.data, obj);
            $.extend(true,this.data, obj);
            if(obj.upload_option){
                if(_this.data.isInit){
                    //销毁
                    _this.destroy();
                    //上传初始化
                    _this.uploadInit();
                }
                else{
                    for(var key in obj.upload_option){
                        var val=obj.upload_option[key];
                        _this.data.upload_obj.option(key,val);
                    }
                }
            }  
        },
        //添加上传按钮
        addButton: function(obj){
            var _this=this;
            var pick=obj.pick;
            var pick_id=pick.id;
            if(obj.hideBtn){
                    var timestamp = new Date().getTime();
                    var new_pick_id="webuploader-upBtn"+timestamp;
                    $("body").append('<div class="webuploader-upBtn" id="'+new_pick_id+'" style="display:none;"></div>');
                    pick.id="#"+new_pick_id;
                    _this.data.upload_obj.addButton(pick);
                    //绑定事件
                    $("body").on(_this.data.eventName, pick_id, function(){
                        $("#"+new_pick_id+" input[type=file][name=file]").click();
                    });
            }
            else{
                _this.data.upload_obj.addButton(pick);
            }

            if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                obj.callBack({"pick":pick});
            }
        },
        //开始上传
        upload: function(obj){
            var _this=this;
            if(_this.data.upload_obj){
                _this.data.upload_obj.upload();
            }
        },
        //停止上传
        stop: function(obj){
            var _this=this;
            if(_this.data.upload_obj){
                _this.data.upload_obj.stop();
            }
        },
        //销毁
        destroy: function(obj){
            var _this=this;
            if(_this.data.upload_obj){
                _this.data.upload_obj.destroy();
            }
        },
        //dom
        dom: function(obj){
            var _this = this;
            var ty=obj.ty; //{1:进度}
            if(obj.ty==1){
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
                                                '<div class="webuploader-propress-lab">上传速度：</div>'+
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
                        _this.data.upload_obj.cancelFile( file_id );
                    }
                    curDom.remove();
                    var cou=$(".webuploader-propress .webuploader-propress-li").length;
                    if(cou==0){
                        $(".webuploader-propress").hide();
                    }
                });
            }
        },
    }

    window.Trpm_webuploaderModule=Trpm_webuploaderModule;
}());

//实例
// var uploadObj = new Trpm_webuploaderModule({
//     "upload_option":{
//         "server":'/p/'+_this.data.pool+'/Wasee/Index/doUploadResource?type=1&method=1',
//         "pick": { id: "#material-img .btn-up .bk"}
//     },
//     "upload_uploadSuccess": function(bkData){
//         console.log(bkData);
//     }
// });
//添加按钮
// uploadObj.addButton({
//     "hideBtn":false,
//     "pick":{id: ".base-d .user-img",innerHTML: "",multiple: false},
//     "callBack": function () {}
// });