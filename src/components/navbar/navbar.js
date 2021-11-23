import React from 'react'
import './navbar.css'
import '../datanavbar/datanavbar.css'
import logo from '../../images/dfs-logo.png'
import left_capsule from '../../images/capsule-img.png'
import right_capsule from '../../images/right-capsule.png'
import {Link} from "react-router-dom";
import {ToastContainer} from "react-toastify";
class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.nbaActive = this.nbaActive.bind(this);
        this.nflActive = this.nflActive.bind(this);
        this.state={
            user:localStorage.getItem("username")
        }
    }

    componentDidMount() {
        sessionStorage.setItem("order" , "asc")
        sessionStorage.setItem("orderby" , "salary")
    }

    nbaActive() {
        this.props.onCallNba({payload_data:{user:{id:'Master'}, sportView:"NBA"}, nbaNfl_active:true})
    }
    nflActive() {
        this.props.onCallNba({payload_data:{user:{id:'Master'}, sportView:"NFL"}, nbaNfl_active:false})
    }
    render() {
        return (<>
                <ToastContainer
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    className='toasterStyle'
                />
                <div className="container-fluid navbar-container">
                    <nav className="navbar navbar-expand-lg navbar-dark primary-color pd-0">
                        <img src={logo} className="nav-logo" alt="Image1" />
                        <div className="common-button nav-common-btn">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-primary active ad-group-btn" >
                                    <input type="radio" name="options" autoComplete="off" checked onClick={this.nbaActive}/>
                                    <span className="btn-img"> <img src={left_capsule} className="btn-img-logo" alt="Image2" /></span>
                                    <span className="btn-text"> nba</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off" onClick={this.nflActive}/>
                                    <span className="btn-img"> <img src={right_capsule} className="btn-img-logo" alt="Image3"/></span>
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
                                {/*<li className="nav-item active">*/}
                                {/*    <Link class="nav-link" >MANAGE SUBSCRIPTION</Link>*/}
                                {/*</li>*/}
                                <li className="nav-item">
                                    <Link class="nav-link" to="/customdfs-report_a_bug">Report a Bug</Link>
                                </li>
                                <li className="nav-item">
                                    <Link class="nav-link" to="/customdfs-feedback">Leave Feedback</Link>
                                </li>
                                <li className="nav-item">
                                    <Link class="nav-link" to="/customdfs-contact_us">Contact Us</Link>
                                </li>
                                {this.state.user?
                                <li className="nav-item">
                                    <Link className="nav-link" to="/logout">SignOut</Link>
                                </li>
                                    :
                                <li className="nav-item">
                                    <Link class="nav-link" to="/signin">Sign In</Link>
                                </li>
                                }
                            </ul>
                        </div>
                    </nav>
                </div>
            </>
        )
    }
}
export default NavBar