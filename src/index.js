import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import Router from './components/router'
import registerServiceWorker from './registerServiceWorker';



ReactDOM.render(<Router />, document.getElementById('root'));
registerServiceWorker();
