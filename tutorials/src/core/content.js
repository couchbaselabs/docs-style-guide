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
      </div>
    )
  }
  
};
