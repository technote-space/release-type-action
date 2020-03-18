import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Logger } from '@technote-space/github-action-helper';
import ApiHelper from '@technote-space/github-action-helper/dist/api-helper';
import { setTitle, setLabels } from './utils/pulls';
import { isTargetBranch } from './utils/misc';

export const execute = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
	if (!isTargetBranch(context)) {
		logger.info('This is not target branch.');
		return;
	}

	await setTitle(logger, new ApiHelper(octokit, context, logger), octokit, context);
	await setLabels(logger, octokit, context);
};
