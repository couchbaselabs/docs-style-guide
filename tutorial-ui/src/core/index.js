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
    this.props.specs.map(function(spec) {
      fetch(spec.url)
        .then(res => res.json())
        .then(function(json) {
          let specs = this.state.specs.slice();
          specs.push({version: spec.version, json: json});
          this.setState({
            specs: specs
          });
        }.bind(this));
    }.bind(this));
  }

  render() {
    let renderer = new marked.Renderer();
    
    return (
      <div className="docs-ui">
        <select name="" id="">
          {this.state.specs.map((spec, index) => {
            return <option key={index} value={spec.version}>{spec.version}</option>
          })}
        </select>
      </div>
    )
  }

}

