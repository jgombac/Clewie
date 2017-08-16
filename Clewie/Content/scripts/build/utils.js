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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJyYW5kb21pemVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20uY3JlYXRlID0ge1xyXG5cclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBpZDogXCJcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxyXG4gICAgbW9kZWw6IG51bGwsXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmlkID0gZ29tLnJhbmRvbWl6ZXIuZ2V0U3RyaW5nKDgpO1xyXG4gICAgICAgICQoJ1tkYXRhLWdvbS1tb2RlbD1cImlkXCJdJywgY29udGV4dCkudmFsKHRoaXMuaWQpO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgcHVibGlzaDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLnJhbmRvbWl6ZXIgPSB7XHJcblxyXG4gICAgZ2V0TnVtYmVyOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKGxlbikge1xyXG4gICAgICAgIHZhciBjaGFyYWN0ZXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OVwiO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG59Il19
