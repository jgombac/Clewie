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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS1oZWxwZXIuanMiLCJ0b3BiYXIuanMiLCJyYW5kb21pemVyLmpzIiwiZmlsZS1tYW5hZ2VyLmpzIiwiY2xldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJ1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20uY3JlYXRlID0ge1xyXG5cclxuICAgIG5hbWU6IFwiXCIsXHJcbiAgICBpZDogXCJcIixcclxuICAgIGRlc2NyaXB0aW9uOiBcIlwiLFxyXG4gICAgbW9kZWw6IG51bGwsXHJcblxyXG4gICAgaW5pdDogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmlkID0gZ29tLnJhbmRvbWl6ZXIuZ2V0U3RyaW5nKDgpO1xyXG4gICAgICAgICQoJ1tkYXRhLWdvbS1tb2RlbD1cImlkXCJdJywgY29udGV4dCkuaHRtbCh0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgJChcIiNwdWJsaXNoLW1vZGVsXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsaWQgPSBnb20uY3JlYXRlLnByZXBhcmVEYXRhKGNvbnRleHQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBwcmVwYXJlRGF0YTogZnVuY3Rpb24gKGNvbnRleHQpIHtcclxuICAgICAgICB2YXIgbW9kZWwgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICQoJ1tkYXRhLWdvbS1tb2RlbD1cIm5hbWVcIl0nLCBjb250ZXh0KS52YWwoKSxcclxuICAgICAgICAgICAgaWQ6ICQoJ1tkYXRhLWdvbS1tb2RlbD1cImlkXCJdJywgY29udGV4dCkudmFsKCksXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAkKCdbZGF0YS1nb20tbW9kZWw9XCJkZXNjcmlwdGlvblwiXScsIGNvbnRleHQpLnZhbCgpLFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZ29tLmNyZWF0ZS52YWxpZGF0ZShtb2RlbCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHZhbGlkYXRlOiBmdW5jdGlvbiAobW9kZWwpIHtcclxuICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBtb2RlbCkge1xyXG4gICAgICAgICAgICBpZiAobW9kZWwuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobW9kZWxbcHJvcGVydHldLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vVE9ETyBvdGhlciB2YWxpZGF0aW9ucy4uLlxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSxcclxuXHJcbiAgICBwdWJsaXNoOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfVxyXG5cclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20udG9wYmFyID0ge1xyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKFwiLm5hdmJhci10b2dnbGVcIikuY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkKFwiLmNvbGxhcHNlXCIpLnRvZ2dsZUNsYXNzKFwiYWN0aXZlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20ucmFuZG9taXplciA9IHtcclxuXHJcbiAgICBnZXROdW1iZXI6IGZ1bmN0aW9uIChtaW4sIG1heCkge1xyXG5cclxuICAgIH0sXHJcblxyXG4gICAgZ2V0U3RyaW5nOiBmdW5jdGlvbiAobGVuKSB7XHJcbiAgICAgICAgdmFyIGNoYXJhY3RlcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgKz0gY2hhcmFjdGVycy5jaGFyQXQoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcmFjdGVycy5sZW5ndGgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH0sXHJcbn0iLCJcclxuZ29tLmZpbGVNYW5hZ2VyID0ge1xyXG5cclxuICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZERhdGFzZXQ6IGZ1bmN0aW9uIChjb250ZXh0KSB7XHJcbiAgICAgICAgdmFyIGZvcm0gPSBuZXcgRm9ybURhdGEoKTtcclxuICAgICAgICBmb3JtLmFwcGVuZChcImRhdGFzZXRcIiwgJChcIltkYXRhLWdvbS1maWxlPSdkYXRhc2V0J11cIiwgY29udGV4dClbMF0uZmlsZXNbMF0pO1xyXG4gICAgICAgIGZvcm0uYXBwZW5kKFwiZGVjaW1hbFwiLCAkKFwiW2RhdGEtZ29tLXNlcGFyYXRvcj0nZGVjaW1hbCddXCIsIGNvbnRleHQpLmZpbmQoXCI6c2VsZWN0ZWRcIikudGV4dCgpKTtcclxuICAgICAgICBmb3JtLmFwcGVuZChcImNvbHVtblwiLCAkKFwiW2RhdGEtZ29tLXNlcGFyYXRvcj0nY29sdW1uJ11cIiwgY29udGV4dCkuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG5cclxuXHJcbiAgICAgICAgZ29tLmNsZXcudXBsb2FkRGF0YXNldChmb3JtKVxyXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0YWJsZSA9ICQoXCIjdGFibGUtdmlld2VyXCIpLkRhdGFUYWJsZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVzcG9uc2UuZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBjb2x1bW5zOiByZXNwb25zZS5oZWFkZXJzLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2luZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoaW5nOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBpbmZvOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBvcmRlcmluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5hdHRyKFwiZGF0YS1nb20tcm9sZVwiLCBcInRhcmdldFwiKTtcclxuICAgICAgICAgICAgICAgICQoXCJ0aFwiLCBcIiN0YWJsZS12aWV3ZXJcIikubGFzdCgpLmF0dHIoXCJkYXRhLWdvbS1pbmRleFwiLCAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmxhc3QoKS5pbmRleCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAkKFwidGhcIiwgXCIjdGFibGUtdmlld2VyXCIpLnJlbW92ZUF0dHIoXCJkYXRhLWdvbS1yb2xlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmV2SW5kZXggPSAkKFwidGhbZGF0YS1nb20taW5kZXhdXCIsIFwiI3RhYmxlLXZpZXdlclwiKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcInRoW2RhdGEtZ29tLWluZGV4XVwiLCBcIiN0YWJsZS12aWV3ZXJcIikucmVtb3ZlQXR0cihcImRhdGEtZ29tLWluZGV4XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtZ29tLXJvbGVcIiwgXCJ0YXJnZXRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0luZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYXR0cihcImRhdGEtZ29tLWluZGV4XCIsICQodGhpcykuaW5kZXgoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByZXZJbmRleCAhPSBuZXdJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnb20uZmlsZU1hbmFnZXIudXBsb2FkRGF0YVJvbGVzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJChcIltkYXRhLWdvbS10eXBlXVwiKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdvbS5maWxlTWFuYWdlci51cGxvYWREYXRhUm9sZXMoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgZ29tLmZpbGVNYW5hZ2VyLnVwbG9hZERhdGFSb2xlcygpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbiAoKSB7IGNvbnNvbGUubG9nKFwiZmFpbFwiKTsgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHVwbG9hZERhdGFSb2xlczogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0ge1xyXG4gICAgICAgICAgICB0eXBlczogW10sXHJcbiAgICAgICAgICAgIHRhcmdldDogcGFyc2VJbnQoJChcInRoW2RhdGEtZ29tLWluZGV4XVwiKS5hdHRyKFwiZGF0YS1nb20taW5kZXhcIikpLFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdHlwZUNvdW50ID0gJChcIltkYXRhLWdvbS10eXBlXVwiKS5sZW5ndGg7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlQ291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBkYXRhLnR5cGVzLnB1c2goJChcIltkYXRhLWdvbS10eXBlPSdcIitpK1wiJ11cIikuZmluZChcIjpzZWxlY3RlZFwiKS50ZXh0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnb20uY2xldy51cGxvYWREYXRhUm9sZXMoZGF0YSlcclxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uICgpIHsgY29uc29sZS5sb2coXCJmYWlsXCIpOyB9KVxyXG4gICAgfSxcclxufSIsInZhciBnb20gPSBnb20gfHwge307XHJcblxyXG5nb20uY2xldyA9IHtcclxuICAgIGNhbGw6IGZ1bmN0aW9uICh0eXBlLCB1cmwsIGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gJC5hamF4KHtcclxuICAgICAgICAgICAgdHlwZTogdHlwZSxcclxuICAgICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhICE9IG51bGwgPyBKU09OLnN0cmluZ2lmeShkYXRhKSA6IFwiXCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiB0cnVlLFxyXG4gICAgICAgICAgICBjYWNoZTogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIGZpbGVDYWxsOiBmdW5jdGlvbiAodHlwZSwgdXJsLCBkYXRhKSB7XHJcbiAgICAgICAgcmV0dXJuICQuYWpheCh7XHJcbiAgICAgICAgICAgIHR5cGU6IHR5cGUsXHJcbiAgICAgICAgICAgIHVybDogdXJsLFxyXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICBjb250ZW50VHlwZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxyXG4gICAgICAgICAgICBhc3luYzogdHJ1ZSxcclxuICAgICAgICAgICAgY2FjaGU6IGZhbHNlLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcblxyXG4gICAgcHVibGlzaE1vZGVsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIGdvbS5jbGV3LmNhbGwoXCJQT1NUXCIsIFwiXCIpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGxvYWRQYXJhbWV0ZXJzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVXBsb2FkUGFyYW1ldGVyc1wiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YXNldDogZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICByZXR1cm4gZ29tLmNsZXcuZmlsZUNhbGwoXCJQT1NUXCIsIFwiL0NyZWF0ZS9UcmFpbmluZ1NldFwiLCBkYXRhKTtcclxuICAgIH0sXHJcblxyXG4gICAgdXBsb2FkRGF0YVJvbGVzOiBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiBnb20uY2xldy5jYWxsKFwiUE9TVFwiLCBcIi9DcmVhdGUvVXBkYXRlRGF0YVJvbGVzXCIsIGRhdGEpO1xyXG4gICAgfVxyXG59Il19
