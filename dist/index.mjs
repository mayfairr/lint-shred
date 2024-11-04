// node_modules/tsup/assets/esm_shims.js
import { fileURLToPath } from "url";
import path from "path";
var getFilename = () => fileURLToPath(import.meta.url);
var getDirname = () => path.dirname(getFilename());
var __dirname = /* @__PURE__ */ getDirname();

// src/cli/commander.ts
import { Command } from "commander";

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
import fs from "fs";
import path3 from "path";
import { glob as glob2 } from "glob";
import chalk from "chalk";
import figures from "figures";

// src/generate-base/batch-files.ts
import { exec } from "child_process";
import path2 from "path";
import { glob } from "glob";
var outputFile = path2.join(__dirname, "eslint-baseline.json");
var BATCH_SIZE = 100;
var files = glob.sync("../**/*.{js,ts,tsx,jsx}", { ignore: "node_modules/**" });
var runESLintBatch = (filesBatch) => {
  return new Promise((resolve) => {
    exec(`npx eslint ${filesBatch.join(" ")} -f json`, { maxBuffer: 1024 * 5e3 }, (error, stdout, stderr) => {
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
  const outputFile2 = path3.join(outputPath ?? inputPath, "eslint-baseline.json");
  const files2 = glob2.sync(`${inputPath}/**/*.{${fileTypes}}`, { ignore: "node_modules/**" });
  console.log(chalk.magenta.underline.bold(`
${figures.warning} Generating in Directory:${inputPath} <|> ${fileTypes} 
`));
  try {
    const batches2 = [];
    for (let i = 0; i < files2.length; i += BATCH_SIZE2) {
      batches2.push(files2.slice(i, i + BATCH_SIZE2));
    }
    let allIssues = [];
    for (const batch of batches2) {
      const batchIssues = await runESLintBatch(batch);
      allIssues = allIssues.concat(batchIssues);
    }
    fs.writeFileSync(outputFile2, JSON.stringify(allIssues, null, 2));
    console.log(`ESLint issues saved to ${outputFile2}`);
  } catch (error) {
    console.error("Error running ESLint in batches:", error);
  }
};

// src/compare/get-staged.ts
import { execSync } from "child_process";
var getStagedFiles = () => {
  const stagedFiles = execSync("git diff --cached --name-only --diff-filter=ACM", { cwd: process.cwd() }).toString().split("\n").filter((file) => file.endsWith(".tsx") || file.endsWith(".ts") || file.endsWith(".js") || file.endsWith(".jsx"));
  if (stagedFiles?.length) console.log(stagedFiles);
  return stagedFiles;
};

// src/compare/run-lint.ts
import { execSync as execSync2 } from "child_process";
import fs2 from "fs";
import chalk2 from "chalk";
import figures2 from "figures";
var runESLintOnStagedFiles = async (files2, stagedFile) => {
  if (files2.length === 0) {
    console.log(chalk2.green("\u2728 No staged JavaScript or TypeScript files to compare to baseline with."));
    return false;
  }
  const eslintCommand = `yarn eslint ${files2.join(" ")} -f json`;
  try {
    const rawOutput = execSync2(eslintCommand, { maxBuffer: 1024 * 500 }).toString();
    const jsonOutput = rawOutput.split("\n").filter((line) => line.trim().startsWith("[") || line.trim().startsWith("{")).join("\n");
    fs2.writeFileSync(stagedFile, jsonOutput);
    console.log(chalk2.cyan.bold(`\u2728ESLint issues saved to: ${stagedFile}`));
    return true;
  } catch (error) {
    console.error(chalk2.red(`${figures2.cross} ESLint failed to run on staged files. (This usually happens when there is JS Error on your file. Please verify this is not the case) 
`), error);
    return false;
  }
};

// src/compare/diff-with-baseline.ts
import fs3 from "fs";
import chalk3 from "chalk";
import figures3 from "figures";
var compareWithBaseline = async (stagedFile, baselineFile) => {
  if (!fs3.existsSync(stagedFile) || !fs3.existsSync(baselineFile)) {
    console.error(chalk3.red(`${figures3.cross} Baseline or staged ESLint output not found.`));
    return;
  }
  const baselineData = JSON.parse(fs3.readFileSync(baselineFile, "utf-8"));
  const stagedData = JSON.parse(fs3.readFileSync(stagedFile, "utf-8"));
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
      chalk3.redBright.white.italic(`
${figures3.infinity} ${package_default.version < 1 ? "Beta" : ""} ${package_default.version} by ${package_default.author} 
`),
      chalk3.redBright.bgRed(`
${figures3.cross} Oh no, we have a problem. You've introduced some new ESLint errors:
`)
    );
    newOrIncreasedIssues.forEach((detail) => {
      const [filePath, ruleId] = detail.key.split(":");
      console.log(chalk3.yellow(`${figures3.pointer} File: ${filePath}`));
      console.log(chalk3.magenta(`- Rule: ${chalk3.bold(ruleId)}`));
      console.log(chalk3.blue(`- Occurrences In BaseLine JSON: ${chalk3.bold(detail.baselineCount)}`));
      console.log(chalk3.white(`- Occurrences In Current JSON: ${chalk3.italic(detail.stagedCount)}
`));
    });
    process.exit(1);
  } else {
    console.log(chalk3.green(`
${figures3.tick} No new ESLint issues introduced.`));
  }
};

// src/cli/commander.ts
import path4 from "path";
var program = new Command();
program.version(package_default.version).description(package_default.description);
program.command("generate").description("Generates the baseline eslint rules. Run this only once.").option("-o, --output <output>", "Specify the output file path").action(async (name, options) => {
  const currentDir = process.cwd();
  await generateBaseline(currentDir, options.output);
});
program.command("compare").description("Compares staged with baseline.json.").option("-o, --output <output>", "Specify the output file path").option("-i, --input <input>", "Specify the input file path").action(async (_, options) => {
  const currentDir = process.cwd();
  const baselineFile = options.input ?? path4.join(currentDir, "eslint-baseline.json");
  const stageFile = options.output ?? path4.join(currentDir, "eslint-issues.json");
  const stagedFiles = getStagedFiles();
  if (await runESLintOnStagedFiles(stagedFiles, stageFile)) {
    await compareWithBaseline(stageFile, baselineFile);
  }
});
program.parse(process.argv);
