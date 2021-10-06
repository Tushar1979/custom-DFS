import React, {Component} from 'react';
import { Auth } from "aws-amplify";
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import {TextField} from "@material-ui/core";
import { CognitoUserPool } from 'amazon-cognito-identity-js'
import {toast, ToastContainer} from "react-toastify";
import Spinner from '../components/Spinner/spinner'
import 'react-toastify/dist/ReactToastify.css';

// toast.configure()
const emailReg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]/)
const passwordReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/);
const smallChar = new RegExp(/^(?=.*[A-Z])(?=.*\d)[A-Z\d@$!%*?&]{8,}$/)

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            password:'',
            spinner:false,
            btnActive:true,
            is_emailValid:true,
            is_passValid:true,
            msg:""
        }
    }
    emailField = (e) =>{
        this.setState({
                email: (e.target.value).toLowerCase(), is_emailValid: emailReg.test(e.target.value) },
            ()=>{
                if(this.state.is_emailValid && ( this.state.is_passValid && this.state.password.length > 0) ){
                    this.setState({btnActive: false})
                }
                else{
                    this.setState({btnActive: true})
                }
        })

    }
    passwordField = (e) =>{
        this.setState({ password: e.target.value,is_passValid: passwordReg.test(e.target.value)}
            ,()=>{
                if(  (this.state.is_emailValid && this.state.email.length > 0 )  && this.state.is_passValid)
                {
                    this.setState({btnActive:false})
                }
                else
                {
                    this.setState({btnActive:true})
                }
            })

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

        return new Promise((resolve, reject) => (
            UserPool.signUp(this.state.email ,this.state.password, [], null, (err, data)=>{
                if(err){
                    console.error(err)
                    toast.error(`⭐ ${err.message}`,{toastId:"supInvalidCreditiona"})

                    // reject(err)
                    this.setState({spinner:false})
                }
                else{
                    this.setState({spinner:false})
                    // resolve(data.user);
                    setTimeout(toast.success(`⭐ OTP sent to ${data.user.getUsername()}`, {toastId:"signUpSuccess"}),1000)
                    this.props.history.push('/verify_otp', {username:this.state.email});
                }
            })
            ))


        // UserPool.signUp(this.state.email ,this.state.password, [], null, (err, data)=>{
        // if (err) {
        //     console.log(data)
        //     console.log(err)
        //     toast.error("⭐ Email or Password in Invalid...",{toastId:"supInvalidCreditionals"});
        //     this.setState({spinner:false})
        // }
        // else {
        //     console.log(data)
        //     this.setState({spinner:false})
        //     this.props.history.push('/verify_otp', {username:this.state.email});
        // }

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
                            <TextField style={{
                                marginBottom: "0.5rem",
                            }}
                            label="Email Address"
                            className="input_field fadeIn second"
                            onChange={this.emailField}
                            hintText="Password"
                            floatingLabelText="Email"
                            type="email"
                        />
                            <TextField style={{
                                marginBottom: "0.5rem",
                            }}
                                label="Password"
                                className="input_field fadeIn third"
                                onChange={this.passwordField}
                                hintText="Password"
                                floatingLabelText="Password"
                                type="password"
                            />
                            {this.state.is_passValid ?"" : <span id="passInstructions"><br/>{this.state.msg}</span>}

                            {this.state.spinner ?
                                <button className="fadeIn forth loginBtn" disabled> <Spinner/></button>
                                :
                                <button
                                    className={`fadeIn forth loginBtn ${this.state.btnActive ? 'btnDisabled' : ''} `}
                                    onClick={this.signUpBtn} disabled={this.state.btnActive ? true : false}> Sign Up
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
                            }


                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;