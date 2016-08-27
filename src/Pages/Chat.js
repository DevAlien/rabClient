import React from 'react';
import './Chat.css'
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import TimeViewer from '../Components/TimeViewer';

const style = {
  page: {
    paddingTop: '64px',
    minHeight: '400px'
  }
};

const debug = true;

export default class Chat extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messages: []
    }
  }

  callDeep = (data) => {
    this.context.socket.emit('analyser:analyse', data, this.receiveMessage);
  }

  receiveMessage = (message, realMessage) => {
    let messages = this.state.messages;
    messages.push({time: new Date(), username: 'RAB', response: message, message: realMessage.message, raw: realMessage.raw});
    this.setState({messages: messages});
  }

  sendMessage = () => {
    let messages = this.state.messages;
    messages.push({time: new Date(), username: 'Tu', message: this.state.message});
    this.setState({messages: messages, message: ''});
    this.context.socket.emit('questions:send', this.state.message, this.receiveMessage);
  }


  printMessages() {
    return this.state.messages.map((message) => {
      if (message.response && message.response.what === 'orario') {
        return <TimeViewer data={message} callDeep={this.callDeep}/>
      }
      let text = <p>{message.message}</p>;
      if (debug === true && message.response) {
        text = (<div style={{fontSize: '14px'}}>
                  <p className="debug-message">{JSON.stringify(message.response)}</p>
                  {message.message.split("\n").map(function(item) {
                    return (<p>{item}</p>);
                  })}
                </div>);
      }
      return (<ListItem key={message.time.getTime()}>
                <div>
                  <p>{message.username}</p>
                  {text}
                </div>
              </ListItem>);
    });
  }

  onChange = (event) => {
    this.setState({message: event.target.value});
  }

  handleKeyPress = (event) => {
    if (event.which === 13) {
      this.sendMessage();
    }
    
  }

  render() {
    return (<div style={style.page}>
        <div className="chatArea">
          <List className="messages">
            {this.printMessages()}
          </List>
        </div>
        <div className="inputMessage">
          <TextField
            hintText="Fammi una domanda"
            floatingLabelText="Fammi una domanda"
            onKeyPress={this.handleKeyPress}
            onChange={this.onChange}
            value={this.state.message}
            
            style={{float: 'left', width: '80%'}}
          />
          <RaisedButton label="Send" onClick={this.sendMessage} style={{float: 'right', width: '9%', height: '74px'}}/>
        </div>
    </div>);
  }
}

Chat.contextTypes = {
  socket: React.PropTypes.object
};