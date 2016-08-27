import React from 'react';
import './Chat.css'
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
const style = {
  page: {
    paddingTop: '64px',
    minHeight: '400px'
  }
};


export default class Chat extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      messages: []
    }
  }

  sendMessage = () => {
    let messages = this.state.messages;
    messages.push({time: new Date(), username: 'Tu', text: this.state.message});
    this.setState({messages: messages, message: ''});
    this.context.socket.emit('questions:send', this.state.message, (message, realMessage) => {
      console.log(realMessage)
      let messages = this.state.messages;
      messages.push({time: new Date(), username: 'test', text: message});
      this.setState({messages: messages});
    });
  }

  printMessages() {
    return this.state.messages.map((message) => {
      return (<ListItem
                key={message.time.getTime()}
                primaryText={message.username}
                secondaryText={message.text}
              />);
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