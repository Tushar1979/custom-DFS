import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import SignIn from "./signin";
import SignUp from "./signup"

class Auth extends Component {
    render() {
        return (<>
                <Router>
                    <div>
                        <Switch>
                            <Route exact path="/signin" component={SignIn}/>
                            <Route exact path="/signup" component={SignUp}/>
                        </Switch>
                    </div>
                </Router>
                <SignIn/>
            </>)}
}

export default Auth;