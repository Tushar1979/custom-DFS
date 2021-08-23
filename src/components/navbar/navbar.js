import React from 'react'
import './navbar.css'
import logo from '../../images/dfs-logo.png'
import left_capsule from '../../images/capsule-img.png'
import right_capsule from '../../images/right-capsule.png'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
class NavBar extends React.Component {
    render() {
        return (
            <>
                <div className="container-fluid navbar-container">
                    <nav class="navbar navbar-expand-lg navbar-dark primary-color pd-0">
                        <img src={logo} className="nav-logo" />
                        <div className="nav-capsule">
                            <div className="column left-capsule">
                                <img src={left_capsule} className="left-capsule-img"/>
                                <span className="left-capsule-text">NBA</span>
                            </div>
                            <div className="column right-capsule">
                                <div className="right-capsule-body">
                                    <img src={right_capsule} className="left-capsule-img"/>
                                    <span className="right-capsule-text">NBA</span>
                                </div>
                            </div>
                        </div>

                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav"
                                aria-controls="basicExampleNav" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse right-nav" id="basicExampleNav">

                            <ul class="navbar-nav ">
                                <li class="nav-item active">
                                    <Link class="nav-link" to="/">Premium
                                    </Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link" to="/report-bug">Report a Bug</Link>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Leave Feedback</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Contact Us</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" href="#">Sign Out</a>
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