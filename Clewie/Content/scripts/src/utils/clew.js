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