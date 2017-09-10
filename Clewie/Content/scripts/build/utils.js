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

gom.fileManager = {

    init: function () {

    },

    uploadDataset: function (context) {
        var form = new FormData();
        form.append("dataset", $("[data-gom-file='dataset']", context)[0].files[0]);
        form.append("decimal", $("[data-gom-separator='decimal']", context).find(":selected").text());
        form.append("column", $("[data-gom-separator='column']", context).find(":selected").text());


        gom.clew.uploadDataset(form)
            .done(function (response) {
                console.log("success");
                $("#table-viewer").html(response);
            })
            .fail(function () { console.log("fail"); });
    }
}
var gom = gom || {};

gom.clew = {
    call: function (type, url, data) {
        return $.ajax({
            type: type,
            url: url,
            contentType: "application/json",
            dataType: "json",
            data: data != null ? JSON.stringify(data) : "",
            async: true,
            cache: false,
        });
    },

    fileCall: function (type, url, data) {
        return $.ajax({
            type: type,
            url: url,
            data: data,
            contentType: false,
            processData: false,
            async: true,
            cache: false,
        });
    },


    publishModel: function () {
        return gom.clew.call("POST", "");
    },


    uploadDataset: function (data) {
        return gom.clew.fileCall("POST", "/Create/TrainingSet", data);
    } 
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIiwiZmlsZS1tYW5hZ2VyLmpzIiwiY2xldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5jcmVhdGUgPSB7XHJcblxyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGlkOiBcIlwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXCIsXHJcbiAgICBtb2RlbDogbnVsbCxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBnb20ucmFuZG9taXplci5nZXRTdHJpbmcoOCk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5pZCwgJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KSk7XHJcbiAgICAgICAgJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KS5odG1sKHRoaXMuaWQpO1xyXG5cclxuICAgICAgICAkKFwiI3B1Ymxpc2gtbW9kZWxcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZCA9IGdvbS5jcmVhdGUucHJlcGFyZURhdGEoY29udGV4dCk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbGlkKTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcHJlcGFyZURhdGE6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIG1vZGVsID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJuYW1lXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgICAgIGlkOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJCgnW2RhdGEtZ29tLW1vZGVsPVwiZGVzY3JpcHRpb25cIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jcmVhdGUudmFsaWRhdGUobW9kZWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gbW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKG1vZGVsLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsW3Byb3BlcnR5XS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL1RPRE8gb3RoZXIgdmFsaWRhdGlvbnMuLi5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgcHVibGlzaDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLnRvcGJhciA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5uYXZiYXItdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJChcIi5jb2xsYXBzZVwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLnJhbmRvbWl6ZXIgPSB7XHJcblxyXG4gICAgZ2V0TnVtYmVyOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKGxlbikge1xyXG4gICAgICAgIHZhciBjaGFyYWN0ZXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OVwiO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG59IiwiXHJcbmdvbS5maWxlTWFuYWdlciA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWREYXRhc2V0OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJkYXRhc2V0XCIsICQoXCJbZGF0YS1nb20tZmlsZT0nZGF0YXNldCddXCIsIGNvbnRleHQpWzBdLmZpbGVzWzBdKTtcclxuICAgICAgICBmb3JtLmFwcGVuZChcImRlY2ltYWxcIiwgJChcIltkYXRhLWdvbS1zZXBhcmF0b3I9J2RlY2ltYWwnXVwiLCBjb250ZXh0KS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKSk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJjb2x1bW5cIiwgJChcIltkYXRhLWdvbS1zZXBhcmF0b3I9J2NvbHVtbiddXCIsIGNvbnRleHQpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuXHJcblxyXG4gICAgICAgIGdvbS5jbGV3LnVwbG9hZERhdGFzZXQoZm9ybSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Y2Nlc3NcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwiI3RhYmxlLXZpZXdlclwiKS5odG1sKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKCkgeyBjb25zb2xlLmxvZyhcImZhaWxcIik7IH0pO1xyXG4gICAgfVxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5jbGV3ID0ge1xyXG4gICAgY2FsbDogZnVuY3Rpb24gKHR5cGUsIHVybCwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEgIT0gbnVsbCA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogXCJcIixcclxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgZmlsZUNhbGw6IGZ1bmN0aW9uICh0eXBlLCB1cmwsIGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgcHVibGlzaE1vZGVsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmNhbGwoXCJQT1NUXCIsIFwiXCIpO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgdXBsb2FkRGF0YXNldDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuZmlsZUNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9UcmFpbmluZ1NldFwiLCBkYXRhKTtcclxuICAgIH0gXHJcbn0iXX0=
