import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import { Auth } from "aws-amplify";
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js'


class SignIn extends Component {
    constructor(props) {
        super(props);
        console.log("##########################")
    }
//     https://cognito-idp.us-east-1.amazonaws.com/



signUpBtn = () =>{

//    const poolData = {
//        UserPoolId: 'us-east-1_y4ICPLoWJ',
//        ClientId: '7ob8ngt7d1efjhrudc524qlqsn',
//    };

//    const UserPool = new CognitoUserPool(poolData);
//
//    UserPool.signUp('customdfs99@gmail.com' ,'Password1', [], null, (err, data)=>{
//        if (err) console.error(err);
//        console.log(data);
//    })
    const usersignUp = Auth.signUp({
        username: 'sanket.sanglikar@cubexo.io',
        password:   'Sanket@123',
    });

    usersignUp.then((data) => {
        console.log(data);
    }).catch((message)=> {
        console.log(message);
    })
  };
    render() {

        return (
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
                            <input value="" type="text" id="login"
                                   className="fadeIn second" name="login" placeholder="Email Address"/>
                            <input value="" type="text" id="password"
                                   className="fadeIn third" name="password" placeholder="password"/>
                            <button  className="fadeIn forth sadas"  onClick={this.signUpBtn}> Sign Up </button>
                            <span className="button-google fadeIn forth">Forgot Password</span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignIn;