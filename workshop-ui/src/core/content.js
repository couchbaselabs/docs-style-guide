import React from "react";

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
      </div>
    )
  }
  
};