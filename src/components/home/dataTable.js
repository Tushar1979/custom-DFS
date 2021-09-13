import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
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
import API from '../../networking/api'


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
    return stabilizedThis.map((el) => el[0]);
}

let headCells = []

function EnhancedTableHead(props) {
    const {classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort} = props;
    const createSortHandler = (property) => (event) => {
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
                    <TableCell colSpan={4}>Simulation Result</TableCell>
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

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));


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
}));


export default function EnhancedTable(props) {
    const [loader, setLoader] = React.useState(true);
    const [NbaMinus, setNbaMinus] = React.useState('');
    const [nbaUpdate, setNbaUpdate] = React.useState([]);
    const [updateGameList, setUpdateGameList] = React.useState([]);
    const [updateNflGameList, setUpdateNflGameList] = React.useState([]);
    const [nflList, setNflList] = React.useState([]);
    // const [saveData, setSaveData] = React.useState(props.saveDataBtn);
    const [isNbaNfl, setIsNbaNfl] = React.useState(props.is_nbaNfl);

    let user_data = props.data
    let saveData = props.saveDataBtn

    useEffect(() => {
        setUpdateGameList(props.data)
        setUpdateNflGameList(props.nfl_player_data)
    })

    const handleChangeMinus = (e) =>{
        let rowId = e.target.id
        let nbaMinus = e.target.value
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Minutes'] = nbaMinus
            }
        }
    }
    const handleChangePoints = (e) => {
        let rowId = e.target.id
        let nbaPoints = e.target.value
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Points'] = nbaPoints
            }
        }
    }
    // Rebounds
    // handleChangeAssists
    const handleChangeRebounds = (e) => {
        let rowId = e.target.id
        let nbaRebounds = e.target.value
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Rebounds'] = nbaRebounds
            }
        }
    }
    const handleChangeAssists = (e) => {
        let rowId = e.target.id
        let nbaAssists  = e.target.value
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Assists'] = nbaAssists
            }
        }
    }
    const handleChangeBlockedShots = (e) => {
        let rowId = e.target.id
        let nbaBlockedShots   = e.target.value
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['BlockedShots'] = nbaBlockedShots
            }
        }
    }
    const handleChangeSteals = (e) => {
        let rowId = e.target.id
        let nbaSteals = e.target.value
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Steals'] = nbaSteals
            }
        }
    }
    const handleChangeTurnovers = (e) => {
        let rowId = e.target.id
        let nbaTurnovers = e.target.value
        for(let i = 0; i<updateGameList.length; i++){
            if(updateGameList[i].Id === rowId){
                updateGameList[i]['Turnovers'] = nbaTurnovers
            }
        }
    }

    //  NFL data updating

    const handleChangeCompletion = (e) =>{
        let rowId = e.target.id
        let nflPassingCompletions  = e.target.value
        let is_exist = true
        for(let i = 0; i<nflList.length; i++){
                if (nflList[i].Id === rowId) {
                        nflList[i]['PassingCompletions'] = parseInt(nflPassingCompletions)
                    is_exist = false
                    break
                }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingCompletions'] = parseInt(nflPassingCompletions)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }

    const handleChangePassingAttempts = (e) =>{
        let rowId = e.target.id
        let nflPassingAttempts = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['PassingAttempts'] = parseInt(nflPassingAttempts)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingAttempts'] = parseInt(nflPassingAttempts)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }

    }
    const handleChangePassingYards = (e) =>{
        let rowId = e.target.id
        let nflPassingYards = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['PassingYards'] = parseInt(nflPassingYards)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingYards'] = parseInt(nflPassingYards)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangePassingTouchdowns = (e) =>{
        let rowId = e.target.id
        let nflPassingTouchdowns = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['PassingTouchdowns'] = parseInt(nflPassingTouchdowns)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['PassingTouchdowns'] = parseInt(nflPassingTouchdowns)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }

    const handleChangeRushingAttempts = (e) =>{
        let rowId = e.target.id
        let nflRushingAttempts = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['RushingAttempts'] = parseInt(nflRushingAttempts)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['RushingAttempts'] = parseInt(nflRushingAttempts)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeRushingYards = (e) =>{
        let rowId = e.target.id
        let nflRushingYards = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['RushingYards'] = parseInt(nflRushingYards)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['RushingYards'] = parseInt(nflRushingYards)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeRushingTouchdowns = (e) =>{
        let rowId = e.target.id
        let nflRushingTouchdowns = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['RushingYards'] = parseInt(nflRushingTouchdowns)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['RushingYards'] = parseInt(nflRushingTouchdowns)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceptions = (e) =>{
        let rowId = e.target.id
        let nflReceptions = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['Receptions'] = parseInt(nflReceptions)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['Receptions'] = parseInt(nflReceptions)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceivingYards = (e) =>{
        let rowId = e.target.id
        let nflReceivingYards = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['ReceivingYards'] = parseInt(nflReceivingYards)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['ReceivingYards'] = parseInt(nflReceivingYards)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceivingTouchdowns = (e) =>{
        let rowId = e.target.id
        let nflReceivingTouchdowns = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['ReceivingTouchdowns'] = parseInt(nflReceivingTouchdowns)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['ReceivingTouchdowns'] = parseInt(nflReceivingTouchdowns)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeFieldGoalsMade= (e) =>{
        let rowId = e.target.id
        let nflFieldGoalsMade = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['FieldGoalsMade'] = parseInt(nflFieldGoalsMade)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['FieldGoalsMade'] = parseInt(nflFieldGoalsMade)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    const handleChangeFieldGoalsAttempted = (e) =>{
        let rowId = e.target.id
        let nflFieldGoalsAttempted = e.target.value
        let is_exist = true
        for(let i =0; i< nflList.length; i++){
            if(nflList[i].Id === rowId){
                nflList[i]['FieldGoalsAttempted'] = parseInt(nflFieldGoalsAttempted)
                is_exist=false
                break
            }
        }
        if(is_exist){
            for(let i = 0; i<updateNflGameList.length; i++){
                if(updateNflGameList[i].Id === rowId){
                    updateNflGameList[i]['FieldGoalsAttempted'] = parseInt(nflFieldGoalsAttempted)
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist=false
                }
            }
            is_exist = false
        }
    }
    if(saveData){
        // if(props.is_nbaNfl === 'NFL') {
            props.onSavePlayerStats(nflList)
        // }
    }
    if (props.nfl_player_data.length > 0) {
        update_data = true
        nft_header = true
        user_data = props.nfl_player_data
        rows = []
        headCells = [
            {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
            {id: 'pos', numeric: false, disablePadding: false, label: 'pos'},
            {id: 'team', numeric: false, disablePadding: false, label: 'team'},
            {id: 'oop', numeric: false, disablePadding: false, label: 'opp'},
            {id: 'salary', numeric: false, disablePadding: false, label: 'salary'},


            {id: 'completion', numeric: false, disablePadding: true, label: 'Completions'},
            {id: 'passingattempts', numeric: false, disablePadding: true, label: 'Attempts'},
            {id: 'passingyards', numeric: false, disablePadding: true, label: 'Yards'},
            {id: 'passingtouchdowns', numeric: false, disablePadding: true, label: 'TD'},
            {id: 'rushingattempts', numeric: false, disablePadding: true, label: 'Attempts'},
            {id: 'rushingyards', numeric: false, disablePadding: true, label: 'Yards'},
            {id: 'rushingtouchdowns', numeric: false, disablePadding: true, label: 'TD'},
            {id: 'receptions', numeric: false, disablePadding: true, label: 'Receptions'},
            {id: 'receivingyards', numeric: false, disablePadding: true, label: 'yard'},
            {id: 'receivingtouchdowns', numeric: false, disablePadding: true, label: 'TD'},
            {id: 'fieldgoalsmade', numeric: false, disablePadding: true, label: 'fgm'},
            {id: 'fieldgoalsattempted', numeric: false, disablePadding: true, label: 'fga'},

            {id: 'fpts', numeric: false, disablePadding: false, label: 'fpts'},
            {id: 'ceiling', numeric: false, disablePadding: false, label: 'ceiling'},
            {id: 'floor', numeric: false, disablePadding: false, label: 'floor'},
            {id: 'fpts$', numeric: false, disablePadding: false, label: 'fpts/$1'},

        ];
    }
    if (props.data.length > 0) {
        update_data = true
        user_data = props.data
        rows = []
        nft_header = false
        headCells = [
            {id: 'name', numeric: false, disablePadding: true, label: 'Name'},
            {id: 'pos', numeric: false, disablePadding: false, label: 'pos'},
            {id: 'team', numeric: false, disablePadding: false, label: 'team'},
            {id: 'oop', numeric: false, disablePadding: false, label: 'opp'},
            {id: 'salary', numeric: false, disablePadding: false, label: 'salary'},

            {id: 'minus', numeric: false, disablePadding: false, label: 'min'},
            {id: 'points', numeric: false, disablePadding: false, label: 'pts'},
            {id: 'rebound', numeric: false, disablePadding: false, label: 'reb'},
            {id: 'assists', numeric: false, disablePadding: false, label: 'ast'},
            {id: 'steals', numeric: false, disablePadding: false, label: 'stl'},
            {id: 'blockedShots', numeric: false, disablePadding: false, label: 'blk'},
            {id: 'to', numeric: false, disablePadding: false, label: 'to'},

            {id: 'fpts', numeric: false, disablePadding: false, label: 'fpts'},
            {id: 'ceiling', numeric: false, disablePadding: false, label: 'ceiling'},
            {id: 'floor', numeric: false, disablePadding: false, label: 'floor'},
            {id: 'fpts$', numeric: false, disablePadding: false, label: 'fpts/$1'},
        ]
    }

    if (props.new_array != null) {
        update_data = true
        user_data = props.new_array
    }
    // update_data=props.update_data
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    if (update_data) {
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
                        salary: user_data[data].DraftKingsSalary,
                        fdSalary: user_data[data].FanDuelSalary,
                        minus: user_data[data].PlusMinus,
                        points: user_data[data].Points,
                        rebound: user_data[data].Rebounds,
                        assists: user_data[data].Assists,
                        steals: user_data[data].Steals,
                        blockedShots: user_data[data].BlockedShots,
                        to: user_data[data].Turnovers,
                        fantasyPoints: user_data[data].FantasyPointsDraftKings,
                        fd_fantasyPoints: user_data[data].FantasyPointsFantasyDraft,
                        nfl_dk_fantasyPoints: user_data[data].DK_Proj,
                        nfl_fd_fantasyPoints: user_data[data].FantasyPoints,
                        ceiling: user_data[data].DK_Ceil,
                        fd_ceiling: user_data[data].FD_Ceil,
                        floor: user_data[data].DK_Floor,
                        fd_floor: user_data[data].FD_Floor,
                        fpts$: user_data[data].DK_Value,
                        fd_fpts$: user_data[data].FD_Value,

                        completion: user_data[data].PassingCompletions,
                        passingattempts: user_data[data].PassingAttempts,
                        passingyards: user_data[data].PassingYards,
                        passingtouchdowns: user_data[data].PassingTouchdowns,
                        rushingattempts: user_data[data].RushingAttempts,
                        rushingyards: user_data[data].RushingYards,
                        rushingtouchdowns: user_data[data].RushingTouchdowns,
                        receptions: user_data[data].Receptions,
                        receivingyards: user_data[data].ReceivingYards,
                        receivingtouchdowns: user_data[data].ReceivingTouchdowns,
                        fieldgoalsmade: user_data[data].FieldGoalsMade,
                        fieldgoalsattempted: user_data[data].FieldGoalsAttempted,
                    })

            }
            update_data = false
        }
        // props.generateExcelData(rows)

        if(loader) {
            sleep(3000).then(r => {
                setLoader(false);
            })
        }
    }

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('salary');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        user_data = false
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        user_data = false
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;
    // console.log(rows,"################")

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
                                    // data_props={user_data}
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
                                                    <TableCell id={labelId} scope="row" padding="none">
                                                        {row.name}
                                                    </TableCell>
                                                    {props.salary === 'dk' ?
                                                        <TableCell align="center">{row.pos}  </TableCell> :
                                                        <TableCell align="center">{row.fdPos}</TableCell>
                                                    }

                                                    <TableCell align="center">{row.team} </TableCell>
                                                    <TableCell align="center">{row.oop} </TableCell>
                                                    {props.salary === 'dk' ?
                                                        <TableCell align="center">${row.salary} </TableCell> :
                                                        <TableCell align="center">${row.fdSalary}  </TableCell>
                                                    }

                                                    {nft_header ?
                                                        (props.inputActive ? <>
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell
                                                                        align="center">{row.completion} </TableCell>
                                                                    <TableCell
                                                                        align="center">{row.passingattempts}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.passingyards}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.passingtouchdowns}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.rushingattempts}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.rushingyards}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.rushingtouchdowns}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.receptions}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.receivingyards}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.receivingtouchdowns}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.fieldgoalsmade}</TableCell>
                                                                    <TableCell
                                                                        align="center">{row.fieldgoalsattempted}</TableCell>
                                                                </>
                                                        )

                                                        :
                                                        (props.inputActive ?
                                                                <>
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">
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
                                                                    <TableCell align="center">{row.minus} </TableCell>
                                                                    <TableCell align="center">{row.points} </TableCell>
                                                                    <TableCell align="center">{row.rebound} </TableCell>
                                                                    <TableCell align="center">{row.assists} </TableCell>
                                                                    <TableCell align="center">{row.steals} </TableCell>
                                                                    <TableCell
                                                                        align="center">{row.blockedShots} </TableCell>
                                                                    <TableCell align="center">{row.to}</TableCell>
                                                                </>
                                                        )
                                                    }
                                                    {nft_header ?

                                                        (props.salary === 'dk' ?
                                                            <TableCell align="center">{row.nfl_dk_fantasyPoints}</TableCell>
                                                            :
                                                            <TableCell align="center">{row.nfl_fd_fantasyPoints}</TableCell>)

                                                        :
                                                        (props.salary === 'dk' ?
                                                            <TableCell align="center">{row.fantasyPoints} </TableCell>
                                                            :<TableCell align="center">{row.fd_fantasyPoints} </TableCell>
                                                        )


                                                    }
                                                    {props.salary === 'dk' ?
                                                        <>
                                                            <TableCell align="center">{row.ceiling} </TableCell>
                                                            <TableCell align="center">{row.floor} </TableCell>
                                                            <TableCell align="center">{row.fpts$}</TableCell>
                                                        </>:
                                                        <>
                                                            <TableCell align="center">{row.fd_ceiling} </TableCell>
                                                            <TableCell align="center">{row.fd_floor} </TableCell>
                                                            <TableCell align="center">{row.fd_fpts$}</TableCell>
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
