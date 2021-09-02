import React from 'react'
import './style.css'
import DataNavBar from "../datanavbar/datanavbar";
import NavBar from "../navbar/navbar";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            triggerFunc: []
        }
        this.nbaRequest = this.nbaRequest.bind(this);

    }
    nbaRequest(values) {
        this.setState({ triggerFunc: [values.payload_data, values.nbaNfl_active]})
    }
    render() {
            return (
                <>
                    <NavBar onCallNba={this.nbaRequest} />
                    <DataNavBar nba_nfl={this.state.nba_nfl} triggerChildFunc={this.state.triggerFunc} />
                </>
            )

    }
}
export default Home