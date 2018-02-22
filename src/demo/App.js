import React from 'react';
import OpenviduReact from '../lib';

const App = () => (
  <div>
    <OpenviduReact wsUrl={"localhost"} sessionId={"A"} participantId={1}/>
  </div>
);

export default App;
