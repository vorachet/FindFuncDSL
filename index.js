const chokidar = require("chokidar");
const exec = require("child_process").exec;
const liveServer = require("live-server");

var params = {
  port: 9080,
  host: "0.0.0.0",
  root: "./src-gen",
  open: true,
  wait: 1000,
  mount: [["/", "./src-gen"]],
  logLevel: 0,
  middleware: [
    function (req, res, next) {
      next();
    },
  ],
};
liveServer.start(params);

chokidar.watch("./src-gen/**/*.idef0svg").on("all", (event, path) => {
  if (event == "add" || event == "change") {
    runIDEF0SVG(path);
  }
});

chokidar.watch("./projects").on("all", (event, path) => {
  if (event == "add" || event == "change") {
    runFindFunc(path);
  }
});

function runIDEF0SVG(idef0svgFilePath, callback) {
  const newSVGFilePath = idef0svgFilePath.replace(".idef0svg", "");
  const child = exec(
    `ruby ./bin/schematic < ${idef0svgFilePath} > ${newSVGFilePath}.svg`,
    function (error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (callback) {
        callback(error, stdout, stderr);
      }
      if (error) {
        console.log("exec error: " + error);
      }
    }
  );
}

function runFindFunc(dslFilePath, callback) {
  const child = exec(`java -jar ./idef0.jar ${dslFilePath}`, function (
    error,
    stdout,
    stderr
  ) {
    console.log(stdout);
    console.log(stderr);
    if (callback) {
      callback(error, stdout, stderr);
    }
    if (error) {
      console.log("exec error: " + error);
    }
  });
}
