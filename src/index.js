import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
} from "react-router-dom";
import './index.css';
import App from './App';
import '@rainbow-me/rainbowkit/styles.css';


import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();


ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
