
var neuralNetwork = (function () {

    var layers = [4, 5, 5, 5, 5, 4];

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


        console.log(canvas, g);
        
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjcmVhdGUtbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyIG5ldXJhbE5ldHdvcmsgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBsYXllcnMgPSBbNCwgNSwgNSwgNSwgNSwgNF07XHJcblxyXG4gICAgdmFyIGluaXQgPSBmdW5jdGlvbiAoY29udGV4dCkge1xyXG5cclxuICAgICAgICBublZpc3VhbC5pbml0KGNvbnRleHQsIHRoaXMpO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVwZGF0ZUxheWVycyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICB0aGlzLmxheWVycyA9IGxheWVycztcclxuICAgIH1cclxuICBcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICAgICAgbGF5ZXJzOiBsYXllcnMsXHJcbiAgICAgICAgdXBkYXRlTGF5ZXJzOiB1cGRhdGVMYXllcnMsXHJcbiAgICB9O1xyXG59KSgpOyIsInZhciBublZpc3VhbCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY29udGV4dCA9IG51bGw7XHJcbiAgICB2YXIgbGF5ZXJzID0gbnVsbDtcclxuXHJcblxyXG4gICAgdmFyIHdpZHRoID0gMCxcclxuICAgICAgICBoZWlnaHQgPSAwO1xyXG5cclxuICAgIHZhciBjYW52YXMgPSBudWxsLFxyXG4gICAgICAgIGcgPSBudWxsO1xyXG5cclxuICAgIHZhciBkYXRhID0gbnVsbDtcclxuXHJcbiAgICB2YXIgbm4gPSBudWxsO1xyXG5cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5uKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm5uID0gbm47XHJcbiAgICAgICAgbGF5ZXJzID0gbm4ubGF5ZXJzO1xyXG5cclxuICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICBoZWlnaHQgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuXHJcbiAgICAgICAgY2FudmFzID0gZDMuc2VsZWN0KFwiI2xheWVyLWRlc2lnbmVyXCIpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwiZGVzaWduZXItY29udGFpbmVyXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgd2lkdGgpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGcgPSBjYW52YXMuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibm9kZXMtY29udGFpbmVyXCIpO1xyXG5cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coY2FudmFzLCBnKTtcclxuICAgICAgICBcclxuICAgICAgICBkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGluaXRWaXN1YWxEYXRhID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5vZGVzOiBsYXllcnNUb05vZGVzKGxheWVycyksXHJcbiAgICAgICAgICAgIGxpbmtzOiBsYXllcnNUb0xpbmtzKGxheWVycyksXHJcbiAgICAgICAgICAgIHVpOiBsYXllcnNUb1VJKGxheWVycyksXHJcbiAgICAgICAgfTtcclxuICAgIH0gXHJcblxyXG4gICAgdmFyIHVwZGF0ZUxheWVycyA9IGZ1bmN0aW9uIChpLCB4KSB7XHJcbiAgICAgICAgbGF5ZXJzW2ldICs9IHg7XHJcbiAgICAgICAgZGF0YSA9IGluaXRWaXN1YWxEYXRhKGxheWVycyk7XHJcbiAgICAgICAgbmV1cmFsTmV0d29yay51cGRhdGVMYXllcnMobGF5ZXJzKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbW9kaWZ5TGF5ZXJzID0gZnVuY3Rpb24gKGFjdGlvbikge1xyXG4gICAgICAgIGlmIChhY3Rpb24gPT0gXCJhZGRcIilcclxuICAgICAgICAgICAgbGF5ZXJzLnB1c2goMSk7XHJcbiAgICAgICAgZWxzZSBpZiAoYWN0aW9uID09IFwicmVtb3ZlXCIpXHJcbiAgICAgICAgICAgIGxheWVycy5wb3AoKTtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBuZXVyYWxOZXR3b3JrLnVwZGF0ZUxheWVycyhsYXllcnMpO1xyXG4gICAgfSBcclxuXHJcbiAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGcuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcclxuICAgICAgICBkcmF3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGRyYXcgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGxpbmsgPSBnLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubGlua3MpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnRhcmdldFxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBzb3VyY2UueCArIFwiLFwiICsgc291cmNlLnlcclxuICAgICAgICAgICAgICAgICAgICArIFwiQ1wiICsgc291cmNlLnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIHRhcmdldC55O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBnLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubm9kZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgMTApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5ldXJvbkJ0bnMgPSBnLnNlbGVjdEFsbCgnLmJ1dHRvbi1uZXVyb24nKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLm5ldXJvbnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLWluZGV4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmluZGV4OyB9KVxyXG4gICAgICAgICAgICAuYXR0cihcImdvbS1sYXllci12YWxcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxheWVyQnRucyA9IGcuc2VsZWN0QWxsKCcuYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS51aS5sYXllcnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmNhbGwoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgdmFyIG1Hcm91cFdpZHRoID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcblxyXG4gICAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbUdyb3VwV2lkdGgpIC8gMiArIFwiLCAwKVwiKTtcclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgd2lkdGggPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLndpZHRoKCk7XHJcbiAgICAgICAgICAgIGNhbnZhcy5hdHRyKFwid2lkdGhcIiwgd2lkdGgpO1xyXG4gICAgICAgICAgICBnLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoY2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIG1Hcm91cFdpZHRoKSAqIDAuNyArIFwiLCAwKVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9Ob2RlcyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgbGV0IHZDZW50ZXIgPSBNYXRoLmZsb29yKCQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCkgLyAyKTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSAwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChsYXllcnNbaV0gJSAyID09IDApXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIChsYXllcnNbaV0gKiBtdWx0IC8gMikgKyAobXVsdCAvIDIpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB5ID0gdkNlbnRlciAtIE1hdGguZmxvb3IobGF5ZXJzW2ldIC8gMikgKiBtdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBhcnIucHVzaCh7IFwibmFtZVwiOiBpICsgXCIgXCIgKyBqLCB4OiB4LCB5OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgeSA9IHkgKyBtdWx0XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9MaW5rcyA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgYXJyID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGxheWVyc1tpXTsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlN1bSA9IGxheWVycy5zbGljZSgwLCBpICsgMSkucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB5ID0gcHJldlN1bTsgeSA8IHByZXZTdW0gKyBsYXllcnNbaSArIDFdOyB5KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnIucHVzaCh7IHNvdXJjZTogeCwgdGFyZ2V0OiB5IH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgeCA9IHggKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb1VJID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBuZXVyb25VSSA9IFtdO1xyXG4gICAgICAgIGxldCBsYXllclVJID0gW107XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gNTA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGF5ZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5ldXJvblVJLnB1c2goeyBsYWJlbDogXCItXCIsIHg6IHgsIHk6IHkgLSAyMCwgaW5kZXg6IGksIHZhbDogLTEgfSk7XHJcbiAgICAgICAgICAgIG5ldXJvblVJLnB1c2goeyBsYWJlbDogXCIrXCIsIHg6IHgsIHk6IHkgKyAyMCwgaW5kZXg6IGksIHZhbDogMSB9KTtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiAtMTAwLCB5OiB5LCBhY3Rpb246IFwicmVtb3ZlXCIgfSk7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5LCBhY3Rpb246IFwiYWRkXCIgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IG5ldXJvbnM6IG5ldXJvblVJLCBsYXllcnM6IGxheWVyVUkgfTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGJ1dHRvbiA9IGQzLmJ1dHRvbigpXHJcbiAgICAgICAgLm9uKCdwcmVzcycsIGZ1bmN0aW9uIChkLCBpKSB7IH0pXHJcbiAgICAgICAgLm9uKCdyZWxlYXNlJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGQuaW5kZXggIT0gdW5kZWZpbmVkICYmIGQudmFsICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxheWVycyhkLmluZGV4LCBkLnZhbCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGQuYWN0aW9uICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIG1vZGlmeUxheWVycyhkLmFjdGlvbik7XHJcbiAgICAgICAgICAgIHVwZGF0ZShkYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICB9XHJcbiAgICBcclxufSkoKTsiXX0=
