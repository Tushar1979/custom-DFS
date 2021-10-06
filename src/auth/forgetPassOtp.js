import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import {Amplify} from "aws-amplify";

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";
import {toast, ToastContainer} from "react-toastify";
const passwordReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/);

class ForgetOtp extends Component {
    constructor(props) {
        super(props);
        this.state={
            otp:'',
            password:'',
            username: props.history.location.state['username'],
            is_passValid:false,
            msg:''
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
        this.setState({ password: e.target.value,is_passValid: passwordReg.test(e.target.value)},()=>{
            if(passwordReg.test(e.target.value))
            {
                this.setState({msg:""})
            }
            else if(e.target.value.length<8)
            {
                this.setState({msg:"Password length must be 8 or greater"})
            }
            else if(e.target.value.match(/^(?=.*[A-Z])(?=.*\d)[A-Z\d@$!%*?&]{8,}$/))
            {
                this.setState({msg:"Password must contain atleast one small character"})
            }
            else if(e.target.value.match(/^(?=.*[a-z])(?=.*\d)[a-z\d@$!%*?&]{8,}$/))
            {
                this.setState({msg:"Password must contain atleast one capital character"})
            }
            else if(e.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z@$!%*?&]{8,}$/))
            {
                this.setState({msg:"Password must contain atleast one number/digit"})
            }
            else if(e.target.value.match(/^[A-Z@$!%*?&]{8,}$/))
            {
                this.setState({msg:"Password must contain atleast one digit and small character"})
            }
            else if(e.target.value.match(/^[a-z@$!%*?&]{8,}$/))
            {
                this.setState({msg:"Password must contain atleast one digit and capital character"})
            }
            else if(e.target.value.match(/^[\d@$!%*?&]{8,}$/))
            {
                this.setState({msg:"Password must contain atleast one capital and small character"})
            }
            else
            {
                this.setState({msg:"Password must not contain any special character other than '@,$,!,%,*,?,&'"})
            }
        })
    }

    newPass = () => {
        if(this.state.is_passValid)
        {
            Auth.forgotPasswordSubmit(this.state.username, this.state.otp, this.state.password)
                .then((data) =>
                {
                    toast.success("⭐ Password changed successfully")
                    this.props.history.push('/signin')
                })
                .catch((err) => {console.log(err)
                    toast.error("⭐ "+err.message)
                });
        }
        else {
            toast.error("Password format is not correct")
        }
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
                            <h6>{this.state.username}</h6>
                            <TextField style={{
                                marginBottom: "0.5rem",
                            }} id="standard-basic" label="OTP" className="input_field fadeIn second" onChange={this.otpField} />
                            <TextField
                                label="password"
                                className="input_field fadeIn third"
                                onChange={this.passwordField}
                                hintText="Password"
                                floatingLabelText="Password"
                                type="password"
                            />
                            {this.state.is_passValid ?"" : <span id="passInstructions"><br/>{this.state.msg}</span>}
                            <span className="button-google fadeIn forth" onClick={this.newPass}>SUBMIT VERIFICATION</span>
                            <ToastContainer
                                position="bottom-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                className='toasterStyle'
                            />
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default ForgetOtp;