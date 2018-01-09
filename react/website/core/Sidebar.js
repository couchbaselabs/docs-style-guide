const React = require('react');
const toc = require('markdown-toc');
const Remarkable = require('remarkable');
let md = new Remarkable();
let md_toc = new Remarkable();

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

class Sidebar extends React.Component {
  
  render() {
    md_toc.use(toc.plugin({
      maxdepth: 2
    }));
    let toc_output = md_toc.render(this.props.content);

    let ids = cleanArray(toc_output
      .json
      .map(el => {
        if (el.lvl < 3) {
          return `${el.slug}`;
        } else {
          return null;
        }
      }));
    
    return (
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: md.render(toc_output.content)
          }}>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              setTimeout(function() {
                let itemTopOffsets = ${JSON.stringify(ids)}
                  .map(id => {
                    var element = document.getElementById(id);
                    return {id: id, offsetTop: element.offsetTop};
                  });
                var activeId = false;
                window.addEventListener('scroll', function() {
                  let active
                  let item = itemTopOffsets.find((itemTopOffset, i) => {
                    let nextItemTopOffset = itemTopOffsets[i + 1];
                    if (nextItemTopOffset) {
                      return (
                        window.scrollY >= itemTopOffset.offsetTop &&
                        window.scrollY < nextItemTopOffset.offsetTop
                      );
                    }
                    return window.scrollY >= itemTopOffset.offsetTop;
                  });
                  if (activeId && activeId != item.id) {
                    let currentActive = document.querySelectorAll("a[href='#" + activeId + "']")[0];
                    currentActive.style.fontWeight = 'normal';
                    let nextActive = document.querySelectorAll("a[href='#" + item.id + "']")[0];
                    nextActive.style.fontWeight = 'bold';
                  }
                  activeId = item.id;
                });
              }, 0);
            `
          }}/>
      </div>
    )
  }
}

module.exports = Sidebar;