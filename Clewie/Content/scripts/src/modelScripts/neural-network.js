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
        var nodes = gom.neuralNetwork.layersToJson([1, 3, 4, 6, 10, 10, 2]);

        // set the dimensions and margins of the diagram
        var margin = { top: 50, right: 90, bottom: 50, left: 90 },
            width = $("#layer-designer").width() - margin.left - margin.right,
            height = $("#layer-designer").height() - margin.top - margin.bottom;
        
        var svg = d3.select("#layer-designer").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom),
            g = svg.append("g")
                .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var node = g.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        console.log(node, nodes);
        node.append("circle")
            .attr("r", 10);

        var link = g.selectAll(".link")
            .data(nodes.slice(1))
            .enter().append("path")
            .attr("class", "link")
            .attr("d", function (d) {
                return "M" + d.x + "," + d.y
                    + "C" + d.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + (d.y + d.parent.y) / 2
                    + " " + d.parent.x + "," + d.parent.y;
            });

    },

    layersToNodes: function (layers) {
        var arr = [],
            vCenter = $("#layer-designer").height(); // 2;
            x = 0,
            y = 0,
            mult = 40;

            for (var i = 0; i < layers.length; i++) {
                y = Math.round((vCenter - layers[i] * mult) / 2);
                console.log(y, vCenter, layers[i]);
                for (var j = 0; j < layers[i]; j++) {
                    arr.push({ "name": i + " " + j, x: x, y: y, desc: [{ function(d) { d.selectAll(); } }] });
                y = y + mult
            }
            y = 0;
            x = x + mult;
        }

        return arr;
    },

    layersToLinks: function (layers) {
        arr = [];


    },

    //3

    

}