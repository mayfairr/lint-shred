import {Command} from 'commander'
import packageJson from '../../package.json'
import {generateBaseline} from "../generate-base";
import {getStagedFiles} from "../compare/get-staged";
import {compareWithBaseline, runESLintOnStagedFiles} from "../compare";
import path from "path";

const program = new Command();

program.version(packageJson.version).description(packageJson.description);

program.command("generate")
    .description("Generates the baseline eslint rules. Run this only once.")
    .option('-o, --output <output>', 'Specify the output file path')
    .option('-v, --verbose <verbose>', 'Verbose')
    .action(async (name, options) => {
    const currentDir = process.cwd();
    await generateBaseline(currentDir, options.output, options.verbose)
});

program
    .command("compare")
    .description("Compares staged with baseline.json.")
    .option('-o, --output <output>', 'Specify the output file path')
    .option('-i, --input <input>', 'Specify the input file path')
    .action(async(_,options) => {
        const currentDir = process.cwd();
        const baselineFile = options.input ??  path.join(currentDir , 'eslint-baseline.json');
        const stageFile = options.output ??  path.join(currentDir , 'eslint-issues.json');

        const stagedFiles = getStagedFiles();
        if (await runESLintOnStagedFiles(stagedFiles, stageFile)) {
            await compareWithBaseline(stageFile, baselineFile);
        }
})

program.parse(process.argv);