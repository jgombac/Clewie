var gom = gom || {};

gom.create = {

    name: "",
    id: "",
    description: "",
    model: null,

    init: function (context) {
        this.id = gom.randomizer.getString(8);
        console.log(this.id, $('[data-gom-model="id"]', context));
        $('[data-gom-model="id"]', context).html(this.id);

        $("#publish-model").on("click", function () {
            var valid = gom.create.prepareData(context);
            console.log(valid);
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
                console.log(property);
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
var gom = gom || {};

gom.topbar = {

    init: function () {
        $(".navbar-toggle").click(function () {
            $(".collapse").toggleClass("active");
        });
    }

}
var gom = gom || {};

gom.randomizer = {

    getNumber: function (min, max) {

    },

    getString: function (len) {
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var result = "";
        for (var i = 0; i < len; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    },
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLmNyZWF0ZSA9IHtcclxuXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgaWQ6IFwiXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgIG1vZGVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGdvbS5yYW5kb21pemVyLmdldFN0cmluZyg4KTtcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlkLCAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpKTtcclxuICAgICAgICAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpLmh0bWwodGhpcy5pZCk7XHJcblxyXG4gICAgICAgICQoXCIjcHVibGlzaC1tb2RlbFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkID0gZ29tLmNyZWF0ZS5wcmVwYXJlRGF0YShjb250ZXh0KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2codmFsaWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBwcmVwYXJlRGF0YTogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICQoJ1tkYXRhLWdvbS1tb2RlbD1cIm5hbWVcIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICAgICAgaWQ6ICQoJ1tkYXRhLWdvbS1tb2RlbD1cImlkXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJkZXNjcmlwdGlvblwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ29tLmNyZWF0ZS52YWxpZGF0ZShtb2RlbCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBtb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAobW9kZWwuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobW9kZWxbcHJvcGVydHldLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vVE9ETyBvdGhlciB2YWxpZGF0aW9ucy4uLlxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwdWJsaXNoOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfVxyXG5cclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20udG9wYmFyID0ge1xyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiLm5hdmJhci10b2dnbGVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKFwiLmNvbGxhcHNlXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20ucmFuZG9taXplciA9IHtcclxuXHJcbiAgICBnZXROdW1iZXI6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAobGVuKSB7XHJcbiAgICAgICAgdmFyIGNoYXJhY3RlcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbn0iXX0=
