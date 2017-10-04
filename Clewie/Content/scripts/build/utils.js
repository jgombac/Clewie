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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIiwiZmlsZS1tYW5hZ2VyLmpzIiwiY2xldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6InV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5jcmVhdGUgPSB7XHJcblxyXG4gICAgbmFtZTogXCJcIixcclxuICAgIGlkOiBcIlwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiXCIsXHJcbiAgICBtb2RlbDogbnVsbCxcclxuXHJcbiAgICBpbml0OiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBnb20ucmFuZG9taXplci5nZXRTdHJpbmcoOCk7XHJcbiAgICAgICAgJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KS5odG1sKHRoaXMuaWQpO1xyXG5cclxuICAgICAgICAkKFwiI3B1Ymxpc2gtbW9kZWxcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWxpZCA9IGdvbS5jcmVhdGUucHJlcGFyZURhdGEoY29udGV4dCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHByZXBhcmVEYXRhOiBmdW5jdGlvbiAoY29udGV4dCkge1xyXG4gICAgICAgIHZhciBtb2RlbCA9IHtcclxuICAgICAgICAgICAgbmFtZTogJCgnW2RhdGEtZ29tLW1vZGVsPVwibmFtZVwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgICAgICBpZDogJCgnW2RhdGEtZ29tLW1vZGVsPVwiaWRcIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICQoJ1tkYXRhLWdvbS1tb2RlbD1cImRlc2NyaXB0aW9uXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBnb20uY3JlYXRlLnZhbGlkYXRlKG1vZGVsKTtcclxuICAgIH0sXHJcblxyXG4gICAgdmFsaWRhdGU6IGZ1bmN0aW9uIChtb2RlbCkge1xyXG4gICAgICAgIGZvciAodmFyIHByb3BlcnR5IGluIG1vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmIChtb2RlbC5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChtb2RlbFtwcm9wZXJ0eV0ubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9UT0RPIG90aGVyIHZhbGlkYXRpb25zLi4uXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9LFxyXG5cclxuICAgIHB1Ymxpc2g6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9XHJcblxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS50b3BiYXIgPSB7XHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICQoXCIubmF2YmFyLXRvZ2dsZVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICQoXCIuY29sbGFwc2VcIikudG9nZ2xlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG59IiwidmFyIGdvbSA9IGdvbSB8fCB7fTtcclxuXHJcbmdvbS5yYW5kb21pemVyID0ge1xyXG5cclxuICAgIGdldE51bWJlcjogZnVuY3Rpb24gKG1pbiwgbWF4KSB7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChsZW4pIHtcclxuICAgICAgICB2YXIgY2hhcmFjdGVycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODlcIjtcclxuICAgICAgICB2YXIgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzLmxlbmd0aCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfSxcclxufSIsIlxyXG5nb20uZmlsZU1hbmFnZXIgPSB7XHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YXNldDogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kKFwiZGF0YXNldFwiLCAkKFwiW2RhdGEtZ29tLWZpbGU9J2RhdGFzZXQnXVwiLCBjb250ZXh0KVswXS5maWxlc1swXSk7XHJcbiAgICAgICAgZm9ybS5hcHBlbmQoXCJkZWNpbWFsXCIsICQoXCJbZGF0YS1nb20tc2VwYXJhdG9yPSdkZWNpbWFsJ11cIiwgY29udGV4dCkuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kKFwiY29sdW1uXCIsICQoXCJbZGF0YS1nb20tc2VwYXJhdG9yPSdjb2x1bW4nXVwiLCBjb250ZXh0KS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKSk7XHJcblxyXG5cclxuICAgICAgICBnb20uY2xldy51cGxvYWREYXRhc2V0KGZvcm0pXHJcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgbmV1cmFsTmV0d29yay5zZXRQYXJhbWV0ZXIoXCJmZWF0dXJlc1wiLCByZXNwb25zZS5oZWFkZXJzKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLmhlYWRlcnMpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRhYmxlID0gJChcIiN0YWJsZS12aWV3ZXJcIikuRGF0YVRhYmxlKHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiByZXNwb25zZS5kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbHVtbnM6IHJlc3BvbnNlLmhlYWRlcnMsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFnaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGluZm86IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIG9yZGVyaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBhdXRvV2lkdGg6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5hdHRyKFwiZGF0YS1nb20tcm9sZVwiLCBcInRhcmdldFwiKTtcclxuICAgICAgICAgICAgICAgICQoXCJ0aFwiLCBcIiN0YWJsZS12aWV3ZXJcIikubGFzdCgpLmF0dHIoXCJkYXRhLWdvbS1pbmRleFwiLCAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5pbmRleCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLnJlbW92ZUF0dHIoXCJkYXRhLWdvbS1yb2xlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmV2SW5kZXggPSAkKFwidGhbZGF0YS1nb20taW5kZXhdXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInRoW2RhdGEtZ29tLWluZGV4XVwiLCBcIiN0YWJsZS12aWV3ZXJcIikucmVtb3ZlQXR0cihcImRhdGEtZ29tLWluZGV4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtZ29tLXJvbGVcIiwgXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0luZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtZ29tLWluZGV4XCIsICQodGhpcykuaW5kZXgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZJbmRleCAhPSBuZXdJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnb20uZmlsZU1hbmFnZXIudXBsb2FkRGF0YVJvbGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICQoXCJbZGF0YS1nb20tdHlwZV1cIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBnb20uZmlsZU1hbmFnZXIudXBsb2FkRGF0YVJvbGVzKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGdvbS5maWxlTWFuYWdlci51cGxvYWREYXRhUm9sZXMoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKCkgeyBjb25zb2xlLmxvZyhcImZhaWxcIik7IH0pO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgdXBsb2FkRGF0YVJvbGVzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGRhdGEgPSB7XHJcbiAgICAgICAgICAgIHR5cGVzOiBbXSxcclxuICAgICAgICAgICAgdGFyZ2V0OiBwYXJzZUludCgkKFwidGhbZGF0YS1nb20taW5kZXhdXCIpLmF0dHIoXCJkYXRhLWdvbS1pbmRleFwiKSksXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciB0eXBlQ291bnQgPSAkKFwiW2RhdGEtZ29tLXR5cGVdXCIpLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRhdGEudHlwZXMucHVzaCgkKFwiW2RhdGEtZ29tLXR5cGU9J1wiK2krXCInXVwiKS5maW5kKFwiOnNlbGVjdGVkXCIpLnRleHQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdvbS5jbGV3LnVwbG9hZERhdGFSb2xlcyhkYXRhKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsYXllcnMgPSBuZXVyYWxOZXR3b3JrLmxheWVycztcclxuICAgICAgICAgICAgICAgIGxheWVyc1swXSA9IHJlc3BvbnNlLmlucHV0cztcclxuICAgICAgICAgICAgICAgIGxheWVyc1tsYXllcnMubGVuZ3RoIC0gMV0gPSByZXNwb25zZS5vdXRwdXRzO1xyXG4gICAgICAgICAgICAgICAgbmV1cmFsTmV0d29yay5zZXRGaXhlZExheWVycyhsYXllcnMpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc2FtcGxlKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24gKCkgeyBjb25zb2xlLmxvZyhcImZhaWxcIik7IH0pO1xyXG5cclxuICAgIH0sXHJcbn0iLCJ2YXIgZ29tID0gZ29tIHx8IHt9O1xyXG5cclxuZ29tLmNsZXcgPSB7XHJcbiAgICBjYWxsOiBmdW5jdGlvbiAodHlwZSwgdXJsLCBkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgZGF0YTogZGF0YSAhPSBudWxsID8gSlNPTi5zdHJpbmdpZnkoZGF0YSkgOiBcIlwiLFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaWxlQ2FsbDogZnVuY3Rpb24gKHR5cGUsIHVybCwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiAkLmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxyXG4gICAgICAgICAgICB1cmw6IHVybCxcclxuICAgICAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcclxuICAgICAgICAgICAgYXN5bmM6IHRydWUsXHJcbiAgICAgICAgICAgIGNhY2hlOiBmYWxzZSxcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIHB1Ymxpc2hNb2RlbDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIlwiKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkUGFyYW1ldGVyczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIlBPU1RcIiwgXCIvQ3JlYXRlL1VwbG9hZFBhcmFtZXRlcnNcIiwgZGF0YSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZERhdGFzZXQ6IGZ1bmN0aW9uIChkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmZpbGVDYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVHJhaW5pbmdTZXRcIiwgZGF0YSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZERhdGFSb2xlczogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIlBPU1RcIiwgXCIvQ3JlYXRlL1VwZGF0ZURhdGFSb2xlc1wiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgcnVuU2FuZGJveDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuY2FsbChcIlBPU1RcIiwgXCIvQ3JlYXRlL1Rlc3RQcmVkaWN0aW9uXCIsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgXHJcbn0iXX0=
