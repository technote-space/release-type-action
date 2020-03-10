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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_helper_1 = __importDefault(require("@technote-space/github-action-helper/dist/api-helper"));
const pulls_1 = require("./utils/pulls");
const misc_1 = require("./utils/misc");
exports.execute = (logger, octokit, context) => __awaiter(void 0, void 0, void 0, function* () {
    if (!misc_1.isTargetBranch(context)) {
        logger.info('This is not target branch.');
        return;
    }
    const helper = new api_helper_1.default(octokit, context, logger);
    yield pulls_1.setTitle(logger, helper, octokit, context);
    yield pulls_1.setLabels(logger, octokit, context);
});
