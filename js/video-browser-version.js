/**
 * 设置为True,当滚动到显示界面该视频自动播放（以最居中为标准），其他视频自动暂停。
 * 设置为false,该功能不生效
 */
var isNeedScrollPlay = false;
/**
 * 设置为True,当前视频正在播放，滚动出界面视频自动暂停，恢复到界面自动播放。
 * 设置为False,该功能不生效。
 */
var isNeedScrollPause = false;
/**
 * 初始化video
 * 给video动态设置ID，动态设置大小，
 * 设置播放按钮的显示和隐藏
 * 滚动监听，滚动到哪播放到哪
 */
function initVideo(isAutoPlay1, isAutoPause1) {
    if (isHasVideoElement()) {
        var options ={};
		isNeedScrollPlay = isAutoPlay1;
		isNeedScrollPause = isAutoPause1;
        var videos = document.querySelectorAll("video");
        var players = new Array(videos.length);
        isClickPause = new Array(videos.length);
        isAutoPause = new Array(videos.length);
        for(var i = 0; i < videos.length;i++){
            var video = videos[i];
            var ID = "my-player"+i;
            video.classList.add("video-js", "vjs-default-skin", "vjs-big-play-centered");
            video.id = ID;
           // video.className ="video-js vjs-default-skin vjs-big-play-centered";
            var onPlayerReady = (i===0 ? function () {
                this.play();
            } :function () {});
            var player = videojs(ID, options, onPlayerReady);
            players[i] = player;
            enableInlineVideo(video);
            setVideoRect(player);
            addDisplayBigPlayBtnEvent(player,i);
            modifyVideoPoster(video);
            addScrollListener(videos,players);
        }

    }

}


var isAutoPause;
var isClickPause;
var isAutoPlay;
var isAutoPause2;
var autoPausePosition;

/**
 * 浏览器版本判断
 * */
var browser = {
    versions: function () {
        var u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*!/) || !!u.match(/AppleWebKit/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            mac: u.indexOf('Mac') > -1,  //是否是mac
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};


/**
 * 设置视频的宽高
 */
function setVideoRect(player) {

    var rect = getVideoRect(player.width(),player.height());
    player.width(rect.width);
    player.height(rect.height);
}

/**
 * 获取视频的宽高
 */
function getVideoRect(width, height) {

    var screenWidth = document.body.clientWidth;
    var realWidth, realHeight;
    if (browser.versions.iPhone) {  //iphone
        realWidth = screenWidth;
        realHeight = height * screenWidth / width;
    } else if (browser.versions.android) {  //android
        realWidth = screenWidth;
        realHeight = height * screenWidth / width;
    } else { //其他浏览器
        realWidth = screenWidth / 2;
        var halfScreenWidth = (screenWidth / 2);
        realHeight = height * halfScreenWidth / width;
    }
    var rect = {width: realWidth, height: realHeight};
    return rect;
}
/**
 *
 * @returns 是否有视频Video元素
 */
function isHasVideoElement() {
    var video = document.querySelector('video');
    if (video !== null && video !== undefined) {
        return true;
    }
    return false;
}



/**
 * 增加网页滚动监听，视频不在当前网页上显示，则暂停
 * 出现在网页显示，则继续播放，但如果是用户手动点击暂停，网页显示视频不会继续播放。
 * @param player
 */
function addScrollListener(videos,players) {

    if(isNeedScrollPause || isNeedScrollPlay) {

        window.onscroll = function () {

            var isPlay = false;
            for (var i = 0; i < videos.length; i++) {
                var video = videos[i];
                var player = players[i];
                var centerY = getElementViewTop(video);
                if (isDisplayScreen(centerY, player)) {
                    if (isNeedScrollPlay) {
                        if (!isPlay) {
                            var disCenter = displayScreenCenter(centerY);
                            if (i + 1 < videos.length) {
                                var nextVideo = videos[i + 1];
                                var nextCenterY = getElementViewTop(nextVideo);
                                var nextPlayer = players[i + 1];
                                if (isDisplayScreen(nextCenterY, nextPlayer)) {
                                    var disNextCenter = displayScreenCenter(nextCenterY);
                                    if (disNextCenter < disCenter) {
                                        pauseVideo(video, player, i);
                                        continue;
                                    }
                                }
                            }
                            var clickPause = isClickPause[i];
                            if (video.paused && (clickPause === null || clickPause === undefined || !clickPause)) {
                                isAutoPlay = true;
                                player.play();
                            }
                            isPlay = true;
                        } else {
                            pauseVideo(video, player, i);
                        }
                    }
                    if (isNeedScrollPause) {
                        if (autoPausePosition !== undefined && i === autoPausePosition) {
                            player.play();
                        } else {
                            pauseVideo(video, player, i);
                        }
                    }
                } else {
                    pauseVideo(video, player, i);
                }

            }

        }
    }

}
/**
 * 暂停所有的视频播放
 * 提供给客户端调用
 */
function pauseAllVideo() {

    var videos = document.querySelectorAll("video");
    for(var i = 0; i <videos.length;i++){
        var video = videos[i];
        if(!video.paused){
            video.pause();
        }
    }
}

/**
 * 暂停视频播放
 * @param video
 * @param player
 * @param position
 */
function pauseVideo(video,player,position) {
    if(!video.paused){
        isAutoPause[position] = true;
        isAutoPause2 = true;
        player.pause();

    }
}

/**
 * 判断是否显示在屏幕上
 * @param centerY
 * @param player
 * @returns {boolean}
 */
function isDisplayScreen(centerY,player) {
    //滚动条高度+视窗高度 = 可见区域底部高度
    var visibleBottom = window.scrollY + document.documentElement.clientHeight;
    //可见区域顶部高度
    var visibleTop = window.scrollY;
    return centerY > visibleTop - player.width() / 2 && centerY < visibleBottom;
}

/**
 * 测量到屏幕中间的距离。
 * @param centerY
 * @returns {number}
 */
function displayScreenCenter(centerY) {
    //滚动条高度+视窗高度 = 可见区域底部高度
    var visibleBottom = window.scrollY + document.documentElement.clientHeight;
    //可见区域顶部高度
    var visibleTop = window.scrollY;
    var center = (visibleBottom +visibleTop)/2;
    return Math.abs(centerY -center);
}

/**
 * 添加显示和隐藏大播放按钮事件
 * @param player
 * @param position
 */
function addDisplayBigPlayBtnEvent(player,position) {

    player.on('play', function () {
        controlBigPlayBtn(position,false);
        if(!isAutoPlay){
            var videos = document.querySelectorAll("video");
            for(var i = 0; i <videos.length;i++){
                if(i !== position){
                    var video = videos[i];
                    if(!video.paused){
                        video.pause();
                    }
                }
            }
        }
        autoPausePosition = position;
        isAutoPlay = false;
        //isClickPause[position] = false;

    });
    player.on('pause', function () {
        controlBigPlayBtn(position,true);
        var autoPause = isAutoPause[position];
        if(autoPause === null || autoPause === undefined || !autoPause){
            isClickPause[position] = true;
        }
        if(!isAutoPause2 && autoPausePosition === position){
            autoPausePosition = undefined;
        }
        isAutoPause2 = false;

    });
}
/**
 * 当视频默认封面为空时，先取第一帧，
 * 如果没有，再取第一张图片代替
 */
function modifyVideoPoster(video) {

    var poster = video.poster;
        if (isEmpty(poster)) {
            poster = getFirstImgSrc();
        }
    if (!isEmpty(poster)) {
        video.poster= poster;
    }

}


/**
 * 获取第一张图片地址
 */
function getFirstImgSrc() {
    var imgs = document.querySelectorAll('img');
    if (!Array.prototype.isPrototypeOf(imgs) && imgs.length !== 0) {
        for(var i = 0; i < imgs.length;i++){
            var img = imgs[i];
            if (!isEmpty(img.src)) {
                return img.src;
            }
        }
    }
    return null;
}

/**
 * 控制显示和隐藏大播放按钮
 * @param isShow
 */
function controlBigPlayBtn(position,isShow) {

    var bigPlayButtons = document.querySelectorAll(".vjs-big-play-button");
    var bigPlayButton = bigPlayButtons[position];
    if (isShow) {
        bigPlayButton.style.display = "block";
    } else {
        bigPlayButton.style.display = "none";
    }
}
/**
 * 获取元素到顶部的距离
 * @param element
 * @returns {number}
 */
function getElementViewTop(element){
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null){
        actualTop += current. offsetTop;
        current = current.offsetParent;
    }
    if (document.compatMode == "BackCompat"){
        var elementScrollTop=document.body.scrollTop;
    } else {
        var elementScrollTop=document.documentElement.scrollTop;
    }
    return actualTop-elementScrollTop;
}
/**
 * 判断字符串是否为空
 * @param str
 * @returns 是否为空
 */
function isEmpty(str) {
    return (str === null || str === undefined || str.length === 0);
}
