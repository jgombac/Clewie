
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
        mainG = null;

    var btnCanvas = null,
        btnG = null;

    var data = null;

    var nn = null;

    var init = function (context, nn) {
        this.context = context;
        this.nn = nn;
        layers = nn.layers;

        width = $("#layer-designer").width();
        height = $("#layer-designer").height();

        data = initVisualData(layers);
        console.log(data);


        canvas = d3.select("#layer-designer").append("svg")
            .attr("id", "designer-container")
            .attr("width", width)
            .attr("height", height);

        mainG = canvas.append("g")
            .attr("id", "nodes-container");

        btnCanvas = d3.select("#btn-wrapper").append("svg")
            .attr("id", "btn-canvas")
            .attr("width", width)
            .attr("height", 100);

        btnG = btnCanvas.append("g")
            .attr("id", "btn-container");
        
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
        mainG.selectAll("*").remove();
        btnG.selectAll("*").remove();
        draw();
    }

    var draw = function () {
        var link = mainG.selectAll(".link")
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

        var node = mainG.selectAll(".node")
            .data(data.nodes)
            .enter().append("circle")
            .attr("r", 10)
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        var neuronBtns = btnG.selectAll('.button-neuron')
            .data(data.ui.neurons)
            .enter()
            .append('g')
            .attr('class', 'button-neuron')
            .attr("gom-layer-index", function (d) { return d.index; })
            .attr("gom-layer-val", function (d) { return d.val; })
            .call(button);


        var layerBtns = btnG.selectAll('.button-layer')
            .data(data.ui.layers)
            .enter()
            .append('g')
            .attr('class', 'button-layer')
            .call(button);

        var mainWidth = $("#nodes-container")[0].getBoundingClientRect().width,
            mainHeight = $("#nodes-container")[0].getBoundingClientRect().height,
            btnWidth = $("#btn-container")[0].getBoundingClientRect().width,
            btnHeight = $("#btn-container")[0].getBoundingClientRect().height;

        btnG.attr("transform", "translate(" + (btnCanvas.attr("width") - btnWidth) * 0.5 + ", 0)");
        mainG.attr("transform", "translate(" + (canvas.attr("width") - mainWidth) * 0.5 + ", " + (mainHeight * 0.5) + ")");
        
        console.log(btnHeight, mainHeight, canvas.attr("height"));
        $(window).resize(function () {
            setTimeout(function () {
                width = $("#layer-designer").width();

                canvas.attr("width", width);
                canvas.attr("height", mainHeight);
                btnCanvas.attr("width", width);
                btnG.attr("transform", "translate(" + (btnCanvas.attr("width") - btnWidth) * 0.5 + ", 0)");
                mainG.attr("transform", "translate(" + (canvas.attr("width") - mainWidth) * 0.5 + ", " + (mainHeight * 0.5) + ")");

            }, 250);
        });
    }

    var layersToNodes = function (layers) {
        let arr = [];
        let vCenter = 0;//Math.floor($("#designer-container").height() / 2);
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
            x = x + mult * 2;
            neuronUI.push({ label: "-", x: x, y: y - 20, index: i, val: -1 });
            neuronUI.push({ label: "+", x: x, y: y + 20, index: i, val: 1 });
        }
        x = x + mult * 2;
        layerUI.push({ label: "-", x: 0, y: y, action: "remove" });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIiwibm4tdmlzdWFscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNyZWF0ZS1tb2RlbC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG52YXIgbmV1cmFsTmV0d29yayA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGxheWVycyA9IFs0LCA1LCAzXTtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcblxyXG4gICAgICAgIG5uVmlzdWFsLmluaXQoY29udGV4dCwgdGhpcyk7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIHRoaXMubGF5ZXJzID0gbGF5ZXJzO1xyXG4gICAgfVxyXG4gIFxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICBsYXllcnM6IGxheWVycyxcclxuICAgICAgICB1cGRhdGVMYXllcnM6IHVwZGF0ZUxheWVycyxcclxuICAgIH07XHJcbn0pKCk7IiwidmFyIG5uVmlzdWFsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBjb250ZXh0ID0gbnVsbDtcclxuICAgIHZhciBsYXllcnMgPSBudWxsO1xyXG5cclxuXHJcbiAgICB2YXIgd2lkdGggPSAwLFxyXG4gICAgICAgIGhlaWdodCA9IDA7XHJcblxyXG4gICAgdmFyIGNhbnZhcyA9IG51bGwsXHJcbiAgICAgICAgbWFpbkcgPSBudWxsO1xyXG5cclxuICAgIHZhciBidG5DYW52YXMgPSBudWxsLFxyXG4gICAgICAgIGJ0bkcgPSBudWxsO1xyXG5cclxuICAgIHZhciBkYXRhID0gbnVsbDtcclxuXHJcbiAgICB2YXIgbm4gPSBudWxsO1xyXG5cclxuICAgIHZhciBpbml0ID0gZnVuY3Rpb24gKGNvbnRleHQsIG5uKSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm5uID0gbm47XHJcbiAgICAgICAgbGF5ZXJzID0gbm4ubGF5ZXJzO1xyXG5cclxuICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuICAgICAgICBoZWlnaHQgPSAkKFwiI2xheWVyLWRlc2lnbmVyXCIpLmhlaWdodCgpO1xyXG5cclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuXHJcblxyXG4gICAgICAgIGNhbnZhcyA9IGQzLnNlbGVjdChcIiNsYXllci1kZXNpZ25lclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImRlc2lnbmVyLWNvbnRhaW5lclwiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoKVxyXG4gICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBtYWluRyA9IGNhbnZhcy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJub2Rlcy1jb250YWluZXJcIik7XHJcblxyXG4gICAgICAgIGJ0bkNhbnZhcyA9IGQzLnNlbGVjdChcIiNidG4td3JhcHBlclwiKS5hcHBlbmQoXCJzdmdcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJpZFwiLCBcImJ0bi1jYW52YXNcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aClcclxuICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgMTAwKTtcclxuXHJcbiAgICAgICAgYnRuRyA9IGJ0bkNhbnZhcy5hcHBlbmQoXCJnXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaWRcIiwgXCJidG4tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGRyYXcoKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgaW5pdFZpc3VhbERhdGEgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IGxheWVyc1RvTm9kZXMobGF5ZXJzKSxcclxuICAgICAgICAgICAgbGlua3M6IGxheWVyc1RvTGlua3MobGF5ZXJzKSxcclxuICAgICAgICAgICAgdWk6IGxheWVyc1RvVUkobGF5ZXJzKSxcclxuICAgICAgICB9O1xyXG4gICAgfSBcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGksIHgpIHtcclxuICAgICAgICBsYXllcnNbaV0gKz0geDtcclxuICAgICAgICBkYXRhID0gaW5pdFZpc3VhbERhdGEobGF5ZXJzKTtcclxuICAgICAgICBuZXVyYWxOZXR3b3JrLnVwZGF0ZUxheWVycyhsYXllcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBtb2RpZnlMYXllcnMgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImFkZFwiKVxyXG4gICAgICAgICAgICBsYXllcnMucHVzaCgxKTtcclxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgbGF5ZXJzLnBvcCgpO1xyXG4gICAgICAgIGRhdGEgPSBpbml0VmlzdWFsRGF0YShsYXllcnMpO1xyXG4gICAgICAgIG5ldXJhbE5ldHdvcmsudXBkYXRlTGF5ZXJzKGxheWVycyk7XHJcbiAgICB9IFxyXG5cclxuICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbWFpbkcuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcclxuICAgICAgICBidG5HLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XHJcbiAgICAgICAgZHJhdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBkcmF3ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBsaW5rID0gbWFpbkcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS5saW5rcylcclxuICAgICAgICAgICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4gICAgICAgICAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGwpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwuc291cmNlXHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSBkYXRhLm5vZGVzLmZpbHRlcihmdW5jdGlvbiAoZCwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpID09IGwudGFyZ2V0XHJcbiAgICAgICAgICAgICAgICB9KVswXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIk1cIiArIHNvdXJjZS54ICsgXCIsXCIgKyBzb3VyY2UueVxyXG4gICAgICAgICAgICAgICAgICAgICsgXCJDXCIgKyBzb3VyY2UueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgKHNvdXJjZS55ICsgdGFyZ2V0LnkpIC8gMlxyXG4gICAgICAgICAgICAgICAgICAgICsgXCIgXCIgKyB0YXJnZXQueCArIFwiLFwiICsgdGFyZ2V0Lnk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgbm9kZSA9IG1haW5HLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubm9kZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgMTApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5ldXJvbkJ0bnMgPSBidG5HLnNlbGVjdEFsbCgnLmJ1dHRvbi1uZXVyb24nKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLm5ldXJvbnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLWluZGV4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmluZGV4OyB9KVxyXG4gICAgICAgICAgICAuYXR0cihcImdvbS1sYXllci12YWxcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxheWVyQnRucyA9IGJ0bkcuc2VsZWN0QWxsKCcuYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS51aS5sYXllcnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmNhbGwoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgdmFyIG1haW5XaWR0aCA9ICQoXCIjbm9kZXMtY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLFxyXG4gICAgICAgICAgICBtYWluSGVpZ2h0ID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0LFxyXG4gICAgICAgICAgICBidG5XaWR0aCA9ICQoXCIjYnRuLWNvbnRhaW5lclwiKVswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCxcclxuICAgICAgICAgICAgYnRuSGVpZ2h0ID0gJChcIiNidG4tY29udGFpbmVyXCIpWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcclxuXHJcbiAgICAgICAgYnRuRy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKGJ0bkNhbnZhcy5hdHRyKFwid2lkdGhcIikgLSBidG5XaWR0aCkgKiAwLjUgKyBcIiwgMClcIik7XHJcbiAgICAgICAgbWFpbkcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArIChjYW52YXMuYXR0cihcIndpZHRoXCIpIC0gbWFpbldpZHRoKSAqIDAuNSArIFwiLCBcIiArIChtYWluSGVpZ2h0ICogMC41KSArIFwiKVwiKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zb2xlLmxvZyhidG5IZWlnaHQsIG1haW5IZWlnaHQsIGNhbnZhcy5hdHRyKFwiaGVpZ2h0XCIpKTtcclxuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYW52YXMuYXR0cihcIndpZHRoXCIsIHdpZHRoKTtcclxuICAgICAgICAgICAgICAgIGNhbnZhcy5hdHRyKFwiaGVpZ2h0XCIsIG1haW5IZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgICAgICBidG5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoYnRuQ2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIGJ0bldpZHRoKSAqIDAuNSArIFwiLCAwKVwiKTtcclxuICAgICAgICAgICAgICAgIG1haW5HLmF0dHIoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGUoXCIgKyAoY2FudmFzLmF0dHIoXCJ3aWR0aFwiKSAtIG1haW5XaWR0aCkgKiAwLjUgKyBcIiwgXCIgKyAobWFpbkhlaWdodCAqIDAuNSkgKyBcIilcIik7XHJcblxyXG4gICAgICAgICAgICB9LCAyNTApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBsYXllcnNUb05vZGVzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgdkNlbnRlciA9IDA7Ly9NYXRoLmZsb29yKCQoXCIjZGVzaWduZXItY29udGFpbmVyXCIpLmhlaWdodCgpIC8gMik7XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gMDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGF5ZXJzW2ldICUgMiA9PSAwKVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSAobGF5ZXJzW2ldICogbXVsdCAvIDIpICsgKG11bHQgLyAyKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgeSA9IHZDZW50ZXIgLSBNYXRoLmZsb29yKGxheWVyc1tpXSAvIDIpICogbXVsdDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgYXJyLnB1c2goeyBcIm5hbWVcIjogaSArIFwiIFwiICsgaiwgeDogeCwgeTogeSB9KTtcclxuICAgICAgICAgICAgICAgIHkgPSB5ICsgbXVsdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHkgPSAwO1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvTGlua3MgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IGFyciA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsYXllcnNbaV07IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZTdW0gPSBsYXllcnMuc2xpY2UoMCwgaSArIDEpLnJlZHVjZSgoYSwgYikgPT4gYSArIGIsIDApO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeSA9IHByZXZTdW07IHkgPCBwcmV2U3VtICsgbGF5ZXJzW2kgKyAxXTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyLnB1c2goeyBzb3VyY2U6IHgsIHRhcmdldDogeSB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHggPSB4ICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYXJyO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbGF5ZXJzVG9VSSA9IGZ1bmN0aW9uIChsYXllcnMpIHtcclxuICAgICAgICBsZXQgbmV1cm9uVUkgPSBbXTtcclxuICAgICAgICBsZXQgbGF5ZXJVSSA9IFtdO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDUwO1xyXG4gICAgICAgIGxldCBtdWx0ID0gNTA7XHJcblxyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB4ID0geCArIG11bHQgKiAyO1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiB4LCB5OiB5IC0gMjAsIGluZGV4OiBpLCB2YWw6IC0xIH0pO1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5ICsgMjAsIGluZGV4OiBpLCB2YWw6IDEgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiAwLCB5OiB5LCBhY3Rpb246IFwicmVtb3ZlXCIgfSk7XHJcbiAgICAgICAgbGF5ZXJVSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5LCBhY3Rpb246IFwiYWRkXCIgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IG5ldXJvbnM6IG5ldXJvblVJLCBsYXllcnM6IGxheWVyVUkgfTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGJ1dHRvbiA9IGQzLmJ1dHRvbigpXHJcbiAgICAgICAgLm9uKCdwcmVzcycsIGZ1bmN0aW9uIChkLCBpKSB7IH0pXHJcbiAgICAgICAgLm9uKCdyZWxlYXNlJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGQuaW5kZXggIT0gdW5kZWZpbmVkICYmIGQudmFsICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxheWVycyhkLmluZGV4LCBkLnZhbCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGQuYWN0aW9uICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIG1vZGlmeUxheWVycyhkLmFjdGlvbik7XHJcbiAgICAgICAgICAgIHVwZGF0ZShkYXRhKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXQsXHJcbiAgICB9XHJcbiAgICBcclxufSkoKTsiXX0=
