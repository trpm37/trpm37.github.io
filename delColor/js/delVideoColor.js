(function(){
    class delVideoColor{
        constructor(params){
            this.w=180;
            this.h=320;
            this.videoId="";
            this.video=null;
            this.canvasId="";
            this.cvs=null;
            this.cvsContent=null;
            this.color="";
            this.tolerance=0;
            this.rgba="";
        }
        init(params){
            let _this=this;
            if(params){
                let {w,h,videoId,canvasId,color,tolerance=0}=params;
                _this.w=w;
                _this.h=h;
                _this.videoId=videoId;
                _this.canvasId=canvasId;
                _this.color=color;
                _this.tolerance=tolerance;
            }
            
            _this.cvs = document.getElementById(_this.canvasId);
			_this.cvsContent = _this.cvs.getContext('2d');
            _this.cvs.width = _this.w;
            _this.cvs.height = _this.h;
            _this.rgba= typeof _this.color=="string" ? _this.hexToRgba(_this.color) : _this.color;

            // canvas上绘制图片
            _this.video=document.getElementById(_this.videoId);
            // let tempImg = new Image();
            // tempImg.width = _this.w;
            // tempImg.height = _this.h;
            // tempImg.onload = function () {
            //     _this.cvsContent.drawImage(_this.img, 0, 0,_this.w,_this.h);
            //     // _this.delColor({});
            // };
            // tempImg.src = img.src;
            // _this.img=tempImg;

            _this.event();
        }
        //事件
        event(){
            let _this=this;
            console.log(_this.video);
            // 8、play：播放监听
            _this.video.addEventListener('play', function(e) {
                console.log('提示该视频正在播放中');
                _this.playCallBack();
            })

            let eleColor = document.getElementById('color');
            let eleTolerance = document.getElementById('tolerance');
            let eleButton = document.getElementById('button');
            //确定
            eleButton.onclick = function () {
                let [rgba,tolerance] = [_this.hexToRgba(eleColor.value),eleTolerance.value];
                console.log(eleColor.value,rgba,tolerance);
                _this.rgba=rgba;
                _this.tolerance=tolerance;
                _this.play();
            };

            // 画布取色
            _this.cvs.addEventListener('click', function (event) {
                let rect = this.getBoundingClientRect();
                let x = event.clientX - rect.left;
                let y = event.clientY - rect.top;
                let rgbaPicker = _this.cvsContent.getImageData(x, y, 1, 1).data;
                // color输入框变化
                let strHex = '#';
                for (let i = 0; i < rgbaPicker.length - 1; i++) {
                    let hex = rgbaPicker[i].toString(16);
                    if (hex.length < 2) {
                        hex = '0' + hex;    
                    }
                    strHex += hex;
                }
                eleColor.value = strHex;
                console.log(rgbaPicker,strHex);
            });
        }
        //播放回调
        playCallBack () {
            let _this=this;
            if (_this.video.paused || _this.video.ended) return;
            //去色
            _this.delColor({});
            // 递归调用
            setTimeout(function(){
                _this.playCallBack();
            }, 0);
        }
        //去色
        delColor(params){
            let _this=this;
            let {rgba=_this.rgba,tolerance=_this.tolerance}=params;
            _this.cvsContent.drawImage(_this.video, 0, 0,_this.w,_this.h);
            // 获取像素信息数据
            let imgData = _this.cvsContent.getImageData(0, 0, _this.w, _this.h);
            // 基于原始图片数据处理
			for (let i = 0; i < imgData.data.length; i += 4) {
                let [r,g,b,a]=[
                    imgData.data[i],
                    imgData.data[i + 1],
                    imgData.data[i + 2],
                    imgData.data[i + 3],
                ];
				
				let t=Math.sqrt(
					(r - rgba[0]) ** 2 + 
					(g - rgba[1]) ** 2 + 
					(b - rgba[2]) ** 2
				);
				if (t <= tolerance) {
					imgData.data[i] = 0;
					imgData.data[i + 1] = 0;
					imgData.data[i + 2] = 0;
					imgData.data[i + 3] = 0;
				}
			}
			// put数据
			_this.cvsContent.putImageData(imgData, 0, 0);
        }
        play(params){
            let _this=this;
            _this.video.play();
        }
        pause(params){
            let _this=this;
            _this.video.pause();
        }
        //16进制转rgba
		hexToRgba(hex){
			const rgba = [];
			hex = hex.replace('#', '').padEnd(8, 'F');
			for (let i = 0; i < hex.length; i+=2) {
				rgba.push(parseInt(hex.slice(i, i+2), 16))
			}
			return rgba;
		}
		//rgba转16进制
		rgbaToHex(rgba){
			let hex = '#';
			for (const i of rgba) {
				hex += i.toString(16).padStart(2, '0');
			}
			return hex;
		}
    }
    window.trpm_delVideoColor = delVideoColor;
})()

let delVideoColor=new trpm_delVideoColor();
delVideoColor.init({
    w:668,
    h:927,
    videoId:'video',
    canvasId:"outCvs",
    color:"#25ae3a",
    tolerance:70
});