'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

require('../src/StreamComponent.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StreamComponent = function (_Component) {
  _inherits(StreamComponent, _Component);

  function StreamComponent(props) {
    _classCallCheck(this, StreamComponent);

    var _this = _possibleConstructorReturn(this, (StreamComponent.__proto__ || Object.getPrototypeOf(StreamComponent)).call(this, props));

    console.log(props);

    _this.state = {
      videoSrc: '',
      videoSrcUnsafe: ''
    };

    _this.handleVideoClicked = _this.handleVideoClicked.bind(_this);

    var that = _this;

    var intervalSrc = setInterval(function () {
      if (that.state !== undefined) {
        if (props.stream.video.srcObject !== undefined) {
          if (props.stream.video.srcObject !== null) {
            console.log(props.stream.video.srcObject);
            var src = URL.createObjectURL(props.stream.video.srcObject);
            if (!(that.state.videoSrcUnsafe === src)) {
              that.setState({
                videoSrc: src,
                videoSrcUnsafe: src
              });
              clearInterval(intervalSrc);
            }
          }
        }
      }
    }, 200);
    return _this;
  }

  _createClass(StreamComponent, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var that = this;
      if (that.state !== undefined) {
        if (nextProps.stream.video.srcObject !== undefined) {
          if (nextProps.stream.video.srcObject !== null) {
            var src = URL.createObjectURL(nextProps.stream.video.srcObject);
            if (!(that.state.videoSrcUnsafe === src)) {
              that.setState({
                videoSrc: src,
                videoSrcUnsafe: src
              });
            }
          }
        }
      }
    }
  }, {
    key: 'getNicknameTag',
    value: function getNicknameTag() {
      return JSON.parse(this.props.stream.connection.data).clientData;
    }
  }, {
    key: 'videoClicked',
    value: function videoClicked(event) {
      if (this.props.mainVideoStream) {
        this.props.mainVideoStream(this.props.stream);
      }
    }
  }, {
    key: 'handleVideoClicked',
    value: function handleVideoClicked(event) {
      this.videoClicked(event);
    }
  }, {
    key: 'render',
    value: function render() {
      console.log(this.state.src);
      return _react2.default.createElement(
        'div',
        { className: 'streamcomponent' },
        _react2.default.createElement('video', { src: this.state.videoSrc, id: 'native-video-' + this.props.stream.connection.connectionId + '_webcam', onClick: this.handleVideoClicked, autoPlay: true, muted: this.props.isMuted }),
        _react2.default.createElement(
          'div',
          { id: 'data-' + this.props.stream.connection.connectionId },
          _react2.default.createElement(
            'p',
            null,
            this.getNicknameTag()
          )
        )
      );
    }
  }]);

  return StreamComponent;
}(_react.Component);

exports.default = StreamComponent;
