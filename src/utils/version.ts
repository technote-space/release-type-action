import { Context } from '@actions/github/lib/context';
import { Octokit } from '@octokit/rest';
import { Commit, Version } from '@technote-space/github-action-version-helper';
import { Logger, ApiHelper } from '@technote-space/github-action-helper';
import { getBreakingChangeNotes, getExcludeMessages, getMinorUpdateCommitTypes } from './misc';

export const getNextVersion = async(logger: Logger, helper: ApiHelper, octokit: Octokit, context: Context): Promise<string> => Version.getNextVersion(getMinorUpdateCommitTypes(), getExcludeMessages(), getBreakingChangeNotes(), helper, octokit, context, logger);

export const getNextVersionLevel = async(octokit: Octokit, context: Context): Promise<number> => Version.getNextVersionLevel(getMinorUpdateCommitTypes(), await Commit.getCommits(getMinorUpdateCommitTypes(), getExcludeMessages(), getBreakingChangeNotes(), octokit, context));