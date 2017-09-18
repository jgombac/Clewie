
var neuralNetwork = (function () {

    var layers = [4, 5, 3];

    var init = function (context) {

        nnVisual.init(context, this);
        $(".start-btn").click(function () {
            uploadParameters();
            console.log(layers);
        });

    };

    var updateLayers = function (layers) {
        this.layers = layers;
    }

    var uploadParameters = function () {
        var data = {
            layers: layers,
            maxEpochs: 2000,
            learningRate: 0.01,
            momentum: 0.001,
            weightDecay: 0.01,
        }
        gom.clew.uploadParameters(data)
            .done(function (response) {
                console.log(response);
            })
            .fail(function (response) { console.log("fail") });
    }
  
    return {
        init: init,
        layers: layers,
        updateLayers: updateLayers,
    };
})();