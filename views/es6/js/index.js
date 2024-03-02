(function(){
    var index_Module={
        data: {
        },
        //初始化
        async init(obj){
            var _this=this;
            //故事线
            // _this.storyLine()
            // .then(function(res){
            //     // console.log(res);
            //     console.log(res.info);
            // })
            // .catch(function(rej){
            //     console.log(rej);
            // });

            //故事线
            let res=await _this.storyLine().catch(function(rej){
                 console.log(rej);
             });
            console.log(res.info);
            
        },
        //故事线
        async storyLine(obj){
            var _this=this;
            let pm=new Promise(function(resolve,reject){
                setTimeout(function(){
                    resolve({"info":"async 成功"});
                },3000);
            });
            return pm;
        }
    }
    
    index_Module.init();
    // return window.indexModule=index_Module;
}())
