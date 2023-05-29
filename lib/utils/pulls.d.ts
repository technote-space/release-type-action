import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper';
import type { ApiHelper } from '@technote-space/github-action-helper';
import type { Logger } from '@technote-space/github-action-log-helper';
export declare const setTitle: (logger: Logger, helper: ApiHelper, octokit: Octokit, context: Context) => Promise<void>;
export declare const getReleaseLabels: () => {
    [key: number]: string;
};
export declare const setLabels: (logger: Logger, octokit: Octokit, context: Context) => Promise<void>;
