var sandbox = (function () {

    var self = null;

    var layers = [3, 4, 2],
        weights = 0.5,
        bias = 1,
        input = [0, 1, 0];

    var init = function (context) {
        self = this;
        prefillInput(context);
        $(context).on("click", ".js-runSandbox", function () {
            run(context);  
        });

        $(context).on("keyup change", ".js-layersSandbox", function () {
            parseLayers(context);
        });

        $(context).on("keyup change", ".js-inputSandbox", function () {
            parseInput(context);
        });

        $(context).on("keyup change", ".js-weightsSandbox", function () {
            var content = $(this).val();
            if (isNumeric(content))
                weights = parseFloat(content);
        });

        $(context).on("keyup change", ".js-biasSandbox", function () {
            var content = $(this).val();
            if (isNumeric(content))
                bias = parseFloat(content);
        });
    }

    var prefillInput = function (context) {
        $(".js-layersSandbox", context).val(layers.join());
        $(".js-weightsSandbox", context).val(weights);
        $(".js-biasSandbox", context).val(bias);
        $(".js-inputSandbox", context).val(input.join());
        run(context);
    }

    var parseLayers = function (context) {
        var content = $(".js-layersSandbox", context).val();
        var splitArray = content.split(",")
            .map(function (e) { return e.trim() })
            .filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") });
        if (splitArray.length < 3)
            return;
        layers = [];
        for (var i = 0; i < splitArray.length; i++) {
            if (isInt(splitArray[i]) && parseInt(splitArray[i]) > 0)
                layers.push(parseInt(splitArray[i]));
            else
                console.log(splitArray[i] + " is not an integer or isn't greater than 0");
        }
        //$(".js-layersSandbox-out", context).html(layers.join());
    }

    var parseInput = function (context) {
        var content = $(".js-inputSandbox", context).val();
        var splitArray = content.split(",")
            .map(function (e) { return e.trim() })
            .filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") });
        input = splitArray;
    }


    var isInt = function (value) {
        var x;
        return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
    }

    var isNumeric = function (value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    var prettyPrint = function (k, v) {
        if (v instanceof Array) {
            return (k != "output") ? JSON.stringify(v) : v;
        }
        return v;
    }


    var run = function (context) {
        var data = {
            layers: layers,
            weightValue: weights,
            biasValue: bias,
            input: input
        }
        gom.clew.runSandbox(data)
            .done(function (response) {
                $(".json-result", context).jsonBrowse(response);
                //    .html(JSON.stringify(response, prettyPrint, 2));
                //$(".json-result").each(function (i, v) {
                //    hljs.highlightBlock(v);
                //});
                //hljs.highlightBlock($(".json-result", context));
            })
            .fail(function (response) {
                $(".json-result", context).html(JSON.stringify(response, null, 2));
            });
    }

    return {
        init: init,
        weights: weights,
        bias: bias,
    }
})();