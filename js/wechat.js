var foo = {};
foo.init = function () {
    this.getConfig();
};
//白名单验证
foo.getConfig = function () {
    var appId, timestamp, nonceStr, signature, shareData;
    var that = this;
    $.getJSON("http://wechat.yhd.com/wechat/getWeixinConfig.do?url=" + encodeURIComponent(window.location.href)
        + "&callback=?", function (msg) {
        if (parseInt(msg.rtn_code) == 1) {
            var data = msg.data;
            appId = data.appId;
            timestamp = data.timestamp;
            nonceStr = data.nonceStr;
            signature = data.signature;
        }
        wx.config({
            debug: false,
            appId: appId,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        });

        setTimeout(function () {
            that.share();
        }, 800);


    });
};


foo.share = function () {
    $.getJSON('http://120.132.50.71/wxms/getWeiXinShareByProjectId?projectId=' + projectId + '&callback=?',
        function (data) {
            var json = {};
            if (data.model.length > 0) {
                json = data.model[0];
            }

            var title = json.title || '微信分享',
                text = json.desc || '微信分享',
                picture = json.imgUrl || 'http://d9.yihaodianimg.com/N02/M02/40/EB/CgQCsFLVBOOAE0boAAAK5UNpfUI56300.png';
            foo.shareJson = {
                "title": title,
                "text": text,
                "picture": picture
            };
            //that.getConfig();
            //分享接口调用
            wx.onMenuShareAppMessage({
                title: foo.shareJson.title,
                link: window.location.href,
                imgUrl: foo.shareJson.picture,
                desc: foo.shareJson.text

            });
            wx.onMenuShareTimeline({
                title: foo.shareJson.title,
                link: window.location.href,
                imgUrl: foo.shareJson.picture,
                desc: foo.shareJson.text
            });
        });

};