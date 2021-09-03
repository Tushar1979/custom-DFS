import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import {Amplify} from "aws-amplify";

import { Auth } from "aws-amplify";

class VerifyOtp extends Component {
    constructor(props) {
        super(props);
    }
    verifyOtpBtn = () =>{



    };
    render() {

        return (
            <div className="main">
                <div className="wrapper fadeInDown">
                    <div id="formContent">
                        <div className="fadeIn first">
                            <img src={authLogo} id="icon"
                                 alt="User Icon"/>
                        </div>
                        <div>
                            <input value="" type="text" id="login"
                                   className="fadeIn second" name="login" placeholder="Verify OTP"/>

                            <button  className="fadeIn forth loginBtn"  onClick={this.verifyOtpBtn}> Verify Otp </button>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default VerifyOtp;