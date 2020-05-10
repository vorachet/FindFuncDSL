require("dotenv").config();
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const exec = require("child_process").exec;
const liveServer = require("live-server");

const DEFAUT_DSL_FOLDER = "./projects";
const DEFAUT_SRC_FOLDER = "./src";
const TEMP_FOLDER = "./tmp";
const SRC_GEN_FOLDER = process.env.SRC_GEN_PATH || "./src-gen";

if (!process.env.DSL_PATHS) {
  showDSHelpMessages();
}

if (!process.env.SRC_PATHS) {
  showDSL4ProgHelpMessages();
}

watchAndCompileDSL(process.env.DSL_PATHS || `${DEFAUT_DSL_FOLDER}/**/*.*`);
watchAndCompileSRC(process.env.SRC_PATHS || `${DEFAUT_SRC_FOLDER}/**/*.*`);
watchFilesAndRunIEDF0SVG(`${SRC_GEN_FOLDER}/**/*.idef0svg`);
startWebServer();

function startWebServer() {
  liveServer.start({
    port: process.env.WEB_SERVER_PORT || 9080,
    host: process.env.WEB_SERVER_IP || "0.0.0.0",
    root: SRC_GEN_FOLDER,
    open: true,
    wait: 1000,
    mount: [["/", SRC_GEN_FOLDER]],
    logLevel: 0,
    middleware: [
      function (req, res, next) {
        next();
      },
    ],
  });
}

function watchAndCompileDSL(dslPaths) {
  const dslPathsArray = dslPaths.split(",");
  dslPathsArray.forEach((folder) => {
    watchFilesAndRunFundFunc(`${folder}/**/*.idef0`);
  });
}

function watchAndCompileSRC(srcPaths) {
  const srcPathsArray = srcPaths.split(",");
  srcPathsArray.forEach((srcPath) => {
    watchFilesAndRunSrcCommentExtractor(srcPath);
  });
  watchFilesAndRunFundFunc(`${TEMP_FOLDER}/**/*.idef0`);
}

function showDSL4ProgHelpMessages() {
  console.log(
    `Usage: SRC_PATHS=src_path1/**/*.ts,src_path2/**/*.vue npm start`
  );
}

function showDSHelpMessages() {
  console.log(
    `Usage: DSL_PATHS=dsl_path1/**/*.idef0,src_path2/**/*.idef0 npm start`
  );
}

function watchFilesAndRunSrcCommentExtractor(srcPath) {
  if (chokidar) {
    console.log(`watching SRC ${srcPath} ...`);
    chokidar.watch(`${srcPath}`).on("all", (event, path) => {
      if (event == "change") {
        runSrcCommentExtractor(path);
      }
    });
  }
}
function watchFilesAndRunIEDF0SVG() {
  if (chokidar) {
    chokidar
      .watch(`${SRC_GEN_FOLDER}/**/*.idef0svg`)
      .on("all", (event, path) => {
        if (event == "add" || event == "change") {
          runIDEF0SVG(path);
        }
      });
  }
}

function watchFilesAndRunFundFunc(targePath) {
  if (chokidar) {
    console.log(`watching DSL ${targePath} ...`);
    chokidar.watch(targePath).on("all", (event, path) => {
      if (event == "change") {
        runFindFunc(path);
      }
    });
  }
}

function ensureTempFolder() {
  if (!fs.existsSync(TEMP_FOLDER)) {
    fs.mkdirSync(TEMP_FOLDER);
  }
}
function runSrcCommentExtractor(srcFilePath, callback) {
  const child = exec(`cat ${srcFilePath} | grep '//\%'`, function (
    error,
    stdout,
    stderr
  ) {
    if (stdout) {
      const lines = stdout.split("\n");
      if (lines.length > 0) {
        ensureTempFolder();
        const tempFileName = path.basename(srcFilePath) + ".idef0";
        const tempFilePath = `${TEMP_FOLDER}/${tempFileName}`;
        const content = lines
          .map((o) => o.trim().replace("//", ""))
          .filter((o) => o != "")
          .join("\r\n");

        fs.writeFileSync(tempFilePath, content + "\r\n");
        console.log(`${tempFilePath} has been created`);
      }
    }
    if (callback) {
      callback(error, stdout, stderr);
    }
  });
}

function runIDEF0SVG(idef0svgFilePath) {
  console.log("generateing SVG ", idef0svgFilePath);
  const newSVGFilePath = idef0svgFilePath.replace(".idef0svg", "");
  runCommandLineProgram(
    `ruby ./bin/schematic < ${idef0svgFilePath} > ${newSVGFilePath}.svg`
  );
}

function runFindFunc(dslFilePath) {
  console.log("compiling DSL: ", dslFilePath);
  runCommandLineProgram(`java -jar ./bin/idef0.jar ${dslFilePath}`);
}

function runCommandLineProgram(exeSpec) {
  exec(`${exeSpec}`, function (error, stdout, stderr) {
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    if (error) {
      console.log("exec error: " + error);
    }
  });
}
