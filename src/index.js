import React from 'react';
import ReactDOM from 'react-dom';
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Route,
  Link,
} from "react-router-dom";
import './index.css';
import App from './App';


import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
