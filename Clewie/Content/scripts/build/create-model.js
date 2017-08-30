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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3JlYXRlLW1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy92YXIgbGluayA9IHN2Zy5zZWxlY3RBbGwoXCJsaW5lLmxpbmtcIilcclxuLy9kYXRhKClcclxuXHJcbi8vIGFkZHMgdGhlIGxpbmtzIGJldHdlZW4gdGhlIG5vZGVzXHJcbi8vdmFyIGxpbmsgPSBnLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbi8vICAgIC5kYXRhKG5vZGVzLmRlc2NlbmRhbnRzKCkuc2xpY2UoMSkpXHJcbi8vICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuLy8gICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuLy8gICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChkKSB7XHJcbi8vICAgICAgICByZXR1cm4gXCJNXCIgKyBkLnggKyBcIixcIiArIGQueVxyXG4vLyAgICAgICAgICAgICsgXCJDXCIgKyBkLnggKyBcIixcIiArIChkLnkgKyBkLnBhcmVudC55KSAvIDJcclxuLy8gICAgICAgICAgICArIFwiIFwiICsgZC5wYXJlbnQueCArIFwiLFwiICsgKGQueSArIGQucGFyZW50LnkpIC8gMlxyXG4vLyAgICAgICAgICAgICsgXCIgXCIgKyBkLnBhcmVudC54ICsgXCIsXCIgKyBkLnBhcmVudC55O1xyXG4vLyAgICB9KTtcclxuXHJcbi8vIGFkZHMgZWFjaCBub2RlIGFzIGEgZ3JvdXBcclxuLy92YXIgbm9kZSA9IGcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuLy8gICAgLmRhdGEobm9kZXMpXHJcbi8vICAgIC5lbnRlcigpLmFwcGVuZChcImdcIilcclxuLy8gICAgLmF0dHIoXCJjbGFzc1wiLCBmdW5jdGlvbiAoZCkge1xyXG4vLyAgICAgICAgcmV0dXJuIFwibm9kZVwiICtcclxuLy8gICAgICAgICAgICAoZC5jaGlsZHJlbiA/IFwiIG5vZGUtLWludGVybmFsXCIgOiBcIiBub2RlLS1sZWFmXCIpO1xyXG4vLyAgICB9KVxyXG4vLyAgICAuYXR0cihcInRyYW5zZm9ybVwiLCBmdW5jdGlvbiAoZCkge1xyXG4vLyAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgZC54ICsgXCIsXCIgKyBkLnkgKyBcIilcIjtcclxuLy8gICAgfSk7XHJcblxyXG4vLyBhZGRzIHRoZSBjaXJjbGUgdG8gdGhlIG5vZGVcclxuXHJcblxyXG4vLyBhZGRzIHRoZSB0ZXh0IHRvIHRoZSBub2RlXHJcbi8vbm9kZS5hcHBlbmQoXCJ0ZXh0XCIpXHJcbi8vICAgIC5hdHRyKFwiZHlcIiwgXCIuMzVlbVwiKVxyXG4vLyAgICAuYXR0cihcInlcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuY2hpbGRyZW4gPyAtMjAgOiAyMDsgfSlcclxuLy8gICAgLnN0eWxlKFwidGV4dC1hbmNob3JcIiwgXCJtaWRkbGVcIilcclxuLy8gICAgLnRleHQoZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuZGF0YS5uYW1lOyB9KTtcclxuXHJcbmdvbS5uZXVyYWxOZXR3b3JrID0ge1xyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGF5ZXJzID0gWzEsIDIsIDEwLCAyLCAyLCAxMCwgMiwgMV07XHJcbiAgICAgICAgdmFyIG5vZGVzID0gZ29tLm5ldXJhbE5ldHdvcmsubGF5ZXJzVG9Ob2RlcyhsYXllcnMpO1xyXG4gICAgICAgIHZhciBsaW5rcyA9IGdvbS5uZXVyYWxOZXR3b3JrLmxheWVyc1RvTGlua3MobGF5ZXJzKTtcclxuICAgICAgICAvLyBzZXQgdGhlIGRpbWVuc2lvbnMgYW5kIG1hcmdpbnMgb2YgdGhlIGRpYWdyYW1cclxuICAgICAgICB2YXIgbWFyZ2luID0geyB0b3A6IDUwLCByaWdodDogOTAsIGJvdHRvbTogNTAsIGxlZnQ6IDkwIH0sXHJcbiAgICAgICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQsXHJcbiAgICAgICAgICAgIGhlaWdodCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgIHZhciBzdmcgPSBkMy5zZWxlY3QoXCIjbGF5ZXItZGVzaWduZXJcIikuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGggKyBtYXJnaW4ubGVmdCArIG1hcmdpbi5yaWdodClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KSxcclxuICAgICAgICAgICAgZyA9IHN2Zy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibm9kZXMtY29udGFpbmVyXCIpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxpbmsgPSBnLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGxpbmtzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJwYXRoXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJsaW5rXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZFwiLCBmdW5jdGlvbiAobCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IG5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnRhcmdldFxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBzb3VyY2UueCArIFwiLFwiICsgc291cmNlLnlcclxuICAgICAgICAgICAgICAgICAgICArIFwiQ1wiICsgc291cmNlLnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIHRhcmdldC55O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBnLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKG5vZGVzKVxyXG4gICAgICAgICAgICAuZW50ZXIoKS5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbm9kZS5hcHBlbmQoXCJjaXJjbGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJyXCIsIDEwKTtcclxuXHJcbiAgICAgICAgdmFyIG1Hcm91cFdpZHRoID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgZy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKChzdmcuYXR0cihcIndpZHRoXCIpIC8gMikgLSBtR3JvdXBXaWR0aCAvIDIpICsgXCIsIDApXCIpO1xyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHRcclxuICAgICAgICAgICAgc3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICh3aWR0aCAvIDIgLSBtR3JvdXBXaWR0aCAvIDIpICsgXCIsIDApXCIpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGxheWVyc1RvTm9kZXM6IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICB2YXIgYXJyID0gW10sXHJcbiAgICAgICAgICAgIHZDZW50ZXIgPSBNYXRoLmZsb29yKCQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCkgLyAyKSxcclxuICAgICAgICAgICAgeCA9IDAsXHJcbiAgICAgICAgICAgIHkgPSAwLFxyXG4gICAgICAgICAgICBtdWx0ID0gNTA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXllcnNbaV0gJSAyID09IDApXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIChsYXllcnNbaV0gKiBtdWx0IC8gMikgKyAobXVsdCAvIDIpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIE1hdGguZmxvb3IobGF5ZXJzW2ldIC8gMikgKiBtdWx0O1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh5LCB2Q2VudGVyLCBsYXllcnNbaV0pO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7IFwibmFtZVwiOiBpICsgXCIgXCIgKyBqLCB4OiB4LCB5OiB5LCBkZXNjOiBbeyBmdW5jdGlvbihkKSB7IGQuc2VsZWN0QWxsKCk7IH0gfV0gfSk7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIG11bHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5ID0gMDtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9LFxyXG5cclxuICAgIGxheWVyc1RvTGlua3M6IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICB2YXIgYXJyID0gW107XHJcbiAgICAgICAgdmFyIHggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aCAtIDE7IGkrKykgeyAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2U3VtID0gbGF5ZXJzLnNsaWNlKDAsIGkgKyAxKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSBwcmV2U3VtOyB5IDwgcHJldlN1bSArIGxheWVyc1tpICsgMV07IHkrKykgeyAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goeyBzb3VyY2U6IHgsIHRhcmdldDogeSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfSxcclxuXHJcblxyXG59Il19
