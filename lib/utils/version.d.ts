import type { Context } from '@actions/github/lib/context';
import type { Octokit } from '@technote-space/github-action-helper';
import type { ApiHelper } from '@technote-space/github-action-helper';
import type { Logger } from '@technote-space/github-action-log-helper';
export declare const getNextVersion: (logger: Logger, helper: ApiHelper, octokit: Octokit, context: Context) => Promise<string>;
export declare const getNextVersionLevel: (octokit: Octokit, context: Context) => Promise<number>;