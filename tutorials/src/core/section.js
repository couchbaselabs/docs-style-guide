import React from "react"
import "whatwg-fetch"
import jsyaml from "js-yaml"
import marked from "marked"
import Content from "./content"
import Milestones from "./milestones"
import highlight from "highlight.js"
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom"

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});
let renderer = new marked.Renderer();
let codeTemplate = renderer.code;
renderer.code = function(code, lang) {
    let rendered = codeTemplate.call(this, code, lang).replace(`lang-${lang}`, 'hljs');
    return rendered;
};
let linkTemplate = renderer.link;
renderer.link = function(href, title, text) {
  let rendered = linkTemplate.call(this, href, title, text);
  if (href.indexOf('http') !== -1 || href.indexOf('https') !== -1) {
    let output = `${rendered.slice(0, 2)} target="_blank" ${rendered.slice(3)}`;
    return output;
  } else {
    return rendered;
  }
};

export default class Tutorial extends React.Component {
  
  constructor() {
    super();
    this.state = {
      selectedLesson: null,
      currentMilestone: null,
      selectedChapter: null,
    };
  }
  
  componentWillMount() {
    fetch(this.props.content.url)
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
        var that = this;
        window.onhashchange = function() {
          let parts = window.location.hash.split('/');
          if (parts.length === 4) {
            that.setState({selectedLesson: parts[2], currentMilestone: parts[3], selectedChapter: parts[1]});
          }
        };
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
    console.log(selectedLesson)
    return this.state.spec.chapters[this.state.selectedChapter].lessons[selectedLesson].milestones;
  }
  
  render() {
    console.log(this.props.content)
    if (!this.state.spec) {
      return <div></div>
    } else {
      return (
        <div className="docs-ui">
            <div>
              <div className="drawer">
                <div className="left-nav">
                  <Link to="/" className=" hyperlink-effect">← Home</Link>
                </div>
                {this.getChapters().map((chapter, index) => {
                  return (
                    <div key={index} className="left-nav">
                      <em>{chapter.title}</em>
                      {this.getLessonNames(chapter).map((name, lessonIndex) => {
                        return (
                          <a
                            style={this.state.selectedLesson == lessonIndex && this.state.selectedChapter == index ? {border: '2px solid rgba(236, 30, 44, 0.69)', backgroundColor: 'rgb(222, 222, 222)'} : {border: '2px solid transparent'}}
                            key={lessonIndex}
                            className="toc-item instructions"
                            href={`#/${this.state.selectedChapter}/${this.state.selectedLesson}/${this.state.currentMilestone}`}
                            onClick={(e) => {this.setState({selectedChapter: index, selectedLesson: lessonIndex, currentMilestone: 0})}}>
                            <i
                              style={this.state.selectedLesson == lessonIndex && this.state.selectedChapter == index ? {color: 'rgba(236, 30, 44, 0.69)', border: '2px solid rgba(236, 30, 44, 0.69)'} : {}}>{lessonIndex + 1}</i>
                            <span style={this.state.selectedLesson == lessonIndex && this.state.selectedChapter == index ? {} : {}}>{name}</span>
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
                    <Milestones
                      optional={(this.state.selectedChapter == 0) && ((this.state.selectedLesson == 2) || (this.state.selectedLesson == 3) || (this.state.selectedLesson == 4)) ? true : false}
                      milestones={this.getMilestoneNames(this.state.selectedLesson)}
                      currentMilestone={this.state.currentMilestone}
                      selectedChapter={this.state.selectedChapter}
                      selectedLesson={this.state.selectedLesson}
                      onClick={(param) => {this.setState({currentMilestone: param.currentMilestone})}} />
                  </nav>
                  <div className="inner">
                    <div>
                      <div>
                        <Content
                          tryitout={this.state.spec.chapters[this.state.selectedChapter].lessons[this.state.selectedLesson].milestones[this.state.currentMilestone].tryitout}
                          platform={this.state.platform}
                          passPlatform={(platform) => {this.setState({platform: platform})}}
                          description={marked(this.state.spec.chapters[this.state.selectedChapter].lessons[this.state.selectedLesson].milestones[this.state.currentMilestone].description, {renderer: renderer})}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      )
    }
  }
}
