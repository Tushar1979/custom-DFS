import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect, Link} from 'react-router-dom';
import authLogo from "../images/login_logo.png"
import './style.css';
import API from '../networking/api'

class SignUp extends Component {
    api = new API()


    componentDidMount() {
        this.SignUp();
    }
    SignUp = event => {
        let url = ''
        let data = ''
        this.api.PostApi(data,url)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    console.log('+++++----++++', response_data.body)
                } else if (res.request.status === 401) {
                    console.log("login")
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {

        return (
            <div className="main">
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <h2 className="inactive underlineHover"> Sign In </h2>
                        <h2 className=" active">Sign Up </h2>


                        <div className="fadeIn first">
                            <img src={authLogo} id="icon"
                                 alt="User Icon"/>
                        </div>


                        <div>
                            <input value={this.state.login} type="text" id="login"
                                   class="fadeIn second" name="login" placeholder="Email Address"/>
                            <input value={this.state.password} type="text" id="password"
                                   class="fadeIn third" name="password" placeholder="password"/>
                            <input type="submit" class="fadeIn fourth" value="Log In"/>
                            {/*<span className="button-google fadeIn fourth">Forgot Password</span>*/}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default SignUp;