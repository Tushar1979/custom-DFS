import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import {Amplify} from "aws-amplify";

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";

class ForgetOtp extends Component {
    constructor(props) {
        super(props);
        this.state={
            otp:'',
            password:'',
            username: props.history.location.state['username']
        }
    }
    otpField = (e) =>{
        this.setState({otp:e.target.value})
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

    newPass = () => {

        Auth.forgotPasswordSubmit(this.state.username, this.state.otp, this.state.password)
    .then((data) =>
    {
        console.log(data)
        this.props.history.push('/signin')
    })
    .catch((err) => {console.log(err)
    });

    }


//    loginBtn = () => {
//        // const usersignIn = Auth.signIn('sanket.sanglikar@cubexo.io', 'Sanket@123');
//        const usersignIn = Auth.signIn(this.state.email, this.state.password);
//        usersignIn.then((data) => {
//            console.log(data);
//            this.props.history.push('/');
//        }).catch((message) => {
//            console.log(message)
//        })
//    }

    render(props) {

        return (
            <div className="main">
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <div>
                            <h4>{this.state.username}</h4>
                            <TextField id="standard-basic" label="OTP" className="input_field fadeIn second" onChange={this.otpField} />
                            <TextField
                                label="password"
                                className="input_field fadeIn third"
                                onChange={this.passwordField}
                                hintText="Password"
                                floatingLabelText="Password"
                                type="password"
                            />

                            <span className="button-google fadeIn forth" onClick={this.newPass}>SUBMIT VERIFICATION</span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default ForgetOtp;