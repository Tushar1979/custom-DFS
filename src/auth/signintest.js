import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect,Link } from 'react-router-dom';

import './style.css';

class SignIn1 extends Component {
    constructor(props) {
        super(props);


        this.onChange = this.onChange.bind(this);
        this.Submitfrom = this.Submitfrom.bind(this);

        this.state = {
            login: '',
            password: ''
        };

    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    Submitfrom(e) {
        e.preventDefault();
        const { login, password } = this.state
        if (login === "A" && password === "B");
        {
            this.setState({
                SignIn: true
            })
        }



    }

    render() {
        if (this.state.SignIn) {
            return <Redirect to="/Dashboard"/>
        }
        return (
            <div>
                <div className="wrapper fadeInDown">
                    <div id="formContent">

                        <h2 className="active"> Sign In </h2>
                        <h2 className="inactive underlineHover">Sign Up </h2>


                        <div className="fadeIn first">
                            <img src="https://www.customdfs.com/0f8c7d1acd0397630cb6a6ebd17f08b7.png" id="icon" alt="User Icon" />
                        </div>


                        <form onSubmit={this.Submitfrom}>
                            <input value={this.state.login} onChange={this.onChange} type="text" id="login" class="fadeIn second" name="login" placeholder="login" />
                            <input value={this.state.password} onChange={this.onChange} type="text" id="password" class="fadeIn third" name="password" placeholder="password" />
                            <input type="submit" class="fadeIn fourth" value="Log In" />
                            <a className="button-google fadeIn fourth" href="/google">Sign In with Google</a>
                        </form>

                        <div id="formFooter">
                            <a className="underlineHover" href="#">Forgot Password?</a>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
export default SignIn1;