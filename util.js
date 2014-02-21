// util.js

define(function() {
    // generate natural number array
    var generateArray = function (length, direction) {
        var i, result = [];

        switch (direction) {
            case 'Asc':
                // generate ascending natural number array start from 1
                for (i = 1; i <= length; i++) {
                    result.push(i);
                }
                break;
            case 'Desc':
                // generate descending natural number array end with 1
                for (i = length; i >= 1; i--) {
                    result.push(i);
                }
                break;
            default:            
                // generate ascending natural number array start from 1
                for (i = 1; i <= length; i++) {
                    result.push(i);
                }

                // random
                for (i = result.length - 1; i > 0; i--) {
                    result[i] = result.splice(Math.floor(Math.random() * i), 1, result[i])[0];
                }
                break;
        }

        console.log(result);
        return result;
    };

/*
    // generate natural number random array
    var randomArray1 = function(upper, length) {
        var result = [];
        var temp;

        for (i = 0; i < length; i++) {
            // random
            temp = Math.floor(Math.random() * upper + 1);

            // remove repeated
            if (result.indexOf(temp) >= 0) {
                i--;
                continue;
            }

            result.push(temp);
        }

        console.log(result);
        return result;
    };
    */

    /*
     * add event listener
     * obj        object to be listened
     * eventName  event name
     * fun        function name
     * param      function parameter
     */
    var addEventHandler = function (obj, eventName, fun, param) {
        var fn = fun;
        if (param) {
            fn = function(e) {
                // call fun and all parameter
                fun.call(this, param);
            }
        }
        if (obj.addEventListener) {
            obj.addEventListener(eventName, fn, false);
        } else if (obj.attachEvent) {
            obj.attachEvent('on' + eventName, fn);
        } else {
            obj["on" + eventName] = fn;
        }
    };
 
     /*
     * remove event listener
     * obj        object to be listened
     * eventName  event name
     * fun        function name
     */
    var removeEventHandler = function (obj, eventName, fun) {
        if (obj.removeEventListener){
            obj.removeEventListener(eventName, fun, false);
        } else if (obj.detachEvent) {
            obj.detachEvent("on" + eventName, fun);
        } else{
            delete obj["on" + eventName];
        }
    };

    return {
        generateArray: generateArray,
        addEventHandler: addEventHandler,
        removeEventHandler: removeEventHandler
    };
});
