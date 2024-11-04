import fs from "fs";
import chalk from "chalk";
import figures from "figures";
import PackageJson from '../../package.json'

export const compareWithBaseline = async (stagedFile:string, baselineFile:string) => {
    if (!fs.existsSync(stagedFile) || !fs.existsSync(baselineFile)) {
        console.error(chalk.red(`${figures.cross} Baseline or staged ESLint output not found.`));
        return;
    }

    const baselineData = JSON.parse(fs.readFileSync(baselineFile, 'utf-8')) as object;
    const stagedData = JSON.parse(fs.readFileSync(stagedFile, 'utf-8')) as object;

    const simplifyIssues = (data) =>
        data.reduce((acc, file) => {
            file.messages.forEach(issue => {
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
            chalk.redBright.white.italic(`\n${figures.infinity} BETA ${PackageJson.version} by ${PackageJson.author} \n`),
            chalk.redBright.bgRed(`\n${figures.cross} Oh no, we have a problem. You've introduced some new ESLint errors:\n`),
        );

        newOrIncreasedIssues.forEach(detail => {
            const [filePath, ruleId] = detail.key.split(':');
            console.log(chalk.yellow(`${figures.pointer} File: ${filePath}`));
            console.log(chalk.magenta(`- Rule: ${chalk.bold(ruleId)}`));
            console.log(chalk.blue(`- Occurrences In BaseLine JSON: ${chalk.bold(detail.baselineCount)}`));
            console.log(chalk.white(`- Occurrences In Current JSON: ${chalk.italic(detail.stagedCount)}\n`));
        });

        process.exit(1);
    } else {
        console.log(chalk.green(`\n${figures.tick} No new ESLint issues introduced.`));
    }
};
