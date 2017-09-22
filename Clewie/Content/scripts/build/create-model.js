
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

    };

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
            maxEpochs: 2000,
            learningRate: 0.01,
            momentum: 0.001,
            weightDecay: 0.01,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyZWF0ZS1tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgbmV1cmFsTmV0d29yayA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGZlYXR1cmVzID0gW107XHJcbiAgICB2YXIgdGFyZ2V0cyA9IFtdO1xyXG4gICAgdmFyIGxheWVycyA9IFs0LCA1LCAzXTtcclxuICAgIHZhciBsb2NrZWQgPSBmYWxzZTtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcblxyXG4gICAgICAgIG5uVmlzdWFsLmluaXQoY29udGV4dCwgdGhpcyk7XHJcbiAgICAgICAgJChcIi5zdGFydC1idG5cIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB1cGxvYWRQYXJhbWV0ZXJzKCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxheWVycyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgc2V0UGFyYW1ldGVyID0gZnVuY3Rpb24gKHBhcmFtLCBkYXRhKSB7XHJcbiAgICAgICAgaWYgKHBhcmFtID09IFwiZmVhdHVyZXNcIilcclxuICAgICAgICAgICAgdGhpcy5mZWF0dXJlcyA9IGRhdGE7XHJcbiAgICAgICAgZWxzZSBpZiAocGFyYW0gPT0gXCJ0YXJnZXRcIilcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRzID0gZGF0YTtcclxuICAgICAgICBjb25zb2xlLmxvZyhwYXJhbSwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHZhciB1cGRhdGVMYXllcnMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHNldEZpeGVkTGF5ZXJzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIC8vbG9jayBsYXllcnMgaWYgYSB1c2VyIHByb3ZpZGVzIHRyYWluaW5nIGRhdGFzZXRcclxuICAgICAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgICAgICB0aGlzLmxvY2tlZCA9IHRydWU7XHJcbiAgICAgICAgbm5WaXN1YWwudXBkYXRlVmlzdWFscyhsYXllcnMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICB2YXIgdXBsb2FkUGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgbGF5ZXJzOiBsYXllcnMsXHJcbiAgICAgICAgICAgIG1heEVwb2NoczogMjAwMCxcclxuICAgICAgICAgICAgbGVhcm5pbmdSYXRlOiAwLjAxLFxyXG4gICAgICAgICAgICBtb21lbnR1bTogMC4wMDEsXHJcbiAgICAgICAgICAgIHdlaWdodERlY2F5OiAwLjAxLFxyXG4gICAgICAgIH1cclxuICAgICAgICBnb20uY2xldy51cGxvYWRQYXJhbWV0ZXJzKGRhdGEpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAocmVzcG9uc2UpIHsgY29uc29sZS5sb2coXCJmYWlsXCIpIH0pO1xyXG4gICAgfVxyXG4gIFxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0LFxyXG4gICAgICAgIGxheWVyczogbGF5ZXJzLFxyXG4gICAgICAgIGxvY2tlZDogbG9ja2VkLFxyXG4gICAgICAgIGZlYXR1cmVzOiBmZWF0dXJlcyxcclxuICAgICAgICBzZXRQYXJhbWV0ZXI6IHNldFBhcmFtZXRlcixcclxuICAgICAgICB1cGRhdGVMYXllcnM6IHVwZGF0ZUxheWVycyxcclxuICAgICAgICBzZXRGaXhlZExheWVyczogc2V0Rml4ZWRMYXllcnMsXHJcbiAgICB9O1xyXG59KSgpOyIsInZhciBublZpc3VhbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IG51bGw7XHJcbiAgICB2YXIgbGF5ZXJzID0gbnVsbDtcclxuXHJcblxyXG4gICAgdmFyIHdpZHRoID0gMCxcclxuICAgICAgICBoZWlnaHQgPSAwO1xyXG5cclxuICAgIHZhciBjYW52YXMgPSBudWxsLFxyXG4gICAgICAgIG1haW5HID0gbnVsbDtcclxuXHJcbiAgICB2YXIgYnRuQ2FudmFzID0gbnVsbCxcclxuICAgICAgICBidG5HID0gbnVsbDtcclxuXHJcbiAgICB2YXIgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgdmFyIG5uID0gbnVsbDtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChjb250ZXh0LCBubikge1xyXG4gICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5ubiA9IG5uO1xyXG4gICAgICAgIGxheWVycyA9IG5uLmxheWVycztcclxuXHJcbiAgICAgICAgd2lkdGggPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLndpZHRoKCk7XHJcbiAgICAgICAgaGVpZ2h0ID0gJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XHJcblxyXG5cclxuICAgICAgICBjYW52YXMgPSBkMy5zZWxlY3QoXCIjbGF5ZXItZGVzaWduZXJcIikuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJkZXNpZ25lci1jb250YWluZXJcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgbWFpbkcgPSBjYW52YXMuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibm9kZXMtY29udGFpbmVyXCIpO1xyXG5cclxuICAgICAgICBidG5DYW52YXMgPSBkMy5zZWxlY3QoXCIjYnRuLXdyYXBwZXJcIikuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJidG4tY2FudmFzXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDEwMCk7XHJcblxyXG4gICAgICAgIGJ0bkcgPSBidG5DYW52YXMuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiYnRuLWNvbnRhaW5lclwiKTtcclxuICAgICAgICBcclxuICAgICAgICBkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGluaXRWaXN1YWxEYXRhID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5vZGVzOiBsYXllcnNUb05vZGVzKGxheWVycyksXHJcbiAgICAgICAgICAgIGxpbmtzOiBsYXllcnNUb0xpbmtzKGxheWVycyksXHJcbiAgICAgICAgICAgIHVpOiBsYXllcnNUb1VJKGxheWVycyksXHJcbiAgICAgICAgfTtcclxuICAgIH0gXHJcblxyXG4gICAgdmFyIHVwZGF0ZUxheWVycyA9IGZ1bmN0aW9uIChpLCB4KSB7XHJcbiAgICAgICAgLy9pZiBsYXllcnMgYXJlIGxvY2tlZCwgZG9udCBtb2RpZnkgaW5wdXRzIGFuZCBvdXRwdXRzXHJcbiAgICAgICAgaWYgKG5ldXJhbE5ldHdvcmsubG9ja2VkICYmIChpID09IDAgfHwgaSA9PSBsYXllcnMubGVuZ3RoIC0gMSkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAvL2xheWVyIG11c3QgY29udGFpbiBhdGxlYXN0IG9uZSBuZXVyb25jZFxyXG4gICAgICAgIGlmIChsYXllcnNbaV0gPD0gMSAmJiB4ID09IC0xKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgbGF5ZXJzW2ldICs9IHg7XHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcbiAgICAgICAgbmV1cmFsTmV0d29yay51cGRhdGVMYXllcnMobGF5ZXJzKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbW9kaWZ5TGF5ZXJzID0gZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgIC8vZG9udCBjYW50IHJlbW92ZSBhbnkgbGF5ZXJzIGlmIHRoZXJlIGFyZSBvbmx5IDJcclxuICAgICAgICBpZiAobGF5ZXJzLmxlbmd0aCA8PSAyICYmIGFjdGlvbiA9PSBcInJlbW92ZVwiKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgLy9pZiBsYXllcnMgYXJlIGxvY2tlZCBpbnNlcnQgYSBsYXllciBiZWZvcmUgdGhlIGVuZCwgb3RoZXJ3aXNlIHRvIHRoZSBlbmRcclxuICAgICAgICBpZiAoYWN0aW9uID09IFwiYWRkXCIpXHJcbiAgICAgICAgICAgIChuZXVyYWxOZXR3b3JrLmxvY2tlZCkgPyBsYXllcnMuc3BsaWNlKGxheWVycy5sZW5ndGggLSAxLCAwLCAxKSA6IGxheWVycy5wdXNoKDEpO1xyXG4gICAgICAgIC8vcmVtb3ZlIGEgbGF5ZXIgYmVmb3JlIHRoZSBlbmQgaWYgbGF5ZXJzIGFyZSBsb2NrZWRcclxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgKG5ldXJhbE5ldHdvcmsubG9ja2VkKSA/IGxheWVycy5zcGxpY2UobGF5ZXJzLmxlbmd0aC0yLCAxKSA6IGxheWVycy5wb3AoKTtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBuZXVyYWxOZXR3b3JrLnVwZGF0ZUxheWVycyhsYXllcnMpO1xyXG4gICAgfSBcclxuXHJcbiAgICB2YXIgdXBkYXRlVmlzdWFscyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICB1cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG1haW5HLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgYnRuRy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGluayA9IG1haW5HLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubGlua3MpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnRhcmdldFxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBzb3VyY2UueCArIFwiLFwiICsgc291cmNlLnlcclxuICAgICAgICAgICAgICAgICAgICArIFwiQ1wiICsgc291cmNlLnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIHRhcmdldC55O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBtYWluRy5zZWxlY3RBbGwoXCIubm9kZVwiKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLm5vZGVzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDEwKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibm9kZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBuZXVyb25CdG5zID0gYnRuRy5zZWxlY3RBbGwoJy5idXR0b24tbmV1cm9uJylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS51aS5uZXVyb25zKVxyXG4gICAgICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2J1dHRvbi1uZXVyb24nKVxyXG4gICAgICAgICAgICAuYXR0cihcImdvbS1sYXllci1pbmRleFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5pbmRleDsgfSlcclxuICAgICAgICAgICAgLmF0dHIoXCJnb20tbGF5ZXItdmFsXCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLnZhbDsgfSlcclxuICAgICAgICAgICAgLmNhbGwoYnV0dG9uKTtcclxuXHJcblxyXG4gICAgICAgIHZhciBsYXllckJ0bnMgPSBidG5HLnNlbGVjdEFsbCgnLmJ1dHRvbi1sYXllcicpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEudWkubGF5ZXJzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKVxyXG4gICAgICAgICAgICAuYXBwZW5kKCdnJylcclxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2J1dHRvbi1sYXllcicpXHJcbiAgICAgICAgICAgIC5jYWxsKGJ1dHRvbik7XHJcblxyXG4gICAgICAgIHZhciBtYWluV2lkdGggPSAkKFwiI25vZGVzLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcclxuICAgICAgICAgICAgbWFpbkhlaWdodCA9ICQoXCIjbm9kZXMtY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCxcclxuICAgICAgICAgICAgYnRuV2lkdGggPSAkKFwiI2J0bi1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGgsXHJcbiAgICAgICAgICAgIGJ0bkhlaWdodCA9ICQoXCIjYnRuLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5oZWlnaHQ7XHJcblxyXG4gICAgICAgIGJ0bkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChidG5DYW52YXMuYXR0cihcIndpZHRoXCIpIC0gYnRuV2lkdGgpICogMC41ICsgXCIsIDApXCIpO1xyXG4gICAgICAgIG1haW5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoY2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIG1haW5XaWR0aCkgKiAwLjUgKyBcIiwgXCIgKyAobWFpbkhlaWdodCAqIDAuNSkgKyBcIilcIik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coYnRuSGVpZ2h0LCBtYWluSGVpZ2h0LCBjYW52YXMuYXR0cihcImhlaWdodFwiKSk7XHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgd2lkdGggPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLndpZHRoKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FudmFzLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBjYW52YXMuYXR0cihcImhlaWdodFwiLCBtYWluSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGJ0bkNhbnZhcy5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xyXG4gICAgICAgICAgICAgICAgYnRuRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGJ0bkNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBidG5XaWR0aCkgKiAwLjUgKyBcIiwgMClcIik7XHJcbiAgICAgICAgICAgICAgICBtYWluRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBtYWluV2lkdGgpICogMC41ICsgXCIsIFwiICsgKG1haW5IZWlnaHQgKiAwLjUpICsgXCIpXCIpO1xyXG5cclxuICAgICAgICAgICAgfSwgMjUwKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9Ob2RlcyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgbGV0IHZDZW50ZXIgPSAwOy8vTWF0aC5mbG9vcigkKFwiI2Rlc2lnbmVyLWNvbnRhaW5lclwiKS5oZWlnaHQoKSAvIDIpO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxheWVyc1tpXSAlIDIgPT0gMClcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gKGxheWVyc1tpXSAqIG11bHQgLyAyKSArIChtdWx0IC8gMik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gTWF0aC5mbG9vcihsYXllcnNbaV0gLyAyKSAqIG11bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgXCJuYW1lXCI6IGkgKyBcIiBcIiArIGosIHg6IHgsIHk6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIG11bHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5ID0gMDtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb0xpbmtzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2U3VtID0gbGF5ZXJzLnNsaWNlKDAsIGkgKyAxKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSBwcmV2U3VtOyB5IDwgcHJldlN1bSArIGxheWVyc1tpICsgMV07IHkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgc291cmNlOiB4LCB0YXJnZXQ6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvVUkgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IG5ldXJvblVJID0gW107XHJcbiAgICAgICAgbGV0IGxheWVyVUkgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSA1MDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICAgICAgbmV1cm9uVUkucHVzaCh7IGxhYmVsOiBcIi1cIiwgeDogeCwgeTogeSAtIDIwLCBpbmRleDogaSwgdmFsOiAtMSB9KTtcclxuICAgICAgICAgICAgbmV1cm9uVUkucHVzaCh7IGxhYmVsOiBcIitcIiwgeDogeCwgeTogeSArIDIwLCBpbmRleDogaSwgdmFsOiAxIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIGxheWVyVUkucHVzaCh7IGxhYmVsOiBcIi1cIiwgeDogMCwgeTogeSwgYWN0aW9uOiBcInJlbW92ZVwiIH0pO1xyXG4gICAgICAgIGxheWVyVUkucHVzaCh7IGxhYmVsOiBcIitcIiwgeDogeCwgeTogeSwgYWN0aW9uOiBcImFkZFwiIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4geyBuZXVyb25zOiBuZXVyb25VSSwgbGF5ZXJzOiBsYXllclVJIH07XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBidXR0b24gPSBkMy5idXR0b24oKVxyXG4gICAgICAgIC5vbigncHJlc3MnLCBmdW5jdGlvbiAoZCwgaSkgeyB9KVxyXG4gICAgICAgIC5vbigncmVsZWFzZScsIGZ1bmN0aW9uIChkLCBpKSB7XHJcbiAgICAgICAgICAgIGlmIChkLmluZGV4ICE9IHVuZGVmaW5lZCAmJiBkLnZhbCAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB1cGRhdGVMYXllcnMoZC5pbmRleCwgZC52YWwpO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChkLmFjdGlvbiAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBtb2RpZnlMYXllcnMoZC5hY3Rpb24pO1xyXG4gICAgICAgICAgICB1cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0LFxyXG4gICAgICAgIHVwZGF0ZVZpc3VhbHM6IHVwZGF0ZVZpc3VhbHMsXHJcbiAgICB9XHJcbiAgICBcclxufSkoKTsiXX0=
