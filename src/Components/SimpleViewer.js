import React from 'react';
import Paper from 'material-ui/Paper';

export default class SimpleViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let message = this.props.data;
    return (
      <Paper className="single-message" style={{margin: '10px'}} zDepth={1}>
        <div>
          <h3 style={{marginTop: 0}}>{message.username}</h3>
          <div style={{fontSize: '14px'}}>
            <p>{message.message}</p>
          </div>
        </div>
      </Paper>);
  }
}