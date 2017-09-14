import React from "react";

export default class Content extends React.Component {
  
  constructor() {
    super();
    
  }
  
  render() {
    return (
      <div className={`inner-content display-platform-${this.props.match.params.platform}`}>
        <div dangerouslySetInnerHTML={{__html: this.props.description}} />
      </div>
    )
  }
  
};