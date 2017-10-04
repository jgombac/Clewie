
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