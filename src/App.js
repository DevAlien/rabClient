import './App.css'
import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
injectTapEventPlugin();

import Main from './Pages/Main.js';
import Chat from './Pages/Chat.js';

import NoMatch from './Pages/NoMatch.js';

let socket = io('http://localhost:4000', {query: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFzZCIsInNjb3BlcyI6WyJtYXN0ZXIiXSwiaWF0IjoxNDcyMjQyMTUxfQ.e7MSiD2ODTRN4NjXsusGoQvAMEy4cN2P-lPwtoZrgN0'});

export default class App extends React.Component {
  getChildContext() {
    return {socket: socket};
  }

  render() {
    return (
      <MuiThemeProvider>
        <Router history={browserHistory}>
          <Route path="/" component={Main}>
            <Route path="/chat" component={Chat}/>
          </Route>
          <Route path="*" component={NoMatch}/>
        </Router>
      </MuiThemeProvider>
    );
  }
}

App.childContextTypes = {
  socket: React.PropTypes.object
};