
var neuralNetwork = (function () {

    var width = $("#layer-designer").width(),
        height = $("#layer-designer").height();
  

    var layers = [4, 5, 5, 5, 5, 4];

    var data = null;

    var g = null,
        svg = null;
    
    var init = function () {
        
        data = {
            nodes: layersToNodes(layers),
            links: layersToLinks(layers),
            ui: layersToUI(layers),
        };

        svg = d3.select("#layer-designer").append("svg")
            .attr("id", "designer-container")
            .attr("width", width)
            .attr("height", height);

        g = svg.append("g")
            .attr("id", "nodes-container");

        initData(data);


    };

    var initData = function (data) {
        var link = g.selectAll(".link")
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

        var node = g.selectAll(".node")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", 10)
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        var neuronBtns = g.selectAll('.button-neuron')
            .data(data.ui.neurons)
            .enter()
            .append('g')
            .attr('class', 'button-neuron')
            .attr("gom-layer-index", function (d) { return d.index; })
            .attr("gom-layer-val", function (d) { return d.val; })
            .call(button);


        var layerBtns = g.selectAll('.button-layer')
            .data(data.ui.layers)
            .enter()
            .append('g')
            .attr('class', 'button-layer')
            .call(button);

        var mGroupWidth = $("#nodes-container")[0].getBoundingClientRect().width;
        
        g.attr("transform", "translate(" + (svg.attr("width") - mGroupWidth) / 2 + ", 0)");
        $(window).resize(function () {
            width = $("#layer-designer").width();
            svg.attr("width", width);
            console.log(width, svg.attr("width"), mGroupWidth, (svg.attr("width") - mGroupWidth) / 2);

            g.attr("transform", "translate(" + (svg.attr("width") - mGroupWidth)*0.7 + ", 0)");
        });
    };

    var update = function (data) {
        g.selectAll("*").remove();
        initData(data);
    };

    var modifyLayer = function (action) {
        if (action == "add")
            layers.push(1);
        else if (action == "remove")
            layers.pop();
        data.nodes = layersToNodes(layers);
        data.links = layersToLinks(layers);
        data.ui = layersToUI(layers);
    };

    var updateLayers = function (i, x) {
        layers[i] += x;
        data.nodes = layersToNodes(layers);
        data.links = layersToLinks(layers);
        data.ui = layersToUI(layers);
    };

    var layersToNodes = function (layers) {
        let arr = [];
        let vCenter = Math.floor($("#layer-designer").height() / 2);
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
            neuronUI.push({ label: "-", x: x, y: y-20, index: i, val: -1 });
            neuronUI.push({ label: "+", x: x, y: y+20, index: i, val: 1 });
            x = x + mult * 2;
        }
        layerUI.push({ label: "-", x: -100, y: y, action: "remove" });
        layerUI.push({ label: "+", x: x, y: y, action: "add" });

        return { neurons: neuronUI, layers: layerUI };
    };

    var button = d3.button()
        .on('press', function (d, i) { })
        .on('release', function (d, i) {
            if (d.index != undefined && d.val != undefined)
                updateLayers(d.index, d.val);
            else if (d.action != undefined)
                modifyLayer(d.action);
            update(data);
        });

    return {
        init: init,
        g: g,
    };
})();
var nnVisual = (function () {
    var context = null;
    var layers = null;

    var width = 0,
        height = 0;

    var canvas = null,
        g = null;

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

        g = canvas.append("g")
            .attr("id", "nodes-container");


        console.log(canvas, g);
        
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
        layers[i] += x;
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    }

    var modifyLayers = function (action) {
        if (action == "add")
            layers.push(1);
        else if (action == "remove")
            layers.pop();
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    } 

    var update = function () {
        g.selectAll("*").remove();
        draw();
    }

    var draw = function () {
        var link = g.selectAll(".link")
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

        var node = g.selectAll(".node")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", 10)
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        var neuronBtns = g.selectAll('.button-neuron')
            .data(data.ui.neurons)
            .enter()
            .append('g')
            .attr('class', 'button-neuron')
            .attr("gom-layer-index", function (d) { return d.index; })
            .attr("gom-layer-val", function (d) { return d.val; })
            .call(button);


        var layerBtns = g.selectAll('.button-layer')
            .data(data.ui.layers)
            .enter()
            .append('g')
            .attr('class', 'button-layer')
            .call(button);

        var mGroupWidth = $("#nodes-container")[0].getBoundingClientRect().width;

        g.attr("transform", "translate(" + (canvas.attr("width") - mGroupWidth) / 2 + ", 0)");
        $(window).resize(function () {
            width = $("#layer-designer").width();
            canvas.attr("width", width);
            g.attr("transform", "translate(" + (canvas.attr("width") - mGroupWidth) * 0.7 + ", 0)");
        });
    }

    var layersToNodes = function (layers) {
        let arr = [];
        let vCenter = Math.floor($("#layer-designer").height() / 2);
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
            neuronUI.push({ label: "-", x: x, y: y - 20, index: i, val: -1 });
            neuronUI.push({ label: "+", x: x, y: y + 20, index: i, val: 1 });
            x = x + mult * 2;
        }
        layerUI.push({ label: "-", x: -100, y: y, action: "remove" });
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
    }
    
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjcmVhdGUtbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIG5ldXJhbE5ldHdvcmsgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKSxcclxuICAgICAgICBoZWlnaHQgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpO1xyXG4gIFxyXG5cclxuICAgIHZhciBsYXllcnMgPSBbNCwgNSwgNSwgNSwgNSwgNF07XHJcblxyXG4gICAgdmFyIGRhdGEgPSBudWxsO1xyXG5cclxuICAgIHZhciBnID0gbnVsbCxcclxuICAgICAgICBzdmcgPSBudWxsO1xyXG4gICAgXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBcclxuICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICBub2RlczogbGF5ZXJzVG9Ob2RlcyhsYXllcnMpLFxyXG4gICAgICAgICAgICBsaW5rczogbGF5ZXJzVG9MaW5rcyhsYXllcnMpLFxyXG4gICAgICAgICAgICB1aTogbGF5ZXJzVG9VSShsYXllcnMpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHN2ZyA9IGQzLnNlbGVjdChcIiNsYXllci1kZXNpZ25lclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImRlc2lnbmVyLWNvbnRhaW5lclwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBnID0gc3ZnLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcIm5vZGVzLWNvbnRhaW5lclwiKTtcclxuXHJcbiAgICAgICAgaW5pdERhdGEoZGF0YSk7XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIGluaXREYXRhID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICB2YXIgbGluayA9IGcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5saW5rcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk1cIiArIHNvdXJjZS54ICsgXCIsXCIgKyBzb3VyY2UueVxyXG4gICAgICAgICAgICAgICAgICAgICsgXCJDXCIgKyBzb3VyY2UueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgdGFyZ2V0Lnk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IGcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5ub2RlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCAxMClcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbmV1cm9uQnRucyA9IGcuc2VsZWN0QWxsKCcuYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEudWkubmV1cm9ucylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbmV1cm9uJylcclxuICAgICAgICAgICAgLmF0dHIoXCJnb20tbGF5ZXItaW5kZXhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuaW5kZXg7IH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLXZhbFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC52YWw7IH0pXHJcbiAgICAgICAgICAgIC5jYWxsKGJ1dHRvbik7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGF5ZXJCdG5zID0gZy5zZWxlY3RBbGwoJy5idXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLmxheWVycylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgbUdyb3VwV2lkdGggPSAkKFwiI25vZGVzLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuICAgICAgICBcclxuICAgICAgICBnLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoc3ZnLmF0dHIoXCJ3aWR0aFwiKSAtIG1Hcm91cFdpZHRoKSAvIDIgKyBcIiwgMClcIik7XHJcbiAgICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpO1xyXG4gICAgICAgICAgICBzdmcuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cod2lkdGgsIHN2Zy5hdHRyKFwid2lkdGhcIiksIG1Hcm91cFdpZHRoLCAoc3ZnLmF0dHIoXCJ3aWR0aFwiKSAtIG1Hcm91cFdpZHRoKSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgZy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKHN2Zy5hdHRyKFwid2lkdGhcIikgLSBtR3JvdXBXaWR0aCkqMC43ICsgXCIsIDApXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICBnLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgaW5pdERhdGEoZGF0YSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBtb2RpZnlMYXllciA9IGZ1bmN0aW9uIChhY3Rpb24pIHtcclxuICAgICAgICBpZiAoYWN0aW9uID09IFwiYWRkXCIpXHJcbiAgICAgICAgICAgIGxheWVycy5wdXNoKDEpO1xyXG4gICAgICAgIGVsc2UgaWYgKGFjdGlvbiA9PSBcInJlbW92ZVwiKVxyXG4gICAgICAgICAgICBsYXllcnMucG9wKCk7XHJcbiAgICAgICAgZGF0YS5ub2RlcyA9IGxheWVyc1RvTm9kZXMobGF5ZXJzKTtcclxuICAgICAgICBkYXRhLmxpbmtzID0gbGF5ZXJzVG9MaW5rcyhsYXllcnMpO1xyXG4gICAgICAgIGRhdGEudWkgPSBsYXllcnNUb1VJKGxheWVycyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciB1cGRhdGVMYXllcnMgPSBmdW5jdGlvbiAoaSwgeCkge1xyXG4gICAgICAgIGxheWVyc1tpXSArPSB4O1xyXG4gICAgICAgIGRhdGEubm9kZXMgPSBsYXllcnNUb05vZGVzKGxheWVycyk7XHJcbiAgICAgICAgZGF0YS5saW5rcyA9IGxheWVyc1RvTGlua3MobGF5ZXJzKTtcclxuICAgICAgICBkYXRhLnVpID0gbGF5ZXJzVG9VSShsYXllcnMpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9Ob2RlcyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgbGV0IHZDZW50ZXIgPSBNYXRoLmZsb29yKCQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCkgLyAyKTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSAwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXllcnNbaV0gJSAyID09IDApXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIChsYXllcnNbaV0gKiBtdWx0IC8gMikgKyAobXVsdCAvIDIpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIE1hdGguZmxvb3IobGF5ZXJzW2ldIC8gMikgKiBtdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7IFwibmFtZVwiOiBpICsgXCIgXCIgKyBqLCB4OiB4LCB5OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBtdWx0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9MaW5rcyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlN1bSA9IGxheWVycy5zbGljZSgwLCBpICsgMSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gcHJldlN1bTsgeSA8IHByZXZTdW0gKyBsYXllcnNbaSArIDFdOyB5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh7IHNvdXJjZTogeCwgdGFyZ2V0OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb1VJID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBuZXVyb25VSSA9IFtdO1xyXG4gICAgICAgIGxldCBsYXllclVJID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gNTA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5ldXJvblVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IHgsIHk6IHktMjAsIGluZGV4OiBpLCB2YWw6IC0xIH0pO1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5KzIwLCBpbmRleDogaSwgdmFsOiAxIH0pO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IC0xMDAsIHk6IHksIGFjdGlvbjogXCJyZW1vdmVcIiB9KTtcclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHksIGFjdGlvbjogXCJhZGRcIiB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgbmV1cm9uczogbmV1cm9uVUksIGxheWVyczogbGF5ZXJVSSB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYnV0dG9uID0gZDMuYnV0dG9uKClcclxuICAgICAgICAub24oJ3ByZXNzJywgZnVuY3Rpb24gKGQsIGkpIHsgfSlcclxuICAgICAgICAub24oJ3JlbGVhc2UnLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICBpZiAoZC5pbmRleCAhPSB1bmRlZmluZWQgJiYgZC52YWwgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJzKGQuaW5kZXgsIGQudmFsKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoZC5hY3Rpb24gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgbW9kaWZ5TGF5ZXIoZC5hY3Rpb24pO1xyXG4gICAgICAgICAgICB1cGRhdGUoZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0LFxyXG4gICAgICAgIGc6IGcsXHJcbiAgICB9O1xyXG59KSgpOyIsInZhciBublZpc3VhbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IG51bGw7XHJcbiAgICB2YXIgbGF5ZXJzID0gbnVsbDtcclxuXHJcbiAgICB2YXIgd2lkdGggPSAwLFxyXG4gICAgICAgIGhlaWdodCA9IDA7XHJcblxyXG4gICAgdmFyIGNhbnZhcyA9IG51bGwsXHJcbiAgICAgICAgZyA9IG51bGw7XHJcblxyXG4gICAgdmFyIGRhdGEgPSBudWxsO1xyXG5cclxuICAgIHZhciBubiA9IG51bGw7XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoY29udGV4dCwgbm4pIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMubm4gPSBubjtcclxuICAgICAgICBsYXllcnMgPSBubi5sYXllcnM7XHJcblxyXG4gICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpO1xyXG4gICAgICAgIGhlaWdodCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG5cclxuICAgICAgICBjYW52YXMgPSBkMy5zZWxlY3QoXCIjbGF5ZXItZGVzaWduZXJcIikuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJkZXNpZ25lci1jb250YWluZXJcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgZyA9IGNhbnZhcy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJub2Rlcy1jb250YWluZXJcIik7XHJcblxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhjYW52YXMsIGcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW5pdFZpc3VhbERhdGEgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IGxheWVyc1RvTm9kZXMobGF5ZXJzKSxcclxuICAgICAgICAgICAgbGlua3M6IGxheWVyc1RvTGlua3MobGF5ZXJzKSxcclxuICAgICAgICAgICAgdWk6IGxheWVyc1RvVUkobGF5ZXJzKSxcclxuICAgICAgICB9O1xyXG4gICAgfSBcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGksIHgpIHtcclxuICAgICAgICBsYXllcnNbaV0gKz0geDtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBuZXVyYWxOZXR3b3JrLnVwZGF0ZUxheWVycyhsYXllcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtb2RpZnlMYXllcnMgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImFkZFwiKVxyXG4gICAgICAgICAgICBsYXllcnMucHVzaCgxKTtcclxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgbGF5ZXJzLnBvcCgpO1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIG5ldXJhbE5ldHdvcmsudXBkYXRlTGF5ZXJzKGxheWVycyk7XHJcbiAgICB9IFxyXG5cclxuICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGluayA9IGcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5saW5rcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk1cIiArIHNvdXJjZS54ICsgXCIsXCIgKyBzb3VyY2UueVxyXG4gICAgICAgICAgICAgICAgICAgICsgXCJDXCIgKyBzb3VyY2UueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgdGFyZ2V0Lnk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IGcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5ub2RlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCAxMClcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbmV1cm9uQnRucyA9IGcuc2VsZWN0QWxsKCcuYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEudWkubmV1cm9ucylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbmV1cm9uJylcclxuICAgICAgICAgICAgLmF0dHIoXCJnb20tbGF5ZXItaW5kZXhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuaW5kZXg7IH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLXZhbFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC52YWw7IH0pXHJcbiAgICAgICAgICAgIC5jYWxsKGJ1dHRvbik7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGF5ZXJCdG5zID0gZy5zZWxlY3RBbGwoJy5idXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLmxheWVycylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgbUdyb3VwV2lkdGggPSAkKFwiI25vZGVzLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHJcbiAgICAgICAgZy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBtR3JvdXBXaWR0aCkgLyAyICsgXCIsIDApXCIpO1xyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICAgICAgY2FudmFzLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbUdyb3VwV2lkdGgpICogMC43ICsgXCIsIDApXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYXllcnNUb05vZGVzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgdkNlbnRlciA9IE1hdGguZmxvb3IoJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKSAvIDIpO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxheWVyc1tpXSAlIDIgPT0gMClcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gKGxheWVyc1tpXSAqIG11bHQgLyAyKSArIChtdWx0IC8gMik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gTWF0aC5mbG9vcihsYXllcnNbaV0gLyAyKSAqIG11bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgXCJuYW1lXCI6IGkgKyBcIiBcIiArIGosIHg6IHgsIHk6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIG11bHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5ID0gMDtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb0xpbmtzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2U3VtID0gbGF5ZXJzLnNsaWNlKDAsIGkgKyAxKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSBwcmV2U3VtOyB5IDwgcHJldlN1bSArIGxheWVyc1tpICsgMV07IHkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgc291cmNlOiB4LCB0YXJnZXQ6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvVUkgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IG5ldXJvblVJID0gW107XHJcbiAgICAgICAgbGV0IGxheWVyVUkgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSA1MDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbmV1cm9uVUkucHVzaCh7IGxhYmVsOiBcIi1cIiwgeDogeCwgeTogeSAtIDIwLCBpbmRleDogaSwgdmFsOiAtMSB9KTtcclxuICAgICAgICAgICAgbmV1cm9uVUkucHVzaCh7IGxhYmVsOiBcIitcIiwgeDogeCwgeTogeSArIDIwLCBpbmRleDogaSwgdmFsOiAxIH0pO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IC0xMDAsIHk6IHksIGFjdGlvbjogXCJyZW1vdmVcIiB9KTtcclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHksIGFjdGlvbjogXCJhZGRcIiB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgbmV1cm9uczogbmV1cm9uVUksIGxheWVyczogbGF5ZXJVSSB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYnV0dG9uID0gZDMuYnV0dG9uKClcclxuICAgICAgICAub24oJ3ByZXNzJywgZnVuY3Rpb24gKGQsIGkpIHsgfSlcclxuICAgICAgICAub24oJ3JlbGVhc2UnLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICBpZiAoZC5pbmRleCAhPSB1bmRlZmluZWQgJiYgZC52YWwgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJzKGQuaW5kZXgsIGQudmFsKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoZC5hY3Rpb24gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgbW9kaWZ5TGF5ZXJzKGQuYWN0aW9uKTtcclxuICAgICAgICAgICAgdXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgIH1cclxuICAgIFxyXG59KSgpOyJdfQ==
