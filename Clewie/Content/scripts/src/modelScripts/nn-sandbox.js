var sandbox = (function () {

    var init = function (context) {
        //this.context = context;


        $(context).on("click", ".js-runSandbox", function () {
            run(context, {});
        });

        $(context).on("keyup change", ".js-layersSandbox", function () {
            parseLayers(context);
        });
    }

    var parseLayers = function (context) {
        var input = $(".js-layersSandbox", context).val();
        var parsed = input.split(",")
            .map(function (item) {
                return item.trim();
            })
            .filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "") });
        //split(",").filter(function (e) { return e.replace(/(\r\n|\n|\r)/gm, "").replace(" ", "") });
        console.log("parsed value", parsed);

    }




    var run = function (context, data) {
        console.log("running sandbox");
        gom.clew.runSandbox(data)
            .done(function (response) {
                //console.log(JSON.stringify(JSON.parse(response), null, 2));
                $(".json-result", context).html(JSON.stringify(response, null, 2));
            })
            .fail(function (response) {
                console.log("failed sandbox.run", response);
            });
    }

    return {
        init: init,
    }
})();