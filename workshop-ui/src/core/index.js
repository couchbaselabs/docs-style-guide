import React from "react"
import ReactDOM from "react-dom"
import marked from "marked"
import "whatwg-fetch"
import jsyaml from "js-yaml"

module.exports = function ConfigUI(opts) {
  console.log(opts.specs);
  ReactDOM.render(<StandaloneLayout url={opts.url} />, document.getElementById('swagger-ui'));
};

export default class StandaloneLayout extends React.Component {
  
  constructor() {
    super();
    this.state = {
      spec: null,
      selectedState: null,
      currentMilestone: null
    };
  }
  
  componentWillMount() {
    fetch(this.props.url)
      .then(res => {
        return res.text()
      })
      .then(function(res) {
        let spec = jsyaml.load(res);
        this.setState({spec: spec, selectedLesson: 0, currentMilestone: 0});
      }.bind(this));
  }
  
  getLessonNames() {
    return this.state.spec.lessons.map(lesson => {
      return lesson.title;
    });
  }
  
  getMilestoneNames(selectedLesson) {
    console.log(this.state.spec.lessons[selectedLesson]);
    return this.state.spec.lessons[selectedLesson].milestones;
  }
  
  

  render() {
    let markdownString = '```json\n ' + JSON.stringify(this.state.specs, null, 2) + '\n```';
    let renderer = new marked.Renderer();
    renderer.code = function(code, lang, escaped) {
      
    };
    
      if (!this.state.spec) {
        return <div></div>
      } else {
        return (
          <div className="docs-ui">
            <div className="drawer">
              <div className="left-nav">
                {this.getLessonNames().map((name, index) => {
                  return (
                    <a
                      key={index}
                      className="toc-item"
                      href="javascript:;"
                      onClick={(e) => {this.setState({selectedLesson: index})}}>
                      <i>{index + 1}</i>
                      <span>{name}</span>
                    </a>
                  )
                })}
              </div>
            </div>
            <div className="body">
              <div className="main">
                <nav className="milestones">
                  <ol>
                    {this.getMilestoneNames(this.state.selectedLesson).map((name, index) => {
                      return (
                        <li key={index}>
                          {name.title}
                        </li>
                      )
                    })}
                  </ol>
                </nav>
                <div className="inner">
                  {this.state.spec.lessons[this.state.selectedLesson].milestones[this.state.currentMilestone].description}  
                </div>
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

}

