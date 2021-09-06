import React, {Component} from 'react'
import './navbar.css'
import '../datanavbar/datanavbar.css'
import logo from '../../images/dfs-logo.png'
import left_capsule from '../../images/capsule-img.png'
import right_capsule from '../../images/right-capsule.png'
import {Link} from "react-router-dom";
import { Auth } from "aws-amplify";

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.nbaActive = this.nbaActive.bind(this);
        this.nflActive = this.nflActive.bind(this);
        let data1 = {
            "data":{
                "playerStats":[
                    {
                        "FD_Proj":0,
                        "GlobalGameID":17686,
                        "FD_Floor":0,
                        "DK_Floor":0,
                        "ReceivingTouchdowns":0,
                        "GlobalTeamID":11,
                        "Team":"DET",
                        "RushingTouchdowns":0,
                        "FanDuelPosition":"WR",
                        "PassingInterceptions":0,
                        "FieldGoalsAttempted":0,
                        "ReceivingYards":0,
                        "FD_Value":0,
                        "Opponent":"SF",
                        "DK_Value":0,
                        "PassingTouchdowns":0,
                        "PassingCompletions":1234120,
                        "FD_Ceil":0,
                        "Name":"Javon McKinley",
                        "Receptions":0,
                        "FieldGoalsMade":0,
                        "PassingYards":0,
                        "DK_Ceil":0,
                        "FanDuelSalary":4500,
                        "RushingYards":0,
                        "FumblesLost":0,
                        "FantasyPoints":0,
                        "DK_Proj":0,
                        "DraftKingsSalary":3000,
                        "PassingAttempts":0,
                        "ReceivingTargets":0,
                        "RushingAttempts":0,
                        "Position":"WR",
                        "Id":"22655",
                        "DraftKingsPosition":"WR",
                        "PlayerID":22655
                    }
                ],
                "user":{
                    "id":"3002fa1b-8cdf-4349-92a2-3eaac5d66174"
                },
                "sportView":"NFL"
            }
        }
        let data2 = {
            "data":{
                "playerStats":[
                    {
                        "FD_Proj":0,
                        "GlobalGameID":17686,
                        "FD_Floor":0,
                        "DK_Floor":0,
                        "ReceivingTouchdowns":0,
                        "GlobalTeamID":11,
                        "Team":"DET",
                        "RushingTouchdowns":0,
                        "FanDuelPosition":"WR",
                        "PassingInterceptions":0,
                        "FieldGoalsAttempted":0,
                        "ReceivingYards":0,
                        "FD_Value":0,
                        "Opponent":"SF",
                        "DK_Value":0,
                        "PassingTouchdowns":0,
                        "PassingCompletions":1234120,
                        "FD_Ceil":0,
                        "Name":"Javon McKinley",
                        "Receptions":0,
                        "FieldGoalsMade":0,
                        "PassingYards":0,
                        "DK_Ceil":0,
                        "FanDuelSalary":4500,
                        "RushingYards":0,
                        "FumblesLost":0,
                        "FantasyPoints":0,
                        "DK_Proj":0,
                        "DraftKingsSalary":3000,
                        "PassingAttempts":0,
                        "ReceivingTargets":0,
                        "RushingAttempts":0,
                        "Position":"WR",
                        "Id":"22655",
                        "DraftKingsPosition":"WR",
                        "PlayerID":22655
                    }
                ],
                "user":{
                    "id":"3002fa1b-8cdf-4349-92a2-3eaac5d66174"
                },
                "sportView":"NFL"
            }
        }
        console.log(data1 === data2, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")

    }

    // logOut = () => {
    //     const userLogout = Auth.signOut();
    //     console.log(userLogout, "##");
    //     userLogout.then((data) => {
    //         console.log(data, "####");
    //         this.props.history.push('/signin');
    //     }).catch((message) => {
    //         console.log(message);
    //     })
    // };


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
                                    <Link className="nav-link" to="/logout">SignOut</Link>
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