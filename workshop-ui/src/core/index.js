import React from "react"
import ReactDOM from "react-dom"
import marked from "marked"
import "whatwg-fetch"
import jsyaml from "js-yaml"
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom"
import Content from "./content"
import highlight from "highlight.js"

module.exports = function ConfigUI(opts) {
  ReactDOM.render(<StandaloneLayout url={opts.url} />, document.getElementById('swagger-ui'));
};

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

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});
let renderer = new marked.Renderer();
let codeTemplate = renderer.code;
renderer.code = function(code, lang) {
  if (lang.indexOf('md-') != -1) {
    return "<div class=\"platform " + lang.replace('md-', '') + "\">" + marked(code) + "</div>";
  } else {
    let rendered = codeTemplate.call(this, code, lang).replace(`lang-${lang}`, 'hljs');
    return "<div class=\"platform " + lang + "\">" + rendered + "</div>";
  }
};

export default class StandaloneLayout extends React.Component {
  
  constructor() {
    super();
    this.state = {
      spec: null,
      selectedState: null,
      currentMilestone: null,
      selectedChapter: null,
      platforms: [],
      platform: null
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
        this.setState({platforms: spec.platforms})
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

  display(type, value, isFirstPageLoad) {
    deleteCookie('mobile-lang');
    setCookie('mobile-lang', value, 365);
    // Place the display-platform-* class on div.inner-content
    var container = document.getElementsByClassName('inner-content')[0];
    container.className = 'inner-content display-' + type + '-' + value;
    if (value == 'wpf' || value == 'csharp' || value == 'xam') {
      container.className += ' display-platform-net';
    }
    container.className += ' display-platform-all';
    return false;
  }

  render() {
      if (!this.state.spec) {
        return <div></div>
      } else {
        const SelectedContent = (props) => {
          return (
            <Content
              {...props}
              platform={this.state.platform}
              passPlatform={(platform) => {this.setState({platform: platform})}}
              description={marked(this.state.spec.chapters[this.state.selectedChapter].lessons[this.state.selectedLesson].milestones[this.state.currentMilestone].description, {renderer: renderer})}/>
          )
        };
        return (
          <div className="docs-ui">
            <Router basename="/workshop/mobile-workshop.html">
              <div>
                <div className="drawer">
                  {this.getChapters().map((chapter, index) => {
                    return (
                      <div key={index} className="left-nav">
                        <em>{chapter.title}</em>
                        {this.getLessonNames(chapter).map((name, lessonIndex) => {
                          return (
                            <a
                              style={this.state.selectedLesson == lessonIndex && this.state.selectedChapter == index ? {backgroundColor: '#e0e0e0'} : {}}
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
                    <div className={`display-platform-${this.state.platform}`}>
                      <div className="toggler">
                        <div id="platform-tabs" >
                          <span>Platform:</span>
                          {this.state.platforms.map((name, index) => {
                            return (
                              <Link className={`button-${name}`} to={`${name}`}>
                                {name}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
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
                      <div>
                        <div>
                          <Route path="/:platform" render={SelectedContent} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </Router>
      </div>
        )
      }
  }

}

