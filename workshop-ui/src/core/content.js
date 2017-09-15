import React from "react";
import marked from "marked";

export default class Content extends React.Component {
  
  constructor() {
    super();
  }
  
  render() {
    if (this.props.platform != this.props.match.params.platform) {
      this.props.passPlatform(this.props.match.params.platform);
    }
    return (
      <div className={`inner-content display-platform-${this.props.match.params.platform}`}>
        <div dangerouslySetInnerHTML={{__html: this.props.description}} />
        <h3>Try it out</h3>
        {this.props.tryitout.map((item, index) => {
          return (
            <div>
              <li key={index} style={{listStyleType: 'none'}}>
                <input type="checkbox" className="radio" />
                <p style={{display: 'inline-block'}} dangerouslySetInnerHTML={{__html: marked(item)}}></p>
              </li>
            </div>
          )
        })}
      </div>
    )
  }
  
};