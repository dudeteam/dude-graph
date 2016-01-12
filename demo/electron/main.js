"use strict";
const _ = require("lodash");
const electron = require("electron");
const Project = require("./project");
const app = electron.app;
const IpcMain = electron.ipcMain;
const Dialog = electron.dialog;

(function () {

    var project = null;

    app.on("window-all-closed", function () {
        app.quit();
    });

    app.on("ready", function () {

        Dialog.showOpenDialog({"properties": ["openDirectory"]}, function (paths) {
            if (_.isUndefined(paths)) {
                throw new Error("No project path specified");
            }
            project = new Project(paths[0]);
            project.open();
        });
    });

    // Called when dude-graph is ready to load
    IpcMain.on("dude-graph-ready", function () {
        project.load();
    });

    // Called when saving the project
    IpcMain.on("dude-graph-loaded", function () {
        project.watch();
    });

    // Called when saving the project
    IpcMain.on("dude-graph-save", function (e, dudeGraphData) {
        project.save(dudeGraphData);
    });

    // Called when building the project
    IpcMain.on("dude-graph-build", function (e, dudeGraphData) {
        var projectFilePath = Dialog.showSaveDialog(project.window, {
            "title": "Save project",
            "filters": [
                {"name": "Dude-graph project", "extensions": ["zip"]}
            ]
        });
        if (!_.isUndefined(projectFilePath)) {
            project.build(projectFilePath, dudeGraphData);
        }
    });

})();