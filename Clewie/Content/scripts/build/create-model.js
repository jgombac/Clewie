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

    var init = function () {

        var layers = [4, 4, 4, 4];
        var nodes = gom.neuralNetwork.layersToNodes(layers);
        var links = gom.neuralNetwork.layersToLinks(layers);
        var ui = gom.neuralNetwork.layersToUI(layers);
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

        var button = d3.button()
            .on('press', function (d, i) { console.log("Pressed", d, i, this.parentNode) })
            .on('release', function (d, i) { console.log("Released", d, i, this.parentNode) });

        var buttons = g.selectAll('.button')
            .data(ui)
            .enter()
            .append('g')
            .attr('class', 'button')
            .call(button);



        var mGroupWidth = $("#nodes-container")[0].getBoundingClientRect().width;
        g.attr("transform", "translate(" + ((svg.attr("width") / 2) - mGroupWidth / 2) + ", 0)");
        $(window).resize(function () {


            width = $("#layer-designer").width() - margin.left - margin.right
            svg.attr("width", width);
            g.attr("transform", "translate(" + (width / 2 - mGroupWidth / 2) + ", 0)");

        });

    }

    var layersToNodes = function (layers) {
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
                arr.push({ "name": i + " " + j, x: x, y: y });
                y = y + mult
            }
            y = 0;
            x = x + mult * 2;
        }

        return arr;
    }

    var layersToLinks = function (layers) {
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
    }

    var layersToUI = function (layers) {
        var arr = [],
            x = 0,
            y = 50,
            mult = 40;

        for (var i = 0; i < layers.length; i++) {
            arr.push({ label: "+", x: x, y: y });
            x = x + mult * 2;
        }
        return arr;
    }

    return {
        init: init,
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3JlYXRlLW1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy92YXIgbGluayA9IHN2Zy5zZWxlY3RBbGwoXCJsaW5lLmxpbmtcIilcclxuLy9kYXRhKClcclxuXHJcbi8vIGFkZHMgdGhlIGxpbmtzIGJldHdlZW4gdGhlIG5vZGVzXHJcbi8vdmFyIGxpbmsgPSBnLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbi8vICAgIC5kYXRhKG5vZGVzLmRlc2NlbmRhbnRzKCkuc2xpY2UoMSkpXHJcbi8vICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuLy8gICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuLy8gICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChkKSB7XHJcbi8vICAgICAgICByZXR1cm4gXCJNXCIgKyBkLnggKyBcIixcIiArIGQueVxyXG4vLyAgICAgICAgICAgICsgXCJDXCIgKyBkLnggKyBcIixcIiArIChkLnkgKyBkLnBhcmVudC55KSAvIDJcclxuLy8gICAgICAgICAgICArIFwiIFwiICsgZC5wYXJlbnQueCArIFwiLFwiICsgKGQueSArIGQucGFyZW50LnkpIC8gMlxyXG4vLyAgICAgICAgICAgICsgXCIgXCIgKyBkLnBhcmVudC54ICsgXCIsXCIgKyBkLnBhcmVudC55O1xyXG4vLyAgICB9KTtcclxuXHJcbi8vIGFkZHMgZWFjaCBub2RlIGFzIGEgZ3JvdXBcclxuLy92YXIgbm9kZSA9IGcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuLy8gICAgLmRhdGEobm9kZXMpXHJcbi8vICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcclxuLy8gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xyXG4vLyAgICAgICAgcmV0dXJuIFwibm9kZVwiICtcclxuLy8gICAgICAgICAgICAoZC5jaGlsZHJlbiA/IFwiIG5vZGUtLWludGVybmFsXCIgOiBcIiBub2RlLS1sZWFmXCIpO1xyXG4vLyAgICB9KVxyXG4vLyAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xyXG4vLyAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjtcclxuLy8gICAgfSk7XHJcblxyXG4vLyBhZGRzIHRoZSBjaXJjbGUgdG8gdGhlIG5vZGVcclxuXHJcblxyXG4vLyBhZGRzIHRoZSB0ZXh0IHRvIHRoZSBub2RlXHJcbi8vbm9kZS5hcHBlbmQoXCJ0ZXh0XCIpXHJcbi8vICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxyXG4vLyAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuY2hpbGRyZW4gPyAtMjAgOiAyMDsgfSlcclxuLy8gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuLy8gICAgLnRleHQoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZGF0YS5uYW1lOyB9KTtcclxuXHJcbnZhciBuZXVyYWxOZXR3b3JrID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgdmFyIGxheWVycyA9IFs0LCA0LCA0LCA0XTtcclxuICAgICAgICB2YXIgbm9kZXMgPSBnb20ubmV1cmFsTmV0d29yay5sYXllcnNUb05vZGVzKGxheWVycyk7XHJcbiAgICAgICAgdmFyIGxpbmtzID0gZ29tLm5ldXJhbE5ldHdvcmsubGF5ZXJzVG9MaW5rcyhsYXllcnMpO1xyXG4gICAgICAgIHZhciB1aSA9IGdvbS5uZXVyYWxOZXR3b3JrLmxheWVyc1RvVUkobGF5ZXJzKTtcclxuICAgICAgICAvLyBzZXQgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbnMgb2YgdGhlIGRpYWdyYW1cclxuICAgICAgICB2YXIgbWFyZ2luID0geyB0b3A6IDUwLCByaWdodDogOTAsIGJvdHRvbTogNTAsIGxlZnQ6IDkwIH0sXHJcbiAgICAgICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXHJcbiAgICAgICAgICAgIGhlaWdodCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjbGF5ZXItZGVzaWduZXJcIikuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KSxcclxuICAgICAgICAgICAgZyA9IHN2Zy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibm9kZXMtY29udGFpbmVyXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxpbmsgPSBnLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGxpbmtzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnRhcmdldFxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBzb3VyY2UueCArIFwiLFwiICsgc291cmNlLnlcclxuICAgICAgICAgICAgICAgICAgICArIFwiQ1wiICsgc291cmNlLnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIHRhcmdldC55O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBnLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKG5vZGVzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbm9kZS5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDEwKTtcclxuXHJcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGQzLmJ1dHRvbigpXHJcbiAgICAgICAgICAgIC5vbigncHJlc3MnLCBmdW5jdGlvbiAoZCwgaSkgeyBjb25zb2xlLmxvZyhcIlByZXNzZWRcIiwgZCwgaSwgdGhpcy5wYXJlbnROb2RlKSB9KVxyXG4gICAgICAgICAgICAub24oJ3JlbGVhc2UnLCBmdW5jdGlvbiAoZCwgaSkgeyBjb25zb2xlLmxvZyhcIlJlbGVhc2VkXCIsIGQsIGksIHRoaXMucGFyZW50Tm9kZSkgfSk7XHJcblxyXG4gICAgICAgIHZhciBidXR0b25zID0gZy5zZWxlY3RBbGwoJy5idXR0b24nKVxyXG4gICAgICAgICAgICAuZGF0YSh1aSlcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24nKVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHZhciBtR3JvdXBXaWR0aCA9ICQoXCIjbm9kZXMtY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xyXG4gICAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICgoc3ZnLmF0dHIoXCJ3aWR0aFwiKSAvIDIpIC0gbUdyb3VwV2lkdGggLyAyKSArIFwiLCAwKVwiKTtcclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuXHJcblxyXG4gICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKSAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0XHJcbiAgICAgICAgICAgIHN2Zy5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xyXG4gICAgICAgICAgICBnLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAod2lkdGggLyAyIC0gbUdyb3VwV2lkdGggLyAyKSArIFwiLCAwKVwiKTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYXllcnNUb05vZGVzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIHZhciBhcnIgPSBbXSxcclxuICAgICAgICAgICAgdkNlbnRlciA9IE1hdGguZmxvb3IoJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKSAvIDIpLFxyXG4gICAgICAgICAgICB4ID0gMCxcclxuICAgICAgICAgICAgeSA9IDAsXHJcbiAgICAgICAgICAgIG11bHQgPSA1MDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxheWVyc1tpXSAlIDIgPT0gMClcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gKGxheWVyc1tpXSAqIG11bHQgLyAyKSArIChtdWx0IC8gMik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gTWF0aC5mbG9vcihsYXllcnNbaV0gLyAyKSAqIG11bHQ7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHksIHZDZW50ZXIsIGxheWVyc1tpXSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgXCJuYW1lXCI6IGkgKyBcIiBcIiArIGosIHg6IHgsIHk6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIG11bHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5ID0gMDtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTGlua3MgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgdmFyIGFyciA9IFtdO1xyXG4gICAgICAgIHZhciB4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZTdW0gPSBsYXllcnMuc2xpY2UoMCwgaSArIDEpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IHByZXZTdW07IHkgPCBwcmV2U3VtICsgbGF5ZXJzW2kgKyAxXTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goeyBzb3VyY2U6IHgsIHRhcmdldDogeSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYXllcnNUb1VJID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIHZhciBhcnIgPSBbXSxcclxuICAgICAgICAgICAgeCA9IDAsXHJcbiAgICAgICAgICAgIHkgPSA1MCxcclxuICAgICAgICAgICAgbXVsdCA9IDQwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBhcnIucHVzaCh7IGxhYmVsOiBcIitcIiwgeDogeCwgeTogeSB9KTtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICB9XHJcbn0pOyJdfQ==
