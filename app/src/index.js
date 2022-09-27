import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import {store} from './store/store';
import { Provider } from 'react-redux';

import App from './app';
import reportWebVitals from './reportWebVitals';

import './assets/css/main.css';
import './assets/css/font-awesome.min.css';
import './assets/css/sweetalert.min.css';
import '../node_modules/react-notifications/lib/notifications.css';

import './assets/js/bootstrap.js';
import './assets/js/main.js';
import './assets/js/pace.js';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
