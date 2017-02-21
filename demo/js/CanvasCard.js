/**
 * Created with JetBrains WebStorm.
 * User: wangmeng
 * Date: 2017/2/20
 * Time: 13:11
 * Desc: 基于Canvas的刮奖插件
 */
(function(global, factory){
    if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(factory);
    } else {
        global.CanvasCard = factory();
    }
})(this,function(){
    var card = function(options){
        try {
            document.createElement("canvas").getContext("2d");
        } catch (e) {
            alert('对不起，您的浏览器不支持刮刮卡功能');
            return false;
        }
        if(!options.element || ! options.bgPic || !options.upPic){return false}
        if(!document.getElementById(options.element)){return false}
        this.option = options;
        this.initCanvas();
    };
    card.prototype = {
        eventBind: function(){//绑定事件，touchstart,touchmove,touchend的操作
            var _this = this;
            var mousedown = false;
            function eventDowm(e){
                e.preventDefault();
                mousedown = true;
            }
            function eventUp(e){
                e.preventDefault();
                mousedown = false;
            }
            function eventMove(e){
                e.preventDefault();
                if(mousedown){//touchmove的时候判断是否按下，
                    if(e.changedTouches){
                        /*changedTouches：最近一次触发该事件的手指信息比如两个手指同时触发事件，
                         2个手指都在区域内，则容量为2，如果是先后离开的的话，就会先触发一次再触发一次，这里的length就是1，
                         只统计最新的（PS：一般changedTouches的length都是1）*/
                        e = e.changedTouches[e.changedTouches.length - 1];
                    }
                    var x= e.clientX+document.body.scrollLeft - _this.canvas.offsetLeft;
                    var y= e.clientY+document.body.scrollTop - _this.canvas.offsetTop;
                    _this.drawPoint(x,y);//调用绘制渐变圆方法
                }
            }
            _this.canvas.addEventListener('touchstart',eventDowm);
            _this.canvas.addEventListener('touchend',eventUp);
            _this.canvas.addEventListener('touchmove',eventMove);
            _this.canvas.addEventListener('mousedown',eventDowm);
            _this.canvas.addEventListener("mouseup",eventUp);
            _this.canvas.addEventListener('mousemove',eventMove);
            window.addEventListener("resize",function(){clearTimeout(_this.time),_this.time=setTimeout(_this.resetCanvas.bind(_this),300)},false);
        },
        drawPoint: function(x,y){
            /*http://www.cnblogs.com/tim-li/archive/2012/08/06/2580252.html#11
             * 这个网址讲canvas讲的还不错，可以看看*/
            this.cxt.globalCompositeOperation = 'destination-out';//最重要的一步，设置canvas组合绘制图形时显示方式
            /*绘制开始！*/
            this.cxt.beginPath();
            var g1 = this.cxt.createRadialGradient(x,y,0,x,y,30);
            g1.addColorStop(0, 'rgba(0,0,0,1)');
            g1.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.cxt.fillStyle = g1;
            this.cxt.arc(x, y, 30, 0, Math.PI * 2, true);
            this.cxt.closePath();
            this.cxt.fill();
        },
        resetCanvas:function(){
            var _this = this;
            var width = _this.dom.offsetWidth,height = _this.dom.offsetHeight;
            if(width == _this.width && height == _this.height) return false;//如果屏幕变化后容器无变化return
            _this.width = width,_this.height = height;
            var img = new Image();
            img.src = _this.canvas.toDataURL();//涂抹后的图片

            /*canvas样式设置*/
            _this.canvas.setAttribute('width', this.width+'px');
            _this.canvas.setAttribute('height', this.height+'px');

            img.onload = function(){//图片加载完成，绘制
                _this.cxt.drawImage(img,0,0,img.width,img.height,0,0, _this.width, _this.height);
            }
        },
        initCanvas: function(){
            var s =this;
            s.dom = document.getElementById(s.option.element),s.width = s.dom.offsetWidth,s.height = s.dom.offsetHeight;
            var img = new Image();
            img.src=s.option.upPic;//设置要绘制的遮罩图片的路径
            s.canvas = s.dom.getElementsByTagName("canvas")[0];
            if(!s.canvas){
                var newCanvas = document.createElement("canvas");
                s.dom.appendChild(newCanvas);
                s.canvas = newCanvas;
                s.cxt = newCanvas.getContext('2d');
            }
            /*canvas样式设置*/
            s.canvas.setAttribute('width', s.width+'px');
            s.canvas.setAttribute('height', s.height+'px');
            s.canvas.style.backgroundImage = "url('"+s.option.bgPic+"')";
            s.canvas.style.backgroundColor = 'transparent';
            s.canvas.style.backgroundSize = "cover";
            s.canvas.style.backgroundRepeat = "no-repeat";
            s.canvas.style.backgroundPosition = "center";
            img.onload = function(){//图片加载完成，绘制
                s.cxt.drawImage(img,0,0,img.width,img.height,0,0, s.width, s.height);
                s.eventBind();//绑定事件
            }
        }
    };
    return card;
});
