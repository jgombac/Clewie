var gom = gom || {};

gom.create = {

    name: "",
    id: "",
    description: "",
    model: null,

    init: function (context) {
        gom.clew.generateID()
            .done(function (id) {
                console.log(id);
                $('[data-gom-model="id"]', context).html(id);
            })
            .fail(function () {
                console.log("id fail");
            });

        $("#publish-model").on("click", function () {
            var valid = gom.create.prepareData(context);
        });
    },

    prepareData: function (context) {
        var model = {
            name: $('[data-gom-model="name"]', context).val(),
            id: $('[data-gom-model="id"]', context).val(),
            description: $('[data-gom-model="description"]', context).val(),
        }
        return gom.create.validate(model);
    },

    validate: function (model) {
        for (var property in model) {
            if (model.hasOwnProperty(property)) {
                if (model[property].length == 0) {
                    return false;
                }
            }
        }
        //TODO other validations...
        return true;
    },

    publish: function () {

    }

}