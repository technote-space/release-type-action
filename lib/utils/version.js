"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextVersionLevel = exports.getNextVersion = void 0;
const github_action_version_helper_1 = require("@technote-space/github-action-version-helper");
const misc_1 = require("./misc");
exports.getNextVersion = (logger, helper, octokit, context) => __awaiter(void 0, void 0, void 0, function* () { return github_action_version_helper_1.Version.getNextVersion(misc_1.getMinorUpdateCommitTypes(), misc_1.getExcludeMessages(), misc_1.getBreakingChangeNotes(), helper, octokit, context, logger); });
exports.getNextVersionLevel = (octokit, context) => __awaiter(void 0, void 0, void 0, function* () { return github_action_version_helper_1.Version.getNextVersionLevel(misc_1.getMinorUpdateCommitTypes(), yield github_action_version_helper_1.Commit.getCommits(misc_1.getMinorUpdateCommitTypes(), misc_1.getExcludeMessages(), misc_1.getBreakingChangeNotes(), octokit, context)); });