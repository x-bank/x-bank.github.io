import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
} from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import './index.css';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';



ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
