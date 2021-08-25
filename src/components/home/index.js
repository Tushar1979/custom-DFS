import React from 'react'
import './style.css'
import DataNavBar from "../datanavbar/datanavbar";
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state =
            {
                players_data:[

                ]
            }

    }


    render() {
        return (
            <>

                <DataNavBar />
            </>
        )
    }
}
export default Home