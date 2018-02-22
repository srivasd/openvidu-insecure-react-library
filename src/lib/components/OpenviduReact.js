import React, { Component } from 'react';
import './OpenviduReact.css';
import { OpenVidu } from 'openvidu-browser';
import StreamComponent from './StreamComponent.js';

class OpenviduReact extends Component {
  
  constructor(props){
    super(props);
    //const { wsUrl, sessionId, participantId, token } = this.props;
    this.state = {valueSessionId: 'Session ' + this.props.sessionId,
                  valueUserName: 'Participant ' + this.props.participantId,
                  stateWsUrl: this.props.wsUrl,
                  stateToken: this.props.token,
                  session: undefined,
                  mainVideoStream: undefined,
                  localStream: undefined,
                  remoteStreams: [],
                 };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick  = this.handleClick.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
  }

  handleSubmit(event){
    event.preventDefault();
    this.joinSession();
  }

  handleClick(){
    this.leaveSession();
  }

  handleChangeSessionId(e){
    this.setState({
      valueSessionId : e.target.value,
    });
  }

  handleChangeUserName(e){
    this.setState({
      valueUserName : e.target.value,
    });
  }

  joinSession() {

      this.OV = new OpenVidu();

      this.setState({
        session: this.OV.initSession("wss://" + this.state.stateWsUrl + ":8443/" + this.state.valueSessionId + '?secret=MY_SECRET'),
      }, () => {

        var mySession = this.state.session;
        
        var that1 = this;

        
        mySession.on('streamCreated', (event) => {
          
          var myRemoteStreams = that1.state.remoteStreams; 

          myRemoteStreams.push(event.stream); 
          
          that1.setState({
            remoteStreams: myRemoteStreams
          });

          mySession.subscribe(event.stream, '');

        });


        mySession.on('streamDestroyed', (event) => {
          event.preventDefault();
        
          that1.deleteRemoteStream(event.stream);
        });
        
        var that = this;

        var token = this.getCurrentToken();
        
        mySession.connect(token, '{"clientData": "' + this.state.valueUserName + '"}', (error) => {
            
          if (!error) {
            let publisher = that.OV.initPublisher('', {
              audio: true,
              video: true,
              quality: 'MEDIUM'
            });

            var streamInterval = setInterval(function(){
              that.setState({
                localStream: publisher.stream,
                mainVideoStream: that.state.localStream
              }, () => {
                if(that.state.localStream!==undefined&&that.state.mainVideoStream!==undefined){
                  clearInterval(streamInterval);
              }})}, 200);

              mySession.publish(publisher);
          
          } else {
            console.log('There was an error connecting to the session:', error.code, error.message);
          }
                
        });
        return false;
      });    
    }
    
    leaveSession() {
      var mySession = this.state.session;
      
      if(this.OV) {mySession.disconnect();}

      this.OV = null;

      this.setState({
        session: undefined,
        remoteStreams: [],
        valueSessionId: 'Session ' + this.props.sessionId,
        valueUserName: 'Participant ' + this.props.participantId,
        localStream: undefined,
      });

    }

    deleteRemoteStream(stream) {
      var myRemoteStreams = this.state.remoteStreams;
      let index = myRemoteStreams.indexOf(stream, 0);
      if (index > -1) {
        myRemoteStreams.splice(index, 1);
        this.setState({
          remoteStreams: myRemoteStreams
        });
      }
    }

    getMainVideoStream(stream) {
      this.setState({
        mainVideoStream: stream,
      });
    }
    
    onbeforeunload(event) {
      this.leaveSession();
    };

    componentDidMount(){
      window.addEventListener("beforeunload", this.onbeforeunload);
    }

    componentWillUnmount(){
      window.removeEventListener("beforeunload", this.onbeforeunload)
    }

    handleMainVideoStream(stream) {
      this.getMainVideoStream(stream);
    }

    getCurrentToken() {
      return (this.state.stateToken)
        ? this.state.stateToken
        : 'dummytoken' + this.participantId;
    }

  render() {
    var valueSessionId = this.state.valueSessionId;
    var valueUserName = this.state.valueUserName;
      return (
        <div id="main-container" className="container">
        { this.state.session === undefined ? <div id="join">
          <div id="join-dialog" className="jumbotron vertical-center">
          <h1> Join a video session </h1>
          <form className="form-group" onSubmit={this.handleSubmit}>
            <p>
              <label>Participant: </label>
              <input className="form-control" type="text" id="userName" value={valueUserName} onChange={this.handleChangeUserName.bind(this)}required/>
            </p>
            <p>
              <label> Session: </label>
              <input className="form-control" type="text" id="sessionId" ref={(input) => { this.sessionId = input; }} value={valueSessionId} onChange={this.handleChangeSessionId.bind(this)}required/>
            </p>
            <p className="text-center">
              <input id="join-button" name="commit" type="submit" value="JOIN"/>
            </p>
          </form>
          </div>
        </div> : null }
  
        { this.state.session !== undefined ? <div id="session">
          <div id="session-header">
            <h1 id="session-title" value={valueSessionId}>{valueSessionId}</h1>
            <input id="buttonLeaveSession" type="button" onClick={this.handleClick} value="LeaveSession"/>
          </div>
          { this.state.mainVideoStream !== undefined ? <div id="main-video" >
            <StreamComponent stream={this.state.mainVideoStream} isMuted={true}></StreamComponent>
          </div> : null }
          <div id="video-container">
          { this.state.localStream !== undefined ? <div className="stream-container">
              <StreamComponent stream={this.state.localStream} isMuted={true} mainVideoStream={this.handleMainVideoStream}></StreamComponent>
            </div> : null }
          { this.state.remoteStreams.map((s, i) => <div key={i} className="stream-container">
              <StreamComponent stream={s} isMuted={false} mainVideoStream={this.handleMainVideoStream}></StreamComponent>
            </div>) }
          </div>
        </div> : null }
      </div>
      ); 
  }
}

export default OpenviduReact;
