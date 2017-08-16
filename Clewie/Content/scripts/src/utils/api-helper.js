var gom = gom || {};

gom.create = {

    name: "",
    id: "",
    description: "",
    model: null,

    init: function (context) {
        this.id = gom.randomizer.getString(8);
        $('[data-gom-model="id"]', context).val(this.id);
    },

    validate: function () {

    },

    publish: function () {

    }

}