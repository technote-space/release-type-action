"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTargetBranch = exports.getPrLabels = exports.getPrTitle = exports.getPrHeadRef = exports.getTitle = exports.getPatchLabel = exports.getMinorLabel = exports.getMajorLabel = exports.getBranchPrefix = exports.getBranchName = exports.getBreakingChangeNotes = exports.getExcludeMessages = exports.getMinorUpdateCommitTypes = void 0;
const github_action_helper_1 = require("@technote-space/github-action-helper");
const core_1 = require("@actions/core");
const getMinorUpdateCommitTypes = () => github_action_helper_1.Utils.getArrayInput('MINOR_UPDATE_TYPES');
exports.getMinorUpdateCommitTypes = getMinorUpdateCommitTypes;
const getExcludeMessages = () => github_action_helper_1.Utils.getArrayInput('EXCLUDE_MESSAGES');
exports.getExcludeMessages = getExcludeMessages;
const getBreakingChangeNotes = () => github_action_helper_1.Utils.getArrayInput('BREAKING_CHANGE_NOTES');
exports.getBreakingChangeNotes = getBreakingChangeNotes;
const getBranchName = () => (0, core_1.getInput)('BRANCH_NAME');
exports.getBranchName = getBranchName;
const getBranchPrefix = () => (0, core_1.getInput)('BRANCH_PREFIX');
exports.getBranchPrefix = getBranchPrefix;
const getTitleTemplate = () => (0, core_1.getInput)('TITLE_TEMPLATE');
const getMajorLabel = () => (0, core_1.getInput)('MAJOR_LABEL');
exports.getMajorLabel = getMajorLabel;
const getMinorLabel = () => (0, core_1.getInput)('MINOR_LABEL');
exports.getMinorLabel = getMinorLabel;
const getPatchLabel = () => (0, core_1.getInput)('PATCH_LABEL');
exports.getPatchLabel = getPatchLabel;
const contextVariables = (next) => [
    { key: 'NEXT_VERSION', replace: () => next },
];
const getTitle = (next) => github_action_helper_1.Utils.replaceVariables(getTitleTemplate(), contextVariables(next));
exports.getTitle = getTitle;
const getPrHeadRef = (context) => { var _a, _b; return (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.head.ref) !== null && _b !== void 0 ? _b : ''; };
exports.getPrHeadRef = getPrHeadRef;
const getPrTitle = (context) => { var _a, _b; return (_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.title) !== null && _b !== void 0 ? _b : ''; };
exports.getPrTitle = getPrTitle;
const getPrLabels = (context) => { var _a, _b; return ((_b = (_a = context.payload.pull_request) === null || _a === void 0 ? void 0 : _a.labels) !== null && _b !== void 0 ? _b : []).map(item => item.name); };
exports.getPrLabels = getPrLabels;
const isTargetBranch = (context) => {
    const branch = (0, exports.getBranchName)();
    const prefix = (0, exports.getBranchPrefix)();
    if (!branch && !prefix) {
        throw new Error('Branch target setting is required.');
    }
    if (branch) {
        return branch === (0, exports.getPrHeadRef)(context);
    }
    return !!(prefix && github_action_helper_1.Utils.getPrefixRegExp(prefix).test((0, exports.getPrHeadRef)(context)));
};
exports.isTargetBranch = isTargetBranch;
