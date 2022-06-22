import type { Context } from '@actions/github/lib/context';
import { getInput } from '@actions/core';
import { Utils } from '@technote-space/github-action-helper';

export const getMinorUpdateCommitTypes = (): Array<string> => Utils.getArrayInput('MINOR_UPDATE_TYPES');
export const getExcludeMessages        = (): Array<string> => Utils.getArrayInput('EXCLUDE_MESSAGES');
export const getBreakingChangeNotes    = (): Array<string> => Utils.getArrayInput('BREAKING_CHANGE_NOTES');
export const getBranchName             = (): string => getInput('BRANCH_NAME');
export const getBranchPrefix           = (): string => getInput('BRANCH_PREFIX');
const getTitleTemplate                 = (): string => getInput('TITLE_TEMPLATE');
export const getMajorLabel             = (): string => getInput('MAJOR_LABEL');
export const getMinorLabel             = (): string => getInput('MINOR_LABEL');
export const getPatchLabel             = (): string => getInput('PATCH_LABEL');

const contextVariables = (next: string): Array<{ key: string; replace: () => string }> => [
  { key: 'NEXT_VERSION', replace: (): string => next },
];
export const getTitle  = (next: string): Promise<string> => Utils.replaceVariables(getTitleTemplate(), contextVariables(next));

export const getPrHeadRef = (context: Context): string => context.payload.pull_request?.head.ref ?? '';
export const getPrTitle   = (context: Context): string => context.payload.pull_request?.title ?? '';
export const getPrLabels  = (context: Context): Array<string> => (context.payload.pull_request?.labels ?? []).map(item => item.name);

export const isTargetBranch = (context: Context): boolean | never => {
  const branch = getBranchName();
  const prefix = getBranchPrefix();
  if (!branch && !prefix) {
    throw new Error('Branch target setting is required.');
  }

  if (branch) {
    return branch === getPrHeadRef(context);
  }

  return !!(prefix && Utils.getPrefixRegExp(prefix).test(getPrHeadRef(context)));
};
