
var neuralNetwork = (function () {

    var features = [];
    var targets = [];
    var layers = [4, 5, 3];
    var locked = false;

    var model = {};
    that = null;

    var init = function (context) {
        that = this;
        nnVisual.init(context, this);
        $(".start-btn").click(function () {
            pretrain();
            console.log(layers);
        });

        $(".refresh-btn").click(function () {
            publish();
        });
        setDefaultParameters();
    };

    var updateModel = function () {
        that.model = {
            id: $("[data-gom-model='id']").text(),
            name: $("[data-gom-model='name']").val(),
            description: $("[data-gom-model='description']").val(),
            layers: layers,
            parameters: {
                maxEpochs: parseFloat($("#max-epochs").val()),
                learningRate: parseFloat($("#learning-rate").val()),
                momentum: parseFloat($("#momentum").val()),
                weightDecay: parseFloat($("#weight-decay").val()),
            }
        }
    }

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

    var pretrain = function () {
        updateModel();
        gom.clew.pretrain(model)
            .done(function (response) {
                console.log("response");
            })
            .fail(function () {

            });
    }

    var publish = function () {
        updateModel();
        gom.clew.publishModel(that.model)
            .done()
            .fail();
    }


    var uploadParameters = function () {
        updateModel();
        gom.clew.uploadParameters(model)
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
        model: model,
    };
})();