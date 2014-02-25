// playSorting.js

define(['util', 'algorithms/sorting'], function(util, sorting){
    var n, speed, timer, flagPlaying = 0, flagPlayed = 0;
    var swaps, timeSorting, timePlayStart, timePlayEnd;
    var data = [], swapHistory = [], blocks = [];

    var init = function() {
        // bind event handler to sorting buttons 
        util.addEventHandler(document.getElementById("btnBubble"), 'click', ready, sorting.bubble);
        util.addEventHandler(document.getElementById("btnInsertion"), 'click', ready, sorting.insertion);
        util.addEventHandler(document.getElementById("btnShell"), 'click', ready, sorting.shell);
        util.addEventHandler(document.getElementById("btnQuick1"), 'click', ready, sorting.quick1);
        util.addEventHandler(document.getElementById("btnQuick2"), 'click', ready, sorting.quick2);
        util.addEventHandler(document.getElementById("btnQuick3"), 'click', ready, sorting.quick3);
        util.addEventHandler(document.getElementById("btnQuick4"), 'click', ready, sorting.quick4);

        // bind event handler to control buttons 
        document.getElementById("btnReset").onclick = reset;

        // bind event handler to color picker 
        var colorBlocks = document.getElementsByClassName("color-block");
        for (var i = 0; i < colorBlocks.length; i++) {
            util.addEventHandler(colorBlocks[i], 'click', changeColor, colorBlocks[i].style.backgroundColor);
        }

        start();
    };

    // draw initial graph
    var initGraph = function(data, n, blocks) {
        document.getElementById("canvas").innerHTML = '';
        var color = document.getElementById("selectedColor").value;

        for (var i = 0; i < n; i++) {
            blocks.push(document.createElement("div"));
            blocks[i].style.backgroundColor = color;
            blocks[i].style.width = 100.0 / n + "%";
            blocks[i].style.height = data[i] * 100.0 / n + "%";
            document.getElementById("canvas").appendChild(blocks[i]);
        }
    };

    var ready = function(sortMethod) {
        if (flagPlaying == 0) {
            if (flagPlayed == 1) {
                start();
            }

            speed = document.getElementById("speed").value;
            swapHistory = sortMethod(data);
            swaps = swapHistory['swaps'].length;
            timeSorting = swapHistory['timeSorting'];

            timePlayStart = new Date().getTime();
            go();
        }
    };

    var go = function() {
        flagPlaying = 1;
        // console.time('replay time-consuming');

        if (swapHistory['swaps'].length > 0) {
            var current = swapHistory['swaps'].shift();
            swap(current, blocks)
        } else {
            timePlayEnd = new Date().getTime();
            // console.timeEnd('replay time-consuming');
            _writeStatistics();

            flagPlaying = 0;
            flagPlayed = 1;
            window.clearTimeout(timer);
            
            return;
        }

        timer = window.setTimeout(go, speed);
    };

    var reset = function() {
        flagPlaying = 0;
        window.clearTimeout(timer);
        swapHistory['swaps'] = [];
        start();
    }

    var start = function() {
        if (flagPlaying == 0 || flagPlayed == 1) {
            flagPlayed = 0;
            n = document.getElementById("arrayLength").value;
            var direction = getDirection();
            blocks = [];
            data = util.generateArray(n, direction);
            initGraph(data, n, blocks);

            document.getElementById("statistics").innerHTML= "";
        }
    };

    // swap blocks
    var swap = function (history, blocks) {
        var i = history[0];
        var j = history[1];
        var t = blocks[i].style.height;

        blocks[i].style.height = blocks[j].style.height;
        blocks[j].style.height = t;
    };

    var _writeStatistics = function() {
        var html = '';

        html = 'swaps: ' + swaps + ' times, ';
        html += 'sorting time: ' + timeSorting + ' ms, '
        html += 'play time: ' + (timePlayEnd - timePlayStart) + ' ms';
        document.getElementById("statistics").innerHTML= html;
    };

    // change blocks color
    var changeColor = function(color) {
        document.getElementById("selectedColor").value = color;
        var blocks = document.getElementById("canvas").children;

        for (var i = 0; i < blocks.length; i++) {
            blocks[i].style.backgroundColor = color;
        }
    };

    // get array direction
    var getDirection = function() {
        var result = '';
        var directions = document.getElementsByName("arrayDirection");

        for (var i = 0; i < directions.length; i++) {
            if (directions[i].checked === true) {
               result = directions[i].value; 
               break;
            }
        }

        return result;
    }

    return {
        init: init
    };
});
