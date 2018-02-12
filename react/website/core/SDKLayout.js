const React = require('react');
const marked = require('marked');
const renderer = new marked.Renderer();
const toSlug = require('./toSlug');

/* Generate custom headings */
// renderer.heading = function (text, level) {
//   var escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
//
//   return '<h' + level + '><a class="anchor instructions" name="' + toSlug(text) + '" id="' + toSlug(text) + '"></a>' + text + '<a class="hash-link instructions" href="#' + toSlug(text) + '"><svg aria-hidden="true" class="octicon octicon-link" height="20" version="1.1" viewBox="0 -3 20 20" width="20"><path d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a></h' + level + '>';
// };

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
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* HACK: To override the AuthX styles (navs, lists) */
.body ul, .body li {
  list-style-type: disc !important;
  line-height: 1.5;
}

.body ul, .inner-content ul {
  list-style-type: disc !important;
}

/* Override AuthX styles */
.body ul ul, .body ul ul li {
  list-style-type: circle !important;
  margin: 0 !important;
}
.body ul {
  padding-left: 40px !important;
  margin: 1em 0 !important;
}

a > code {
text-decoration: underline;
color: #0099e5;
background: #f5f7f7;
border-radius: 5px;
padding: 3px 6px;
margin: 0 1px;
}
            `
          }}>
        </style>
        <div className="tabs">
          <a name="swift" style={styles.anchor}>Swift</a>
          <a name="android" style={styles.anchor}>Android</a>
          <a name="csharp" style={styles.anchor}>C#</a>
          <a name="objc" style={styles.anchor}>Objective-C</a>
          <br/><br/>
          <div name="swift" className="tab swift">
            <div
                 dangerouslySetInnerHTML={{
                   __html: marked(this.props.swift, {renderer: renderer})
                 }}>
            </div>
          </div>
          <div name="android" className="tab android">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(this.props.java, {renderer: renderer})
              }}>
            </div>
          </div>
          <div name="csharp" className="tab csharp">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(this.props.csharp, {renderer: renderer})
              }}>
            </div>
          </div>
          <div name="objc" className="tab objc">
            <div
              dangerouslySetInnerHTML={{
                __html: marked(this.props.objc, {renderer: renderer})
              }}>
            </div>
          </div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                setTimeout(function() {
                  var utilities = document.querySelectorAll('.utilities');
                  for (var i=0; i < utilities.length; i++) {
                    utilities[i].style.display = 'none';
                  }
                  
                  var anchors = document.querySelectorAll('.tabs > a');
                  var preselect = false;
                  for (var i=0; i < anchors.length; i++) {
                    anchors[i].href = 'javascript:void(0);';
                    anchors[i].addEventListener('click', handler, false);
                    var languageQuery = getParameterByName('language');
                    var languageCookie = getCookie('mobile-lang');
                    if (languageQuery === anchors[i].name || languageCookie === anchors[i].name) {
                      anchors[i].click();
                      preselect = true;
                    }
                  }
                  
                  if (!preselect) {
                    anchors[0].click();
                    preselect = true;
                  }               
                  
                  function handler() {
                    let selected = this.getAttribute('name');
                    
                    /* Use this.parentNode as the context */
                    var links = this.parentNode.querySelectorAll('.tabs > a');
                    for (var j = 0; j < links.length; j++) {
                      let name = links[j].getAttribute('name');
                      if (selected === name) {
                        links[j].style.backgroundColor = '#4287D6';
                        links[j].style.borderTopRightRadius = '5px';
                        links[j].style.borderTopLeftRadius = '5px';
                        links[j].style.color = 'white';
                      } else {
                        links[j].style.backgroundColor = 'white';
                        links[j].style.color = 'black';
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
                    deleteCookie('mobile-lang');
                    setCookie('mobile-lang', selected, 365);
                    if (preselect) {
                      var newurl = UpdateQueryString('language', selected);
                      window.history.pushState({path: newurl}, '', newurl);
                    }
                  }
                }, 0);
                
                function getParameterByName(name, url) {
                  if (!url) {
                    url = window.location.href;
                  }
                  name = name.replace(/[\\[\\]]/g, "\\\\$&");
                  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                    results = regex.exec(url);
                  if (!results) return null;
                  if (!results[2]) return '';
                  return decodeURIComponent(results[2].replace(/\\+/g, " "));
                }
                
                function UpdateQueryString(key, value, url) {
                  if (!url) url = window.location.href;
                  var re = new RegExp("([?&])" + key + "=.*?(&|#|$)(.*)", "gi"),
                    hash;

                  if (re.test(url)) {
                    if (typeof value !== 'undefined' && value !== null)
                      return url.replace(re, '$1' + key + "=" + value + '$2$3');
                    else {
                      hash = url.split('#');
                      url = hash[0].replace(re, '$1$3').replace(/(&|\\?)$/, '');
                      if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                        url += '#' + hash[1];
                      return url;
                    }
                  }
                  else {
                    if (typeof value !== 'undefined' && value !== null) {
                      var separator = url.indexOf('?') !== -1 ? '&' : '?';
                      hash = url.split('#');
                      url = hash[0] + separator + key + '=' + value;
                      if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                        url += '#' + hash[1];
                      return url;
                    }
                    else
                      return url;
                  }
                }
                
                function setCookie(cname, cvalue, exdays) {
                  var d = new Date();
                  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                  var expires = "expires="+d.toUTCString();
                  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
                }
                function deleteCookie(cname) {
                  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                }
                function getCookie(cname) {
                  var name = cname + "=";
                  var decodedCookie = decodeURIComponent(document.cookie);
                  var ca = decodedCookie.split(';');
                  for(var i = 0; i <ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') {
                      c = c.substring(1);
                    }
                    if (c.indexOf(name) == 0) {
                      return c.substring(name.length, c.length);
                    }
                  }
                  return "";
                }
                
                window.onload = function() {
                  var id = window.location.hash;
                  // document.getElementById(id).scrollIntoView();
                };
              `
          }}/>
      </div>
      </body>
      </html>
    )
  }
}

const styles = {
  anchor: {
    display: 'inlineBlock',
    padding: '5px 20px',
    margin: '2px',
    boarderRadius: '3px',
    textDecoration: 'none !important',
    fontFamily: 'helvetica',
    color: 'black',
    backgroundColor: 'white',
  },
  
};

module.exports = SDKLayout;