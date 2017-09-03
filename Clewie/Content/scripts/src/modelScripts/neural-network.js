//var link = svg.selectAll("line.link")
//data()

// adds the links between the nodes
//var link = g.selectAll(".link")
//    .data(nodes.descendants().slice(1))
//    .enter().append("path")
//    .attr("class", "link")
//    .attr("d", function (d) {
//        return "M" + d.x + "," + d.y
//            + "C" + d.x + "," + (d.y + d.parent.y) / 2
//            + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
//            + " " + d.parent.x + "," + d.parent.y;
//    });

// adds each node as a group
//var node = g.selectAll(".node")
//    .data(nodes)
//    .enter().append("g")
//    .attr("class", function (d) {
//        return "node" +
//            (d.children ? " node--internal" : " node--leaf");
//    })
//    .attr("transform", function (d) {
//        return "translate(" + d.x + "," + d.y + ")";
//    });

// adds the circle to the node


// adds the text to the node
//node.append("text")
//    .attr("dy", ".35em")
//    .attr("y", function (d) { return d.children ? -20 : 20; })
//    .style("text-anchor", "middle")
//    .text(function (d) { return d.data.name; });

var neuralNetwork = (function () {

    var margin = { top: 50, right: 90, bottom: 50, left: 90 },
        width = $("#layer-designer").width() - margin.left - margin.right,
        height = $("#layer-designer").height();

    

    var layers = [1, 1, 2];

    var data = null;

    var g = null;
    
    var init = function () {
        
        data = {
            nodes: layersToNodes(layers),
            links: layersToLinks(layers),
            ui: layersToUI(layers),
        };

        

        var svg = d3.select("#layer-designer").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height);

        g = svg.append("g")
            .attr("id", "nodes-container");

        initData(data);
        //update(data);

       

        var mGroupWidth = $("#nodes-container")[0].getBoundingClientRect().width;
        g.attr("transform", "translate(" + ((svg.attr("width") / 2) - mGroupWidth / 2) + ", 0)");
        $(window).resize(function () {


            width = $("#layer-designer").width() - margin.left - margin.right
            svg.attr("width", width);
            g.attr("transform", "translate(" + (width / 2 - mGroupWidth / 2) + ", 0)");

        });

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
        console.log(layers);
        layers[i] += x;
        data.nodes = layersToNodes(layers);
        data.links = layersToLinks(layers);
        data.ui = layersToUI(layers);
        console.log(layers);
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
        let val = 1;

        for (var i = 0; i < layers.length; i++) {
            neuronUI.push({ label: "+", x: x, y: y, index: i , val: val});
            x = x + mult * 2;
        }
        y = height - 20;
        x = 0;
        val = -1;
        for (var i = 0; i < layers.length; i++) {
            neuronUI.push({ label: "-", x: x, y: y, index: i, val: val });
            x = x + mult * 2;
        }

        layerUI.push({ label: "Remove layer", x: -100, y: y, action: "remove" });
        layerUI.push({ label: "Add layer", x: x + 100, y: y, action: "add" });

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