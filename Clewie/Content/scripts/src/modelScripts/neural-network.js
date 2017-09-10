
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