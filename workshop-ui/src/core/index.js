import React from "react"
import ReactDOM from "react-dom"
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom"
import Tutorial from "./section"

module.exports = function ConfigUI(opts) {
  ReactDOM.render(<StandaloneLayout url={opts.url} tree={opts.tree} />, document.getElementById('swagger-ui'));
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

export default class StandaloneLayout extends React.Component {
  
  constructor() {
    super();
    this.state = {
      spec: null,
      selectedState: null,
      currentMilestone: null,
      selectedChapter: null,
      platforms: [],
      platform: null,
      tree: null
    };
  }
  
  componentWillMount() {
    this.setState({tree: this.props.tree});
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
    return (
      <Router>
        <div>
          <div>
            <Link to="/develop/swift">Swift</Link><br/><br/>
            <Link to="/develop/java">Java</Link><br/><br/>
            <Link to="/deploy/centos">CentOS</Link><br/><br/>
            <Link to="/deploy/docker">Docker</Link><br/><br/>
          </div>
          <div>
            <Route exact={true} path="/develop/:platform" render={({ match }) => (
              <Tutorial content={this.state.tree[0].platforms.find(platform => platform.title === match.params.platform)}/>
            )}/>
            <Route exact={true} path="/deploy/:platform" render={({ match }) => (
              <Tutorial content={this.state.tree[1].platforms.find(platform => platform.title === match.params.platform)} />
            )}/>
          </div>
        </div>
      </Router>
    )
  }

}

