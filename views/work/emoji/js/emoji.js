/**
* Author: 倘若飘邈 
* <940461709@qq.com> <微信jiao_ao8>
*/

(function(){
    // 表情
    function EmojiModule(obj){
        var _this = this;
        _this.data={
            emojiArray : [{"title":"微笑","code":"[微笑]","name":"1.gif"},{"title":"撇嘴","code":"[撇嘴]","name":"2.gif"},{"title":"色","code":"[色]","name":"3.gif"},{"title":"发呆","code":"[发呆]","name":"4.gif"},{"title":"得意","code":"[得意]","name":"5.gif"},{"title":"流泪","code":"[流泪]","name":"6.gif"},{"title":"害羞","code":"[害羞]","name":"7.gif"},{"title":"闭嘴","code":"[闭嘴]","name":"8.gif"},{"title":"睡","code":"[睡]","name":"9.gif"},{"title":"大哭","code":"[大哭]","name":"10.gif"},{"title":"尴尬","code":"[尴尬]","name":"11.gif"},{"title":"发怒","code":"[发怒]","name":"12.gif"},{"title":"调皮","code":"[调皮]","name":"13.gif"},{"title":"呲牙","code":"[呲牙]","name":"14.gif"},{"title":"惊讶","code":"[惊讶]","name":"15.gif"},{"title":"难过","code":"[难过]","name":"16.gif"},{"title":"酷","code":"[酷]","name":"17.gif"},{"title":"冷汗","code":"[冷汗]","name":"18.gif"},{"title":"抓狂","code":"[抓狂]","name":"19.gif"},{"title":"吐","code":"[吐]","name":"20.gif"},{"title":"偷笑","code":"[偷笑]","name":"21.gif"},{"title":"可爱","code":"[可爱]","name":"22.gif"},{"title":"白眼","code":"[白眼]","name":"23.gif"},{"title":"傲慢","code":"[傲慢]","name":"24.gif"},{"title":"饥饿","code":"[饥饿]","name":"25.gif"},{"title":"困","code":"[困]","name":"26.gif"},{"title":"惊恐","code":"[惊恐]","name":"27.gif"},{"title":"流汗","code":"[流汗]","name":"28.gif"},{"title":"憨笑","code":"[憨笑]","name":"29.gif"},{"title":"大兵","code":"[大兵]","name":"30.gif"},{"title":"奋斗","code":"[奋斗]","name":"31.gif"},{"title":"咒骂","code":"[咒骂]","name":"32.gif"},{"title":"疑问","code":"[疑问]","name":"33.gif"},{"title":"嘘","code":"[嘘]","name":"34.gif"},{"title":"晕","code":"[晕]","name":"35.gif"},{"title":"折磨","code":"[折磨]","name":"36.gif"},{"title":"哀","code":"[哀]","name":"37.gif"},{"title":"骷髅","code":"[骷髅]","name":"38.gif"},{"title":"敲打","code":"[敲打]","name":"39.gif"},{"title":"再见","code":"[再见]","name":"40.gif"},{"title":"擦汗","code":"[擦汗]","name":"41.gif"},{"title":"抠鼻","code":"[抠鼻]","name":"42.gif"},{"title":"鼓掌","code":"[鼓掌]","name":"43.gif"},{"title":"糗大了","code":"[糗大了]","name":"44.gif"},{"title":"坏笑","code":"[坏笑]","name":"45.gif"},{"title":"左哼哼","code":"[左哼哼]","name":"46.gif"},{"title":"右哼哼","code":"[右哼哼]","name":"47.gif"},{"title":"哈欠","code":"[哈欠]","name":"48.gif"},{"title":"鄙视","code":"[鄙视]","name":"49.gif"},{"title":"委屈","code":"[委屈]","name":"50.gif"},{"title":"快哭了","code":"[快哭了]","name":"51.gif"},{"title":"阴险","code":"[阴险]","name":"52.gif"},{"title":"亲亲","code":"[亲亲]","name":"53.gif"},{"title":"吓","code":"[吓]","name":"54.gif"},{"title":"可怜","code":"[可怜]","name":"55.gif"},{"title":"菜刀","code":"[菜刀]","name":"56.gif"},{"title":"西瓜","code":"[西瓜]","name":"57.gif"},{"title":"啤酒","code":"[啤酒]","name":"58.gif"},{"title":"篮球","code":"[篮球]","name":"59.gif"},{"title":"乒乓","code":"[乒乓]","name":"60.gif"},{"title":"咖啡","code":"[咖啡]","name":"61.gif"},{"title":"饭","code":"[饭]","name":"62.gif"},{"title":"猪头","code":"[猪头]","name":"63.gif"},{"title":"玫瑰","code":"[玫瑰]","name":"64.gif"},{"title":"凋谢","code":"[凋谢]","name":"65.gif"},{"title":"示爱","code":"[示爱]","name":"66.gif"},{"title":"爱心","code":"[爱心]","name":"67.gif"},{"title":"心碎","code":"[心碎]","name":"68.gif"},{"title":"蛋糕","code":"[蛋糕]","name":"69.gif"},{"title":"闪电","code":"[闪电]","name":"70.gif"},{"title":"炸弹","code":"[炸弹]","name":"71.gif"},{"title":"刀","code":"[刀]","name":"72.gif"},{"title":"足球","code":"[足球]","name":"73.gif"},{"title":"瓢虫","code":"[瓢虫]","name":"74.gif"},{"title":"便便","code":"[便便]","name":"75.gif"},{"title":"月亮","code":"[月亮]","name":"76.gif"},{"title":"太阳","code":"[太阳]","name":"77.gif"},{"title":"礼物","code":"[礼物]","name":"78.gif"},{"title":"拥抱","code":"[拥抱]","name":"79.gif"},{"title":"强","code":"[强]","name":"80.gif"},{"title":"弱","code":"[弱]","name":"81.gif"},{"title":"握手","code":"[握手]","name":"82.gif"},{"title":"胜利","code":"[胜利]","name":"83.gif"},{"title":"抱拳","code":"[抱拳]","name":"84.gif"},{"title":"勾引","code":"[勾引]","name":"85.gif"},{"title":"拳头","code":"[拳头]","name":"86.gif"},{"title":"差劲","code":"[差劲]","name":"87.gif"},{"title":"爱你","code":"[爱你]","name":"88.gif"},{"title":"no","code":"[no]","name":"89.gif"},{"title":"ok","code":"[ok]","name":"90.gif"},{"title":"爱情","code":"[爱情]","name":"91.gif"},{"title":"飞吻","code":"[飞吻]","name":"92.gif"},{"title":"跳跳","code":"[跳跳]","name":"93.gif"},{"title":"发抖","code":"[发抖]","name":"94.gif"},{"title":"怄火","code":"[怄火]","name":"95.gif"},{"title":"转圈","code":"[转圈]","name":"96.gif"},{"title":"磕头","code":"[磕头]","name":"97.gif"},{"title":"回头","code":"[回头]","name":"98.gif"},{"title":"跳绳","code":"[跳绳]","name":"99.gif"},{"title":"挥手","code":"[挥手]","name":"100.gif"},{"title":"跳高","code":"[跳高]","name":"101.gif"},{"title":"吼叫","code":"[吼叫]","name":"102.gif"},{"title":"练武","code":"[练武]","name":"103.gif"},{"title":"左摆","code":"[左摆]","name":"104.gif"},{"title":"右摆","code":"[右摆]","name":"105.gif"},{"title":"囍","code":"[囍]","name":"106.gif"},{"title":"鞭炮","code":"[鞭炮]","name":"107.gif"},{"title":"灯笼","code":"[灯笼]","name":"108.gif"},{"title":"发","code":"[发]","name":"109.gif"},{"title":"麦克风","code":"[麦克风]","name":"110.gif"},{"title":"手袋","code":"[手袋]","name":"111.gif"},{"title":"信","code":"[信]","name":"112.gif"},{"title":"帅","code":"[帅]","name":"113.gif"},{"title":"庆祝","code":"[庆祝]","name":"114.gif"},{"title":"蜡烛","code":"[蜡烛]","name":"115.gif"},{"title":"生气","code":"[生气]","name":"116.gif"},{"title":"棒棒糖","code":"[棒棒糖]","name":"117.gif"},{"title":"奶瓶","code":"[奶瓶]","name":"118.gif"},{"title":"面条","code":"[面条]","name":"119.gif"},{"title":"香蕉","code":"[香蕉]","name":"120.gif"},{"title":"飞机","code":"[飞机]","name":"121.gif"},{"title":"汽车","code":"[汽车]","name":"122.gif"},{"title":"车头","code":"[车头]","name":"123.gif"},{"title":"车厢","code":"[车厢]","name":"124.gif"},{"title":"车尾","code":"[车尾]","name":"125.gif"},{"title":"多云","code":"[多云]","name":"126.gif"},{"title":"下雨","code":"[下雨]","name":"127.gif"},{"title":"钞票","code":"[钞票]","name":"128.gif"},{"title":"熊猫","code":"[熊猫]","name":"129.gif"},{"title":"灯泡","code":"[灯泡]","name":"130.gif"},{"title":"风车","code":"[风车]","name":"131.gif"},{"title":"闹钟","code":"[闹钟]","name":"132.gif"},{"title":"雨伞","code":"[雨伞]","name":"133.gif"},{"title":"气球","code":"[气球]","name":"134.gif"},{"title":"钻戒","code":"[钻戒]","name":"135.gif"},{"title":"沙发","code":"[沙发]","name":"136.gif"},{"title":"厕纸","code":"[厕纸]","name":"137.gif"},{"title":"药丸","code":"[药丸]","name":"138.gif"},{"title":"手枪","code":"[手枪]","name":"139.gif"},{"title":"青蛙","code":"[青蛙]","name":"140.gif"}],
            emojiArray2 : ["微笑","撇嘴","色","发呆","得意","流泪","害羞","闭嘴","睡","大哭","尴尬","发怒","调皮","呲牙","惊讶","难过","酷","冷汗","抓狂","吐","偷笑","可爱","白眼","傲慢","饥饿","困","惊恐","流汗","憨笑","大兵","奋斗","咒骂","疑问","嘘","晕","折磨","哀","骷髅","敲打","再见","擦汗","抠鼻","鼓掌","糗大了","坏笑","左哼哼","右哼哼","哈欠","鄙视","委屈","快哭了","阴险","亲亲","吓","可怜","菜刀","西瓜","啤酒","篮球","乒乓","咖啡","饭","猪头","玫瑰","凋谢","示爱","爱心","心碎","蛋糕","闪电","炸弹","刀","足球","瓢虫","便便","月亮","太阳","礼物","拥抱","强","弱","握手","胜利","抱拳","勾引","拳头","差劲","爱你","no","ok","爱情","飞吻","跳跳","发抖","怄火","转圈","磕头","回头","跳绳","挥手","跳高","吼叫","练武","左摆","右摆","囍","鞭炮","灯笼","发","麦克风","手袋","信","帅","庆祝","蜡烛","生气","棒棒糖","奶瓶","面条","香蕉","飞机","汽车","车头","车厢","车尾","多云","下雨","钞票","熊猫","灯泡","风车","闹钟","雨伞","气球","钻戒","沙发","厕纸","药丸","手枪","青蛙"],
            "resourcePublic":paramObj.resourcePublic,
            "resourceWasee":paramObj.resourceWasee,
            "icon_load": paramObj.resourcePublic+"/images/loading2.gif",
            "emojiSwiper":null,
            "isLoadEmoji":false, //是否加载过表情
            "ckeck_emoji":[], //选中的表情集合
            "loadFile":false,//文件是否加载完成
            "dom":null,
            "inp":null,
        };
        
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
    EmojiModule.prototype = {
        constructor: EmojiModule,
        //导入文件
        import_file: function(obj){
            var _this=this;
            //导入css
            trpm_publicModule.loadCsss({
                "files":[
                    {"id":"emoji_css","href":_this.data.resourcePublic+'/trpm/emoji/css/emoji.css?ver='+new Date().getTime()},
                ],
                "callBack":function(){
                    // console.log("css已加载");
                    //导入js
                    trpm_publicModule.loadScripts({
                        "files":[
                            {"id":"swiper_script","url":_this.data.resourcePublic+'/trpm/swiper/js/swiper-3.4.2.min.js'}
                        ],
                        "callBack":function(){
                            // console.log("swiper_script已加载");
                            //回调
                            if (obj && obj.callBack && $.isFunction(obj.callBack)) {
                                obj.callBack();
                            }
                        }
                    });
                }
            });
            
        },
        //dom
        dom: function(obj){
            var _this=this;
            if(obj){
                _this.data=$.extend(_this.data, obj);
            }
            var dom=obj.dom;
            var inp=obj.inp;
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
                if($(dom).find(".trpm-emoji").length==0){
                    // $(dom).find(".trpm-emoji").remove();
                    try {
                        var domHtml='<div class="trpm-emoji">'+
                                        '<div class="swiper-container">'+
                                            '<div class="swiper-wrapper">'+
                                            '</div>'+
                                            '<div class="swiper-pagination"></div>'+
                                        '</div>'+
                                    '</div>';
                    } catch (error) {
                    }
                    $(dom).append(domHtml);
                    $(dom+" .trpm-emoji").show();
                }
                else{
                    $(dom+" .trpm-emoji").show();
                }

                //表情 swiper
                if(!_this.data.emojiSwiper){
                    _this.data.emojiSwiper = new Swiper(dom+' .trpm-emoji .swiper-container',{
                        pagination : dom+' .trpm-emoji .swiper-pagination'
                    })
                }

                if(!_this.data.isLoadEmoji){
                    _this.getEmojiHtml({
                        "params":{},
                        "callBack":function(bkData){
                            _this.data.isLoadEmoji=true;
                            $(dom).find(".trpm-emoji .swiper-wrapper").html(bkData.html);
                            setTimeout(function(){
                                _this.data.emojiSwiper.update();
                            }, 500);
                        }
                    });
                }
                else{
                    $(dom+" .trpm-emoji").show();
                    setTimeout(function(){
                        _this.data.emojiSwiper.update();
                    }, 500);
                }
                
                $(dom+" .trpm-emoji").off();
                $(dom+" .trpm-emoji")
                //打开表情
                .on("click", ".face-icon-d span",function(){
                    var code=$(this).find(".face-icon").attr("data-code");
                    var inpVal=$(inp).val();
                    var inp_len=inpVal.length;
                    if(code=="[删除]"){
                        if(inp_len==0) return;
                        if(_this.data.ckeck_emoji.length>0){
                            var last_emo=_this.data.ckeck_emoji.pop();//取最后一个数组表情
                            last_emo_len=last_emo.length;
                            if(inpVal.substring(inp_len-last_emo_len)==last_emo){
                                inpVal=inpVal.substring(0,inp_len-last_emo_len);
                            }else{
                                inpVal=inpVal.substring(0, inp_len-1);
                                _this.data.ckeck_emoji.push(last_emo);
                            }
                        }
                        else{
                            inpVal=inpVal.substring(0, inp_len-1);
                        }
                        $(inp).val(inpVal);
                    }
                    else{
                        $(inp).val(inpVal+code);
                        _this.data.ckeck_emoji.push(code);
                    }
                    // $(dom+" .trpm-emoji").hide();
                })
            }
        },
        //获取表情展示列表
        hide:function(obj) {
            var _this=this;
            $(_this.data.dom+" .trpm-emoji").hide();
        },
        //获取表情展示列表
        getEmojiHtml:function(obj) {
            var _this = this;
            var thisObj=$.extend({
                emoji_len:_this.data.emojiArray.length,
                returnData:"",                  //return的html数据
                min_list_html:"",               //每一段排好html的字符串
                len:20,                         //第一段的个数（比如20一段）
                forlen:1,                       //循环段的次数（1-20，21-40.。。。。。）
                delete_top:0,                   //删除按扭所在的位置
            },obj.params);
            // console.log(thisObj.len)
            thisObj.delete_top=thisObj.emoji_len*-33;
            for (var i = 0; i < thisObj.emoji_len; i++) {
                var data=_this.data.emojiArray[i];
                var _top=(-33*i);
                thisObj.min_list_html+='<span><i class="face-icon" data-title="'+data.title+'" data-code="'+data.code+'" style="background-position: left '+_top+'px;"></i></span>'
                if(thisObj.len>1){
                    var ol=(thisObj.len*thisObj.forlen);
                    //当循环的次数等于每一段的整数倍或最后一段不足整数倍
                    if(ol==(i+1)||((i+1)==thisObj.emoji_len&&(i+1)!=ol)){
                        thisObj.forlen++;
                        //每一版后面加一个删除按扭
                        var _del_html='<span><i class="face-icon" data-title="删除" data-code="[删除]" style="background-position: left '+thisObj.delete_top+'px;"></i></span>';
                        thisObj.returnData+='<div class="swiper-slide"><div class="face-icon-d clearfloat p-re">'+thisObj.min_list_html+_del_html+'</div></div>';
                        thisObj.min_list_html="";
                    }
                }else{
                    //自定义
                }
            }
            // $(".emoji-box .swiper-wrapper").html(thisObj.returnData);
            
            if ($.isFunction(obj.callBack)) {
                obj.callBack({"html":thisObj.returnData});
            }
        },
        //格式化表情符号对应的image
        getEmojiImage:function(obj){
            var _this = this;
            var thisObj=$.extend({
                emoji_len:_this.data.emojiArray.length,
                image_url:paramObj.resourcePublic+"/trpm/emoji/img/",
                replace_list:[],
                str:"",
            },obj);
            for (var i = 0; i < thisObj.emoji_len; i++) {
                var data=_this.data.emojiArray[i];
                var arr={};
                arr[data.code]='<img class="emoji-icon" src="'+thisObj.image_url+data.name+'">';
                thisObj.replace_list.push(arr);
            }
            return trpm_publicModule.replace({'str':thisObj.str,"vals":thisObj.replace_list});
        }
    }
    window.EmojiModule=EmojiModule;
}())
