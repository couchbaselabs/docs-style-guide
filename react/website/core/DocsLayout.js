const React = require('react');

class DocsLayout extends React.Component {
  render() {
    return (
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
          <title>Title</title>
      </head>
      <body>
      <div
        dangerouslySetInnerHTML={{
          __html: this.props.children
        }}>
      </div>
      </body>
      </html>
    )
  }
}

module.exports = DocsLayout;