import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';

import { Auth } from "aws-amplify";
import {TextField} from "@material-ui/core";

class LogOut extends Component {
    constructor(props) {
        super(props);
        this.logOut()
    }

    logOut = () => {
        const userLogout = Auth.signOut();
        userLogout.then((data) => {
            localStorage.setItem('username', '')
            this.props.history.push('/signin');
        }).catch((message) => {
            console.log(message);
        })
    };


    render() {

        return (
            <></>
        )
    }
}

export default LogOut;