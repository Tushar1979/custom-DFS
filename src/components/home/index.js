import React from 'react'
import './style.css'
import DataNavBar from "../datanavbar/datanavbar";
import NavBar from "../navbar/navbar";
// import Footer from '../footer/footer';
import {Redirect} from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            triggerFunc: [],
            user:localStorage.getItem('username'),
            passcode:localStorage.getItem('passcode')
        }
        this.nbaRequest = this.nbaRequest.bind(this);

    }
    componentDidMount() {
        if(this.state.user && this.state.passcode){
            this.props.history.push('/');
        }
        else{
            localStorage.removeItem('username');
            this.props.history.push('/signin');
            // <Redirect to="/signin" />
        }
    }
    nbaRequest(values) {
        this.setState({ triggerFunc: [values.payload_data, values.nbaNfl_active]})
    }
    render() {
            return (
                <>
                    <NavBar onCallNba={this.nbaRequest} />
                    <DataNavBar nba_nfl={this.state.nba_nfl} triggerChildFunc={this.state.triggerFunc} />
                    {/* <Footer/> */}
                </>
            )
    }
}
export default Home