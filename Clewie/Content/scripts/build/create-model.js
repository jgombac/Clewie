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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjcmVhdGUtbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgICAgICAgIC8vdmFyIGxpbmsgPSBzdmcuc2VsZWN0QWxsKFwibGluZS5saW5rXCIpXHJcbiAgICAgICAgLy9kYXRhKClcclxuXHJcbiAgICAgICAgLy8gYWRkcyB0aGUgbGlua3MgYmV0d2VlbiB0aGUgbm9kZXNcclxuICAgICAgICAvL3ZhciBsaW5rID0gZy5zZWxlY3RBbGwoXCIubGlua1wiKVxyXG4gICAgICAgIC8vICAgIC5kYXRhKG5vZGVzLmRlc2NlbmRhbnRzKCkuc2xpY2UoMSkpXHJcbiAgICAgICAgLy8gICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgIC8vICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rXCIpXHJcbiAgICAgICAgLy8gICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgLy8gICAgICAgIHJldHVybiBcIk1cIiArIGQueCArIFwiLFwiICsgZC55XHJcbiAgICAgICAgLy8gICAgICAgICAgICArIFwiQ1wiICsgZC54ICsgXCIsXCIgKyAoZC55ICsgZC5wYXJlbnQueSkgLyAyXHJcbiAgICAgICAgLy8gICAgICAgICAgICArIFwiIFwiICsgZC5wYXJlbnQueCArIFwiLFwiICsgKGQueSArIGQucGFyZW50LnkpIC8gMlxyXG4gICAgICAgIC8vICAgICAgICAgICAgKyBcIiBcIiArIGQucGFyZW50LnggKyBcIixcIiArIGQucGFyZW50Lnk7XHJcbiAgICAgICAgLy8gICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGFkZHMgZWFjaCBub2RlIGFzIGEgZ3JvdXBcclxuICAgICAgICAvL3ZhciBub2RlID0gZy5zZWxlY3RBbGwoXCIubm9kZVwiKVxyXG4gICAgICAgIC8vICAgIC5kYXRhKG5vZGVzKVxyXG4gICAgICAgIC8vICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAvLyAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgLy8gICAgICAgIHJldHVybiBcIm5vZGVcIiArXHJcbiAgICAgICAgLy8gICAgICAgICAgICAoZC5jaGlsZHJlbiA/IFwiIG5vZGUtLWludGVybmFsXCIgOiBcIiBub2RlLS1sZWFmXCIpO1xyXG4gICAgICAgIC8vICAgIH0pXHJcbiAgICAgICAgLy8gICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAvLyAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjtcclxuICAgICAgICAvLyAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gYWRkcyB0aGUgY2lyY2xlIHRvIHRoZSBub2RlXHJcblxyXG5cclxuICAgICAgICAvLyBhZGRzIHRoZSB0ZXh0IHRvIHRoZSBub2RlXHJcbiAgICAgICAgLy9ub2RlLmFwcGVuZChcInRleHRcIilcclxuICAgICAgICAvLyAgICAuYXR0cihcImR5XCIsIFwiLjM1ZW1cIilcclxuICAgICAgICAvLyAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuY2hpbGRyZW4gPyAtMjAgOiAyMDsgfSlcclxuICAgICAgICAvLyAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4gICAgICAgIC8vICAgIC50ZXh0KGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmRhdGEubmFtZTsgfSk7XHJcblxyXG5nb20ubmV1cmFsTmV0d29yayA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG5vZGVzID0gZ29tLm5ldXJhbE5ldHdvcmsubGF5ZXJzVG9Kc29uKFszLCA0LCA2LCAxMCwgMTAsIDJdKTtcclxuXHJcbiAgICAgICAgLy8gc2V0IHRoZSBkaW1lbnNpb25zIGFuZCBtYXJnaW5zIG9mIHRoZSBkaWFncmFtXHJcbiAgICAgICAgdmFyIG1hcmdpbiA9IHsgdG9wOiA0MCwgcmlnaHQ6IDkwLCBib3R0b206IDUwLCBsZWZ0OiA5MCB9LFxyXG4gICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKSAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0LFxyXG4gICAgICAgICAgICBoZWlnaHQgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XHJcbiAgICAgICAgXHJcbiAgICAgICAgdmFyIHN2ZyA9IGQzLnNlbGVjdChcIiNsYXllci1kZXNpZ25lclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCArIG1hcmdpbi5sZWZ0ICsgbWFyZ2luLnJpZ2h0KVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQgKyBtYXJnaW4udG9wICsgbWFyZ2luLmJvdHRvbSksXHJcbiAgICAgICAgICAgIGcgPSBzdmcuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIixcclxuICAgICAgICAgICAgICAgIFwidHJhbnNsYXRlKFwiICsgbWFyZ2luLmxlZnQgKyBcIixcIiArIG1hcmdpbi50b3AgKyBcIilcIik7XHJcblxyXG4gICAgICAgIHZhciBub2RlID0gZy5zZWxlY3RBbGwoXCIubm9kZVwiKVxyXG4gICAgICAgICAgICAuZGF0YShub2RlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibm9kZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc29sZS5sb2cobm9kZSwgbm9kZXMpO1xyXG4gICAgICAgIG5vZGUuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCAxMCk7XHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgbGF5ZXJzVG9Kc29uOiBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdLFxyXG4gICAgICAgICAgICB4ID0gMCxcclxuICAgICAgICAgICAgeSA9IDAsXHJcbiAgICAgICAgICAgIG11bHQgPSAyMDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goeyBcIm5hbWVcIjogaSArIFwiIFwiICsgaiwgeDogeCwgeTogeSB9KTtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgbXVsdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxufSJdfQ==
