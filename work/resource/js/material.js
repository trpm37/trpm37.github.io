/**
* Author: 倘若飘邈 
* <940461709@qq.com> <微信jiao_ao8>
*/

(function(){
    //加载数据
    function Load_data(obj){
        var _this = this;
        _this.data=$.extend({
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
    
    function materialModule(obj) {
        var _this = this;
        _this.data={
            "userAgent":null,
            "eventName":"click",
            "resourcePublic":paramObj.resourcePublic,
            "resourceWasee":paramObj.resourceWasee,
            "icon_load": paramObj.resourcePublic+"/images/loading2.gif",
            "loadFile":false,//文件是否加载完成
            "ty":121, //121:全景图130:全景视频23030:图片23031:视频
            "load_panoCls":null,
            "load_panoVideoCls":null,
            "load_imgCls":null,
            "load_videoCls":null,
            "load_pano":null,
            "load_panoVideo":null,
            "load_img":null,
            "load_video":null,
            "data_pano":null,
            "data_panoVideo":null,
            "data_img":null,
            "data_video":null,
            "check":0, //0单选 1多选
            "check_data":{},//选中数据
            "ids":[],//默认选中数据
            "ok_callBack": function(bkData){}, //确定回调
        }
        _this.data.userAgent=trpm_publicModule.userAgent();
        if(_this.data.userAgent.mobile){
            _this.data.eventName="touchend";
        }
        if(obj){
            // Object.assign(this.data, obj);
            $.extend(true,this.data, obj);
        }

        //导入文件
        _this.import_file({
            "callBack": function(){
                _this.data.loadFile=true;
            }
        });
    }

    materialModule.prototype = {
        constructor: materialModule,
        //导入文件
        import_file: function(obj){
            var _this=this;
            //导入css
            trpm_publicModule.loadCsss({
                "files":[
                    {"id":"resource_css","href":_this.data.resourcePublic+'/trpm/resource/css/resource.css?ver='+new Date().getTime()},
                ],
                "callBack":function(){
                    // console.log("css已加载");
                }
            });
            //导入js
            trpm_publicModule.loadScripts({
                "files":[
                    {"id":"nicescroll_script","url":_this.data.resourcePublic+'/trpm/jquery-nicescroll/jquery.nicescroll.min.js'}
                ],
                "callBack":function(){
                    console.log("nicescroll_script已加载");
                    //回调
                    if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                        obj.callBack();
                    }
                }
            });
        },
        //设置参数
        setParams: function(obj){
            var _this=this;
            _this.data=$.extend(_this.data, obj);
        },
        //dom
        alert: function(obj){
            var _this=this;
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
                _this.data.check_data={};
                _this.data.ids=[];
                if(obj){
                    _this.data=$.extend(_this.data, obj);
                }
                let ty=_this.data.ty;
                $("#resource-alert").remove();
                try {
                    var domHtml='<div class="trpm-alert resource-alert" id="resource-alert">'+
                                    '<div class="trpm-bk"></div>'+
                                    '<div class="trpm-flex trpm-mc">'+
                                        '<div class="trpm-x">'+
                                            '<span class="trpm-flex-xy">'+
                                                '<span class="icon-d">'+
                                                    '<i class="iconfont icon_close"></i>'+
                                                '</span>'+
                                            '</span>'+
                                        '</div>'+
                                        '<div class="trpm-tl">'+
                                            '<div class="tag">'+
                                                '<span class="sp trpm-none" data-ty="121">全景图</span>'+
                                                '<span class="sp trpm-none" data-ty="130">全景视频</span>'+
                                                '<span class="sp trpm-none" data-ty="23030">图片</span>'+
                                                '<span class="sp trpm-none" data-ty="23031">视频</span>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="trpm-flex m-d">'+
                                            '<div class="lf">'+
                                                '<div class="tree-boxs">'+
                                                    '<div class="tree-box pano-tree trpm-none" data-ty="121">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="tree-box panoVideo-tree trpm-none" data-ty="130">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="tree-box img-tree trpm-none" data-ty="23030">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                    '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">默认分组</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="tree-box video-tree trpm-none" data-ty="23031">'+
                                                        '<div class="tree-uls scroll">'+
                                                            '<div class="tree-ul tree-one-ul">'+
                                                                '<div class="tree-li">'+
                                                                    '<div class="tree-tl active" data-id="-1" data-arrow="1" data-ajax="1">'+
                                                                        '<div class="tl-lf">'+
                                                                            '<i class="iconfont icon_rightm arrow trpm-none"></i>'+
                                                                            '<i class="folder"></i>'+
                                                                            '<span class="txt">全部</span>'+
                                                                        '</div>'+
                                                                        '<div class="tl-rg">'+
                                                                            '<span class="cou">0</span>'+
                                                                        '</div>'+
                                                                        '<div class="striped trpm-none"></div>'+
                                                                    '</div>'+
                                                                '</div>'+
                                                                '<div class="tree-tl" data-id="0" data-arrow="1" data-ajax="0">'+
                                                                    '<div class="tl-lf">'+
                                                                        '<i class="iconfont icon_rightm arrow trpm-none"></i>'+
                                                                        '<i class="folder"></i>'+
                                                                        '<span class="txt">默认分组</span>'+
                                                                    '</div>'+
                                                                    '<div class="tl-rg">'+
                                                                        '<span class="cou">0</span>'+
                                                                    '</div>'+
                                                                    '<div class="striped trpm-none"></div>'+
                                                                '</div>'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                            '<div class="trpm-flex rg">'+
                                                '<div class="trpm-flex ser-d">'+
                                                    '<div class="inp-d">'+
                                                        '<input class="trpm-inp inp" type="text" value="" placeholder="请输入">'+
                                                        '<span class="iconfont icon_search btn-ser"></span>'+
                                                    '</div>'+
                                                    '<div class="trpm-flex-y trpm-btn btn-up trpm-none">'+
                                                        '<i class="iconfont icon_upload"></i>'+
                                                        '<span class="txt">上传</span>'+
                                                    '</div>'+
                                                '</div>'+
                                                '<div class="boxs">'+
                                                    '<div class="box pano-box" data-ty="121">'+
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                                '<!--<div class="li on" data-id="1">'+
                                                                    '<div class="m">'+
                                                                        '<div class="img">'+
                                                                            '<img src="'+_this.data.resourceWasee+'/VRHome/img/yangtu.jpg" alt="">'+
                                                                        '</div>'+
                                                                        '<div class="gou"></div>'+
                                                                        '<div class="name">外滩</div>'+
                                                                    '</div>'+
                                                                '</div>-->'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="box panoVideo-box trpm-none" data-ty="130">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="box img-box trpm-none" data-ty="23030">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                    '<div class="box video-box trpm-none" data-ty="23031">'+ 
                                                        '<div class="scroll">'+
                                                            '<div class="folder-box">'+
                                                                '<div class="bti" data-ty="folder">'+
                                                                    '子分组(<span class="cou">0</span>)'+
                                                                    '<span class="sq" data-show="1"><font>收起</font> <i class="iconfont icon_bottom jt"></i> </span>'+
                                                                '</div>'+
                                                                '<div class="folder-ul">'+
                                                                '</div>'+
                                                            '</div>'+
                                                            '<div class="bti" data-ty="file" style="display: none;">'+
                                                                '内容(<span class="cou">0</span>)'+
                                                            '</div>'+
                                                            '<div class="trpm-flex list">'+
                                                            '</div>'+
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="trpm-flex-y btn-d">'+
                                            '<div class="cou-d trpm-none">已选<span class="cou">0</span>个</div>'+
                                            '<div class="trpm-flex-y btns">'+
                                                '<div class="trpm-flex-y trpm-btn btn-cancel">'+
                                                    '<span class="txt">取消</span>'+
                                                '</div>'+
                                                '<div class="trpm-flex-y trpm-btn btn-ok">'+
                                                    '<span class="txt">确定</span>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                } catch (error) {
                }
                $("body").append(domHtml);
                
                $("#resource-alert .trpm-tl .tag .sp[data-ty="+ty+"], #resource-alert .lf .tree-boxs .tree-box[data-ty="+ty+"], #resource-alert .rg .boxs .box[data-ty="+ty+"]").removeClass("trpm-none").siblings().addClass("trpm-none");
                $("#resource-alert").show();
                $("#resource-alert .lf .tree-uls").css({"height":$("#resource-alert .lf .tree-boxs").height()});
                $("#resource-alert .rg .scroll").css({"height":$("#resource-alert .rg .boxs").height()});

                let dom_tree="#resource-alert .lf .pano-tree",dom_box="#resource-alert .rg .pano-box";
                if(ty==130){
                    dom_tree="#resource-alert .lf .panoVideo-tree";
                    dom_box="#resource-alert .rg .panoVideo-box";
                }
                else if(ty==23030){
                    dom_tree="#resource-alert .lf .img-tree";
                    dom_box="#resource-alert .rg .img-box";
                }
                else if(ty==23031){
                    dom_tree="#resource-alert .lf .video-tree";
                    dom_box="#resource-alert .rg .video-box";
                }
                //获取分类列表
                _this.getCls({
                    "isInit":true,
                    "lf":true,
                    "rg":false,
                    "dom":dom_tree+" .tree-one-ul",
                    "params":{"pid":0},
                    "callBack":function(bkData){
                        //获取列表
                        _this.getList({"isInit":true,"params":{"pageIndex":1},"sumCount":bkData.sumCount});
                    }
                });

                $("#resource-alert")
                //关闭
                .on("click",".trpm-x,.btn-d .btn-cancel",function(){
                    var thisObj=$(this);
                    $("#resource-alert").remove();
                })
                //搜索
                .on("click", ".ser-d .btn-ser", function () {
                    var val = $("#resource-alert .ser-d .inp").val();
                    // if(val==""){
                    //     trpm_publicModule.alertMsg({"ty":0,"txt":"请输入关键词","second":1000});
                    //     return false;
                    // }
                    //获取列表
                    let params={"pageIndex":1,"keyword":val};
                    _this.getList({"params":params});
                    return false;
                })
                //右侧选中
                .on("click",".list .li",function(){
                    var thisObj=$(this);
                    let atr=thisObj.attr("data-atr");
                    let id=thisObj.attr("data-id");
                    if(thisObj.hasClass("no")){
                        return false;
                    }
                    
                    if(ty==121){
                        var curObj=_this.data.data_pano[id];
                    }
                    if(ty==130){
                        curObj=_this.data.data_panoVideo[id];
                    }
                    else if(ty==23030){
                        curObj=_this.data.data_img[id];
                    }
                    else if(ty==23031){
                        curObj=_this.data.data_video[id];
                    }
                    
                    if(atr==1){
                        thisObj.attr("data-atr",0).removeClass("on").addClass("in");
                        if(_this.data.check==0){
                            _this.data.check_data={};
                        }
                        else{
                            delete _this.data.check_data[id];
                        }
                    }
                    else{
                        thisObj.attr("data-atr",1).removeClass("in").addClass("on");
                        if(_this.data.check==0){
                            thisObj.siblings().attr("data-atr",0).removeClass("on in");
                            _this.data.check_data=curObj;
                        }
                        else{
                            _this.data.check_data[id]=curObj;
                        }
                    }
                    // console.log(_this.data.check_data);
                })
                //右侧 mouseout
                .on("mouseout",".list .li",function(){
                    var thisObj=$(this);
                    thisObj.removeClass("in");
                })
                //确定
                .on("click",".btns .btn-ok",function(){
                    var thisObj=$(this);
                    if ($.isEmptyObject(_this.data.check_data)) {
                　　　　trpm_publicModule.alertMsg({"ty":0,"txt":"请先选择","second":1000});
                        return false;
                　　}
                    if ($.isFunction(_this.data.ok_callBack)) {
                        _this.data.ok_callBack({"data":_this.data.check_data});
                    }
                    $("#resource-alert").remove();
                })
                //分类点击
                .on("click", ".lf .tree-tl", function () {
                    var thisObj = $(this);
                    var pObj = thisObj.parent(".tree-box");
                    var liObj = thisObj.parent(".tree-li");
                    var id = thisObj.attr("data-id");
                    var arrow = thisObj.attr("data-arrow");
                    var isAjax = thisObj.attr("data-ajax");
                    $(dom_tree+" .tree-tl").removeClass("active");
                    thisObj.addClass("active");
                    if(arrow==1){
                        thisObj.attr("data-arrow","0").removeClass("show-sub");
                        thisObj.next(".tree-ul").hide();
                    }
                    else{
                        thisObj.attr("data-arrow","1").addClass("show-sub");
                        thisObj.next(".tree-ul").show();
                    }

                    let clsParams={"pid":id}, listParams={"pageIndex":1,"cid":id};
                    if(isAjax==1){
                        if(id>0){
                            _this.getCls({
                                "lf":false,
                                "rg":true,
                                "dom":dom_tree+" .tree-ul[pid="+id+"]",
                                "params":clsParams,
                                "callBack":function(bkData){
                                }
                            });
                        }
                        else{
                            $(dom_box+" .folder-box").hide();
                            $(dom_box+" .bti[data-ty=file]").hide();
                        }
                        //获取列表
                        _this.getList({"params":listParams});
                    }
                    else{
                        thisObj.attr("data-ajax","1");
                        if(id>0){
                            _this.getCls({
                                "lf":true,
                                "rg":true,
                                "dom":dom_tree+" .tree-ul[pid="+id+"]",
                                "params":clsParams,
                                "callBack":function(bkData){
                                    //获取列表
                                    _this.getList({"params":listParams});
                                }
                            });
                        }
                        else{
                            //获取列表
                            _this.getList({"params":listParams});
                        }
                    }
                    return false;
                });
                //右侧分类点击
                $("#resource-alert .rg .folder-box .folder-ul").off('click').on("click", ".folder-li", function () {
                    var thisObj = $(this);
                    var id = thisObj.attr("data-id");
                    var lf_tlObj = $(dom_tree+" .tree-tl[data-id="+id+"]");
                    var lf_liObj=lf_tlObj.parent();
                    var lf_isAjax = lf_tlObj.attr("data-ajax");
                    var lf=false;
                    if(lf_isAjax=='0'){
                        lf=true;
                        lf_tlObj.attr("data-ajax","1");
                    }
                    
                    $(dom_tree+" .tree-tl").removeClass("active");
                    lf_liObj.parents(".tree-li").find(".tree-tl:first").attr("data-arrow","1").addClass("show-sub");
                    lf_liObj.parents(".tree-li").find(".tree-tl:first").next(".tree-ul").show();
                    lf_tlObj.attr("data-arrow","1").addClass("active show-sub");
                    lf_tlObj.next(".tree-ul").show();

                    _this.getCls({
                        "lf":lf,
                        "rg":true,
                        "dom":dom_tree+" .tree-ul[pid="+id+"]",
                        "params":{"pid":id},
                        "callBack":function(bkData){
                            //获取列表
                            _this.getList({"params":{"pageIndex":1,"cid":id}});
                        }
                    });
                    return false;
                })
                //右侧分组显示隐藏
                $("#resource-alert .rg .folder-box .bti").on("click", ".sq", function () {
                    var thisObj = $(this);
                    var pObj=thisObj.parents(".folder-box");
                    var is_show = thisObj.attr("data-show");
                    if(is_show==1){
                        thisObj.attr("data-show",0);
                        thisObj.find("font").text("展开");
                        thisObj.find(".jt").addClass("icon_top").removeClass("icon_bottom");
                        pObj.find(".folder-ul").css({"display":"none"});
                    }
                    else{
                        thisObj.attr("data-show",1).removeClass("in");
                        thisObj.find("font").text("收起");
                        thisObj.find(".jt").addClass("icon_bottom").removeClass("icon_top");
                        pObj.find(".folder-ul").css({"display":"flex"});
                    }
                    return false;
                })
                
            }
        },
        //分类列表
        getCls: function (obj) {
            var _this = this;
            let ty=obj.ty ? obj.ty : _this.data.ty;
            if(obj.params.pid != undefined){
                obj.params.pid= obj.params.pid==-1 ? "" : obj.params.pid;
            }
            if(ty==121){ //全景分类
                _this.panoClsList(obj);
            }
            else if(ty==130){ //全景视频分类
                _this.panoVideoClsList(obj);
            }
            else if(ty==23030){ //图片
                if(obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.imgClsList(obj);
            }
            else if(ty==23031){ //视频
                if(obj.params.pid != undefined){
                    obj.params.parent_id=obj.params.pid;
                    delete obj.params.pid;
                }
                _this.videoClsList(obj);
            }
        },
        //列表
        getList: function (obj) {
            var _this = this;
            let ty= obj.ty ? obj.ty : _this.data.ty;
            if(obj.params.cid != undefined){
                obj.params.cid= obj.params.cid==-1 ? "" : obj.params.cid;
            }
            if(ty==121){ //全景
                if(obj.params.cid != undefined){
                    obj.params.category_id=obj.params.cid;
                    delete obj.params.cid;
                }
                $("#resource-alert .rg .pano-box .list").html(" ");
                _this.panoList(obj);
            }
            else if(ty==130){ //全景视频
                $("#resource-alert .rg .panoVideo-box .list").html(" ");
                _this.panoVideoList(obj);
            }
            else if(ty==23030){ //图片
                $("#resource-alert .rg .img-box .list").html(" ");
                _this.imgList(obj);
            }
            else if(ty==23031){ //视频
                $("#resource-alert .rg .video-box .list").html(" ");
                _this.videoList(obj);
            }
        },
        //全景分类
        panoClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_panoCls=isInit ? null : _this.data.load_panoCls;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_panoCls){
                _this.data.load_panoCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .pano-tree",
                    "url": '/Wasee/VRIndex/getPanoCategory',
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        formatData(bkData);
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_panoCls.list_data({
                    "params":params,
                });
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_panoCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img">'+
                                                    '<img src="'+_this.data.resourceWasee +'/VRHome/img/folder.png" alt="">'+
                                                    '</div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .pano-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .pano-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .pano-box .folder-box").show();
                            $("#resource-alert .rg .pano-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .pano-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .pano-box .folder-box").hide();
                        $("#resource-alert .rg .pano-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }
                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //全景视频分类
        panoVideoClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_panoVideoCls=isInit ? null : _this.data.load_panoVideoCls;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_panoVideoCls){
                _this.data.load_panoVideoCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .panoVideo-tree",
                    "url": '/Wasee/VRIndex/getPanoVideoCategory',
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        formatData(bkData);
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_panoVideoCls.list_data({
                    "params":params,
                });
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_panoVideoCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img">'+
                                                    '<img src="'+_this.data.resourceWasee +'/VRHome/img/folder.png" alt="">'+
                                                    '</div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .panoVideo-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .panoVideo-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .panoVideo-box .folder-box").show();
                            $("#resource-alert .rg .panoVideo-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .panoVideo-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .panoVideo-box .folder-box").hide();
                        $("#resource-alert .rg .panoVideo-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }
                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //图片分类
        imgClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_imgCls=isInit ? null : _this.data.load_imgCls;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_imgCls){
                _this.data.load_imgCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .img-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        formatData(bkData);
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_imgCls.list_data({
                    "params":params,
                });
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_imgCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img">'+
                                                    '<img src="'+_this.data.resourceWasee +'/VRHome/img/folder.png" alt="">'+
                                                    '</div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .img-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .img-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .img-box .folder-box").show();
                            $("#resource-alert .rg .img-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .img-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .img-box .folder-box").hide();
                        $("#resource-alert .rg .img-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }
                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //视频分类
        videoClsList: function (obj) {
            var _this = this;
            let lf=obj.lf ? obj.lf : false;
            let rg=obj.rg ? obj.rg : false;
            let dom=obj.dom;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_videoCls=isInit ? null : _this.data.load_videoCls;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_videoCls){
                _this.data.load_videoCls=new Load_data({
                    "load_type":3,
                    "fill_type":2,
                    "scroll":false,
                    "scroll_bar":true,
                    "dom": "#resource-alert .lf .video-tree",
                    "url": '/Wasee/Index/getResourceCategoryList',
                    "listParams": {"type":3},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                    },
                    "callBack": function(bkData){
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        formatData(bkData);
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_videoCls.list_data({
                    "params":params,
                });
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_videoCls.list_data({
                    "params":params,
                    "callBack": function(bkData){
                        formatData(bkData);
                    }
                });
            }

            function formatData(bkData){
                trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                var sumCount=0;
                var reData = bkData.data;
                if (reData.status == 1) {
                    var listHtml = "",listHtml2 = "";
                    var list = reData.data;
                    var cou = list.length;
                    for (var i = 0; i < cou; i++) {
                        var curObj = list[i];
                        var id = curObj.id;
                        var name = curObj.name;
                        var count = curObj.count;
                        sumCount+=Number(count);
                        var arrow = '<i class="iconfont icon_rightm arrow"></i>';
                        if (id == 0) {
                            arrow = "";
                        }
                        var tempHtml = '<div class="tree-li" data-id="'+ id +'">'+
                                            '<div class="tree-tl" data-id="'+ id +'" data-arrow="0" data-ajax="0">'+
                                                '<div class="tl-lf">'+
                                                    arrow+
                                                    '<i class="folder"></i>'+
                                                    '<span class="txt">' + name + '</span>'+
                                                '</div>'+
                                                '<div class="tl-rg">'+
                                                    '<span class="cou">' + count + '</span>'+
                                                '</div>'+
                                                '<div class="striped trpm-none" style></div>'+
                                            '</div>'+
                                            '<div class="tree-ul" pid="'+ id +'">'+
                                            '</div>'+
                                        '</div>';
                        var tempHtml2 = '<div class="folder-li" data-id="'+ id +'">'+
                                            '<div class="m">'+
                                                '<div class="img">'+
                                                    '<img src="'+_this.data.resourceWasee +'/VRHome/img/folder.png" alt="">'+
                                                    '</div>'+
                                                '<div class="info">'+
                                                    '<div class="name">'+ name +'</div>'+
                                                    '<div class="cou">'+ count +'</div>'+
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                        listHtml += tempHtml;
                        listHtml2 += tempHtml2;
                    }
                    if (cou > 0) {
                        if(lf){
                            $(dom).append(listHtml);
                        }
                        if(rg){
                            $("#resource-alert .rg .video-box .bti[data-ty=folder] .cou").text(cou);
                            $("#resource-alert .rg .video-box .folder-ul").html(listHtml2);
                            $("#resource-alert .rg .video-box .folder-box").show();
                            $("#resource-alert .rg .video-box .bti[data-ty=file]").show();
                        }
                    }
                    else{
                        $("#resource-alert .rg .video-box .folder-box .bti .cou").text(0);
                        $("#resource-alert .rg .video-box .folder-box").hide();
                        $("#resource-alert .rg .video-box .bti[data-ty=file]").hide();
                    }
                }
                else {
                    // console.log(reData.info);
                }
                if ($.isFunction(obj.callBack)) {
                    obj.callBack({"data":reData,"sumCount":sumCount});
                }
            }
        },
        //全景
        panoList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_pano=isInit ? null : _this.data.load_pano;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_pano){
                _this.data.load_pano=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .pano-box",
                    "url": '/Wasee/VRIndex/getPanoMediaList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":0},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.thumburl;
                        var on="",atr="0";
                        if($.inArray(id.toString(), _this.data.ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_pano=_this.data.load_pano.data.listData;
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.category_id==undefined) {
                            $("#resource-alert .lf .pano-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_pano.scroll_data({"params":params});
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_pano.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_pano=_this.data.load_pano.data.listData;
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.category_id==undefined) {
                            $("#resource-alert .lf .pano-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                    }
                });
            }
        },
        //全景视频
        panoVideoList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_panoVideo=isInit ? null : _this.data.load_panoVideo;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_panoVideo){
                _this.data.load_panoVideo=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .panoVideo-box",
                    "url": '/Wasee/VRIndex/getPanoVideoList',
                    "listParams": {"pageIndex":1,"pageSize":30},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url;
                        var on="",atr="0";
                        if($.inArray(id.toString(), _this.data.ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_panoVideo=_this.data.load_panoVideo.data.listData; 
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.cid==undefined) {
                            $("#resource-alert .lf .panoVideo-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_panoVideo.scroll_data({"params":params});
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_panoVideo.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_panoVideo=_this.data.load_panoVideo.data.listData; 
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.cid==undefined) {
                            $("#resource-alert .lf .panoVideo-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                        }
                    }
                });
            }
        },
        //图片
        imgList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_img=isInit ? null : _this.data.load_img;
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_img){
                _this.data.load_img=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .img-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":1},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.url;
                        var on="",atr="0";
                        if($.inArray(id.toString(), _this.data.ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_img=_this.data.load_img.data.listData; 
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.cid==undefined) {
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_img.scroll_data({"params":params});
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_img.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_img=_this.data.load_img.data.listData; 
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.cid==undefined) {
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .img-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        },
        //视频
        videoList: function (obj) {
            var _this = this;
            let isInit=obj.isInit ? obj.isInit : false;
            _this.data.load_video=isInit ? null : _this.data.load_video;
            let sumCount=obj.sumCount ? obj.sumCount : 0;
            let params=obj.params ? obj.params : {};
            if(!_this.data.load_video){
                _this.data.load_video=new Load_data({
                    "load_type":0,
                    "fill_type":1,
                    "dom": "#resource-alert .rg .video-box",
                    "url": '/Wasee/Index/getResourceList',
                    "listParams": {"pageIndex":1,"pageSize":30,"type":3},
                    "format_callBack": function(bkData){
                        var curObj=bkData.data;
                        var id = curObj.id;
                        var name = curObj.name;
                        var img_url = curObj.cover_url;
                        var on="",atr="0";
                        if($.inArray(id.toString(), _this.data.ids)>-1){ 
                            on="no",atr="1";
                        }
                        var reHtml ='<div class="li '+on+'" data-id="' + id + '" data-atr="'+atr+'">' +
                                        '<div class="m">' +
                                            '<div class="img" style="background-image: url(' + img_url + ')">' +
                                                '<!--<img src="' + img_url + '" alt="'+name+'">-->' +
                                            '</div>' +
                                            '<div class="gou"></div>' +
                                            '<div class="name">' + name + '</div>' +
                                        '</div>' +
                                    '</div>';
                        return reHtml;
                    },
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_video=_this.data.load_video.data.listData; 
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.cid==undefined) {
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_video.scroll_data({"params":params});
            }
            else{
                trpm_publicModule.alertMsg({"ty":1,"icon":_this.data.icon_load});
                _this.data.load_video.scroll_data({
                    "params":params,
                    "callBack": function(bkData){
                        var reData = bkData.data;
                        var count = reData.count;
                        _this.data.data_video=_this.data.load_video.data.listData; 
                        trpm_publicModule.alertRemove({"elem":".trpm-alert-msg"});
                        if (params.cid==undefined) {
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=-1] .cou").html(count);
                            $("#resource-alert .lf .video-tree .tree-uls .tree-tl[data-id=0] .cou").html(Number(count)-Number(sumCount));
                        }
                    }
                });
            }
        }
    }

    window.materialModule=materialModule;
}())
