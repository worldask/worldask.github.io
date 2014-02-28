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

            // 绑定图片onmouseover事件
            $("#container").on("mouseover", ".divImg", function(event) {
                // TODO: 如图片未完全载入，则中止
                event.preventDefault();
                
                // div重新定位
                $(this).css("left", getElementLeft(this));
                $(this).css("top", getElementTop(this));
                $(this).width($(this).children().first().width()); 
                $(this).height($(this).children().first().height()); 
                $($(this).children()[0]).toggleClass("dn");
                $($(this).children()[1]).toggleClass("dn");
            });

            // 绑定图片onmouseout事件
            $("#container").on("mouseout", ".divImg", function(event) {
                event.preventDefault();
                $($(this).children()[0]).toggleClass("dn");
                $($(this).children()[1]).toggleClass("dn");
            });

            // 绑定图片点击事件
            $("#container").on("click", ".divImg", function(event) {
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
    hideIosNotify();
    $("#popContainer").fadeOut(200, function() {
        $("#backdrop").addClass("dn");
        $("#popContainer").addClass("dn");
    });
};

// 翻页
var next = function() {
    var i = 0;
    var text = "";
    i = (page - 1) * perPage;
    
    for (var j = 0; i < objData.length && j < perPage; i++, j++) {
        // 预读取图片宽高，延迟加载图片
       // var item = objData[i];
       //  imgReady("data/images/" + item.cover, function () {
       //      $("#container").append("<div class='divImg' style='width: " + this.width + "; height: " + this.height + "'><img src='static/loader.gif' data-src='data/images/" + item.cover + "' json='" + item.json + "' /></div>");
       //  });
         
         text = objData[i].text;
         if (text == undefined) {
             text = "";
         }
         $("#container").append("<div class='divImg' json='" + objData[i].json + "' id='" + objData[i].cover + "'><img src='static/loader.gif' data-src='data/images/" + objData[i].cover + "' /><div class='divText dn'>" + text + "</div></div>");
    }
    page++;
    $("#container img").unveil();
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

// 获取元素绝对横坐标
function getElementLeft(element){
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null){
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}

// 获取元素绝对纵坐标
function getElementTop(element){
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null){
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}
