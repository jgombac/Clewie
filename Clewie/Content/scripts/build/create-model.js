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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3JlYXRlLW1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiICAgICAgICAvL3ZhciBsaW5rID0gc3ZnLnNlbGVjdEFsbChcImxpbmUubGlua1wiKVxyXG4gICAgICAgIC8vZGF0YSgpXHJcblxyXG4gICAgICAgIC8vIGFkZHMgdGhlIGxpbmtzIGJldHdlZW4gdGhlIG5vZGVzXHJcbiAgICAgICAgLy92YXIgbGluayA9IGcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAvLyAgICAuZGF0YShub2Rlcy5kZXNjZW5kYW50cygpLnNsaWNlKDEpKVxyXG4gICAgICAgIC8vICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAvLyAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgICAgIC8vICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgIC8vICAgICAgICByZXR1cm4gXCJNXCIgKyBkLnggKyBcIixcIiArIGQueVxyXG4gICAgICAgIC8vICAgICAgICAgICAgKyBcIkNcIiArIGQueCArIFwiLFwiICsgKGQueSArIGQucGFyZW50LnkpIC8gMlxyXG4gICAgICAgIC8vICAgICAgICAgICAgKyBcIiBcIiArIGQucGFyZW50LnggKyBcIixcIiArIChkLnkgKyBkLnBhcmVudC55KSAvIDJcclxuICAgICAgICAvLyAgICAgICAgICAgICsgXCIgXCIgKyBkLnBhcmVudC54ICsgXCIsXCIgKyBkLnBhcmVudC55O1xyXG4gICAgICAgIC8vICAgIH0pO1xyXG5cclxuICAgICAgICAvLyBhZGRzIGVhY2ggbm9kZSBhcyBhIGdyb3VwXHJcbiAgICAgICAgLy92YXIgbm9kZSA9IGcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuICAgICAgICAvLyAgICAuZGF0YShub2RlcylcclxuICAgICAgICAvLyAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgLy8gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgIC8vICAgICAgICByZXR1cm4gXCJub2RlXCIgK1xyXG4gICAgICAgIC8vICAgICAgICAgICAgKGQuY2hpbGRyZW4gPyBcIiBub2RlLS1pbnRlcm5hbFwiIDogXCIgbm9kZS0tbGVhZlwiKTtcclxuICAgICAgICAvLyAgICB9KVxyXG4gICAgICAgIC8vICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgLy8gICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XHJcbiAgICAgICAgLy8gICAgfSk7XHJcblxyXG4gICAgICAgIC8vIGFkZHMgdGhlIGNpcmNsZSB0byB0aGUgbm9kZVxyXG5cclxuXHJcbiAgICAgICAgLy8gYWRkcyB0aGUgdGV4dCB0byB0aGUgbm9kZVxyXG4gICAgICAgIC8vbm9kZS5hcHBlbmQoXCJ0ZXh0XCIpXHJcbiAgICAgICAgLy8gICAgLmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXHJcbiAgICAgICAgLy8gICAgLmF0dHIoXCJ5XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmNoaWxkcmVuID8gLTIwIDogMjA7IH0pXHJcbiAgICAgICAgLy8gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuICAgICAgICAvLyAgICAudGV4dChmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5kYXRhLm5hbWU7IH0pO1xyXG5cclxuZ29tLm5ldXJhbE5ldHdvcmsgPSB7XHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBub2RlcyA9IGdvbS5uZXVyYWxOZXR3b3JrLmxheWVyc1RvSnNvbihbMSwgMywgNCwgNiwgMTAsIDEwLCAyXSk7XHJcblxyXG4gICAgICAgIC8vIHNldCB0aGUgZGltZW5zaW9ucyBhbmQgbWFyZ2lucyBvZiB0aGUgZGlhZ3JhbVxyXG4gICAgICAgIHZhciBtYXJnaW4gPSB7IHRvcDogNTAsIHJpZ2h0OiA5MCwgYm90dG9tOiA1MCwgbGVmdDogOTAgfSxcclxuICAgICAgICAgICAgd2lkdGggPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLndpZHRoKCkgLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCxcclxuICAgICAgICAgICAgaGVpZ2h0ID0gJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKSAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjbGF5ZXItZGVzaWduZXJcIikuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0ICsgbWFyZ2luLnRvcCArIG1hcmdpbi5ib3R0b20pLFxyXG4gICAgICAgICAgICBnID0gc3ZnLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsXHJcbiAgICAgICAgICAgICAgICBcInRyYW5zbGF0ZShcIiArIG1hcmdpbi5sZWZ0ICsgXCIsXCIgKyBtYXJnaW4udG9wICsgXCIpXCIpO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IGcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuICAgICAgICAgICAgLmRhdGEobm9kZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKG5vZGUsIG5vZGVzKTtcclxuICAgICAgICBub2RlLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgMTApO1xyXG5cclxuICAgICAgICB2YXIgbGluayA9IGcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAgICAgLmRhdGEobm9kZXMuc2xpY2UoMSkpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBkLnggKyBcIixcIiArIGQueVxyXG4gICAgICAgICAgICAgICAgICAgICsgXCJDXCIgKyBkLnggKyBcIixcIiArIChkLnkgKyBkLnBhcmVudC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgZC5wYXJlbnQueCArIFwiLFwiICsgKGQueSArIGQucGFyZW50LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyBkLnBhcmVudC54ICsgXCIsXCIgKyBkLnBhcmVudC55O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGxheWVyc1RvTm9kZXM6IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICB2YXIgYXJyID0gW10sXHJcbiAgICAgICAgICAgIHZDZW50ZXIgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpOyAvLyAyO1xyXG4gICAgICAgICAgICB4ID0gMCxcclxuICAgICAgICAgICAgeSA9IDAsXHJcbiAgICAgICAgICAgIG11bHQgPSA0MDtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB5ID0gTWF0aC5yb3VuZCgodkNlbnRlciAtIGxheWVyc1tpXSAqIG11bHQpIC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh5LCB2Q2VudGVyLCBsYXllcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgXCJuYW1lXCI6IGkgKyBcIiBcIiArIGosIHg6IHgsIHk6IHksIGRlc2M6IFt7IGZ1bmN0aW9uKGQpIHsgZC5zZWxlY3RBbGwoKTsgfSB9XSB9KTtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgbXVsdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfSxcclxuXHJcbiAgICBsYXllcnNUb0xpbmtzOiBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgYXJyID0gW107XHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8zXHJcblxyXG4gICAgXHJcblxyXG59Il19
