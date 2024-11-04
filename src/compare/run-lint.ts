import {execSync} from "child_process";
import fs from "fs";
import chalk from 'chalk'
import figures from 'figures'

export const runESLintOnStagedFiles = async(files:string[], stagedFile:string) => {
    if (files.length === 0) {
        console.log(chalk.green('✨ No staged JavaScript or TypeScript files to compare to baseline with.'));
        return false;
    }

    const eslintCommand = `yarn eslint ${files.join(' ')} -f json`;

    try {
        const rawOutput = execSync(eslintCommand, { maxBuffer: 1024 * 500 }).toString();

        const jsonOutput = rawOutput
            .split('\n')
            .filter(line => line.trim().startsWith('[') || line.trim().startsWith('{'))
            .join('\n');

        fs.writeFileSync(stagedFile, jsonOutput);
        console.log(chalk.cyan.bold(`✨ESLint issues saved to: ${stagedFile}`));
        return true;
    } catch (error) {
        console.error(chalk.red(`${figures.cross} ESLint failed to run on staged files. (This usually happens when there is JS Error on your file. Please verify this is not the case) \n`), error);
        return false;
    }
};
