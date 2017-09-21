import React from "react"
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom"

export default class Welcome extends React.Component {
  
  render() {
    return (
      <div>
        <section id="" className="intro-block ">
          <div id="" className="col-two-outer  col-first">
            <div className="container">
              <div className="col-two">
                <div className="intro-content">
                  <h4>Develop</h4>
                  <p className="para-18">Learn how to design and develop applications using Couchbase Mobile. Use query and Full Text Search introduced in 2.0 along with the new convergence feature introduced in Sync Gateway</p>
                  <Link to="/develop/swift" className=" hyperlink-effect">Swift</Link><br/><br/>
                  <Link to="/develop/java" className=" hyperlink-effect">Java</Link>
                </div>
              </div>
              <div className="col-two move-left" style={{animationDuration: '1.2s',animationDelay: '0.3s',animationName: 'fadeInLeft',height: '338px'}}>
                <div className="col-img">
                  <img src="https://www.couchbase.com/binaries/content/gallery/website/images-new/svgs/cloud-first-strategy-2.svg" alt="Cloud-first strategy"/>
                </div>
              </div>
            </div>
          </div>
          <div id="" className="col-two-outer grey-bg col-second">
            <div className="container">
              <div className="col-two move-right" style={{animationDuration: '1.2s',animationDelay: '0.3s',animationName: 'fadeInRight',height: '338px'}}>
                <div className="col-img">
                  <img src="https://www.couchbase.com/binaries/content/gallery/website/images-new/svgs/looking-to-run-your-database-on-a-public-cloud_.svg" alt="Couchbase Digital Engagment"/>
                </div>
              </div>
              <div className="col-two">
                <div className="intro-content">
                  <h4>Deploy</h4>
                  <p className="para-18">Learn how to install, upgrade and scale the Couchbase Mobile back-end cluster. Use the platform of your choice to deploy the cluster on different public cloud providers.</p>
                  <Link to="/deploy/centos">CentOS</Link><br/><br/>
                  <Link to="/deploy/docker">Docker</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
  
}