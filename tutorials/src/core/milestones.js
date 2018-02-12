import React from "react"

export default class Milestones extends React.Component {

  render() {
    if (this.props.optional) {
      return (
        <div className="lesson-options">
          <p>Select an installation option:</p>
          <select value={this.props.currentMilestone} name="Lesson options" id="lesson-options" onChange={(e) => {
            this.props.onClick({currentMilestone: e.target.value})
            window.location.hash = `#/${this.props.selectedChapter}/${this.props.selectedLesson}/${e.target.value}`;
          }}>
            {this.props.milestones.map((milestone, index) => {
              return (
                <option key={index} value={`${index}`}>{milestone.title}</option>
              )
            })}
            }
          </select>
        </div>
      )
    } else {
      return (
        <ul id="tabs">
          {this.props.milestones.map((milestone, index) => {
            return (
              <li
                key={index}
                style={this.props.currentMilestone == index ? {color: '#0a83f6'} : {}}>
                <a
                  style={this.props.currentMilestone == index ? {color: '#0a83f6', borderBottom: '2px solid #0a83f6'} : {}}
                  className="instructions"
                  href={`#/${this.props.selectedChapter}/${this.props.selectedLesson}/${this.props.currentMilestone}`}
                  onClick={(e) => {this.props.onClick({currentMilestone: index})}}>
                  {milestone.title}
                </a>
              </li>
            )
          })}
        </ul>
      )
    }
  }

}
