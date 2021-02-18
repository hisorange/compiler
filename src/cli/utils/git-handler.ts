import { existsSync } from 'fs';
import { join } from 'path';
import { ILogger } from '../../';

const Git = require('simple-git/promise');

const BRANCH_BASE = 'artgen/rv';
const BRANCH_INIT = 'artgen/rv0';

const hasGit = (output: string) => existsSync(join(output, '.git'));

export function GitHandler(logger: ILogger, output: string) {
  const git = Git(output);

  let targetBranch = BRANCH_BASE + '0';
  let gitInited = false;

  async function begin() {
    // Does not have GIT yet.
    if (!hasGit(output)) {
      logger.log('Initialize');
      await git.init();

      gitInited = true;
    } else {
      const currentBranch = (await git.branch()).current;
      logger.log('Current branch', currentBranch);

      const branches = await git.branchLocal();
      let lastRevision = 0;

      for (const b of branches.all) {
        let match = b.match(/artgen\/rv(\d+)$/);

        if (match) {
          logger.log('Found revision', b, match[1]);

          if (match[1] > lastRevision) {
            lastRevision = parseInt(match[1], 10);
          }
        }
      }

      let lastBranch = BRANCH_BASE + lastRevision;

      // Already initizliased, go back to the original branch.
      // And commit changes toward it.
      logger.log('Checking out to', lastBranch);
      await git.checkout([lastBranch]);

      // Find the last revision and increment for the target.
      targetBranch = BRANCH_BASE + (lastRevision + 1);

      // Before we change anything, fork the base.
      await git.checkout(['-b', targetBranch]);
    }
  }

  async function complete() {
    const commitChanges = async () => {
      logger.log('Commiting');

      await git.add(join(output, '*'));
      await git.commit('Artgen compilation');
    };

    if (gitInited) {
      await git.raw(['checkout', '-b', BRANCH_INIT]);
      await commitChanges();
      await git.checkout(['-b', 'master']);
      await git.checkout(['-b', 'develop']);

      logger.log('Checking out to', 'develop');
    } else {
      logger.log('Merge', 'Into', targetBranch);

      await commitChanges();
      await git.checkout(['-b', 'artgen/merge']);
      await git.merge(['develop']); // Merge develop to temporal branch

      // Go back to develop
      await git.checkout(['develop']);
      await git.merge(['artgen/merge']); // Merge the result back
      await git.deleteLocalBranch('artgen/merge');
    }
  }

  return {
    begin,
    complete,
  };
}
