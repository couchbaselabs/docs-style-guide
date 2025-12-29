const {range, zip, escape} = require('lodash');

// this test file is designed to be run with Mocha
const assert = require('assert')
const fs = require('fs')
const ok = specify
const { spawnSync } = require('node:child_process')

// This test currently fails due to bug in dasel
describe.skip('check spans for Yaml', function () {
  testSpans('test/fixtures/test.yml')
})

describe('check spans for Asciidoc', function () {
  testSpans('test/fixtures/basic.adoc')
})

function testSpans(file) {
  const vale = runVale(file)

  const text = fs.readFileSync(file).toString()
  const lines = text.match(/^.*?(\n|$)/gm)

  for (const item of vale[file]) {
    const line = lines[item.Line - 1]
    const [from,to] = item.Span
    const span = line.substr(from - 1, to-from+1)

    ok(`Match ${item.Match}`, function () {
      assert.equal(item.Match, span)
      console.log({line, span, match: item.Match})
    })
  }
}

function runVale(file) {
  let vale
  try {
    vale = spawnSync(
      'vale',
      [
        '--output', 'JSON',
        file
      ]
    )
  }
  catch (err) {
    console.log("Failed to run vale", err)
  }

  return JSON.parse(vale.stdout)
}
