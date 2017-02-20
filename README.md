# CanvasCard

基于Canvas的刮奖效果,兼容IE9+，不依赖其他插件。


# Usage

1.引入JS
```javascript
<script type="text/javascript" src="./js/CanvasCard.min.js"></script>
```

2.使用
```javascript
new CanvasCard({
        element:'card-area',//canvas容器元素ID
        bgPic:'./images/card-bottom.png',//bottom图
        upPic:'./images/card-up.png'，//up图
    });
```

# 注意点
canvas宽高是获取容器元素的宽和高，将你需要的宽高设置在父元素样式上即可。
