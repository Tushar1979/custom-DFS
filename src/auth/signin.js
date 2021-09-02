import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';

class SignIn extends Component {
    constructor(props) {
        super(props);
    }
    // https://cognito-idp.us-east-1.amazonaws.com/

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
                            <input value="" type="text" id="login"
                                   className="fadeIn second" name="login" placeholder="Email Address"/>
                            <input value="" type="text" id="password"
                                   className="fadeIn third" name="password" placeholder="password"/>
                            <input type="submit" className="fadeIn forth" value="Log In"/>
                            <span className="button-google fadeIn forth">Forgot Password</span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;