import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import {Amplify} from "aws-amplify";

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";
import {toast, ToastContainer} from "react-toastify";

class Forget extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:''

        }
    }
    emailField = (e) =>{
        this.setState({
            email: e.target.value
        })
    }

    fogetPassOTP = () => {
        Auth.forgotPassword(this.state.email)
        .then((data) =>
         {
         this.props.history.push('/ForgetPasswordOtp', {username:this.state.email})
         }).catch( (err) =>

         {

             toast.error("⭐ Email not found.");
         this.props.history.push('/Forget')
         })
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

    render() {
        return (
            <div className="main">
                <div className="wrapper fadeInDown">
                    <div id="formContent" >

                        <h2 className="active"> Forgot Password </h2>
                        <div className="forgotContainer">
                            <TextField
                                label="Email Address"
                                className="input_field fadeIn second"
                                onChange={this.emailField}
                                hintText="Password"
                                floatingLabelText="Email"
                                type="email" required
                            />


                                <button  className="fadeIn forth loginBtn" onClick = {this.fogetPassOTP}> SUBMIT USERNAME
                                    <ToastContainer
                                        position="bottom-right"
                                        autoClose={5000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        draggable
                                        pauseOnHover
                                        className='toasterStyle'
                                    />
                                </button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default Forget;