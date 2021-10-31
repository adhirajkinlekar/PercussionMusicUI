import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'semantic-ui-css/semantic.min.css'
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import {BrowserRouter} from 'react-router-dom';
import {AuthContextProvider} from './store/auth-context'
import axios from 'axios';

axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

console.log(process.env)
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {

console.log(true)
axios.defaults.baseURL = 'http://localhost:3001'
} else {
  axios.defaults.baseURL = 'https://percussionmusicapi.herokuapp.com';
}

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
    <BrowserRouter>
    <App/>
    </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// npm install react-router-dom
