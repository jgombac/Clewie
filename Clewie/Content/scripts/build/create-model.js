
var neuralNetwork = (function () {

    var layers = [4, 5, 3];

    var init = function (context) {

        nnVisual.init(context, this);

    };

    var updateLayers = function (layers) {
        this.layers = layers;
    }
  

    return {
        init: init,
        layers: layers,
        updateLayers: updateLayers,
    };
})();
var nnVisual = (function () {
    var context = null;
    var layers = null;


    var width = 0,
        height = 0;

    var canvas = null,
        g = null;

    var data = null;

    var nn = null;

    var init = function (context, nn) {
        this.context = context;
        this.nn = nn;
        layers = nn.layers;

        width = $("#layer-designer").width();
        height = $("#layer-designer").height();

        data = initVisualData(layers);

        canvas = d3.select("#layer-designer").append("svg")
            .attr("id", "designer-container")
            .attr("width", width)
            .attr("height", height);

        g = canvas.append("g")
            .attr("id", "nodes-container");
        
        draw();
    }

    var initVisualData = function (layers) {
        return {
            nodes: layersToNodes(layers),
            links: layersToLinks(layers),
            ui: layersToUI(layers),
        };
    } 

    var updateLayers = function (i, x) {
        layers[i] += x;
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    }

    var modifyLayers = function (action) {
        if (action == "add")
            layers.push(1);
        else if (action == "remove")
            layers.pop();
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    } 

    var update = function () {
        g.selectAll("*").remove();
        draw();
    }

    var draw = function () {
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

        g.attr("transform", "translate(" + (canvas.attr("width") - mGroupWidth) / 2 + ", 0)");
        $(window).resize(function () {
            width = $("#layer-designer").width();
            canvas.attr("width", width);
            g.attr("transform", "translate(" + (canvas.attr("width") - mGroupWidth) * 0.7 + ", 0)");
        });
    }

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
            neuronUI.push({ label: "-", x: x, y: y - 20, index: i, val: -1 });
            neuronUI.push({ label: "+", x: x, y: y + 20, index: i, val: 1 });
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
                modifyLayers(d.action);
            update(data);
        });

    return {
        init: init,
    }
    
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjcmVhdGUtbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIG5ldXJhbE5ldHdvcmsgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBsYXllcnMgPSBbNCwgNSwgM107XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG5cclxuICAgICAgICBublZpc3VhbC5pbml0KGNvbnRleHQsIHRoaXMpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVwZGF0ZUxheWVycyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgIH1cclxuICBcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICAgICAgbGF5ZXJzOiBsYXllcnMsXHJcbiAgICAgICAgdXBkYXRlTGF5ZXJzOiB1cGRhdGVMYXllcnMsXHJcbiAgICB9O1xyXG59KSgpOyIsInZhciBublZpc3VhbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IG51bGw7XHJcbiAgICB2YXIgbGF5ZXJzID0gbnVsbDtcclxuXHJcblxyXG4gICAgdmFyIHdpZHRoID0gMCxcclxuICAgICAgICBoZWlnaHQgPSAwO1xyXG5cclxuICAgIHZhciBjYW52YXMgPSBudWxsLFxyXG4gICAgICAgIGcgPSBudWxsO1xyXG5cclxuICAgIHZhciBkYXRhID0gbnVsbDtcclxuXHJcbiAgICB2YXIgbm4gPSBudWxsO1xyXG5cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5uKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm5uID0gbm47XHJcbiAgICAgICAgbGF5ZXJzID0gbm4ubGF5ZXJzO1xyXG5cclxuICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICBoZWlnaHQgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuXHJcbiAgICAgICAgY2FudmFzID0gZDMuc2VsZWN0KFwiI2xheWVyLWRlc2lnbmVyXCIpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZGVzaWduZXItY29udGFpbmVyXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGcgPSBjYW52YXMuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibm9kZXMtY29udGFpbmVyXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW5pdFZpc3VhbERhdGEgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IGxheWVyc1RvTm9kZXMobGF5ZXJzKSxcclxuICAgICAgICAgICAgbGlua3M6IGxheWVyc1RvTGlua3MobGF5ZXJzKSxcclxuICAgICAgICAgICAgdWk6IGxheWVyc1RvVUkobGF5ZXJzKSxcclxuICAgICAgICB9O1xyXG4gICAgfSBcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGksIHgpIHtcclxuICAgICAgICBsYXllcnNbaV0gKz0geDtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBuZXVyYWxOZXR3b3JrLnVwZGF0ZUxheWVycyhsYXllcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtb2RpZnlMYXllcnMgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImFkZFwiKVxyXG4gICAgICAgICAgICBsYXllcnMucHVzaCgxKTtcclxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgbGF5ZXJzLnBvcCgpO1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIG5ldXJhbE5ldHdvcmsudXBkYXRlTGF5ZXJzKGxheWVycyk7XHJcbiAgICB9IFxyXG5cclxuICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgZHJhdyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgbGluayA9IGcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5saW5rcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk1cIiArIHNvdXJjZS54ICsgXCIsXCIgKyBzb3VyY2UueVxyXG4gICAgICAgICAgICAgICAgICAgICsgXCJDXCIgKyBzb3VyY2UueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgdGFyZ2V0Lnk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IGcuc2VsZWN0QWxsKFwiLm5vZGVcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5ub2RlcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwiY2lyY2xlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCAxMClcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcIm5vZGVcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInRyYW5zbGF0ZShcIiArIGQueCArIFwiLFwiICsgZC55ICsgXCIpXCI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbmV1cm9uQnRucyA9IGcuc2VsZWN0QWxsKCcuYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEudWkubmV1cm9ucylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbmV1cm9uJylcclxuICAgICAgICAgICAgLmF0dHIoXCJnb20tbGF5ZXItaW5kZXhcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQuaW5kZXg7IH0pXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLXZhbFwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC52YWw7IH0pXHJcbiAgICAgICAgICAgIC5jYWxsKGJ1dHRvbik7XHJcblxyXG5cclxuICAgICAgICB2YXIgbGF5ZXJCdG5zID0gZy5zZWxlY3RBbGwoJy5idXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLmxheWVycylcclxuICAgICAgICAgICAgLmVudGVyKClcclxuICAgICAgICAgICAgLmFwcGVuZCgnZycpXHJcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdidXR0b24tbGF5ZXInKVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuICAgICAgICB2YXIgbUdyb3VwV2lkdGggPSAkKFwiI25vZGVzLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aDtcclxuXHJcbiAgICAgICAgZy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBtR3JvdXBXaWR0aCkgLyAyICsgXCIsIDApXCIpO1xyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICAgICAgY2FudmFzLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbUdyb3VwV2lkdGgpICogMC43ICsgXCIsIDApXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYXllcnNUb05vZGVzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgdkNlbnRlciA9IE1hdGguZmxvb3IoJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKSAvIDIpO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxheWVyc1tpXSAlIDIgPT0gMClcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gKGxheWVyc1tpXSAqIG11bHQgLyAyKSArIChtdWx0IC8gMik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gTWF0aC5mbG9vcihsYXllcnNbaV0gLyAyKSAqIG11bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgXCJuYW1lXCI6IGkgKyBcIiBcIiArIGosIHg6IHgsIHk6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIG11bHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5ID0gMDtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb0xpbmtzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2U3VtID0gbGF5ZXJzLnNsaWNlKDAsIGkgKyAxKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSBwcmV2U3VtOyB5IDwgcHJldlN1bSArIGxheWVyc1tpICsgMV07IHkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgc291cmNlOiB4LCB0YXJnZXQ6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvVUkgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IG5ldXJvblVJID0gW107XHJcbiAgICAgICAgbGV0IGxheWVyVUkgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSA1MDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG5cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbmV1cm9uVUkucHVzaCh7IGxhYmVsOiBcIi1cIiwgeDogeCwgeTogeSAtIDIwLCBpbmRleDogaSwgdmFsOiAtMSB9KTtcclxuICAgICAgICAgICAgbmV1cm9uVUkucHVzaCh7IGxhYmVsOiBcIitcIiwgeDogeCwgeTogeSArIDIwLCBpbmRleDogaSwgdmFsOiAxIH0pO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IC0xMDAsIHk6IHksIGFjdGlvbjogXCJyZW1vdmVcIiB9KTtcclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHksIGFjdGlvbjogXCJhZGRcIiB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHsgbmV1cm9uczogbmV1cm9uVUksIGxheWVyczogbGF5ZXJVSSB9O1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgYnV0dG9uID0gZDMuYnV0dG9uKClcclxuICAgICAgICAub24oJ3ByZXNzJywgZnVuY3Rpb24gKGQsIGkpIHsgfSlcclxuICAgICAgICAub24oJ3JlbGVhc2UnLCBmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICBpZiAoZC5pbmRleCAhPSB1bmRlZmluZWQgJiYgZC52YWwgIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlTGF5ZXJzKGQuaW5kZXgsIGQudmFsKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAoZC5hY3Rpb24gIT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgbW9kaWZ5TGF5ZXJzKGQuYWN0aW9uKTtcclxuICAgICAgICAgICAgdXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgIH1cclxuICAgIFxyXG59KSgpOyJdfQ==
