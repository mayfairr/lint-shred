"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
module.exports = __toCommonJS(src_exports);

// src/cli/commander.ts
var import_commander = require("commander");

// package.json
var package_default = {
  name: "lint-shred",
  version: "1.0.0",
  description: "Prevent a codebase that has not previously adhered to ESLint issues, from getting worse.",
  main: "./dist/index.js",
  module: "./dist/index.mjs",
  scripts: {
    test: 'echo "Error: no test specified" && exit 1',
    build: "tsup"
  },
  keywords: [
    "typescript",
    "eslint",
    "linter",
    "lint"
  ],
  author: "mayfairr",
  license: "MIT",
  dependencies: {
    chalk: "^5.3.0",
    commander: "^12.1.0",
    figures: "^6.1.0"
  },
  devDependencies: {
    "@types/node": "^22.8.7",
    tsup: "^8.3.5",
    typescript: "^5.6.3"
  }
};

// src/generate-base/generate.ts
var import_fs = __toESM(require("fs"));
var import_path2 = __toESM(require("path"));
var import_glob2 = require("glob");
var import_chalk = __toESM(require("chalk"));
var import_figures = __toESM(require("figures"));

// src/generate-base/batch-files.ts
var import_child_process = require("child_process");
var import_path = __toESM(require("path"));
var import_glob = require("glob");
var outputFile = import_path.default.join(__dirname, "eslint-baseline.json");
var BATCH_SIZE = 100;
var files = import_glob.glob.sync("../**/*.{js,ts,tsx,jsx}", { ignore: "node_modules/**" });
var runESLintBatch = (filesBatch) => {
  return new Promise((resolve) => {
    (0, import_child_process.exec)(`npx eslint ${filesBatch.join(" ")} -f json`, { maxBuffer: 1024 * 5e3 }, (error, stdout, stderr) => {
      if (stderr) console.warn("ESLint warnings:", stderr);
      try {
        const batchIssues = JSON.parse(stdout);
        console.log(`Batch completed with ${filesBatch.length} files.`);
        resolve(batchIssues);
      } catch (parseError) {
        console.error("Invalid ESLint output; skipping batch:", parseError);
        resolve([]);
      }
    });
  });
};
var batches = [];
for (let i = 0; i < files.length; i += BATCH_SIZE) {
  batches.push(files.slice(i, i + BATCH_SIZE));
}

// src/generate-base/generate.ts
var BATCH_SIZE2 = 100;
var fileTypes = ["js", "ts", "tsx", "jsx"].join(",");
var generateBaseline = async (inputPath, outputPath) => {
  const outputFile2 = import_path2.default.join(outputPath ?? inputPath, "eslint-baseline.json");
  const files2 = import_glob2.glob.sync(`${inputPath}/**/*.{${fileTypes}}`, { ignore: "node_modules/**" });
  console.log(import_chalk.default.magenta.underline.bold(`
${import_figures.default.warning} Generating in Directory:${inputPath} <|> ${fileTypes} 
`));
  try {
    const batches2 = [];
    for (let i = 0; i < files2.length; i += BATCH_SIZE2) {
      batches2.push(files2.slice(i, i + BATCH_SIZE2));
    }
    let allIssues = [];
    for (const batch of batches2) {
      const batchIssues = await runESLintBatch(batch);
      const relativeIssues = batchIssues.map((issue) => ({
        ...issue,
        filePath: import_path2.default.relative(inputPath, issue.filePath)
      }));
      allIssues = allIssues.concat(relativeIssues);
    }
    import_fs.default.writeFileSync(outputFile2, JSON.stringify(allIssues, null, 2));
    console.log(`ESLint issues saved to ${outputFile2}`);
  } catch (error) {
    console.error("Error running ESLint in batches:", error);
  }
};

// src/compare/get-staged.ts
var import_child_process2 = require("child_process");
var getStagedFiles = () => {
  const stagedFiles = (0, import_child_process2.execSync)("git diff --cached --name-only --diff-filter=ACM", { cwd: process.cwd() }).toString().split("\n").filter((file) => file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".jsx"));
  if (stagedFiles?.length) console.log(stagedFiles);
  return stagedFiles;
};

// src/compare/run-lint.ts
var import_child_process3 = require("child_process");
var import_fs2 = __toESM(require("fs"));
var import_chalk2 = __toESM(require("chalk"));
var import_figures2 = __toESM(require("figures"));
var import_path3 = __toESM(require("path"));
var runESLintOnStagedFiles = async (files2, stagedFile) => {
  const inputPath = stagedFile.replace("/eslint-issues.json", "");
  console.error(inputPath, stagedFile);
  if (files2.length === 0) {
    console.log(import_chalk2.default.green("\u2728 No staged JavaScript or TypeScript files to compare to baseline with."));
    return false;
  }
  const eslintCommand = `yarn eslint ${files2.join(" ")} -f json`;
  try {
    const rawOutput = (0, import_child_process3.execSync)(eslintCommand, { maxBuffer: 1024 * 500 }).toString();
    const jsonOutput = rawOutput.split("\n").filter((line) => line.trim().startsWith("[") || line.trim().startsWith("{")).join("\n");
    const withRelativePaths = JSON.parse(jsonOutput).map((screen) => ({
      ...screen,
      filePath: import_path3.default.relative(inputPath, screen.filePath)
    }));
    console.error(withRelativePaths);
    import_fs2.default.writeFileSync(stagedFile, JSON.stringify(withRelativePaths));
    console.log(import_chalk2.default.cyan.bold(`\u2728ESLint issues saved to: ${stagedFile}`));
    return true;
  } catch (error) {
    console.error(import_chalk2.default.red(`${import_figures2.default.cross} ESLint failed to run on staged files. (This usually happens when there is JS Error on your file. Please verify this is not the case) 
`), error);
    return false;
  }
};

// src/compare/diff-with-baseline.ts
var import_fs3 = __toESM(require("fs"));
var import_chalk3 = __toESM(require("chalk"));
var import_figures3 = __toESM(require("figures"));
var compareWithBaseline = async (stagedFile, baselineFile) => {
  if (!import_fs3.default.existsSync(stagedFile) || !import_fs3.default.existsSync(baselineFile)) {
    console.error(import_chalk3.default.red(`${import_figures3.default.cross} Baseline or staged ESLint output not found.`));
    return;
  }
  const baselineData = JSON.parse(import_fs3.default.readFileSync(baselineFile, "utf-8"));
  const stagedData = JSON.parse(import_fs3.default.readFileSync(stagedFile, "utf-8"));
  const simplifyIssues = (data) => data.reduce((acc, file) => {
    file.messages.forEach((issue) => {
      const key = `${file.filePath}:${issue.ruleId}`;
      acc[key] = (acc[key] || 0) + 1;
    });
    return acc;
  }, {});
  const baselineIssues = simplifyIssues(baselineData);
  const stagedIssues = simplifyIssues(stagedData);
  const newOrIncreasedIssues = [];
  for (const [key, stagedCount] of Object.entries(stagedIssues)) {
    const baselineCount = baselineIssues[key] || 0;
    if (stagedCount > baselineCount) {
      newOrIncreasedIssues.push({ key, stagedCount, baselineCount });
    }
  }
  if (newOrIncreasedIssues.length > 0) {
    console.log(
      import_chalk3.default.redBright.white.italic(`
${import_figures3.default.infinity} BETA ${package_default.version} by ${package_default.author} 
`),
      import_chalk3.default.redBright.bgRed(`
${import_figures3.default.cross} Oh no, we have a problem. You've introduced some new ESLint errors:
`)
    );
    newOrIncreasedIssues.forEach((detail) => {
      const [filePath, ruleId] = detail.key.split(":");
      console.log(import_chalk3.default.yellow(`${import_figures3.default.pointer} File: ${filePath}`));
      console.log(import_chalk3.default.magenta(`- Rule: ${import_chalk3.default.bold(ruleId)}`));
      console.log(import_chalk3.default.blue(`- Occurrences In BaseLine JSON: ${import_chalk3.default.bold(detail.baselineCount)}`));
      console.log(import_chalk3.default.white(`- Occurrences In Current JSON: ${import_chalk3.default.italic(detail.stagedCount)}
`));
    });
    process.exit(1);
  } else {
    console.log(import_chalk3.default.green(`
${import_figures3.default.tick} No new ESLint issues introduced.`));
  }
};

// src/cli/commander.ts
var import_path4 = __toESM(require("path"));
var program = new import_commander.Command();
program.version(package_default.version).description(package_default.description);
program.command("generate").description("Generates the baseline eslint rules. Run this only once.").option("-o, --output <output>", "Specify the output file path").action(async (name, options) => {
  const currentDir = process.cwd();
  await generateBaseline(currentDir, options.output);
});
program.command("compare").description("Compares staged with baseline.json.").option("-o, --output <output>", "Specify the output file path").option("-i, --input <input>", "Specify the input file path").action(async (_, options) => {
  const currentDir = process.cwd();
  const baselineFile = options.input ?? import_path4.default.join(currentDir, "eslint-baseline.json");
  const stageFile = options.output ?? import_path4.default.join(currentDir, "eslint-issues.json");
  const stagedFiles = getStagedFiles();
  if (await runESLintOnStagedFiles(stagedFiles, stageFile)) {
    await compareWithBaseline(stageFile, baselineFile);
  }
});
program.parse(process.argv);
