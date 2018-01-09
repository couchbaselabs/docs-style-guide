const React = require('react');
const Sidebar = require('./Sidebar');
const Remarkable = require('remarkable');
const md = new Remarkable();
const toSlug = require('./toSlug');
const marked = require('marked');
const renderer = new marked.Renderer();
const cheerio = require('cheerio');

class Tutorial extends React.Component {
  
  render() {
    /* Generate custom headings */
    renderer.heading = function (text, level) {
      var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');

      return '<h' + level + '><a class="anchor instructions" name="' + toSlug(text) + '" id="' + toSlug(text) + '"></a>' + text + '<a class="hash-link instructions" href="#' + toSlug(text) + '"><svg aria-hidden="true" class="octicon octicon-link" height="20" version="1.1" viewBox="0 -3 20 20" width="20"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a></h' + level + '>';
    };
    
    let content_html = marked(this.props.content, {renderer: renderer});
    let $ = cheerio.load(content_html);

    /**
     * Find the <div class="tabs"></div> fragment.
     */
    $('.tabs')
      /* The second parameter serves as the context */
      .each((tabs_i, tabs_div) => {
        /* Find the tab names. */
        let tab_names = $('.tabs a', $(tabs_div))
          .map((names_i, tab_a) => {
            let name = tab_a.attribs.name;
            /* Insert a div tag after the div.tabs fragment. */
            $(tabs_div)
              .append('<div name="' + name + '" class="tab ' + name + '">' + name + '</div>');

            /**
             * Append all following siblings to <div class="tab ${name}"></div>,
             * use <hr /> as the delimiter tag.
             */
            $(tabs_div)
              .nextUntil('hr')
              .each((i, elem) => {
                /* Remove <hr /> for the next pass */
                if ($(elem).next().is('hr')) {
                  $(elem).next().remove();
                }
                $(elem).appendTo($(tabs_div).children(`div.${name}`)[0]);
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
            <div className="content body"
              dangerouslySetInnerHTML={{
                __html: $.html()
              }}>
            </div>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                setTimeout(function() {
                  var anchors = document.querySelectorAll('.tabs > a');
                  for (var i=0; i < anchors.length; i++) {
                    anchors[i].href = 'javascript:void(0);';
                    anchors[i].addEventListener('click', handler, false);
                  }
                  
                  function handler() {
                    let selected = this.getAttribute('name');
                    
                    /* Use this.parentNode as the context */
                    var links = this.parentNode.querySelectorAll('.tabs > a');
                    for (var j = 0; j < links.length; j++) {
                      let name = links[j].getAttribute('name');
                      if (selected === name) {
                        links[j].style.backgroundColor = 'black';
                      } else {
                        links[j].style.backgroundColor = 'white';
                      }
                    }
                    
                    /* Use this.parentNode as the context. */
                    var tabs = this.parentNode.querySelectorAll('.tabs > div');
                    for (var j = 0; j < tabs.length; j++) {
                      let name = tabs[j].getAttribute('name');
                      if (selected === name) {
                        tabs[j].style.display = 'block';
                      } else {
                        tabs[j].style.display = 'none';
                      }
                    }
                  }
                }, 0);
                
                window.onload = function() {
                  var id = window.location.hash;
                  // document.getElementById(id).scrollIntoView();
                };
              `
            }}/>
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