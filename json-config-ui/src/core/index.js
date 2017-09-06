import React from "react"
import ReactDOM from "react-dom"
import marked from "marked"
import "whatwg-fetch"
import TableView from './TableView';

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

  mapPropsToTableView(props, initial) {
    Object.keys(props).map((key, index) => {
        const type = props[key].type;
        switch (type) {
          case 'object':
            let keys = Object.keys(props[key].properties);
            if (keys.length == 1 && props[key].properties[keys[0]].type == 'object') {

            } else {
              initial.push(
                <div>
                  <h4>
                    {key.replace('_', ' ')} configuration
                    <a className="hash-link instructions" id={key.replace(' ', '-')} href={'#' + key.replace(' ', '-')}>
                      <svg ariaHidden="true" className="octicon octicon-link" height="20" version="1.1"
                           viewBox="0 -3 20 20" width="20">
                        <path
                          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
                      </svg>
                    </a>
                  </h4>
                  <TableView config={props[key].properties}/>
                </div>
              );
            }
            this.mapPropsToTableView(props[key].properties, initial);
            return;
          case 'array':
            let item_type = props[key].items.type;
            if (item_type == 'object') {
              initial.push(
                <div>
                  <h4>
                    {key.replace('_', ' ') + '[]'} configuration
                    <a class="hash-link instructions" href="#sync-gateway-accelerator">
                      <svg aria-hidden="true" class="octicon octicon-link" height="20" version="1.1" viewBox="0 -3 20 20"
                           width="20">
                        <path
                          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
                      </svg>
                    </a>
                  </h4>
                  <TableView config={props[key].items.properties}/>
                </div>
              );
            }
            return;
        }
      }
    );
    return initial;
  }

  renderTableView() {
    if (!this.state.selected) {
      return '';
    } else {
      return this.state.specs[this.state.selected].json.properties;
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
        <h2>
          <a href="sslkey" id="sslkey"></a>
          <span class="text">
            <code>sslkey</code>
          </span>
          <svg ariaHidden="true" className="octicon octicon-link" height="20" version="1.1" viewBox="0 -3 20 20"
               width="20">
            <path
              d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
          </svg>
        </h2>
        <p>
          <code>string</code>
          <div>(Default: <strong>500</strong>)</div>
        </p>
        <p>
          This is a description... The markdown content
        </p>
        <pre id="code" dangerouslySetInnerHTML={{__html: this.renderSpec()}}>
        </pre>
        <h3><a href="#ref" id="ref">Ref</a></h3>
        {this.mapPropsToTableView(this.renderTableView(), [
          <div>
            <h4>
              server configuration
              <a className="hash-link instructions" id="server" href={'#server'}>
                <svg ariaHidden="true" className="octicon octicon-link" height="20" version="1.1" viewBox="0 -3 20 20"
                     width="20">
                  <path
                    d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path>
                </svg>
              </a>
            </h4>
            <TableView config={this.renderTableView()}/>
          </div>
        ])}
      </div>
    )
  }

}

