const React = require('react');
const Sidebar = require('./Sidebar');

class Tutorial extends React.Component {
  render() {
    return (
      <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <title>Title</title>
      </head>
      <body>
        <div>
          <div>
            <Sidebar spec={this.props.spec} />
          </div>
        </div>
      {/*<div*/}
        {/*dangerouslySetInnerHTML={{*/}
          {/*__html: this.props.children*/}
        {/*}}>*/}
      {/*</div>*/}
      </body>
      </html>
    )
  }
}

module.exports = Tutorial;