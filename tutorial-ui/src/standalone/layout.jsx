import React from "react"
import ReactDOM from "react-dom"

export default class StandaloneLayout extends React.Component {

  render() {
    return (
      <div>
        Hey there, this is very cool.
      </div>
    )
  }

}

ReactDOM.render(<StandaloneLayout/>, document.getElementById('swagger-ui'));
