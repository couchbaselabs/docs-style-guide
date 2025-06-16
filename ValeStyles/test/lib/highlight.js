const {range, zip, escape} = require('lodash');

module.exports = { highlight }

function highlight(text, checks) {

    // convert the text into an array of indexed lines, in the form:
    // [
    //   [[1,1], 'This is a test for highlighting.'],
    //   [[2,1], 'With some words that should be highlighted.'],
    //   [[3,1], 'And some that aren\'t.']
    // ]
    // (With 1-based line and column numbers as per Vale's output)

    const lines = text.match(/^.*?(\n|$)/gm)
    const len = lines.length
    const lineNumbers = range(1, len + 1)
    const colNumbers = Array(len).fill(1)
    const zipped = 
        zip(zip(lineNumbers, colNumbers),
            lines)

    // Now we have the lines indexed, we can highlight the checks
    const highlights = _highlight(zipped, checks, [])
    return highlights.map(({text, highlighted}) => {
        const html = escape(text)
        return highlighted ? `<mark>${html}</mark>` : html
    }).join('')
}

function _highlight(lines, checks, highlights) {

    // Terminating case: if there are no checks or lines left, 
    // return the highlights
    if (checks.length === 0) {
        // in this case also return the remaining lines as unhighlighted text
        return [...highlights, ...lines.map(([_, text]) => ({ text }))];
    }

    if (lines.length === 0) { return highlights }

    const [check, ...restChecks] = checks
    const [[[line, col], text], ...rest] = lines

    if (line == check.Line) {
        let {Span: [start, end]} = check

        // Adjust start and end to be relative to the line's text 
        start -= col
        end -= col

        if (start < 0 || end > text.length) {
            // If the adjusted span is out of bounds, skip this check
            // (e.g. in case Vale allows overlapping spans?)
            // If that isn't an edge case, we could simply
            // throw an error here instead.
            return _highlight(rest, checks, highlights)
        }

        if (end > 1) {
            highlights.push({
                text: text.slice(0, start)
            })
        }

        highlights.push({
            text: text.slice(start, end + 1),
            highlighted: true
        })
        if (end < text.length) {
            // If there is text after the highlighted span, 
            // return it to the `rest` array for further processing
            rest.unshift([
                [line, col + end + 1],
                text.slice(end + 1)
            ])
        }

        return _highlight(rest, restChecks, highlights)
    }
    else {
        highlights.push({ text })
        return _highlight(rest, checks, highlights)
    
    }
}