import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';

class SignIn1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            signinAction: true,
            signupAction: true,
        };

    }

    signinClick = event =>{
        this.setState({signinAction:true})
        this.setState({signupAction:false})
    }
    signupClick = event =>{
        this.setState({signupAction:true})
        this.setState({signinAction:false})

    }

    render() {

        return (
            <div className="main">
                {this.state.signinAction ?
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <h2 className="active"> Sign In </h2>
                        <h2 className="inactive underlineHover" onClick={this.signupClick}>Sign Up </h2>


                        <div className="fadeIn first">
                            <img src={authLogo} id="icon"
                                 alt="User Icon"/>
                        </div>


                        <div>
                            <input value="" type="text" id="login"
                                   className="fadeIn second" name="login" placeholder="Email Address"/>
                            <input value="" type="text" id="password"
                                   className="fadeIn third" name="password" placeholder="password"/>
                            <input type="submit" className="" value="Log In"/>
                            <span className="button-google">Forgot Password</span>
                        </div>

                    </div>
                </div>
                    :

                    <div className="wrapper fadeInDown">
                        <div id="formContent">

                            <h2 className="inactive underlineHover" onClick={this.signinClick}> Sign In </h2>
                            <h2 className="  active">Sign Up </h2>


                            <div className="fadeIn first">
                                <img src={authLogo} id="icon"
                                     alt="User Icon"/>
                            </div>


                            <div className="mb-5">
                                <input type="text" id="login"
                                       className="fadeIn second" name="login" placeholder="Email Address"/>
                                <input type="text" id="password"
                                       className="fadeIn third" name="password" placeholder="password"/>
                                <p className="password_help ">*Password must include at least 1 uppercase letter, 1 lowercase letter and 1 number</p>
                                <input type="submit" className="" value="Sign Up"/>
                            </div>

                        </div>
                    </div>
                }

            </div>
        )
    }
}

export default SignIn1;