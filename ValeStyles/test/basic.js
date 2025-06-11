// this test file is designed to be run with Mocha
const assert = require('assert')
const fs = require('fs')
const ok = specify
const { spawnSync } = require('node:child_process')

console.log(process.cwd())

describe('run vale against test files', function () {

  let vale
  try {
    vale = spawnSync(
      'vale',
      [
        '--output', 'JSON',
        'test/fixtures/'
      ]
    )
  }
  catch (err) {
    console.log("Failed to run vale", err)
  }

  const output = JSON.parse(vale.stdout)

  for (const [file, actual] of Object.entries(output)) {
    ok(`testing ${file}`, function () {

      for (const item of actual) {
        delete item.Line
        delete item.Span
      }

      fs.writeFileSync(`${file}.actual`, JSON.stringify(actual, null, 2), 'utf8')
      
      try {
        const expected = JSON.parse(fs.readFileSync(`${file}.expected`, 'utf8'))
        assert.deepEqual(actual, expected)
      }
      catch (err) {
        if (err.code === 'ENOENT') {
          assert.fail(`No expected file found for ${file}, skipping comparison.`)
        } else {
          throw err
        }
      }
    })
  }
})


