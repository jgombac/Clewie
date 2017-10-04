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
        //if layers are locked, dont modify inputs and outputs
        if (neuralNetwork.locked && (i == 0 || i == layers.length - 1))
            return;
        //layer must contain atleast one neuroncd
        if (layers[i] <= 1 && x == -1)
            return;
        layers[i] += x;
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    }

    var modifyLayers = function (action) {
        //dont cant remove any layers if there are only 2
        if (layers.length <= 2 && action == "remove")
            return;
        //if layers are locked insert a layer before the end, otherwise to the end
        if (action == "add")
            (neuralNetwork.locked) ? layers.splice(layers.length - 1, 0, 1) : layers.push(1);
        //remove a layer before the end if layers are locked
        else if (action == "remove")
            (neuralNetwork.locked) ? layers.splice(layers.length-2, 1) : layers.pop();
        data = initVisualData(layers);
        neuralNetwork.updateLayers(layers);
    } 

    var updateVisuals = function (layers) {
        data = initVisualData(layers);
        update();
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
        updateVisuals: updateVisuals,
    }
    
})();