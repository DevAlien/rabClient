import React from 'react';
import {ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';

import Paper from 'material-ui/Paper';

const debug = true;

export default class TimeViewer extends React.Component {
  constructor(props) {
    super(props);
    speechSynthesis.getVoices();
  }
  callDeep = () => {
    let message = this.props.data.response;
    message.deep = 3;
    this.props.callDeep(message);
  }

  readText(text) {
    console.log(text)
    console.log('yeah')
    var msg = new SpeechSynthesisUtterance();
  
    msg.text = text;
    
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;
    msg.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Google italiano'; })[0];
    
    window.speechSynthesis.speak(msg);
  }

  dataArrayToString(data) {
    if (Array.isArray(data.name)) {
      data.name = data.name[0];
    }
    if (Array.isArray(data.address)) {
      data.address = data.address[0];
    }
    if (Array.isArray(data.time)) {
      data.time = data.time[0];
    }
    if (Array.isArray(data.cityName)) {
      data.cityName = data.cityName[0];
    }
    if (Array.isArray(data.phone)) {
      data.phone = data.phone[0];
    }
    if (Array.isArray(data.sponsored)) {
      data.sponsored = data.sponsored[0];
    }

    return data;
  }

  buildMessage(data) {
    let result = [];
    let mapsString;
    result.push(<h3>Ho trovato {data.length} risultat{(data.length === 1) ? 'o' : 'i'}</h3>);
    data.forEach((d) => {
      d = this.dataArrayToString(d);
      mapsString = d.address + ', ' + d.cityName + ', Svizzera';
      result.push(
        <Paper style={{width: '100%', display: 'inline-block', margin: '5px 0', padding: '5px', position: 'relative'}} zDepth={(d.sponsored ? 4 : 0)}>
          {d.sponsored && <div style={{position: 'absolute', right: '10px', color: '#5631ec', fontWeight: 'bold'}}>Sponsorizzato</div>}
          <div style={{width: '50%', float:'left'}}>
            <h4 onClick={this.readText.bind(this, d.name)}>{d.name}</h4>
            <h5>{d.address} a {d.cityName}{d.phone && <div>{d.phone}</div>}</h5>
            <div>{this.buildTime(d.time)}</div>
            {d.sponsored && <div style={{marginTop: '5px', fontWeight: 'bold'}}>{d.sponsored}</div>}
          </div>
          <div style={{width: '50%', float:'left', textAlign: 'right'}}>
            <a target="_blank" href={'https://www.google.com/maps/dir//' + mapsString}><img src={'http://maps.googleapis.com/maps/api/staticmap?center=' + mapsString + '&zoom=13&scale=2&size=100x100&maptype=roadmap&format=png&visual_refresh=true&markers=size:small%7Ccolor:0xff0000%7Clabel:%7C' + mapsString} alt={'Google Map of ' + mapsString}/></a>
          </div>
        </Paper>);
    });

    return <div>{result}</div>;
  }

  buildData() {
    let data = this.props.data.raw;
    if (data.length === 0) {
      return (
        <div style={{fontSize: '14px'}}>
          <p>Non ho trovato alcun risultato</p>
          <div>
            <RaisedButton label="Cerca in comuni limitrofi" onClick={this.callDeep}/>
          </div>
        </div>
        );
    }
    // msg = "Ho trovato " + data.length + " risultat" + ((data.length === 1) ? 'o' : 'i') + "\n";
    //   data.forEach((d) => {
    //     d = this.dataArrayToString(d);
    //     message = "\n" + d.name + " in " + d.address + (analysed.deep ? (' ' + d.cityName) : '') + "\n";
    //     time = JSON.parse(d.time);
    //     time = time[this.getToday()];
    //     if (time.length === 0) {
    //       message = message + 'Oggi è chiuso';
    //     } else {
    //       message += this.printTime(time) + "\n";
    //     }
    //     msg += message;
    //   });

    //   return new Promise((resolve, reject) => {
    //     resolve({results: data.length, message: msg, raw: data});
    //   })
    // });
    return this.buildMessage(data)
  }

  buildTime(time) {
    let selectedTime;

    time = JSON.parse(time);
    selectedTime = time[this.getToday()];
    if (selectedTime.length === 0) {
      return (
        <div>
          <div>Oggi è chiuso</div>
          <div>Domani è {this.printTime(time[this.getToday() === 6 ? 0 :this.getToday() + 1])}</div>
        </div>
      );
    } else {
      return <span>{this.printTime(selectedTime)}</span>;
    }
  }

  printTime(time) {
    let times = [];

    time.forEach((t) => {
      times.push('dalle ' + t.Start + ' alle ' + t.Finish);
    })

    return 'Aperto ' + times.join(' e ');
  }

  getToday() {
    let day = new Date().getDay();

    day = day + 6;
    day = day % 7;

    return day;
  }

  render() {
    let message = this.props.data;
    return (
      <Paper className="single-message" style={{margin: '10px'}} zDepth={1}>
        <div>
          <h3 style={{marginTop: 0}}>{message.username}</h3>
            {this.buildData()}
        </div>
      </Paper>);
  }
}