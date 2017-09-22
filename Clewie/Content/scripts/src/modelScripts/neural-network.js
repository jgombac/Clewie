
var neuralNetwork = (function () {

    var features = [];
    var targets = [];
    var layers = [4, 5, 3];
    var locked = false;

    var init = function (context) {

        nnVisual.init(context, this);
        $(".start-btn").click(function () {
            uploadParameters();
            console.log(layers);
        });

    };

    var setParameter = function (param, data) {
        if (param == "features")
            this.features = data;
        else if (param == "target")
            this.targets = data;
        console.log(param, data);
    }


    var updateLayers = function (layers) {
        this.layers = layers;
    }

    var setFixedLayers = function (layers) {
        //lock layers if a user provides training dataset
        this.layers = layers;
        this.locked = true;
        nnVisual.updateVisuals(layers);
        console.log(this);
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
        locked: locked,
        features: features,
        setParameter: setParameter,
        updateLayers: updateLayers,
        setFixedLayers: setFixedLayers,
    };
})();