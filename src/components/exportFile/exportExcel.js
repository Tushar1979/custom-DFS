import React, {useEffect} from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ExportToExcel ({ nba_player_data, nfl_player_data, fileName, dataOf, salaryType,excelData }) {
    let listData = []
    const [apiData, setApiData] = React.useState([])
    //const isFirstRender = React.useRef(true);
    useEffect((props)=>{
        if(dataOf==='NBA'){
            setApiData(excelData)
        }
        if(dataOf==='NFL'){
            setApiData(excelData)
        }
    })

    function xyz(value) {
        if(typeof value === "undefined" || typeof value === undefined){
            return 0
        }
        else{
            return value
        }
    }

    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportToCSV = (apiData, fileName, dataOf, salaryType) => { apiData=JSON.parse(localStorage.getItem('exlData'))
        if(dataOf === 'NFL' && salaryType === 'dk') {
            listData = []
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": xyz(apiData[i].name) || xyz(apiData[i].Name),
                    'Position': xyz(apiData[i].pos) || xyz(apiData[i].DraftKingsPosition),
                    'Team': xyz(apiData[i].team) || xyz(apiData[i].Team),
                    'Opponent': xyz(apiData[i].oop) || xyz(apiData[i].Opponent),
                    'Salary': xyz(apiData[i].salary) || xyz(apiData[i].DraftKingsSalary),
                    'PassingCompletions':xyz(apiData[i].completion) || xyz(apiData[i].PassingCompletions),
                    'PassingAttempts': xyz(apiData[i].passingattempts) || xyz(apiData[i].PassingAttempts),
                    'PassingYards': xyz(apiData[i].passingyards) || xyz(apiData[i].PassingYards),
                    'PassingTouchdowns': xyz(apiData[i].passingtouchdowns) || xyz(apiData[i].PassingTouchdowns),
                    'RushingAttempts': xyz(apiData[i].rushingattempts) || xyz(apiData[i].RushingAttempts),
                    'RushingYards': xyz(apiData[i].rushingyards) || xyz(apiData[i].RushingYards),
                    'RushingTouchdowns': xyz(apiData[i].rushingtouchdowns) || xyz(apiData[i].RushingTouchdowns),
                    'Receptions': xyz(apiData[i].receptions) || xyz(apiData[i].Receptions),
                    'ReceivingYards': xyz(apiData[i].receivingyards) || xyz(apiData[i].ReceivingYards),
                    'ReceivingTouchdowns': xyz(apiData[i].receivingtouchdowns) || xyz(apiData[i].ReceivingTouchdowns),
                    'FieldGoalsMade': xyz(apiData[i].fieldgoalsmade) || xyz(apiData[i].FieldGoalsMade),
                    'FieldGoalsAttempted': xyz(apiData[i].fieldgoalsattempted) || xyz(apiData[i].FieldGoalsAttempted),
                    'FantasyPoints': xyz(apiData[i].nfl_dk_fantasyPoints) || xyz(apiData[i].FantasyPoints),
                    'Ceiling': xyz(apiData[i].ceiling) || xyz(apiData[i].DK_Ceil),
                    'Floor': xyz(apiData[i].floor) || xyz(apiData[i].DK_Floor),
                    'ValueRating': xyz(apiData[i].fpts$) || xyz(apiData[i].DK_Value)
                })
            }
        }
        if(dataOf === 'NFL' && salaryType === 'fd') {
            listData = []
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": xyz(apiData[i].name) || xyz(apiData[i].Name),
                    'Position': xyz(apiData[i].fdPos) || xyz(apiData[i].FanDuelPosition),
                    'Team': xyz(apiData[i].team) || xyz(apiData[i].Team),
                    'Opponent': xyz(apiData[i].oop) || xyz(apiData[i].Opponent),
                    'Salary': xyz(apiData[i].fdSalary) || xyz(apiData[i].FanDuelSalary),
                    'PassingCompletions':xyz(apiData[i].completion) || xyz(apiData[i].PassingCompletions),
                    'PassingAttempts': xyz(apiData[i].passingattempts) || xyz(apiData[i].PassingAttempts),
                    'PassingYards': xyz(apiData[i].passingyards) || xyz(apiData[i].PassingYards),
                    'PassingTouchdowns': xyz(apiData[i].passingtouchdowns) || xyz(apiData[i].PassingTouchdowns),
                    'RushingAttempts': xyz(apiData[i].rushingattempts) || xyz(apiData[i].RushingAttempts),
                    'RushingYards': xyz(apiData[i].rushingyards) || xyz(apiData[i].RushingYards),
                    'RushingTouchdowns': xyz(apiData[i].rushingtouchdowns) || xyz(apiData[i].RushingTouchdowns),
                    'Receptions': xyz(apiData[i].receptions) || xyz(apiData[i].Receptions),
                    'ReceivingYards': xyz(apiData[i].receivingyards) || xyz(apiData[i].ReceivingYards),
                    'ReceivingTouchdowns': xyz(apiData[i].receivingtouchdowns) || xyz(apiData[i].ReceivingTouchdowns),
                    'FieldGoalsMade': xyz(apiData[i].fieldgoalsmade) || xyz(apiData[i].FieldGoalsMade),
                    'FieldGoalsAttempted': xyz(apiData[i].fieldgoalsattempted) || xyz(apiData[i].FieldGoalsAttempted),
                    'FantasyPoints': xyz(apiData[i].nfl_fd_fantasyPoints) || xyz(apiData[i].FantasyPoints),
                    'Ceiling': xyz(apiData[i].fd_ceiling) || xyz(apiData[i].FD_Ceil),
                    'Floor': xyz(apiData[i].fd_floor) || xyz(apiData[i].FD_Floor),
                    'ValueRating': xyz(apiData[i].fd_fpts$) || xyz(apiData[i].FD_Value)
                })
            }
        }
        if(dataOf === 'NBA' && salaryType === 'dk') {
            listData = []
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": xyz(apiData[i].name) || xyz(apiData[i].Name),
                    'Position': xyz(apiData[i].pos) || xyz(apiData[i].DraftKingsPosition),
                    'Team': xyz(apiData[i].team) || xyz(apiData[i].Team),
                    'Opponent': xyz(apiData[i].oop) || xyz(apiData[i].Opponent),
                    'Salary': xyz(apiData[i].salary) ||  xyz(apiData[i].DraftKingsSalary),
                    'Minutes': xyz(apiData[i].minus) || xyz(apiData[i].Minutes),
                    'Points': xyz(apiData[i].points) || xyz(apiData[i].Points),
                    'Rebounds': xyz(apiData[i].rebound) || xyz(apiData[i].Rebounds),
                    'Assists': xyz(apiData[i].assists) || xyz(apiData[i].Assists),
                    'Steals': xyz(apiData[i].steals) || xyz(apiData[i].Steals),
                    'BlockedShots': xyz(apiData[i].blockedShots) || xyz(apiData[i].BlockedShots),
                    'Turnovers': xyz(apiData[i].to) || xyz(apiData[i].Turnovers),
                    'FantasyPoints': xyz(apiData[i].fantasyPoints) || xyz(apiData[i].FantasyPointsDraftKings),
                    'Ceiling': xyz(apiData[i].ceiling) || xyz(apiData[i].DK_Ceil),
                    'Floor': xyz(apiData[i].floor) || xyz(apiData[i].DK_Floor),
                    'ValueRating': xyz(apiData[i].fpts$) || xyz(apiData[i].DK_Value)
                })

            }
        }
        if(dataOf === 'NBA' && salaryType === 'fd') {
            listData = []
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": xyz(apiData[i].name) || xyz(apiData[i].Name),
                    'Position': xyz(apiData[i].fdPos) || xyz(apiData[i].FanDuelPosition),
                    'Team': xyz(apiData[i].team) || xyz(apiData[i].Team),
                    'Opponent': xyz(apiData[i].oop) || xyz(apiData[i].Opponent),
                    'Salary': xyz(apiData[i].fdSalary) || xyz(apiData[i].FanDuelSalary),
                    'Minutes': xyz(apiData[i].minus) || xyz(apiData[i].Minutes),
                    'Points': xyz(apiData[i].points) || xyz(apiData[i].Points),
                    'Rebounds': xyz(apiData[i].rebound) || xyz(apiData[i].Rebounds),
                    'Assists': xyz(apiData[i].assists) || xyz(apiData[i].Assists),
                    'Steals': xyz(apiData[i].steals) || xyz(apiData[i].Steals),
                    'BlockedShots': xyz(apiData[i].blockedShots) || xyz(apiData[i].BlockedShots),
                    'Turnovers': xyz(apiData[i].to) || xyz(apiData[i].Turnovers),
                    'FantasyPoints': xyz(apiData[i].fd_fantasyPoints) || xyz(apiData[i].FantasyPointsFantasyDraft),
                    'Ceiling': xyz(apiData[i].fd_ceiling) || xyz(apiData[i].FD_Ceil),
                    'Floor': xyz(apiData[i].fd_floor) || xyz(apiData[i].FD_Floor),
                    'ValueRating': xyz(apiData[i].fd_fpts$) || xyz(apiData[i].FD_Value),
                })

            }
        }

        const ws = XLSX.utils.json_to_sheet(listData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };
    return (
        <button className="btn btn-primary active ad-group-btn" onClick={(e) => exportToCSV(apiData, fileName, dataOf, salaryType)}>Export</button>
    );
};