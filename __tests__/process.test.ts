/* eslint-disable no-magic-numbers */
import {resolve} from 'path';
import nock from 'nock';
import {
  testEnv,
  disableNetConnect,
  spyOnStdout,
  spyOnSpawn,
  testChildProcess,
  getOctokit,
  generateContext,
  execCalledWith,
  stdoutCalledWith,
  getLogStdout,
  getApiFixture, stdoutContains,
} from '@technote-space/github-action-test-helper';
import {Logger} from '@technote-space/github-action-log-helper';
import {execute} from '../src/process';

const rootDir     = resolve(__dirname, '..');
const fixturesDir = resolve(__dirname, 'fixtures');
const context     = generateContext({
  owner: 'hello',
  repo: 'world',
}, {
  payload: {
    number: 123,
    'pull_request': {
      id: 1,
      number: 123,
      body: 'test body',
      title: 'feat: release v1.2.3',
      head: {
        ref: 'release/v1.2.2',
      },
      base: {
        ref: 'master',
      },
      'html_url': 'https://github.com/octocat/Hello-World/pull/123',
      labels: [{name: 'test'}, {name: 'Release: Patch'}],
    },
  },
});

afterEach(() => {
  Logger.resetForTesting();
});

describe('execute', () => {
  testEnv(rootDir);
  testChildProcess();
  disableNetConnect(nock);

  it('should do nothing', async() => {
    const mockExec   = spyOnSpawn();
    const mockStdout = spyOnStdout();

    await execute(new Logger(), getOctokit(), generateContext({}));

    execCalledWith(mockExec, []);
    stdoutCalledWith(mockStdout, [
      '> This is not target branch.',
    ]);
  });

  it('should update title', async() => {
    const mockExec   = spyOnSpawn();
    const mockStdout = spyOnStdout();
    const fn         = jest.fn();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list1'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'))
      .get('/repos/hello/world/pulls?state=open')
      .reply(200, () => getApiFixture(fixturesDir, 'pulls.list'))
      .patch('/repos/hello/world/pulls/123', body => {
        fn();
        return body;
      })
      .reply(200, () => getApiFixture(fixturesDir, 'pulls.update'));

    await execute(new Logger(), getOctokit(), Object.assign({}, context, {
      payload: Object.assign({}, context.payload, {
        'pull_request': Object.assign({}, context.payload.pull_request, {title: 'test'}),
      }),
    }));

    expect(fn).toBeCalled();
    execCalledWith(mockExec, []);
    stdoutCalledWith(mockStdout, [
      '::group::Target commits:',
      '[]',
      '::endgroup::',
      '> Current version: v1.2.2',
      '> Next version: v1.2.3',
      '::group::Remove label:',
      '[]',
      '::endgroup::',
    ]);
  });

  it('should set labels', async() => {
    const mockStdout = spyOnStdout();
    const fn1        = jest.fn();
    const fn2        = jest.fn();
    const fn3        = jest.fn();

    nock('https://api.github.com')
      .persist()
      .get('/repos/hello/world/pulls/123/commits')
      .reply(200, () => getApiFixture(fixturesDir, 'commit.list2'))
      .get('/repos/hello/world/git/matching-refs/tags%2F')
      .reply(200, () => getApiFixture(fixturesDir, 'repos.git.matching-refs'))
      .get('/repos/hello/world/pulls?state=open')
      .reply(200, () => getApiFixture(fixturesDir, 'pulls.list'))
      .patch('/repos/hello/world/pulls/123')
      .reply(200, () => {
        fn1();
        return getApiFixture(fixturesDir, 'pulls.update');
      })
      .delete('/repos/hello/world/issues/123/labels/Release%3A%20Patch')
      .reply(200, () => fn2())
      .post('/repos/hello/world/issues/123/labels')
      .reply(201, () => fn3());

    await execute(new Logger(), getOctokit(), context);

    expect(fn1).toBeCalled();
    expect(fn2).toBeCalled();
    expect(fn3).toBeCalled();
    stdoutContains(mockStdout, [
      '::group::Target commits:',
      getLogStdout([
        {
          'type': 'feat',
          'message': 'add new features',
          'notes': [
            'BREAKING CHANGE: changed',
          ],
          'sha': '3dcb09b5b57875f334f61aebed695e2e4193db5e',
        },
        {
          'type': 'feat',
          'message': 'add new feature3',
          'notes': [],
          'sha': '4dcb09b5b57875f334f61aebed695e2e4193db5e',
        },
      ]),
      '::endgroup::',
      '> Current version: v1.2.2',
      '> Next version: v2.0.0',
      '::group::Remove label:',
      getLogStdout([
        'Release: Patch',
      ]),
      '::endgroup::',
      '::group::Add label:',
      '"Release: Major"',
      '::endgroup::',
    ]);
  });
});
