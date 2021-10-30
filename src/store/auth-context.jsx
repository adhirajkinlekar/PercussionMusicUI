import React, { useState, createContext } from 'react';
import axios from 'axios';
const AuthContext = createContext({
  token: '',
  user:null,
  isLoggedIn: false,
  login: (token,user) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  let intialToken = localStorage.getItem('token') ?? null;
  let intialUser = localStorage.getItem('user') ?? null;
  const [token, setToken] = useState(intialToken);
  const [user, setUser] = useState(JSON.parse(intialUser));
  const userIsLoggedIn = !!token;

  const loginHandler = (token,user) => {
    setToken(token);
    localStorage.setItem('token',token);
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
    localStorage.setItem('user',JSON.stringify(user))
    setUser(user)
  };

  const logoutHandler = (user) => {
    setToken(null);
    localStorage.removeItem('token')
    axios.defaults.headers.common['Authorization'] = '';
    localStorage.removeItem('user')
    setUser(null)
  };

  const contextValue = {
    token: token,
    user:user,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;