import fs from "fs";
import path from "path";
import {glob} from "glob";
import chalk from "chalk";
import figures from "figures";
import {runESLintBatch} from "./batch-files";


const BATCH_SIZE = 100;
const fileTypes = ['js','ts','tsx','jsx'].join(',')


export const generateBaseline = async (inputPath:string, outputPath?:string) => {

    const outputFile = path.join(outputPath ?? inputPath , 'eslint-baseline.json');
    const files = glob.sync(`${inputPath}/**/*.{${fileTypes}}`, { ignore: 'node_modules/**' });

    console.log(chalk.magenta.underline.bold(`\n${figures.warning} Generating in Directory:${inputPath} <|> ${fileTypes} \n`));
    try {

        const batches = [];
        for (let i = 0; i < files.length; i += BATCH_SIZE) {
            batches.push(files.slice(i, i + BATCH_SIZE));
        }

        let allIssues:string[] = [];

        for (const batch of batches) {
            const batchIssues = await runESLintBatch(batch) as string;
            allIssues = allIssues.concat(batchIssues);
        }

        fs.writeFileSync(outputFile, JSON.stringify(allIssues, null, 2));
        console.log(`ESLint issues saved to ${outputFile}`);
    } catch (error) {
        console.error('Error running ESLint in batches:', error);
    }
}
