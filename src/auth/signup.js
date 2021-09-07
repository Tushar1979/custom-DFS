import React, {Component} from 'react';
import { Auth } from "aws-amplify";
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import {TextField} from "@material-ui/core";
import { CognitoUserPool } from 'amazon-cognito-identity-js'
import {toast, ToastContainer} from "react-toastify";
import Spinner from '../components/Spinner/spinner'

const emailReg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]/)
const passwordReg = new RegExp(/^[A-Z]*$/);

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            password:'',
            spinner:false,
            btnActive:true,
            is_emailValid:false,
            is_passValid:false

        }
    }
    emailField = (e) =>{
        this.setState({
            email: (e.target.value).toLowerCase()
        })
        this.setState({is_emailValid: emailReg.test(e.target.value)})
        if(this.state.is_emailValid && this.state.password > 5){
            this.setState({btnActive:false})
        }
        else{
            this.setState({btnActive: true})
        }
    }
    passwordField = (e) =>{
        this.setState({
            password: e.target.value
        })
        if(this.state.is_emailValid && this.state.password.length>5){
                this.setState({btnActive:false})
        }
        else{
            this.setState({btnActive:true})
        }
    }

    forgotBtn = () => {
        this.props.history.push('/Forget')
    }

    signUpBtn = () =>{
        this.setState({spinner:true})

        const poolData = {
        UserPoolId: 'us-east-1_y4ICPLoWJ',
        ClientId: '7ob8ngt7d1efjhrudc524qlqsn',
    };

        const UserPool = new CognitoUserPool(poolData);

        UserPool.signUp(this.state.email ,this.state.password, [], null, (err, data)=>{
        if (err) {
            toast.error("⭐ Email or Password in Invalid...");
            this.setState({spinner:false})
        }
        else {
            this.setState({spinner:false})
            this.props.history.push('/verify_otp', {username:this.state.email});
        }
    })
    };

    render() {

        return (
            <div className="main">
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <h2 className="inactive underlineHover">
                            <Link class="authLink" to="/signin">Sign In</Link>
                        </h2>
                        <h2 className=" active">Sign Up </h2>


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

                            {this.state.spinner ?
                                <button className="fadeIn forth loginBtn" disabled> <Spinner/></button>
                                :
                                <button
                                    className={`fadeIn forth loginBtn ${this.state.btnActive ? 'btnDisabled' : ''} `}
                                    onClick={this.signUpBtn} disabled={this.state.btnActive ? true : false}> Sign Up
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
                            }

                            <span className="button-google fadeIn forth" onClick={this.forgotBtn}>Forgot Password</span>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;