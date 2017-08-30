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

gom.neuralNetwork = {

    init: function () {
        var layers = [1, 2, 10, 2, 2, 10, 2, 1];
        var nodes = gom.neuralNetwork.layersToNodes(layers);
        var links = gom.neuralNetwork.layersToLinks(layers);
        // set the dimensions and margins of the diagram
        var margin = { top: 50, right: 90, bottom: 50, left: 90 },
            width = $("#layer-designer").width() - margin.left - margin.right,
            height = $("#layer-designer").height();

        var svg = d3.select("#layer-designer").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height),
            g = svg.append("g")
                .attr("id", "nodes-container");


        var link = g.selectAll(".link")
            .data(links)
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (l) {
                var source = nodes.filter(function (d, i) {
                    return i == l.source
                })[0];
                var target = nodes.filter(function (d, i) {
                    return i == l.target
                })[0];
                return "M" + source.x + "," + source.y
                    + "C" + source.x + "," + (source.y + target.y) / 2
                    + " " + target.x + "," + (source.y + target.y) / 2
                    + " " + target.x + "," + target.y;
            });

        var node = g.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("circle")
            .attr("r", 10);

        var mGroupWidth = $("#nodes-container")[0].getBoundingClientRect().width;
        g.attr("transform", "translate(" + ((svg.attr("width") / 2) - mGroupWidth / 2) + ", 0)");
        $(window).resize(function () {


            width = $("#layer-designer").width() - margin.left - margin.right
            svg.attr("width", width);
            g.attr("transform", "translate(" + (width / 2 - mGroupWidth / 2) + ", 0)");

        });

    },

    layersToNodes: function (layers) {
        var arr = [],
            vCenter = Math.floor($("#layer-designer").height() / 2),
            x = 0,
            y = 0,
            mult = 50;

        for (var i = 0; i < layers.length; i++) {
            if (layers[i] % 2 == 0)
                y = vCenter - (layers[i] * mult / 2) + (mult / 2);
            else
                y = vCenter - Math.floor(layers[i] / 2) * mult;
            console.log(y, vCenter, layers[i]);
            for (var j = 0; j < layers[i]; j++) {
                arr.push({ "name": i + " " + j, x: x, y: y, desc: [{ function(d) { d.selectAll(); } }] });
                y = y + mult
            }
            y = 0;
            x = x + mult * 2;
        }

        return arr;
    },

    layersToLinks: function (layers) {
        var arr = [];
        var x = 0;
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
    },


}