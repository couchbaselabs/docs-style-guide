const {highlight} = require('./lib/highlight.js')
const assert = require('assert')

text =
`This is a test for highlighting.
With some words that should be highlighted.
And some that aren't.`

const checks = [
    {
        Line: 1,
        Span: [11,14]
    },
    {
        Line: 2,
        Span: [11,15]
    },
    {
        Line: 2,
        Span: [22,27]
    },
    {
        Line: 3,
        Span: [5,8]
    }
]
it(`should highlight words correctly`, function () {
    assert.deepEqual(
        highlight(text, checks),
        'This is a <mark>test</mark> for highlighting.\n' +
        'With some <mark>words</mark> that <mark>should</mark> be highlighted.\n' +
        'And <mark>some</mark> that aren&#39;t.'
    );
})