import React from 'react'
import './style.css'
import EnhancedTableHead from "./dataTable"
class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state =
            {
                players_data:[
                    {
                        "StatID": 693075,
                        "TeamID": 26,
                        "PlayerID": 20000484,
                        "SeasonType": 3,
                        "Season": 2019,
                        "Name": "Andrew Bogut",
                        "Team": "GS",
                        "Position": "C",
                        "Started": 0,
                        "FanDuelSalary": 2261,
                        "DraftKingsSalary": 775,
                        "FantasyDataSalary": 1744,
                        "YahooSalary": null,
                        "InjuryStatus": "Scrambled",
                        "InjuryBodyPart": "Scrambled",
                        "InjuryStartDate": null,
                        "InjuryNotes": "Scrambled",
                        "FanDuelPosition": "C",
                        "DraftKingsPosition": "C",
                        "YahooPosition": null,
                        "OpponentRank": 4,
                        "OpponentPositionRank": 3,
                        "GlobalTeamID": 20000026,
                        "FantasyDraftSalary": null,
                        "FantasyDraftPosition": "Scrambled",
                        "GameID": 13897,
                        "OpponentID": 10,
                        "Opponent": "TOR",
                        "Day": "2019-05-30T00:00:00",
                        "DateTime": "2019-05-30T21:00:00",
                        "HomeOrAway": "AWAY",
                        "IsGameOver": true,
                        "GlobalGameID": 20013897,
                        "GlobalOpponentID": 20000010,
                        "Updated": "2019-05-30T23:50:11",
                        "Games": 1,
                        "FantasyPoints": 1.5,
                        "Minutes": 1,
                        "Seconds": 28,
                        "FieldGoalsMade": 0.2,
                        "FieldGoalsAttempted": 0.3,
                        "FieldGoalsPercentage": 0.0,
                        "EffectiveFieldGoalsPercentage": 0.0,
                        "TwoPointersMade": 0.2,
                        "TwoPointersAttempted": 0.3,
                        "TwoPointersPercentage": 0.0,
                        "ThreePointersMade": 0.0,
                        "ThreePointersAttempted": 0.0,
                        "ThreePointersPercentage": 0.0,
                        "FreeThrowsMade": 0.0,
                        "FreeThrowsAttempted": 0.0,
                        "FreeThrowsPercentage": 0.0,
                        "OffensiveRebounds": 0.2,
                        "DefensiveRebounds": 0.5,
                        "Rebounds": 0.7,
                        "OffensiveReboundsPercentage": null,
                        "DefensiveReboundsPercentage": null,
                        "TotalReboundsPercentage": null,
                        "Assists": 0.2,
                        "Steals": 0.0,
                        "BlockedShots": 0.1,
                        "Turnovers": 0.1,
                        "PersonalFouls": 0.3,
                        "Points": 0.4,
                        "TrueShootingAttempts": 0.3,
                        "TrueShootingPercentage": 32.3,
                        "PlayerEfficiencyRating": null,
                        "AssistsPercentage": null,
                        "StealsPercentage": null,
                        "BlocksPercentage": null,
                        "TurnOversPercentage": null,
                        "UsageRatePercentage": null,
                        "FantasyPointsFanDuel": 1.7,
                        "FantasyPointsDraftKings": 1.6,
                        "FantasyPointsYahoo": 1.7,
                        "PlusMinus": 0.0,
                        "DoubleDoubles": 0.0,
                        "TripleDoubles": 0.0,
                        "FantasyPointsFantasyDraft": 1.6,
                        "IsClosed": false,
                        "LineupConfirmed": null,
                        "LineupStatus": "Scrambled"
                    },
                    {
                        "StatID": 693076,
                        "TeamID": 26,
                        "PlayerID": 20000485,
                        "SeasonType": 3,
                        "Season": 2019,
                        "Name": "Stephen Curry",
                        "Team": "GS",
                        "Position": "PG",
                        "Started": 1,
                        "FanDuelSalary": 6654,
                        "DraftKingsSalary": 7364,
                        "FantasyDataSalary": 6266,
                        "YahooSalary": null,
                        "InjuryStatus": "Scrambled",
                        "InjuryBodyPart": "Scrambled",
                        "InjuryStartDate": null,
                        "InjuryNotes": "Scrambled",
                        "FanDuelPosition": "PG",
                        "DraftKingsPosition": "PG",
                        "YahooPosition": null,
                        "OpponentRank": 4,
                        "OpponentPositionRank": 5,
                        "GlobalTeamID": 20000026,
                        "FantasyDraftSalary": null,
                        "FantasyDraftPosition": "Scrambled",
                        "GameID": 13897,
                        "OpponentID": 10,
                        "Opponent": "TOR",
                        "Day": "2019-05-30T00:00:00",
                        "DateTime": "2019-05-30T21:00:00",
                        "HomeOrAway": "AWAY",
                        "IsGameOver": true,
                        "GlobalGameID": 20013897,
                        "GlobalOpponentID": 20000010,
                        "Updated": "2019-05-30T23:50:11",
                        "Games": 1,
                        "FantasyPoints": 29.2,
                        "Minutes": 23,
                        "Seconds": 29,
                        "FieldGoalsMade": 4.0,
                        "FieldGoalsAttempted": 13.4,
                        "FieldGoalsPercentage": 30.7,
                        "EffectiveFieldGoalsPercentage": 36.9,
                        "TwoPointersMade": 1.8,
                        "TwoPointersAttempted": 3.3,
                        "TwoPointersPercentage": 32.3,
                        "ThreePointersMade": 2.2,
                        "ThreePointersAttempted": 5.3,
                        "ThreePointersPercentage": 24.9,
                        "FreeThrowsMade": 1.9,
                        "FreeThrowsAttempted": 2.0,
                        "FreeThrowsPercentage": 64.6,
                        "OffensiveRebounds": 0.3,
                        "DefensiveRebounds": 2.2,
                        "Rebounds": 2.5,
                        "OffensiveReboundsPercentage": null,
                        "DefensiveReboundsPercentage": null,
                        "TotalReboundsPercentage": null,
                        "Assists": 2.3,
                        "Steals": 0.6,
                        "BlockedShots": 0.2,
                        "Turnovers": 1.2,
                        "PersonalFouls": 1.2,
                        "Points": 18.6,
                        "TrueShootingAttempts": 14.8,
                        "TrueShootingPercentage": 40.7,
                        "PlayerEfficiencyRating": null,
                        "AssistsPercentage": null,
                        "StealsPercentage": null,
                        "BlocksPercentage": null,
                        "TurnOversPercentage": null,
                        "UsageRatePercentage": null,
                        "FantasyPointsFanDuel": 30.3,
                        "FantasyPointsDraftKings": 32.0,
                        "FantasyPointsYahoo": 30.3,
                        "PlusMinus": 0.0,
                        "DoubleDoubles": 0.0,
                        "TripleDoubles": 0.0,
                        "FantasyPointsFantasyDraft": 32.0,
                        "IsClosed": false,
                        "LineupConfirmed": null,
                        "LineupStatus": "Scrambled"
                    },
                    {
                        "StatID": 693077,
                        "TeamID": 26,
                        "PlayerID": 20000486,
                        "SeasonType": 3,
                        "Season": 2019,
                        "Name": "Klay Thompson",
                        "Team": "GS",
                        "Position": "SG",
                        "Started": 1,
                        "FanDuelSalary": 5168,
                        "DraftKingsSalary": 5426,
                        "FantasyDataSalary": 4522,
                        "YahooSalary": null,
                        "InjuryStatus": "Scrambled",
                        "InjuryBodyPart": "Scrambled",
                        "InjuryStartDate": null,
                        "InjuryNotes": "Scrambled",
                        "FanDuelPosition": "SG",
                        "DraftKingsPosition": "SG",
                        "YahooPosition": null,
                        "OpponentRank": 4,
                        "OpponentPositionRank": 6,
                        "GlobalTeamID": 20000026,
                        "FantasyDraftSalary": null,
                        "FantasyDraftPosition": "Scrambled",
                        "GameID": 13897,
                        "OpponentID": 10,
                        "Opponent": "TOR",
                        "Day": "2019-05-30T00:00:00",
                        "DateTime": "2019-05-30T21:00:00",
                        "HomeOrAway": "AWAY",
                        "IsGameOver": true,
                        "GlobalGameID": 20013897,
                        "GlobalOpponentID": 20000010,
                        "Updated": "2019-05-30T23:50:11",
                        "Games": 1,
                        "FantasyPoints": 21.8,
                        "Minutes": 23,
                        "Seconds": 35,
                        "FieldGoalsMade": 3.6,
                        "FieldGoalsAttempted": 12.0,
                        "FieldGoalsPercentage": 30.6,
                        "EffectiveFieldGoalsPercentage": 34.0,
                        "TwoPointersMade": 2.2,
                        "TwoPointersAttempted": 4.4,
                        "TwoPointersPercentage": 32.3,
                        "ThreePointersMade": 1.4,
                        "ThreePointersAttempted": 3.4,
                        "ThreePointersPercentage": 24.2,
                        "FreeThrowsMade": 0.7,
                        "FreeThrowsAttempted": 0.8,
                        "FreeThrowsPercentage": 64.6,
                        "OffensiveRebounds": 0.2,
                        "DefensiveRebounds": 1.6,
                        "Rebounds": 1.8,
                        "OffensiveReboundsPercentage": null,
                        "DefensiveReboundsPercentage": null,
                        "TotalReboundsPercentage": null,
                        "Assists": 1.1,
                        "Steals": 0.5,
                        "BlockedShots": 0.3,
                        "Turnovers": 0.7,
                        "PersonalFouls": 0.9,
                        "Points": 14.5,
                        "TrueShootingAttempts": 12.6,
                        "TrueShootingPercentage": 36.4,
                        "PlayerEfficiencyRating": null,
                        "AssistsPercentage": null,
                        "StealsPercentage": null,
                        "BlocksPercentage": null,
                        "TurnOversPercentage": null,
                        "UsageRatePercentage": null,
                        "FantasyPointsFanDuel": 23.0,
                        "FantasyPointsDraftKings": 23.5,
                        "FantasyPointsYahoo": 23.0,
                        "PlusMinus": 0.0,
                        "DoubleDoubles": 0.0,
                        "TripleDoubles": 0.0,
                        "FantasyPointsFantasyDraft": 23.5,
                        "IsClosed": false,
                        "LineupConfirmed": null,
                        "LineupStatus": "Scrambled"
                    },
                ]
            }

    }
    render() {
        return (
            <>
                {/*{this.state.players_data.map(data => (*/}
                {/*    <h1>{data.name}</h1>*/}
                {/*))}*/}

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
                        {/*<tbody className="main-body">*/}
                        {/*    <tr>*/}
                        {/*        <td>*/}
                        {/*            <div className="table-responsive">*/}
                        {/*                <table className="table table-bordered sub-table">*/}
                        {/*                    <thead>*/}
                        {/*                        <tr>*/}
                        {/*                            <th>Name</th>*/}
                        {/*                            <th>Pos</th>*/}
                        {/*                            <th>Team</th>*/}
                        {/*                            <th>opp</th>*/}
                        {/*                            <th>salary</th>*/}
                        {/*                        </tr>*/}
                        {/*                    </thead>*/}
                        {/*                    <tbody>*/}

                        {/*                    {this.state.players_data.map(data => (*/}
                        {/*                        <tr>*/}
                        {/*                            <td> {data.Name}  </td>*/}
                        {/*                            <td> {data.Position}  </td>*/}
                        {/*                            <td> {data.Team}  </td>*/}
                        {/*                            <td> {data.Opponent}  </td>*/}
                        {/*                            <td> {data.FantasyDraftSalary}  </td>*/}
                        {/*                        </tr>*/}
                        {/*                    ))}*/}
                        {/*                    </tbody>*/}
                        {/*                </table>*/}
                        {/*            </div>*/}
                        {/*        </td>*/}
                        {/*        <td>*/}
                        {/*            <div className="table-responsive">*/}
                        {/*                <table className="table table-bordered  sub-table">*/}
                        {/*                    <thead>*/}
                        {/*                    <tr>*/}
                        {/*                        <th>Completion</th>*/}
                        {/*                        <th>Attempts</th>*/}
                        {/*                        <th>Yards</th>*/}
                        {/*                        <th>TD</th>*/}
                        {/*                    </tr>*/}
                        {/*                    </thead>*/}
                        {/*                    <tbody>*/}
                        {/*                        {this.state.players_data.map(data => (*/}
                        {/*                            <tr>*/}
                        {/*                                <td> {data.Assists}  </td>*/}
                        {/*                                <td> {data.Opponent}  </td>*/}
                        {/*                                <td> {data.BlockedShots}  </td>*/}
                        {/*                                <td> {data.Assists}  </td>*/}
                        {/*                            </tr>*/}
                        {/*                        ))}*/}
                        {/*                    </tbody>*/}
                        {/*                </table>*/}
                        {/*            </div>*/}
                        {/*        </td>*/}
                        {/*        <td>*/}
                        {/*            <div className="table-responsive">*/}
                        {/*                <table className="table table-bordered  sub-table">*/}
                        {/*                    <thead>*/}
                        {/*                    <tr>*/}
                        {/*                        <th>Attempts</th>*/}
                        {/*                        <th>Yards</th>*/}
                        {/*                        <th>TD</th>*/}
                        {/*                    </tr>*/}
                        {/*                    </thead>*/}
                        {/*                    <tbody>*/}
                        {/*                        {this.state.players_data.map(data => (*/}
                        {/*                            <tr>*/}
                        {/*                                <td> {data.Opponent}  </td>*/}
                        {/*                                <td> {data.BlockedShots}  </td>*/}
                        {/*                                <td> {data.Assists}  </td>*/}
                        {/*                            </tr>*/}
                        {/*                        ))}*/}
                        {/*                    </tbody>*/}
                        {/*                </table>*/}
                        {/*            </div>*/}
                        {/*        </td>*/}
                        {/*        <td>*/}
                        {/*            <div className="table-responsive">*/}
                        {/*                <table className="table table-bordered  sub-table">*/}
                        {/*                    <thead>*/}
                        {/*                    <tr>*/}
                        {/*                        <th>Reception</th>*/}
                        {/*                        <th>Yards</th>*/}
                        {/*                        <th>TD</th>*/}
                        {/*                    </tr>*/}
                        {/*                    </thead>*/}
                        {/*                    <tbody>*/}
                        {/*                    {this.state.players_data.map(data => (*/}
                        {/*                        <tr>*/}
                        {/*                            <td> {data.Opponent}  </td>*/}
                        {/*                            <td> {data.BlockedShots}  </td>*/}
                        {/*                            <td> {data.Assists}  </td>*/}
                        {/*                        </tr>*/}
                        {/*                    ))}*/}
                        {/*                    </tbody>*/}
                        {/*                </table>*/}
                        {/*            </div>*/}
                        {/*        </td>*/}
                        {/*        <td>*/}
                        {/*            <div className="table-responsive">*/}
                        {/*                <table className="table table-bordered  sub-table">*/}
                        {/*                    <thead>*/}
                        {/*                    <tr>*/}
                        {/*                        <th>FGM</th>*/}
                        {/*                        <th>FGA</th>*/}
                        {/*                    </tr>*/}
                        {/*                    </thead>*/}
                        {/*                    <tbody>*/}
                        {/*                    {this.state.players_data.map(data => (*/}
                        {/*                        <tr>*/}
                        {/*                            <td> {data.Opponent}  </td>*/}
                        {/*                            <td> {data.BlockedShots}  </td>*/}
                        {/*                        </tr>*/}
                        {/*                    ))}*/}
                        {/*                    </tbody>*/}
                        {/*                </table>*/}
                        {/*            </div>*/}
                        {/*        </td>*/}
                        {/*        <td>*/}
                        {/*            <div className="table-responsive">*/}
                        {/*                <table className="table table-bordered  sub-table">*/}
                        {/*                    <thead>*/}
                        {/*                    <tr>*/}
                        {/*                        <th>FPTS</th>*/}
                        {/*                        <th>Ceiling</th>*/}
                        {/*                        <th>Floor</th>*/}
                        {/*                        <th>Fpts/$1</th>*/}
                        {/*                    </tr>*/}
                        {/*                    </thead>*/}
                        {/*                    <tbody>*/}
                        {/*                    {this.state.players_data.map(data => (*/}
                        {/*                        <tr>*/}
                        {/*                            <td> {data.Opponent}  </td>*/}
                        {/*                            <td> {data.BlockedShots}  </td>*/}
                        {/*                            <td> {data.Assists}  </td>*/}
                        {/*                            <td> {data.Assists}  </td>*/}
                        {/*                        </tr>*/}
                        {/*                    ))}*/}
                        {/*                    </tbody>*/}
                        {/*                </table>*/}
                        {/*            </div>*/}
                        {/*        </td>*/}
                        {/*    </tr>*/}
                        {/*</tbody>*/}
                    </table>
                </div>
            </div>
                <div className="container-fluid">
                <EnhancedTableHead data={this.state.players_data}/>
                </div>
            </>
        )
    }
}
export default Home