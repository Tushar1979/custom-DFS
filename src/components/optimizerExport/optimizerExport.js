import React, {useEffect} from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export default function ExportToExcel ({ fileName, dataOf, salaryType,excelData }) {
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
    const exportToCSV = (apiData, fileName, dataOf, salaryType) => {

        // if(dataOf === 'NFL' ){
        //     listData = [['QB', 'RB', 'RB', 'WR', 'WR', 'WR', 'TE', 'FLEX', 'DST']]
        // }
        if(dataOf === 'NFL' && salaryType === 'dk'){
            listData = [['CPT', 'FLEX', 'FLEX', 'FLEX', 'FLEX', 'FLEX']]
        }
        if(dataOf === 'NFL' && salaryType === 'fd'){
            listData = [['MVP', 'FLEX', 'FLEX', 'FLEX', 'FLEX']]
        }
        if(dataOf === 'NBA' && salaryType === 'dk'){
            listData = [['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'UTIL']]
        }
        if(dataOf === 'NBA' && salaryType === 'fd'){
            listData = [['PG', 'PG', 'SG', 'SG', 'SF', 'SF', 'PF', 'PF', 'C']]
        }

        Object.keys(apiData).map((item) => {
            var temp = []
            Object.keys(apiData[item]['Players']).map((insideItem) => {

                temp.push(apiData[item]["Players"][insideItem]['contest_id'])
            })
            listData.push(temp)
        })
        console.log(listData)

        const ws = XLSX.utils.aoa_to_sheet(listData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };
    return (
        <button className="btn btn-primary active ad-group-btn"
                style={{position: "relative", top: "25%", left: "10%"}}
                onClick={(e) => exportToCSV(apiData, fileName, dataOf, salaryType)}>Export</button>
    );
};