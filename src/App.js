import React, { Fragment, useContext, useEffect, useState} from 'react';
// import { withRouter } from "react-router";
import { NavLink, Route, Switch } from 'react-router-dom';
import './App.css';
import List from './components/list'
import Profile from './components/profile';
import SelectArtist from './components/selectArtist';
import Signin from './components/signIn';
// import { Link, NavLink, Route, Router, useParams, Switch, Redirect } from 'react-router-dom';
import Register from './components/register';
import AuthContext from './store/auth-context';

import ErrorBoundary from './components/errorBoundary';
import HTTPInterceptor from './components/HTTPInterceptor';
import { useHistory } from "react-router";
import AddList from './components/addList';
import Unauthorized from './components/unauthorized';

const App = ()=> {

  const history = useHistory();
  const authctx = useContext(AuthContext);
  const [screenwidth,setScreenwidth] = useState(window.screen.availWidth)
  const [showProfile,setShowProfile] = useState(true);

  const resizeScreen =() => {
    console.log(screenwidth)
    setScreenwidth(window.screen.availWidth)
     }

     useEffect(()=>{
       window.addEventListener("resize", resizeScreen);
       // eslint-disable-next-line react-hooks/exhaustive-deps
     },[window.screen.availWidth])

  const logout = () => {
    authctx.logout();
    // if (this.props.history.location.pathname !== '/') {
    //   this.props.history.push("/");
    // } to be used with class components and also wrap the export component with withRouter()
    if (history.location.pathname !== '/') {
      history.push("/");
    }
  }
  const showProfileComponent = (value) =>{
    setShowProfile(value)
  }
    return (
      <div>
        <div className="appContent">
          <div className="ui middle aligned selection list listName navHeader">
            <div className="item">
              <NavLink activeClassName="" to="/">
                <div className="content">
                  <h1 className="header headerName">Percussion Music</h1>
                </div>
              </NavLink>
            </div>
            {
              authctx.isLoggedIn ?
                <div className="navIcons">
               { authctx?.user?.role === 'admin' && <NavLink activeClassName="" to="/admin">
                  <i className="cogs icon settingsIcon"></i> 
                  </NavLink> }
                  <i onClick={logout} className="power off icon powerOffIcon"></i>
                </div> :
                <div className="navIcons">

                  <NavLink activeClassName="" to="/signin">
                    <i className="fa fa-sign-in fa-2x signIn" aria-hidden="true"></i>
                  </NavLink>
                  {/* <NavLink activeClassName="" to="/register">
                    <i className="fa fa-user-plus fa-2x register" aria-hidden="true"></i>
                  </NavLink> */}
                </div>
            }
          </div>
          <ErrorBoundary>
            <Switch>
            <Route path="/admin" exact>
                <AddList />
              </Route>
              <Route path="/signin" exact>
                <Signin />
              </Route>
              <Route path="/register" exact>
                <Register />
              </Route>
              <Route path="/" exact>
                <SelectArtist />
              </Route>
              <Route path="/artist/:name/:id" exact>
            { (screenwidth <= 1215 && showProfile) ? <Profile showProfileComponent={showProfileComponent}/> : (screenwidth <= 1215 && !showProfile) ? <List  showProfileComponent={showProfileComponent}/> : (screenwidth > 1215) ?
          <Fragment>
            <Profile/>
           <List/> 
          </Fragment>  :null
          }
              </Route>
              <Route path="/unauthorized" exact>
               <Unauthorized/>
              </Route>
              <Route path="*">
                <span className="pageNotFoundContainer">
                  <h1 className="pageNotFound"> Page Not Found</h1>
                  <p className="pageNotFoundDesc">We're sorry, the page you requested could not be found</p>
                </span>
              </Route>
            </Switch>
            <HTTPInterceptor/> 
            </ErrorBoundary>

        </div>
      </div>
    );
}

export default App;

//do not use anchor tag with react router
//any component that is not a child of a router cannot contain any react router related components
//to add two way binding such as to a form use the value property on inputs and bind the state to it.once the form is submitted clear the values.
//useEffect-[] means execute only for the first render,no second argument means execute for initial and every render,array with properties means execute for inital render 
//and if the value of state inside the array has changed for every render since last render
//refs persists betweeen the renders of your component. refs can also be used for eg for focus such as element.current.focus();