import React from 'react'
import './style.css'
class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state =
            {
                players_data:[
                    {
                        name:'DEEPAK',
                    },
                    {
                        name:"kumar"
                    }
                ]
            }

    }
    render() {
        return (
            <>
                {this.state.players_data.map(data => (
                    <h1>{data.name}</h1>
                ))}
                <div className="container-fluid">
                <div className="table-responsive">
                    <table className="table ad-table">
                        <thead className="main-head">
                            <tr>
                                <th>Player Data</th>
                                <th>Passing</th>
                                <th>Rushing</th>
                                <th>Receiving</th>
                                <th>Kicking</th>
                                <th>Simulation Results</th>
                            </tr>
                        </thead>
                        <tbody className="main-body">
                            <tr>
                                <td>
                                    <div className="table-responsive">
                                        <table className="table table-bordered sub-table">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Pos</th>
                                                    <th>Team</th>
                                                    <th>opp</th>
                                                    <th>salary</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td> name  </td>
                                                    <td> pos  </td>
                                                    <td> Ind  </td>
                                                    <td> opp  </td>
                                                    <td> 2000  </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-responsive">
                                        <table className="table table-bordered  sub-table">
                                            <thead>
                                            <tr>
                                                <th>Completion</th>
                                                <th>Attempts</th>
                                                <th>Yards</th>
                                                <th>TD</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td> Completion  </td>
                                                <td> Attempts  </td>
                                                <td> Yards  </td>
                                                <td> td  </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-responsive">
                                        <table className="table table-bordered  sub-table">
                                            <thead>
                                            <tr>
                                                <th>Attempts</th>
                                                <th>Yards</th>
                                                <th>TD</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td> Attempts  </td>
                                                <td> Yards  </td>
                                                <td> td  </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-responsive">
                                        <table className="table table-bordered  sub-table">
                                            <thead>
                                            <tr>
                                                <th>Reception</th>
                                                <th>Yards</th>
                                                <th>TD</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td> Reception  </td>
                                                <td> Yards  </td>
                                                <td> td  </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-responsive">
                                        <table className="table table-bordered  sub-table">
                                            <thead>
                                            <tr>
                                                <th>FGM</th>
                                                <th>FGA</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td> FGM  </td>
                                                <td> FGA  </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                                <td>
                                    <div className="table-responsive">
                                        <table className="table table-bordered  sub-table">
                                            <thead>
                                            <tr>
                                                <th>FPTS</th>
                                                <th>Ceiling</th>
                                                <th>Floor</th>
                                                <th>Fpts/$1</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td> FPTS  </td>
                                                <td> FGA  </td>
                                                <td> FGA  </td>
                                                <td> FGA  </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            </>
        )
    }
}
export default Home