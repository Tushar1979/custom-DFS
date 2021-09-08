import logo from './logo.svg';
import './App.css';
import NavBar from "./components/navbar/navbar"
import Home from "./components/home/index"
import ReportBog from "./components/reportBug/index";
import SignIn from "./auth/signin";
import SignUp from "./auth/signup"
import { CognitoUserPool } from 'amazon-cognito-identity-js'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import React, { useState } from "react";
import Amplify from "aws-amplify";
import Auth from "./auth/auth";
import VerifyOtp from "./auth/verifyOtp";

import LogOut from "./auth/logout"


import Forget from "./auth/Forget";
import ForgetPassOtp from './auth/forgetPassOtp'

function App() {

  return (
    <div className="App">
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/customdfs-feedback" component={ReportBog}/>
                    <Route path="/signin" component={SignIn} />
                    <Route path="/signup" component={SignUp} />
                    <Route path="/verify_otp" component={VerifyOtp} />
                    <Route path="/logout" component={LogOut} />
                    <Route path="/Forget" component={Forget} />
                    <Route path="/ForgetPasswordOtp" component={ForgetPassOtp} />

                </Switch>
            </div>
        </Router>
    </div>
  );
}

export default App;
