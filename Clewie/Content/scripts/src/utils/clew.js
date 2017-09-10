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