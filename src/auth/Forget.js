import React, {Component} from 'react';
import './style.css';

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";
import {toast, ToastContainer} from "react-toastify";

const emailReg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]/)

class Forget extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            is_emailValid:false
        }
    }
    emailField = (e) =>{
        this.setState({
            email: (e.target.value).toLowerCase(), is_emailValid: emailReg.test(e.target.value)
        })
    }

    fogetPassOTP = () => {
        if(this.state.is_emailValid) {
            Auth.forgotPassword(this.state.email)
                .then((data) => {
                    this.props.history.push('/ForgetPasswordOtp', {username: this.state.email})
                }).catch((err) => {
                console.log(err)
                toast.error("⭐ Email not found.");
                this.props.history.push('/Forget')
            })
        }
        else if(this.state.email.length<1) {
            toast.error("⭐ First enter email",{toastId:"fEmptyEmailField"})
        }
        else {
            toast.error("⭐ Email Format is not correct",{toastId:"fWrongFormat"})
        }
    }

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
                                </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Forget;