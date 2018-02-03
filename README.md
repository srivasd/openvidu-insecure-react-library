# Openvidu insecure React library 

## Installation

`npm i openvidu-insecure-react-library --save` or `yarn add openvidu-insecure-react-library `

## Usage

_openvidu-server_ and _Kurento Media Server_ must be up and running in your development machine. The easiest way is running this Docker container which wraps both of them (you will need [Docker CE](https://store.docker.com/search?type=edition&offering=community)):

```bash
docker run -p 8443:8443 --rm -e KMS_STUN_IP=stun.l.google.com -e KMS_STUN_PORT=19302 -e openvidu.secret=MY_SECRET openvidu/openvidu-server-kms
```

> Note Parent containers should have `width` and `height` 100%, to `react-under-construction` was able to stretch full screen

````
import React from 'react';
import OpenviduReact from 'openvidu-insecure-react-library';
import 'openvidu-insecure-react-library/build/css/index.css';

const App = () => (
  <OpenviduReact/>
);

export default App;
````
