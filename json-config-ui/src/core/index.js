import React from "react"
import ReactDOM from "react-dom"
import marked from "marked"
import "whatwg-fetch"

module.exports = function ConfigUI(opts) {
  ReactDOM.render(<StandaloneLayout specs={opts.specs} />, document.getElementById('swagger-ui'));
};

export default class StandaloneLayout extends React.Component {
  
  constructor() {
    super();
    this.state = {
      specs: [],
      selected: false,
      renderer: new marked.Renderer()
    };

    let codeTemplate = this.state.renderer.code;
    var that = this;
    this.state.renderer.code = function(code, lang, escaped) {
      let rendered = codeTemplate.call(this, code, lang, escaped);
      let output = replaceStringsWithAnchors(rendered, that.state.specs[that.state.selected]);
      output.map((element) => {
        console.log(element)
        rendered = rendered.replace(element.name, "<a href=\"\">" + element.name + "</a>");
      });
      return rendered;
    };

    function replaceStringsWithAnchors(string, spec) {
      return mapKeysToPaths(spec.json.properties, null, []);
      // console.log(string)
      // Object.keys(string).map((key, index) => {
      //   console.log(key)
      // });
    };

    let mapKeysToPaths = function mapKeysToPaths(props, context, output) {
      Object.keys(props).map((key, index) => {
        const type = props[key].type;
        switch (type) {
          case 'string':
            output.push({name: key, path: context + '-' + key});
            break;
          case 'integer':
            output.push({name: key, path: context + '-' + key});
            break;
          case 'boolean':
            output.push({name: key, path: context + '-' + key});
            break;
          case 'array':
            let item_type = props[key].items.type;
            if (item_type == 'object') {
              output.push({name: key, path: context + '-' + key});
              mapKeysToPaths(props[key].items.properties, context + '-' + key, output);
            } else {
              output.push({name: key, path: context + '-' + key});
            }
            break;
          case 'object':
            output.push({name: key, path: context + '-' + key});
            mapKeysToPaths(props[key].properties, context + '-' + key, output);
            break;
          default:
            break;
        }
      });
      return output;
    }
  }
  
  
  
  componentDidMount() {
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
    
    setTimeout(function() {
      this.selectedVersionChange({target: {value: 1}})
    }.bind(this), 1000);
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
      return marked(markdownString, {renderer: this.state.renderer});
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
        
        <pre id="code" dangerouslySetInnerHTML={{__html: this.renderSpec()}}>
        </pre>
      </div>
    )
  }

}

