require("dotenv").config();
const fs = require("fs");
const path = require("path");

const chokidar = require("chokidar");
const exec = require("child_process").exec;
const liveServer = require("live-server");

const BRAND = `
_______           ________                
/ ____(_)___  ____/ / ____/_  ______  _____
/ /_  / / __ \/ __  / /_  / / / / __ \/ ___/
/ __/ / / / / / /_/ / __/ / /_/ / / / / /__  
/_/   /_/_/ /_/\__,_/_/    \__,_/_/ /_/\___/  
                                                                                                                                                                                    
`;

const TEMP_FOLDER = "./tmp";
const SRC_GEN_FOLDER = "./src-gen";
const DEFAUT_DSL_SRC_FOLDER = "./projects";
const LIVE_SERVER_CONFIG = {
  port: 9080,
  host: "0.0.0.0",
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
};
liveServer.start(LIVE_SERVER_CONFIG);

console.log("\n\n\n");
console.log(BRAND);
console.log("\n\n\n");

// SVG GENERATION PROCESS
chokidar.watch(`${SRC_GEN_FOLDER}/**/*.idef0svg`).on("all", (event, path) => {
  if (event == "add" || event == "change") {
    runIDEF0SVG(path);
  }
});

// DSL FILES

let dslSrcFolders = process.env.DSL_SRC_FOLDERS;
if (!dslSrcFolders) {
  console.log("No DSL_SRC_FOLDERS found");
  console.log("1. Create .env at the root of project");
  console.log("2. DSL_SRC_FOLDERS = src_path1, src_path2");
  console.log("\n\n\n");
  console.log(`USE DEFAULT DSL_SRC_FOLDERS = ${DEFAUT_DSL_SRC_FOLDER}`);
  console.log("\n\n\n");
  // DSL COMPILING PROCESS
  chokidar
    .watch(`${DEFAUT_DSL_SRC_FOLDER}/**/*.idef0`)
    .on("all", (event, path) => {
      if (event == "add" || event == "change") {
        runFindFunc(path);
      }
    });
} else {
  const parsedTargetDslSrcFolders = dslSrcFolders.split(",");
  parsedTargetDslSrcFolders.forEach((folder) => {
    // DSL COMPILING PROCESS
    chokidar.watch(`${folder}/**/*.idef0`).on("all", (event, path) => {
      if (event == "add" || event == "change") {
        runFindFunc(path);
      }
    });
  });
}

// TYPESCRIPT EMBEDDED DSL FILES

const tsTSSrcFolders = process.env.TYPESCRIPT_SRC_FOLDERS;
console.log("TYPESCRIPT_SRC_FOLDERS", tsTSSrcFolders);
if (!tsTSSrcFolders) {
  console.log("No TYPESCRIPT_SRC_FOLDERS found");
  console.log("1. Create .env at the root of project");
  console.log("2. TYPESCRIPT_SRC_FOLDERS = src_path1, src_path2");
  console.log("\n\n\n");
} else {
  const parsedTargetTSSrcFolders = tsTSSrcFolders.split(",");
  parsedTargetTSSrcFolders.forEach((folder) => {
    chokidar.watch(`${folder}/**/*.ts`).on("all", (event, path) => {
      if (event == "add" || event == "change") {
        prepareTSEmbeddedDSLFiles(path);
      }
    });
  });
  // TYPESCRIPT EMBEDDED DSL COMPILING PROCESS
  chokidar.watch(`${TEMP_FOLDER}/**/*.idef0`).on("all", (event, path) => {
    if (event == "add" || event == "change") {
      runFindFunc(path);
    }
  });
}

function ensureTempFolder() {
  if (!fs.existsSync(TEMP_FOLDER)) {
    fs.mkdirSync(TEMP_FOLDER);
  }
}
function prepareTSEmbeddedDSLFiles(srcFilePath, callback) {
  const child = exec(`cat ${srcFilePath} | grep '@'`, function (
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
  console.log("compiling ", idef0svgFilePath);
  const newSVGFilePath = idef0svgFilePath.replace(".idef0svg", "");
  const child = exec(
    `ruby ./bin/schematic < ${idef0svgFilePath} > ${newSVGFilePath}.svg`,
    function (error, stdout, stderr) {
      if (error) {
        console.log("exec error: " + error);
      }
    }
  );
}

function runFindFunc(dslFilePath) {
  console.log("compiling DSL: ", dslFilePath);
  const child = exec(`java -jar ./bin/idef0.jar ${dslFilePath}`, function (
    error,
    stdout,
    stderr
  ) {
    if (error) {
      console.log("exec error: " + error);
    }
  });
}
