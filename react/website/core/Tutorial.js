const React = require('react');
const Sidebar = require('./Sidebar');
const Remarkable = require('remarkable');
const md = new Remarkable();
const toSlug = require('./toSlug');
const marked = require('marked');
const renderer = new marked.Renderer();
const cheerio = require('cheerio');

/**
 * The anchors plugin adds GFM-style anchors to headings.
 */
function anchors(md) {
  md.renderer.rules.heading_open = function(tokens, idx /*, options, env */) {
    const textToken = tokens[idx + 1];
    return (
      '<h' +
      tokens[idx].hLevel +
      '><a class="anchor" id="' + toSlug(textToken.content) + '" aria-hidden="true" name="' +
      toSlug(textToken.content) +
      '"></a><a href="#' +
      toSlug(textToken.content) +
      '" aria-hidden="true" class="hash-link" ><svg aria-hidden="true" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>'
    );
  };
}

class Tutorial extends React.Component {
  
  render() {
    md.use(anchors);

    /* Generate custom headings */
    renderer.heading = function (text, level) {
      var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText +
        '"><span class="header-link"></span></a>' +
        text + '</h' + level + '>';
    };
    
    let content_html = marked(this.props.content, {renderer: renderer});
    let $ = cheerio.load(content_html);
    
    /* Find the <div class="tabs"></div> fragment. */
    $('.tabs')
      .each((tabs_i, tabs_div) => {
        /* Find the tab names. */
        let tab_names = $('.tabs a')
          .map((names_i, elem) => {
            let name = elem.attribs.name;
            /* Insert a div tag after the div.tabs fragment. */
            $(tabs_div)
              .append('<div class="tab ' + name + '">' + name + '</div>');

            /**
             * Append all following siblings to <div class="tab ${name}"></div>,
             * use <hr /> as the delimiter tag.
             */
            $(tabs_div)
              .nextUntil('hr')
              .each((i, elem) => {
                if ($(elem).next().is('hr')) {
                  $(elem).next().remove()
                } else {
                  $(elem).appendTo(`div.${name}`);
                }
              });
            return name
          }).get();
      });

    return (
        <div>
          <div className="sidebar">
            <div className="sidebar-content">
              <Sidebar
                content={this.props.content} />
            </div>
          </div>
          <div className="content-container">
            <div className="content"
              dangerouslySetInnerHTML={{
                __html: $.html()
              }}>
            </div>
          </div>
        </div>
    )
  }
  
  
}

function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

module.exports = Tutorial;