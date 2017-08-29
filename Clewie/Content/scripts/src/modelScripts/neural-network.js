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
        var nodes = gom.neuralNetwork.layersToJson([3, 4, 6, 10, 10, 2]);

        // set the dimensions and margins of the diagram
        var margin = { top: 40, right: 90, bottom: 50, left: 90 },
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


    },

    layersToJson: function (layers) {
        var arr = [],
            x = 0,
            y = 0,
            mult = 20;

        for (var i = 0; i < layers.length; i++) {
            for (var j = 0; j < layers[i]; j++) {
                arr.push({ "name": i + " " + j, x: x, y: y });
                y = y + mult
            }
            y = 0;
            x = x + mult;
        }

        return arr;
    }

}