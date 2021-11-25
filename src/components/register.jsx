import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from "react-router";
import AuthContext from '../store/auth-context';
import axios from 'axios';
class Register extends Component {
    static contextType = AuthContext;
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordConfirm: '',
            name: '',
            error:false
        }
    }
    componentDidMount() {
        if (this.context.isLoggedIn) {
            this.props.history.push("/");
        }

    }

    onInputChange = (event) => {
        const {name,value} = event.target;
        // switch (property) {
        //     case 'name':
        //         return this.setState({ name: event.target.value })
        //     case 'email':
        //         return this.setState({ email: event.target.value })
        //     case 'password':
        //         return this.setState({ password: event.target.value })
        //     case 'passwordConfirm':
        //         return this.setState({ passwordConfirm: event.target.value })
        //     default: return
        // }
        this.setState({ [name]: value })
    }

    onSubmitRegister = (e) => {
        e.preventDefault();
        axios.post(`${axios.defaults.baseURL}/api/users/signup`, {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            passwordConfirm: this.state.passwordConfirm,
            photo: `https://avatars.dicebear.com/api/bottts/${this.state.name}.svg`
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
        const { name, email, password, passwordConfirm,error} = this.state;
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
                                Name
                            </p>
                            <input type="text"
                                name="name"
                                id="name"
                                onChange={this.onInputChange} placeholder="Name" />
                        </div>
                        <div className="field">
                            <p>
                                Email
                            </p>
                            <input type="email"
                                name="email"
                                id="email"
                                onChange={this.onInputChange} placeholder="Email" />
                        </div>
                        <div className="field">
                            <p>Password</p>
                            <input type="password"
                                name="password"
                                id="password"
                                onChange={this.onInputChange} placeholder="password" />
                        </div>
                        <div className="field">
                            <p>Confirm Password</p>
                            <input type="password"
                                name="passwordConfirm"
                                id="passwordConfirm"
                                onChange={this.onInputChange} placeholder="confirm password" />
                            {passwordConfirm.length > 0 && passwordConfirm !== password ? <div className="ui negative message">
                                <div className="header">
                                    Passwords do not match
                                </div>
                            </div> : null}
                        </div>
                        <div>
                            <input disabled={name.length !== 0 && email.length !== 0 && password.length !== 0 && passwordConfirm.length !== 0 && password === passwordConfirm ? false : true} className="ui primary button"
                                onClick={(e) => this.onSubmitRegister(e)}
                                type="submit"
                                value="Register"
                            />
                            <NavLink activeClassName="" to="/signin"> <span> <h4>or Sign In</h4> </span>
                            </NavLink>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Register);



