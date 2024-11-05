import { execSync } from 'child_process';

export const getStagedFiles = (verbose?:boolean) => {
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', {cwd: process.cwd()})
        .toString()
        .split('\n')
        .filter(file => file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx'));
    if (verbose) console.log(stagedFiles);
    return stagedFiles;
};
