import React, {Component} from 'react';
import { Auth } from "aws-amplify";
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js'

class SignUp extends Component {
    constructor(props) {
        super(props);
    }

    loginBtn = () =>{

//    const poolData = {
//        UserPoolId: 'us-east-1_y4ICPLoWJ',
//        ClientId: '7ob8ngt7d1efjhrudc524qlqsn',
//    };
//
//    const UserPool = new CognitoUserPool(poolData);
//
//    UserPool.signIn('customdfs99@gmail.com' ,'Password1', [], null, (err, data)=>{
//        if (err) console.error(err);
//        console.log(data);
//    })

try {
    const usersignup = Auth.signIn('sanket.sanglikar@cubexo.io','Sanket@123');
    console.log(usersignup);

}
catch(error){
    let err = null;
    !error.message ? err = {"Message": error}: err = error;
}
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
                            <button type="submit" className="fadeIn forth" onClick={this.loginBtn} value="Log In" >Login</button>
                            <span className="button-google fadeIn forth">Forgot Password</span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;