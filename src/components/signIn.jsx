import React, { Component } from 'react';
import AuthContext from '../store/auth-context';
import { withRouter } from "react-router";
import { NavLink } from 'react-router-dom';
import axios from 'axios';
class Signin extends Component {
    static contextType = AuthContext;
    constructor() {
        super();
        this.state = {
            signInEmail: '',
            signInPassword: '',
            error:false
        }
    }


    componentDidMount() {
        if (this.context.isLoggedIn) {
            this.props.history.push("/");
        }

    }


    onInputChange = (event, property) => {
        switch (property) {
            case 'signInEmail':
                return this.setState({ signInEmail: event.target.value })
            case 'signInPassword':
                return this.setState({ signInPassword: event.target.value })
            default: return
        }
    }

    onSubmitSignIn = (e) => {
        e.preventDefault();
        axios.post(`${axios.defaults.baseURL}/api/users/login`, {
            email: this.state.signInEmail,
            password: this.state.signInPassword
        })
            .then(response => response.data)
            .then(response => {
                this.context.login(response.token, response.data.user)
                this.props.history.push("/");
            })
            .catch(err => {
                this.setState({error:true})
            })
    }

    render() {
        const { signInEmail, signInPassword,error } = this.state;
        return (
        <div className="ui card">
                {  error ? <div className="ui error message">
                    <div className="header">
                       Error occurred
                    </div>
                </div> : null }
                <div className="content">
                    <form className="ui form">
                        <div className="field">
                            <p>
                                Email
                            </p>
                            <input type="email"
                                onChange={(e) => this.onInputChange(e, 'signInEmail')} placeholder="Email" />
                        </div>
                        <div className="field">
                            <p>Password</p>
                            <input type="password"
                                onChange={(e) => this.onInputChange(e, 'signInPassword')} placeholder="Password" />
                        </div>
                        <div>
                            <input disabled={signInEmail.length !== 0 && signInPassword.length !== 0 ? false : true} className="ui primary button"
                                onClick={(e) => this.onSubmitSignIn(e)}
                                type="submit"
                                value="Sign In"
                            /> <NavLink activeClassName="" to="/register"> <span> <h4>or Register</h4> </span>
                            </NavLink>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Signin);

