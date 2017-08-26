var gom = gom || {};

gom.create = {

    name: "",
    id: "",
    description: "",
    model: null,

    init: function (context) {
        this.id = gom.randomizer.getString(8);
        $('[data-gom-model="id"]', context).val(this.id);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJyYW5kb21pemVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLmNyZWF0ZSA9IHtcclxuXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgaWQ6IFwiXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgIG1vZGVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGdvbS5yYW5kb21pemVyLmdldFN0cmluZyg4KTtcclxuICAgICAgICAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpLnZhbCh0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgJChcIiNwdWJsaXNoLW1vZGVsXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSBnb20uY3JlYXRlLnByZXBhcmVEYXRhKGNvbnRleHQpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2YWxpZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXBhcmVEYXRhOiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBtb2RlbCA9IHtcclxuICAgICAgICAgICAgbmFtZTogJCgnW2RhdGEtZ29tLW1vZGVsPVwibmFtZVwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgICAgICBpZDogJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICQoJ1tkYXRhLWdvbS1tb2RlbD1cImRlc2NyaXB0aW9uXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBnb20uY3JlYXRlLnZhbGlkYXRlKG1vZGVsKTtcclxuICAgIH0sXHJcblxyXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIG1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChtb2RlbC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIGlmIChtb2RlbFtwcm9wZXJ0eV0ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9UT0RPIG90aGVyIHZhbGlkYXRpb25zLi4uXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIHB1Ymxpc2g6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9XHJcblxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5yYW5kb21pemVyID0ge1xyXG5cclxuICAgIGdldE51bWJlcjogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChsZW4pIHtcclxuICAgICAgICB2YXIgY2hhcmFjdGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODlcIjtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzLmxlbmd0aCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxufSJdfQ==
