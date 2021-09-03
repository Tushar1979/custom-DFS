import React, {Component} from 'react';
import { Auth } from "aws-amplify";
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';


class SignUp extends Component {
    constructor(props) {
        super(props);
    }

    signUpBtn = () =>{
        const usersignUp = Auth.signUp({
            username: 'sanket.sanglikar@cubexo.io',
            password:   'Sanket@123',
        });

        usersignUp.then((data) => {
            console.log(data,);
            this.props.history.push('/verify_otp');

        }).catch((message)=> {
            console.log(message);
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
                            <input value="" type="text" id="login"
                                   className="fadeIn second" name="login" placeholder="Email Address"/>
                            <input value="" type="text" id="password"
                                   className="fadeIn third" name="password" placeholder="password"/>
                            <button type="submit" className="fadeIn forth" onClick={this.signUpBtn} value="Log In" >Login</button>
                            <span className="button-google fadeIn forth">Forgot Password</span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;