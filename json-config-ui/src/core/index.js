import React from "react"
import ReactDOM from "react-dom"
import marked from "marked"
import "whatwg-fetch"
import TableView from './TableView';

module.exports = function ConfigUI(opts) {
  ReactDOM.render(<StandaloneLayout specs={opts.specs} current={opts.current} />, document.getElementById('swagger-ui'));
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
        rendered = rendered.replace("&quot;" + element.name + "&quot;", "<a href=\"#" + element.path + "\">" + element.name + "</a>");
      });
      return rendered;
    };

    function replaceStringsWithAnchors(string, spec) {
      return that.mapKeysToPaths(spec.json.properties, null, []);
    };

  }
  
  mapKeysToPaths(props, context, output) {
    Object.keys(props).map((key, index) => {
      const type = props[key].type;
      switch (type) {
        case 'string':
          output.push({name: key, path: context ? context + '-' + key : key, type: type, description: props[key].description, default: props[key].default ? props[key].default : null});
          break;
        case 'integer':
          output.push({name: key, path: context ? context + '-' + key : key, type: type, description: props[key].description, default: props[key].default ? props[key].default : null});
          break;
        case 'boolean':
          output.push({name: key, path: context ? context + '-' + key : key, type: type, description: props[key].description, default: props[key].default ? props[key].default : null});
          break;
        case 'array':
          let item_type = props[key].items.type;
          if (item_type == 'object') {
            output.push({name: key, path: context ? context + '-' + key : key, type: type, description: props[key].description, default: props[key].default ? props[key].default : null});
            this.mapKeysToPaths(props[key].items.properties, context ? context + '-' + key : key, output);
          } else {
            output.push({name: key, path: context ? context + '-' + key : key, type: type, description: props[key].description, default: props[key].default ? props[key].default : null});
          }
          break;
        case 'object':
          output.push({name: key, path: context ? context + '-' + key : key, type: type, description: props[key].description, default: props[key].default ? props[key].default : null});
          this.mapKeysToPaths(props[key].properties, context ? context + '-' + key : key, output);
          break;
        default:
          break;
      }
    });
    return output;    
  }

  jumpToAnchor(h) {
    let top = document.getElementById(h).offsetTop;
    window.scrollTo(0, top)
  }
  
  componentDidMount() {
    let promises = [];
    let specs = this.state.specs.slice();
    this.props.specs.map(function(spec) {
      promises.push(fetch(spec.url));
      specs.push({version: spec.version})
    }.bind(this));
    this.setState({specs: specs});
    
    Promise.all(promises)
      .then((results) => {
        return results.map((res) => {return res.json();})
      })
      .then(function(results) {
        return Promise.all(results);
      })
      .then(function(results) {
        let specs = this.state.specs.slice();
        let currentIndex = 0;
        specs = specs.map((res, index) => {
          if (res.version == this.props.current) {
            currentIndex = index;
          }
          return {version: res.version, json: results[index]}
        });
        this.setState({
          specs: specs
        });
        this.selectedVersionChange({target: {value: currentIndex}});
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
    if (this.state.selected === false) {
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

  render() {
    if (this.state.selected === false) {
      return (
        <div></div>
      )
    } else {
      return (
        <div className="docs-ui">
          <select name="" id="" value={this.state.selected} onChange={this.selectedVersionChange.bind(this)}>
            {this.state.specs.map((spec, index) => {
              return (
                <option
                  key={index}
                  value={index}>
                  {spec.version}
                </option>
              )
            })}
          </select>
          <pre id="code" dangerouslySetInnerHTML={{__html: this.renderSpec()}}>
          </pre>
          {this.mapKeysToPaths(this.state.specs[this.state.selected].json.properties, null, []).map(row => {
            return (
              <div>
                <h2>
                  <a href={'#' + row.path} id={row.path}>
                    <span className="text">
                      <code>{row.path.split('-').join('.')}</code>
                    </span>
                  </a>
                </h2>
                <p>
                  <code>{row.type}</code>
                </p>
                {
                  (() => {
                    if (row.description) {
                      return <p dangerouslySetInnerHTML={{__html: marked(row.description)}}></p>
                    }
                  })()
                }
                {
                  (() => {
                    if (row.default) {
                      return <div>(Default: <strong>{row.default}</strong>)</div>
                    }
                  })()
                }
              </div>
            )
          })}
        </div>
      )
    }
  }

}

