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
const DEFAUT_CODE_FOLDER = "./src";
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
  console.log(
    `Usage: Add variable DSL_SRC_FOLDERS into your runtime environment `
  );
  console.log(`Ex. DSL_SRC_FOLDERS=src_path1,src_path2 npm start`);
  console.log("\n\n\n");
  console.log(`USE DEFAULT DSL_SRC_FOLDERS = ${DEFAUT_DSL_SRC_FOLDER}`);
  console.log("\n\n\n");
  chokidar.watch(`${DEFAUT_DSL_SRC_FOLDER}/**/*.*`).on("all", (event, path) => {
    if (event == "add" || event == "change") {
      runFindFunc(path);
    }
  });
} else {
  const parsedTargetDslSrcFolders = dslSrcFolders.split(",");
  parsedTargetDslSrcFolders.forEach((folder) => {
    chokidar.watch(`${folder}/**/*.idef0`).on("all", (event, path) => {
      if (event == "add" || event == "change") {
        runFindFunc(path);
      }
    });
  });
}

compileSourceFiles("TYPESCRIPT_SRC_FOLDERS", "ts");
compileSourceFiles("VUE_SRC_FOLDERS", "vue");

function compileSourceFiles(ENV_SRC_FOLDERS_NAME, fileExtension) {
  const targetSrcFolders = process.env[ENV_SRC_FOLDERS_NAME];
  if (!targetSrcFolders) {
    console.log(`No ${ENV_SRC_FOLDERS_NAME} found`);
    console.log(
      `Usage: Add variable ${ENV_SRC_FOLDERS_NAME} into your runtime environment `
    );
    console.log(`Ex. ${ENV_SRC_FOLDERS_NAME}=src_path1,src_path2 npm start`);
    console.log("\n\n\n");
    console.log(
      `USE DEFAULT FOLDER FOR ${ENV_SRC_FOLDERS_NAME} = ${DEFAUT_CODE_FOLDER}`
    );
    console.log(`Watching ${DEFAUT_CODE_FOLDER}/**/*.${fileExtension}`);
    console.log("\n\n\n");
    chokidar
      .watch(`${DEFAUT_CODE_FOLDER}/**/*.${fileExtension}`)
      .on("all", (event, path) => {
        if (event == "add" || event == "change") {
          prepareTSEmbeddedDSLFiles(path);
        }
      });
  } else {
    console.log(ENV_SRC_FOLDERS_NAME, targetSrcFolders);
    const parsedTargetTSFolders = targetSrcFolders.split(",");
    parsedTargetTSFolders.forEach((folder) => {
      chokidar
        .watch(`${folder}/**/*.${fileExtension}`)
        .on("all", (event, path) => {
          if (event == "add" || event == "change") {
            prepareTSEmbeddedDSLFiles(path);
          }
        });
    });
  }
}

chokidar.watch(`${TEMP_FOLDER}/**/*.idef0`).on("all", (event, path) => {
  if (event == "add" || event == "change") {
    runFindFunc(path);
  }
});

function ensureTempFolder() {
  if (!fs.existsSync(TEMP_FOLDER)) {
    fs.mkdirSync(TEMP_FOLDER);
  }
}
function prepareTSEmbeddedDSLFiles(srcFilePath, callback) {
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
    console.log("compiling DSL:", stdout);
    console.log("compiling DSL:", stderr);
    if (error) {
      console.log("exec error: " + error);
    }
  });
}
