import React from "react"
import ReactDOM from "react-dom"
import marked from "marked"
import "whatwg-fetch"

module.exports = function ConfigUI(opts) {
  console.log(opts.specs);
  ReactDOM.render(<StandaloneLayout specs={opts.specs} />, document.getElementById('swagger-ui'));
};

export default class StandaloneLayout extends React.Component {
  
  constructor() {
    super();
    this.state = {
      specs: []
    };
  }
  
  componentWillMount() {
  }

  render() {
    
    let markdownString = '```json\n ' + JSON.stringify(this.state.specs, null, 2) + '\n```';
    let renderer = new marked.Renderer();
    renderer.code = function(code, lang, escaped) {
      
    };
    
    console.log(marked(markdownString));
    
    return (
      <div className="docs-ui">
        <div className="drawer">
          <div className="left-nav">
            <a className="toc-item" href="javascript:;">
              <i>1</i>
              <span>Query</span>
            </a>
          </div>
        </div>
        <div className="opblock-tag no-desc">
          <div className="opblock">
            <div className="opblock-summary">
              <span className="opblock-summary-method">POST</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

}

