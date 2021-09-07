import React, {Component} from 'react';
import { Auth } from "aws-amplify";
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import {TextField} from "@material-ui/core";
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js'


class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            password:''

        }
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

    forgotBtn = () => {
        this.props.history.push('/Forget')
    }

    signUpBtn = () =>{

        const poolData = {
        UserPoolId: 'us-east-1_y4ICPLoWJ',
        ClientId: '7ob8ngt7d1efjhrudc524qlqsn',
    };

        const UserPool = new CognitoUserPool(poolData);

        UserPool.signUp(this.state.email ,this.state.password, [], null, (err, data)=>{
        if (err) this.props.history.push('/', {username:this.state.email});
        console.log(data);
        this.props.history.push('/verify_otp', {username:this.state.email});
    })


//        const usersignUp = Auth.signUp({
//            username: this.state.email,
//            password:   this.state.password,
//        });

//        usersignUp.then((data) => {
//            console.log(data,);
//            this.props.history.push('/verify_otp');
//
//        }).catch((message)=> {
//            console.log(message);
//            this.props.history.push('/verify_otp');
//        })
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
                            <button type="submit" className="fadeIn forth loginBtn" onClick={this.signUpBtn} value="Log In" >Sign Up</button>

                            <span className="button-google fadeIn forth" onClick={this.forgotBtn}>Forgot Password</span>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;