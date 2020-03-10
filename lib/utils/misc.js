"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const github_action_helper_1 = require("@technote-space/github-action-helper");
const core_1 = require("@actions/core");
exports.getMinorUpdateCommitTypes = () => github_action_helper_1.Utils.getArrayInput('MINOR_UPDATE_TYPES');
exports.getExcludeMessages = () => github_action_helper_1.Utils.getArrayInput('EXCLUDE_MESSAGES');
exports.getBreakingChangeNotes = () => github_action_helper_1.Utils.getArrayInput('BREAKING_CHANGE_NOTES');
exports.getBranchName = () => core_1.getInput('BRANCH_NAME');
exports.getBranchPrefix = () => core_1.getInput('BRANCH_PREFIX');
const getTitleTemplate = () => core_1.getInput('TITLE_TEMPLATE');
exports.getMajorLabel = () => core_1.getInput('MAJOR_LABEL');
exports.getMinorLabel = () => core_1.getInput('MINOR_LABEL');
exports.getPatchLabel = () => core_1.getInput('PATCH_LABEL');
const contextVariables = (next) => [
    { key: 'NEXT_VERSION', replace: () => next },
];
exports.getTitle = (next) => github_action_helper_1.Utils.replaceVariables(getTitleTemplate(), contextVariables(next));
exports.getPrHeadRef = (context) => { var _a, _b; return (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head.ref) !== null && _b !== void 0 ? _b : ''; };
exports.getPrTitle = (context) => { var _a, _b; return (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : ''; };
exports.getPrLabels = (context) => { var _a, _b; return ((_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.labels) !== null && _b !== void 0 ? _b : []).map(item => item.name); };
exports.isTargetBranch = (context) => {
    const branch = exports.getBranchName();
    const prefix = exports.getBranchPrefix();
    if (!branch && !prefix) {
        throw new Error('Branch target setting is required.');
    }
    if (branch) {
        return branch === exports.getPrHeadRef(context);
    }
    return !!(prefix && github_action_helper_1.Utils.getPrefixRegExp(prefix).test(exports.getPrHeadRef(context)));
};
