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
    },

    runSandbox: function (data) {
        return gom.clew.call("POST", "/Create/TestPrediction", data);
    }
    
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIiwiZmlsZS1tYW5hZ2VyLmpzIiwiY2xldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5jcmVhdGUgPSB7XHJcblxyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGlkOiBcIlwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXCIsXHJcbiAgICBtb2RlbDogbnVsbCxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBnb20ucmFuZG9taXplci5nZXRTdHJpbmcoOCk7XHJcbiAgICAgICAgJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KS5odG1sKHRoaXMuaWQpO1xyXG5cclxuICAgICAgICAkKFwiI3B1Ymxpc2gtbW9kZWxcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZCA9IGdvbS5jcmVhdGUucHJlcGFyZURhdGEoY29udGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXBhcmVEYXRhOiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBtb2RlbCA9IHtcclxuICAgICAgICAgICAgbmFtZTogJCgnW2RhdGEtZ29tLW1vZGVsPVwibmFtZVwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgICAgICBpZDogJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICQoJ1tkYXRhLWdvbS1tb2RlbD1cImRlc2NyaXB0aW9uXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBnb20uY3JlYXRlLnZhbGlkYXRlKG1vZGVsKTtcclxuICAgIH0sXHJcblxyXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIG1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChtb2RlbC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtb2RlbFtwcm9wZXJ0eV0ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9UT0RPIG90aGVyIHZhbGlkYXRpb25zLi4uXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIHB1Ymxpc2g6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9XHJcblxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS50b3BiYXIgPSB7XHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIubmF2YmFyLXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoXCIuY29sbGFwc2VcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5yYW5kb21pemVyID0ge1xyXG5cclxuICAgIGdldE51bWJlcjogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChsZW4pIHtcclxuICAgICAgICB2YXIgY2hhcmFjdGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODlcIjtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzLmxlbmd0aCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxufSIsIlxyXG5nb20uZmlsZU1hbmFnZXIgPSB7XHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YXNldDogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kKFwiZGF0YXNldFwiLCAkKFwiW2RhdGEtZ29tLWZpbGU9J2RhdGFzZXQnXVwiLCBjb250ZXh0KVswXS5maWxlc1swXSk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJkZWNpbWFsXCIsICQoXCJbZGF0YS1nb20tc2VwYXJhdG9yPSdkZWNpbWFsJ11cIiwgY29udGV4dCkuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kKFwiY29sdW1uXCIsICQoXCJbZGF0YS1nb20tc2VwYXJhdG9yPSdjb2x1bW4nXVwiLCBjb250ZXh0KS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKSk7XHJcblxyXG5cclxuICAgICAgICBnb20uY2xldy51cGxvYWREYXRhc2V0KGZvcm0pXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gJChcIiN0YWJsZS12aWV3ZXJcIikuRGF0YVRhYmxlKHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXNwb25zZS5kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IHJlc3BvbnNlLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFnaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZm86IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyQoXCJzZWxlY3RbZGF0YS1nb20tdHlwZV1cIikuc2VsZWN0bWVudSgpO1xyXG4gICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5sYXN0KCkuYXR0cihcImRhdGEtZ29tLXJvbGVcIiwgXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIiwgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5sYXN0KCkuaW5kZXgoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5yZW1vdmVBdHRyKFwiZGF0YS1nb20tcm9sZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldkluZGV4ID0gJChcInRoW2RhdGEtZ29tLWluZGV4XVwiLCBcIiN0YWJsZS12aWV3ZXJcIikuYXR0cihcImRhdGEtZ29tLWluZGV4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJ0aFtkYXRhLWdvbS1pbmRleF1cIiwgXCIjdGFibGUtdmlld2VyXCIpLnJlbW92ZUF0dHIoXCJkYXRhLWdvbS1pbmRleFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWdvbS1yb2xlXCIsIFwidGFyZ2V0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbmRleCA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWdvbS1pbmRleFwiLCAkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2SW5kZXggIT0gbmV3SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ29tLmZpbGVNYW5hZ2VyLnVwbG9hZERhdGFSb2xlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgbmV1cmFsTmV0d29yay5zZXRQYXJhbWV0ZXIoXCJmZWF0dXJlc1wiLCByZXNwb25zZS5oZWFkZXJzKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5ldXJhbE5ldHdvcmsuZmVhdHVyZXMpO1xyXG4gICAgICAgICAgICAgICAgJChcIltkYXRhLWdvbS10eXBlXVwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdvbS5maWxlTWFuYWdlci51cGxvYWREYXRhUm9sZXMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZ29tLmZpbGVNYW5hZ2VyLnVwbG9hZERhdGFSb2xlcygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoKSB7IGNvbnNvbGUubG9nKFwiZmFpbFwiKTsgfSk7XHJcbiAgICB9LFxyXG5cclxuXHJcbiAgICB1cGxvYWREYXRhUm9sZXM6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgZGF0YSA9IHtcclxuICAgICAgICAgICAgdHlwZXM6IFtdLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IHBhcnNlSW50KCQoXCJ0aFtkYXRhLWdvbS1pbmRleF1cIikuYXR0cihcImRhdGEtZ29tLWluZGV4XCIpKSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHR5cGVDb3VudCA9ICQoXCJbZGF0YS1nb20tdHlwZV1cIikubGVuZ3RoO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZUNvdW50OyBpKyspIHtcclxuICAgICAgICAgICAgZGF0YS50eXBlcy5wdXNoKCQoXCJbZGF0YS1nb20tdHlwZT0nXCIraStcIiddXCIpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ29tLmNsZXcudXBsb2FkRGF0YVJvbGVzKGRhdGEpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJvbGRMYXllcnNcIiwgbmV1cmFsTmV0d29yay5sYXllcnMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxheWVycyA9IG5ldXJhbE5ldHdvcmsubGF5ZXJzO1xyXG4gICAgICAgICAgICAgICAgbGF5ZXJzWzBdID0gcmVzcG9uc2UuaW5wdXRzO1xyXG4gICAgICAgICAgICAgICAgbGF5ZXJzW2xheWVycy5sZW5ndGggLSAxXSA9IHJlc3BvbnNlLm91dHB1dHM7XHJcbiAgICAgICAgICAgICAgICBuZXVyYWxOZXR3b3JrLnNldEZpeGVkTGF5ZXJzKGxheWVycyk7XHJcbiAgICAgICAgICAgICAgICAvLyQoXCIjbnVtZXJpemVkLXRhYmxlXCIpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICAgICAvLyAgICBkYXRhOiByZXNwb25zZS5zYW1wbGUsXHJcbiAgICAgICAgICAgICAgICAvLyAgICBjb2x1bW5zOiBuZXVyYWxOZXR3b3JrLmZlYXR1cmVzLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgcGFnaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vICAgIHNlYXJjaGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAvLyAgICBpbmZvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vICAgIG9yZGVyaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIC8vfSk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zYW1wbGUpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoKSB7IGNvbnNvbGUubG9nKFwiZmFpbFwiKTsgfSk7XHJcblxyXG4gICAgfSxcclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20uY2xldyA9IHtcclxuICAgIGNhbGw6IGZ1bmN0aW9uICh0eXBlLCB1cmwsIGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhICE9IG51bGwgPyBKU09OLnN0cmluZ2lmeShkYXRhKSA6IFwiXCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbGVDYWxsOiBmdW5jdGlvbiAodHlwZSwgdXJsLCBkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgcHVibGlzaE1vZGVsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmNhbGwoXCJQT1NUXCIsIFwiXCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWRQYXJhbWV0ZXJzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVXBsb2FkUGFyYW1ldGVyc1wiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YXNldDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuZmlsZUNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9UcmFpbmluZ1NldFwiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YVJvbGVzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVXBkYXRlRGF0YVJvbGVzXCIsIGRhdGEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBydW5TYW5kYm94OiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVGVzdFByZWRpY3Rpb25cIiwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBcclxufSJdfQ==
