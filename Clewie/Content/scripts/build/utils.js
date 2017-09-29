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
                    autoWidth: false,
                });
                //$("select[data-gom-type]").selectmenu();
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
                neuralNetwork.setParameter("features", response.headers);
                console.log(neuralNetwork.features);
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
                console.log("oldLayers", neuralNetwork.layers);
                var layers = neuralNetwork.layers;
                layers[0] = response.inputs;
                layers[layers.length - 1] = response.outputs;
                neuralNetwork.setFixedLayers(layers);
                //$("#numerized-table").DataTable({
                //    data: response.sample,
                //    columns: neuralNetwork.features,
                //    paging: false,
                //    searching: false,
                //    info: false,
                //    ordering: false,
                //});
                console.log(response.sample);
            })
            .fail(function () { console.log("fail"); });

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

    uploadParameters: function (data) {
        return gom.clew.call("POST", "/Create/UploadParameters", data);
    },

    uploadDataset: function (data) {
        return gom.clew.fileCall("POST", "/Create/TrainingSet", data);
    },

    uploadDataRoles: function (data) {
        return gom.clew.call("POST", "/Create/UpdateDataRoles", data);
    }
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIiwiZmlsZS1tYW5hZ2VyLmpzIiwiY2xldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLmNyZWF0ZSA9IHtcclxuXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgaWQ6IFwiXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgIG1vZGVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGdvbS5yYW5kb21pemVyLmdldFN0cmluZyg4KTtcclxuICAgICAgICAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpLmh0bWwodGhpcy5pZCk7XHJcblxyXG4gICAgICAgICQoXCIjcHVibGlzaC1tb2RlbFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIHZhbGlkID0gZ29tLmNyZWF0ZS5wcmVwYXJlRGF0YShjb250ZXh0KTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgcHJlcGFyZURhdGE6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIG1vZGVsID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJuYW1lXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgICAgIGlkOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJpZFwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJCgnW2RhdGEtZ29tLW1vZGVsPVwiZGVzY3JpcHRpb25cIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jcmVhdGUudmFsaWRhdGUobW9kZWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICB2YWxpZGF0ZTogZnVuY3Rpb24gKG1vZGVsKSB7XHJcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gbW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKG1vZGVsLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vZGVsW3Byb3BlcnR5XS5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL1RPRE8gb3RoZXIgdmFsaWRhdGlvbnMuLi5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0sXHJcblxyXG4gICAgcHVibGlzaDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLnRvcGJhciA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJChcIi5uYXZiYXItdG9nZ2xlXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJChcIi5jb2xsYXBzZVwiKS50b2dnbGVDbGFzcyhcImFjdGl2ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLnJhbmRvbWl6ZXIgPSB7XHJcblxyXG4gICAgZ2V0TnVtYmVyOiBmdW5jdGlvbiAobWluLCBtYXgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIGdldFN0cmluZzogZnVuY3Rpb24gKGxlbikge1xyXG4gICAgICAgIHZhciBjaGFyYWN0ZXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OVwiO1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnMubGVuZ3RoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9LFxyXG59IiwiXHJcbmdvbS5maWxlTWFuYWdlciA9IHtcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWREYXRhc2V0OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBmb3JtID0gbmV3IEZvcm1EYXRhKCk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJkYXRhc2V0XCIsICQoXCJbZGF0YS1nb20tZmlsZT0nZGF0YXNldCddXCIsIGNvbnRleHQpWzBdLmZpbGVzWzBdKTtcclxuICAgICAgICBmb3JtLmFwcGVuZChcImRlY2ltYWxcIiwgJChcIltkYXRhLWdvbS1zZXBhcmF0b3I9J2RlY2ltYWwnXVwiLCBjb250ZXh0KS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKSk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJjb2x1bW5cIiwgJChcIltkYXRhLWdvbS1zZXBhcmF0b3I9J2NvbHVtbiddXCIsIGNvbnRleHQpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuXHJcblxyXG4gICAgICAgIGdvbS5jbGV3LnVwbG9hZERhdGFzZXQoZm9ybSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGFibGUgPSAkKFwiI3RhYmxlLXZpZXdlclwiKS5EYXRhVGFibGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHJlc3BvbnNlLmRhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgY29sdW1uczogcmVzcG9uc2UuaGVhZGVycyxcclxuICAgICAgICAgICAgICAgICAgICBwYWdpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgaW5mbzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgb3JkZXJpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dG9XaWR0aDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vJChcInNlbGVjdFtkYXRhLWdvbS10eXBlXVwiKS5zZWxlY3RtZW51KCk7XHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5hdHRyKFwiZGF0YS1nb20tcm9sZVwiLCBcInRhcmdldFwiKTtcclxuICAgICAgICAgICAgICAgICQoXCJ0aFwiLCBcIiN0YWJsZS12aWV3ZXJcIikubGFzdCgpLmF0dHIoXCJkYXRhLWdvbS1pbmRleFwiLCAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5pbmRleCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLnJlbW92ZUF0dHIoXCJkYXRhLWdvbS1yb2xlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmV2SW5kZXggPSAkKFwidGhbZGF0YS1nb20taW5kZXhdXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInRoW2RhdGEtZ29tLWluZGV4XVwiLCBcIiN0YWJsZS12aWV3ZXJcIikucmVtb3ZlQXR0cihcImRhdGEtZ29tLWluZGV4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtZ29tLXJvbGVcIiwgXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0luZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtZ29tLWluZGV4XCIsICQodGhpcykuaW5kZXgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZJbmRleCAhPSBuZXdJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnb20uZmlsZU1hbmFnZXIudXBsb2FkRGF0YVJvbGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBuZXVyYWxOZXR3b3JrLnNldFBhcmFtZXRlcihcImZlYXR1cmVzXCIsIHJlc3BvbnNlLmhlYWRlcnMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobmV1cmFsTmV0d29yay5mZWF0dXJlcyk7XHJcbiAgICAgICAgICAgICAgICAkKFwiW2RhdGEtZ29tLXR5cGVdXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ29tLmZpbGVNYW5hZ2VyLnVwbG9hZERhdGFSb2xlcygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnb20uZmlsZU1hbmFnZXIudXBsb2FkRGF0YVJvbGVzKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHsgY29uc29sZS5sb2coXCJmYWlsXCIpOyB9KTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVwbG9hZERhdGFSb2xlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB0eXBlczogW10sXHJcbiAgICAgICAgICAgIHRhcmdldDogcGFyc2VJbnQoJChcInRoW2RhdGEtZ29tLWluZGV4XVwiKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIikpLFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdHlwZUNvdW50ID0gJChcIltkYXRhLWdvbS10eXBlXVwiKS5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBkYXRhLnR5cGVzLnB1c2goJChcIltkYXRhLWdvbS10eXBlPSdcIitpK1wiJ11cIikuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnb20uY2xldy51cGxvYWREYXRhUm9sZXMoZGF0YSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIm9sZExheWVyc1wiLCBuZXVyYWxOZXR3b3JrLmxheWVycyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzID0gbmV1cmFsTmV0d29yay5sYXllcnM7XHJcbiAgICAgICAgICAgICAgICBsYXllcnNbMF0gPSByZXNwb25zZS5pbnB1dHM7XHJcbiAgICAgICAgICAgICAgICBsYXllcnNbbGF5ZXJzLmxlbmd0aCAtIDFdID0gcmVzcG9uc2Uub3V0cHV0cztcclxuICAgICAgICAgICAgICAgIG5ldXJhbE5ldHdvcmsuc2V0Rml4ZWRMYXllcnMobGF5ZXJzKTtcclxuICAgICAgICAgICAgICAgIC8vJChcIiNudW1lcml6ZWQtdGFibGVcIikuRGF0YVRhYmxlKHtcclxuICAgICAgICAgICAgICAgIC8vICAgIGRhdGE6IHJlc3BvbnNlLnNhbXBsZSxcclxuICAgICAgICAgICAgICAgIC8vICAgIGNvbHVtbnM6IG5ldXJhbE5ldHdvcmsuZmVhdHVyZXMsXHJcbiAgICAgICAgICAgICAgICAvLyAgICBwYWdpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgc2VhcmNoaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vICAgIGluZm86IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgb3JkZXJpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLy99KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnNhbXBsZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHsgY29uc29sZS5sb2coXCJmYWlsXCIpOyB9KTtcclxuXHJcbiAgICB9LFxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5jbGV3ID0ge1xyXG4gICAgY2FsbDogZnVuY3Rpb24gKHR5cGUsIHVybCwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEgIT0gbnVsbCA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogXCJcIixcclxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgZmlsZUNhbGw6IGZ1bmN0aW9uICh0eXBlLCB1cmwsIGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICBwdWJsaXNoTW9kZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIlBPU1RcIiwgXCJcIik7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZFBhcmFtZXRlcnM6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9VcGxvYWRQYXJhbWV0ZXJzXCIsIGRhdGEpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWREYXRhc2V0OiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5maWxlQ2FsbChcIlBPU1RcIiwgXCIvQ3JlYXRlL1RyYWluaW5nU2V0XCIsIGRhdGEpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWREYXRhUm9sZXM6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9VcGRhdGVEYXRhUm9sZXNcIiwgZGF0YSk7XHJcbiAgICB9XHJcbn0iXX0=
