/**
* Author: 倘若飘邈 <940461709@qq.com>
*/

//定位模块
var module_location={
	data: {
		window_w: $(window).innerWidth(),
		window_h: $(window).innerHeight()
	},
	//PC定位
	pc_location: function(obj){
		var _this = this;
	},
	//微信定位(需要先引用微信js)
	wx_location: function(obj){
		var varObj=$.extend({
			"params" {},
			"callback": function () { }    //回调函数
		}, obj);
		wx.getLocation({
			type: 'gcj02',
			success: function (res) {
				// $.toast(JSON.stringify(res),"text");
				var backParams={"status":1,"info":"定位成功","data":{"longitude":res.longitude,"latitude":res.latitude}};
				if ($.isFunction(varObj.callBack)) {
					varObj.callBack(backParams);
				}
			},
			cancel: function (res) {
				var backParams={"status":0,"info":"您拒绝了获取授权或其他原因导致位置授权失败","data":null};
				if ($.isFunction(varObj.callBack)) {
					varObj.callBack(backParams);
				}
			}
		});
	},
	//高德定位（需要先引用高德js）
	amap_location: function(obj){
		var varObj=$.extend({
			"params" {
				enableHighAccuracy: true,//是否使用高精度定位，默认:true
				timeout: 3000,          //超过10秒后停止定位，默认：5s
				buttonPosition:'LB',    //定位按钮的停靠位置
				panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
				zoomToAccuracy: false,   //定位成功后是否自动调整地图视野到定位点
			},
			"callback": function () { }    //回调函数
		}, obj);
		var backParams={"status":0,"info":"定位异常","geolocation":null,"data":null};
		AMap.plugin('AMap.Geolocation', function() {
			var geolocation = new AMap.Geolocation(varObj.params);
			geolocation.getCurrentPosition(function(status,result){
				console.log(result);
				if(status=='complete'){
					backParams={"status":1,"info":"定位成功","geolocation":geolocation,"data":result.position};
					if ($.isFunction(varObj.callBack)) {
						varObj.callBack(backParams);
					}
				}
				else{
					AMap.plugin('AMap.CitySearch', function () {
						var citySearch = new AMap.CitySearch()
						citySearch.getLocalCity(function (status, result) {
							console.log(result);
							var bounds=result.bounds;
							if (status === 'complete' && result.info === 'OK') {
								var position={"lng":(bounds.northeast.lng+bounds.southwest.lng)/2,"lat":(bounds.northeast.lat+bounds.southwest.lat)/2};
								backParams={"status":1,"info":"定位成功","geolocation":geolocation,"data":position};
							}
							else{
								backParams={"status":0,"info":"定位失败","geolocation":geolocation,"data":null};
							}
							if ($.isFunction(varObj.callBack)) {
								varObj.callBack(backParams);
							}
						})
					})
				}
			});
		});
	}
}

/*微信定位 需要先引用<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
module_location.wx_location({
	"callBack":function(){
		console.log("定位后回调我了");
	}
});*/
/*高德定位 需要先引用<script src="https://webapi.amap.com/maps?v=1.4.14&key=013322815f86b738b1a2f594dc3598d3"></script>
module_location.amap_location({
	"params" : { //定位参数可不传
		enableHighAccuracy: true,//是否使用高精度定位，默认:true
		timeout: 3000,          //超过10秒后停止定位，默认：5s
		buttonPosition:'LB',    //定位按钮的停靠位置
		panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
		zoomToAccuracy: false,   //定位成功后是否自动调整地图视野到定位点
	},
	"callBack":function(){
		console.log("定位后回调我了");
	}
});*/