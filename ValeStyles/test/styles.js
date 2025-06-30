// this test file is designed to be run with Mocha
const assert = require('assert')
const fs = require('fs')
const os = require('os')
const ok = specify
const { spawnSync } = require('node:child_process')
const { escape } = require('lodash')
const { before, describe } = require('node:test')
const yaml = require('js-yaml')
const handlebars = require('handlebars')
const { highlight } = require('./lib/highlight.js')

describe(`Report Vale tests against specific styles - output to file://${process.cwd()}/test/adoc/styles.html`, function () {

  before(function () {

    const tmp = fs.mkdtempSync(`${os.tmpdir()}/vale-test-`)

    const files = fs.readdirSync('test/adoc')

    const tests = files.flatMap(file => {
      const check = file.match(/Test-(.*)\.yml$/)?.[1]
      if (!check) { return [] }

      let test = yaml.load(
        fs.readFileSync(`test/adoc/${file}`, 'utf8'))

      let {flag, compliant, ...config} = test
      return [[
        check,
        config,
        [
          ...writeFixtures(check, flag,      false, tmp),
          ...writeFixtures(check, compliant, true,  tmp)
        ]
      ]]
    })

    vv = spawnSync(
        'vale', [ '-v' ])
    console.log(`Vale version: ${vv.stdout.toString()}`)  

    try {
      vale = spawnSync(
        'vale',
        [
          tmp,
          '--output', 'JSON',
          '--minAlertLevel', 'suggestion',
        ],
      )
    }
    catch (err) {
      console.log("Failed to run vale", err)
    }

    let valeout = JSON.parse(vale.stdout)
    console.log("DIAG", vale.stderr.toString(), vale.stdout.toString())
    console.log(valeout, tmp, fs.readdirSync(tmp),
      fs.readFileSync(`${tmp}/Couchbase.An-compliant-0.txt`, 'utf8'))

    const diag = spawnSync(
        'vale',  ['ls-config'])
    console.log("DIAG", diag.stdout.toString())

    console.log("PWD", process.cwd())

    const results = tests.map(
      function([check, config, fixtures]) {
        const checkresults = fixtures.map((fixture) => {
          const matching =
            valeout[fixture.path]?.filter(
              item => item.Check === check) || []

          const compliant = matching.length == 0

          const html = highlight(fixture.content, matching)

          // xor the compliant flag with the matching results
          // to determine if there is an error
          const error = compliant != fixture.compliant

          return {...config, ...fixture, matching, error, html}
        })
        return {
          check,
          config,
          checkresults,
        }
      }
    )

    const template = handlebars.compile(
      fs.readFileSync('test/adoc/styles.hbs', 'utf8'))
    const html = template({
      results,
      cwd: process.cwd(),
      os: os.platform(),
      version: process.versions.node,
    })
    fs.writeFileSync(
     'test/adoc/styles.html', html, 'utf8')


    for (const result of results) {
      const {check, config, checkresults} = result

      describe(`Check ${check}`, function () {

        if (config.todo) {
          this.skip(`TODO: ${todo}`)
        }

        for (const fixture of checkresults) {
          const {compliant, matching, path, content, error} = fixture
          
          if (compliant) {
            ok(`${check} (compliant)`,
              function () {
                !error ||
                assert.fail(
                  `Expected compliant for ${check}:\n  ${content}\n  but found: ${JSON.stringify(matching, null, 2)}\n  in file: ${path}`)
              }
            )
          }
          else {
            ok(`${check}`,
              function () {
                !error ||
                assert.fail(`Expected to flag ${check}:\n  ${content}\n  in file: ${path}`)
              }
            )
          }
        }
      })
    }
  })
})



function writeFixtures(check, tests, compliant, tmp) {
  return (tests || []).entries().map(
    function ([idx, fixture]) {
      let ext = 'txt'
      let content = fixture
      if (typeof fixture === 'object') {
        [ext, content] = Object.entries(fixture)[0]
      }

      const type = compliant ? 'compliant' : 'flag'

      const path = `${tmp}/${check}-${type}-${idx}.${ext}`

      fs.writeFileSync(path, content, 'utf8')

      const ret = {
        check,
        compliant,
        idx,
        path,
        content,
      }
      return ret
    }
  ).toArray()
}

