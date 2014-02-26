// 当前页号
var page = 1;
// 每页几条数据
var perPage = 100;
// 主json对象
var objData = {};
// 距底部几像素刷新
var scrollPixles = 20;

$(document).ready(function() {
    // 首次载入，获取主json
    $.ajax({url: "data/main.json", 
        success: function(data) {
            //objData = $.parseJSON(data);
            objData = (data);
            // 获取第一页数据
            next();

            // 绑定图片点击事件
            $("#container").on("click", "img", function(event) {
                event.preventDefault();

                // 载入作品图片
                var json = $(this).attr("json");
                if (json !== 'undefined' && json !== "") {
                    // 获取作品json
                    $.ajax({url: "data/json/" + json,
                        success: function(popData) {
                            $("#backdrop").removeClass("dn");
                            $("#popContainer").removeClass("dn");
                            $("#pop").html("");
                            //var popData = $.parseJSON(data);

                            $.each(popData, function(i, v) {
                                $("#pop").append("<img src='data/images/" + v + "' />");
                            });
                        }
                    });
                }
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

// 关闭弹出层
var closePopContainer = function() {
    $("#backdrop").addClass("dn");
    $("#popContainer").addClass("dn");
};

// 翻页
var next = function() {
    var i = 0;
    i = (page - 1) * perPage;
    
    for (var j = 0; i < objData.length && j < perPage; i++, j++) {
        $("#container").append("<img src='data/images/" + objData[i].cover + "' json='" + objData[i].json + "'/>");
    }
    page++;
};
