// this test file is designed to be run with Mocha
const assert = require('assert')
const fs = require('fs')
const ok = specify
const asciidoctor = require('asciidoctor')()
const { spawnSync } = require('node:child_process')
const { escape } = require('lodash')

let tests = []
asciidoctor.Extensions.register(function () {
  this.block(function () {
    const self = this
    self.named('vale')
    self.onContext('open')
    self.positionalAttributes(['check', 'compliant'])
    self.process(function (parent, reader, {check, compliant}) {
['compliant'] || false
      if (!check) {
        throw new Error('Vale check name is required')
      }
      console.log(`Running vale check: ${check}`)

      let lines = reader.getLines()

      let vale
      try {
        vale = spawnSync(
          'vale',
          [
            '--output', 'JSON',
            '--ext', '.adoc',
            '--minAlertLevel', 'suggestion',
          ],
          { input: lines.join('\n') }
        )
      }
      catch (err) {
        console.log("Failed to run vale", err)
      }

      let checks = JSON.parse(vale.stdout)
        ['stdin.adoc']
        || []

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

  let html = content
  if (flagged) {
    icon = ok  ? '👎' : '❌'
    let [from, to] = flagged.Span
    from-- // Vale Span is weird

    const [pre,marked,post] = [
      escape(content.slice(0, from)),
      content.slice(from, to),
      escape(content.slice(to))
    ]

    assert.equal(
      marked, 
      flagged.Match, 
      `Marked content error: ${marked} !== ${flagged.Match}`
    )
    const message = escape(flagged.Message)

    html = `${pre}<mark title="${message}">${escape(marked)}</mark>${post}`
  }
  else {
    icon = ok  ? '👍' : '❌'
  }

  html = html.replace(/^\*\s*/, '') // remove leading asterisk
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


