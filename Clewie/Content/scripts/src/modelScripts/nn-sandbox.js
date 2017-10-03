var sandbox = (function () {

    var init = function (context) {
        //this.context = context;

        $(context).on("click", ".js-runSandbox", function () {
            run(context, {});
        });
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