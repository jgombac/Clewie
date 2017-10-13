
var neuralNetwork = (function () {

    var features = [];
    var targets = [];
    var layers = [4, 5, 3];
    var locked = false;

    var model = {};
    that = null;

    var init = function (context) {
        that = this;
        nnVisual.init(context, this);
        $(".start-btn").click(function () {
            pretrain();
            console.log(layers);
        });

        $(".refresh-btn").click(function () {
            publish();
        });
        setDefaultParameters();
    };

    var updateModel = function () {
        that.model = {
            id: $("[data-gom-model='id']").text(),
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

    var publish = function () {
        updateModel();
        gom.clew.publishModel(that.model)
            .done()
            .fail();
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
        model: model,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyIsIm5uLXNhbmRib3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3JlYXRlLW1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBuZXVyYWxOZXR3b3JrID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgZmVhdHVyZXMgPSBbXTtcclxuICAgIHZhciB0YXJnZXRzID0gW107XHJcbiAgICB2YXIgbGF5ZXJzID0gWzQsIDUsIDNdO1xyXG4gICAgdmFyIGxvY2tlZCA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBtb2RlbCA9IHt9O1xyXG4gICAgdGhhdCA9IG51bGw7XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHRoYXQgPSB0aGlzO1xyXG4gICAgICAgIG5uVmlzdWFsLmluaXQoY29udGV4dCwgdGhpcyk7XHJcbiAgICAgICAgJChcIi5zdGFydC1idG5cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwcmV0cmFpbigpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsYXllcnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKFwiLnJlZnJlc2gtYnRuXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcHVibGlzaCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldERlZmF1bHRQYXJhbWV0ZXJzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciB1cGRhdGVNb2RlbCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGF0Lm1vZGVsID0ge1xyXG4gICAgICAgICAgICBpZDogJChcIltkYXRhLWdvbS1tb2RlbD0naWQnXVwiKS50ZXh0KCksXHJcbiAgICAgICAgICAgIG5hbWU6ICQoXCJbZGF0YS1nb20tbW9kZWw9J25hbWUnXVwiKS52YWwoKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICQoXCJbZGF0YS1nb20tbW9kZWw9J2Rlc2NyaXB0aW9uJ11cIikudmFsKCksXHJcbiAgICAgICAgICAgIGxheWVyczogbGF5ZXJzLFxyXG4gICAgICAgICAgICBwYXJhbWV0ZXJzOiB7XHJcbiAgICAgICAgICAgICAgICBtYXhFcG9jaHM6IHBhcnNlRmxvYXQoJChcIiNtYXgtZXBvY2hzXCIpLnZhbCgpKSxcclxuICAgICAgICAgICAgICAgIGxlYXJuaW5nUmF0ZTogcGFyc2VGbG9hdCgkKFwiI2xlYXJuaW5nLXJhdGVcIikudmFsKCkpLFxyXG4gICAgICAgICAgICAgICAgbW9tZW50dW06IHBhcnNlRmxvYXQoJChcIiNtb21lbnR1bVwiKS52YWwoKSksXHJcbiAgICAgICAgICAgICAgICB3ZWlnaHREZWNheTogcGFyc2VGbG9hdCgkKFwiI3dlaWdodC1kZWNheVwiKS52YWwoKSksXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldERlZmF1bHRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjbWF4LWVwb2Noc1wiKS52YWwoMTAwMCk7XHJcbiAgICAgICAgJChcIiNsZWFybmluZy1yYXRlXCIpLnZhbCgwLjAxKTtcclxuICAgICAgICAkKFwiI21vbWVudHVtXCIpLnZhbCgwLjAxKTtcclxuICAgICAgICAkKFwiI3dlaWdodC1kZWNheVwiKS52YWwoMC4wMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldFBhcmFtZXRlciA9IGZ1bmN0aW9uIChwYXJhbSwgZGF0YSkge1xyXG4gICAgICAgIGlmIChwYXJhbSA9PSBcImZlYXR1cmVzXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZmVhdHVyZXMgPSBkYXRhO1xyXG4gICAgICAgIGVsc2UgaWYgKHBhcmFtID09IFwidGFyZ2V0XCIpXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0cyA9IGRhdGE7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhciB1cGRhdGVMYXllcnMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldEZpeGVkTGF5ZXJzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIC8vbG9jayBsYXllcnMgaWYgYSB1c2VyIHByb3ZpZGVzIHRyYWluaW5nIGRhdGFzZXRcclxuICAgICAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgICAgICB0aGlzLmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgbm5WaXN1YWwudXBkYXRlVmlzdWFscyhsYXllcnMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwcmV0cmFpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB1cGRhdGVNb2RlbCgpO1xyXG4gICAgICAgIGdvbS5jbGV3LnByZXRyYWluKG1vZGVsKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2VcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwdWJsaXNoID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHVwZGF0ZU1vZGVsKCk7XHJcbiAgICAgICAgZ29tLmNsZXcucHVibGlzaE1vZGVsKHRoYXQubW9kZWwpXHJcbiAgICAgICAgICAgIC5kb25lKClcclxuICAgICAgICAgICAgLmZhaWwoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFyIHVwbG9hZFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdXBkYXRlTW9kZWwoKTtcclxuICAgICAgICBnb20uY2xldy51cGxvYWRQYXJhbWV0ZXJzKG1vZGVsKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7IGNvbnNvbGUubG9nKFwiZmFpbFwiKSB9KTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICBsYXllcnM6IGxheWVycyxcclxuICAgICAgICBsb2NrZWQ6IGxvY2tlZCxcclxuICAgICAgICBmZWF0dXJlczogZmVhdHVyZXMsXHJcbiAgICAgICAgc2V0UGFyYW1ldGVyOiBzZXRQYXJhbWV0ZXIsXHJcbiAgICAgICAgdXBkYXRlTGF5ZXJzOiB1cGRhdGVMYXllcnMsXHJcbiAgICAgICAgc2V0Rml4ZWRMYXllcnM6IHNldEZpeGVkTGF5ZXJzLFxyXG4gICAgICAgIG1vZGVsOiBtb2RlbCxcclxuICAgIH07XHJcbn0pKCk7IiwidmFyIG5uVmlzdWFsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjb250ZXh0ID0gbnVsbDtcclxuICAgIHZhciBsYXllcnMgPSBudWxsO1xyXG5cclxuXHJcbiAgICB2YXIgd2lkdGggPSAwLFxyXG4gICAgICAgIGhlaWdodCA9IDA7XHJcblxyXG4gICAgdmFyIGNhbnZhcyA9IG51bGwsXHJcbiAgICAgICAgbWFpbkcgPSBudWxsO1xyXG5cclxuICAgIHZhciBidG5DYW52YXMgPSBudWxsLFxyXG4gICAgICAgIGJ0bkcgPSBudWxsO1xyXG5cclxuICAgIHZhciBkYXRhID0gbnVsbDtcclxuXHJcbiAgICB2YXIgbm4gPSBudWxsO1xyXG5cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5uKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm5uID0gbm47XHJcbiAgICAgICAgbGF5ZXJzID0gbm4ubGF5ZXJzO1xyXG5cclxuICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICBoZWlnaHQgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuXHJcbiAgICAgICAgY2FudmFzID0gZDMuc2VsZWN0KFwiI2xheWVyLWRlc2lnbmVyXCIpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZGVzaWduZXItY29udGFpbmVyXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIG1haW5HID0gY2FudmFzLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcIm5vZGVzLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICAgICAgYnRuQ2FudmFzID0gZDMuc2VsZWN0KFwiI2J0bi13cmFwcGVyXCIpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiYnRuLWNhbnZhc1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCAxMDApO1xyXG5cclxuICAgICAgICBidG5HID0gYnRuQ2FudmFzLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImJ0bi1jb250YWluZXJcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbml0VmlzdWFsRGF0YSA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBub2RlczogbGF5ZXJzVG9Ob2RlcyhsYXllcnMpLFxyXG4gICAgICAgICAgICBsaW5rczogbGF5ZXJzVG9MaW5rcyhsYXllcnMpLFxyXG4gICAgICAgICAgICB1aTogbGF5ZXJzVG9VSShsYXllcnMpLFxyXG4gICAgICAgIH07XHJcbiAgICB9IFxyXG5cclxuICAgIHZhciB1cGRhdGVMYXllcnMgPSBmdW5jdGlvbiAoaSwgeCkge1xyXG4gICAgICAgIC8vaWYgbGF5ZXJzIGFyZSBsb2NrZWQsIGRvbnQgbW9kaWZ5IGlucHV0cyBhbmQgb3V0cHV0c1xyXG4gICAgICAgIGlmIChuZXVyYWxOZXR3b3JrLmxvY2tlZCAmJiAoaSA9PSAwIHx8IGkgPT0gbGF5ZXJzLmxlbmd0aCAtIDEpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy9sYXllciBtdXN0IGNvbnRhaW4gYXRsZWFzdCBvbmUgbmV1cm9uY2RcclxuICAgICAgICBpZiAobGF5ZXJzW2ldIDw9IDEgJiYgeCA9PSAtMSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxheWVyc1tpXSArPSB4O1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIG5ldXJhbE5ldHdvcmsudXBkYXRlTGF5ZXJzKGxheWVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG1vZGlmeUxheWVycyA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICAvL2RvbnQgY2FudCByZW1vdmUgYW55IGxheWVycyBpZiB0aGVyZSBhcmUgb25seSAyXHJcbiAgICAgICAgaWYgKGxheWVycy5sZW5ndGggPD0gMiAmJiBhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vaWYgbGF5ZXJzIGFyZSBsb2NrZWQgaW5zZXJ0IGEgbGF5ZXIgYmVmb3JlIHRoZSBlbmQsIG90aGVyd2lzZSB0byB0aGUgZW5kXHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImFkZFwiKVxyXG4gICAgICAgICAgICAobmV1cmFsTmV0d29yay5sb2NrZWQpID8gbGF5ZXJzLnNwbGljZShsYXllcnMubGVuZ3RoIC0gMSwgMCwgMSkgOiBsYXllcnMucHVzaCgxKTtcclxuICAgICAgICAvL3JlbW92ZSBhIGxheWVyIGJlZm9yZSB0aGUgZW5kIGlmIGxheWVycyBhcmUgbG9ja2VkXHJcbiAgICAgICAgZWxzZSBpZiAoYWN0aW9uID09IFwicmVtb3ZlXCIpXHJcbiAgICAgICAgICAgIChuZXVyYWxOZXR3b3JrLmxvY2tlZCkgPyBsYXllcnMuc3BsaWNlKGxheWVycy5sZW5ndGgtMiwgMSkgOiBsYXllcnMucG9wKCk7XHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcbiAgICAgICAgbmV1cmFsTmV0d29yay51cGRhdGVMYXllcnMobGF5ZXJzKTtcclxuICAgIH0gXHJcblxyXG4gICAgdmFyIHVwZGF0ZVZpc3VhbHMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcbiAgICAgICAgdXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtYWluRy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGJ0bkcuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcclxuICAgICAgICBkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxpbmsgPSBtYWluRy5zZWxlY3RBbGwoXCIubGlua1wiKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLmxpbmtzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGRhdGEubm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkgPT0gbC5zb3VyY2VcclxuICAgICAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGRhdGEubm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkgPT0gbC50YXJnZXRcclxuICAgICAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTVwiICsgc291cmNlLnggKyBcIixcIiArIHNvdXJjZS55XHJcbiAgICAgICAgICAgICAgICAgICAgKyBcIkNcIiArIHNvdXJjZS54ICsgXCIsXCIgKyAoc291cmNlLnkgKyB0YXJnZXQueSkgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgKyBcIiBcIiArIHRhcmdldC54ICsgXCIsXCIgKyAoc291cmNlLnkgKyB0YXJnZXQueSkgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgKyBcIiBcIiArIHRhcmdldC54ICsgXCIsXCIgKyB0YXJnZXQueTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gbWFpbkcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5ub2RlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCAxMClcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbmV1cm9uQnRucyA9IGJ0bkcuc2VsZWN0QWxsKCcuYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEudWkubmV1cm9ucylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbmV1cm9uJylcclxuICAgICAgICAgICAgLmF0dHIoXCJnb20tbGF5ZXItaW5kZXhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuaW5kZXg7IH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLXZhbFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC52YWw7IH0pXHJcbiAgICAgICAgICAgIC5jYWxsKGJ1dHRvbik7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGF5ZXJCdG5zID0gYnRuRy5zZWxlY3RBbGwoJy5idXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLmxheWVycylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgbWFpbldpZHRoID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXHJcbiAgICAgICAgICAgIG1haW5IZWlnaHQgPSAkKFwiI25vZGVzLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXHJcbiAgICAgICAgICAgIGJ0bldpZHRoID0gJChcIiNidG4tY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxyXG4gICAgICAgICAgICBidG5IZWlnaHQgPSAkKFwiI2J0bi1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG5cclxuICAgICAgICBidG5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIGJ0bldpZHRoKSAqIDAuNSArIFwiLCAwKVwiKTtcclxuICAgICAgICBtYWluRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBtYWluV2lkdGgpICogMC41ICsgXCIsIFwiICsgKG1haW5IZWlnaHQgKiAwLjUpICsgXCIpXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhbnZhcy5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgY2FudmFzLmF0dHIoXCJoZWlnaHRcIiwgbWFpbkhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBidG5DYW52YXMuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcclxuICAgICAgICAgICAgICAgIGJ0bkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChidG5DYW52YXMuYXR0cihcIndpZHRoXCIpIC0gYnRuV2lkdGgpICogMC41ICsgXCIsIDApXCIpO1xyXG4gICAgICAgICAgICAgICAgbWFpbkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbWFpbldpZHRoKSAqIDAuNSArIFwiLCBcIiArIChtYWluSGVpZ2h0ICogMC41KSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTm9kZXMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGxldCB2Q2VudGVyID0gMDsvL01hdGguZmxvb3IoJChcIiNkZXNpZ25lci1jb250YWluZXJcIikuaGVpZ2h0KCkgLyAyKTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSAwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXllcnNbaV0gJSAyID09IDApXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIChsYXllcnNbaV0gKiBtdWx0IC8gMikgKyAobXVsdCAvIDIpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIE1hdGguZmxvb3IobGF5ZXJzW2ldIC8gMikgKiBtdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7IFwibmFtZVwiOiBpICsgXCIgXCIgKyBqLCB4OiB4LCB5OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBtdWx0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9MaW5rcyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlN1bSA9IGxheWVycy5zbGljZSgwLCBpICsgMSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gcHJldlN1bTsgeSA8IHByZXZTdW0gKyBsYXllcnNbaSArIDFdOyB5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh7IHNvdXJjZTogeCwgdGFyZ2V0OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb1VJID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBuZXVyb25VSSA9IFtdO1xyXG4gICAgICAgIGxldCBsYXllclVJID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gNTA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgICAgIG5ldXJvblVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IHgsIHk6IHkgLSAyMCwgaW5kZXg6IGksIHZhbDogLTEgfSk7XHJcbiAgICAgICAgICAgIG5ldXJvblVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHkgKyAyMCwgaW5kZXg6IGksIHZhbDogMSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IDAsIHk6IHksIGFjdGlvbjogXCJyZW1vdmVcIiB9KTtcclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHksIGFjdGlvbjogXCJhZGRcIiB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgbmV1cm9uczogbmV1cm9uVUksIGxheWVyczogbGF5ZXJVSSB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYnV0dG9uID0gZDMuYnV0dG9uKClcclxuICAgICAgICAub24oJ3ByZXNzJywgZnVuY3Rpb24gKGQsIGkpIHsgfSlcclxuICAgICAgICAub24oJ3JlbGVhc2UnLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICBpZiAoZC5pbmRleCAhPSB1bmRlZmluZWQgJiYgZC52YWwgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJzKGQuaW5kZXgsIGQudmFsKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoZC5hY3Rpb24gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgbW9kaWZ5TGF5ZXJzKGQuYWN0aW9uKTtcclxuICAgICAgICAgICAgdXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICB1cGRhdGVWaXN1YWxzOiB1cGRhdGVWaXN1YWxzLFxyXG4gICAgfVxyXG4gICAgXHJcbn0pKCk7IiwidmFyIHNhbmRib3ggPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBzZWxmID0gbnVsbDtcclxuXHJcbiAgICB2YXIgbGF5ZXJzID0gWzMsIDQsIDJdLFxyXG4gICAgICAgIHdlaWdodHMgPSAwLjUsXHJcbiAgICAgICAgYmlhcyA9IDEsXHJcbiAgICAgICAgaW5wdXQgPSBbMCwgMSwgMF07XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgIHByZWZpbGxJbnB1dChjb250ZXh0KTtcclxuICAgICAgICAkKGNvbnRleHQpLm9uKFwiY2xpY2tcIiwgXCIuanMtcnVuU2FuZGJveFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJ1bihjb250ZXh0KTsgIFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGNvbnRleHQpLm9uKFwia2V5dXAgY2hhbmdlXCIsIFwiLmpzLWxheWVyc1NhbmRib3hcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwYXJzZUxheWVycyhjb250ZXh0KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChjb250ZXh0KS5vbihcImtleXVwIGNoYW5nZVwiLCBcIi5qcy1pbnB1dFNhbmRib3hcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwYXJzZUlucHV0KGNvbnRleHQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGNvbnRleHQpLm9uKFwia2V5dXAgY2hhbmdlXCIsIFwiLmpzLXdlaWdodHNTYW5kYm94XCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAkKHRoaXMpLnZhbCgpO1xyXG4gICAgICAgICAgICBpZiAoaXNOdW1lcmljKGNvbnRlbnQpKVxyXG4gICAgICAgICAgICAgICAgd2VpZ2h0cyA9IHBhcnNlRmxvYXQoY29udGVudCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQoY29udGV4dCkub24oXCJrZXl1cCBjaGFuZ2VcIiwgXCIuanMtYmlhc1NhbmRib3hcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgY29udGVudCA9ICQodGhpcykudmFsKCk7XHJcbiAgICAgICAgICAgIGlmIChpc051bWVyaWMoY29udGVudCkpXHJcbiAgICAgICAgICAgICAgICBiaWFzID0gcGFyc2VGbG9hdChjb250ZW50KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcHJlZmlsbElucHV0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICAkKFwiLmpzLWxheWVyc1NhbmRib3hcIiwgY29udGV4dCkudmFsKGxheWVycy5qb2luKCkpO1xyXG4gICAgICAgICQoXCIuanMtd2VpZ2h0c1NhbmRib3hcIiwgY29udGV4dCkudmFsKHdlaWdodHMpO1xyXG4gICAgICAgICQoXCIuanMtYmlhc1NhbmRib3hcIiwgY29udGV4dCkudmFsKGJpYXMpO1xyXG4gICAgICAgICQoXCIuanMtaW5wdXRTYW5kYm94XCIsIGNvbnRleHQpLnZhbChpbnB1dC5qb2luKCkpO1xyXG4gICAgICAgIHJ1bihjb250ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFyc2VMYXllcnMgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gJChcIi5qcy1sYXllcnNTYW5kYm94XCIsIGNvbnRleHQpLnZhbCgpO1xyXG4gICAgICAgIHZhciBzcGxpdEFycmF5ID0gY29udGVudC5zcGxpdChcIixcIilcclxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS50cmltKCkgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCBcIlwiKSB9KTtcclxuICAgICAgICBpZiAoc3BsaXRBcnJheS5sZW5ndGggPCAzKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgbGF5ZXJzID0gW107XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGxpdEFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0ludChzcGxpdEFycmF5W2ldKSAmJiBwYXJzZUludChzcGxpdEFycmF5W2ldKSA+IDApXHJcbiAgICAgICAgICAgICAgICBsYXllcnMucHVzaChwYXJzZUludChzcGxpdEFycmF5W2ldKSk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwbGl0QXJyYXlbaV0gKyBcIiBpcyBub3QgYW4gaW50ZWdlciBvciBpc24ndCBncmVhdGVyIHRoYW4gMFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8kKFwiLmpzLWxheWVyc1NhbmRib3gtb3V0XCIsIGNvbnRleHQpLmh0bWwobGF5ZXJzLmpvaW4oKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHBhcnNlSW5wdXQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gJChcIi5qcy1pbnB1dFNhbmRib3hcIiwgY29udGV4dCkudmFsKCk7XHJcbiAgICAgICAgdmFyIHNwbGl0QXJyYXkgPSBjb250ZW50LnNwbGl0KFwiLFwiKVxyXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLnRyaW0oKSB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChlKSB7IHJldHVybiBlLnJlcGxhY2UoLyhcXHJcXG58XFxufFxccikvZ20sIFwiXCIpIH0pO1xyXG4gICAgICAgIGlucHV0ID0gc3BsaXRBcnJheTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFyIGlzSW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHg7XHJcbiAgICAgICAgcmV0dXJuIGlzTmFOKHZhbHVlKSA/ICExIDogKHggPSBwYXJzZUZsb2F0KHZhbHVlKSwgKDAgfCB4KSA9PT0geCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGlzTnVtZXJpYyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcHJldHR5UHJpbnQgPSBmdW5jdGlvbiAoaywgdikge1xyXG4gICAgICAgIGlmICh2IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIChrICE9IFwib3V0cHV0XCIpID8gSlNPTi5zdHJpbmdpZnkodikgOiB2O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxheWVyczogbGF5ZXJzLFxyXG4gICAgICAgICAgICB3ZWlnaHRWYWx1ZTogd2VpZ2h0cyxcclxuICAgICAgICAgICAgYmlhc1ZhbHVlOiBiaWFzLFxyXG4gICAgICAgICAgICBpbnB1dDogaW5wdXRcclxuICAgICAgICB9XHJcbiAgICAgICAgZ29tLmNsZXcucnVuU2FuZGJveChkYXRhKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICQoXCIuanNvbi1yZXN1bHRcIiwgY29udGV4dCkuanNvbkJyb3dzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAuaHRtbChKU09OLnN0cmluZ2lmeShyZXNwb25zZSwgcHJldHR5UHJpbnQsIDIpKTtcclxuICAgICAgICAgICAgICAgIC8vJChcIi5qc29uLXJlc3VsdFwiKS5lYWNoKGZ1bmN0aW9uIChpLCB2KSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBobGpzLmhpZ2hsaWdodEJsb2NrKHYpO1xyXG4gICAgICAgICAgICAgICAgLy99KTtcclxuICAgICAgICAgICAgICAgIC8vaGxqcy5oaWdobGlnaHRCbG9jaygkKFwiLmpzb24tcmVzdWx0XCIsIGNvbnRleHQpKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiLmpzb24tcmVzdWx0XCIsIGNvbnRleHQpLmh0bWwoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2UsIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0LFxyXG4gICAgICAgIHdlaWdodHM6IHdlaWdodHMsXHJcbiAgICAgICAgYmlhczogYmlhcyxcclxuICAgIH1cclxufSkoKTsiXX0=
