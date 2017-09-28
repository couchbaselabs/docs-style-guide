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
                  <p className="para-18">We will develop a sample Travel application for mobile platforms using Couchbase Mobile 2.0. The simple app will allow users to search for and make flight reservations and will also allow searches for hotels based on specific criteria.
                    The mobile app will use the Couchbase Lite 2.0 API that includes support for a N1QL like query interface and Full Text Search (FTS) capabilities. The app will sync documents with Sync Gateway 1.5 and Couchbase Server 5.0 using the 2.0 replication protocol. Additionally, we will use a web version of the Travel Sample app to demonstrate seamless data sync between web and mobile apps.
                    Begin by choosing “Swift” for iOS and “Java” for Android version. The app will support other mobile platforms shortly.</p>
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
                  <p className="para-18">In the Develop section, you learnt how to develop an app using Couchbase Mobile in a standalone development environment. Now, we learn how to install, upgrade and scale the Couchbase Mobile back-end cluster that would be applicable in a production environment. Select one of the options below to learn how to deploy the cluster as Virtual Machines (on CentOS) or as containers in Docker Cloud.</p>
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