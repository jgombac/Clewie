module.exports = () => {

    const path_general = "./Content";
    const path_build_scripts = path_general + "/scripts/build/";
    const path_source_scripts = path_general + "/scripts/src/";

    const config = {
        "styles": {
            "build": path_general + "/styles/build/",
            "source": path_general + "/styles/src/*-clewie.scss",
            "sourcefolder": path_general + "/styles/src/",
        },

        "images": path_general + "/assets/images/",

        "browsersupport": ["IE >= 10", "last 3 versions", "iOS >= 8"],

        "scriptsbuild": path_build_scripts,
        "scriptssource": [
            path_source_scripts + "**/*.js",
        ],

        "scripts": [
            {
                "build": "create-model.js",
                "source": [
                    path_source_scripts + "modelScripts/neural-network.js",
                    path_source_scripts + "modelScripts/nn-visuals.js",
                ]
            },

            {
                "build": "utils.js",
                "source": [
                    path_source_scripts + "utils/api-helper.js",
                    path_source_scripts + "utils/topbar.js",
                    path_source_scripts + "utils/randomizer.js",
                    path_source_scripts + "utils/file-manager.js",
                    path_source_scripts + "utils/clew.js",
                ]
            },

            {
                "build": "library.js",
                "source": [
                    path_source_scripts + "plugins/modal.js",
                    path_source_scripts + "plugins/jsrender.js",
                    path_source_scripts + "plugins/datatables.js",
                    path_source_scripts + "plugins/jquery-ui.min.js",
                    path_source_scripts + "plugins/d3.min.js",
                    path_source_scripts + "plugins/d3-button.js",  
                    //path_source_scripts + "plugin/jquery-ui.min.js",
                    
                ]
            },

            {
                "build": "init.js",
                "source": [
                    path_source_scripts + "init.js",
                ]
            },
        ]
    }
    return config;
}