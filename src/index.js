import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import Router from './components/router'
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-globally'

const state = {
  url: ''
}

ReactDOM.render(
  <Provider globalState={state}>
    <Router />
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
