
var webuploaderModule={
    data: {
        "window_w": $(window).innerWidth(),
        "window_h": $(window).innerHeight(),
        "upload_obj": {},
        "upload_option":{}, //上传配置项  
    },
    //上传初始化
    init: function(obj) {
        var _this=this;
        
        $(function(){

            //初始化按钮上传
            _this.uploadInit();

            //修改参数
            $("#upBtn2").click(function(){
                _this.setInit({
                    "upload_option":{
                        "formData": { "ty": "logo_img"},
                        "accept": {
                            "title": '视频',
                            extensions: 'jpg',
              // mimeTypes: 'image/*'
              mimeTypes: 'image/jpeg,image/gif'
                        },
                        "pick":{id: "#upBtn1",innerHTML: "修改了参数",multiple: false},
                    }
                });
            });

            //添加上传按钮
            $("#addBtn1").click(function(){
                _this.addButton({
                    "hideBtn":false,
                    "pick":{id: '#upBtn2',innerHTML: '新加上传按钮'},
                    "callBack": function () {}
                });
            });
        
            //添加图片上传按钮
            $("#addBtn2").click(function(){
                _this.addButton({
                    "hideBtn":false,
                    "pick":{id: '#upImg1',innerHTML: ''},
                    "callBack": function () {}
                });
            });
        
            //添加隐藏上传按钮
            $("#addBtn3").click(function(){
                _this.addButton({
                    "hideBtn":true,
                    "pick":{id: '#upBtn3',innerHTML: '新加隐藏上传按钮'},
                    "callBack": function () {}
                });
            });
        
        });
    },
    //上传初始化
    uploadInit: function(obj) {
        console.log("上传初始化");
        var _this=this;
        var option={
            auto: false, // 选完文件后，是否自动上传
            swf: 'lib/Uploader.swf', // swf文件路径
            server: "upload.php", // 文件接收服务端
            formData: {}, //上传请求参数
            method: "POST", //文件上传方式，POST或者GET。
            pick: {id: "#upBtn1", innerHTML: "本地上传图片", multiple: false}, // 指定选择文件的按钮容器,multiple {Boolean} 是否开起同时选择多个文件能力
            // 只允许选择图片文件。
            accept: {
                title: '图片',
                extensions: 'jpg',
                mimeTypes: 'image/jpg'
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
        console.log(_this.data.upload_option);
        _this.data.upload_obj = WebUploader.create(_this.data.upload_option);
        
        _this.data.upload_obj.on( 'dndAccept', function( items ) {
            console.log(items);
            console.log('dndAccept');
        });
        
        _this.data.upload_obj.on( 'beforeFileQueued', function( file ) {
            console.log(file);
            console.log('beforeFileQueued');
        });
        
        _this.data.upload_obj.on( 'fileQueued', function( file ) {
            console.log(file);
            console.log('fileQueued');
        });
        
        _this.data.upload_obj.on( 'fileDequeued', function( file ) {
            console.log(file);
            console.log('fileDequeued');
        });
        
        _this.data.upload_obj.on( 'startUpload', function( file ) {
            console.log(file);
            console.log('startUpload');
        });
        
        _this.data.upload_obj.on( 'uploadStart', function( file ) {
            console.log(file);
            console.log('uploadStart');
        });
        
        _this.data.upload_obj.on( 'uploadSuccess', function( file ) {
            console.log(file);
            console.log('uploadSuccess已上传');
        });
        
        _this.data.upload_obj.on( 'uploadError', function( file ) {
            console.log(file);
            console.log('uploadError上传出错');
        });
        
        _this.data.upload_obj.on( 'uploadComplete', function( file ) {
            console.log(file);
            console.log('uploadComplete');
        });
        
        _this.data.upload_obj.on( 'error', function( str ) {
            console.log(str);
            console.log('error');
        });
    },
    //设置参数
    setInit: function(obj){
        var _this = this;
        // Object.assign(this.data, obj);
        $.extend(true,this.data, obj);

        if(obj.upload_option){
            for(var key in obj.upload_option){
                var val=obj.upload_option[key];
                _this.data.upload_obj.option(key,val);
            }
            //销毁
            _this.destroy();
            //初始化按钮上传
            _this.uploadInit();
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
                console.log(pick);
                _this.data.upload_obj.addButton(pick);
                //绑定事件
                $("body").on("click", pick_id, function(){
                    console.log("点击了");
                    // $("#"+new_pick_id).click();
                    $("#"+new_pick_id+" input[type=file][name=file]").click();
                });
        }
        else{
            _this.data.upload_obj.addButton(pick);
        }

        if (obj && obj.callBack && $.isFunction(obj.callBack)) {
            obj.callBack();
        }
    },
    //上传
    upload: function(obj){
        var _this=this;
        _this.data.upload_obj.upload();
    },
    //销毁
    destroy: function(obj){
        var _this=this;
        if(_this.data.upload_obj){
            _this.data.upload_obj.destroy();
        }
    }
}
//初始化
webuploaderModule.init();