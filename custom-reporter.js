import * as fs from "fs";
import * as readPkg from 'read-pkg';

export default function (testResults) {
    const testResultsString = JSON.stringify(testResults, null, 2);
    let output = {}
    let results = testResults.testResults[0].testResults;
    let failedTestCases = []
    let temp = {};
    results.forEach(testCase => {
        if (temp.hasOwnProperty(testCase.ancestorTitles[0])) {
            let testSuite = temp[testCase.ancestorTitles[0]];
            let tc = {
                "passed": testCase.status === 'passed',
                "description": testCase.title
            }
            testSuite.splice(testSuite.length, 0, tc);
            temp[testCase.ancestorTitles[0]] = testSuite;
            if (testCase.status === 'failed') {
                failedTestCases.push(testCase.title);
            }
        } else {
            temp[testCase.ancestorTitles[0]] = [
                {
                    "passed": testCase.status === 'passed',
                    "description": testCase.title
                }
            ]
            if (testCase.status === 'failed') {
                failedTestCases.push(testCase.title);
            }
        }
    });
    let testSuites = []
    for (const [key, value] of Object.entries(temp)) {
        let ts = {
            suiteName: key,
            passed: value.every((tc) => tc.passed),
            testCases: value
        }
        testSuites.push(ts)
    }
    let count = {
        "total": testSuites.length,
        "passed": testSuites.filter((obj) => obj.passed === true).length
    }
    let percentageScore = (count["passed"] / count["total"]) * 100
    output = {
        "runtime": testResults.testResults[0].perfStats.runtime,
        "percentageScore": percentageScore
    }
    output["count"] = count;
    output["failedTestCases"] = failedTestCases;
    output["suites"] = testSuites
    let outputString = JSON.stringify(output, null, 2)

    const packagedData = readPkg.sync(process.cwd())
    const config = packagedData.jestJsonReporter || {};

    const outputFile = config.outputFile || './test-results.json';

    fs.writeFile(outputFile, outputString, (err) => {
        if (err) {
            console.warn('Unable to write test results JSON', err);
        }
    });

    return outputString;
};