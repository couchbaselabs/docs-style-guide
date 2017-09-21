import React from "react";
import marked from "marked";

export default class Content extends React.Component {
  
  constructor() {
    super();
  }
  
  render() {
    return (
      <div className="inner-content">
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