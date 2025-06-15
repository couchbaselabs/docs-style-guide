// this test file is designed to be run with Mocha
const assert = require('assert')
const fs = require('fs')
const os = require('os')
const ok = specify
const { spawnSync } = require('node:child_process')
const { escape } = require('lodash')
const { before, describe } = require('node:test')
const yaml = require('js-yaml')

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

    const results = tests.map(
      function([check, config, fixtures]) {
        const checkresults = fixtures.map((fixture) => {
          const matching =
            valeout[fixture.path]?.filter(
              item => item.Check === check) || []

          const compliant = matching.length == 0

          // xor the compliant flag with the matching results
          // to determine if there is an error
          const error = compliant != fixture.compliant

          return {...fixture, matching, error}
        })
        return {
          check,
          config,
          checkresults,
        }
      }
    )

    for (const result of results) {
      const {check, config, checkresults} = result

      describe(`Check ${check}`, function () {
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

/*


checks = checks
  .filter(item => item.Check === check)

// return grouped by line number (now zero-indexed)
checks = Object.groupBy(checks, item => parseInt(item.Line - 1))

      const output = lines.entries().map(([line, content]) => {
        return markupFlagged(
          content,
          checks[line]?.[0],
          compliant)
      }).toArray()

      tests.push({
        check,
        compliant,
        output,
        ok: output.every(x => x.ok)
      })

      const html = `<pre>${output.map(x => x.html).join('\n')}</pre>`
      return self.createBlock(parent, 'pass', html )
    })
  })
})

function markupFlagged(content, flagged, compliant) {
  // flagged is a struct from Vale, compliant is boolish
  // we xor them (first coercing) to
  // check that they match
  const ok = !!flagged ^ !!compliant
  let icon

  let html = escape(content)
  if (flagged) {
    icon = ok  ? '👎' : '❌'
    let [from, to] = flagged.Span
    from-- // Vale Span is weird

    let [pre,marked,post] = [
      escape(content.slice(0, from)),
      content.slice(from, to),
      escape(content.slice(to))
    ]
    if (from === 0 && to === 1) {
      // if the flagged content is essentially zero-width,
      // then we'll mark the whole content
      [pre,marked,post] = [
        '',
        content,
        ''
      ]
    }
    else {
      assert.equal(
        marked.trim(),
        flagged.Match.trim(),
        `Marked content error: ${marked} !== ${flagged.Match}`
      )
    }

    const message = escape(flagged.Message)

    html = `${pre}<mark title="${message}">${escape(marked)}</mark>${post}`
  }
  else {
    icon = ok  ? '👍' : '❌'
  }

  html = html.replace(/^\*\s*XXX/, '') // remove leading asterisk
  html = `<li>${icon} ${html}</li>`

  return {
    ok,
    html,
    content,
    message: flagged?.Message
  }
}

const text = fs.readFileSync('test/adoc/styles.adoc', 'utf8').toString()

const html = asciidoctor.convert(text)

fs.writeFileSync('test/adoc/styles.html', html, 'utf8')

describe(`Report Vale tests against specific styles file://${process.cwd()}/test/adoc/styles.html`, function () {

  for (const test of tests) {
    ok(`testing ${test.check} ${test.compliant ? '(compliant)' : '(flagged)'}`, function () {
      assert.ok(test.ok, `Vale check ${test.check} failed}`)
    })
  }
})

*/

/*
      describe(`Check ${check}`, function () {
        for (const fixture of fixtures) {
          const matching =
          )
          if (fixture.compliant) {
            ok(`${check} (compliant)`,
              function () {
                !matching?.length ||
                assert.fail(
                  `Expected compliant for ${check}:\n  ${fixture.content}\n  but found: ${JSON.stringify(matching, null, 2)}`)
              }
            )
          }
          else {
            ok(`${check}`,
              function () {
                matching?.length > 0 ||
                assert.fail(`Expected to flag ${check}:\n  ${fixture.content}`)
              }
            )
          }
          console.log(fixture, matching)
        }
      })

    }
  })
})
*/
