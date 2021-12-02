import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import TextField from "@material-ui/core/TextField";
import Loader from "../../loader/loader"
import "./dataTable.css"

let rows = []
let nft_header = false
let update_data = true


    function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => -descendingComparator(a, b, orderBy)
        : (a, b) => descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {

    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    let xx=JSON.stringify(stabilizedThis.map((el) => el[0]))
    if (localStorage.getItem('exlData')){
        localStorage.removeItem('exlData')
        localStorage.setItem('exlData',xx)
    }
    else{
        localStorage.setItem('exlData',xx)
    }
    return stabilizedThis.map((el) => el[0]);
}

let headCells = []

function EnhancedTableHead(props) {
    const {classes, order, orderBy, onRequestSort} = props;
    const createSortHandler = (property) => (event) => {
        console.log(property)
        console.log(event)
        onRequestSort(event, property);
    };

    return (
        <TableHead>

            {nft_header ?
                <TableRow className="top_table_head">
                    <TableCell colSpan={5}>Players data</TableCell>
                    <TableCell colSpan={4}>Passing</TableCell>
                    <TableCell colSpan={3}>Rushing</TableCell>
                    <TableCell colSpan={3}>Receiving</TableCell>
                    <TableCell colSpan={2}>Kicking</TableCell>
                    <TableCell colSpan={4}>Simulation Results</TableCell>
                </TableRow>
                : null}
            <TableRow className={nft_header ? "middle_table_head nfl_head" : "middle_table_head" }>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,

    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    border:{
        borderRight:"1px solid #D8D8D8"
    },

}));


export default function EnhancedTable(props) {
    const [loader, setLoader] = React.useState(true);
    //const [NbaMinus, setNbaMinus] = React.useState('');
    //const [nbaUpdate, setNbaUpdate] = React.useState([]);
    const [updateGameList, setUpdateGameList] = React.useState([]);
    const [updateNflGameList, setUpdateNflGameList] = React.useState([]);
    const [nflList, setNflList] = React.useState([]);
    //const [isNbaNfl, setIsNbaNfl] = React.useState(props.is_nbaNfl);
    const classes = useStyles();
    const [order, setOrder] = React.useState('desc');
    const [orderBy, setOrderBy] = React.useState('salary');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    let saveData = props.saveDataBtn
    let user_data = props.showData

    useEffect(()=>{
        let a=sessionStorage.getItem("order")
        let b=sessionStorage.getItem("orderby")
        if(props.salary ==='dk') {console.log("dkSalary",a,b)
            if(b==="fdPos")
                {b='pos';}
            else if(b==="fd_ceiling")
                b='ceiling';
            else if(b==="fd_floor")
                b="floor";
            else if(b==="fd_fpts$")
                b="fpts$";
            else if(b==="fd_fantasyPoints")
                b="fantasyPoints"
            else if(b==="fdSalary")
                b="salary"
            // else
            //     b='salary';
            console.log("dk "+b)
            sessionStorage.setItem("order" , a)
            sessionStorage.setItem("orderby" , b)
            
        }
        else if(props.salary==="fd") {console.log("fdSalary",a,b)
            if(b==="pos")
                b='fdPos';
            else if(b==="ceiling")
                b='fd_ceiling';
            else if(b==="floor")
                b="fd_floor";
            else if(b==="fpts$")
                b="fd_fpts$";
            else if(b==="fantasyPoints")
                b="fd_fantasyPoints"
            else if(b==="salary")
                b="fdSalary"
            console.log("fd "+b)
            sessionStorage.setItem("order" , a)
            sessionStorage.setItem("orderby" , b)
        }
            // if(props.salary==="fd")
            //     b="fdSalary"
            // else
            //     b="salary"
        setOrder(a)
        setOrderBy(b);
    },[props.salary])

    useEffect(()=>{
        setOrder("asc")
        setOrderBy("salary");
        sessionStorage.setItem("order" , "asc")
        sessionStorage.setItem("orderby" , "salary")
    },[props.is_nbaNfl])

    useEffect(() => {
        setUpdateGameList(props.showData)
        setUpdateNflGameList(props.showData)
    })

    

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        update_data = false
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        update_data = false
    };

    if(sessionStorage.getItem('pageReset')==='true0')
    {
        setPage(0);
        sessionStorage.setItem('pageReset','false')
    }

    const handleChangeMinus = (e) =>{
        let rowId = e.target.id
        let nbaMinus = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Minutes'] = nbaMinus
                break
            }
        }
    }
    const handleChangePoints = (e) => {
        let rowId = e.target.id
        let nbaPoints = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Points'] = nbaPoints
                break
            }
        }
    }
    const handleChangeRebounds = (e) => {
        let rowId = e.target.id
        let nbaRebounds = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Rebounds'] = nbaRebounds
                break
            }
        }
    }
    const handleChangeAssists = (e) => {
        let rowId = e.target.id
        let nbaAssists  = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Assists'] = nbaAssists
                break
            }
        }
    }
    const handleChangeBlockedShots = (e) => {
        let rowId = e.target.id
        let nbaBlockedShots   = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['BlockedShots'] = nbaBlockedShots
                break
            }
        }
    }
    const handleChangeSteals = (e) => {
        let rowId = e.target.id
        let nbaSteals = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Steals'] = nbaSteals
                break
            }
        }
    }
    const handleChangeTurnovers = (e) => {
        let rowId = e.target.id
        let nbaTurnovers = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Turnovers'] = nbaTurnovers
                break
            }
        }
    }

    //  NFL data updating

    const handleChangeCompletion = (e) =>{
        let rowId = e.target.id
        let nflPassingCompletions  = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i = 0; i<nflList.length; i++){
                if (nflList[i].Id === rowId) {
                        nflList[i]['PassingCompletions'] = nflPassingCompletions
                    is_exist = false
                    break
                }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingCompletions'] = nflPassingCompletions
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }

    const handleChangePassingAttempts = (e) =>{
        let rowId = e.target.id
        let nflPassingAttempts = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['PassingAttempts'] = nflPassingAttempts
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingAttempts'] = nflPassingAttempts
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }

    }
    const handleChangePassingYards = (e) =>{
        let rowId = e.target.id
        let nflPassingYards = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['PassingYards'] = nflPassingYards
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingYards'] = nflPassingYards
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangePassingTouchdowns = (e) =>{
        let rowId = e.target.id
        let nflPassingTouchdowns = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['PassingTouchdowns'] = nflPassingTouchdowns
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingTouchdowns'] = nflPassingTouchdowns
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }

    const handleChangeRushingAttempts = (e) =>{
        let rowId = e.target.id
        let nflRushingAttempts = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['RushingAttempts'] = nflRushingAttempts
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['RushingAttempts'] = nflRushingAttempts
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeRushingYards = (e) =>{
        let rowId = e.target.id
        let nflRushingYards = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['RushingYards'] = nflRushingYards
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['RushingYards'] = nflRushingYards
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeRushingTouchdowns = (e) =>{
        let rowId = e.target.id
        let nflRushingTouchdowns = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['RushingTouchdowns'] = nflRushingTouchdowns
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['RushingTouchdowns'] = nflRushingTouchdowns
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceptions = (e) =>{
        let rowId = e.target.id
        let nflReceptions = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['Receptions'] = nflReceptions
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['Receptions'] = nflReceptions
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceivingYards = (e) =>{
        let rowId = e.target.id
        let nflReceivingYards = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['ReceivingYards'] = nflReceivingYards
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['ReceivingYards'] = nflReceivingYards
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceivingTouchdowns = (e) =>{
        let rowId = e.target.id
        let nflReceivingTouchdowns = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['ReceivingTouchdowns'] = nflReceivingTouchdowns
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['ReceivingTouchdowns'] = nflReceivingTouchdowns
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeFieldGoalsMade= (e) =>{
        let rowId = e.target.id
        let nflFieldGoalsMade = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['FieldGoalsMade'] = nflFieldGoalsMade
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['FieldGoalsMade'] = nflFieldGoalsMade
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeFieldGoalsAttempted = (e) =>{
        let rowId = e.target.id
        let nflFieldGoalsAttempted = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['FieldGoalsAttempted'] = nflFieldGoalsAttempted
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['FieldGoalsAttempted'] = nflFieldGoalsAttempted
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }

    if(saveData){
        if(props.is_nbaNfl === 'NFL') {
            props.onSavePlayerStats(updateNflGameList)
        }
        else{
            props.onSavePlayerStats(updateGameList)
        }
    }

    if (props.is_nbaNfl === "NFL") {
        update_data = true
        nft_header = true
        let pos, salary, ceiling
        if(props.salary ==='dk')
        {pos='pos';salary='salary'; ceiling='ceiling'}
        else {
            pos='fdPos';salary='fdSalary';ceiling='fd_ceiling'
        }
        // user_data = props.showData
        headCells = [
            {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
            {id: pos, numeric: false, disablePadding: false, label: 'pos'},
            {id: 'team', numeric: false, disablePadding: false, label: 'team'},
            {id: 'oop', numeric: false, disablePadding: false, label: 'opp'},
            {id: salary, numeric: false, disablePadding: false, label: 'sal'},


            {id: 'completion', numeric: false, disablePadding: true, label: 'Comp'},
            {id: 'passingattempts', numeric: false, disablePadding: true, label: 'Att'},
            {id: 'passingyards', numeric: false, disablePadding: true, label: 'Yds'},
            {id: 'passingtouchdowns', numeric: false, disablePadding: true, label: 'TD'},
            {id: 'rushingattempts', numeric: false, disablePadding: true, label: 'Att'},
            {id: 'rushingyards', numeric: false, disablePadding: true, label: 'Yds'},
            {id: 'rushingtouchdowns', numeric: false, disablePadding: true, label: 'TD'},
            {id: 'receptions', numeric: false, disablePadding: true, label: 'Rec'},
            {id: 'receivingyards', numeric: false, disablePadding: true, label: 'yds'},
            {id: 'receivingtouchdowns', numeric: false, disablePadding: true, label: 'TD'},
            {id: 'fieldgoalsmade', numeric: false, disablePadding: true, label: 'fgm'},
            {id: 'fieldgoalsattempted', numeric: false, disablePadding: true, label: 'fga'},

            {id: 'nfl_dk_fantasyPoints', numeric: false, disablePadding: false, label: 'fpts'},
            {id: ceiling, numeric: false, disablePadding: false, label: 'ceil'},
            {id: 'floor', numeric: false, disablePadding: false, label: 'floor'},
            {id: 'fpts$', numeric: false, disablePadding: false, label: 'val'},

        ];
    }
    if (props.is_nbaNfl === "NBA") {
        update_data = true
        // user_data = props.showData
        let pos, salary, ceiling, fpts$, floor , fantasyPoints
        if(props.salary ==='dk') {
            pos='pos';salary='salary'; ceiling='ceiling' ; floor="floor" ; fpts$="fpts$";fantasyPoints="fantasyPoints"
        }
        else {
            pos='fdPos';salary='fdSalary';ceiling='fd_ceiling' ;floor="fd_floor"; fpts$="fd_fpts$";fantasyPoints="fd_fantasyPoints"
        }
        rows = []
        nft_header = false
        headCells = [
            {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
            {id: pos, numeric: false, disablePadding: false, label: 'pos'},
            {id: 'team', numeric: false, disablePadding: false, label: 'team'},
            {id: 'oop', numeric: false, disablePadding: false, label: 'opp'},
            {id: salary, numeric: false, disablePadding: false, label: 'sal'},

            {id: 'minus', numeric: false, disablePadding: false, label: 'min'},
            {id: 'points', numeric: false, disablePadding: false, label: 'pts'},
            {id: 'rebound', numeric: false, disablePadding: false, label: 'reb'},
            {id: 'assists', numeric: false, disablePadding: false, label: 'ast'},
            {id: 'steals', numeric: false, disablePadding: false, label: 'stl'},
            {id: 'blockedShots', numeric: false, disablePadding: false, label: 'blk'},
            {id: 'to', numeric: false, disablePadding: false, label: 'to'},

            {id: fantasyPoints, numeric: false, disablePadding: false, label: 'fpts'},
            {id: ceiling, numeric: false, disablePadding: false, label: 'ceil'},
            {id: floor, numeric: false, disablePadding: false, label: 'floor'},
            {id: fpts$, numeric: false, disablePadding: false, label: 'val'},
        ]
    }

    if (props.showData.length > 0) {
        update_data = true
            // user_data = props.showData

    }


    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    if (update_data) {
        rows = []
        for (let data = 0; data < user_data.length; data++) {
            if((user_data[data].Name !== undefined)){
                rows.push(
                    {
                        id: user_data[data].Id,
                        name: user_data[data].Name,
                        pos: user_data[data].DraftKingsPosition,
                        fdPos: user_data[data].FanDuelPosition,
                        team: user_data[data].Team,
                        oop: user_data[data].Opponent,
                        teamId: user_data[data].TeamID,
                        oopId: user_data[data].OpponentID,
                        nflTeamId : user_data[data].GlobalTeamID,
                        salary: user_data[data].DraftKingsSalary===undefined || user_data[data].DraftKingsSalary===null ? 0 : parseFloat(user_data[data].DraftKingsSalary) ,
                        fdSalary: user_data[data].FanDuelSalary===undefined || user_data[data].FanDuelSalary=== null ? 0 : parseFloat(user_data[data].FanDuelSalary),
                        minus: user_data[data].Minutes===undefined || user_data[data].Minutes===null ? 0 : parseFloat(user_data[data].Minutes),
                        points: user_data[data].Points === undefined || user_data[data].Points=== null ? 0 : parseFloat(user_data[data].Points),
                        rebound: user_data[data].Rebounds === undefined || user_data[data].Rebounds === null ? 0 : parseFloat(user_data[data].Rebounds),
                        assists: user_data[data].Assists === undefined || user_data[data].Assists=== null ? 0 : parseFloat(user_data[data].Assists),
                        steals: user_data[data].Steals === undefined || user_data[data].Steals=== null ? 0 : parseFloat(user_data[data].Steals),
                        blockedShots: user_data[data].BlockedShots=== undefined || user_data[data].BlockedShots === null ? 0 : parseFloat(user_data[data].BlockedShots),
                        to: user_data[data].Turnovers===undefined || user_data[data].Turnovers===null ? 0 : parseFloat(user_data[data].Turnovers),
                        fantasyPoints: user_data[data].DK_Proj === undefined || user_data[data].DK_Proj=== null ? 0 : parseFloat(user_data[data].DK_Proj),
                        fd_fantasyPoints: user_data[data].FD_Proj===undefined || user_data[data].FD_Proj===null ? 0 : parseFloat(user_data[data].FD_Proj),
                        nfl_dk_fantasyPoints: user_data[data].DK_Proj===undefined || user_data[data].DK_Proj===null ? 0 : parseFloat(user_data[data].DK_Proj),
                        nfl_fd_fantasyPoints: user_data[data].FD_Proj===undefined || user_data[data].FD_Proj===null ? 0 : parseFloat(user_data[data].FD_Proj),
                        // ceiling: parseFloat(user_data[data].DK_Ceil),
                        // fd_ceiling: parseFloat(user_data[data].FD_Ceil),
                        // floor: parseFloat(user_data[data].DK_Floor),
                        // fd_floor: parseFloat(user_data[data].FD_Floor),
                        // fpts$: parseFloat(user_data[data].DK_Value),
                        // fd_fpts$: parseFloat(user_data[data].FD_Value),
                        ceiling: user_data[data].DK_Ceil=== undefined || user_data[data].DK_Ceil=== null ? 0 : parseFloat(user_data[data].DK_Ceil),
                        fd_ceiling: user_data[data].FD_Ceil === undefined || user_data[data].FD_Ceil === null ? 0 :parseFloat(user_data[data].FD_Ceil),
                        floor: user_data[data].DK_Floor === undefined || user_data[data].DK_Floor === null ? 0 : parseFloat(user_data[data].DK_Floor),
                        fd_floor: user_data[data].FD_Floor=== undefined || user_data[data].FD_Floor===null ? 0 :parseFloat(user_data[data].FD_Floor),
                        fpts$: user_data[data].DK_Value=== undefined || user_data[data].DK_Value=== null ? 0 :parseFloat(user_data[data].DK_Value),
                        fd_fpts$: user_data[data].DK_Value=== undefined || user_data[data].DK_Value=== null ? 0 :parseFloat(user_data[data].FD_Value),

                        // nflOppId: user_data[data].OpponentID,
                        completion: user_data[data].PassingCompletions===undefined || user_data[data].PassingCompletions===null ? 0 : parseFloat(user_data[data].PassingCompletions),
                        passingattempts: user_data[data].PassingAttempts===undefined || user_data[data].PassingAttempts===null ? 0 : parseFloat(user_data[data].PassingAttempts),
                        passingyards: user_data[data].PassingYards===undefined || user_data[data].PassingYards===null ? 0 : parseFloat(user_data[data].PassingYards),
                        passingtouchdowns: user_data[data].PassingTouchdowns===undefined || user_data[data].PassingTouchdowns===null ? 0 : parseFloat(user_data[data].PassingTouchdowns),
                        rushingattempts: user_data[data].RushingAttempts=== undefined || user_data[data].RushingAttempts === null ? 0 : parseFloat(user_data[data].RushingAttempts),
                        rushingyards: user_data[data].RushingYards===undefined || user_data[data].RushingYards===null ? 0 : parseFloat(user_data[data].RushingYards),
                        rushingtouchdowns : user_data[data].RushingTouchdowns===undefined || user_data[data].RushingTouchdowns===null ? 0 : parseFloat(user_data[data].RushingTouchdowns),
                        receptions: user_data[data].Receptions===undefined || user_data[data].Receptions===null ? 0 : parseFloat(user_data[data].Receptions),
                        receivingyards: user_data[data].ReceivingYards===undefined || user_data[data].ReceivingYards===null ? 0 : parseFloat(user_data[data].ReceivingYards),
                        receivingtouchdowns: user_data[data].ReceivingTouchdowns=== undefined || user_data[data].ReceivingTouchdowns===null ? 0 : parseFloat(user_data[data].ReceivingTouchdowns),
                        fieldgoalsmade: user_data[data].FieldGoalsMade===undefined || user_data[data].FieldGoalsMade===null ? 0 : parseFloat(user_data[data].FieldGoalsMade),
                        fieldgoalsattempted: user_data[data].FieldGoalsAttempted=== undefined || user_data[data].FieldGoalsAttempted===null ? 0 : parseFloat(user_data[data].FieldGoalsAttempted),
                    })
            }

            update_data = false
        }

        if(loader) {
            sleep(3000).then(r => {
                setLoader(false);
            })
        }
    }



    const handleRequestSort = (event, property) => {
        console.error(orderBy,order)
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        sessionStorage.setItem("order", isAsc ? 'desc' : 'asc' )
        sessionStorage.setItem("orderby", property)
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };





    const isSelected = (name) => selected.indexOf(name) !== -1;


    return (
        <>
            {loader ? <Loader/>
                :
                <div className={classes.root}>

                    <Paper className={classes.paper}>
                        <TableContainer>
                            <Table
                                className="data_table"
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                                aria-label="enhanced table"
                                id="data_table"
                            >

                                <EnhancedTableHead
                                    classes={classes}
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                    salType = { props.salary}
                                />
                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            const isItemSelected = isSelected(row.name);
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    onClick={(event) => handleClick(event, row.name)}
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.name}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell id={labelId} scope="row" padding="none" className={classes.border} style={{ "text-align-last": "left"}}>

                                                        {row.name}
                                                    </TableCell>
                                                    {props.salary === 'dk' ?
                                                        <TableCell align="center" className={classes.border}>{row.pos}  </TableCell> :
                                                        <TableCell align="center" className={classes.border}>{row.fdPos}</TableCell>
                                                    }

                                                    <TableCell align="center" className={classes.border}>
                                                        {nft_header ? <div className={`${"NFL"+row.nflTeamId} nfl`}></div> :
                                                            <div className={`${"NBA"+row.teamId}`}></div>
                                                        }
                                                        {row.team}
                                                    </TableCell>
                                                    <TableCell align="center" className={classes.border}>
                                                        {nft_header ? <div className={`${"NFL"+row.oopId} nfl`}></div> :
                                                            <div className={`${"NBA"+row.oopId}`}></div>
                                                        }
                                                        {row.oop} </TableCell>
                                                    {props.salary === 'dk' ?
                                                        <TableCell align="center" className={classes.border}>${row.salary} </TableCell> :
                                                        <TableCell align="center" className={classes.border}>${row.fdSalary}  </TableCell>
                                                    }

                                                    {nft_header ?
                                                        (props.inputActive ? <>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            id={rows.id}
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 2
                                                                                }
                                                                            }}
                                                                            defaultValue={row.completion}
                                                                            // defaultValue='232'
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangeCompletion}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.passingattempts}
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangePassingAttempts}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.passingyards}
                                                                            className="table_input"
                                                                            // PassingYards
                                                                            id={row.id}
                                                                            onChange={handleChangePassingYards}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.passingtouchdowns}
                                                                            className="table_input"
                                                                            // PassingTouchdowns
                                                                            id={row.id}
                                                                            onChange={handleChangePassingTouchdowns}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.rushingattempts}
                                                                            className="table_input"
                                                                            // handleChangeRushingAttempts
                                                                            id={row.id}
                                                                            onChange={handleChangeRushingAttempts}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.rushingyards}
                                                                            className="table_input"
                                                                            // handleChangeRushingYards
                                                                            id={row.id}
                                                                            onChange={handleChangeRushingYards}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.rushingtouchdowns}
                                                                            className="table_input"
                                                                            // handleChangeRushingTouchdowns
                                                                            id={row.id}
                                                                            onChange={handleChangeRushingTouchdowns}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.receptions}
                                                                            className="table_input"
                                                                            // handleChangeReceptions
                                                                            id={row.id}
                                                                            onChange={handleChangeReceptions}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.receivingyards}
                                                                            className="table_input"
                                                                            // handleChangeReceivingYards
                                                                            id={row.id}
                                                                            onChange={handleChangeReceivingYards}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.receivingtouchdowns}
                                                                            className="table_input"
                                                                            // handleChangeReceivingTouchdowns
                                                                            id={row.id}
                                                                            onChange={handleChangeReceivingTouchdowns}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.fieldgoalsmade}
                                                                            className="table_input"
                                                                            // handleChangeFieldGoalsMade
                                                                            id={row.id}
                                                                            onChange={handleChangeFieldGoalsMade}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.fieldgoalsattempted}
                                                                            className="table_input"
                                                                            // handleChangeFieldGoalsAttempted
                                                                            id={row.id}
                                                                            onChange={handleChangeFieldGoalsAttempted}
                                                                        />
                                                                    </TableCell>
                                                                </> :
                                                                <>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.completion} </TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.passingattempts}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.passingyards}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.passingtouchdowns}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.rushingattempts}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.rushingyards}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.rushingtouchdowns}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.receptions}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.receivingyards}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.receivingtouchdowns}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.fieldgoalsmade}</TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.fieldgoalsattempted}</TableCell>
                                                                </>
                                                        )

                                                        :
                                                        (props.inputActive ?
                                                                <>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 3
                                                                                }
                                                                            }}
                                                                            defaultValue={row.minus}
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangeMinus}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.points}
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangePoints}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.rebound}
                                                                            className="table_input"

                                                                            id={row.id}
                                                                            onChange={handleChangeRebounds}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.assists}
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangeAssists}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.steals}
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangeSteals}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.blockedShots}
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangeBlockedShots}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="center" className={classes.border}>
                                                                        <TextField
                                                                            type="number"
                                                                            InputProps={{
                                                                                inputProps: {
                                                                                    min: 0
                                                                                }
                                                                            }}
                                                                            defaultValue={row.to}
                                                                            className="table_input"
                                                                            id={row.id}
                                                                            onChange={handleChangeTurnovers}
                                                                        />
                                                                    </TableCell>

                                                                </>
                                                                :
                                                                <>
                                                                    <TableCell align="center" className={classes.border}>{row.minus} </TableCell>
                                                                    <TableCell align="center" className={classes.border}>{row.points} </TableCell>
                                                                    <TableCell align="center" className={classes.border}>{row.rebound} </TableCell>
                                                                    <TableCell align="center" className={classes.border}>{row.assists} </TableCell>
                                                                    <TableCell align="center" className={classes.border}>{row.steals} </TableCell>
                                                                    <TableCell className={classes.border}
                                                                        align="center">{row.blockedShots} </TableCell>
                                                                    <TableCell align="center" className={classes.border}>{row.to}</TableCell>
                                                                </>
                                                        )
                                                    }
                                                    {nft_header ?

                                                        (props.salary === 'dk' ?
                                                            <TableCell align="center" className={classes.border}>{row.nfl_dk_fantasyPoints}</TableCell>
                                                            :
                                                            <TableCell align="center" className={classes.border}>{row.nfl_fd_fantasyPoints}</TableCell>)

                                                        :
                                                        (props.salary === 'dk' ?
                                                            <TableCell align="center" className={classes.border}>{row.fantasyPoints} </TableCell>
                                                            :<TableCell align="center" className={classes.border}>{row.fd_fantasyPoints} </TableCell>
                                                        )


                                                    }
                                                    {props.salary === 'dk' ?
                                                        <>
                                                            <TableCell align="center" className={classes.border}>{row.ceiling} </TableCell>
                                                            <TableCell align="center" className={classes.border}>{row.floor} </TableCell>
                                                            <TableCell align="center" className={classes.border}>{row.fpts$}</TableCell>
                                                        </>:
                                                        <>
                                                            <TableCell align="center" className={classes.border}>{row.fd_ceiling} </TableCell>
                                                            <TableCell align="center" className={classes.border}>{row.fd_floor} </TableCell>
                                                            <TableCell align="center" className={classes.border}>{row.fd_fpts$}</TableCell>
                                                        </>}

                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 50]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
            }
        </>
    );
}
