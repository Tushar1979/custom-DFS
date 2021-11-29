import React, {Component} from 'react';
import './style.css';
import { Auth } from "aws-amplify";

class LogOut extends Component {
    constructor(props) {
        super(props);
        this.logOut()
    }
    logOut = () => {
        const userLogout = Auth.signOut();
        userLogout.then((data) => {
            localStorage.removeItem('username')
            localStorage.removeItem('passcode')
            this.props.history.push('/');
        }).catch((message) => {
            console.log(message);
        })
    };

    render() {return ( <></> )}
}

export default LogOut;