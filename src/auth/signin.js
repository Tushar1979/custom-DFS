import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import Spinner from '../components/Spinner/spinner'

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";
import {toast, ToastContainer} from "react-toastify";
import CircularSpinner from "../components/Spinner/spinner";

const emailReg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]/);
const passwordReg = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/);

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            password:'',
            user: localStorage.getItem('username'),
            spinner:false,
            is_emailValid:false,
            is_passValid:false,
            msg:""
        }
    }
    emailField = (e) =>{
        this.setState({
            email: (e.target.value).toLowerCase(), is_emailValid: emailReg.test(e.target.value)
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
componentDidMount() {
        if(this.state.user){
            this.props.history.push('/');
        }
        else{
            this.props.history.push('/signin');
        }
}
    forgotBtn = () => {
        this.props.history.push('/Forget')
    }


        loginBtn = () => {
            if(this.state.is_emailValid && this.state.is_passValid) {
                this.setState({spinner: true})
                const usersignIn = Auth.signIn(this.state.email, this.state.password);

                let datas = true;
                usersignIn.then((response) => {
                    console.error("Success--")
                    if (response.username) {
                        localStorage.setItem('username', response.username);
                        toast.success("⭐ Welcome to CustomDFS",{toastId:"sinWelcomeHom"});
                        this.props.history.push('/');
                    } else {
                        console.error("else--")
                        // toast.error("⭐ Email or Password is Invalid...");
                        this.setState({spinner: false})
                        datas = false;
                    }
                }).catch((message) => {
                    console.error("Catch--");
                    // toast.error("⭐ Email or Password is Invalid...");
                    this.setState({spinner: false});
                    datas = false;
                });
                setTimeout(() => {
                    if (!datas) {
                        toast.error("⭐ Email or Password is Invalid...",{toastId:"sinInvalidCreditionals"});
                    } else {
                        setTimeout(() => {
                            toast.success("⭐ Welcome to CustomDFS...",{toastId:"sinWelcomeHome"});
                        }, 1500)
                    }
                }, 1500)
            }
            else if(!this.state.is_emailValid) {
                toast.error("⭐ Email format is not correct",{toastId:"sinWrongMail"})
            }
            else if(!this.state.is_passValid){
                toast.error("⭐ Password format is not correct",{toastId:"sinWrongPass"})
            }
            else{
                console.error("Something Unexpected Happened :( ")
            }
    }

    render() {
        return (
            <>
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
                                    <TextField style={{
                                        marginBottom: "0.5rem",
                                    }}
                                        label="Email Address"
                                        className="input_field fadeIn second"
                                        onChange={this.emailField}
                                        hintText="Email"
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
                                        <button className="fadeIn forth loginBtn" disabled> <CircularSpinner/></button>
                                        :
                                        <button className="fadeIn forth loginBtn" onClick={this.loginBtn}> Login
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
                                <span className="button-google fadeIn forth" onClick={this.forgotBtn}>Forgot Password</span>


                            </div>
                        </div>
                    </div>
            </>
        )
    }
}

export default SignIn;