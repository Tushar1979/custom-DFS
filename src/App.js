import logo from './logo.svg';
import './App.css';
import NavBar from "./components/navbar/navbar"
import Home from "./components/home/index"
import ReportBog from "./components/reportBug/index";
import SignIn from "./auth/signin";
import SignUp from "./auth/signup"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import React from "react";
import Auth from "./auth/auth";
function App() {
  return (
    <div className="App">
        <Router>
            <div>
                <Switch>
                    <Route exact path="/" component={Home}>
                    </Route>
                    <Route path="/report-bug" component={ReportBog}>
                    </Route>
                    <Route path="/signin" component={SignIn} />
                    <Route path="/signup" component={SignUp} />
                </Switch>
            </div>
        </Router>
    </div>
  );
}

export default App;
