import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper';
import type { Logger } from '@technote-space/github-action-log-helper';
import { ApiHelper } from '@technote-space/github-action-helper';
import { isTargetBranch } from './utils/misc';
import { setTitle, setLabels } from './utils/pulls';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
  if (!isTargetBranch(context)) {
    logger.info('This is not target branch.');
    return;
  }

  await setTitle(logger, new ApiHelper(octokit, context, logger), octokit, context);
  await setLabels(logger, octokit, context);
};
