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
                neuralNetwork.setParameter("features", response.headers);
                console.log(response.headers);
                var table = $("#table-viewer").DataTable({
                    data: response.data,
                    columns: response.headers,
                    paging: false,
                    searching: false,
                    info: false,
                    ordering: false,
                    autoWidth: false,
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
                var layers = neuralNetwork.layers;
                layers[0] = response.inputs;
                layers[layers.length - 1] = response.outputs;
                neuralNetwork.setFixedLayers(layers);
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

    generateID: function () {
        return gom.clew.call("GET", "/Create/GenerateID");
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

    pretrain: function (data) {
        return gom.clew.call("POST", "/Create/Pretrain", data);
    },

    runSandbox: function (data) {
        return gom.clew.call("POST", "/Create/TestPrediction", data);
    },

    publishModel: function (data) {
        return gom.clew.call("POST", "/Create/Publish", data);
    },
    
}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIiwiZmlsZS1tYW5hZ2VyLmpzIiwiY2xldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLmNyZWF0ZSA9IHtcclxuXHJcbiAgICBuYW1lOiBcIlwiLFxyXG4gICAgaWQ6IFwiXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJcIixcclxuICAgIG1vZGVsOiBudWxsLFxyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgZ29tLmNsZXcuZ2VuZXJhdGVJRCgpXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChpZCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWQpO1xyXG4gICAgICAgICAgICAgICAgJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KS5odG1sKGlkKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpZCBmYWlsXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJChcIiNwdWJsaXNoLW1vZGVsXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSBnb20uY3JlYXRlLnByZXBhcmVEYXRhKGNvbnRleHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBwcmVwYXJlRGF0YTogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICQoJ1tkYXRhLWdvbS1tb2RlbD1cIm5hbWVcIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICAgICAgaWQ6ICQoJ1tkYXRhLWdvbS1tb2RlbD1cImlkXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJkZXNjcmlwdGlvblwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ29tLmNyZWF0ZS52YWxpZGF0ZShtb2RlbCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBtb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAobW9kZWwuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobW9kZWxbcHJvcGVydHldLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vVE9ETyBvdGhlciB2YWxpZGF0aW9ucy4uLlxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwdWJsaXNoOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfVxyXG5cclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20udG9wYmFyID0ge1xyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiLm5hdmJhci10b2dnbGVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKFwiLmNvbGxhcHNlXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20ucmFuZG9taXplciA9IHtcclxuXHJcbiAgICBnZXROdW1iZXI6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAobGVuKSB7XHJcbiAgICAgICAgdmFyIGNoYXJhY3RlcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbn0iLCJcclxuZ29tLmZpbGVNYW5hZ2VyID0ge1xyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZERhdGFzZXQ6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3JtLmFwcGVuZChcImRhdGFzZXRcIiwgJChcIltkYXRhLWdvbS1maWxlPSdkYXRhc2V0J11cIiwgY29udGV4dClbMF0uZmlsZXNbMF0pO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kKFwiZGVjaW1hbFwiLCAkKFwiW2RhdGEtZ29tLXNlcGFyYXRvcj0nZGVjaW1hbCddXCIsIGNvbnRleHQpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuICAgICAgICBmb3JtLmFwcGVuZChcImNvbHVtblwiLCAkKFwiW2RhdGEtZ29tLXNlcGFyYXRvcj0nY29sdW1uJ11cIiwgY29udGV4dCkuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG5cclxuXHJcbiAgICAgICAgZ29tLmNsZXcudXBsb2FkRGF0YXNldChmb3JtKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIG5ldXJhbE5ldHdvcmsuc2V0UGFyYW1ldGVyKFwiZmVhdHVyZXNcIiwgcmVzcG9uc2UuaGVhZGVycyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5oZWFkZXJzKTtcclxuICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9ICQoXCIjdGFibGUtdmlld2VyXCIpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVzcG9uc2UuZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiByZXNwb25zZS5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2luZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpbmZvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBvcmRlcmluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b1dpZHRoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5sYXN0KCkuYXR0cihcImRhdGEtZ29tLXJvbGVcIiwgXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIiwgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5sYXN0KCkuaW5kZXgoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInRoXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5yZW1vdmVBdHRyKFwiZGF0YS1nb20tcm9sZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJldkluZGV4ID0gJChcInRoW2RhdGEtZ29tLWluZGV4XVwiLCBcIiN0YWJsZS12aWV3ZXJcIikuYXR0cihcImRhdGEtZ29tLWluZGV4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQoXCJ0aFtkYXRhLWdvbS1pbmRleF1cIiwgXCIjdGFibGUtdmlld2VyXCIpLnJlbW92ZUF0dHIoXCJkYXRhLWdvbS1pbmRleFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWdvbS1yb2xlXCIsIFwidGFyZ2V0XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdJbmRleCA9ICQodGhpcykuaW5kZXgoKTtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmF0dHIoXCJkYXRhLWdvbS1pbmRleFwiLCAkKHRoaXMpLmluZGV4KCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcmV2SW5kZXggIT0gbmV3SW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ29tLmZpbGVNYW5hZ2VyLnVwbG9hZERhdGFSb2xlcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkKFwiW2RhdGEtZ29tLXR5cGVdXCIpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ29tLmZpbGVNYW5hZ2VyLnVwbG9hZERhdGFSb2xlcygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBnb20uZmlsZU1hbmFnZXIudXBsb2FkRGF0YVJvbGVzKCk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHsgY29uc29sZS5sb2coXCJmYWlsXCIpOyB9KTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHVwbG9hZERhdGFSb2xlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB0eXBlczogW10sXHJcbiAgICAgICAgICAgIHRhcmdldDogcGFyc2VJbnQoJChcInRoW2RhdGEtZ29tLWluZGV4XVwiKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIikpLFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdHlwZUNvdW50ID0gJChcIltkYXRhLWdvbS10eXBlXVwiKS5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBkYXRhLnR5cGVzLnB1c2goJChcIltkYXRhLWdvbS10eXBlPSdcIitpK1wiJ11cIikuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnb20uY2xldy51cGxvYWREYXRhUm9sZXMoZGF0YSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGF5ZXJzID0gbmV1cmFsTmV0d29yay5sYXllcnM7XHJcbiAgICAgICAgICAgICAgICBsYXllcnNbMF0gPSByZXNwb25zZS5pbnB1dHM7XHJcbiAgICAgICAgICAgICAgICBsYXllcnNbbGF5ZXJzLmxlbmd0aCAtIDFdID0gcmVzcG9uc2Uub3V0cHV0cztcclxuICAgICAgICAgICAgICAgIG5ldXJhbE5ldHdvcmsuc2V0Rml4ZWRMYXllcnMobGF5ZXJzKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnNhbXBsZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHsgY29uc29sZS5sb2coXCJmYWlsXCIpOyB9KTtcclxuXHJcbiAgICB9LFxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5jbGV3ID0ge1xyXG4gICAgY2FsbDogZnVuY3Rpb24gKHR5cGUsIHVybCwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEgIT0gbnVsbCA/IEpTT04uc3RyaW5naWZ5KGRhdGEpIDogXCJcIixcclxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG4gICAgZmlsZUNhbGw6IGZ1bmN0aW9uICh0eXBlLCB1cmwsIGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGdlbmVyYXRlSUQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIkdFVFwiLCBcIi9DcmVhdGUvR2VuZXJhdGVJRFwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkUGFyYW1ldGVyczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIlBPU1RcIiwgXCIvQ3JlYXRlL1VwbG9hZFBhcmFtZXRlcnNcIiwgZGF0YSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZERhdGFzZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmZpbGVDYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVHJhaW5pbmdTZXRcIiwgZGF0YSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZERhdGFSb2xlczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIlBPU1RcIiwgXCIvQ3JlYXRlL1VwZGF0ZURhdGFSb2xlc1wiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgcHJldHJhaW46IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9QcmV0cmFpblwiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgcnVuU2FuZGJveDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIlBPU1RcIiwgXCIvQ3JlYXRlL1Rlc3RQcmVkaWN0aW9uXCIsIGRhdGEpO1xyXG4gICAgfSxcclxuXHJcbiAgICBwdWJsaXNoTW9kZWw6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9QdWJsaXNoXCIsIGRhdGEpO1xyXG4gICAgfSxcclxuICAgIFxyXG59Il19
