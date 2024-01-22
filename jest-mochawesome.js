/* eslint-disable no-console */
// based on https://gist.github.com/dopry/691e6b21170b55c41768d02dc059c48b
'use strict';

const fs = require('fs');
const { v4: uuid } = require('uuid');
const { BaseReporter } = require('@jest/reporters');

class JestMochawesomeReporter extends BaseReporter {
  constructor(globalConfig, options) {
    super(globalConfig, options);

    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(_, results) {
    const report = this._buildMargeInput(results);

    this._writeReport(report);
  }

  _writeReport(report) {
    const outputDir = this._options.outputDir || this._globalConfig.rootDir;
    const outputName = this._options.outputName || 'jest-mochawesome';

    this._writeOutput(
      report,
      `${outputDir}/${outputName}.json`,
    );
  }

  _buildElapsedTime(suites) {
    return suites.reduce((sum, _suite) => {
      return sum + _suite.testResults.reduce((_sum, _test) => {
        return _sum + _test.duration;
      }, 0);
    }, 0);
  }

  _writeOutput(payload, filepath) {
    const json = JSON.stringify(payload);

    fs.writeFile(filepath, json, 'utf8', (err) => {
      if (err) {
        throw err;
      }

      console.log(`Test results written to ${filepath}`);
    });
  }

  _getFullTitle(_test) {
    const ancestors = _test.ancestorTitles.reduce((sum, val) => {
      return sum + val + ' > ';
    }, '');

    return ancestors + _test.title;
  }

  _isPending(_test) {
    return _test.status === 'pending';
  }

  _isPassed(_test) {
    return _test.status === 'passed';
  }

  _isFailed(_test) {
    return _test.status === 'failed';
  }

  _createTest(_test, parentId) {
    const pass = this._isPassed(_test);
    const fail = this._isFailed(_test);
    const pending = this._isPending(_test);

    return {
      title: this._getFullTitle(_test),
      fullTitle: _test.fullName,
      timedOut: false,
      duration: _test.duration,
      pass,
      fail,
      pending,
      code: '',
      uuid: uuid(),
      parentUUID: parentId,
      skipped: false,
      isHook: false,
      err: (
        fail
          ? this._getErrorLogForTest(_test)
          : {}
      ),
    };
  }

  _removeANSIEscapeCodes(input) {
    // eslint-disable-next-line no-control-regex
    const ansiEscapeCodes = /\x1B\[[0-9;]*[A-Za-z]/g;

    return input.replace(ansiEscapeCodes, '');
  }

  _getErrorLogForTest(_test) {
    const errorLog = {
      message: 'Test failed (click to view stacktrace)',
      estack: '',
    };

    if (_test.failureMessages && _test.failureMessages.length > 0) {
      errorLog.estack = this._removeANSIEscapeCodes(_test.failureMessages[0]);
    }

    return errorLog;
  }

  _createSuite(_suite) {
    const id = uuid();
    const tests = _suite.testResults.map((_test) => {
      return this._createTest(_test, id);
    });

    const passes = tests
      .filter((_test) => _test.pass)
      .map((_test) => _test.uuid);
    const failures = tests
      .filter((_test) => _test.fail)
      .map((_test) => _test.uuid);
    const pending = tests
      .filter((_test) => _test.pending)
      .map((_test) => _test.uuid);

    return {
      title: _suite.testResults[0].ancestorTitles[0],
      suites: [],
      tests: tests,
      pending: pending,
      root: false,
      uuid: id,
      _timeout: 5000,
      fullFile: _suite.testFilePath,
      file: _suite.testFilePath.split('/').pop(),
      beforeHooks: [],
      afterHooks: [],
      passes: passes,
      failures: failures,
      skipped: [],
      duration: _suite.perfStats.end - _suite.perfStats.start,
    };
  }

  _buildMargeInput(testResults) {
    const elapsed = this._buildElapsedTime(testResults.testResults);
    const testSuites = testResults.testResults.map((_suite) => {
      return this._createSuite(_suite);
    });
    const input = {};

    input.stats = {
      suites: testResults.numTotalTestSuites,
      tests: testResults.numTotalTests,
      testsRegistered: testResults.numTotalTests,
      passes: testResults.numPassedTests,
      pending: testResults.numPendingTests,
      failures: testResults.numFailedTests,
      start: new Date(testResults.startTime),
      end: new Date(testResults.startTime + elapsed),
      duration: elapsed,
      passPercent: testResults.numPassedTests / testResults.numTotalTests * 100,
      pendingPercent: (
        testResults.numPendingTests / testResults.numTotalTests * 100
      ),
      other: 0,
      hasOther: false,
      skipped: 0,
      hasSkipped: false,
    };
    input.results = testSuites;

    return input;
  };
}

module.exports = JestMochawesomeReporter;
