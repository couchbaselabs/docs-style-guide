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
      currentMilestone: null,
      selectedChapter: null,
    };
  }
  
  componentWillMount() {
    fetch(this.props.url)
      .then(res => {
        return res.text()
      })
      .then(function(res) {
        let spec = jsyaml.load(res);
        let parts = window.location.hash.split('/');
        if (parts.length === 4) {
          this.setState({spec: spec, selectedLesson: parts[2], currentMilestone: parts[3], selectedChapter: parts[1]});
        } else {
          this.setState({spec: spec, selectedLesson: 0, currentMilestone: 0, selectedChapter: 0});
        }
      }.bind(this));
  }
  
  getChapters() {
    return this.state.spec.chapters;
  }
  
  getLessonNames(chapter) {
    return chapter.lessons.map(lesson => {
      return lesson.title;
    });
  }
  
  getMilestoneNames(selectedLesson) {
    return this.state.spec.chapters[this.state.selectedChapter].lessons[selectedLesson].milestones;
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
              {this.getChapters().map((chapter, index) => {
                return (
                  <div key={index} className="left-nav">
                    <em>{chapter.title}</em>
                    {this.getLessonNames(chapter).map((name, lessonIndex) => {
                      return (
                        <a
                          key={lessonIndex}
                          className="toc-item instructions"
                          href={`#/${this.state.selectedChapter}/${this.state.selectedLesson}/${this.state.currentMilestone}`}
                          onClick={(e) => {this.setState({selectedChapter: index, selectedLesson: lessonIndex, currentMilestone: 0})}}>
                          <i>{lessonIndex + 1}</i>
                          <span>{name}</span>
                        </a>
                      )
                    })}
                  </div>
                )
              })}
            </div>
            <div className="body">
              <div className="main">
                <nav className="milestones">
                  <ol>
                    {this.getMilestoneNames(this.state.selectedLesson).map((milestone, index) => {
                      return (
                        <li key={index}>
                          <a
                            className="instructions"
                            href={`#/${this.state.selectedChapter}/${this.state.selectedLesson}/${this.state.currentMilestone}`}
                            onClick={(e) => {this.setState({currentMilestone: index})}}>
                            {milestone.title}
                          </a>
                        </li>
                      )
                    })}
                  </ol>
                </nav>
                <div className="inner">
                  <ul>
                    <div dangerouslySetInnerHTML={{__html: marked(this.state.spec.chapters[this.state.selectedChapter].lessons[this.state.selectedLesson].milestones[this.state.currentMilestone].description)}}/>
                    <h3>Try it out</h3>
                    {this.state.spec.chapters[this.state.selectedChapter].lessons[this.state.selectedLesson].milestones[this.state.currentMilestone].tryitout.map((item, index) => {
                      return <li key={index} dangerouslySetInnerHTML={{__html: marked(item)}}></li>
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      }
  }

}

