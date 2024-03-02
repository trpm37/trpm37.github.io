	//音乐模块
	var module_music={
		data:{
			"dom_obj": null, //需要id对象
			"status": 0, //状态:-1自动,0停止,1播放,2暂停
			"callBack": function () { }    //回调函数
		},
		//控制
		control: function(obj){
			var _this=this;
			var domObj=$("#"+obj.dom_id);
			_this.data.dom_obj = domObj;
			_this.data.callBack=obj.callBack;
			if(domObj.length==0){
				var backParams={"status":0,"info":"无音乐文件","data":null};
				if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
					_this.data.callBack(backParams);
				}
			}
			else if(!domObj.attr("src")){
				var backParams={"status":0,"info":"无音乐地址","data":null};
				if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
					_this.data.callBack(backParams);
				}
			}
			else{
				if(obj.status==0){
					_this.stop();
				}
				else if(obj.status==1){
					_this.play();
				}
				else if(obj.status==2){
					_this.pause();
				}
				else{
					_this.auto();
				}
			}
		},
		//播放
		play: function(obj){
			var _this = this;
			var domObj = _this.data.dom_obj.get(0);
			domObj.play();
			_this.data.status=1;
			var backParams={"status":1,"info":"正在播放","data":{"status":_this.data.status}};
			if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
				_this.data.callBack(backParams);
			}
			console.log("播放"+_this.data.status);
		},
		//暂停
		pause: function(obj){
			var _this = this;
			var domObj = _this.data.dom_obj.get(0);
			domObj.pause();
			_this.data.status=2;
			var backParams={"status":1,"info":"已暂停播放","data":{"status":_this.data.status}};
			if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
				_this.data.callBack(backParams);
			}
			console.log("暂停"+_this.data.status);
		},
		//停止
		stop: function(obj){
			var _this = this;
			var domObj = _this.data.dom_obj.get(0);
			domObj.stop();
			_this.data.status=0;
			var backParams={"status":1,"info":"已停止播放","data":{"status":_this.data.status}};
			if (_this.data.callBack && $.isFunction(_this.data.callBack)) {
				_this.data.callBack(backParams);
			}
			console.log("停止"+_this.data.status);
		},
		//自动
		auto: function(obj){
			var _this = this;
			if(_this.data.status==0){
				_this.play();
			}
			else if(_this.data.status==1){
			   _this.pause();
			}
			else if(_this.data.status==2){
			   _this.play();
			}
		}
	}