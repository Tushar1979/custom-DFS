import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import Loader from '../loader/loader'

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            password:'',
            user: localStorage.getItem('username'),
            loader:false
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
componentDidMount() {
        if(this.state.user){
            this.props.history.push('/');
        }
        else{

            this.props.history.push('/signin');
        }
}
    forgotBtn = () => {
        this.props.history.push('/Forget')
    }

    loginBtn = () => {
        this.setState({loader:true})
        const usersignIn = Auth.signIn(this.state.email, this.state.password);
        usersignIn.then((response) => {
            localStorage.setItem('username', response.username);
            this.props.history.push('/');
        }).catch((message) => {
            this.setState({loader:false})
            console.log(message)
        })
    }

    render() {
        return (
            <>
                {this.state.loader ? <Loader/>
                    :

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

                            <button  className="fadeIn forth loginBtn"  onClick={this.loginBtn}> Login </button>
                            <span className="button-google fadeIn forth" onClick={this.forgotBtn}>Forgot Password</span>
                        </div>


                            </div>
                        </div>
                    </div>
                }
            </>
        )
    }
}

export default SignIn;