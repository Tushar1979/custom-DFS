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
            passcode:'',
            // username: props.history.location.state['username']
        }
        this.verifyPasscode = this.verifyPasscode.bind(this)
    }
    otpField = (e) =>{
        this.setState({passcode:e.target.value})
    }
    verifyPasscode = () => {
        var axios = require('axios');
        var data = JSON.stringify({"data":this.state.passcode});

        var config = {
            method: 'post',
            url: 'https://tzl1c5qcq8.execute-api.us-east-2.amazonaws.com/passcode',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

        var headers = {
            'Content-Type': 'application/json'
        }
        const request = axios.post('https://tzl1c5qcq8.execute-api.us-east-2.amazonaws.com/passcode', data, {
            headers: headers
        }).then((res) => {
            if(res.data.statusCode === 200){
                localStorage.setItem('passcode', JSON.stringify(res.data.response))
                console.log(res.data.response)
                this.props.history.push('/')
                setTimeout(() => { toast.success("⭐ "+"Welcome to CustomDFS")} , 1900 )
            }
            else {
                toast.error("⭐ "+"Invalid Passcode")
            }

        }).catch((err) => {
            toast.error("⭐ "+err)
            console.log(err);
        })


    }
    logOut = () => {
        const userLogout = Auth.signOut();
        userLogout.then((data) => {
            localStorage.removeItem('username')
            this.props.history.push('/');
        }).catch((message) => {
            console.log(message);
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
                            <h4>Please Enter CustomDFS Beta Test Passcode</h4>
                            <TextField id="standard-basic" label="Passcode: " className="input_field fadeIn second" onChange={this.otpField} />
                            <button  className="fadeIn forth loginBtn"  onClick={this.verifyPasscode}> Verify Passcode </button>
                            <button  className="fadeIn forth loginBtn"  onClick={this.logOut}> Logout </button>

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