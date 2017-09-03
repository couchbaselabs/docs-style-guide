import React from "react"
import ReactDOM from "react-dom"
import marked from "marked"
import "whatwg-fetch"

module.exports = function ConfigUI(opts) {
  ReactDOM.render(<StandaloneLayout specs={opts.specs} />, document.getElementById('swagger-ui'));
};

let renderer = new marked.Renderer();
var codeTemplate = renderer.code;
renderer.code = function(code, lang, escaped) {
  let rendered = codeTemplate.call(this, code, lang, escaped);
  rendered = rendered.replace("adminInterface", "<a href=\"\">adminInterface</a>");
  return rendered;
};

export default class StandaloneLayout extends React.Component {
  
  constructor() {
    super();
    this.state = {
      specs: [],
      selected: false
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

  mapPropsToJSON(props, initial) {
    Object.keys(props).map((key, index) => {
      const type = props[key].type;
      switch (type) {
        case 'string':
          initial[key] = "string"
          break;
        case 'integer':
          initial[key] = 0
          break;
        case 'boolean':
          initial[key] = false
          break;
        case 'array':
          let item_type = props[key].items.type;
          if (item_type == 'object') {
            initial[key] = [this.mapPropsToJSON(props[key].items.properties, {})];
          } else {
            initial[key] = [props[key].items.type];
          }
          break;
        case 'object':
          initial[key] = this.mapPropsToJSON(props[key].properties, {});
          break;
        default:
          break;
      }
    });
    return initial;
  }
  
  selectedVersionChange(event) {
    var index = event.target.value;
    this.setState({selected: index});
  }
  
  renderSpec() {
    if (!this.state.selected) {
      return '';
    } else {
      let markdownString = '```json\n ' + JSON.stringify(this.mapPropsToJSON(this.state.specs[this.state.selected].json.properties, {}), null, 2) + '\n```';
      return marked(markdownString, {renderer: renderer});
    }
  }

  render() {
    return (
      <div className="docs-ui">
        <select name="" id="" onChange={this.selectedVersionChange.bind(this)}>
          {this.state.specs.map((spec, index) => {
            return <option key={index} value={index}>{spec.version}</option>
          })}
        </select>
        
        <div className="highlight" dangerouslySetInnerHTML={{__html: this.renderSpec()}} />
      </div>
    )
  }

}

