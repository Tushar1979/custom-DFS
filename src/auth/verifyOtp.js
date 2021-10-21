import React, {Component} from 'react';
import authLogo from "../images/login_logo.png"
import './style.css';
import {toast, ToastContainer} from "react-toastify";
import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";

class VerifyOtp extends Component {
    constructor(props) {
        super(props);
        this.state={
            otp:'',
            username: props.history.location.state['username']
        }
    }
    otpField = (e) =>{
        this.setState({otp:e.target.value})
    }
    verifyOtpBtn = () =>{

    const verify = Auth.confirmSignUp(this.state.username, this.state.otp)
        verify.then((data)=>{
            toast.success("⭐ Account created successfully")
            this.props.history.push('/signin');
        }).catch((message) => {
            toast.error("⭐ "+message.message)
        })
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
                            <TextField id="standard-basic" label="OTP" className="input_field fadeIn second" onChange={this.otpField} />
                            <button  className="fadeIn forth loginBtn"  onClick={this.verifyOtpBtn}> Verify Otp </button>
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

export default VerifyOtp;