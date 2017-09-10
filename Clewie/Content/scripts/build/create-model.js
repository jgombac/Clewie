
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY3JlYXRlLW1vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbnZhciBuZXVyYWxOZXR3b3JrID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgd2lkdGggPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLndpZHRoKCksXHJcbiAgICAgICAgaGVpZ2h0ID0gJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKTtcclxuICBcclxuXHJcbiAgICB2YXIgbGF5ZXJzID0gWzQsIDUsIDUsIDUsIDUsIDRdO1xyXG5cclxuICAgIHZhciBkYXRhID0gbnVsbDtcclxuXHJcbiAgICB2YXIgZyA9IG51bGwsXHJcbiAgICAgICAgc3ZnID0gbnVsbDtcclxuICAgIFxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZGF0YSA9IHtcclxuICAgICAgICAgICAgbm9kZXM6IGxheWVyc1RvTm9kZXMobGF5ZXJzKSxcclxuICAgICAgICAgICAgbGlua3M6IGxheWVyc1RvTGlua3MobGF5ZXJzKSxcclxuICAgICAgICAgICAgdWk6IGxheWVyc1RvVUkobGF5ZXJzKSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzdmcgPSBkMy5zZWxlY3QoXCIjbGF5ZXItZGVzaWduZXJcIikuYXBwZW5kKFwic3ZnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJkZXNpZ25lci1jb250YWluZXJcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgZyA9IHN2Zy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJub2Rlcy1jb250YWluZXJcIik7XHJcblxyXG4gICAgICAgIGluaXREYXRhKGRhdGEpO1xyXG5cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBpbml0RGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxpbmsgPSBnLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubGlua3MpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnRhcmdldFxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBzb3VyY2UueCArIFwiLFwiICsgc291cmNlLnlcclxuICAgICAgICAgICAgICAgICAgICArIFwiQ1wiICsgc291cmNlLnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIHRhcmdldC55O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBnLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubm9kZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgMTApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5ldXJvbkJ0bnMgPSBnLnNlbGVjdEFsbCgnLmJ1dHRvbi1uZXVyb24nKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLm5ldXJvbnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLWluZGV4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmluZGV4OyB9KVxyXG4gICAgICAgICAgICAuYXR0cihcImdvbS1sYXllci12YWxcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxheWVyQnRucyA9IGcuc2VsZWN0QWxsKCcuYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS51aS5sYXllcnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmNhbGwoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgdmFyIG1Hcm91cFdpZHRoID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgXHJcbiAgICAgICAgZy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKHN2Zy5hdHRyKFwid2lkdGhcIikgLSBtR3JvdXBXaWR0aCkgLyAyICsgXCIsIDApXCIpO1xyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICAgICAgc3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHdpZHRoLCBzdmcuYXR0cihcIndpZHRoXCIpLCBtR3JvdXBXaWR0aCwgKHN2Zy5hdHRyKFwid2lkdGhcIikgLSBtR3JvdXBXaWR0aCkgLyAyKTtcclxuXHJcbiAgICAgICAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChzdmcuYXR0cihcIndpZHRoXCIpIC0gbUdyb3VwV2lkdGgpKjAuNyArIFwiLCAwKVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgZy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGluaXREYXRhKGRhdGEpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbW9kaWZ5TGF5ZXIgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImFkZFwiKVxyXG4gICAgICAgICAgICBsYXllcnMucHVzaCgxKTtcclxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgbGF5ZXJzLnBvcCgpO1xyXG4gICAgICAgIGRhdGEubm9kZXMgPSBsYXllcnNUb05vZGVzKGxheWVycyk7XHJcbiAgICAgICAgZGF0YS5saW5rcyA9IGxheWVyc1RvTGlua3MobGF5ZXJzKTtcclxuICAgICAgICBkYXRhLnVpID0gbGF5ZXJzVG9VSShsYXllcnMpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGksIHgpIHtcclxuICAgICAgICBsYXllcnNbaV0gKz0geDtcclxuICAgICAgICBkYXRhLm5vZGVzID0gbGF5ZXJzVG9Ob2RlcyhsYXllcnMpO1xyXG4gICAgICAgIGRhdGEubGlua3MgPSBsYXllcnNUb0xpbmtzKGxheWVycyk7XHJcbiAgICAgICAgZGF0YS51aSA9IGxheWVyc1RvVUkobGF5ZXJzKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTm9kZXMgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGxldCB2Q2VudGVyID0gTWF0aC5mbG9vcigkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpIC8gMik7XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gMDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGF5ZXJzW2ldICUgMiA9PSAwKVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSAobGF5ZXJzW2ldICogbXVsdCAvIDIpICsgKG11bHQgLyAyKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSBNYXRoLmZsb29yKGxheWVyc1tpXSAvIDIpICogbXVsdDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goeyBcIm5hbWVcIjogaSArIFwiIFwiICsgaiwgeDogeCwgeTogeSB9KTtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgbXVsdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTGlua3MgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZTdW0gPSBsYXllcnMuc2xpY2UoMCwgaSArIDEpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IHByZXZTdW07IHkgPCBwcmV2U3VtICsgbGF5ZXJzW2kgKyAxXTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goeyBzb3VyY2U6IHgsIHRhcmdldDogeSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9VSSA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgbmV1cm9uVUkgPSBbXTtcclxuICAgICAgICBsZXQgbGF5ZXJVSSA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDUwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiB4LCB5OiB5LTIwLCBpbmRleDogaSwgdmFsOiAtMSB9KTtcclxuICAgICAgICAgICAgbmV1cm9uVUkucHVzaCh7IGxhYmVsOiBcIitcIiwgeDogeCwgeTogeSsyMCwgaW5kZXg6IGksIHZhbDogMSB9KTtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiAtMTAwLCB5OiB5LCBhY3Rpb246IFwicmVtb3ZlXCIgfSk7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5LCBhY3Rpb246IFwiYWRkXCIgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IG5ldXJvbnM6IG5ldXJvblVJLCBsYXllcnM6IGxheWVyVUkgfTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGJ1dHRvbiA9IGQzLmJ1dHRvbigpXHJcbiAgICAgICAgLm9uKCdwcmVzcycsIGZ1bmN0aW9uIChkLCBpKSB7IH0pXHJcbiAgICAgICAgLm9uKCdyZWxlYXNlJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGQuaW5kZXggIT0gdW5kZWZpbmVkICYmIGQudmFsICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxheWVycyhkLmluZGV4LCBkLnZhbCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGQuYWN0aW9uICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIG1vZGlmeUxheWVyKGQuYWN0aW9uKTtcclxuICAgICAgICAgICAgdXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICBnOiBnLFxyXG4gICAgfTtcclxufSkoKTsiXX0=
