// 当前页号
var page = 1;
// 每页几条数据
var perPage = 5;
// 主json对象
var objData = {};
// 距底部几像素刷新
var scrollPixles = 20;
// 当前打开的div
var currentDiv = {};
// 视频格式
var videoFormat = ".mov";

$(document).ready(function() {
    // 首次载入，获取主json
    $.ajax({url: "main.json", 
        success: function(data) {
            if (typeof(data) == "string") {
                objData = $.parseJSON(data);
            } else {
                objData = (data);
            }

            // 获取第一页数据
            next();

            // 绑定图片onmouseover事件
            $("#container").on("mouseover", ".divNode", function(event) {
                event.preventDefault();
                // TODO: 如图片未完全载入，则中止
                
                // 未弹出层时响应
                if ($(this.children[2]).css("display") != "block") {
                    // div重新定位
                    $(this).css("left", getElementViewLeft(this));
                    $(this).css("top", getElementViewTop(this));
                    $(this).width($(this.children[0]).width()); 
                    $(this).height($(this.children[0]).height()); 

                    // 重新设置视频播放器大小
                    if ($(this.children[2].children[0]).is("video") === true) {
                        $(this.children[2].children[0]).attr("width", $(this.children[0]).width());
                        $(this.children[2].children[0]).attr("height", $(this.children[0]).height());
                    }

                    // 切换显示图片或文字说明
                    $(this).children().addClass("dn");
                    $(this.children[1]).removeClass("dn");
                }
            });

            // 绑定图片onmouseout事件
            $("#container").on("mouseout", ".divNode", function(event) {
                event.preventDefault();

                // 未弹出层时响应
                if ($(this.children[2]).css("display") != "block") {
                    $(this).has(".divLink").removeClass("db");
                    $(this).children().addClass("dn");
                    $(this.children[0]).removeClass("dn");
                }
            });

            // 绑定图片点击事件
            $("#container").on("click", ".divNode:has('.divText')", function(event) {
                event.preventDefault();

                // 未弹出层时响应
                if ($(this.children[2]).css("display") != "block") {
                    // 弹出层
                    pop($(this));
                }
            });
        }
    });

    // 绑定下拉事件
    $(window).on("scroll", function(){
        if( $(document).scrollTop() + $(window).height() > $(document).height() - scrollPixles){
            next();
        }
    });

    // 点击背景层关闭弹出层
    $(document).on("click", function(e) {
        if ($(e.target).children().closest(".z1000").length > 0 || $(e.target).children().closest(".divLink").length > 0 || $(e.target).closest("img").length > 0 || $(e.target).closest("video").length > 0) {
        } else {
            closePopContainer();
        }
    });

    // 点击关闭按钮关闭弹出层
    $(".divTitle").on("click", "#close", function(e) {
        closePopContainer();
    });
});

// 点击图片弹出层
var pop = function(element) {
    currentDiv = element;

    // 存在图片或视频才弹出
    if ($(element.children()[2]).children().first().attr("src") != "") {
        $("#backdrop").removeClass("dn");
        $(element.children()[2]).addClass("z1000 pa");
        $(element).children().addClass("dn");
        $(element.children()[2]).removeClass("dn"); 

        // 增加监听器，以解决ios safari不会自动播放视频的问题
        $(element.children()[2]).children().first()[0].addEventListener('touchstart', function(event) {
             this.play();
        }, false);
        
        // 创建标题栏
        var divTitle = "<div class='divTitle'>&nbsp;&nbsp;<a href='javascript:' id='close'>close</a></div>";
        $("#container").append(divTitle);
        $(".divTitle").prepend(element.attr("title"));
        $(".divTitle").css("top", 0); 
        $(".divTitle").css("left", 0); 
        $(".divTitle").addClass("z1000");
    }
};

// 关闭弹出层
var closePopContainer = function() {
    $(".divTitle").remove();

    if (currentDiv.length > 0) {
        $(currentDiv).children().addClass("dn");
        $(currentDiv.children()[2]).removeClass("z1000 pa");
        $(currentDiv.children()[0]).removeClass("dn");
    }
    hideIosNotify();
    $("#backdrop").addClass("dn");
};

// 翻页
var next = function() {
    var i = 0;
    var strDiv = "";
    var text = "";
    var title = "";
    var mediaPop = "";
    i = (page - 1) * perPage;
    
    for (var j = 0; i < objData.length && j < perPage; i++, j++) {
         text = objData[i].text;
         if (text === undefined) {
             text = "";
         }
         title = objData[i].title;
         if (title === undefined) {
             title = "";
         }
         mediaPop = objData[i].pop;
         if (mediaPop === undefined) {
             mediaPop = "";
         } else {
             mediaPop = "data/" + mediaPop;
         }
         href = objData[i].href;

         // 创建节点
         strDiv = "<div class='divNode' id='" + objData[i].cover + "' title='" + title + "'>";
         strDiv += "<img class='divMedia' src='static/loader.gif' data-src='data/" + objData[i].cover + "' />";
         if (href !== undefined) {
             // 如果是外部链接
             strDiv += "<div class='divLink dn'><a class='divLinkA db' href='" + href + "' target='_blank'>" + text + "</a></div>";
             strDiv += "<div class='divPop dn'></div>";
         } else {
             strDiv += "<div class='divText dn'>" + text + "</div>";

             // 弹出的是视频还是图片
             if (mediaPop.indexOf(videoFormat) > 1) {
                 strDiv += "<div class='divPop dn'><video src='" + mediaPop + "' autoplay></video></div>";
             } else {
                 strDiv += "<div class='divPop dn'><img src='" + mediaPop + "' /></div>";
             }
         }
         strDiv += "</div>";
         $("#container").append(strDiv);
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

// 获取相对于浏览器窗口左上角的坐标
function getElementViewLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
    　　actualLeft += current.offsetLeft;
    　　current = current.offsetParent;
    }
    if (document.compatMode == "BackCompat") {
    　　var elementScrollLeft=document.body.scrollLeft;
    } else {
    　　var elementScrollLeft=document.documentElement.scrollLeft; 
    }
    return actualLeft-elementScrollLeft;
}

function getElementViewTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    if (document.compatMode == "BackCompat") {
        var elementScrollTop=document.body.scrollTop;
    } else {
        var elementScrollTop=document.documentElement.scrollTop; 
    }
    return actualTop-elementScrollTop;
}
