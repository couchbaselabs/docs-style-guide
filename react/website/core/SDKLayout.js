const React = require('react');
const marked = require('marked');
const renderer = new marked.Renderer();

class SDKLayout extends React.Component {
  render() {
    return (
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Title</title>
      </head>
      <body>
      <div className="body">
        <div className="tabs">
          <a name="swift">Swift</a>
          <a name="android">Android</a>
          <a name="csharp">C#</a>
          <a name="objc">Objective-C</a>
          <div name="swift" className="tab swift">
            <div
                 dangerouslySetInnerHTML={{
                   __html: marked(this.props.swift)
                 }}>
            </div>
          </div>
          <div name="android" className="tab android">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(this.props.java)
              }}>
            </div>
          </div>
          <div name="csharp" className="tab csharp">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(this.props.csharp)
              }}>
            </div>
          </div>
          <div name="objc" className="tab objc">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(this.props.objc)
              }}>
            </div>
          </div>
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
      </body>
      </html>
    )
  }
}

module.exports = SDKLayout;