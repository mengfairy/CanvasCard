/**
 * Created with JetBrains WebStorm.
 * User: wangmeng
 * Date: 2017/2/20
 * Time: 13:11
 * Desc: ����Canvas�Ĺν����
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
            alert('�Բ��������������֧�ֹιο�����');
            return false;
        }
        if(!options.element || ! options.bgPic || !options.upPic){return false}
        if(!document.getElementById(options.element)){return false}
        this.option = options;
        this.initCanvas(true);
    };
    card.prototype = {
        eventBind: function(){//���¼���touchstart,touchmove,touchend�Ĳ���
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
                if(mousedown){//touchmove��ʱ���ж��Ƿ��£�
                    if(e.changedTouches){
                        /*changedTouches�����һ�δ������¼�����ָ��Ϣ����������ָͬʱ�����¼���
                         2����ָ���������ڣ�������Ϊ2��������Ⱥ��뿪�ĵĻ����ͻ��ȴ���һ���ٴ���һ�Σ������length����1��
                         ֻͳ�����µģ�PS��һ��changedTouches��length����1��*/
                        e = e.changedTouches[e.changedTouches.length - 1];
                    }
                    var x= e.clientX+document.body.scrollLeft - _this.canvas.offsetLeft;
                    var y= e.clientY+document.body.scrollTop - _this.canvas.offsetTop;
                    _this.drawPoint(x,y);//���û��ƽ���Բ����
                }
            }
            _this.canvas.addEventListener('touchstart',eventDowm);
            _this.canvas.addEventListener('touchend',eventUp);
            _this.canvas.addEventListener('touchmove',eventMove);
            _this.canvas.addEventListener('mousedown',eventDowm);
            _this.canvas.addEventListener("mouseup",eventUp);
            _this.canvas.addEventListener('mousemove',eventMove);
            window.addEventListener("resize",function(){clearTimeout(_this.time),_this.time=setTimeout(_this.initCanvas.bind(_this),300)},false);
        },
        drawPoint: function(x,y){
            /*http://www.cnblogs.com/tim-li/archive/2012/08/06/2580252.html#11
             * �����ַ��canvas���Ļ��������Կ���*/
            this.cxt.globalCompositeOperation = 'destination-out';//����Ҫ��һ��������canvas��ϻ���ͼ��ʱ��ʾ��ʽ
            /*���ƿ�ʼ��*/
            this.cxt.beginPath();
            var g1 = this.cxt.createRadialGradient(x,y,0,x,y,30);
            g1.addColorStop(0, 'rgba(0,0,0,1)');
            g1.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.cxt.fillStyle = g1;
            this.cxt.arc(x, y, 30, 0, Math.PI * 2, true);
            this.cxt.closePath();
            this.cxt.fill();
        },
        initCanvas: function(first){
            console.log(first);
            var s =this;
            var img = new Image(),obj=document.getElementById(s.option.element),width=obj.offsetWidth,height=obj.offsetHeight;
            img.src=s.option.upPic;//����Ҫ���Ƶ�����ͼƬ��·��
            s.canvas = obj.getElementsByTagName("canvas")[0];
            if(!s.canvas){
                var newCanvas = document.createElement("canvas");
                obj.appendChild(newCanvas);
                s.canvas = newCanvas;
            }
            /*canvas��ʽ����*/
            s.canvas.setAttribute('width',width+'px');
            s.canvas.setAttribute('height',height+'px');
            s.canvas.style.backgroundImage = "url('"+s.option.bgPic+"')";
            s.canvas.style.backgroundColor = 'transparent';
            s.canvas.style.backgroundSize = "cover";
            s.canvas.style.backgroundRepeat = "no-repeat";
            s.canvas.style.backgroundPosition = "center";
            img.onload = function(){//ͼƬ������ɣ�����
                s.cxt = s.canvas.getContext("2d");
                s.cxt.drawImage(img,0,0,img.width,img.height,0,0,width,height);
                first ? s.eventBind():null;//�״λ�����ɣ����¼��������ظ���
            }
        }
    };
    return card;
});
