import {Context} from '@actions/github/lib/context';
import {Octokit} from '@technote-space/github-action-helper/dist/types';
import {ApiHelper, Logger} from '@technote-space/github-action-helper';
import {VERSION_BUMP} from '@technote-space/github-action-version-helper/dist/constant';
import {getMajorLabel, getMinorLabel, getPatchLabel, getPrLabels, getPrTitle, getTitle} from './misc';
import {getNextVersion, getNextVersionLevel} from './version';

export const setTitle = async(logger: Logger, helper: ApiHelper, octokit: Octokit, context: Context): Promise<void> => {
  const next  = await getNextVersion(logger, helper, octokit, context);
  const title = await getTitle(next);

  if (title && title !== getPrTitle(context)) {
    await octokit.pulls.update({
      ...context.repo,
      'pull_number': context.payload.number,
      title,
    });
  }
};

export const getReleaseLabels = (): { [key: number]: string } => {
  const labels = {};
  const major  = getMajorLabel();
  const minor  = getMinorLabel();
  const patch  = getPatchLabel();
  if (major) {
    labels[VERSION_BUMP['major']] = major;
  }
  if (minor) {
    labels[VERSION_BUMP['minor']] = minor;
  }
  if (patch) {
    labels[VERSION_BUMP['patch']] = patch;
  }

  return labels;
};

export const setLabels = async(logger: Logger, octokit: Octokit, context: Context): Promise<void> => {
  const nextLevel      = await getNextVersionLevel(octokit, context);
  const releaseLabels  = getReleaseLabels();
  const prLabels       = getPrLabels(context);
  const nextLabel      = releaseLabels[nextLevel];
  const labelsToRemove = Object.values(releaseLabels).filter(label => label !== nextLabel && prLabels.includes(label));

  logger.startProcess('Remove label:');
  console.log(labelsToRemove);
  await Promise.all(labelsToRemove.map(label => octokit.issues.removeLabel({
    ...context.repo,
    'issue_number': context.payload.number,
    name: label,
  })));

  if (nextLabel && !prLabels.includes(nextLabel)) {
    logger.startProcess('Add label:');
    console.log(nextLabel);
    await octokit.issues.addLabels({
      ...context.repo,
      'issue_number': context.payload.number,
      labels: [nextLabel],
    });
  }

  logger.endProcess();
};
