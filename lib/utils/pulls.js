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
exports.setLabels = exports.getReleaseLabels = exports.setTitle = void 0;
const constant_1 = require("@technote-space/github-action-version-helper/dist/constant");
const misc_1 = require("./misc");
const version_1 = require("./version");
const setTitle = (logger, helper, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const next = yield (0, version_1.getNextVersion)(logger, helper, octokit, context);
    const title = yield (0, misc_1.getTitle)(next);
    if (title && title !== (0, misc_1.getPrTitle)(context)) {
        yield octokit.rest.pulls.update(Object.assign(Object.assign({}, context.repo), { 'pull_number': context.payload.number, title }));
    }
});
exports.setTitle = setTitle;
const getReleaseLabels = () => {
    const labels = {};
    const major = (0, misc_1.getMajorLabel)();
    const minor = (0, misc_1.getMinorLabel)();
    const patch = (0, misc_1.getPatchLabel)();
    if (major) {
        labels[constant_1.VERSION_BUMP['major']] = major;
    }
    if (minor) {
        labels[constant_1.VERSION_BUMP['minor']] = minor;
    }
    if (patch) {
        labels[constant_1.VERSION_BUMP['patch']] = patch;
    }
    return labels;
};
exports.getReleaseLabels = getReleaseLabels;
const removeLabel = (label, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield octokit.rest.issues.removeLabel(Object.assign(Object.assign({}, context.repo), { 'issue_number': context.payload.number, name: label }));
    }
    catch (error) { // eslint-disable-line @typescript-eslint/no-explicit-any
        // eslint-disable-next-line no-magic-numbers
        if (error.status !== 404) {
            throw error;
        }
    }
});
const setLabels = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    const nextLevel = yield (0, version_1.getNextVersionLevel)(octokit, context);
    const releaseLabels = (0, exports.getReleaseLabels)();
    const prLabels = (0, misc_1.getPrLabels)(context);
    const nextLabel = releaseLabels[nextLevel];
    const labelsToRemove = Object.values(releaseLabels).filter(label => label !== nextLabel && prLabels.includes(label));
    logger.startProcess('Remove label:');
    console.log(labelsToRemove);
    yield Promise.all(labelsToRemove.map(label => removeLabel(label, octokit, context)));
    if (nextLabel && !prLabels.includes(nextLabel)) {
        logger.startProcess('Add label:');
        console.log(nextLabel);
        yield octokit.rest.issues.addLabels(Object.assign(Object.assign({}, context.repo), { 'issue_number': context.payload.number, labels: [nextLabel] }));
    }
    logger.endProcess();
});
exports.setLabels = setLabels;
