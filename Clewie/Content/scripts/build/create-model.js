
var neuralNetwork = (function () {

    var features = [];
    var targets = [];
    var layers = [4, 5, 3];
    var locked = false;

    var model = {};

    var init = function (context) {

        nnVisual.init(context, this);
        $(".start-btn").click(function () {
            pretrain();
            console.log(layers);
        });
        setDefaultParameters();
    };

    var updateModel = function () {
        model = {
            id: $("[data-gom-model='id']").val(),
            name: $("[data-gom-model='name']").val(),
            description: $("[data-gom-model='description']").val(),
            layers: layers,
            parameters: {
                maxEpochs: parseFloat($("#max-epochs").val()),
                learningRate: parseFloat($("#learning-rate").val()),
                momentum: parseFloat($("#momentum").val()),
                weightDecay: parseFloat($("#weight-decay").val()),
            }
        }
    }

    var setDefaultParameters = function () {
        $("#max-epochs").val(1000);
        $("#learning-rate").val(0.01);
        $("#momentum").val(0.01);
        $("#weight-decay").val(0.01);
    }

    var setParameter = function (param, data) {
        if (param == "features")
            this.features = data;
        else if (param == "target")
            this.targets = data;
    }


    var updateLayers = function (layers) {
        this.layers = layers;
    }

    var setFixedLayers = function (layers) {
        //lock layers if a user provides training dataset
        this.layers = layers;
        this.locked = true;
        nnVisual.updateVisuals(layers);
        console.log(this);
    }

    var pretrain = function () {
        updateModel();
        gom.clew.pretrain(model)
            .done(function (response) {
                console.log("response");
            })
            .fail(function () {

            });
    }


    var uploadParameters = function () {
        updateModel();
        gom.clew.uploadParameters(model)
            .done(function (response) {
                console.log(response);
            })
            .fail(function (response) { console.log("fail") });
    }
  
    return {
        init: init,
        layers: layers,
        locked: locked,
        features: features,
        setParameter: setParameter,
        updateLayers: updateLayers,
        setFixedLayers: setFixedLayers,
    };
})();
var nnVisual = (function () {
    var context = null;
    var layers = null;


    var width = 0,
        height = 0;

    var canvas = null,
        mainG = null;

    var btnCanvas = null,
        btnG = null;

    var data = null;

    var nn = null;

    var init = function (context, nn) {
        this.context = context;
        this.nn = nn;
        layers = nn.layers;

        width = $("#layer-designer").width();
        height = $("#layer-designer").height();

        data = initVisualData(layers);

        canvas = d3.select("#layer-designer").append("svg")
            .attr("id", "designer-container")
            .attr("width", width)
            .attr("height", height);

        mainG = canvas.append("g")
            .attr("id", "nodes-container");

        btnCanvas = d3.select("#btn-wrapper").append("svg")
            .attr("id", "btn-canvas")
            .attr("width", width)
            .attr("height", 100);

        btnG = btnCanvas.append("g")
            .attr("id", "btn-container");
        
        draw();
    }

    var initVisualData = function (layers) {
        return {
            nodes: layersToNodes(layers),
            links: layersToLinks(layers),
            ui: layersToUI(layers),
        };
    } 

    var updateLayers = function (i, x) {
        //if layers are locked, dont modify inputs and outputs
        if (neuralNetwork.locked && (i == 0 || i == layers.length - 1))
            return;
        //layer must contain atleast one neuroncd
        if (layers[i] <= 1 && x == -1)
            return;
        layers[i] += x;
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    }

    var modifyLayers = function (action) {
        //dont cant remove any layers if there are only 2
        if (layers.length <= 2 && action == "remove")
            return;
        //if layers are locked insert a layer before the end, otherwise to the end
        if (action == "add")
            (neuralNetwork.locked) ? layers.splice(layers.length - 1, 0, 1) : layers.push(1);
        //remove a layer before the end if layers are locked
        else if (action == "remove")
            (neuralNetwork.locked) ? layers.splice(layers.length-2, 1) : layers.pop();
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    } 

    var updateVisuals = function (layers) {
        data = initVisualData(layers);
        update();
    }

    var update = function () {
        mainG.selectAll("*").remove();
        btnG.selectAll("*").remove();
        draw();
    }

    var draw = function () {
        var link = mainG.selectAll(".link")
            .data(data.links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (l) {
                var source = data.nodes.filter(function (d, i) {
                    return i == l.source
                })[0];
                var target = data.nodes.filter(function (d, i) {
                    return i == l.target
                })[0];
                return "M" + source.x + "," + source.y
                    + "C" + source.x + "," + (source.y + target.y) / 2
                    + " " + target.x + "," + (source.y + target.y) / 2
                    + " " + target.x + "," + target.y;
            });

        var node = mainG.selectAll(".node")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", 10)
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        var neuronBtns = btnG.selectAll('.button-neuron')
            .data(data.ui.neurons)
            .enter()
            .append('g')
            .attr('class', 'button-neuron')
            .attr("gom-layer-index", function (d) { return d.index; })
            .attr("gom-layer-val", function (d) { return d.val; })
            .call(button);


        var layerBtns = btnG.selectAll('.button-layer')
            .data(data.ui.layers)
            .enter()
            .append('g')
            .attr('class', 'button-layer')
            .call(button);

        var mainWidth = $("#nodes-container")[0].getBoundingClientRect().width,
            mainHeight = $("#nodes-container")[0].getBoundingClientRect().height,
            btnWidth = $("#btn-container")[0].getBoundingClientRect().width,
            btnHeight = $("#btn-container")[0].getBoundingClientRect().height;

        btnG.attr("transform", "translate(" + (btnCanvas.attr("width") - btnWidth) * 0.5 + ", 0)");
        mainG.attr("transform", "translate(" + (canvas.attr("width") - mainWidth) * 0.5 + ", " + (mainHeight * 0.5) + ")");
        
        $(window).resize(function () {
            setTimeout(function () {
                width = $("#layer-designer").width();

                canvas.attr("width", width);
                canvas.attr("height", mainHeight);
                btnCanvas.attr("width", width);
                btnG.attr("transform", "translate(" + (btnCanvas.attr("width") - btnWidth) * 0.5 + ", 0)");
                mainG.attr("transform", "translate(" + (canvas.attr("width") - mainWidth) * 0.5 + ", " + (mainHeight * 0.5) + ")");

            }, 250);
        });
    }

    var layersToNodes = function (layers) {
        let arr = [];
        let vCenter = 0;//Math.floor($("#designer-container").height() / 2);
        let x = 0;
        let y = 0;
        let mult = 50;

        for (var i = 0; i < layers.length; i++) {
            if (layers[i] % 2 == 0)
                y = vCenter - (layers[i] * mult / 2) + (mult / 2);
            else
                y = vCenter - Math.floor(layers[i] / 2) * mult;
            for (var j = 0; j < layers[i]; j++) {
                arr.push({ "name": i + " " + j, x: x, y: y });
                y = y + mult
            }
            y = 0;
            x = x + mult * 2;
        }

        return arr;
    };

    var layersToLinks = function (layers) {
        let arr = [];
        let x = 0;
        for (var i = 0; i < layers.length - 1; i++) {
            for (var j = 0; j < layers[i]; j++) {
                var prevSum = layers.slice(0, i + 1).reduce((a, b) => a + b, 0);
                for (var y = prevSum; y < prevSum + layers[i + 1]; y++) {
                    arr.push({ source: x, target: y });
                }
                x = x + 1;
            }
        }
        return arr;
    };

    var layersToUI = function (layers) {
        let neuronUI = [];
        let layerUI = [];
        let x = 0;
        let y = 50;
        let mult = 50;


        for (var i = 0; i < layers.length; i++) {
            x = x + mult * 2;
            neuronUI.push({ label: "-", x: x, y: y - 20, index: i, val: -1 });
            neuronUI.push({ label: "+", x: x, y: y + 20, index: i, val: 1 });
        }
        x = x + mult * 2;
        layerUI.push({ label: "-", x: 0, y: y, action: "remove" });
        layerUI.push({ label: "+", x: x, y: y, action: "add" });

        return { neurons: neuronUI, layers: layerUI };
    };

    var button = d3.button()
        .on('press', function (d, i) { })
        .on('release', function (d, i) {
            if (d.index != undefined && d.val != undefined)
                updateLayers(d.index, d.val);
            else if (d.action != undefined)
                modifyLayers(d.action);
            update(data);
        });

    return {
        init: init,
        updateVisuals: updateVisuals,
    }
    
})();
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyIsIm5uLXNhbmRib3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyZWF0ZS1tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgbmV1cmFsTmV0d29yayA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGZlYXR1cmVzID0gW107XHJcbiAgICB2YXIgdGFyZ2V0cyA9IFtdO1xyXG4gICAgdmFyIGxheWVycyA9IFs0LCA1LCAzXTtcclxuICAgIHZhciBsb2NrZWQgPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgbW9kZWwgPSB7fTtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcblxyXG4gICAgICAgIG5uVmlzdWFsLmluaXQoY29udGV4dCwgdGhpcyk7XHJcbiAgICAgICAgJChcIi5zdGFydC1idG5cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwcmV0cmFpbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsYXllcnMpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldERlZmF1bHRQYXJhbWV0ZXJzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciB1cGRhdGVNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtb2RlbCA9IHtcclxuICAgICAgICAgICAgaWQ6ICQoXCJbZGF0YS1nb20tbW9kZWw9J2lkJ11cIikudmFsKCksXHJcbiAgICAgICAgICAgIG5hbWU6ICQoXCJbZGF0YS1nb20tbW9kZWw9J25hbWUnXVwiKS52YWwoKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICQoXCJbZGF0YS1nb20tbW9kZWw9J2Rlc2NyaXB0aW9uJ11cIikudmFsKCksXHJcbiAgICAgICAgICAgIGxheWVyczogbGF5ZXJzLFxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYXhFcG9jaHM6IHBhcnNlRmxvYXQoJChcIiNtYXgtZXBvY2hzXCIpLnZhbCgpKSxcclxuICAgICAgICAgICAgICAgIGxlYXJuaW5nUmF0ZTogcGFyc2VGbG9hdCgkKFwiI2xlYXJuaW5nLXJhdGVcIikudmFsKCkpLFxyXG4gICAgICAgICAgICAgICAgbW9tZW50dW06IHBhcnNlRmxvYXQoJChcIiNtb21lbnR1bVwiKS52YWwoKSksXHJcbiAgICAgICAgICAgICAgICB3ZWlnaHREZWNheTogcGFyc2VGbG9hdCgkKFwiI3dlaWdodC1kZWNheVwiKS52YWwoKSksXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldERlZmF1bHRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjbWF4LWVwb2Noc1wiKS52YWwoMTAwMCk7XHJcbiAgICAgICAgJChcIiNsZWFybmluZy1yYXRlXCIpLnZhbCgwLjAxKTtcclxuICAgICAgICAkKFwiI21vbWVudHVtXCIpLnZhbCgwLjAxKTtcclxuICAgICAgICAkKFwiI3dlaWdodC1kZWNheVwiKS52YWwoMC4wMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldFBhcmFtZXRlciA9IGZ1bmN0aW9uIChwYXJhbSwgZGF0YSkge1xyXG4gICAgICAgIGlmIChwYXJhbSA9PSBcImZlYXR1cmVzXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZmVhdHVyZXMgPSBkYXRhO1xyXG4gICAgICAgIGVsc2UgaWYgKHBhcmFtID09IFwidGFyZ2V0XCIpXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0cyA9IGRhdGE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhciB1cGRhdGVMYXllcnMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldEZpeGVkTGF5ZXJzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIC8vbG9jayBsYXllcnMgaWYgYSB1c2VyIHByb3ZpZGVzIHRyYWluaW5nIGRhdGFzZXRcclxuICAgICAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgICAgICB0aGlzLmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgbm5WaXN1YWwudXBkYXRlVmlzdWFscyhsYXllcnMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwcmV0cmFpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1cGRhdGVNb2RlbCgpO1xyXG4gICAgICAgIGdvbS5jbGV3LnByZXRyYWluKG1vZGVsKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2VcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YXIgdXBsb2FkUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1cGRhdGVNb2RlbCgpO1xyXG4gICAgICAgIGdvbS5jbGV3LnVwbG9hZFBhcmFtZXRlcnMobW9kZWwpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHsgY29uc29sZS5sb2coXCJmYWlsXCIpIH0pO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0LFxyXG4gICAgICAgIGxheWVyczogbGF5ZXJzLFxyXG4gICAgICAgIGxvY2tlZDogbG9ja2VkLFxyXG4gICAgICAgIGZlYXR1cmVzOiBmZWF0dXJlcyxcclxuICAgICAgICBzZXRQYXJhbWV0ZXI6IHNldFBhcmFtZXRlcixcclxuICAgICAgICB1cGRhdGVMYXllcnM6IHVwZGF0ZUxheWVycyxcclxuICAgICAgICBzZXRGaXhlZExheWVyczogc2V0Rml4ZWRMYXllcnMsXHJcbiAgICB9O1xyXG59KSgpOyIsInZhciBublZpc3VhbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IG51bGw7XHJcbiAgICB2YXIgbGF5ZXJzID0gbnVsbDtcclxuXHJcblxyXG4gICAgdmFyIHdpZHRoID0gMCxcclxuICAgICAgICBoZWlnaHQgPSAwO1xyXG5cclxuICAgIHZhciBjYW52YXMgPSBudWxsLFxyXG4gICAgICAgIG1haW5HID0gbnVsbDtcclxuXHJcbiAgICB2YXIgYnRuQ2FudmFzID0gbnVsbCxcclxuICAgICAgICBidG5HID0gbnVsbDtcclxuXHJcbiAgICB2YXIgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgdmFyIG5uID0gbnVsbDtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChjb250ZXh0LCBubikge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5ubiA9IG5uO1xyXG4gICAgICAgIGxheWVycyA9IG5uLmxheWVycztcclxuXHJcbiAgICAgICAgd2lkdGggPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLndpZHRoKCk7XHJcbiAgICAgICAgaGVpZ2h0ID0gJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcblxyXG4gICAgICAgIGNhbnZhcyA9IGQzLnNlbGVjdChcIiNsYXllci1kZXNpZ25lclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImRlc2lnbmVyLWNvbnRhaW5lclwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBtYWluRyA9IGNhbnZhcy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJub2Rlcy1jb250YWluZXJcIik7XHJcblxyXG4gICAgICAgIGJ0bkNhbnZhcyA9IGQzLnNlbGVjdChcIiNidG4td3JhcHBlclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImJ0bi1jYW52YXNcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgMTAwKTtcclxuXHJcbiAgICAgICAgYnRuRyA9IGJ0bkNhbnZhcy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJidG4tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW5pdFZpc3VhbERhdGEgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IGxheWVyc1RvTm9kZXMobGF5ZXJzKSxcclxuICAgICAgICAgICAgbGlua3M6IGxheWVyc1RvTGlua3MobGF5ZXJzKSxcclxuICAgICAgICAgICAgdWk6IGxheWVyc1RvVUkobGF5ZXJzKSxcclxuICAgICAgICB9O1xyXG4gICAgfSBcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGksIHgpIHtcclxuICAgICAgICAvL2lmIGxheWVycyBhcmUgbG9ja2VkLCBkb250IG1vZGlmeSBpbnB1dHMgYW5kIG91dHB1dHNcclxuICAgICAgICBpZiAobmV1cmFsTmV0d29yay5sb2NrZWQgJiYgKGkgPT0gMCB8fCBpID09IGxheWVycy5sZW5ndGggLSAxKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vbGF5ZXIgbXVzdCBjb250YWluIGF0bGVhc3Qgb25lIG5ldXJvbmNkXHJcbiAgICAgICAgaWYgKGxheWVyc1tpXSA8PSAxICYmIHggPT0gLTEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBsYXllcnNbaV0gKz0geDtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBuZXVyYWxOZXR3b3JrLnVwZGF0ZUxheWVycyhsYXllcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtb2RpZnlMYXllcnMgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgLy9kb250IGNhbnQgcmVtb3ZlIGFueSBsYXllcnMgaWYgdGhlcmUgYXJlIG9ubHkgMlxyXG4gICAgICAgIGlmIChsYXllcnMubGVuZ3RoIDw9IDIgJiYgYWN0aW9uID09IFwicmVtb3ZlXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvL2lmIGxheWVycyBhcmUgbG9ja2VkIGluc2VydCBhIGxheWVyIGJlZm9yZSB0aGUgZW5kLCBvdGhlcndpc2UgdG8gdGhlIGVuZFxyXG4gICAgICAgIGlmIChhY3Rpb24gPT0gXCJhZGRcIilcclxuICAgICAgICAgICAgKG5ldXJhbE5ldHdvcmsubG9ja2VkKSA/IGxheWVycy5zcGxpY2UobGF5ZXJzLmxlbmd0aCAtIDEsIDAsIDEpIDogbGF5ZXJzLnB1c2goMSk7XHJcbiAgICAgICAgLy9yZW1vdmUgYSBsYXllciBiZWZvcmUgdGhlIGVuZCBpZiBsYXllcnMgYXJlIGxvY2tlZFxyXG4gICAgICAgIGVsc2UgaWYgKGFjdGlvbiA9PSBcInJlbW92ZVwiKVxyXG4gICAgICAgICAgICAobmV1cmFsTmV0d29yay5sb2NrZWQpID8gbGF5ZXJzLnNwbGljZShsYXllcnMubGVuZ3RoLTIsIDEpIDogbGF5ZXJzLnBvcCgpO1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIG5ldXJhbE5ldHdvcmsudXBkYXRlTGF5ZXJzKGxheWVycyk7XHJcbiAgICB9IFxyXG5cclxuICAgIHZhciB1cGRhdGVWaXN1YWxzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbWFpbkcuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcclxuICAgICAgICBidG5HLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBsaW5rID0gbWFpbkcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5saW5rcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk1cIiArIHNvdXJjZS54ICsgXCIsXCIgKyBzb3VyY2UueVxyXG4gICAgICAgICAgICAgICAgICAgICsgXCJDXCIgKyBzb3VyY2UueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgdGFyZ2V0Lnk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IG1haW5HLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubm9kZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgMTApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5ldXJvbkJ0bnMgPSBidG5HLnNlbGVjdEFsbCgnLmJ1dHRvbi1uZXVyb24nKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLm5ldXJvbnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLWluZGV4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmluZGV4OyB9KVxyXG4gICAgICAgICAgICAuYXR0cihcImdvbS1sYXllci12YWxcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxheWVyQnRucyA9IGJ0bkcuc2VsZWN0QWxsKCcuYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS51aS5sYXllcnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmNhbGwoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgdmFyIG1haW5XaWR0aCA9ICQoXCIjbm9kZXMtY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxyXG4gICAgICAgICAgICBtYWluSGVpZ2h0ID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxyXG4gICAgICAgICAgICBidG5XaWR0aCA9ICQoXCIjYnRuLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcclxuICAgICAgICAgICAgYnRuSGVpZ2h0ID0gJChcIiNidG4tY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuXHJcbiAgICAgICAgYnRuRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGJ0bkNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBidG5XaWR0aCkgKiAwLjUgKyBcIiwgMClcIik7XHJcbiAgICAgICAgbWFpbkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbWFpbldpZHRoKSAqIDAuNSArIFwiLCBcIiArIChtYWluSGVpZ2h0ICogMC41KSArIFwiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYW52YXMuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcclxuICAgICAgICAgICAgICAgIGNhbnZhcy5hdHRyKFwiaGVpZ2h0XCIsIG1haW5IZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBidG5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIGJ0bldpZHRoKSAqIDAuNSArIFwiLCAwKVwiKTtcclxuICAgICAgICAgICAgICAgIG1haW5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoY2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIG1haW5XaWR0aCkgKiAwLjUgKyBcIiwgXCIgKyAobWFpbkhlaWdodCAqIDAuNSkgKyBcIilcIik7XHJcblxyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYXllcnNUb05vZGVzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgdkNlbnRlciA9IDA7Ly9NYXRoLmZsb29yKCQoXCIjZGVzaWduZXItY29udGFpbmVyXCIpLmhlaWdodCgpIC8gMik7XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gMDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGF5ZXJzW2ldICUgMiA9PSAwKVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSAobGF5ZXJzW2ldICogbXVsdCAvIDIpICsgKG11bHQgLyAyKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSBNYXRoLmZsb29yKGxheWVyc1tpXSAvIDIpICogbXVsdDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goeyBcIm5hbWVcIjogaSArIFwiIFwiICsgaiwgeDogeCwgeTogeSB9KTtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgbXVsdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTGlua3MgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZTdW0gPSBsYXllcnMuc2xpY2UoMCwgaSArIDEpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IHByZXZTdW07IHkgPCBwcmV2U3VtICsgbGF5ZXJzW2kgKyAxXTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goeyBzb3VyY2U6IHgsIHRhcmdldDogeSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9VSSA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgbmV1cm9uVUkgPSBbXTtcclxuICAgICAgICBsZXQgbGF5ZXJVSSA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDUwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiB4LCB5OiB5IC0gMjAsIGluZGV4OiBpLCB2YWw6IC0xIH0pO1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5ICsgMjAsIGluZGV4OiBpLCB2YWw6IDEgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiAwLCB5OiB5LCBhY3Rpb246IFwicmVtb3ZlXCIgfSk7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5LCBhY3Rpb246IFwiYWRkXCIgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IG5ldXJvbnM6IG5ldXJvblVJLCBsYXllcnM6IGxheWVyVUkgfTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGJ1dHRvbiA9IGQzLmJ1dHRvbigpXHJcbiAgICAgICAgLm9uKCdwcmVzcycsIGZ1bmN0aW9uIChkLCBpKSB7IH0pXHJcbiAgICAgICAgLm9uKCdyZWxlYXNlJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGQuaW5kZXggIT0gdW5kZWZpbmVkICYmIGQudmFsICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxheWVycyhkLmluZGV4LCBkLnZhbCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGQuYWN0aW9uICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIG1vZGlmeUxheWVycyhkLmFjdGlvbik7XHJcbiAgICAgICAgICAgIHVwZGF0ZShkYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICAgICAgdXBkYXRlVmlzdWFsczogdXBkYXRlVmlzdWFscyxcclxuICAgIH1cclxuICAgIFxyXG59KSgpOyIsInZhciBzYW5kYm94ID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgc2VsZiA9IG51bGw7XHJcblxyXG4gICAgdmFyIGxheWVycyA9IFszLCA0LCAyXSxcclxuICAgICAgICB3ZWlnaHRzID0gMC41LFxyXG4gICAgICAgIGJpYXMgPSAxLFxyXG4gICAgICAgIGlucHV0ID0gWzAsIDEsIDBdO1xyXG5cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICBzZWxmID0gdGhpcztcclxuICAgICAgICBwcmVmaWxsSW5wdXQoY29udGV4dCk7XHJcbiAgICAgICAgJChjb250ZXh0KS5vbihcImNsaWNrXCIsIFwiLmpzLXJ1blNhbmRib3hcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBydW4oY29udGV4dCk7ICBcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChjb250ZXh0KS5vbihcImtleXVwIGNoYW5nZVwiLCBcIi5qcy1sYXllcnNTYW5kYm94XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcGFyc2VMYXllcnMoY29udGV4dCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoY29udGV4dCkub24oXCJrZXl1cCBjaGFuZ2VcIiwgXCIuanMtaW5wdXRTYW5kYm94XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcGFyc2VJbnB1dChjb250ZXh0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChjb250ZXh0KS5vbihcImtleXVwIGNoYW5nZVwiLCBcIi5qcy13ZWlnaHRzU2FuZGJveFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb250ZW50ID0gJCh0aGlzKS52YWwoKTtcclxuICAgICAgICAgICAgaWYgKGlzTnVtZXJpYyhjb250ZW50KSlcclxuICAgICAgICAgICAgICAgIHdlaWdodHMgPSBwYXJzZUZsb2F0KGNvbnRlbnQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGNvbnRleHQpLm9uKFwia2V5dXAgY2hhbmdlXCIsIFwiLmpzLWJpYXNTYW5kYm94XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBpZiAoaXNOdW1lcmljKGNvbnRlbnQpKVxyXG4gICAgICAgICAgICAgICAgYmlhcyA9IHBhcnNlRmxvYXQoY29udGVudCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHByZWZpbGxJbnB1dCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgJChcIi5qcy1sYXllcnNTYW5kYm94XCIsIGNvbnRleHQpLnZhbChsYXllcnMuam9pbigpKTtcclxuICAgICAgICAkKFwiLmpzLXdlaWdodHNTYW5kYm94XCIsIGNvbnRleHQpLnZhbCh3ZWlnaHRzKTtcclxuICAgICAgICAkKFwiLmpzLWJpYXNTYW5kYm94XCIsIGNvbnRleHQpLnZhbChiaWFzKTtcclxuICAgICAgICAkKFwiLmpzLWlucHV0U2FuZGJveFwiLCBjb250ZXh0KS52YWwoaW5wdXQuam9pbigpKTtcclxuICAgICAgICBydW4oY29udGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhcnNlTGF5ZXJzID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgY29udGVudCA9ICQoXCIuanMtbGF5ZXJzU2FuZGJveFwiLCBjb250ZXh0KS52YWwoKTtcclxuICAgICAgICB2YXIgc3BsaXRBcnJheSA9IGNvbnRlbnQuc3BsaXQoXCIsXCIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUudHJpbSgpIH0pXHJcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSwgXCJcIikgfSk7XHJcbiAgICAgICAgaWYgKHNwbGl0QXJyYXkubGVuZ3RoIDwgMylcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxheWVycyA9IFtdO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3BsaXRBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXNJbnQoc3BsaXRBcnJheVtpXSkgJiYgcGFyc2VJbnQoc3BsaXRBcnJheVtpXSkgPiAwKVxyXG4gICAgICAgICAgICAgICAgbGF5ZXJzLnB1c2gocGFyc2VJbnQoc3BsaXRBcnJheVtpXSkpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzcGxpdEFycmF5W2ldICsgXCIgaXMgbm90IGFuIGludGVnZXIgb3IgaXNuJ3QgZ3JlYXRlciB0aGFuIDBcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vJChcIi5qcy1sYXllcnNTYW5kYm94LW91dFwiLCBjb250ZXh0KS5odG1sKGxheWVycy5qb2luKCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYXJzZUlucHV0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgY29udGVudCA9ICQoXCIuanMtaW5wdXRTYW5kYm94XCIsIGNvbnRleHQpLnZhbCgpO1xyXG4gICAgICAgIHZhciBzcGxpdEFycmF5ID0gY29udGVudC5zcGxpdChcIixcIilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS50cmltKCkgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCBcIlwiKSB9KTtcclxuICAgICAgICBpbnB1dCA9IHNwbGl0QXJyYXk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhciBpc0ludCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHZhciB4O1xyXG4gICAgICAgIHJldHVybiBpc05hTih2YWx1ZSkgPyAhMSA6ICh4ID0gcGFyc2VGbG9hdCh2YWx1ZSksICgwIHwgeCkgPT09IHgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpc051bWVyaWMgPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsdWUpKSAmJiBpc0Zpbml0ZSh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHByZXR0eVByaW50ID0gZnVuY3Rpb24gKGssIHYpIHtcclxuICAgICAgICBpZiAodiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoayAhPSBcIm91dHB1dFwiKSA/IEpTT04uc3RyaW5naWZ5KHYpIDogdjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHY7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhciBydW4gPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICBsYXllcnM6IGxheWVycyxcclxuICAgICAgICAgICAgd2VpZ2h0VmFsdWU6IHdlaWdodHMsXHJcbiAgICAgICAgICAgIGJpYXNWYWx1ZTogYmlhcyxcclxuICAgICAgICAgICAgaW5wdXQ6IGlucHV0XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdvbS5jbGV3LnJ1blNhbmRib3goZGF0YSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmpzb24tcmVzdWx0XCIsIGNvbnRleHQpLmpzb25Ccm93c2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgLmh0bWwoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIHByZXR0eVByaW50LCAyKSk7XHJcbiAgICAgICAgICAgICAgICAvLyQoXCIuanNvbi1yZXN1bHRcIikuZWFjaChmdW5jdGlvbiAoaSwgdikge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgaGxqcy5oaWdobGlnaHRCbG9jayh2KTtcclxuICAgICAgICAgICAgICAgIC8vfSk7XHJcbiAgICAgICAgICAgICAgICAvL2hsanMuaGlnaGxpZ2h0QmxvY2soJChcIi5qc29uLXJlc3VsdFwiLCBjb250ZXh0KSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJChcIi5qc29uLXJlc3VsdFwiLCBjb250ZXh0KS5odG1sKEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlLCBudWxsLCAyKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICB3ZWlnaHRzOiB3ZWlnaHRzLFxyXG4gICAgICAgIGJpYXM6IGJpYXMsXHJcbiAgICB9XHJcbn0pKCk7Il19
