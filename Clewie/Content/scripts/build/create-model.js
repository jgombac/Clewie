
var neuralNetwork = (function () {

    var features = [];
    var targets = [];
    var layers = [4, 5, 3];
    var locked = false;

    var init = function (context) {

        nnVisual.init(context, this);
        $(".start-btn").click(function () {
            uploadParameters();
            console.log(layers);
        });
        setDefaultParameters();
    };

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
        console.log(param, data);
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


    var uploadParameters = function () {
        var data = {
            layers: layers,
            maxEpochs: parseFloat($("#max-epochs").val()),
            learningRate: parseFloat($("#learning-rate").val()),
            momentum: parseFloat($("#momentum").val()),
            weightDecay: parseFloat($("#weight-decay").val()),
        }
        gom.clew.uploadParameters(data)
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
        console.log(data);


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
        
        console.log(btnHeight, mainHeight, canvas.attr("height"));
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

    var init = function (context) {
        //this.context = context;


        $(context).on("click", ".js-runSandbox", function () {
            run(context, {});
        });

        $(context).on("keyup change", ".js-layersSandbox", function () {
            parseLayers(context);
        });
    }

    var parseLayers = function (context) {
        var input = $(".js-layersSandbox", context).val();
        var parsed = input.split(",")
            .map(function (item) {
                return item.trim();
            })
            .filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") });
        //split(",").filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "").replace(" ", "") });
        console.log("parsed value", parsed);

    }




    var run = function (context, data) {
        console.log("running sandbox");
        gom.clew.runSandbox(data)
            .done(function (response) {
                //console.log(JSON.stringify(JSON.parse(response), null, 2));
                $(".json-result", context).html(JSON.stringify(response, null, 2));
            })
            .fail(function (response) {
                console.log("failed sandbox.run", response);
            });
    }

    return {
        init: init,
    }
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyIsIm5uLXNhbmRib3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyZWF0ZS1tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgbmV1cmFsTmV0d29yayA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGZlYXR1cmVzID0gW107XHJcbiAgICB2YXIgdGFyZ2V0cyA9IFtdO1xyXG4gICAgdmFyIGxheWVycyA9IFs0LCA1LCAzXTtcclxuICAgIHZhciBsb2NrZWQgPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcblxyXG4gICAgICAgIG5uVmlzdWFsLmluaXQoY29udGV4dCwgdGhpcyk7XHJcbiAgICAgICAgJChcIi5zdGFydC1idG5cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB1cGxvYWRQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxheWVycyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgc2V0RGVmYXVsdFBhcmFtZXRlcnMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHNldERlZmF1bHRQYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIjbWF4LWVwb2Noc1wiKS52YWwoMTAwMCk7XHJcbiAgICAgICAgJChcIiNsZWFybmluZy1yYXRlXCIpLnZhbCgwLjAxKTtcclxuICAgICAgICAkKFwiI21vbWVudHVtXCIpLnZhbCgwLjAxKTtcclxuICAgICAgICAkKFwiI3dlaWdodC1kZWNheVwiKS52YWwoMC4wMSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldFBhcmFtZXRlciA9IGZ1bmN0aW9uIChwYXJhbSwgZGF0YSkge1xyXG4gICAgICAgIGlmIChwYXJhbSA9PSBcImZlYXR1cmVzXCIpXHJcbiAgICAgICAgICAgIHRoaXMuZmVhdHVyZXMgPSBkYXRhO1xyXG4gICAgICAgIGVsc2UgaWYgKHBhcmFtID09IFwidGFyZ2V0XCIpXHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0cyA9IGRhdGE7XHJcbiAgICAgICAgY29uc29sZS5sb2cocGFyYW0sIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIHRoaXMubGF5ZXJzID0gbGF5ZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBzZXRGaXhlZExheWVycyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICAvL2xvY2sgbGF5ZXJzIGlmIGEgdXNlciBwcm92aWRlcyB0cmFpbmluZyBkYXRhc2V0XHJcbiAgICAgICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICAgICAgdGhpcy5sb2NrZWQgPSB0cnVlO1xyXG4gICAgICAgIG5uVmlzdWFsLnVwZGF0ZVZpc3VhbHMobGF5ZXJzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgdmFyIHVwbG9hZFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIGxheWVyczogbGF5ZXJzLFxyXG4gICAgICAgICAgICBtYXhFcG9jaHM6IHBhcnNlRmxvYXQoJChcIiNtYXgtZXBvY2hzXCIpLnZhbCgpKSxcclxuICAgICAgICAgICAgbGVhcm5pbmdSYXRlOiBwYXJzZUZsb2F0KCQoXCIjbGVhcm5pbmctcmF0ZVwiKS52YWwoKSksXHJcbiAgICAgICAgICAgIG1vbWVudHVtOiBwYXJzZUZsb2F0KCQoXCIjbW9tZW50dW1cIikudmFsKCkpLFxyXG4gICAgICAgICAgICB3ZWlnaHREZWNheTogcGFyc2VGbG9hdCgkKFwiI3dlaWdodC1kZWNheVwiKS52YWwoKSksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdvbS5jbGV3LnVwbG9hZFBhcmFtZXRlcnMoZGF0YSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSkgeyBjb25zb2xlLmxvZyhcImZhaWxcIikgfSk7XHJcbiAgICB9XHJcbiAgXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICAgICAgbGF5ZXJzOiBsYXllcnMsXHJcbiAgICAgICAgbG9ja2VkOiBsb2NrZWQsXHJcbiAgICAgICAgZmVhdHVyZXM6IGZlYXR1cmVzLFxyXG4gICAgICAgIHNldFBhcmFtZXRlcjogc2V0UGFyYW1ldGVyLFxyXG4gICAgICAgIHVwZGF0ZUxheWVyczogdXBkYXRlTGF5ZXJzLFxyXG4gICAgICAgIHNldEZpeGVkTGF5ZXJzOiBzZXRGaXhlZExheWVycyxcclxuICAgIH07XHJcbn0pKCk7IiwidmFyIG5uVmlzdWFsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjb250ZXh0ID0gbnVsbDtcclxuICAgIHZhciBsYXllcnMgPSBudWxsO1xyXG5cclxuXHJcbiAgICB2YXIgd2lkdGggPSAwLFxyXG4gICAgICAgIGhlaWdodCA9IDA7XHJcblxyXG4gICAgdmFyIGNhbnZhcyA9IG51bGwsXHJcbiAgICAgICAgbWFpbkcgPSBudWxsO1xyXG5cclxuICAgIHZhciBidG5DYW52YXMgPSBudWxsLFxyXG4gICAgICAgIGJ0bkcgPSBudWxsO1xyXG5cclxuICAgIHZhciBkYXRhID0gbnVsbDtcclxuXHJcbiAgICB2YXIgbm4gPSBudWxsO1xyXG5cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5uKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm5uID0gbm47XHJcbiAgICAgICAgbGF5ZXJzID0gbm4ubGF5ZXJzO1xyXG5cclxuICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICBoZWlnaHQgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIGNhbnZhcyA9IGQzLnNlbGVjdChcIiNsYXllci1kZXNpZ25lclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImRlc2lnbmVyLWNvbnRhaW5lclwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBtYWluRyA9IGNhbnZhcy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJub2Rlcy1jb250YWluZXJcIik7XHJcblxyXG4gICAgICAgIGJ0bkNhbnZhcyA9IGQzLnNlbGVjdChcIiNidG4td3JhcHBlclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImJ0bi1jYW52YXNcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgMTAwKTtcclxuXHJcbiAgICAgICAgYnRuRyA9IGJ0bkNhbnZhcy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJidG4tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW5pdFZpc3VhbERhdGEgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IGxheWVyc1RvTm9kZXMobGF5ZXJzKSxcclxuICAgICAgICAgICAgbGlua3M6IGxheWVyc1RvTGlua3MobGF5ZXJzKSxcclxuICAgICAgICAgICAgdWk6IGxheWVyc1RvVUkobGF5ZXJzKSxcclxuICAgICAgICB9O1xyXG4gICAgfSBcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGksIHgpIHtcclxuICAgICAgICAvL2lmIGxheWVycyBhcmUgbG9ja2VkLCBkb250IG1vZGlmeSBpbnB1dHMgYW5kIG91dHB1dHNcclxuICAgICAgICBpZiAobmV1cmFsTmV0d29yay5sb2NrZWQgJiYgKGkgPT0gMCB8fCBpID09IGxheWVycy5sZW5ndGggLSAxKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vbGF5ZXIgbXVzdCBjb250YWluIGF0bGVhc3Qgb25lIG5ldXJvbmNkXHJcbiAgICAgICAgaWYgKGxheWVyc1tpXSA8PSAxICYmIHggPT0gLTEpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBsYXllcnNbaV0gKz0geDtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBuZXVyYWxOZXR3b3JrLnVwZGF0ZUxheWVycyhsYXllcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtb2RpZnlMYXllcnMgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgLy9kb250IGNhbnQgcmVtb3ZlIGFueSBsYXllcnMgaWYgdGhlcmUgYXJlIG9ubHkgMlxyXG4gICAgICAgIGlmIChsYXllcnMubGVuZ3RoIDw9IDIgJiYgYWN0aW9uID09IFwicmVtb3ZlXCIpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvL2lmIGxheWVycyBhcmUgbG9ja2VkIGluc2VydCBhIGxheWVyIGJlZm9yZSB0aGUgZW5kLCBvdGhlcndpc2UgdG8gdGhlIGVuZFxyXG4gICAgICAgIGlmIChhY3Rpb24gPT0gXCJhZGRcIilcclxuICAgICAgICAgICAgKG5ldXJhbE5ldHdvcmsubG9ja2VkKSA/IGxheWVycy5zcGxpY2UobGF5ZXJzLmxlbmd0aCAtIDEsIDAsIDEpIDogbGF5ZXJzLnB1c2goMSk7XHJcbiAgICAgICAgLy9yZW1vdmUgYSBsYXllciBiZWZvcmUgdGhlIGVuZCBpZiBsYXllcnMgYXJlIGxvY2tlZFxyXG4gICAgICAgIGVsc2UgaWYgKGFjdGlvbiA9PSBcInJlbW92ZVwiKVxyXG4gICAgICAgICAgICAobmV1cmFsTmV0d29yay5sb2NrZWQpID8gbGF5ZXJzLnNwbGljZShsYXllcnMubGVuZ3RoLTIsIDEpIDogbGF5ZXJzLnBvcCgpO1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIG5ldXJhbE5ldHdvcmsudXBkYXRlTGF5ZXJzKGxheWVycyk7XHJcbiAgICB9IFxyXG5cclxuICAgIHZhciB1cGRhdGVWaXN1YWxzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbWFpbkcuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcclxuICAgICAgICBidG5HLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBsaW5rID0gbWFpbkcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5saW5rcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk1cIiArIHNvdXJjZS54ICsgXCIsXCIgKyBzb3VyY2UueVxyXG4gICAgICAgICAgICAgICAgICAgICsgXCJDXCIgKyBzb3VyY2UueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgdGFyZ2V0Lnk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IG1haW5HLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubm9kZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgMTApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5ldXJvbkJ0bnMgPSBidG5HLnNlbGVjdEFsbCgnLmJ1dHRvbi1uZXVyb24nKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLm5ldXJvbnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLWluZGV4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmluZGV4OyB9KVxyXG4gICAgICAgICAgICAuYXR0cihcImdvbS1sYXllci12YWxcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxheWVyQnRucyA9IGJ0bkcuc2VsZWN0QWxsKCcuYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS51aS5sYXllcnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmNhbGwoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgdmFyIG1haW5XaWR0aCA9ICQoXCIjbm9kZXMtY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxyXG4gICAgICAgICAgICBtYWluSGVpZ2h0ID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxyXG4gICAgICAgICAgICBidG5XaWR0aCA9ICQoXCIjYnRuLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcclxuICAgICAgICAgICAgYnRuSGVpZ2h0ID0gJChcIiNidG4tY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuXHJcbiAgICAgICAgYnRuRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGJ0bkNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBidG5XaWR0aCkgKiAwLjUgKyBcIiwgMClcIik7XHJcbiAgICAgICAgbWFpbkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbWFpbldpZHRoKSAqIDAuNSArIFwiLCBcIiArIChtYWluSGVpZ2h0ICogMC41KSArIFwiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhidG5IZWlnaHQsIG1haW5IZWlnaHQsIGNhbnZhcy5hdHRyKFwiaGVpZ2h0XCIpKTtcclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYW52YXMuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcclxuICAgICAgICAgICAgICAgIGNhbnZhcy5hdHRyKFwiaGVpZ2h0XCIsIG1haW5IZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBidG5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIGJ0bldpZHRoKSAqIDAuNSArIFwiLCAwKVwiKTtcclxuICAgICAgICAgICAgICAgIG1haW5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoY2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIG1haW5XaWR0aCkgKiAwLjUgKyBcIiwgXCIgKyAobWFpbkhlaWdodCAqIDAuNSkgKyBcIilcIik7XHJcblxyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYXllcnNUb05vZGVzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgdkNlbnRlciA9IDA7Ly9NYXRoLmZsb29yKCQoXCIjZGVzaWduZXItY29udGFpbmVyXCIpLmhlaWdodCgpIC8gMik7XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gMDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGF5ZXJzW2ldICUgMiA9PSAwKVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSAobGF5ZXJzW2ldICogbXVsdCAvIDIpICsgKG11bHQgLyAyKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSBNYXRoLmZsb29yKGxheWVyc1tpXSAvIDIpICogbXVsdDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goeyBcIm5hbWVcIjogaSArIFwiIFwiICsgaiwgeDogeCwgeTogeSB9KTtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgbXVsdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTGlua3MgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZTdW0gPSBsYXllcnMuc2xpY2UoMCwgaSArIDEpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IHByZXZTdW07IHkgPCBwcmV2U3VtICsgbGF5ZXJzW2kgKyAxXTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goeyBzb3VyY2U6IHgsIHRhcmdldDogeSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9VSSA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgbmV1cm9uVUkgPSBbXTtcclxuICAgICAgICBsZXQgbGF5ZXJVSSA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDUwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiB4LCB5OiB5IC0gMjAsIGluZGV4OiBpLCB2YWw6IC0xIH0pO1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5ICsgMjAsIGluZGV4OiBpLCB2YWw6IDEgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiAwLCB5OiB5LCBhY3Rpb246IFwicmVtb3ZlXCIgfSk7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5LCBhY3Rpb246IFwiYWRkXCIgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IG5ldXJvbnM6IG5ldXJvblVJLCBsYXllcnM6IGxheWVyVUkgfTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGJ1dHRvbiA9IGQzLmJ1dHRvbigpXHJcbiAgICAgICAgLm9uKCdwcmVzcycsIGZ1bmN0aW9uIChkLCBpKSB7IH0pXHJcbiAgICAgICAgLm9uKCdyZWxlYXNlJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGQuaW5kZXggIT0gdW5kZWZpbmVkICYmIGQudmFsICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxheWVycyhkLmluZGV4LCBkLnZhbCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGQuYWN0aW9uICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIG1vZGlmeUxheWVycyhkLmFjdGlvbik7XHJcbiAgICAgICAgICAgIHVwZGF0ZShkYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICAgICAgdXBkYXRlVmlzdWFsczogdXBkYXRlVmlzdWFscyxcclxuICAgIH1cclxuICAgIFxyXG59KSgpOyIsInZhciBzYW5kYm94ID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgLy90aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG5cclxuXHJcbiAgICAgICAgJChjb250ZXh0KS5vbihcImNsaWNrXCIsIFwiLmpzLXJ1blNhbmRib3hcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBydW4oY29udGV4dCwge30pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkKGNvbnRleHQpLm9uKFwia2V5dXAgY2hhbmdlXCIsIFwiLmpzLWxheWVyc1NhbmRib3hcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBwYXJzZUxheWVycyhjb250ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgcGFyc2VMYXllcnMgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBpbnB1dCA9ICQoXCIuanMtbGF5ZXJzU2FuZGJveFwiLCBjb250ZXh0KS52YWwoKTtcclxuICAgICAgICB2YXIgcGFyc2VkID0gaW5wdXQuc3BsaXQoXCIsXCIpXHJcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpdGVtLnRyaW0oKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoZSkgeyByZXR1cm4gZS5yZXBsYWNlKC8oXFxyXFxufFxcbnxcXHIpL2dtLCBcIlwiKSB9KTtcclxuICAgICAgICAvL3NwbGl0KFwiLFwiKS5maWx0ZXIoZnVuY3Rpb24gKGUpIHsgcmV0dXJuIGUucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyKS9nbSwgXCJcIikucmVwbGFjZShcIiBcIiwgXCJcIikgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwYXJzZWQgdmFsdWVcIiwgcGFyc2VkKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIChjb250ZXh0LCBkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJydW5uaW5nIHNhbmRib3hcIik7XHJcbiAgICAgICAgZ29tLmNsZXcucnVuU2FuZGJveChkYXRhKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoSlNPTi5wYXJzZShyZXNwb25zZSksIG51bGwsIDIpKTtcclxuICAgICAgICAgICAgICAgICQoXCIuanNvbi1yZXN1bHRcIiwgY29udGV4dCkuaHRtbChKU09OLnN0cmluZ2lmeShyZXNwb25zZSwgbnVsbCwgMikpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmFpbGVkIHNhbmRib3gucnVuXCIsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0LFxyXG4gICAgfVxyXG59KSgpOyJdfQ==
