const FS = require("fs");
const Path = require("path");
const JsonFile = require("jsonfile");
const Archiver = require("archiver");
const BrowserWindow = require("browser-window");
const Watch = require("watch");
const _ = require("lodash");

(function () {

    /**
     * Dude-Graph project
     * @param{String}  projectPath
     * @class
     */
    var Project = function (projectPath) {
        /**
         * The project path on filesystem
         * @type {String}
         * @private
         */
        this._projectPath = projectPath;

        /**
         * The project file fd
         * @type {Number}
         * @private
         */
        this._projectFilePath = Path.join(projectPath, "project.json");

        /**
         * The resources of the project.
         * @type {Array<{item: Object}>}
         */
        Object.defineProperty(this, "resources", {
            get: function () {
                var resources = [];
                var files = FS.readdirSync(this._projectPath);
                if (!files) {
                    return;
                }
                var path = this._projectPath;
                var computeFile = function (filename) {
                    var stat = FS.lstatSync(Path.join(path, filename));
                    if (stat.isDirectory() && filename[0] !== ".") {
                        var oldPath = path;
                        path = Path.join(path, filename);
                        var subFiles = FS.readdirSync(path);
                        subFiles.forEach(computeFile);
                        path = oldPath;
                        return;
                    }
                    switch (Path.extname(filename)) {
                        case ".ogg":
                        case ".png":
                            resources.push(this._generateResource(Path.join(path, filename)));
                            break;
                    }
                }.bind(this);
                files.forEach(computeFile);
                return resources;
            }.bind(this)
        });

        /**
         * The project window
         * @type {BrowserWindow}
         * @private
         */
        this._window = null;
        Object.defineProperty(this, "window", {
            get: function () {
                return this._window;
            }.bind(this)
        });
    };

    /**
     * Opens the project
     */
    Project.prototype.open = function () {
        var project = this;
        // Creates the project.json file
        FS.open(this._projectFilePath, "a+", function (err, fd) {
            if (err !== null) {
                throw new Error(err);
            }
            FS.close(fd);
            project._createWindow();
        });
    };

    /**
     * Loads the project
     */
    Project.prototype.load = function () {
        var project = this;
        JsonFile.readFile(this._projectFilePath, "utf8", function (err, dudeGraphData) {
            dudeGraphData = dudeGraphData || {};
            project._window.send("dude-graph-load", {
                "graphData": dudeGraphData.graphData || {},
                "rendererData": dudeGraphData.rendererData || {},
                "resources": project.resources || []
            });
        });
    };

    /**
     * Watches the project resources
     */
    Project.prototype.watch = function () {
        var filterFunction = function (file) {
            if (file === this.coversPath || file === this.soundsPath) {
                return true;
            }
            switch (Path.extname(file)) {
                case ".png":
                case ".ogg":
                    return true;
                default:
                    return false;
            }
        }.bind(this);
        Watch.watchTree(this._projectPath, {"filter": filterFunction}, function (f, curr, prev) {
            if (typeof f == "object" && prev === null && curr === null) {
                // Finished walking the tree
            } else if (prev === null) {
                if (this._window) {
                    this._window.send("dude-graph-resource-added", this._generateResource(f));
                }
            } else if (curr.nlink === 0) {
                if (this._window) {
                    this._window.send("dude-graph-resource-removed", this._generateResource(f));
                }
            }
        }.bind(this));
    };

    /**
     * Saves the project
     */
    Project.prototype.save = function (dudeGraphData) {
        JsonFile.writeFile(this._projectFilePath, dudeGraphData, function (err) {
            if (err !== null) {
                throw new Error(err);
            }
        });
    };

    Project.prototype.build = function (path, build) {
        var project = this;
        var output = FS.createWriteStream(path);
        var archive = Archiver.create("zip", {});
        archive.pipe(output);
        _.forEach(this.resources, function (resource) {
            archive.append(FS.createReadStream(Path.join(project._projectPath, resource.item.name)), {"name": resource.item.name});
        });
        archive.append(JSON.stringify(build), {"name": "dude-graph.json"});
        archive.finalize();
    };

    /**
     * Creates the project window
     * @private
     */
    Project.prototype._createWindow = function () {
        var project = this;
        this._window = new BrowserWindow({
            "width": 1280,
            "height": 720
        });
        this._window.on("closed", function () {
            project._window = null;
        });
        this._window.loadURL("file://" + __dirname + "/index.html");
        return this._window;
    };

    /**
     * Generate a resource from the given fileName.
     * @param absoluteFileName
     * @private
     */
    Project.prototype._generateResource = function (absoluteFileName) {
        var resource = {
            "item": {
                "file_name": absoluteFileName,
                "name": Path.basename(absoluteFileName)
            }
        };
        switch (Path.extname(absoluteFileName)) {
            case ".ogg":
                resource.item.type = "audio";
                break;
            case ".png":
                resource.item.type = "image";
                break;
            default:
                throw new Error("Unknown resource type");
        }
        return resource;
    };


    module.exports = Project;

})();