import { exec } from 'child_process';
import fg from 'fast-glob';

const BATCH_SIZE = 100; // Adjust batch size based on memory constraints

const files = fg.sync('../**/*.{js,ts,tsx,jsx}', { ignore: ['**/node_modules/**'] });

export const runESLintBatch = (filesBatch:string[], verbose?:boolean) => {

  if(verbose){
    console.log(filesBatch)
  }

  return new Promise(resolve => {
    exec(`npx eslint ${filesBatch.join(' ')} -f json`, { maxBuffer: 1024 * 5000 }, (error:unknown, stdout:string, stderr:unknown) => {
      if (stderr) console.warn('ESLint warnings:', stderr);

      try {
        const batchIssues:object = JSON.parse(stdout);
        console.log(`Batch completed with ${filesBatch.length} files.`);
        resolve(batchIssues);
      } catch (parseError) {
        console.error('Invalid ESLint output; skipping batch:', parseError);
        resolve([]);
      }
    });
  });
};

const batches = [];
for (let i = 0; i < files.length; i += BATCH_SIZE) {
  batches.push(files.slice(i, i + BATCH_SIZE));
}


