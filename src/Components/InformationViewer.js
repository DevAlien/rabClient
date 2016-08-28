import React from 'react';
import {ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import Paper from 'material-ui/Paper';

const debug = true;

export default class InformationViewer extends React.Component {
  constructor(props) {
    super(props);
    speechSynthesis.getVoices();
  }

  readText(text) {
    console.log('speach')
    var msg = new SpeechSynthesisUtterance();
  
    msg.text = text;
    
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google italiano'; })[0];
    
    window.speechSynthesis.speak(msg);
  }

  buildMessage(data) {
    let result = [];
    let mapsString;
    data.forEach((d) => {
      result.push(
        <Paper style={{width: '100%', display: 'inline-block', margin: '5px 0', padding: '5px', position: 'relative'}} zDepth={(d.sponsored ? 4 : 0)}>
          <div onClick={this.readText.bind(this, d.text)}>{d.text.split("\n").map(function(item) {
                return (<p>{item}</p>);
              })}
          </div>
          {d.more && <a target="_blank" href={d.more}>{d.more}</a>}
        </Paper>);
    });

    return <div>{result}</div>;
  }

  render() {
    let message = this.props.data;
    return (
      <Paper className="single-message" style={{margin: '10px'}} zDepth={1}>
        <div>
          <h3 style={{marginTop: 0}}>{message.username}</h3>
            {this.buildMessage(this.props.data.raw)}
        </div>
      </Paper>);
  }
}