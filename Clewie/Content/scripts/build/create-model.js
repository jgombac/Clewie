
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3JlYXRlLW1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBuZXVyYWxOZXR3b3JrID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgZmVhdHVyZXMgPSBbXTtcclxuICAgIHZhciB0YXJnZXRzID0gW107XHJcbiAgICB2YXIgbGF5ZXJzID0gWzQsIDUsIDNdO1xyXG4gICAgdmFyIGxvY2tlZCA9IGZhbHNlO1xyXG5cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuXHJcbiAgICAgICAgbm5WaXN1YWwuaW5pdChjb250ZXh0LCB0aGlzKTtcclxuICAgICAgICAkKFwiLnN0YXJ0LWJ0blwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHVwbG9hZFBhcmFtZXRlcnMoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cobGF5ZXJzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBzZXREZWZhdWx0UGFyYW1ldGVycygpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgc2V0RGVmYXVsdFBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIiNtYXgtZXBvY2hzXCIpLnZhbCgxMDAwKTtcclxuICAgICAgICAkKFwiI2xlYXJuaW5nLXJhdGVcIikudmFsKDAuMDEpO1xyXG4gICAgICAgICQoXCIjbW9tZW50dW1cIikudmFsKDAuMDEpO1xyXG4gICAgICAgICQoXCIjd2VpZ2h0LWRlY2F5XCIpLnZhbCgwLjAxKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgc2V0UGFyYW1ldGVyID0gZnVuY3Rpb24gKHBhcmFtLCBkYXRhKSB7XHJcbiAgICAgICAgaWYgKHBhcmFtID09IFwiZmVhdHVyZXNcIilcclxuICAgICAgICAgICAgdGhpcy5mZWF0dXJlcyA9IGRhdGE7XHJcbiAgICAgICAgZWxzZSBpZiAocGFyYW0gPT0gXCJ0YXJnZXRcIilcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRzID0gZGF0YTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwYXJhbSwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhciB1cGRhdGVMYXllcnMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldEZpeGVkTGF5ZXJzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIC8vbG9jayBsYXllcnMgaWYgYSB1c2VyIHByb3ZpZGVzIHRyYWluaW5nIGRhdGFzZXRcclxuICAgICAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgICAgICB0aGlzLmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgbm5WaXN1YWwudXBkYXRlVmlzdWFscyhsYXllcnMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YXIgdXBsb2FkUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgbGF5ZXJzOiBsYXllcnMsXHJcbiAgICAgICAgICAgIG1heEVwb2NoczogcGFyc2VGbG9hdCgkKFwiI21heC1lcG9jaHNcIikudmFsKCkpLFxyXG4gICAgICAgICAgICBsZWFybmluZ1JhdGU6IHBhcnNlRmxvYXQoJChcIiNsZWFybmluZy1yYXRlXCIpLnZhbCgpKSxcclxuICAgICAgICAgICAgbW9tZW50dW06IHBhcnNlRmxvYXQoJChcIiNtb21lbnR1bVwiKS52YWwoKSksXHJcbiAgICAgICAgICAgIHdlaWdodERlY2F5OiBwYXJzZUZsb2F0KCQoXCIjd2VpZ2h0LWRlY2F5XCIpLnZhbCgpKSxcclxuICAgICAgICB9XHJcbiAgICAgICAgZ29tLmNsZXcudXBsb2FkUGFyYW1ldGVycyhkYXRhKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKHJlc3BvbnNlKSB7IGNvbnNvbGUubG9nKFwiZmFpbFwiKSB9KTtcclxuICAgIH1cclxuICBcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICBsYXllcnM6IGxheWVycyxcclxuICAgICAgICBsb2NrZWQ6IGxvY2tlZCxcclxuICAgICAgICBmZWF0dXJlczogZmVhdHVyZXMsXHJcbiAgICAgICAgc2V0UGFyYW1ldGVyOiBzZXRQYXJhbWV0ZXIsXHJcbiAgICAgICAgdXBkYXRlTGF5ZXJzOiB1cGRhdGVMYXllcnMsXHJcbiAgICAgICAgc2V0Rml4ZWRMYXllcnM6IHNldEZpeGVkTGF5ZXJzLFxyXG4gICAgfTtcclxufSkoKTsiLCJ2YXIgbm5WaXN1YWwgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGNvbnRleHQgPSBudWxsO1xyXG4gICAgdmFyIGxheWVycyA9IG51bGw7XHJcblxyXG5cclxuICAgIHZhciB3aWR0aCA9IDAsXHJcbiAgICAgICAgaGVpZ2h0ID0gMDtcclxuXHJcbiAgICB2YXIgY2FudmFzID0gbnVsbCxcclxuICAgICAgICBtYWluRyA9IG51bGw7XHJcblxyXG4gICAgdmFyIGJ0bkNhbnZhcyA9IG51bGwsXHJcbiAgICAgICAgYnRuRyA9IG51bGw7XHJcblxyXG4gICAgdmFyIGRhdGEgPSBudWxsO1xyXG5cclxuICAgIHZhciBubiA9IG51bGw7XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoY29udGV4dCwgbm4pIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMubm4gPSBubjtcclxuICAgICAgICBsYXllcnMgPSBubi5sYXllcnM7XHJcblxyXG4gICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpO1xyXG4gICAgICAgIGhlaWdodCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG5cclxuXHJcbiAgICAgICAgY2FudmFzID0gZDMuc2VsZWN0KFwiI2xheWVyLWRlc2lnbmVyXCIpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZGVzaWduZXItY29udGFpbmVyXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIG1haW5HID0gY2FudmFzLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcIm5vZGVzLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICAgICAgYnRuQ2FudmFzID0gZDMuc2VsZWN0KFwiI2J0bi13cmFwcGVyXCIpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiYnRuLWNhbnZhc1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCAxMDApO1xyXG5cclxuICAgICAgICBidG5HID0gYnRuQ2FudmFzLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImJ0bi1jb250YWluZXJcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBpbml0VmlzdWFsRGF0YSA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBub2RlczogbGF5ZXJzVG9Ob2RlcyhsYXllcnMpLFxyXG4gICAgICAgICAgICBsaW5rczogbGF5ZXJzVG9MaW5rcyhsYXllcnMpLFxyXG4gICAgICAgICAgICB1aTogbGF5ZXJzVG9VSShsYXllcnMpLFxyXG4gICAgICAgIH07XHJcbiAgICB9IFxyXG5cclxuICAgIHZhciB1cGRhdGVMYXllcnMgPSBmdW5jdGlvbiAoaSwgeCkge1xyXG4gICAgICAgIC8vaWYgbGF5ZXJzIGFyZSBsb2NrZWQsIGRvbnQgbW9kaWZ5IGlucHV0cyBhbmQgb3V0cHV0c1xyXG4gICAgICAgIGlmIChuZXVyYWxOZXR3b3JrLmxvY2tlZCAmJiAoaSA9PSAwIHx8IGkgPT0gbGF5ZXJzLmxlbmd0aCAtIDEpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy9sYXllciBtdXN0IGNvbnRhaW4gYXRsZWFzdCBvbmUgbmV1cm9uY2RcclxuICAgICAgICBpZiAobGF5ZXJzW2ldIDw9IDEgJiYgeCA9PSAtMSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIGxheWVyc1tpXSArPSB4O1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIG5ldXJhbE5ldHdvcmsudXBkYXRlTGF5ZXJzKGxheWVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIG1vZGlmeUxheWVycyA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICAvL2RvbnQgY2FudCByZW1vdmUgYW55IGxheWVycyBpZiB0aGVyZSBhcmUgb25seSAyXHJcbiAgICAgICAgaWYgKGxheWVycy5sZW5ndGggPD0gMiAmJiBhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIC8vaWYgbGF5ZXJzIGFyZSBsb2NrZWQgaW5zZXJ0IGEgbGF5ZXIgYmVmb3JlIHRoZSBlbmQsIG90aGVyd2lzZSB0byB0aGUgZW5kXHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImFkZFwiKVxyXG4gICAgICAgICAgICAobmV1cmFsTmV0d29yay5sb2NrZWQpID8gbGF5ZXJzLnNwbGljZShsYXllcnMubGVuZ3RoIC0gMSwgMCwgMSkgOiBsYXllcnMucHVzaCgxKTtcclxuICAgICAgICAvL3JlbW92ZSBhIGxheWVyIGJlZm9yZSB0aGUgZW5kIGlmIGxheWVycyBhcmUgbG9ja2VkXHJcbiAgICAgICAgZWxzZSBpZiAoYWN0aW9uID09IFwicmVtb3ZlXCIpXHJcbiAgICAgICAgICAgIChuZXVyYWxOZXR3b3JrLmxvY2tlZCkgPyBsYXllcnMuc3BsaWNlKGxheWVycy5sZW5ndGgtMiwgMSkgOiBsYXllcnMucG9wKCk7XHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcbiAgICAgICAgbmV1cmFsTmV0d29yay51cGRhdGVMYXllcnMobGF5ZXJzKTtcclxuICAgIH0gXHJcblxyXG4gICAgdmFyIHVwZGF0ZVZpc3VhbHMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcbiAgICAgICAgdXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBtYWluRy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGJ0bkcuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcclxuICAgICAgICBkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxpbmsgPSBtYWluRy5zZWxlY3RBbGwoXCIubGlua1wiKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLmxpbmtzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGRhdGEubm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkgPT0gbC5zb3VyY2VcclxuICAgICAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IGRhdGEubm9kZXMuZmlsdGVyKGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkgPT0gbC50YXJnZXRcclxuICAgICAgICAgICAgICAgIH0pWzBdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiTVwiICsgc291cmNlLnggKyBcIixcIiArIHNvdXJjZS55XHJcbiAgICAgICAgICAgICAgICAgICAgKyBcIkNcIiArIHNvdXJjZS54ICsgXCIsXCIgKyAoc291cmNlLnkgKyB0YXJnZXQueSkgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgKyBcIiBcIiArIHRhcmdldC54ICsgXCIsXCIgKyAoc291cmNlLnkgKyB0YXJnZXQueSkgLyAyXHJcbiAgICAgICAgICAgICAgICAgICAgKyBcIiBcIiArIHRhcmdldC54ICsgXCIsXCIgKyB0YXJnZXQueTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gbWFpbkcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5ub2RlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCAxMClcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbmV1cm9uQnRucyA9IGJ0bkcuc2VsZWN0QWxsKCcuYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEudWkubmV1cm9ucylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbmV1cm9uJylcclxuICAgICAgICAgICAgLmF0dHIoXCJnb20tbGF5ZXItaW5kZXhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuaW5kZXg7IH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLXZhbFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC52YWw7IH0pXHJcbiAgICAgICAgICAgIC5jYWxsKGJ1dHRvbik7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGF5ZXJCdG5zID0gYnRuRy5zZWxlY3RBbGwoJy5idXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLmxheWVycylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgbWFpbldpZHRoID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXHJcbiAgICAgICAgICAgIG1haW5IZWlnaHQgPSAkKFwiI25vZGVzLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQsXHJcbiAgICAgICAgICAgIGJ0bldpZHRoID0gJChcIiNidG4tY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxyXG4gICAgICAgICAgICBidG5IZWlnaHQgPSAkKFwiI2J0bi1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xyXG5cclxuICAgICAgICBidG5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIGJ0bldpZHRoKSAqIDAuNSArIFwiLCAwKVwiKTtcclxuICAgICAgICBtYWluRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBtYWluV2lkdGgpICogMC41ICsgXCIsIFwiICsgKG1haW5IZWlnaHQgKiAwLjUpICsgXCIpXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnNvbGUubG9nKGJ0bkhlaWdodCwgbWFpbkhlaWdodCwgY2FudmFzLmF0dHIoXCJoZWlnaHRcIikpO1xyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhbnZhcy5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgY2FudmFzLmF0dHIoXCJoZWlnaHRcIiwgbWFpbkhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBidG5DYW52YXMuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcclxuICAgICAgICAgICAgICAgIGJ0bkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChidG5DYW52YXMuYXR0cihcIndpZHRoXCIpIC0gYnRuV2lkdGgpICogMC41ICsgXCIsIDApXCIpO1xyXG4gICAgICAgICAgICAgICAgbWFpbkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbWFpbldpZHRoKSAqIDAuNSArIFwiLCBcIiArIChtYWluSGVpZ2h0ICogMC41KSArIFwiKVwiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIDI1MCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTm9kZXMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGxldCB2Q2VudGVyID0gMDsvL01hdGguZmxvb3IoJChcIiNkZXNpZ25lci1jb250YWluZXJcIikuaGVpZ2h0KCkgLyAyKTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSAwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXllcnNbaV0gJSAyID09IDApXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIChsYXllcnNbaV0gKiBtdWx0IC8gMikgKyAobXVsdCAvIDIpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIE1hdGguZmxvb3IobGF5ZXJzW2ldIC8gMikgKiBtdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7IFwibmFtZVwiOiBpICsgXCIgXCIgKyBqLCB4OiB4LCB5OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBtdWx0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9MaW5rcyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlN1bSA9IGxheWVycy5zbGljZSgwLCBpICsgMSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gcHJldlN1bTsgeSA8IHByZXZTdW0gKyBsYXllcnNbaSArIDFdOyB5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh7IHNvdXJjZTogeCwgdGFyZ2V0OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb1VJID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBuZXVyb25VSSA9IFtdO1xyXG4gICAgICAgIGxldCBsYXllclVJID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gNTA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgICAgIG5ldXJvblVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IHgsIHk6IHkgLSAyMCwgaW5kZXg6IGksIHZhbDogLTEgfSk7XHJcbiAgICAgICAgICAgIG5ldXJvblVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHkgKyAyMCwgaW5kZXg6IGksIHZhbDogMSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IDAsIHk6IHksIGFjdGlvbjogXCJyZW1vdmVcIiB9KTtcclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHksIGFjdGlvbjogXCJhZGRcIiB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgbmV1cm9uczogbmV1cm9uVUksIGxheWVyczogbGF5ZXJVSSB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYnV0dG9uID0gZDMuYnV0dG9uKClcclxuICAgICAgICAub24oJ3ByZXNzJywgZnVuY3Rpb24gKGQsIGkpIHsgfSlcclxuICAgICAgICAub24oJ3JlbGVhc2UnLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICBpZiAoZC5pbmRleCAhPSB1bmRlZmluZWQgJiYgZC52YWwgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJzKGQuaW5kZXgsIGQudmFsKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoZC5hY3Rpb24gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgbW9kaWZ5TGF5ZXJzKGQuYWN0aW9uKTtcclxuICAgICAgICAgICAgdXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICB1cGRhdGVWaXN1YWxzOiB1cGRhdGVWaXN1YWxzLFxyXG4gICAgfVxyXG4gICAgXHJcbn0pKCk7Il19
