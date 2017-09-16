var gom = gom || {};

gom.create = {

    name: "",
    id: "",
    description: "",
    model: null,

    init: function (context) {
        this.id = gom.randomizer.getString(8);
        $('[data-gom-model="id"]', context).html(this.id);

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
                var table = $("#table-viewer").DataTable({
                    data: response.data,
                    columns: response.headers,
                    paging: false,
                    searching: false,
                    info: false,
                    ordering: false,
                });

                $("th", "#table-viewer").last().attr("data-gom-role", "target");
                $("th", "#table-viewer").last().attr("data-gom-index", $("th", "#table-viewer").last().index());

                $("th", "#table-viewer").click(function () {
                    $("th", "#table-viewer").removeAttr("data-gom-role");
                    var prevIndex = $("th[data-gom-index]", "#table-viewer").attr("data-gom-index");
                    $("th[data-gom-index]", "#table-viewer").removeAttr("data-gom-index");
                    $(this).attr("data-gom-role", "target");
                    var newIndex = $(this).index();
                    $(this).attr("data-gom-index", $(this).index());
                    if (prevIndex != newIndex) {
                        gom.fileManager.uploadDataRoles();
                    }
                });

                $("[data-gom-type]").change(function () {
                    gom.fileManager.uploadDataRoles();
                });
                gom.fileManager.uploadDataRoles();
            })
            .fail(function () { console.log("fail"); });
    },

    uploadDataRoles: function () {
        var data = {
            types: [],
            target: parseInt($("th[data-gom-index]").attr("data-gom-index")),
        }
        var typeCount = $("[data-gom-type]").length;
        for (var i = 0; i < typeCount; i++) {
            data.types.push($("[data-gom-type='"+i+"']").find(":selected").text());
        }
        gom.clew.uploadDataRoles(data)
            .done(function (response) {
                console.log(response);
            })
            .fail(function () { console.log("fail"); })
    },
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
            dataType: "json",
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
    },

    uploadDataRoles: function (data) {
        return gom.clew.call("POST", "/Create/UpdateDataRoles", data);
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIiwiZmlsZS1tYW5hZ2VyLmpzIiwiY2xldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLmNyZWF0ZSA9IHtcclxuXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgaWQ6IFwiXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgIG1vZGVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGdvbS5yYW5kb21pemVyLmdldFN0cmluZyg4KTtcclxuICAgICAgICAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpLmh0bWwodGhpcy5pZCk7XHJcblxyXG4gICAgICAgICQoXCIjcHVibGlzaC1tb2RlbFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkID0gZ29tLmNyZWF0ZS5wcmVwYXJlRGF0YShjb250ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcHJlcGFyZURhdGE6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIG1vZGVsID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJuYW1lXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgICAgIGlkOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJCgnW2RhdGEtZ29tLW1vZGVsPVwiZGVzY3JpcHRpb25cIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jcmVhdGUudmFsaWRhdGUobW9kZWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gbW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKG1vZGVsLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsW3Byb3BlcnR5XS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL1RPRE8gb3RoZXIgdmFsaWRhdGlvbnMuLi5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgcHVibGlzaDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLnRvcGJhciA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5uYXZiYXItdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJChcIi5jb2xsYXBzZVwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLnJhbmRvbWl6ZXIgPSB7XHJcblxyXG4gICAgZ2V0TnVtYmVyOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKGxlbikge1xyXG4gICAgICAgIHZhciBjaGFyYWN0ZXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OVwiO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG59IiwiXHJcbmdvbS5maWxlTWFuYWdlciA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWREYXRhc2V0OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJkYXRhc2V0XCIsICQoXCJbZGF0YS1nb20tZmlsZT0nZGF0YXNldCddXCIsIGNvbnRleHQpWzBdLmZpbGVzWzBdKTtcclxuICAgICAgICBmb3JtLmFwcGVuZChcImRlY2ltYWxcIiwgJChcIltkYXRhLWdvbS1zZXBhcmF0b3I9J2RlY2ltYWwnXVwiLCBjb250ZXh0KS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKSk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJjb2x1bW5cIiwgJChcIltkYXRhLWdvbS1zZXBhcmF0b3I9J2NvbHVtbiddXCIsIGNvbnRleHQpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuXHJcblxyXG4gICAgICAgIGdvbS5jbGV3LnVwbG9hZERhdGFzZXQoZm9ybSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSAkKFwiI3RhYmxlLXZpZXdlclwiKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uczogcmVzcG9uc2UuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgICAgICBwYWdpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5mbzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5sYXN0KCkuYXR0cihcImRhdGEtZ29tLXJvbGVcIiwgXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIiwgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5sYXN0KCkuaW5kZXgoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5yZW1vdmVBdHRyKFwiZGF0YS1nb20tcm9sZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldkluZGV4ID0gJChcInRoW2RhdGEtZ29tLWluZGV4XVwiLCBcIiN0YWJsZS12aWV3ZXJcIikuYXR0cihcImRhdGEtZ29tLWluZGV4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJ0aFtkYXRhLWdvbS1pbmRleF1cIiwgXCIjdGFibGUtdmlld2VyXCIpLnJlbW92ZUF0dHIoXCJkYXRhLWdvbS1pbmRleFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWdvbS1yb2xlXCIsIFwidGFyZ2V0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbmRleCA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWdvbS1pbmRleFwiLCAkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2SW5kZXggIT0gbmV3SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ29tLmZpbGVNYW5hZ2VyLnVwbG9hZERhdGFSb2xlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICQoXCJbZGF0YS1nb20tdHlwZV1cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBnb20uZmlsZU1hbmFnZXIudXBsb2FkRGF0YVJvbGVzKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGdvbS5maWxlTWFuYWdlci51cGxvYWREYXRhUm9sZXMoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKCkgeyBjb25zb2xlLmxvZyhcImZhaWxcIik7IH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWREYXRhUm9sZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgdHlwZXM6IFtdLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IHBhcnNlSW50KCQoXCJ0aFtkYXRhLWdvbS1pbmRleF1cIikuYXR0cihcImRhdGEtZ29tLWluZGV4XCIpKSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHR5cGVDb3VudCA9ICQoXCJbZGF0YS1nb20tdHlwZV1cIikubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZUNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgZGF0YS50eXBlcy5wdXNoKCQoXCJbZGF0YS1nb20tdHlwZT0nXCIraStcIiddXCIpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ29tLmNsZXcudXBsb2FkRGF0YVJvbGVzKGRhdGEpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoKSB7IGNvbnNvbGUubG9nKFwiZmFpbFwiKTsgfSlcclxuICAgIH0sXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLmNsZXcgPSB7XHJcbiAgICBjYWxsOiBmdW5jdGlvbiAodHlwZSwgdXJsLCBkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSAhPSBudWxsID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBcIlwiLFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaWxlQ2FsbDogZnVuY3Rpb24gKHR5cGUsIHVybCwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHB1Ymxpc2hNb2RlbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIlwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YXNldDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuZmlsZUNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9UcmFpbmluZ1NldFwiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YVJvbGVzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVXBkYXRlRGF0YVJvbGVzXCIsIGRhdGEpO1xyXG4gICAgfVxyXG59Il19
