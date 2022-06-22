/* eslint-disable no-magic-numbers */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resolve } from 'path';
import nock from 'nock';
import { Context } from '@actions/github/lib/context';
import { ApiHelper } from '@technote-space/github-action-helper';
import { Logger } from '@technote-space/github-action-log-helper';
import { generateContext, testEnv, getOctokit, disableNetConnect, getApiFixture, spyOnStdout, stdoutCalledWith, getLogStdout } from '@technote-space/github-action-test-helper';
import { setTitle, getReleaseLabels, setLabels } from './pulls';

const rootDir      = resolve(__dirname, '../..');
const fixturesDir  = resolve(__dirname, '..', 'fixtures');
const octokit      = getOctokit();
const logger       = new Logger();
const getApiHelper = (context: Context): ApiHelper => new ApiHelper(octokit, context, logger);

afterEach(() => {
  Logger.resetForTesting();
});

describe('setTitle', () => {
  testEnv(rootDir);
  disableNetConnect(nock);

  it('should not set title 1', async() => {
    process.env.INPUT_TITLE_TEMPLATE = '';
    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list1'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'));

    const context = generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
      },
    });
    await setTitle(logger, getApiHelper(context), octokit, context);
  });

  it('should not set title 1', async() => {
    process.env.INPUT_TITLE_TEMPLATE = 'test';
    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list1'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'));

    const context = generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
        'pull_request': {
          title: 'test',
        },
      },
    });
    await setTitle(logger, getApiHelper(context), octokit, context);
  });

  it('should set title', async() => {
    const fn = vi.fn();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list2'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'))
      .patch('/repos/hello/world/pulls/123', body => {
        fn();
        return body;
      })
      .reply(200);

    const context = generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
      },
    });
    await setTitle(logger, getApiHelper(context), octokit, context);

    expect(fn).toBeCalled();
  });
});

describe('getReleaseLabels', () => {
  testEnv(rootDir);

  it('should get major', () => {
    process.env.INPUT_MAJOR_LABEL = 'major';
    process.env.INPUT_MINOR_LABEL = '';
    process.env.INPUT_PATCH_LABEL = '';
    expect(getReleaseLabels()).toEqual({
      0: 'major',
    });
  });

  it('should get minor', () => {
    process.env.INPUT_MAJOR_LABEL = '';
    process.env.INPUT_MINOR_LABEL = 'minor';
    process.env.INPUT_PATCH_LABEL = '';
    expect(getReleaseLabels()).toEqual({
      1: 'minor',
    });
  });

  it('should get patch', () => {
    process.env.INPUT_MAJOR_LABEL = '';
    process.env.INPUT_MINOR_LABEL = '';
    process.env.INPUT_PATCH_LABEL = 'patch';
    expect(getReleaseLabels()).toEqual({
      2: 'patch',
    });
  });

  it('should get labels', () => {
    expect(getReleaseLabels()).toEqual({
      0: 'Release: Major',
      1: 'Release: Minor',
      2: 'Release: Patch',
    });
  });
});

describe('setLabels', () => {
  testEnv(rootDir);
  disableNetConnect(nock);

  it('should do nothing', async() => {
    process.env.INPUT_MAJOR_LABEL = '';

    const mockStdout = spyOnStdout();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list2'))
      .get('/repos/hello/world/git/matching-refs/tags%2F');

    await setLabels(logger, octokit, generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
      },
    }));

    stdoutCalledWith(mockStdout, [
      '::group::Remove label:',
      '[]',
      '::endgroup::',
    ]);
  });

  it('should add label', async() => {
    const mockStdout = spyOnStdout();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list2'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'))
      .post('/repos/hello/world/issues/123/labels')
      .reply(201);

    await setLabels(logger, octokit, generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
      },
    }));

    stdoutCalledWith(mockStdout, [
      '::group::Remove label:',
      '[]',
      '::endgroup::',
      '::group::Add label:',
      '"Release: Major"',
      '::endgroup::',
    ]);
  });

  it('should remove labels', async() => {
    const mockStdout = spyOnStdout();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list2'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'))
      .post('/repos/hello/world/issues/123/labels')
      .reply(201)
      .delete('/repos/hello/world/issues/123/labels/Release%3A%20Patch')
      .reply(200);

    await setLabels(logger, octokit, generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
        'pull_request': {
          labels: [{ name: 'test' }, { name: 'Release: Patch' }],
        },
      },
    }));

    stdoutCalledWith(mockStdout, [
      '::group::Remove label:',
      getLogStdout(['Release: Patch']),
      '::endgroup::',
      '::group::Add label:',
      '"Release: Major"',
      '::endgroup::',
    ]);
  });

  it('should not throw error if label not found', async() => {
    const mockStdout = spyOnStdout();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list2'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'))
      .post('/repos/hello/world/issues/123/labels')
      .reply(201)
      .delete('/repos/hello/world/issues/123/labels/Release%3A%20Patch')
      .reply(404);

    await setLabels(logger, octokit, generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
        'pull_request': {
          labels: [{ name: 'test' }, { name: 'Release: Patch' }],
        },
      },
    }));

    stdoutCalledWith(mockStdout, [
      '::group::Remove label:',
      getLogStdout(['Release: Patch']),
      '::endgroup::',
      '::group::Add label:',
      '"Release: Major"',
      '::endgroup::',
    ]);
  });

  it('should throw error', async() => {
    const mockStdout = spyOnStdout();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list2'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'))
      .post('/repos/hello/world/issues/123/labels')
      .reply(201)
      .delete('/repos/hello/world/issues/123/labels/Release%3A%20Patch')
      .reply(500);

    await expect(setLabels(logger, octokit, generateContext({
      owner: 'hello',
      repo: 'world',
    }, {
      payload: {
        number: 123,
        'pull_request': {
          labels: [{ name: 'test' }, { name: 'Release: Patch' }],
        },
      },
    }))).rejects.toThrow();

    stdoutCalledWith(mockStdout, [
      '::group::Remove label:',
      getLogStdout(['Release: Patch']),
    ]);
  });
});
