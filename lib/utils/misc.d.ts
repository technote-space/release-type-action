import type { Context } from '@actions/github/lib/context';
export declare const getMinorUpdateCommitTypes: () => Array<string>;
export declare const getExcludeMessages: () => Array<string>;
export declare const getBreakingChangeNotes: () => Array<string>;
export declare const getBranchName: () => string;
export declare const getBranchPrefix: () => string;
export declare const getMajorLabel: () => string;
export declare const getMinorLabel: () => string;
export declare const getPatchLabel: () => string;
export declare const getTitle: (next: string) => Promise<string>;
export declare const getPrHeadRef: (context: Context) => string;
export declare const getPrTitle: (context: Context) => string;
export declare const getPrLabels: (context: Context) => Array<string>;
export declare const isTargetBranch: (context: Context) => boolean | never;