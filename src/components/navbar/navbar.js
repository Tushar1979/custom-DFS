import React from 'react'
import './navbar.css'
import '../datanavbar/datanavbar.css'
import logo from '../../images/dfs-logo.png'
import left_capsule from '../../images/capsule-img.png'
import right_capsule from '../../images/right-capsule.png'
import {Link} from "react-router-dom";
import data_table from "../datanavbar/datanavbar"
import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js'
import { Auth } from "aws-amplify";

class NavBar extends React.Component {
    constructor() {
        super();
        this.nbaActive = this.nbaActive.bind(this);
        this.nflActive = this.nflActive.bind(this);
    }

    logOut = () => {
        const userLogout = Auth.signOut();
        console.log(userLogout);
        userLogout.then((data) => {
            console.log(data);
        }).catch((message) => {
            console.log(message);
        })
    };


    nbaActive() {
        this.props.onCallNba({payload_data:{user:{id:'Master'}, sportView:"NBA"}, nbaNfl_active:true})
    }
    nflActive() {
        this.props.onCallNba({payload_data:{user:{id:'Master'}, sportView:"NFL"}, nbaNfl_active:false})
    }
    render() {
        return (
            <>
                <div className="container-fluid navbar-container">
                    <nav className="navbar navbar-expand-lg navbar-dark primary-color pd-0">
                        <img src={logo} className="nav-logo" />
                        <div className="common-button nav-common-btn">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-primary active ad-group-btn" >
                                    <input type="radio" name="options" autoComplete="off" checked onClick={this.nbaActive}/>
                                    <span className="btn-img"> <img src={left_capsule} className="btn-img-logo"/></span>
                                    <span className="btn-text"> nba</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off" onClick={this.nflActive}/>
                                    <span className="btn-img"> <img src={right_capsule} className="btn-img-logo"/></span>
                                    <span className="btn-text"> nfl</span>
                                </label>
                            </div>
                        </div>

                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav"
                                aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse right-nav" id="basicExampleNav">

                            <ul className="navbar-nav ">
                                <li className="nav-item active">
                                    <Link class="nav-link" to="/">Premium
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link class="nav-link" to="/report-bug">Report a Bug</Link>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Leave Feedback</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={this.logOut}>SignOut</a>
                                </li>
                                <li className="nav-item">
                                    <Link class="nav-link" to="/signin">Sign In</Link>
                                </li>
                            </ul>
                        </div>

                    </nav>
                </div>
            </>
        )
    }
}
export default NavBar