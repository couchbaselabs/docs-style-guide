const React = require('react');

class DocsLayout extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

module.exports = DocsLayout;