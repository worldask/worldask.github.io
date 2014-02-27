// 当前页号
var page = 1;
// 每页几条数据
var perPage = 5;
// 主json对象
var objData = {};
// 距底部几像素刷新
var scrollPixles = 20;

$(document).ready(function() {
    // 首次载入，获取主json
    $.ajax({url: "data/main.json", 
        success: function(data) {
            if (typeof(data) == "string") {
                objData = $.parseJSON(data);
            } else {
                objData = (data);
            }
            // 获取第一页数据
            next();

            // 绑定图片点击事件
            $("#container").on("click", "img", function(event) {
                event.preventDefault();

                // 弹出层
                var json = $(this).attr("json");
                pop(json);
            });
        }
    });

    // 绑定下拉事件
    $(window).bind("scroll", function(){
        if( $(document).scrollTop() + $(window).height() > $(document).height() - scrollPixles){
            next();
        }
    });

    // 点击背景层关闭弹出层
    $(document).on("click", function(e) {
        if ($(e.target).closest("#pop").length > 0) {
        } else {
            closePopContainer();
        }
    });
});

var pop = function(json) {
    if (json !== 'undefined' && json !== "") {
        $("#pop").html("");
        showIosNotify("Loading...");

        // 获取作品json
        $.ajax({url: "data/json/" + json,
            success: function(data) {
                $("#backdrop").removeClass("dn");
                $("#popContainer").fadeIn(2000, function() {
                    $("#popContainer").removeClass("dn");
                });

                var popData;
                if (typeof(data) == "string") {
                    popData = $.parseJSON(data);
                } else {
                    popData = data;
                }

                // 先在不可见区域下载图片
                $.each(popData, function(i, v) {
                    $("#invisible").append("<img src='data/images/" + v + "' />");
                });

                // 全部图片下载完成后显示弹出层
                var loadedimages = 0;
                $("#invisible img").load(function() {
                    ++loadedimages; 
                    if(loadedimages == popData.length){
                        hideIosNotify();
                        $("#pop").html($("#invisible").html());
                        $("#invisible").html("");
                    }
                });
            }
        });
    } 
};

// 关闭弹出层
var closePopContainer = function() {
    $("#popContainer").stop();
    $("#popContainer").fadeOut(200, function() {
        $("#backdrop").addClass("dn");
        $("#popContainer").addClass("dn");
    });
};

// 翻页
var next = function() {
    var i = 0;
    i = (page - 1) * perPage;
    
    for (var j = 0; i < objData.length && j < perPage; i++, j++) {
        // 预读取图片宽高，延迟加载图片
        // imgReady("data/images/" + objData[i].cover, function () {
        //     $("#container").append("<img src='js/loader.gif' data-src='data/images/" + objData[i].cover + "' json='" + objData[i].json + "' width='" + this.width + "' height='" + this.height + "' />");
        // });
         $("#container").append("<img src='js/loader.gif' data-src='data/images/" + objData[i].cover + "' json='" + objData[i].json + "' />");
    }
    page++;
    $("img").unveil();
};

// ios风格载入框
var _iosOverlay = null;

var showIosNotify = function(text) {
    if (!_iosOverlay) {
        var opts = {
            lines: 13, // The number of lines to draw
            length: 11, // The length of each line
            width: 5, // The line thickness
            radius: 17, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            color: '#FFF', // #rgb or #rrggbb
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
        };
        var target = document.createElement("div");
        document.body.appendChild(target);
        var spinner = new Spinner(opts).spin(target);
        _iosOverlay = iosOverlay({
            text: text,
            //duration: 2e33,
            spinner: spinner
        });
    } else {
        _iosOverlay.update({
            text:text,
        });
    }
};

var hideIosNotify = function(text, icon) {
    if (_iosOverlay) {
        _iosOverlay.hide();
        _iosOverlay.destroy();
        _iosOverlay = null;
    }
}
