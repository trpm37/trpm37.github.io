/**
* Author: 倘若飘邈【阮强】 
* <940461709@qq.com> <微信jiao_ao8>
*/
'use strict'

;(function(window) {
    
    let trpm_util={
        data:{
            "public_path":'https://resourceqiniu.wasee.com/public', //必填
            "userAgent": window.navigator.userAgent, // 获取浏览器的userAgent字符串
            "base64_prefix": 'data:image/png;base64,', // base64 前缀
            "font":1, //是否加载字体
            "css":1 //是否加载样式
        },
        //初始化
        async init(options){
            var _this=this;
            if(document.currentScript && document.currentScript.src){
                let curPath=document.currentScript.src;
                _this.data.public_path=curPath.split('/js/')[0];
                _this.data.css=_this.url_getParams('css',curPath)!=undefined ? _this.url_getParams('css',curPath) : 1;
                _this.data.font=_this.url_getParams('font',curPath)!=undefined ? _this.url_getParams('font',curPath) : 1;
            }
            if(options){
                Object.assign(_this.data, options);
            }

            //导入文件
            await _this.import_file().catch(function(rej){
                console.log(rej);
            })
            return 1;
        },
        //导入文件
        async import_file(options) {
            var _this = this;
            let file_cou=0;
            if(_this.data.font==1){
                //字体样式
                let font_css=await _this.loadCss({
                    "id":"trpm-icon-css",
                    "url":`${_this.data.public_path}/font/iconfont.css?ver=${new Date().getTime()}`
                });
                if(font_css){
                    file_cou++;
                }
            }
            if(_this.data.css==1){
                //基础样式
                let uitl_css=await _this.loadCss({
                    "id":"trpm-util-css",
                    "url":`${_this.data.public_path}/css/trpm-util.min.css?ver=${new Date().getTime()}`
                });
                if(uitl_css){
                    file_cou++;
                }
            }
            return file_cou;
        },
        //动态添加样式style {id:"", "css":'#div{width:30px;} .div{height:30px;}'}
        loadStyle: function(obj){
            let _this=this;
            let {id=null,css}=obj;
            let styleDom=document.createElement('style');
            styleDom.type='text/css';
            styleDom.id=id;
            styleDom.innerText=css;
            document.body.appendChild(styleDom);
        },
        //加载单个css
        async loadCss(options) {
            let _this=this;
            var varObj=Object.assign({
                "type":"text/css",
                "rel":"stylesheet",
                "callback": function () { }    //回调函数
            }, options);
            let [dom_id,url,target_id,node]=[
                varObj.id,
                varObj.url,
                varObj.target_id!=undefined ? varObj.target_id : "",
                null
            ];
            let target=(target_id && $("#"+target_id).length>0) ? target=$("#"+target_id) : null;

            //加载css
            function load_node(){
                return new Promise(function(resolve,reject){
                    node = document.createElement('link');
                    node.id = dom_id; //node.setAttribute("id", dom_id);
                    node.type = varObj.type;
                    node.rel = varObj.rel;
                    node.href = url;
                    
                    if(target){
                        target.before(node);
                    }
                    else{
                        var head = document.getElementsByTagName("head")[0];
                        head.appendChild(node);
                    }

                    resolve(1);
                });
            }

            if(dom_id){
                if($("#"+dom_id).length==0){
                    await load_node().catch(function(rej){
                    });
                }
            }
            else{
                await load_node().catch(function(rej){
                });
            }
            return 1;
        },
        //动态加载js并判断是否加载完成
        async loadScript(options) {
            let _this=this;
            let varObj=Object.assign({"type":"text/javascript"}, options);
            let [dom_id,url,val,target_id,node,valTimer]=[
                varObj.id,
                varObj.url,
                varObj.val!=undefined ? varObj.val : "",
                varObj.target_id!=undefined ? varObj.target_id : "",
                null,null
            ];
            let target=(target_id && $("#"+target_id).length>0) ? target=$("#"+target_id) : null;

            //创建script
            function createNode(){
                node = document.createElement("script");
                if(dom_id!=undefined){
                    node.setAttribute("id", dom_id);
                }
                if(varObj.type!=undefined){
                    node.setAttribute("type", varObj.type);
                }
                if(varObj.defer!=undefined){
                    node.setAttribute("defer", varObj.defer);
                }
                if(varObj.async!=undefined){
                    node.setAttribute("async", varObj.async);
                }
                node.setAttribute("src", url);
                if(target){
                    target.before(node);
                }
                else{
                    document.head.appendChild(node);
                }
            }
            //加载script
            function load_node(o){
                let script=o && o.node ? o.node : node;
                let pm=new Promise(function(resolve,reject){
                    try {
                        if(script.readyState){   //IE
                            script.onreadystatechange=function(){
                                if(!script.readyState || script.readyState=='loaded' || script.readyState=='complete'){
                                    script.onreadystatechange=null;
                                    resolve({"u":"IE", "status":1, "info":"加载完成","url":url});
                                }
                            }
                        }
                        else{//非IE
                            script.onload=function(){
                                resolve({"u":"非IE", "status":1, "info":"加载完成","url":url});
                            };
                        }
                    } catch (error) {
                        reject({"status":0,"info":error,"url":url});
                    }
                });
                return pm;
            }
            //验证变量
            function valFun(o){
                let pm=new Promise(function(resolve,reject){
                    try {
                        function valLoop(){
                            if(!window[val]){
                                valTimer=setTimeout(function(){
                                    valLoop();
                                },50);
                            }
                            else{
                                clearTimeout(valTimer);
                                valTimer=null;
                                resolve(o);
                            }
                        }

                        // function valLoop() {
                        //     if(!window[val]){
                        //         valTimer=requestAnimationFrame(valLoop); 
                        //     }
                        //     else{
                        //         cancelAnimationFrame(valTimer);
                        //         valTimer=null;
                        //         resolve(o);
                        //     }
                        // }
                        valLoop();
                    } catch (error) {
                        reject({"status":0,"info":error,"url":url});
                    }
                });
                return pm;
            }

            //判断目标场景是否加载完成
            if(target){
                await load_node({"node":target.get(0)}).catch(function(rej){
                    console.log(rej);
                });
            }

            let resolveData=null;
            async function a(){
                if(dom_id){
                    if($("#"+dom_id).length==0){
                        createNode();
                        resolveData=await load_node().catch(function(rej){
                            resolveData={"status":0,"info":"加载失败","url":url};
                        });
                        if(val){
                            resolveData=await valFun(resolveData).catch(function(rej){
                                resolveData={"status":0,"info":"加载失败","url":url};
                            });
                        }
                    }
                    else{
                        resolveData={"status":1,"info":"已存在","url":url};
                        if(val){
                            resolveData=await valFun(resolveData).catch(function(rej){
                                resolveData={"status":0,"info":"加载失败","url":url};
                            });
                        }
                    }
                }
                else{
                    createNode();
                    resolveData=await load_node().catch(function(rej){
                        resolveData={"status":0,"info":"加载失败","url":url};
                    });
                    if(val){
                        resolveData=await valFun(resolveData).catch(function(rej){
                            resolveData={"status":0,"info":"加载失败","url":url};
                        });
                    }
                }
            }
            await a();

            // console.log(resolveData);
            return resolveData;
        },
        //发送ajax
        ajax: function(options){
            let _this=this;
            let varObj=Object.assign({
                "isPromise":false,
                "type": "POST",
                "async": true,
                "url": "",
                "params": {},
                "callBack": function (bkData) { }    //回调函数
            }, options);
            let ajaxParams={
                type: varObj.type,
                async: varObj.async,
                url: varObj.url,
                data: varObj.params,
                success: function(reData){
                    if (varObj && varObj.callBack && _this.is_function(varObj.callBack)) {
                        let bkData=reData.status==undefined ? {"status":1,"data":reData} : reData;
                        varObj.callBack({"params":varObj.params, "data":bkData});
                    }
                },
                error: function(rs, sta, err){
                    if (varObj && varObj.callBack && _this.is_function(varObj.callBack)) {
                        varObj.callBack({"rs":rs, "sta":sta,"err":err});
                    }
                }
            };
            if(varObj.dataType){
                ajaxParams.dataType=varObj.dataType;
            }
            if(varObj.contentType){
                ajaxParams.contentType=varObj.contentType;
            }
            if(!varObj.isPromise){
                $.ajax(ajaxParams);
            }
            else{
                return new Promise(function(resolve,reject){
                    ajaxParams.success=function(res){
                        let bkData=res.status==undefined ? {"status":1,"data":res} : res;
                        resolve({"params":varObj.params, "data":bkData});
                    };
                    ajaxParams.error=function(rs, sta, err){
                        reject(rs, sta, err);
                    };
                    $.ajax(ajaxParams);
                });
            }
        },
        //判断设备
        device: function() {
            var reObj={"browser":null, "mobile":false,"android":false,"ios":false,"iosVer":"", "apple":false,"weixin":false,"Opera":false,"IE":false,"Firefox":false,"Chrome":false,"Safari":false,"Edge":false};
            var userAgentInfo = navigator.userAgent;
            if (userAgentInfo.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
                reObj.mobile=true;
            }
            if (userAgentInfo.indexOf("Android") > 0) {
                reObj.android=true;
            }
            // if (userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            //     reObj.ios=true;
            // }
            const isIOS = userAgentInfo.toLowerCase() .match(/cpu iphone os (.*?) like mac os/);
            if (isIOS){
                reObj.ios=true;
                reObj.iosVer = parseInt( isIOS[1].replace(/_/g,".") );
            }
            if (userAgentInfo.indexOf("iPhone") > 0||userAgentInfo.indexOf("iPad") > 0||userAgentInfo.indexOf("iPod") > 0) {
                reObj.apple=true;
            }
            if (userAgentInfo.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
                reObj.weixin=true;
            }

            //浏览器
            if (userAgentInfo.indexOf("Firefox") > -1) {
                reObj.Firefox=true;
                reObj.browser="Firefox";
            }
            if (userAgentInfo.indexOf("Chrome") > -1 && userAgentInfo.indexOf("Safari") > -1){
                reObj.Chrome=true;
                reObj.browser="Chrome";
            }
            if (userAgentInfo.indexOf("Safari") > -1 && userAgentInfo.indexOf('Chrome') === -1) {
                reObj.Safari=true;
                reObj.browser="Safari";
            }
            if (userAgentInfo.indexOf("Opera") > -1) {
                reObj.Opera=true;
                reObj.browser="Opera";
            };
            if (userAgentInfo.indexOf("MSIE") > -1 || "ActiveXObject" in window) {
                reObj.IE=true;
                reObj.browser="IE";
            };
            if (userAgentInfo.indexOf("Edg") > -1) {
                reObj.Edge=true;
                reObj.browser="Edge";
            };
            return reObj;
        }, 

        /**
         * @description 页面加载完成后
         * @param {Function} fn
         */
        event_ready: function(fn) {
            if (fn == null) {
                fn = document
            }
            var oldonload = window.onload
            if (typeof window.onload !== 'function') {
                window.onload = fn
            }
            else {
                window.onload = function() {
                    oldonload()
                    fn()
                }
            }
        },
        /**
         * @description 添加事件
         * @param {Object} element 必需。事件的dom元素
         * @param {String} type 必需。描述事件名称的字符串。注意：不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
         * @param {Function} handler 必需。描述了事件触发后执行的函数。
         * @param {Boolean} useCapture 可选。true: 事件在捕获阶段执行; false(默认): 事件在冒泡阶段执行
         */
        event_add: function(element, type, handler, useCapture) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, useCapture)
            }
            else if (element.attachEvent) {
                element.attachEvent('on' + type, function() {
                    handler.call(element)
                })
            }
            else {
                element['on' + type] = handler
            }
        },
        /**
         * @description 移除事件
         * @param {Object} element 必需。事件的dom元素
         * @param {String} type 必需。描述事件名称的字符串。注意：不要使用 "on" 前缀。例如，使用 "click" 来取代 "onclick"。
         * @param {Function} handler 必需。描述了事件触发后执行的函数。
         * @param {Boolean} useCapture 可选。true: 事件在捕获阶段执行; false(默认): 事件在冒泡阶段执行
         */
        event_remove: function(element, type, handler, useCapture) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, useCapture)
            }
            else if (element.datachEvent) {
                element.detachEvent('on' + type, handler)
            }
            else {
                element['on' + type] = null
            }
        },
        /**
         * @description 阻止事件 (主要是事件冒泡，因为IE不支持事件捕获)
         * @param {Object} ev 事件对象
         */
        event_stop: function(ev) {
            if (ev.stopPropagation) {
                ev.stopPropagation()
            }
            else {
                ev.cancelBubble = true
            }
        },
        /**
         * @description 取消事件的默认行为
         * @param {Object} ev 事件对象
         */
        event_prevent: function(ev) {
            if (ev.preventDefault) {
                ev.preventDefault()
            }
            else {
                ev.returnValue = false
            }
        },
        /**
         * @description 获取事件目标
         * @param {Object} ev 事件对象
         */
        event_target: function(ev) {
            return ev.target || ev.srcElement
        },
        /**
         * @description 获取event对象的引用，取到事件的所有信息，确保随时能使用event
         * @param {Object} ev 事件对象
         */
        event_get: function(ev) {
            ev = ev || window.event
            if (!ev) {
                var c =event_get.caller
                while (c) {
                    ev = c.arguments[0]
                    if (ev && Event === ev.constructor) {
                        break
                    }
                    c = c.caller
                }
            }
            return ev
        },

        /**
         * @description 设置缓存
         * @param {String} name 缓存数据的名字
         * @param {*} value 缓存数据的值
         * @param {Number} expiredays 缓存数据的时间（天），默认关闭浏览器时失效。1/24 表示一个小时，1/24/60 表示一分钟
        */
        cookie_set: function(name, value, expiredays) {
            var expires = ''
            if (expiredays) {
                var exdate = new Date()
                exdate.setTime(exdate.getTime() + expiredays * (24 * 3600 * 1000))
                expires = 'expires=' + exdate.toUTCString()
            }
            document.cookie = name + '=' + escape(value) + ';' + expires
        },
        /**
         * @description 获取缓存的数据
         * @param {String} name 要获取的数据对应的名字
         * @return {*}
        */
        cookie_get: function(name) {
            var arr = document.cookie.split('; ')
            for (var i = 0, len = arr.length; i < len; i++) {
                var temp = arr[i].split('=')
                if (temp[0] === name) return unescape(temp[1])
            }
            return null
        },
        /**
         * @description 删除缓存中某些数据
         * @param {String} name 要删除的数据对应的名字
         */
        cookie_remove: function(name) {
            this.cookie_set(name, '', -1)
        },
        /**
         * @description 获取localStorage对象，兼容android（android原生系统老系统不支持localstorage）
         * @return localStorage对象
         */
         storage_uzStorage: function() {
            var ls = window.localStorage
            var isAndroid = (/android/gi).test(window.navigator.appVersion)
            if (isAndroid) ls = os.localStorage()
            return ls
        },
        /**
         * @description 设置本地储存
         * @param {String} key 储存的名字
         * @param {*} value 储存的值
         */
        storage_set: function(key, value) {
            var v = value
            var ls = this.storage_uzStorage();
            if (typeof v === 'object') {
                v = JSON.stringify(v)
                v = 'obj-' + v
            }
            if (ls) ls.setItem(key, v)
        },
        /**
         * @description 获取本地储存的数据
         * @param {String} key 要获取的数据对应的名字
         * @return {*}
         */
        storage_get: function(key) {
            var ls = this.storage_uzStorage()
            if (ls) {
                var v = ls.getItem(key)
                if (!v) return
                if (v.indexOf('obj-') === 0) return JSON.parse(v.slice(4))
                else return v
            }
        },
        /**
         * @description 删除本地储存中某些数据
         * @param {String} key 要删除的数据对应的名字
         */
        storage_remove: function(key) {
            var ls = this.storage_uzStorage()
            if (ls && key) ls.removeItem(key)
        },
        /**
         * @description 清空本地储存的所有数据
         */
        storage_clear: function() {
            var ls = this.storage_uzStorage()
            if (ls) ls.clear()
        },

        /**
         * @description 判断元素是否为字符串
         * @param {*} source
         * @return {Boolen}
         */
        is_string: function(source) {
            return typeof source === 'string'
        },
        /**
         * @description 判断元素是否为数组
         * @param {*} source
         * @return {Boolen}
         */
        is_array: function(source) {
            if (Array.isArray) return Array.isArray(source)
            else return source instanceof Array
        },
        /**
         * @description 判断元素是否为对象
         * @param {*} source
         * @return {Boolen}
         */
        is_object: function(source) {
            return Object.prototype.toString.call(source) === '[object Object]'
        },
        /**
         * @description 判断元素是否为函数
         * @param {*} source
         * @return {Boolen}
         */
        is_function: function(source) {
            return typeof source === 'function'
        },
        /**
         * @description 判断元素是否为空
         * @param {*} source
         * @return {Boolen}
         */
        is_empty: function(source) {
            if (source === undefined || source === null) return true
            if (this.is_string(source) || this.is_array(source)) return source.length === 0
            if (this.is_object(source)) return JSON.stringify(source) === '{}'
            else return source.toString().length === 0
        },
        /**
         * @description 判断两个元素是否相等
         * @param {*} source1
         * @param {*} source2
         * @param {Boolean} ignoreCase 是否忽略掉大小写，不传则为false
         * @param {Boolean} ignoreSort 是否忽略排序，不传则为false
         * @return {Boolean} 是否相等
         */
        is_equal: function(source1, source2, ignoreCase, ignoreSort) {
            let _this=this;
            let prop_equal = true;
            // 同为数组或同为对象
            if ((_this.is_array(source1) && _this.is_array(source2)) || (_this.is_object(source1) && _this.is_object(source2))) {
                if (_this.is_array(source1)) {
                    if (source1.length !== source2.length) {
                        prop_equal = false
                        return false
                    }
                    if (ignoreSort) {
                        source1.sort()
                        source2.sort()
                    }
                }
                else {
                    if (_this.len(source1) !== _this.len(source2)) {
                        prop_equal = false
                        return false
                    }
                }

                _this.obj_forEach(source1, function(ikey, item) {
                    return _this.is_equal(item, source2[ikey], ignoreCase, ignoreSort)
                })
                return prop_equal
            }
            // 字符串
            else {
                if (ignoreCase) {
                    source1 = String.prototype.toLowerCase.call(source1.toString())
                    source2 = String.prototype.toLowerCase.call(source2.toString())
                }
                if (source1 !== source2) prop_equal = false
                return prop_equal
            }
        },

         /**
         * @description 去除字符串前后空格
         * @param {String} str
         * @return {String} 去除空格之后的字符串
         */
        str_trim: function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, '')
        },
        /**
         * @description 去除字符串所有空格
         * @param {String} str
         * @return {String} 去除空格之后的字符串
         */
        str_trimAll: function(str) {
            return str.replace(/\s*/g, '')
        },
        /**
         * @description 替换字符串所有换行字符串
         * @param {String} str 原字符串
         * @param {String} val 要替换的值 默认"\n"
         * @return {String} 替换之后的字符串
         */
         str_br: function(str,val) {
            let re=/(<br\/>|<br>|<BR>|<BR\/>|&lt;br\/&gt;|&lt;br&gt;|&lt;BR&gt;|&lt;BR\/&gt;)/g;
            if(val==undefined){
                val="\n";
            }
            return str.replace(re, val)
        },
        /**
        * @description 格式化字符串（文本顺序替换）
        * @param {String} str 源字符串。如：'确定要{0}单据【{1}】吗？'
        * @param {*} array 要替换的参数。如：['删除', 'QZYDYJZB201901300002']
        * @return {String} 如：'确定要删除单据【QZYDYJZB201901300002】吗？'
        */
        str_format: function(str, ary) {
            let [newStr,list] = [str,ary];
            for (let i = 0; i < list.length; i++) {
                var reg = new RegExp('\\{' + (i - 1) + '\\}', 'gm')
                newStr = newStr.replace(reg, list[i])
            }
            return newStr;
        },
        /**
        * @description 格式化字符串（文本无序替换）
        * @param {String} str 源字符串。如：'确定要%a单据【%b】吗？'
        * @param {*} array 要替换的参数。如：[{"%a":"删除"},{"%b":"QZYDYJZB201901300002"}]
        * @return {String} 如：'确定要删除单据【QZYDYJZB201901300002】吗？'
        */
        str_format2: function (str,ary) {
            let [newStr,list] = [str,ary];
            for (let index in list) {
                let [_name,_value] = ["",""];
                for (var keys in list[index]) { 
                    _name = keys; 
                    _value = list[index][keys]; 
                }
                _name = _name.replace('[', '\\[').replace(']', '\\]').replace('(', '\\(').replace(')', '\\)');
                let reName = new RegExp(_name, 'g');
                newStr = newStr.replace(reName, _value);
            }
            return newStr;
        },
        /**
         * @description 判断字符串是否以指定字符串开头
         * @param {String} str 源字符串
         * @param {String} searchString 要查询的字符串
         * @param {Boolean} ignoreCase 是否忽略大小写，默认false
         * @return {Boolean}
         */
        str_startWith: function(str, searchString, ignoreCase) {
            if (str === null || str === undefined) return false
            var preSubStr = str.substring(0, searchString.length) + ''
            if (ignoreCase) {
                preSubStr = preSubStr.toLowerCase()
                searchString = (searchString + '').toLowerCase()
            }
            return preSubStr === searchString
        },
        /**
         * @description 判断字符串是否以指定字符串结束
         * @param {String} str 源字符串
         * @param {String} searchString 要查询的字符串
         * @param {Boolean} ignoreCase 是否忽略大小写，默认false
         * @return {Boolean}
         */
        str_endWith: function(str, searchString, ignoreCase) {
            if (str === null || str === undefined) return false
            var lastSubStr = str.substring(str.length - searchString.length, str.length) + ''
            if (ignoreCase) {
                lastSubStr = lastSubStr.toLowerCase()
                searchString = (searchString + '').toLowerCase()
            }
            return lastSubStr === searchString
        },
        /**
         * @description 首字母小写
         * @param {String} str 源字符串
         * @return {String}
         */
        str_firstLowerCase: function(str) {
            if (this.is_empty(str)) return ''
            return str.replace(/^\S/, function(s) { return s.toLowerCase() })
        },
        /**
         * @description 首字母大写
         * @param {String} str 源字符串
         * @return {String}
         */
        str_firstUpperCase: function(str) {
            if (this.is_empty(str)) return ''
            return str.replace(/^\S/, function(s) { return s.toUpperCase() })
        },
        /**
         * @description 反转字符串的元素顺序
         * @param {String} str 源字符串
         * @return {String}
         */
        str_reverse: function(str) {
            if (this.is_empty(str)) return ''

            var newStr = ''
            for (var i = str.length - 1; i >= 0; i--) {
                newStr += str[i]
            }
            return newStr
        },
        
        /**
         * @description 转换成int类型
         * @param {String Number} input 输入的数
         * @param {Number} defaultValue 转换失败时的默认值
         * @return {int}
         */
        number_parseInt: function(input, defaultValue) {
            var value = parseInt(input)
            if (isNaN(value) || Infinity === value) {
                defaultValue = defaultValue || 0
                return defaultValue
            }
            return value
        },
        /**
         * @description 转换成float类型
         * @param {String Number} input 输入的数
         * @param {Number} defaultValue 转换失败时的默认值
         * @return {float}
         */
        number_parseFloat: function(input, defaultValue) {
            var value = parseFloat(input)
            if (isNaN(value) || Infinity === value) {
                defaultValue = defaultValue || 0
                return defaultValue
            }
            return value
        },
        /**
         * @description 保留几位小数（四舍五入法）
         * @param {String Number} input 输入的数
         * @param {String Number} digits 小数位数，默认 2
         * @return {String}
         */
        number_toFixed: function(input, digits) {
            digits = digits!=undefined ? digits : 2;
            input = this.number_parseFloat(input, 0)
            if (input === 0) return 0
            return Number(input.toFixed(digits));
        },
        /**
         * @description 保留几位小数（进一法）
         * @param {String Number} input 输入的数
         * @param {String Number} digits 小数位数，默认 2
         * @return {String}
         */
        number_ceil: function(input, digits) {
            digits = digits || 2
            var num = Math.ceil(input * Math.pow(10, digits)) / Math.pow(10, digits)
            return this.number_toFixed(num, digits)
        },
        /**
         * @description 保留几位小数（舍一法）
         * @param {String Number} input 输入的数
         * @param {String Number} digits 小数位数，默认 2
         * @return {String}
         */
        number_floor: function(input, digits) {
            digits = digits || 2
            var num = Math.floor(input * Math.pow(10, digits)) / Math.pow(10, digits)
            return this.number_toFixed(num, digits)
        },
        /**
         * @description 获取两个数之间的随机数
         * @param {Number} min
         * @param {Number} max
         * @return {Number}
         */
        number_random: function(min, max) {
            var random = 0
            random = min + Math.random() * (max - min)
            return Math.round(random)
        },
        /**
         * @description 多个数相加
         * @param {Number String} args 加数
         * @return {Number} 和
         */
        number_add: function(args) {
            var m = 0
            var ret = 0
            for (var i = 0, len = arguments.length; i < len; i++) {
                arguments[i] = arguments[i].toString()
                try {
                    m += arguments[i].split('.')[1].length
                }
                catch (e) {
                    m += 0
                }
            }
            for (var j = 0, leng = arguments.length; j < leng; j++) {
                ret = arguments[j] * Math.pow(10, m) + ret
            }
            ret = ret / Math.pow(10, m)
            return ret
        },
        /**
         * @description 多个数相乘
         * @param {Number String} args 乘数
         * @return {Number} 积
         */
        number_mul: function(args) {
            var m = 0
            var ret = 1
            for (var i = 0, len = arguments.length; i < len; i++) {
                arguments[i] = arguments[i].toString()
                try {
                    m += arguments[i].split('.')[1].length
                }
                catch (e) {
                    m += 0
                }
                ret = arguments[i].replace('.', '') * ret
            }
            ret = ret / Math.pow(10, m)
            return ret
        },
        /**
         * @description 转化成货币格式（千分位）
         * @param {Number String} num 源数据
         * @param {String Number} digits 小数位数，默认不处理
         * @return {String}
         */
        number_toCurrency: function(input, digits) {
            input = input + ''
            if (digits) input = this.number_toFixed(input, digits)
            if (input.indexOf('.') === -1) input += '.'

            return input.replace(/(\d)(?=(\d{3})+\.)/g, function($1) {
                return $1 + ','
            }).replace(/\.$/, '')
        },
        
        /**
         * @description 检索数组（子元素为数组、对象、字符串等）
         * @param {Array} source [''] [[]] [{}]
         * @param {*} searchElement 当子元素为对象时，只用匹配该对象的某一个（几个）属性即可
         * @return {Number} 索引 或 -1
         */
        array_indexOf: function(source, searchElement) {
            var index = -1
            // 子元素为对象
            if (this.is_object(searchElement)) {
                this.obj_forEach(source, function(i, item) {
                    var isHas = true
                    this.obj_forEach(searchElement, function(searchKey, searchValue) {
                        if (item[searchKey]) {
                            if (!this.is_equal(item[searchKey], searchValue)) {
                                isHas = false
                                return false
                            }
                        }
                        else {
                            isHas = false
                        }
                    })
                    if (isHas) {
                        index = i
                        return false
                    }
                })
                return index
            }
            // 子元素为数组
            if (this.is_array(searchElement)) {
                this.obj_forEach(source, function(i, item) {
                    if (this.is_equal(item, searchElement)) {
                        index = i
                        return false
                    }
                })
                return index
            }
            // 子元素为字符串
            else {
                return source.indexOf(searchElement)
            }
        },
        /**
         * @description 向数组的末尾添加一个或多个元素，并返回新的长度
         * @param {Array} target 目标数组
         * @param {Array} array 要添加的数组
         * @return {Number} 新数组的长度
         */
        array_push: function(target, array) {
            if (this.is_empty(array)) return target
            if (!this.is_array(array)) array = [array]
            return Array.prototype.push.apply(target, array)
        },
        /**
         * @description 对数组排序
         * @param {Array} array 源数组 [{}]
         * @param {String} sortKey 排序字段
         * @param {String} order 排序方式，asc升序，desc降序，默认为升序
         * @return {Array} 排序后的新数组
         */
        array_sort: function(array, sortKey, order) {
            if (this.is_empty(array)) return []
            var ret = array.concat([])
            order = order || 'asc'
            ret.sort(function(a, b) {
                var aVal = a[sortKey]
                var bVal = b[sortKey]
                if (aVal > bVal) return order === 'asc' ? 1 : -1
                else if (aVal < bVal) return order === 'asc' ? -1 : 1
                return 0
            })
            return ret
        },
        /**
         * @description 数组去重（子元素为数组、对象、字符串等）
         * @param {Array} array [''] [[]] [{}]
         * @param {String Array} keys 根据属性去重（针对子元素是对象时）
         * @param {Boolean} ignoreSort 是否忽略排序（针对子元素是数组时）
         * @return {Array}
         */
        array_unique: function(array, keys, ignoreSort) {
            var ret = []
            this.obj_forEach(array, function(i, item) {
                if (keys && this.is_object(item)) { // 根据属性去重，去掉排在末位的对象
                    if (!this.is_array(keys)) keys = [keys]
                    var searchObj = {}
                    this.obj_forEach(keys, function(i, selectKey) {
                        searchObj[selectKey] = item[selectKey]
                    })
                    if (this.array_indexOf(ret, searchObj) === -1) ret.push(item)
                }
                else if (ignoreSort && this.is_array(item)) {
                    if (this.array_indexOf(ret, item.sort()) === -1) ret.push(item)
                }
                else {
                    if (this.array_indexOf(ret, item) === -1) ret.push(item)
                }
            })
            return ret
        },
        /**
         * @description 筛选出符合条件的数组，生成新的数组
         * @param {Array} source 原数组 [{}]
         * @param {Object} filterProperty 条件对象 { status: ['1','2'] }
         * @param {Boolean} getDeleteData 是否返回被过滤掉的数组，默认false
         * @return {Array} 符合条件的数据 或 不符合条件的数据
         */
        array_filter: function(source, filterProperty, getDeleteData) {
            if (this.is_empty(source) || this.is_empty(filterProperty)) return []

            var ret = []
            var retByDelete = []
            this.obj_forEach(source, function(i, item) {
                var equal = true
                this.obj_forEach(filterProperty, function(filterKey, filterValue) {
                    var itemValue = item[filterKey]
                    if (!this.is_array(filterValue)) filterValue = [filterValue]
                    if (filterValue.indexOf(itemValue) === -1) {
                        equal = false
                        return false
                    }
                })
                if (equal) ret.push(item)
                else retByDelete.push(item)
            })
            if (getDeleteData) return retByDelete
            return ret
        },
        /**
         * @description 选择数组的子元素（对象）的一个（多个）属性
         * @param {Array} source 源数组 [{}]
         * @param {String Array} keys 属性（集合）
         * @return {Array} 新数组 [''] 或 [{}]
         */
        array_select: function(source, keys) {
            if (this.is_empty(source) || this.is_empty(keys)) return source

            var ret = []
            this.obj_forEach(source, function(i, item) {
                if (this.is_array(keys)) {
                    var obj = {}
                    this.obj_forEach(keys, function(j, key) {
                        obj[key] = this.object_getValue(item, key)
                    })
                    ret.push(obj)
                }
                else {
                    ret.push(this.object_getValue(item, keys))
                }
            })
            return ret
        },
        /**
         * @description 合并两个数组，生成新的数组
         * @param {Array} source 原数组
         * @param {Array} array 待合并的数组
         * @param {String Array} keys 根据属性去重（针对子元素是对象时）
         * @param {Boolean} ignoreSort 是否忽略排序（针对子元素是数组时）
         * @return {Object}
         */
        array_concat: function(source, array, keys, ignoreSort) {
            if (this.is_empty(source)) return array
            if (this.is_empty(array)) return source

            var ret = []
            ret = source.concat(array)
            ret = this.array_unique(ret, keys, ignoreSort)
            return ret
        },
        /**
         * @description 对数组中的元素进行分组
         * @param {Array} array 数组
         * @param {Array} fields 分组的依据字段
         * @return {Array} 分组后的新数组
         */
        array_group: function(array, fields) {
            if (this.is_empty(array) || this.is_empty(fields)) return null

            var ret = []
            this.obj_forEach(array, function(i, item) {
                if (!this.is_array(fields)) fields = [fields]

                var itemGroup = {}
                this.obj_forEach(fields, function(i, field) {
                    itemGroup[field] = item[field]
                })
                var index = this.array_indexOf(ret, itemGroup)
                if (index === -1) {
                    itemGroup.group = []
                    itemGroup.group.push(item)
                    ret.push(itemGroup)
                }
                else {
                    ret[index].group.push(item)
                }
            })
            return ret
        },
        /**
         * @description arraybuffer转string
         * @param source 原数据
         * @returns {string}
         */
        array_arraybufferToString: function(source) {
            const enc = new TextDecoder("utf-8");
            const uint8_msg = new Uint8Array(source);
            const decodedString = enc.decode(uint8_msg)
            return decodedString
        },
        /**
         * @description 删除数组中指定的元素或不合法的值（undefined, null, ''）
         * @param {Array} source 原数组
         * @param {*} values 被删除的元素集合，不传则删除不合法的值
         */
        array_remove: function(array, values) {
            if (this.is_empty(array)) return []
            // 删除不合法的值
            if (this.is_empty(values)) {
                var i = array.length
                while (i--) {
                    var item = array[i]
                    if (item === null || item === undefined || item === '') {
                        array.splice(i, 1)
                    }
                }
            }
            // 删除指定的元素
            else {
                if (!this.is_array(values)) values = [values]
                this.obj_forEach(values, function(i, value) {
                    var index = this.array_indexOf(array, value)
                    if (index > -1) array.splice(index, 1)
                })
            }
        },
        /**
         * @description 清空数组中的元素
         * @param {Array} array 源数组
         */
        array_clear: function(array) {
            if (this.is_empty(array)) return

            array.splice(0, array.length)
        },

        /**
         * @description 获取对象的属性集合
         * @param {Object} obj 源对象
         * @return {Array} 属性名的数组
         */
        object_keys: function(obj) {
            if (this.is_empty(obj)) return []

            return Object.keys(obj)
        },
        /**
         * @description 获取对象属性的值 的集合
         * @param {Object} obj 源对象
         * @return {Array} 属性值的数组
         */
        object_values: function(obj) {
            if (this.is_empty(obj)) return []

            var ret = []
            try {
                ret = Object.values(obj)
            }
            catch (e) {
                this.obj_forEach(obj, function(key, value) {
                    ret.push(value)
                })
            }
            return ret
        },
        /**
         * @description 合并对象（ Object.assign() 拷贝的是属性值，不属于深拷贝）
         * @param {Object} target 目标对象
         * @param arguments 后面的属性会覆盖掉前面的
         */
        object_assign: function(target) {
            if (!this.is_object(target)) return

            try {
                Object.assign.apply(window, arguments)
            }
            catch (e) {
                for (var i = 1, len = arguments.length; i < len; i++) {
                    var nextObj = arguments[i]
                    if (this.is_object(nextObj)) {
                        this.obj_forEach(nextObj, function(key, value) {
                            target[key] = value
                        })
                    }
                }
            }
        },
        /**
         * @description 选择对象中的一个（多个）属性
         * @param {Object} obj 源对象
         * @param {String Array} keys 属性名集合
         * @return {Object} 新对象
         */
         object_select: function(obj, keys) {
            if (this.is_empty(obj) || this.is_empty(keys)) return {}

            var ret = {}
            if (!this.is_array(keys)) keys = [keys]
            this.obj_forEach(keys, function(i, key) {
                ret[key] = obj[key]
            })
            return ret
        },
        /**
         * @description 修改属性名
         * @param {Object} obj 要修改的对象
         * @param {String} oldKey 原来的属性名
         * @param {String} newKey 新的属性名
         * @param {Boolean} keepOld 是否保留旧的属性，默认为false
         */
         object_rename: function(obj, oldKey, newKey, keepOld) {
            if (this.is_empty(obj)) return

            if (obj[oldKey]) {
                obj[newKey] = obj[oldKey]
                if (!keepOld) this.object_remove(obj, oldKey)
            }
        },
        /**
         * @description 获取对象的属性值（支持多层数据）
         * @param {Object} obj 对象
         * @param {String} propertyName 属性名 'data.child.name'
         * @param {Boolean} ignoreCase 忽略属性名大小写，默认false
         */
        object_getValue: function(obj, propertyName, ignoreCase) {
            let _this=this;
            var propertyValue = null
            if (!obj || _this.is_empty(propertyName)) return propertyValue

            var pointIndex = propertyName.indexOf('.')
            if (pointIndex > -1) {
                obj = obj[propertyName.substring(0, pointIndex)]
                return _this.object_getValue(obj, propertyName.substring(pointIndex + 1), ignoreCase)
            }
            else {
                _this.obj_forEach(obj, function(key, value) {
                    if (_this.is_equal(key, propertyName, ignoreCase)) {
                        propertyValue = value
                        return false
                    }
                })
            }
            return propertyValue
        },
        /**
         * @description 修改对象的属性值（支持多层数据）
         * @param {Object} obj 对象
         * @param {String} propertyName 属性名 'data.child.name'
         * @param {*} propertyValue 属性值
         * @param {Boolean} ignoreCase 忽略属性名大小写，默认false
         */
         object_setValue: function(obj, propertyName,propertyValue, ignoreCase) {
            let _this=this;
            var flag = false;
            if (!obj || _this.is_empty(propertyName)) return flag;

            var pointIndex = propertyName.indexOf('.');
            if (pointIndex > -1) {
                obj = obj[propertyName.substring(0, pointIndex)]
                return _this.object_getValue(obj, propertyName.substring(pointIndex + 1),propertyValue, ignoreCase)
            }
            else {
                _this.obj_forEach(obj, function(key, value) {
                    if (_this.is_equal(key, propertyName, ignoreCase)) {
                        obj[key] = propertyValue;
                        flag=true;
                        return false;
                    }
                })
            }
            return flag;
        },
        /**
         * @description 序列化对象
         * @param {Object} paramObj 源对象
         * @return {String}
         */
        object_serialize: function(paramObj) {
            var name, value, fullSubName, subName, subValue, innerObj
            var ret = ''
            for (name in paramObj) {
                value = paramObj[name]
                if (value instanceof Array) {
                    for (var i = 0; i < value.length; ++i) {
                        subValue = value[i]
                        fullSubName = name + '[' + i + ']'
                        innerObj = {}
                        innerObj[fullSubName] = subValue
                        ret += this.object_serialize(innerObj) + '&'
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName]
                        fullSubName = name + '[' + subName + ']'
                        innerObj = {}
                        innerObj[fullSubName] = subValue
                        ret += this.object_serialize(innerObj) + '&'
                    }
                }
                else if (value !== undefined && value !== null) { ret += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&' }
            }
            ret = ret.substring(0, ret.length - 1)
            return ret
        },
        /**
         * @description 删除对象中指定的属性 或 值为空的属性（undefined, null, '')
         * @param {Object} obj 源对象
         * @param {String Array} keys 属性名集合，不传则删除为空的属性
         * @return {Object}
         */
        object_remove: function(obj, keys) {
            if (this.is_empty(obj)) return obj

            var ret = {}
            var es6 = true
            if (!this.is_empty(keys)) {
                if (!this.is_array(keys)) keys = [keys]
                this.obj_forEach(keys, function(i, key) {
                    try {
                        delete obj[key]
                    }
                    catch (e) {
                        es6 = false
                        return false
                    }
                })
                if (es6) return obj
                else {
                    this.obj_forEach(obj, function(key, value) {
                        if (keys.indexOf(key) === -1) {
                            ret[key] = value
                        }
                    })
                    return ret
                }
            }
            else {
                this.obj_forEach(obj, function(key, value) {
                    var wrongful = (value === null || value === undefined || value === '')
                    try {
                        if (wrongful) delete obj[key]
                    }
                    catch (e) {
                        es6 = false
                        if (!wrongful) {
                            ret[key] = value
                        }
                    }
                })
                if (es6) return obj
                else return ret
            }
        },
        /**
         * @description 清空对象
         * @param {Object} obj 源对象
         * @param {Array} keys 属性名集合，不传则清空全部属性
         * @return {Object} 清空后的对象
         */
        object_clear: function(obj, keys) {
            if (this.is_empty(obj)) return {}

            if (keys) {
                if (!this.is_array(keys)) keys = [keys]
                this.obj_forEach(keys, function(i, key) {
                    obj[key] = ''
                })
            }
            else {
                this.obj_forEach(obj, function(key, value) {
                    obj[key] = ''
                })
            }
            return obj
        },

        /**
         * @description 遍历数组、对象
         * @param {*} source 对象或数组
         * @param {Function} func 执行函数，function(i, item) 或 function(key, value)。执行函数返回 false 时，循环终止。
         * @return {*} 跳出循环时的值
         */
         obj_forEach: function(source, func) {
             let cur=null;
            if (source === undefined || source === null) return
            if (typeof (func) !== 'function') return
            var flag
            if (this.is_object(source)) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        flag = func.apply(window, [key, source[key]]);
                        if (flag === false) {
                            cur=source[key];
                            break;
                        }
                    }
                }
            }
            else {
                for (var i = 0, len = source.length; i < len; i++) {
                    flag = func.apply(window, [i, source[i]]);
                    if (flag === false) {
                        cur=source[i];
                        break;
                    }
                }
            }
            return cur;
        },
        /**
         * @description 复制对象或数组（深拷贝）
         * @param {*} source 源数据
         * @param {String} propertyName 要跳过的属性名 'data.child.name'
         * @return {*}
         */
        obj_copy: function(source,propertyName) {
            let _this=this;
            var ret;
            if (_this.is_object(source)) {
                ret = {}
                if (_this.is_empty(propertyName)) {
                    _this.obj_forEach(source, function(key, value) {//console.log("111***",key,value);
                        if (_this.is_object(value) || _this.is_array(value)) {
                            value = _this.obj_copy(value)
                        }
                        ret[key] = value
                    })
                }
                else{
                    var pointIndex = propertyName.indexOf('.');
                    // console.log("对象",propertyName,pointIndex);
                    _this.obj_forEach(source, function(key, value) {//console.log("222***",key,value);
                        if (pointIndex > -1) {
                            if (_this.is_object(value) || _this.is_array(value)) {
                                if(key==propertyName.substring(0, pointIndex)){
                                    value = _this.obj_copy(value,propertyName.substring(pointIndex + 1));
                                }
                                else{
                                    value = _this.obj_copy(value,propertyName);
                                }
                            }
                            ret[key] = value;                            
                        }
                        else{
                            if (!_this.is_equal(key, propertyName)) {
                                if (_this.is_object(value) || _this.is_array(value)) {
                                    value = _this.obj_copy(value,propertyName)
                                }
                                ret[key] = value
                            }
                        }
                    })
                }
            }
            else if (_this.is_array(source)) {
                ret = [];
                if (_this.is_empty(propertyName)) {
                    _this.obj_forEach(source, function(i, item) {//console.log("111----",item);
                        if (_this.is_object(item) || _this.is_array(item)) {
                            item = _this.obj_copy(item);
                        }
                        ret.push(item);
                    })
                }
                else{
                    var pointIndex = propertyName.indexOf('.');
                    // console.log("数组",propertyName,pointIndex);
                    _this.obj_forEach(source, function(i, item) {
                        if (pointIndex > -1) {//console.log("222----",item);
                            if (_this.is_object(item) || _this.is_array(item)) {
                                item = _this.obj_copy(item,propertyName);
                            }                                
                            ret.push(item);                            
                        }
                        else{
                            if (!_this.is_equal(item, propertyName)) {
                                if (_this.is_object(item) || _this.is_array(item)) {
                                    item = _this.obj_copy(item,propertyName);
                                }
                                ret.push(item);
                            }
                        }                        
                    })
                }                
            }
            else return source
            return ret
        },
        /**
         * @description 扩展对象（深拷贝）
         * @param {Object} target 目标对象
         * @param arguments 后面的属性会覆盖掉前面的
         */
        obj_extend: function(target) {
            let _this=this;
            if (!_this.is_object(target)) return

            for (var i = 1, len = arguments.length; i < len; i++) {
                var nextObj = arguments[i]
                if (_this.is_object(nextObj)) {
                    _this.obj_forEach(nextObj, function(key, value) {
                        if (_this.is_object(value) || _this.is_array(value)) {
                            value = _this.obj_copy(value)
                        }
                        target[key] = value
                    })
                }
            }
            return target
        },

        /**
         * @description json格式转树状结构
         * @param {JSON} data json数组 [{},{}]
         * @param {String} id id 的字段名
         * @param {String} pid 父id 的字段名
         * @param {String} child child 的字段名
         * @return {Array}
         */
        json_toTreeData: function(data, id, pid, child) {
            var i
            var ret = []
            var hash = {}
            var len = (data || []).length
            for (i = 0; i < len; i++) {
                hash[data[i][id]] = data[i]
            }
            for (i = 0; i < len; i++) {
                var pidO = hash[data[i][pid]]
                if (pidO) {
                    pidO[child] = pidO[child] || []
                    pidO[child].push(data[i])
                }
                else {
                    ret.push(data[i])
                }
            }
            return ret
        },

        /**
         * @description 秒转成时间
         * @param {Date} time 秒
         * @return {object} {hh,mm,ss}
         */
        data_formatSecond: function(time) {
            const hours = parseInt(time / 3600);
            const minute = parseInt(time / 60 % 60);
            const second = Math.ceil(time % 60);    
       
            let hh = hours < 10 ? '0' + hours : hours;
            let mm = minute < 10 ? '0' + minute : minute;
            let ss = second > 59 ? 59 : second;
            ss = ss < 10 ? '0' + ss : ss;
            return {hh,mm,ss};
        },
        /**
         * @description 时间格式
         * @param {Date} time 时间、时间字符串、时间戳
         * @param {String} format 时间格式，默认'YYYY-MM-DD'。如果是'星期WW'，则返回（如：'星期日'）
         * @return {String} 格式化后的时间
         */
        date_format: function(time, format) {
            time = time ? new Date(time) : new Date()
            format = format || 'YYYY-MM-DD'
            function tf(i) { return (i < 10 ? '0' : '') + i }
            return format.replace(/YYYY|MM|DD|hh|mm|ss|WW/g, function(a) {
                switch (a) {
                        case 'YYYY':
                            return tf(time.getFullYear())
                        case 'MM':
                            return tf(time.getMonth() + 1)
                        case 'DD':
                            return tf(time.getDate())
                        case 'mm':
                            return tf(time.getMinutes())
                        case 'hh':
                            return tf(time.getHours())
                        case 'ss':
                            return tf(time.getSeconds())
                        case 'WW':
                            return ['日', '一', '二', '三', '四', '五', '六'][time.getDay()]
                }
            })
        },
        /**
         * @description 获取前后几月的日期
         * @param {Number} MM 前后几月（正数代表后几个月，负数代表前几个月），默认上个月（-1）
         * @param {Date} time 时间、时间字符串、时间戳
         * @param {String} format 时间格式，默认'YYYY-MM-DD'
         * @return {String} 格式化后的时间
         */
        date_otherMonth: function(MM, time, format) {
            MM = !isNaN(parseInt(MM)) ? parseInt(MM) : -1
            time = time ? new Date(time) : new Date()

            var oldDate = time.getDate()
            time.setMonth(time.getMonth() + MM)
            var newDate = time.getDate()
            if (newDate < oldDate) {
                time.setMonth(time.getMonth(), 0)
            }
            return this.date_format(time, format)
        },
        /**
         * @description 某一月的第一天
         * @param {Number} MM 前后几月（正数代表后几个月，负数代表前几个月），默认本月（0）
         * @param {Date} time 时间、时间字符串、时间戳
         * @param {String} format 时间格式，默认'YYYY-MM-DD'
         * @return {String} 格式化后的时间
         */
        date_startOfMonth: function(MM, time, format) {
            MM = !isNaN(parseInt(MM)) ? parseInt(MM) : 0
            time = time ? new Date(time) : new Date()

            time.setMonth(time.getMonth() + MM, 1)
            return this.date_format(time, format)
        },
        /**
         * @description 某一月的最后一天
         * @param {Number} MM 前后几月（正数代表后几个月，负数代表前几个月），默认本月（0）
         * @param {Date} time 时间、时间字符串、时间戳
         * @param {String} format 时间格式，默认'YYYY-MM-DD'
         * @return {String} 格式化后的时间
         */
        date_endOfMonth: function(MM, time, format) {
            MM = !isNaN(parseInt(MM)) ? parseInt(MM) : 0
            time = time ? new Date(time) : new Date()

            time.setMonth(time.getMonth() + MM + 1, 0)
            return this.date_format(time, format)
        },
        /**
         * @description 某一周的第一天（默认星期一）
         * @param {Number} WW 前后几周（正数代表后几周，负数代表前几周），默认本周（0）
         * @param {Date} time 时间、时间字符串、时间戳
         * @param {String} format 时间格式，默认'YYYY-MM-DD'
         * @return {String}
         */
        date_startOfWeek: function(WW, time, format) {
            WW = !isNaN(parseInt(WW)) ? parseInt(WW) : 0
            time = time ? new Date(time) : new Date()

            var curWW = time.getDay()
            curWW = curWW === 0 ? 7 : curWW
            time.setDate(time.getDate() + 7 * WW - (curWW - 1))
            return this.date_format(time, format)
        },
        /**
         * @description 某一周的最后一天（默认星期日）
         * @param {Number} WW 前后几周（正数代表后几周，负数代表前几周），默认本周（0）
         * @param {Date} time 时间、时间字符串、时间戳
         * @param {String} format 时间格式，默认'YYYY-MM-DD'
         * @return {String}
         */
        date_endOfWeek: function(WW, time, format) {
            WW = !isNaN(parseInt(WW)) ? parseInt(WW) : 0
            time = time ? new Date(time) : new Date()

            var curWW = time.getDay()
            curWW = curWW === 0 ? 7 : curWW
            time.setDate(time.getDate() + 7 * WW - (curWW - 1) + 6)
            return this.date_format(time, format)
        },
        /**
         * @description 前后几天的日期（几小时、几分钟均可）
         * @param {Number} DD 前后几天（正数代表后几天，负数代表前几天），默认过去一周的日期（-6）
         * @param {Date} time 时间、时间字符串、时间戳
         * @param {String} format 时间格式，默认'YYYY-MM-DD'
         * @return {String} 格式化后的时间
         */
        date_otherDate: function(DD, time, format) {
            DD = !isNaN(parseFloat(DD)) ? parseFloat(DD) : -6
            time = time ? new Date(time) : new Date()

            time.setTime(time.getTime() + DD * (24 * 3600 * 1000))
            return this.date_format(time, format)
        },
        /**
         * @description 两个日期之间相差多少天
         * @param {Date} date1
         * @param {Date} date2
         * @return {Number}
         */
        date_howManyDays: function(date1, date2) {
            var ret = ''
            var timestamp1 = Date.parse(date1)
            var timestamp2 = Date.parse(date2)
            var dateSpan = Math.abs(timestamp2 - timestamp1)
            ret = Math.floor(dateSpan / (24 * 3600 * 1000))
            return ret
        },
        /**
         * @description 两个日期之间相差多少月
         * @param {Date} date1
         * @param {Date} date2
         * @return {Number}
         */
        date_howManyMonths: function(date1, date2) {
            var months1, months2, ret
            date1 = new Date(date1)
            date2 = new Date(date2)
            months1 = date1.getFullYear() * 12 + date1.getMonth() + 1
            months2 = date2.getFullYear() * 12 + date2.getMonth() + 1
            ret = Math.abs(months1 - months2)
            return ret
        },
        /**
         * @description 查询两个日期之间的所有日期
         * @param {Date} date1
         * @param {Date} date2
         * @return {Array}
         */
        date_getDatesBetween: function(date1, date2, format) {
            format = format || 'YYYY-MM-DD'

            var start, len
            var ret = []
            start = Date.parse(date1) < Date.parse(date2) ? date1 : date2
            // 所有天
            if (format.indexOf('DD') > -1) {
                len = this.date_howManyDays(date1, date2)
                for (var i = 0; i <= len; i++) {
                    ret.push(this.date_otherDate(i, start, format))
                }
            }
            // 所有月
            else {
                len = this.date_howManyMonths(date1, date2)
                for (var j = 0; j <= len; j++) {
                    ret.push(this.date_otherMonth(j, start, format))
                }
            }
            return ret
        },
        
        /**
         * @description 获取url参数
         * @param {String} name 参数名，不传则返回所有参数的对象
         * @param {String} url url地址，不传则取当前地址
         * @param {String} decode 是否转义
         * @return {String Object}
         */
         url_getParams: function(name,url,decode) {
            let search = "";
            if (url) {
                search = url.split('?')[1];
            }
            else{
                search = window.location.search.substring(1) ? window.location.search.substring(1) : window.location.hash.split('?')[1];
            }
            if (search) {
                if(decode && decode==true){
                    search=decodeURIComponent(search);
                }
                let obj = JSON.parse('{"' + search.replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
                return name ? obj[name] : obj
            }
        },
        /**
         * @description url地址处理
         * @param {Object} {"url":"地址","name":"参数名","val":"参数值","ty":1添加/修改2删除}
         * @return {Object} {"newUrl":"新地址","url":"不带参地址","params":参数对象}
         */
        url_do:function(obj) {
            var url=obj.url ? obj.url : window.location.href;
            var paramName=obj.name;
            var ty=obj.ty ? obj.ty : 0;
            var reObj ={"newUrl":url,"url":url,"params":{}};
            if (url.indexOf("?") != -1) {
                let urlAry=url.split("?");
                reObj.url=urlAry[0];
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
        },
        /**
         * @description 页面跳转（参数传递）
         * @param {String} url 目标地址
         * @return {Object} param 参数对象
         */
        url_jump: function(url, param) {
            if (param) {
                url = url + '?' + this.object_serialize(param)
            }
            window.location.href = url
        },
        /**
         * @description 页面跳转（需跳回）
         * @param {String} url 目标地址
         * @param {String} referrerURL 源地址，默认当前页面的地址
         */
        url_jumpFromReferrer: function(url, referrerURL) {
            referrerURL = referrerURL || window.location.href
            window.location.href = url + '?' + encodeURIComponent('referrer=' + referrerURL)
        },
        /**
         * @description 跳回到之前的页面
         */
        url_jumpToReferrer: function() {
            var search = decodeURIComponent(window.location.search)
            var url = search.split('referrer=')[1]
            window.location.href = url
        },

        /**
         * @description base64 编码
         * @param {input}
         */
        base64_encrypt: function(input) {
            var str = CryptoJS.enc.Utf8.parse(input)
            var base64 = CryptoJS.enc.Base64.stringify(str)
            return base64
        },
        /**
         * @description base64 解码
         * @param {input}
         */
        base64_decrypt: function(input) {
            return CryptoJS.enc.Base64.parse(input).toString(CryptoJS.enc.Utf8)
        },


        // 验证手机号码
        validate_mobile: function(input) {
            return /^1[34578][0-9]{9}$/.test(input)
        },
        // 验证座机号码
        validate_fixedPhone: function(input) {
            return /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(input)
        },
        // 验证手机或者座机号码
        validate_phone: function(input) {
            return this.validate_mobile(input) || this.validate_fixedPhone(input)
        },
        // 验证邮箱号码
        validate_email: function(input) {
            // ^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$
            return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(input)
        },
        // 验证身份证号码
        validate_IDcard: function(input) {
            return /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(input)
        },
        // 验证 url
        validate_url: function(input) {
            return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(input)
        },
        // 验证数字
        validate_number: function(input) {
            return /^(\+|-)?((0)|([1-9][0-9]*))$|^(\+|-)?((0)|([1-9][0-9]*)).[0-9]+$/.test(input)
        },
        // 验证整数（不包括0）
        validate_integer: function(input) {
            return /^(\+|-)?[1-9][0-9]*$/.test(input)
        },
        // 验证正整数（不包括0）
        validate_positiveInteger: function(input) {
            return /^\+?[1-9][0-9]*$/.test(input)
        },
        // 验证正数（不包括0）
        validate_positive: function(input) {
            return /^[1-9][0-9]*$|^((0)|([1-9][0-9]*)).[0-9]+$/.test(input)
        },
        // 验证精确到几位小数的正数（不包括0）
        validate_positiveToFixed: function(input, digits) {
            digits = digits || 2
            var reg = new RegExp('^[1-9][0-9]*$|^((0)|([1-9][0-9]*)).[0-9]{' + digits + '}$')
            return reg.test(input)
        },

        
        /**
         * @description 获取元素的长度
         * @param {*} source
         * @return {Number}
         */
         len: function(source) {
            if (source === undefined || source === null) return 0
            if (this.is_string(source) || this.is_array(source)) return source.length
            if (this.is_object(source)) {
                var len = 0
                this.obj_forEach(source, function(key, value) {
                    len++
                })
                return len
            }
        },
        /**
         * @description 根据手机设备调取相机
         * <input type="file" capture="camera" accept="image/*" multiple="multiple">
         * Android：加上 capture 属性，可以同时调用相册和相机，否则只能调用相册；
         * IOS：    加上 capture 属性，只能调相机，反之可以同时调用相册和相机。二者在 capture="camera" 上是相反的
         */
        callCamera: function() {
            if (this.browser_isIOS()) {
                var file = window.document.querySelectorAll('input[capture=camera]')
                for (var i = 0; i < file.length; i++) {
                    file[i].removeAttribute('capture')
                }
            }
        },
        //rgb转16进制
        color_rgbToHex(obj) {
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
        },  
        //rgba转16进制      
        color_rgbaToHex(obj){
            let _this=this;
            let rgba = obj.color;
            let str = rgba.slice(5,rgba.length - 1),
                arry = str.split(','),
                opa = Number(arry[3].trim())*100,
                hex = "#",
                r = Number(arry[0].trim()),
                g = Number(arry[1].trim()),
                b = Number(arry[2].trim());
            
            hex += ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
            
            return {hex,opa};
        },
        //16进制转rgb
        color_hexToRgb(obj) {
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
        },
        /**
         * @description 16进制转rgba
         * @param {string} color 16进制颜色 #000000
         * @param {string} opa 透明度
         * @return {string} rgba
         */
        color_hexToRgba(obj) {
            let {color,opa}=obj;
            let newColor = 'rgba(';
        
            //判断是三位还是六位
            if(color.length === 4){
                let arry = [];
        
                for(let i = 1;i < color.length;i++){
                    arry.push(parseInt("0x" + color[i] + color[i]));
                }
        
                arry.forEach(function(item){
                    newColor += item + ', ';
                });
                newColor += opa/100 + ')';
        
                return newColor;
            }else{
                let arry = [];
        
                for(let i = 1;i < color.length;i += 2){
                    arry.push(parseInt("0x" + color.slice(i,i+2)));
                }
        
                arry.forEach(function(item){
                    newColor += item + ', ';
                });
                newColor += opa/100 + ')';
        
                return newColor;
            }
        },
        
        //是否横屏
        screen(){
            let reObj={"orientation":0};
            if (window.orientation === 180 || window.orientation === 0) {//竖屏 
                reObj.orientation=0;
            };
            if (window.orientation === 90 || window.orientation === -90 ){//横屏 
                reObj.orientation=1;
            }  
            return reObj;
        },
        //全屏/退出全屏
        fullscreen: function(obj){
            let _this=this;
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
            if (obj.callBack && _this.is_function(obj.callBack)) {
                obj.callBack({"isFullScreen":isFullScreen});
            }
        },
        //全屏-是否支持全屏
        fullscreen_enabled: function(obj){
            let isEnabled= document.fullscreenEnabled ||  document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled || false;
            return isEnabled;
        },
        //全屏-是否全屏
        fullscreen_status: function(obj){
            document.fullscreenElement    ||
                    document.msFullscreenElement  ||
                    document.mozFullScreenElement ||
                    document.webkitFullscreenElement || false;
            let isFullScreen = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
            return isFullScreen;
        },
        //全屏-获取全屏div
        fullscreen_div: function(obj){
            let div=document.fullscreenElement    || document.msFullscreenElement  || document.mozFullScreenElement || document.webkitFullscreenElement || false;
            return div;
        },
        //全屏-事件监听
        fullscreen_event: function(obj){
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
                    if (obj.callBack && _this.is_function(obj.callBack)) {
                        obj.callBack({"isFullScreen":isFullScreen});
                    }
                } else { //退出全屏
                //回调
                    if (obj.callBack && _this.is_function(obj.callBack)) {
                        obj.callBack({"isFullScreen":isFullScreen});
                    }
                }
            }
        },
        /**
         * @description 消息
         * @param {string} box 消息要追加的盒子
         * @param {number} fixed 定位方式1:fixed 2:absolute
         * @param {number} type 类型0:文本消息 1:加载
         * @param {string} txt 消息内容
         * @param {string} type icon 加载图
         * @param {string} cls 分类
         * @param {string} bk 背景颜色
         * @param {Number} time 自动消失时间单位毫秒 默认0不消失
         * @return 
        */
        msg: function(params){
            let _this = this;
            let {box="body",fixed=1, type=0,txt="",icon="",bk="transparent",cls="",time=0,evt=1}=params;
            let boxObj=typeof box=="string" ? $(box) : box;
            let position= fixed==1 ? "fixed" : "absolute";
            let pointerEvents= evt==1 ? "auto" : "none";
            let dom=$(".trpm-msg");
            dom.remove();
            let _html=`<div class="info">${txt}</div>`;
            if(type==1){
                _html=`<div class="load"><img class="icon" src="${icon}"/></div>`;
            }
            boxObj.append(`<div class="trpm-msg ${cls}" style="position:${position};pointer-events:${pointerEvents};">
                <div class="bk" style="background-color:${bk};"></div>
                <div class="m">${_html}</div>
            </div>`);

            dom=$(".trpm-msg");
            if(time>0){
                setTimeout(function(){
                    dom.fadeOut(1000,function(){
                        dom.remove();
                    })
                },time);
            }            
        },
        /**
         * @description 关闭
         * @param {string} ele dom类名/id
         * @param {number} type 要删除类型 1消息
         * @return 
        */
        close: function(params){
            let _this = this;
            let {ele,type=1}=params;
            if(ele){
                $(ele).remove();
            }
            else{
                if(type==1){
                    $(".trpm-msg").remove();
                }
            }
        },
        /**
         * @description 提示消息
         * @param {number} direction 方向1上2右3下4左
         * @param {number} space 间距
         * @param {string} tgt 目标ele
         * @param {string} id 消息id
         * @param {string} sty 消息类
         * @param {string} txt 消息内容
         * @param {number} arrow 是否显示箭头
         * @param {function} callBack 回调函数
         * @return 
        */
        tips: function(params){
            let _this=this;debugger
            let {direction=1,space=6,txt="",tgt,arrow=1,id="",sty="fixed",callBack}=params;
            let dom=$("#"+id);
            if(dom.length==0){
                $("body").append(`<div class="trpm-tips ${sty}" id="${id}"><span class="arrow"></span><div class="m">${txt}</div></div>`);
            }
            else{
                dom.addClass(sty).find(".m").html(txt);
            } 
            dom=$("#"+id);
            if(arrow==1){
                dom.find(".arrow").css("opacity",1);
            }            
            let [tips_w,tips_h,tgt_w,tgt_h,tgt_left,tgt_top,lf,tp]=[
                dom.outerWidth(true),
                dom.outerHeight(true),
                $(tgt).outerWidth(),
                $(tgt).outerHeight(),
                $(tgt).offset().left,
                $(tgt).offset().top,
                0,0];
            if(direction==1){//上
                lf=tgt_left+tgt_w/2-tips_w/2;
                tp=tgt_top-tips_h-space;
                dom.find(".arrow").attr("class","arrow");
            }
            else if(direction==2){//右
                lf=tgt_left+tgt_w+space;
                tp=tgt_top+tgt_h/2-tips_h/2;                
                dom.find(".arrow").attr("class","arrow arrowRg");
            }
            else if(direction==3){//下
                lf=tgt_left+tgt_w/2-tips_w/2;
                tp=tgt_top+tgt_h+space;
                dom.find(".arrow").attr("class","arrow arrowBm");
            }
            else if(direction==4){//左
                lf=tgt_left-tips_w-space;
                tp=tgt_top+tgt_h/2-tips_h/2;   
                dom.find(".arrow").attr("class","arrow arrowLf");
            }
            // console.log(tips_w+"|"+tips_h+"|"+tgt_w+"|"+tgt_h+"|"+tgt_left+"|"+tgt_top+"|"+lf+"|"+tp);
            dom.css({"left":lf+"px","top":tp+"px","opacity":1});

            if(callBack && typeof callBack=='function'){
                callBack({id,lf,tp});
            }
        }

    }

    window.trpm = trpm_util;
    trpm.init().then(function(res){
        // console.log("文件加载完成");
    }).catch(function(rej){
        console.log(rej);
    });
})(window);