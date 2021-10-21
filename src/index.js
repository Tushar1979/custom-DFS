import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Amplify from 'aws-amplify';

Amplify.configure({
    Auth:{
        mandatorySignId:true,
        region: 'us-east-1',
        userPoolId: 'us-east-1_y4ICPLoWJ',
        userPoolWebClientId: '7ob8ngt7d1efjhrudc524qlqsn',
    }
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
