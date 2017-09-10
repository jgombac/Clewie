
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