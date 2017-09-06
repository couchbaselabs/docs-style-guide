import React, { Component } from 'react';
var marked = require('marked');

export default class TableView extends Component {
  mapPropsToComponents(config) {
    return Object.keys(config).map((key, index) => {
      const type = config[key].type;
      switch (type) {
        case 'object':
          return (
            <tr></tr>
          );
        case 'array':
          let item_type = config[key].items.type;
          if (item_type == 'object') {
            return <tr></tr>
          } else if (config[key].items.enum) {
            if (config[key].items.enum) {
              console.log(Object.keys(config[key].items.enum[0]));
            }
            return (
              <tr>
                <td>
                  <strong>{key}</strong>
                  <br />
                  <small>{'array[' + config[key].items.type + ']'}</small>
                </td>
                <td>
                  {marked(config[key].description)}
                  {this.renderDefault(config[key])}
                  <br />
                  Acceptable values are:
                  <ul>
                    {this.renderEnum(config[key].items.enum)}
                  </ul>
                </td>
              </tr>
            );
          } else {
            return (
              <tr>
                <td>
                  <strong>{key}</strong>
                  <br />
                  <small>{'array[' + config[key].items.type + ']'}</small>
                </td>
                <td>
                  {config[key].description}
                  {this.renderDefault(config[key])}
                </td>
              </tr>
            );
          }
        default:
          return (
            <tr>
              <td>
                <strong>{key}</strong>
                <br />
                <small>{config[key].type}</small>
              </td>
              <td>
                <div dangerouslySetInnerHTML={{__html: marked(config[key].description)}}></div>
                {this.renderDefault(config[key])}
              </td>
            </tr>
          )
      }
    })
  }
  renderDefault(property) {
    if (property.default) {
      return (
        <div>(Default: <strong>{property.default}</strong>)</div>
      )
    }
  }
  renderEnum(values) {
    console.log(values);
    var elements = [];
    values.forEach((key, index) => {
      let keys = Object.keys(values[index]);
      elements.push(
        <li>
          <strong>{keys[0]}</strong>
          {" - "}
          {values[index][keys[0]].description}
        </li>
      );
    });
    return elements;
  }
  render() {
    const items = this.mapPropsToComponents(this.props.config);

    return (
      <div>
        <div className="table">
          <table>
            <thead>
            <tr>
              <th>Property</th>
              <th>Description</th>
            </tr>
            </thead>
            <tbody>
            {items}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
