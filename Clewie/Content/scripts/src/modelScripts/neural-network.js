
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
        setDefaultParameters();
    };

    var setDefaultParameters = function () {
        $("#max-epochs").val(1000);
        $("#learning-rate").val(0.01);
        $("#momentum").val(0.01);
        $("#weight-decay").val(0.01);
    }

    var setParameter = function (param, data) {
        if (param == "features")
            this.features = data;
        else if (param == "target")
            this.targets = data;
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
            maxEpochs: parseFloat($("#max-epochs").val()),
            learningRate: parseFloat($("#learning-rate").val()),
            momentum: parseFloat($("#momentum").val()),
            weightDecay: parseFloat($("#weight-decay").val()),
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