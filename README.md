# Hander-video.js

------
###为什么要写这个js
在Android播放html视频的时候，发现原生的样式有点丑，在Github找到了[Video.js](https://github.com/videojs/video.js)。
<br>
导入之后发现在IOS端会自动全屏，这不是我们想要的效果，结果找到了[iphone-inline-video](https://github.com/bfred-it/iphone-inline-video)完美解决这个问题。
<br>
之后发现视频宽高无法在android端和ios端适配不是很好，视频大小不可以通过后台指定宽高比来自动适配。[Video.js](https://github.com/videojs/video.js)点击暂停不会出现大的暂停按钮，点击视频中间不会暂停，动态设置ＩＤ,还有样式不是很完美。修改样式和源码之后符合我的需求。
<br>
之后发现多个视频可以同时播放，就增加自动暂停，即if当前视频正在播放，滚动出界面视频自动暂停，恢复到界面自动播放，变的人性化了。
<br>
后面又增加自动暂停播放，即if当前视频正在播放，滚动出界面视频自动暂停，恢复到界面自动播放。
还有视频封面，假设没有封面，开始想着取第一帧，失败了，想着在客户端没有封面实在太丑，就默认取查询html 第一张图片SRC给视频封面。


###如何使用
> * 导入css和js
> *   window.onload = function () {
           initVideo(false,true);
        }

![cmd-markdown-logo](https://www.zybuluo.com/static/img/logo.png)
> 说明
initVideo 第一参数:是否自动滚动播放，即if当滚动到显示界面该视频自动播放（以最居中为标准），其他视频自动暂停。
第二个参数:是否自动暂停播放，即if当前视频正在播放，滚动出界面视频自动暂停，恢复到界面自动播放。


------

## 待完善的地方

在android端视频无法自动播放，虽然可以通过注入js的方式，自动播放指定视频，但是自动播放当前显示的视频，确实很难实现，所以推荐使用
initVideo(false,true) 自动暂停模式。







