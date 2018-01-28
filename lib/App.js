'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('../src/App.css');

var _openviduBrowser = require('openvidu-browser');

var _StreamComponent = require('../src/StreamComponent.js');

var _StreamComponent2 = _interopRequireDefault(_StreamComponent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = { valueSessionId: 'SessionA',
      valueUserName: 'Participant' + Math.floor(Math.random() * 100),
      session: undefined,
      mainVideoStream: undefined,
      localStream: undefined,
      remoteStreams: []
    };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleClick = _this.handleClick.bind(_this);
    _this.handleMainVideoStream = _this.handleMainVideoStream.bind(_this);
    _this.onbeforeunload = _this.onbeforeunload.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      this.joinSession();
    }
  }, {
    key: 'handleClick',
    value: function handleClick() {
      this.leaveSession();
    }
  }, {
    key: 'handleChangeSessionId',
    value: function handleChangeSessionId(e) {
      this.setState({
        valueSessionId: e.target.value
      });
    }
  }, {
    key: 'handleChangeUserName',
    value: function handleChangeUserName(e) {
      this.setState({
        valueUserName: e.target.value
      });
    }
  }, {
    key: 'joinSession',
    value: function joinSession() {
      var _this2 = this;

      this.OV = new _openviduBrowser.OpenVidu();

      this.setState({
        session: this.OV.initSession("wss://" + window.location.hostname + ":8443/" + this.sessionId.value + '?secret=MY_SECRET')
      }, function () {

        var mySession = _this2.state.session;

        var that1 = _this2;

        mySession.on('streamCreated', function (event) {

          var myRemoteStreams = that1.state.remoteStreams;

          myRemoteStreams.push(event.stream);

          that1.setState({
            remoteStreams: myRemoteStreams
          });

          mySession.subscribe(event.stream, '');
        });

        mySession.on('streamDestroyed', function (event) {
          event.preventDefault();

          that1.deleteRemoteStream(event.stream);
        });

        var that = _this2;

        mySession.connect(null, '{"clientData": "' + _this2.state.valueUserName + '"}', function (error) {

          if (!error) {
            var publisher = that.OV.initPublisher('', {
              audio: true,
              video: true,
              quality: 'MEDIUM'
            });

            var streamInterval = setInterval(function () {
              that.setState({
                localStream: publisher.stream,
                mainVideoStream: that.state.localStream
              }, function () {
                if (that.state.localStream !== undefined && that.state.mainVideoStream !== undefined) {
                  clearInterval(streamInterval);
                }
              });
            }, 200);

            mySession.publish(publisher);
          } else {
            console.log('There was an error connecting to the session:', error.code, error.message);
          }
        });
        return false;
      });
    }
  }, {
    key: 'leaveSession',
    value: function leaveSession() {
      var mySession = this.state.session;

      if (this.OV) {
        mySession.disconnect();
      }

      this.OV = null;

      this.setState({
        session: undefined,
        remoteStreams: [],
        valueSessionId: 'SessionA',
        valueUserName: 'Participant' + Math.floor(Math.random() * 100),
        localStream: undefined
      });
    }
  }, {
    key: 'deleteRemoteStream',
    value: function deleteRemoteStream(stream) {
      var myRemoteStreams = this.state.remoteStreams;
      var index = myRemoteStreams.indexOf(stream, 0);
      if (index > -1) {
        myRemoteStreams.splice(index, 1);
        this.setState({
          remoteStreams: myRemoteStreams
        });
      }
    }
  }, {
    key: 'getMainVideoStream',
    value: function getMainVideoStream(stream) {
      this.setState({
        mainVideoStream: stream
      });
    }
  }, {
    key: 'onbeforeunload',
    value: function onbeforeunload(event) {
      this.leaveSession();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      window.addEventListener("beforeunload", this.onbeforeunload);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener("beforeunload", this.onbeforeunload);
    }
  }, {
    key: 'handleMainVideoStream',
    value: function handleMainVideoStream(stream) {
      this.getMainVideoStream(stream);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var valueSessionId = this.state.valueSessionId;
      var valueUserName = this.state.valueUserName;
      return _react2.default.createElement(
        'div',
        { id: 'main-container', className: 'container' },
        this.state.session === undefined ? _react2.default.createElement(
          'div',
          { id: 'join' },
          _react2.default.createElement(
            'div',
            { id: 'img-div' },
            _react2.default.createElement('img', { src: 'resources/images/openvidu_grey_bg_transp_cropped.png', alt: 'OpenVidu logo' })
          ),
          _react2.default.createElement(
            'div',
            { id: 'join-dialog', className: 'jumbotron vertical-center' },
            _react2.default.createElement(
              'h1',
              null,
              ' Join a video session '
            ),
            _react2.default.createElement(
              'form',
              { className: 'form-group', onSubmit: this.handleSubmit },
              _react2.default.createElement(
                'p',
                null,
                _react2.default.createElement(
                  'label',
                  null,
                  'Participant: '
                ),
                _react2.default.createElement('input', { className: 'form-control', type: 'text', id: 'userName', value: valueUserName, onChange: this.handleChangeUserName.bind(this), required: true })
              ),
              _react2.default.createElement(
                'p',
                null,
                _react2.default.createElement(
                  'label',
                  null,
                  ' Session: '
                ),
                _react2.default.createElement('input', { className: 'form-control', type: 'text', id: 'sessionId', ref: function ref(input) {
                    _this3.sessionId = input;
                  }, value: valueSessionId, onChange: this.handleChangeSessionId.bind(this), required: true })
              ),
              _react2.default.createElement(
                'p',
                { className: 'text-center' },
                _react2.default.createElement('input', { className: 'btn btn-lg btn-success', name: 'commit', type: 'submit', value: 'JOIN' })
              )
            )
          )
        ) : null,
        this.state.session !== undefined ? _react2.default.createElement(
          'div',
          { id: 'session' },
          _react2.default.createElement(
            'div',
            { id: 'session-header' },
            _react2.default.createElement(
              'h1',
              { id: 'session-title', value: valueSessionId },
              valueSessionId
            ),
            _react2.default.createElement('input', { id: 'buttonLeaveSession', className: 'btn btn-large btn-danger', type: 'button', onClick: this.handleClick, value: 'LeaveSession' })
          ),
          this.state.mainVideoStream !== undefined ? _react2.default.createElement(
            'div',
            { id: 'main-video', className: 'col-md-6' },
            _react2.default.createElement(_StreamComponent2.default, { stream: this.state.mainVideoStream, isMuted: true })
          ) : null,
          _react2.default.createElement(
            'div',
            { id: 'video-container', className: 'col-md-6' },
            this.state.localStream !== undefined ? _react2.default.createElement(
              'div',
              { className: 'stream-container col-md-6 col-xs-6' },
              _react2.default.createElement(_StreamComponent2.default, { stream: this.state.localStream, isMuted: true, mainVideoStream: this.handleMainVideoStream })
            ) : null,
            this.state.remoteStreams.map(function (s, i) {
              return _react2.default.createElement(
                'div',
                { key: i, className: 'stream-container col-md-6 col-xs-6' },
                _react2.default.createElement(_StreamComponent2.default, { stream: s, isMuted: false, mainVideoStream: _this3.handleMainVideoStream })
              );
            })
          )
        ) : null
      );
    }
  }]);

  return App;
}(_react.Component);

exports.default = App;
