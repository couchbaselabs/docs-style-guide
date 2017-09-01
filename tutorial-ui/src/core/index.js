import React from "react"
import ReactDOM from "react-dom"

module.exports = function ConfigUI(opts) {
  console.log(opts.specs);
  ReactDOM.render(<StandaloneLayout specs={opts.specs} />, document.getElementById('swagger-ui'));
};

export default class StandaloneLayout extends React.Component {

  render() {
    
    console.log(this.props);
    
    return (
      <div>
        <select name="" id="">
          {this.props.specs.map((spec, index) => {
            return <option key={index} value={spec.version}>{spec.version}</option>
          })}
        </select>
      </div>
    )
  }

}

