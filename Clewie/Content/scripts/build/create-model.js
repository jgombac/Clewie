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

    var margin = { top: 50, right: 90, bottom: 50, left: 90 },
        width = $("#layer-designer").width() - margin.left - margin.right,
        height = $("#layer-designer").height();

    

    var layers = [1, 1, 2];

    var data = null;

    var g = null;
    
    var init = function () {
        
        data = {
            nodes: layersToNodes(layers),
            links: layersToLinks(layers),
            ui: layersToUI(layers),
        };

        

        var svg = d3.select("#layer-designer").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height);

        g = svg.append("g")
            .attr("id", "nodes-container");

        initData(data);
        //update(data);

       

        var mGroupWidth = $("#nodes-container")[0].getBoundingClientRect().width;
        g.attr("transform", "translate(" + ((svg.attr("width") / 2) - mGroupWidth / 2) + ", 0)");
        $(window).resize(function () {


            width = $("#layer-designer").width() - margin.left - margin.right
            svg.attr("width", width);
            g.attr("transform", "translate(" + (width / 2 - mGroupWidth / 2) + ", 0)");

        });

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
        console.log(layers);
        layers[i] += x;
        data.nodes = layersToNodes(layers);
        data.links = layersToLinks(layers);
        data.ui = layersToUI(layers);
        console.log(layers);
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
        let val = 1;

        for (var i = 0; i < layers.length; i++) {
            neuronUI.push({ label: "+", x: x, y: y, index: i , val: val});
            x = x + mult * 2;
        }
        y = height - 20;
        x = 0;
        val = -1;
        for (var i = 0; i < layers.length; i++) {
            neuronUI.push({ label: "-", x: x, y: y, index: i, val: val });
            x = x + mult * 2;
        }

        layerUI.push({ label: "Remove layer", x: -100, y: y, action: "remove" });
        layerUI.push({ label: "Add layer", x: x + 100, y: y, action: "add" });

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5ldXJhbC1uZXR3b3JrLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJjcmVhdGUtbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL3ZhciBsaW5rID0gc3ZnLnNlbGVjdEFsbChcImxpbmUubGlua1wiKVxyXG4vL2RhdGEoKVxyXG5cclxuLy8gYWRkcyB0aGUgbGlua3MgYmV0d2VlbiB0aGUgbm9kZXNcclxuLy92YXIgbGluayA9IGcuc2VsZWN0QWxsKFwiLmxpbmtcIilcclxuLy8gICAgLmRhdGEobm9kZXMuZGVzY2VuZGFudHMoKS5zbGljZSgxKSlcclxuLy8gICAgLmVudGVyKCkuYXBwZW5kKFwicGF0aFwiKVxyXG4vLyAgICAuYXR0cihcImNsYXNzXCIsIFwibGlua1wiKVxyXG4vLyAgICAuYXR0cihcImRcIiwgZnVuY3Rpb24gKGQpIHtcclxuLy8gICAgICAgIHJldHVybiBcIk1cIiArIGQueCArIFwiLFwiICsgZC55XHJcbi8vICAgICAgICAgICAgKyBcIkNcIiArIGQueCArIFwiLFwiICsgKGQueSArIGQucGFyZW50LnkpIC8gMlxyXG4vLyAgICAgICAgICAgICsgXCIgXCIgKyBkLnBhcmVudC54ICsgXCIsXCIgKyAoZC55ICsgZC5wYXJlbnQueSkgLyAyXHJcbi8vICAgICAgICAgICAgKyBcIiBcIiArIGQucGFyZW50LnggKyBcIixcIiArIGQucGFyZW50Lnk7XHJcbi8vICAgIH0pO1xyXG5cclxuLy8gYWRkcyBlYWNoIG5vZGUgYXMgYSBncm91cFxyXG4vL3ZhciBub2RlID0gZy5zZWxlY3RBbGwoXCIubm9kZVwiKVxyXG4vLyAgICAuZGF0YShub2RlcylcclxuLy8gICAgLmVudGVyKCkuYXBwZW5kKFwiZ1wiKVxyXG4vLyAgICAuYXR0cihcImNsYXNzXCIsIGZ1bmN0aW9uIChkKSB7XHJcbi8vICAgICAgICByZXR1cm4gXCJub2RlXCIgK1xyXG4vLyAgICAgICAgICAgIChkLmNoaWxkcmVuID8gXCIgbm9kZS0taW50ZXJuYWxcIiA6IFwiIG5vZGUtLWxlYWZcIik7XHJcbi8vICAgIH0pXHJcbi8vICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbi8vICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4vLyAgICB9KTtcclxuXHJcbi8vIGFkZHMgdGhlIGNpcmNsZSB0byB0aGUgbm9kZVxyXG5cclxuXHJcbi8vIGFkZHMgdGhlIHRleHQgdG8gdGhlIG5vZGVcclxuLy9ub2RlLmFwcGVuZChcInRleHRcIilcclxuLy8gICAgLmF0dHIoXCJkeVwiLCBcIi4zNWVtXCIpXHJcbi8vICAgIC5hdHRyKFwieVwiLCBmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5jaGlsZHJlbiA/IC0yMCA6IDIwOyB9KVxyXG4vLyAgICAuc3R5bGUoXCJ0ZXh0LWFuY2hvclwiLCBcIm1pZGRsZVwiKVxyXG4vLyAgICAudGV4dChmdW5jdGlvbiAoZCkgeyByZXR1cm4gZC5kYXRhLm5hbWU7IH0pO1xyXG5cclxudmFyIG5ldXJhbE5ldHdvcmsgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBtYXJnaW4gPSB7IHRvcDogNTAsIHJpZ2h0OiA5MCwgYm90dG9tOiA1MCwgbGVmdDogOTAgfSxcclxuICAgICAgICB3aWR0aCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikud2lkdGgoKSAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0LFxyXG4gICAgICAgIGhlaWdodCA9ICQoXCIjbGF5ZXItZGVzaWduZXJcIikuaGVpZ2h0KCk7XHJcblxyXG4gICAgXHJcblxyXG4gICAgdmFyIGxheWVycyA9IFsxLCAxLCAyXTtcclxuXHJcbiAgICB2YXIgZGF0YSA9IG51bGw7XHJcblxyXG4gICAgdmFyIGcgPSBudWxsO1xyXG4gICAgXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBcclxuICAgICAgICBkYXRhID0ge1xyXG4gICAgICAgICAgICBub2RlczogbGF5ZXJzVG9Ob2RlcyhsYXllcnMpLFxyXG4gICAgICAgICAgICBsaW5rczogbGF5ZXJzVG9MaW5rcyhsYXllcnMpLFxyXG4gICAgICAgICAgICB1aTogbGF5ZXJzVG9VSShsYXllcnMpLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICB2YXIgc3ZnID0gZDMuc2VsZWN0KFwiI2xheWVyLWRlc2lnbmVyXCIpLmFwcGVuZChcInN2Z1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIHdpZHRoICsgbWFyZ2luLmxlZnQgKyBtYXJnaW4ucmlnaHQpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XHJcblxyXG4gICAgICAgIGcgPSBzdmcuYXBwZW5kKFwiZ1wiKVxyXG4gICAgICAgICAgICAuYXR0cihcImlkXCIsIFwibm9kZXMtY29udGFpbmVyXCIpO1xyXG5cclxuICAgICAgICBpbml0RGF0YShkYXRhKTtcclxuICAgICAgICAvL3VwZGF0ZShkYXRhKTtcclxuXHJcbiAgICAgICBcclxuXHJcbiAgICAgICAgdmFyIG1Hcm91cFdpZHRoID0gJChcIiNub2Rlcy1jb250YWluZXJcIilbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XHJcbiAgICAgICAgZy5hdHRyKFwidHJhbnNmb3JtXCIsIFwidHJhbnNsYXRlKFwiICsgKChzdmcuYXR0cihcIndpZHRoXCIpIC8gMikgLSBtR3JvdXBXaWR0aCAvIDIpICsgXCIsIDApXCIpO1xyXG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24gKCkge1xyXG5cclxuXHJcbiAgICAgICAgICAgIHdpZHRoID0gJChcIiNsYXllci1kZXNpZ25lclwiKS53aWR0aCgpIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHRcclxuICAgICAgICAgICAgc3ZnLmF0dHIoXCJ3aWR0aFwiLCB3aWR0aCk7XHJcbiAgICAgICAgICAgIGcuYXR0cihcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZShcIiArICh3aWR0aCAvIDIgLSBtR3JvdXBXaWR0aCAvIDIpICsgXCIsIDApXCIpO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBpbml0RGF0YSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgdmFyIGxpbmsgPSBnLnNlbGVjdEFsbChcIi5saW5rXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubGlua3MpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcInBhdGhcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImxpbmtcIilcclxuICAgICAgICAgICAgLmF0dHIoXCJkXCIsIGZ1bmN0aW9uIChsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc291cmNlID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnNvdXJjZVxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gZGF0YS5ub2Rlcy5maWx0ZXIoZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaSA9PSBsLnRhcmdldFxyXG4gICAgICAgICAgICAgICAgfSlbMF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJNXCIgKyBzb3VyY2UueCArIFwiLFwiICsgc291cmNlLnlcclxuICAgICAgICAgICAgICAgICAgICArIFwiQ1wiICsgc291cmNlLnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIChzb3VyY2UueSArIHRhcmdldC55KSAvIDJcclxuICAgICAgICAgICAgICAgICAgICArIFwiIFwiICsgdGFyZ2V0LnggKyBcIixcIiArIHRhcmdldC55O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5vZGUgPSBnLnNlbGVjdEFsbChcIi5ub2RlXCIpXHJcbiAgICAgICAgICAgIC5kYXRhKGRhdGEubm9kZXMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpLmFwcGVuZChcImNpcmNsZVwiKVxyXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgMTApXHJcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJub2RlXCIpXHJcbiAgICAgICAgICAgIC5hdHRyKFwidHJhbnNmb3JtXCIsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ0cmFuc2xhdGUoXCIgKyBkLnggKyBcIixcIiArIGQueSArIFwiKVwiO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIG5ldXJvbkJ0bnMgPSBnLnNlbGVjdEFsbCgnLmJ1dHRvbi1uZXVyb24nKVxyXG4gICAgICAgICAgICAuZGF0YShkYXRhLnVpLm5ldXJvbnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLW5ldXJvbicpXHJcbiAgICAgICAgICAgIC5hdHRyKFwiZ29tLWxheWVyLWluZGV4XCIsIGZ1bmN0aW9uIChkKSB7IHJldHVybiBkLmluZGV4OyB9KVxyXG4gICAgICAgICAgICAuYXR0cihcImdvbS1sYXllci12YWxcIiwgZnVuY3Rpb24gKGQpIHsgcmV0dXJuIGQudmFsOyB9KVxyXG4gICAgICAgICAgICAuY2FsbChidXR0b24pO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGxheWVyQnRucyA9IGcuc2VsZWN0QWxsKCcuYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmRhdGEoZGF0YS51aS5sYXllcnMpXHJcbiAgICAgICAgICAgIC5lbnRlcigpXHJcbiAgICAgICAgICAgIC5hcHBlbmQoJ2cnKVxyXG4gICAgICAgICAgICAuYXR0cignY2xhc3MnLCAnYnV0dG9uLWxheWVyJylcclxuICAgICAgICAgICAgLmNhbGwoYnV0dG9uKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgZy5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xyXG4gICAgICAgIGluaXREYXRhKGRhdGEpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgbW9kaWZ5TGF5ZXIgPSBmdW5jdGlvbiAoYWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKGFjdGlvbiA9PSBcImFkZFwiKVxyXG4gICAgICAgICAgICBsYXllcnMucHVzaCgxKTtcclxuICAgICAgICBlbHNlIGlmIChhY3Rpb24gPT0gXCJyZW1vdmVcIilcclxuICAgICAgICAgICAgbGF5ZXJzLnBvcCgpO1xyXG4gICAgICAgIGRhdGEubm9kZXMgPSBsYXllcnNUb05vZGVzKGxheWVycyk7XHJcbiAgICAgICAgZGF0YS5saW5rcyA9IGxheWVyc1RvTGlua3MobGF5ZXJzKTtcclxuICAgICAgICBkYXRhLnVpID0gbGF5ZXJzVG9VSShsYXllcnMpO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgdXBkYXRlTGF5ZXJzID0gZnVuY3Rpb24gKGksIHgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhsYXllcnMpO1xyXG4gICAgICAgIGxheWVyc1tpXSArPSB4O1xyXG4gICAgICAgIGRhdGEubm9kZXMgPSBsYXllcnNUb05vZGVzKGxheWVycyk7XHJcbiAgICAgICAgZGF0YS5saW5rcyA9IGxheWVyc1RvTGlua3MobGF5ZXJzKTtcclxuICAgICAgICBkYXRhLnVpID0gbGF5ZXJzVG9VSShsYXllcnMpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGxheWVycyk7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb05vZGVzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgdkNlbnRlciA9IE1hdGguZmxvb3IoJChcIiNsYXllci1kZXNpZ25lclwiKS5oZWlnaHQoKSAvIDIpO1xyXG4gICAgICAgIGxldCB4ID0gMDtcclxuICAgICAgICBsZXQgeSA9IDA7XHJcbiAgICAgICAgbGV0IG11bHQgPSA1MDtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGxheWVyc1tpXSAlIDIgPT0gMClcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gKGxheWVyc1tpXSAqIG11bHQgLyAyKSArIChtdWx0IC8gMik7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHkgPSB2Q2VudGVyIC0gTWF0aC5mbG9vcihsYXllcnNbaV0gLyAyKSAqIG11bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgXCJuYW1lXCI6IGkgKyBcIiBcIiArIGosIHg6IHgsIHk6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB5ID0geSArIG11bHRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB5ID0gMDtcclxuICAgICAgICAgICAgeCA9IHggKyBtdWx0ICogMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhcnI7XHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBsYXllcnNUb0xpbmtzID0gZnVuY3Rpb24gKGxheWVycykge1xyXG4gICAgICAgIGxldCBhcnIgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXllcnMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbGF5ZXJzW2ldOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcmV2U3VtID0gbGF5ZXJzLnNsaWNlKDAsIGkgKyAxKS5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHkgPSBwcmV2U3VtOyB5IDwgcHJldlN1bSArIGxheWVyc1tpICsgMV07IHkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyci5wdXNoKHsgc291cmNlOiB4LCB0YXJnZXQ6IHkgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB4ID0geCArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGFycjtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGxheWVyc1RvVUkgPSBmdW5jdGlvbiAobGF5ZXJzKSB7XHJcbiAgICAgICAgbGV0IG5ldXJvblVJID0gW107XHJcbiAgICAgICAgbGV0IGxheWVyVUkgPSBbXTtcclxuICAgICAgICBsZXQgeCA9IDA7XHJcbiAgICAgICAgbGV0IHkgPSA1MDtcclxuICAgICAgICBsZXQgbXVsdCA9IDUwO1xyXG4gICAgICAgIGxldCB2YWwgPSAxO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiK1wiLCB4OiB4LCB5OiB5LCBpbmRleDogaSAsIHZhbDogdmFsfSk7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHkgPSBoZWlnaHQgLSAyMDtcclxuICAgICAgICB4ID0gMDtcclxuICAgICAgICB2YWwgPSAtMTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxheWVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBuZXVyb25VSS5wdXNoKHsgbGFiZWw6IFwiLVwiLCB4OiB4LCB5OiB5LCBpbmRleDogaSwgdmFsOiB2YWwgfSk7XHJcbiAgICAgICAgICAgIHggPSB4ICsgbXVsdCAqIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsYXllclVJLnB1c2goeyBsYWJlbDogXCJSZW1vdmUgbGF5ZXJcIiwgeDogLTEwMCwgeTogeSwgYWN0aW9uOiBcInJlbW92ZVwiIH0pO1xyXG4gICAgICAgIGxheWVyVUkucHVzaCh7IGxhYmVsOiBcIkFkZCBsYXllclwiLCB4OiB4ICsgMTAwLCB5OiB5LCBhY3Rpb246IFwiYWRkXCIgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB7IG5ldXJvbnM6IG5ldXJvblVJLCBsYXllcnM6IGxheWVyVUkgfTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIGJ1dHRvbiA9IGQzLmJ1dHRvbigpXHJcbiAgICAgICAgLm9uKCdwcmVzcycsIGZ1bmN0aW9uIChkLCBpKSB7IH0pXHJcbiAgICAgICAgLm9uKCdyZWxlYXNlJywgZnVuY3Rpb24gKGQsIGkpIHtcclxuICAgICAgICAgICAgaWYgKGQuaW5kZXggIT0gdW5kZWZpbmVkICYmIGQudmFsICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUxheWVycyhkLmluZGV4LCBkLnZhbCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGQuYWN0aW9uICE9IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIG1vZGlmeUxheWVyKGQuYWN0aW9uKTtcclxuICAgICAgICAgICAgdXBkYXRlKGRhdGEpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdCxcclxuICAgICAgICBnOiBnLFxyXG4gICAgfTtcclxufSkoKTsiXX0=
