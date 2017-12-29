const React = require('react');

class Sidebar extends React.Component {
  render() {
    let chapters = this.props.spec.chapters.map(chapter => {
      return (
        <li>
          <a>{chapter.title}</a>
          <ul>
            {chapter.lessons.map(lesson => {
              return (
                <div>{lesson.title}</div>
              )
            })}
          </ul>
        </li>
      )
    });
    
    return (
      <ul>
        {chapters}
      </ul>
    )
  }
}

module.exports = Sidebar;