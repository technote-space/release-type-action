/* eslint-disable no-magic-numbers */
import { resolve } from 'path';
import { isTargetEvent } from '@technote-space/filter-github-action';
import { getContext, testEnv } from '@technote-space/github-action-test-helper';
import { getTitle, getPrHeadRef, getPrTitle, getPrLabels, isTargetBranch } from '../../src/utils/misc';
import { TARGET_EVENTS } from '../../src/constant';

const rootDir = resolve(__dirname, '../..');

describe('isTargetEvent', () => {
	testEnv();

	it('should return true', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'opened',
			},
			eventName: 'pull_request',
		}))).toBe(true);
	});

	it('should return false', () => {
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			payload: {
				action: 'closed',
			},
			eventName: 'pull_request',
		}))).toBe(false);
		expect(isTargetEvent(TARGET_EVENTS, getContext({
			eventName: 'push',
		}))).toBe(false);
	});
});

describe('getTitle', () => {
	testEnv(rootDir);

	it('should get title', () => {
		expect(getTitle('v1.2.3')).toBe('feat: release v1.2.3');
	});
});

describe('getPrHeadRef', () => {
	testEnv(rootDir);

	it('should get pr head ref', () => {
		expect(getPrHeadRef(getContext({
			payload: {
				'pull_request': {
					head: {ref: 'test'},
				},
			},
		}))).toBe('test');
		expect(getPrHeadRef(getContext({
			payload: {},
		}))).toBe('');
		expect(getPrHeadRef(getContext({}))).toBe('');
	});
});

describe('getPrTitle', () => {
	testEnv(rootDir);

	it('should get pr title', () => {
		expect(getPrTitle(getContext({
			payload: {
				'pull_request': {
					title: 'test',
				},
			},
		}))).toBe('test');
		expect(getPrTitle(getContext({
			payload: {},
		}))).toBe('');
		expect(getPrTitle(getContext({}))).toBe('');
	});
});

describe('getPrLabels', () => {
	testEnv(rootDir);

	it('should get pr labels', () => {
		expect(getPrLabels(getContext({
			payload: {
				'pull_request': {
					labels: [{name: 'test1'}, {name: 'test 2'}],
				},
			},
		}))).toEqual(['test1', 'test 2']);
		expect(getPrLabels(getContext({
			payload: {},
		}))).toEqual([]);
		expect(getPrLabels(getContext({}))).toEqual([]);
	});
});

describe('isTargetBranch', () => {
	testEnv(rootDir);

	it('should return true 1', () => {
		expect(isTargetBranch(getContext({
			payload: {
				'pull_request': {
					head: {
						ref: 'release/v1.2.3',
					},
				},
			},
		}))).toBe(true);
	});

	it('should return true 1', () => {
		process.env.INPUT_BRANCH_NAME = 'test';
		expect(isTargetBranch(getContext({
			payload: {
				'pull_request': {
					head: {
						ref: 'test',
					},
				},
			},
		}))).toBe(true);
	});

	it('should return false', () => {
		expect(isTargetBranch(getContext({}))).toBe(false);
		expect(isTargetBranch(getContext({
			payload: {
				'pull_request': {
					head: {
						ref: 'test',
					},
				},
			},
		}))).toBe(false);
	});

	it('should throw error', () => {
		process.env.INPUT_BRANCH_PREFIX = '';
		expect(() => isTargetBranch(getContext({}))).toThrow('Branch target setting is required.');
	});
});
