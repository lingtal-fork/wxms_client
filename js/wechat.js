var foo = {};
foo.init = function () {
    this.getConfig();
    this.renderUI();
    this.bindUI();
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

foo.getActivityId = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

foo.bindUI = function () {
    var that = this;

    // $('body').on('click', '.J_login', function(e) {
    // 	e.preventDefault();
    // 	h5tonative.goToNative('yhd://login/', '{"from":"h5"}');
    // });
    $('.J_rules_link').on('click', function (event) {
        event.preventDefault();
        try {
            var spmData = spm.getData($(this));
            spmData.tpa = '7';
            spmData.tpi = '4';
            gotracker("2", "defaultButton", null, spmData);
        } catch (e) {
            console.log(e);
        }
        /* Act on the event */
        var link = $(this).attr('href'), id = that.getActivityId('activityId'), url = link + '?activityId=' + id;
        window.location.href = url;

    });
    $('.J_play_now').on('click', function (e) {
        e.preventDefault();
        window.location.href = 'http://m.yhd.com/mw/d';
    });
    $('.J_intro_share').on('click', function (e) {
        e.preventDefault();
        $('.wechat-share-tips').show();

    });
    $('body').on('click', '.wechat-share-tips', function (event) {
        event.preventDefault();
        /* Act on the event */
        $(this).hide();
    });


};
foo.renderUI = function () {
    var that = this;
    if (that.isLogin = true) {
        setTimeout(that.getList, '1000');
    } else {
        var noLoginHtml = '<div class="gi-notlogin"><img src="http://image.yihaodianimg.com/mobile-ued/luckMoney/img/list_no_login.png"><p>请登录查看历史活动奖品</p><button class="J_login">马上登录</button></div>'
        $('.J_render').html(noLoginHtml);
    }

    $.ajax({
        url: 'http://m.yhd.com/hot/sogift/getGameRuleDetail.action',
        type: 'get',
        dataType: 'json',
        data: {
            activityId: foo.getActivityId('activityId')
        },
        success: function (data) {
            if (data.rtn_code == "1") {
                $('.J_content').html(data.data.content);
            } else {
                $('.J_content').html('<p style="text-align:center;">本次活动解释权均归1号店所有。</p>');
            }
        }
    });


    $.ajax({
        url: 'http://m.yhd.com/hot/sogift/getGameNextTime.action',
        type: 'get',
        dataType: 'json',
        data: {
            activityId: foo.getActivityId('activityId')
        },
        success: function (countDown) {
            if (countDown.rtn_code == 1) {

                var date = countDown.rtn_ext;
                $('.J_date').html(date);
                $('.gi-count-down').css('visibility', 'visible');
            } else {


            }
        }
    });
    $('.gi-firstscreen').css('background-image', 'url(http://image.yihaodianimg.com/mobile-ued/luckMoney/img/gi_back.jpg)')


};

foo.share = function () {
    $.ajax({
        url: 'http://120.132.50.71/wxms/??',
        type: 'get',
        dataType: 'json',
        data: {
            projectId: projectId
        },
        success: function (json) {
            //alert(json.data.sharePic);
            var title = json.data.shareTitle||'微信分享',
                text = json.data.shareDesc||'微信分享',
                picture = json.data.sharePic||'http://d9.yihaodianimg.com/N02/M02/40/EB/CgQCsFLVBOOAE0boAAAK5UNpfUI56300.png';
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
        }
    });

};