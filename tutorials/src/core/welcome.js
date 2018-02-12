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
                    Begin by choosing “Swift” for iOS , “Java” for Android version and “C Sharp” for UWP version. The app will support other mobile platforms shortly.</p>
                  <Link to="/develop/swift/" className=" hyperlink-effect">Swift</Link><br/><br/>
                  <Link to="/develop/java/" className=" hyperlink-effect">Java</Link><br/><br/>
                  <Link to="/develop/csharp/" className=" hyperlink-effect">C Sharp</Link>
                </div>
              </div>
              <div className="col-two move-left" style={{animationDuration: '1.2s',animationDelay: '0.3s',animationName: 'fadeInLeft',height: '338px'}}>
                <div className="col-img">
                  <br/><br/><br/><br/><br/><br/>
                  <img src="https://cl.ly/1m3l3K1Z2s0C/featured.png" alt="Cloud-first strategy"/>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
  
}
