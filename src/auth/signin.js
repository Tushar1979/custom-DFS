import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            password:''

        }
    }
    emailField = (e) =>{
        this.setState({
            email: e.target.value
        })
    }
    passwordField = (e) =>{
        this.setState({
            password: e.target.value
        })
    }


    loginBtn = () => {
        this.props.history.push('/');
        const usersignIn = Auth.signIn(this.state.email, this.state.password);
        usersignIn.then((response) => {
            // console.log(response);
            localStorage.setItem('username', response.username);
            this.props.history.push('/');
        }).catch((message) => {
            console.log(message)
        })
    }

    render() {

        return (
            <div className="main">
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <h2 className="active"> Sign In </h2>
                        <h2 className="inactive underlineHover">
                            <Link class="authLink" to="/signup">Sign Up</Link>
                        </h2>
                        <div className="fadeIn first">
                            <img src={authLogo} id="icon"
                                 alt="User Icon"/>
                        </div>
                        <div>
                            {/*<input value="" type="text" id="login"*/}
                            {/*       className="fadeIn second input_field" name="login" placeholder="Email Address"/>*/}
                            <TextField
                                label="Email Address"
                                className="input_field fadeIn second"
                                onChange={this.emailField}
                                hintText="Password"
                                floatingLabelText="Email"
                                type="email"
                            />
                            <TextField
                                label="password"
                                className="input_field fadeIn third"
                                onChange={this.passwordField}
                                hintText="Password"
                                floatingLabelText="Password"
                                type="password"
                            />
                            {/*<input value="" type="text" id="password"*/}
                            {/*       className="fadeIn third" name="password" placeholder="password"/>*/}

                            <button  className="fadeIn forth loginBtn"  onClick={this.loginBtn}> Login </button>
                            <span className="button-google fadeIn forth">Forgot Password</span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;