import React, {useEffect} from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ExportToExcel ({ nba_player_data, nfl_player_data, fileName, dataOf, salaryType,excelData }) {
    let listData = []
    let dictData = {}
    const [apiData, setApiData] = React.useState([])
    const isFirstRender = React.useRef(true);
    useEffect((props)=>{
        if(dataOf==='NBA'){
            setApiData(excelData)
        }
        if(dataOf==='NFL'){
            setApiData(excelData)
        }
    })

    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportToCSV = (apiData, fileName, dataOf, salaryType) => {
        if(dataOf === 'NFL' && salaryType === 'dk') {
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": apiData[i].Name,
                    'Position':apiData[i].DraftKingsPosition,
                    'Team':apiData[i].Team,
                    'Salary': apiData[i].DraftKingsSalary,
                    'Opponent':apiData[i].Opponent,
                    'PassingCompletions':apiData[i].PassingCompletions,
                    'PassingAttempts':apiData[i].PassingAttempts,
                    'PassingYards':apiData[i].PassingYards,
                    'PassingTouchdowns':apiData[i].PassingTouchdowns,
                    'RushingAttempts':apiData[i].RushingAttempts,
                    'RushingYards':apiData[i].RushingYards,
                    'RushingTouchdowns':apiData[i].RushingTouchdowns,
                    'Receptions':apiData[i].Receptions,
                    'ReceivingYards':apiData[i].ReceivingYards,
                    'ReceivingTouchdowns':apiData[i].ReceivingTouchdowns,
                    'FieldGoalsMade':apiData[i].FieldGoalsMade,
                    'FieldGoalsAttempted':apiData[i].FieldGoalsAttempted,
                    'FantasyPoints':apiData[i].FantasyPoints,
                    'Ceiling':apiData[i].DK_Ceil,
                    'Floor':apiData[i].DK_Floor,
                    'ValueRating':apiData[i].DK_Value
                })

            }
        }
        if(dataOf === 'NFL' && salaryType === 'fd') {
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": apiData[i].Name,
                    'Position':apiData[i].FanDuelPosition,
                    'Team':apiData[i].Team,
                    'Salary': apiData[i].FanDuelSalary,
                    'Opponent':apiData[i].Opponent,
                    'PassingCompletions':apiData[i].PassingCompletions,
                    'PassingAttempts':apiData[i].PassingAttempts,
                    'PassingYards':apiData[i].PassingYards,
                    'PassingTouchdowns':apiData[i].PassingTouchdowns,
                    'RushingAttempts':apiData[i].RushingAttempts,
                    'RushingYards':apiData[i].RushingYards,
                    'RushingTouchdowns':apiData[i].RushingTouchdowns,
                    'Receptions':apiData[i].Receptions,
                    'ReceivingYards':apiData[i].ReceivingYards,
                    'ReceivingTouchdowns':apiData[i].ReceivingTouchdowns,
                    'FieldGoalsMade':apiData[i].FieldGoalsMade,
                    'FieldGoalsAttempted':apiData[i].FieldGoalsAttempted,
                    'FantasyPoints':apiData[i].FantasyPoints,
                    'Ceiling':apiData[i].FD_Ceil,
                    'Floor':apiData[i].FD_Floor,
                    'ValueRating':apiData[i].FD_Value
                })

            }


        }
        if(dataOf === 'NBA' && salaryType === 'dk') {
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": apiData[i].Name,
                    'Position':apiData[i].DraftKingsPosition,
                    'Team':apiData[i].Team,
                    'Opponent':apiData[i].Opponent,
                    'Salary': apiData[i].DraftKingsSalary,
                    'Minutes':apiData[i].PlusMinus,
                    'Points':apiData[i].Points,
                    'Rebounds':apiData[i].Rebounds,
                    'Assists':apiData[i].Assists,
                    'Steals':apiData[i].Steals,
                    'BlockedShots':apiData[i].BlockedShots,
                    'Turnovers':apiData[i].Turnovers,
                    'FantasyPoints':apiData[i].FantasyPointsDraftKings,
                    'Ceiling':apiData[i].DK_Ceil,
                    'Floor':apiData[i].DK_Floor,
                    'ValueRating':apiData[i].DK_Value
                })

            }
        }
        if(dataOf === 'NBA' && salaryType === 'fd') {
            for (let i = 0; i < apiData.length; i++) {
                listData.push({
                    "Name": apiData[i].Name,
                    'Position':apiData[i].FanDuelPosition,
                    'Team':apiData[i].Team,
                    'Opponent':apiData[i].Opponent,
                    'Salary': apiData[i].FanDuelSalary,
                    'Minutes':apiData[i].PlusMinus,
                    'Points':apiData[i].Points,
                    'Rebounds':apiData[i].Rebounds,
                    'Assists':apiData[i].Assists,
                    'Steals':apiData[i].Steals,
                    'BlockedShots':apiData[i].BlockedShots,
                    'Turnovers':apiData[i].Turnovers,
                    'FantasyPoints':apiData[i].FantasyPointsFantasyDraft,
                    'Ceiling':apiData[i].FD_Ceil,
                    'Floor':apiData[i].FD_Floor,
                    'ValueRating':apiData[i].FD_Value
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