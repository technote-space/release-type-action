import { Context } from '@actions/github/lib/context';
import { Utils } from '@technote-space/github-action-helper';
import { getInput } from '@actions/core';

export const getMinorUpdateCommitTypes = (): Array<string> => Utils.getArrayInput('MINOR_UPDATE_TYPES');
export const getExcludeMessages        = (): Array<string> => Utils.getArrayInput('EXCLUDE_MESSAGES');
export const getBreakingChangeNotes    = (): Array<string> => Utils.getArrayInput('BREAKING_CHANGE_NOTES');
export const getBranchName             = (): string => getInput('BRANCH_NAME', {required: true});
const getTitleTemplate                 = (): string => getInput('TITLE_TEMPLATE');
export const getMajorLabel             = (): string => getInput('MAJOR_LABEL');
export const getMinorLabel             = (): string => getInput('MINOR_LABEL');
export const getPatchLabel             = (): string => getInput('PATCH_LABEL');

const replaceVariables = (string: string, variables: { key: string; replace: () => string }[]): string => {
	let replaced = string;
	for (const variable of variables) {
		if (Utils.getRegExp(`\${${variable.key}}`).test(replaced)) {
			replaced = Utils.replaceAll(replaced, `\${${variable.key}}`, variable.replace());
		}
	}

	return replaced;
};
const contextVariables = (next: string): Array<{ key: string; replace: () => string }> => [
	{key: 'NEXT_VERSION', replace: (): string => next},
];
export const getTitle  = (next: string): string => replaceVariables(getTitleTemplate(), contextVariables(next));

export const getPrHeadRef = (context: Context): string => context.payload.pull_request?.head.ref ?? '';
export const getPrTitle   = (context: Context): string => context.payload.pull_request?.title ?? '';
export const getPrLabels  = (context: Context): Array<string> => (context.payload.pull_request?.labels ?? []).map(item => item.name);
