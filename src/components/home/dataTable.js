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
import Spinner from '../Spinner/spinner'
// import '../home/style.css'
import '../datanavbar/datanavbar.css'
import axios from "axios";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import {CardActionArea} from '@mui/material';
import {Container, FormControl, Grid, InputLabel, Select, styled} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ExportToExcel from "../optimizerExport/optimizerExport";


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
    let xx = JSON.stringify(stabilizedThis.map((el) => el[0]))
    if (localStorage.getItem('exlData')) {
        localStorage.removeItem('exlData')
        localStorage.setItem('exlData', xx)
    } else {
        localStorage.setItem('exlData', xx)
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
            <TableRow className={nft_header ? "middle_table_head nfl_head" : "middle_table_head"}>
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
    border: {
        borderRight: "1px solid #D8D8D8"
    },

}));


export default function EnhancedTable(props) {
    var [nflFilter_list, setnflFilter_list] = React.useState(['qb', 'rb', 'wr', 'te', 'k', 'dst'])
    var [nbaFilter_list, setnbaFilter_list] = React.useState(['pg', 'sg', 'sf', 'pf', 'c'])
    var [qbActive, setqbActive] = React.useState(true)
    var [rbActive, setrbActive] = React.useState(true)
    var [wrActive, setwrActive] = React.useState(true)
    var [teActive, setteActive] = React.useState(true)
    var [kActive, setkActive] = React.useState(true)
    var [dstActive, setdstActive] = React.useState(true)
    var [pgActive, setpgActive] = React.useState(true)
    var [sgActive, setsgActive] = React.useState(true)
    var [sfActive, setsfActive] = React.useState(true)
    var [pfActive, setpfActive] = React.useState(true)
    var [cActive, setcActive] = React.useState(true)

    const [loader, setLoader] = React.useState(true);
    //const [NbaMinus, setNbaMinus] = React.useState('');
    //const [nbaUpdate, setNbaUpdate] = React.useState([]);
    const [spinner, setSpinner] = React.useState(false)
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
    const [lineups, setLineups] = React.useState(1);
    // const [user, setUser] = React.useState(localStorage.getItem('username'));
    const [optimizerData, setOptimizerData] = React.useState([]);
    const [site, setSite] = React.useState('');
    const [sport, setSport] = React.useState(props.is_nbaNfl);
    const [slate, setSlate] = React.useState('All');
    const [isOpen, setIsOpen] = React.useState(false)
    const [players, setPlayers] = React.useState({})
    const [tempPlayers, setTempPlayers] = React.useState({})
    const [showPlayers, setshowPlayers] = React.useState(false)
    const [allBtn, setallBtn] = React.useState(true)
    const [clearBtn, setclearBtn] = React.useState(false)
    const [pgBtn, setpgBtn] = React.useState(true)
    const [sgBtn, setsgBtn] = React.useState(true)
    const [sfBtn, setsfBtn] = React.useState(true)
    const [pfBtn, setpfBtn] = React.useState(true)
    const [cBtn, setcBtn] = React.useState(true)


    const [qbBtn, setqbBtn] = React.useState(true)
    const [rbBtn, setrbBtn] = React.useState(true)
    const [wrBtn, setwrBtn] = React.useState(true)
    const [teBtn, setteBtn] = React.useState(true)
    const [kBtn, setkBtn] = React.useState(true)
    const [dstBtn, setdstBtn] = React.useState(true)
    const [choose, setChoose] = React.useState("FPTS")
    console.log(props.salary)
    console.log(site)

    useEffect(() => {
        setSite(props.salary)
        setIsOpen(false);
        setPlayers({})
        setOptimizerData({})
        allSelectFilter()
    }, [props.salary])

    useEffect(() => {
        console.log("Use Effect Updated Filter List", nflFilter_list)
        let filter_data = nflFilterObj(nflFilter_list)
        console.log(filter_data)
        if (Object.keys(filter_data).length > 0) {
            setPlayers(filter_data)
        } else {
            setPlayers({})
        }
        if (nflFilter_list.length === 6) {
            setallBtn(true)
        }

    }, [nflFilter_list])
    useEffect(() => {
        console.log("Use Effect Updated Filter List", nbaFilter_list)
        let filter_data = filterObj(nbaFilter_list)
        console.log(filter_data)
        if (Object.keys(filter_data).length > 0) {
            setPlayers(filter_data)
        } else {
            setPlayers({})
        }
        if (nbaFilter_list.length === 5) {
            setallBtn(true)
        }
    }, [nbaFilter_list])

    let saveData = props.saveDataBtn
    let user_data = props.showData

    const getChoose = (e) => {
        setChoose(e.target.value.toUpperCase())
        setIsOpen(false);
        setPlayers({})
        setOptimizerData({})
    }
    const getData = (e) => {

        setLineups([e.target.value])
        setIsOpen(false);
        setPlayers({})
        setOptimizerData({})
    }
    const filterObj = (keyList) => {
        // sessionStorage.setItem('pageReset', "true0")
        let newArray
        let pgArray
        let sgArray
        let sfArray
        let pfArray
        let cArray
        let player_obj
        pgArray = {}
        sgArray = {}
        sfArray = {}
        pfArray = {}
        cArray = {}
        player_obj = tempPlayers
        for (let i = 0; i < keyList.length; i++) {
            if (keyList[i] === 'pg') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'PG' || player_obj[item].data.position.includes('PG')) {
                        pgArray[item] = player_obj[item]
                    }
                })
            } else if (keyList[i] === 'sg') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'SG' || player_obj[item].data.position.includes('SG')) {
                        sgArray[item] = player_obj[item]
                    }
                })
            } else if (keyList[i] === 'sf') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'SF' || player_obj[item].data.position.includes('SF')) {
                        sfArray[item] = player_obj[item]
                    }
                })
            } else if (keyList[i] === 'pf') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'PF' || player_obj[item].data.position.includes('PF')) {
                        pfArray[item] = player_obj[item]
                    }
                })
            } else if (keyList[i] === 'c') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'C' || player_obj[item].data.position.includes('C')) {
                        cArray[item] = player_obj[item]
                    }
                })
            }
        }
        newArray = {...pgArray, ...sgArray, ...sfArray, ...pfArray, ...cArray}
        return newArray

    }
    const nflFilterObj = (keyList) => {
        // sessionStorage.setItem('pageReset', "true0")
        let newArray
        let qbArray
        let rbArray
        let wrArray
        let teArray
        let kArray
        let dstArray
        let player_obj
        player_obj = tempPlayers
        newArray = {}
        qbArray = {}
        rbArray = {}
        wrArray = {}
        teArray = {}
        kArray = {}
        dstArray = {}

        for (let i = 0; i < keyList.length; i++) {
            if (keyList[i] === 'qb') {
                Object.keys(player_obj).map((item) => {
                        if (player_obj[item].data.position === 'QB') {
                            qbArray[item] = player_obj[item]
                            console.log(qbArray)
                        }
                        //     console.log(tempPlayers)
                        //     return newArray
                    }
                )
            } else if (keyList[i] === 'rb') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'RB') {
                        rbArray[item] = player_obj[item]
                        console.log(rbArray)
                    }
                    ;
                })
            } else if (keyList[i] === 'wr') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'WR') {
                        wrArray[item] = player_obj[item]
                        console.log(wrArray)
                    }
                })
            } else if (keyList[i] === 'te') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'TE') {
                        teArray[item] = player_obj[item]
                        console.log(teArray)
                    }
                })
            } else if (keyList[i] === 'k') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'K') {
                        kArray[item] = player_obj[item]
                        console.log(kArray)
                    }
                })
            } else if (keyList[i] === 'dst') {
                Object.keys(player_obj).map((item) => {
                    if (player_obj[item].data.position === 'DST') {
                        dstArray[item] = player_obj[item]
                        console.log(dstArray)
                    }
                })
            }
        }
        newArray = {...qbArray, ...rbArray, ...wrArray, ...teArray, ...kArray, ...dstArray}
        return newArray

    }
    const removeArray = (arrOriginal, elementToRemove) => {
        // var arr = arrOriginal.filter(function (el) {
        //     return el != elementToRemove
        // });
        // console.log(arr)
        // return arr
        return arrOriginal.filter(function (el) {
            return el != elementToRemove
        });
    }
    const allSelectFilter = () => {
        // sessionStorage.setItem('pageReset', "true0")
        if (props.is_nbaNfl === 'NFL') {
            setnflFilter_list(['qb', 'rb', 'wr', 'te', 'k', 'dst'])
            setqbActive(true)
            setrbActive(true)
            setwrActive(true)
            setteActive(true)
            setkActive(true)
            setdstActive(true)
            setPlayers(tempPlayers)
            setallBtn(true)
            setclearBtn(false)
            setqbBtn(true)
            setrbBtn(true)
            setwrBtn(true)
            setteBtn(true)
            setkBtn(true)
            setdstBtn(true)
        } else {
            setnbaFilter_list(['pg', 'sg', 'sf', 'pf', 'c'])
            setPlayers(tempPlayers)
            setpgActive(true)
            setsgActive(true)
            setsfActive(true)
            setpfActive(true)
            setcActive(true)
            setallBtn(true)
            setclearBtn(false)
            setpgBtn(true)
            setsgBtn(true)
            setsfBtn(true)
            setpfBtn(true)
            setcBtn(true)
        }
    }
    const allClearFilter = () => {
        if (props.is_nbaNfl === 'NFL') {
            setqbActive(false)
            // qbActive = false
            setrbActive(false)
            setwrActive(false)
            setteActive(false)
            setkActive(false)
            setdstActive(false)
            // nflFilter_list = []
            setnflFilter_list([])
            setPlayers({})
            setallBtn(false)
            setclearBtn(true)
            setqbBtn(false)
            setrbBtn(false)
            setwrBtn(false)
            setteBtn(false)
            setkBtn(false)
            setdstBtn(false)
            console.log(nflFilter_list)
        } else {
            setnbaFilter_list([])
            setPlayers({})
            setpgActive(false)
            setsgActive(false)
            setsfActive(false)
            setpfActive(false)
            setcActive(false)
            setallBtn(false)
            setclearBtn(true)
            setpgBtn(false)
            setsgBtn(false)
            setsfBtn(false)
            setpfBtn(false)
            setcBtn(false)
        }
    }
    const pgFilters = () => {
        if (pgActive === true) {
            setnbaFilter_list(removeArray(nbaFilter_list, 'pg'))
        } else {
            let new_arr = [...nbaFilter_list]
            new_arr.push('pg')
            setnbaFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setpgBtn(!pgBtn)
        setpgActive(!pgActive)
    }

    const sgFilters = () => {
        if (sgActive === true) {
            setnbaFilter_list(removeArray(nbaFilter_list, 'sg'))
        } else {
            let new_arr = [...nbaFilter_list]
            new_arr.push('sg')
            setnbaFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setsgBtn(!sgBtn)
        setsgActive(!sgActive)
    }

    const sfFilters = () => {
        if (sfActive === true) {
            setnbaFilter_list(removeArray(nbaFilter_list, 'sf'))
        } else {
            let new_arr = [...nbaFilter_list]
            new_arr.push('sf')
            setnbaFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setsfBtn(!sfBtn)
        setsfActive(!sfActive)
    }

    const pfFilters = () => {
        if (pfActive === true) {
            setnbaFilter_list(removeArray(nbaFilter_list, 'pf'))
        } else {
            let new_arr = [...nbaFilter_list]
            new_arr.push('pf')
            setnbaFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setpfBtn(!pfBtn)
        setpfActive(!pfActive)
    }

    const cFilters = () => {
        if (cActive === true) {
            setnbaFilter_list(removeArray(nbaFilter_list, 'c'))
        } else {
            let new_arr = [...nbaFilter_list]
            new_arr.push('c')
            setnbaFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setcBtn(!cBtn)
        setcActive(!cActive)
    }


    const qbFilters = () => {
        if (qbActive === true) {
            setnflFilter_list(removeArray(nflFilter_list, 'qb'))
        } else {
            let new_arr = [...nflFilter_list]
            new_arr.push('qb')
            setnflFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setqbBtn(!qbBtn)
        setqbActive(!qbActive)
    }

    const rbFilters = () => {
        if (rbActive === true) {
            setnflFilter_list(removeArray(nflFilter_list, 'rb'))
        } else {
            let new_arr = [...nflFilter_list]
            new_arr.push('rb')
            setnflFilter_list(new_arr)
        }
        setrbActive(!rbActive)
        setallBtn(false)
        setrbBtn(!rbBtn)
        if (nflFilter_list.length === 6) {
            setallBtn(true)

        }
    }

    const wrFilters = () => {
        if (wrActive === true) {
            setnflFilter_list(removeArray(nflFilter_list, 'wr'))
        } else {
            let new_arr = [...nflFilter_list]
            new_arr.push('wr')
            setnflFilter_list(new_arr)
        }
        setallBtn(false)
        setwrActive(!wrActive)
        setclearBtn(false)
        setwrBtn(!wrBtn)
        if (nflFilter_list.length === 6) {
            setallBtn(true)
        }
    }

    const teFilters = () => {
        if (teActive === true) {
            setnflFilter_list(removeArray(nflFilter_list, 'te'))
        } else {
            let new_arr = [...nflFilter_list]
            new_arr.push('te')
            setnflFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setteBtn(!teBtn)
        setteActive(!teActive)
        if (nflFilter_list.length === 6) {
            setallBtn(true)
        }
    }

    const kFilters = () => {
        if (teActive === true) {
            setnflFilter_list(removeArray(nflFilter_list, 'k'))
        } else {
            let new_arr = [...nflFilter_list]
            new_arr.push('k')
            setnflFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setkBtn(!kBtn)
        setkActive(!kActive)
        if (nflFilter_list.length === 6) {
            setallBtn(true)
        }
    }

    const dstFilters = () => {
        if (dstActive === true) {
            setnflFilter_list(removeArray(nflFilter_list, 'dst'))
        } else {
            let new_arr = [...nflFilter_list]
            new_arr.push('dst')
            setnflFilter_list(new_arr)
        }
        setallBtn(false)
        setclearBtn(false)
        setdstBtn(!dstBtn)
        setkActive(!dstActive)
        if (nflFilter_list.length === 6) {
            setallBtn(true)
        }
    }

    const optimizer = () => {
        setSpinner(true)
        setIsOpen(!isOpen);
        var data = {
            'site': site,
            'sport': sport,
            'slate': slate,
            'user': localStorage.getItem('username'),
            'lineups': lineups
        }
        console.log(site)
        console.log(sport)
        console.log(slate)
        console.log("started")
        axios.post('https://o55cs4x9vi.execute-api.us-east-2.amazonaws.com/optimizer', {
            'site': site.toUpperCase(),
            'sport': sport,
            'slate': slate,
            // 'user': String(localStorage.getItem('username')),
            'user': "Master",
            'lineups': parseInt(lineups),
            "parameter": choose
        })
            .then(res => {
                console.log(res.data.Usage);
                console.log(res.data.Lineups)
                setOptimizerData(res.data.Lineups);

                setPlayers(res.data.Usage)
                setTempPlayers(res.data.Usage)
                setSpinner(false)
            })
            .catch(err => console.log(err));
    }

    const PlayersComp = () => {
        return (
            <Card sx={{
                width: "auto",
                marginTop: "4.5%",
                float: "left",
                marginLeft: "1%",
                position: "absolute",
                // marginLeft:"38%",
                background: "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)"
            }}>
                <CardContent style={{width: "100%"}}>

                    <Card style={{overflow: "auto"}}>
                        <Table>
                            <TableHead style={{display: "fixed"}}>
                                <TableRow>
                                    <TableCell align={"center"} style={{backgroundColor: "darkblue", color: "white"}}>
                                        {Object.keys(tempPlayers).length} Players Used | {lineups} Lineups
                                    </TableCell>
                                </TableRow>
                                {props.is_nbaNfl === 'NBA' ? <>
                                    <TableRow style={{display: "inline-flex", float: "left"}}>
                                        <TableCell
                                            className={`${allBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={allSelectFilter}>
                                            <span className="btn-text"> ALL</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${clearBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={allClearFilter}>
                                            <span className="btn-text"> CLEAR</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${pgBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={pgFilters}>
                                            <span className="btn-text"> PG</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${sgBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={sgFilters}>
                                            <span className="btn-text"> SG</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${sfBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={sfFilters}>
                                            <span className="btn-text"> SF</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${pfBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={pfFilters}>
                                            <span className="btn-text"> PF</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${cBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={cFilters}>
                                            <span className="btn-text"> C</span>
                                        </TableCell>
                                    </TableRow>
                                </> : <>
                                    <TableRow style={{display: "inline-flex", float: "left"}}>
                                        <TableCell
                                            className={`${allBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={allSelectFilter}>
                                            <span className="btn-text"> ALL</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${clearBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={allClearFilter}>
                                            <span className="btn-text"> CLEAR</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${qbBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={qbFilters}>
                                            <span className="btn-text"> qb</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${rbBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={rbFilters}>
                                            <span className="btn-text"> rb</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${wrBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={wrFilters}>
                                            <span className="btn-text"> wr</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${teBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={teFilters}>
                                            <span className="btn-text"> te</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${kBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={kFilters}>
                                            <span className="btn-text"> k</span>
                                        </TableCell>
                                        <TableCell
                                            className={`${dstBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={dstFilters}>
                                            <span className="btn-text"> dst</span>
                                        </TableCell>
                                    </TableRow>
                                </>}

                            </TableHead>
                        </Table>
                        <div style={{overflow: 'auto', height: '45vh'}}>
                            <Table>
                                <TableBody style={{borderRadius: "10px", position: "relative"}}>
                                    {Object.keys(players).map((item, index) => (

                                            <TableRow
                                                // key={row.name}
                                                className={props.is_nbaNfl === 'NFL' ? `${"activeNFL" + players[item]['data']['team_id']}` : `${"activeNBA" + players[item]['data']['team_id']}`}
                                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                            >
                                                <TableCell align="left"
                                                           style={{color: "white"}}>
                                                <span
                                                    className={props.is_nbaNfl === 'NFL' ? `${"NFL" + players[item]['data']['team_id']} nfl` : `${"NBA" + players[item]['data']['team_id']} nba`}></span>
                                                    {players[item]['data']['name']}({players[item]['count']}){parseInt(players[item]['percentage'] * 100)}%
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                    </Card>
                </CardContent>
            </Card>
        )
    }

    const playersUsed = () => {
        setshowPlayers(!showPlayers)
    }
    const Item = styled(Paper)(({theme}) => ({
        // padding: theme.spacing(1),
        textAlign: 'center',
        // color: theme.palette.text.secondary,
    }));
    const RenderCard = () => {

        return (
            <>
                <Table style={{
                    border: "1px solid black",
                    overflow: "auto",
                    display: "block",
                    whiteSpace: "nowrap",
                    tableLayout: "fixed"
                }}>
                    <TableHead>
                        <TableRow style={{backgroundColor: "darkblue", width: "100%"}}>
                            <TableCell style={{
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "bold",
                                textAlign: "center",
                                borderRight: "1px solid white",
                                padding: "15px"
                            }}>Lineup
                                #</TableCell>
                            <TableCell style={{
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "bold",
                                textAlign: "center",
                                borderRight: "1px solid white",
                                padding: "15px"
                            }}>$</TableCell>
                            <TableCell style={{
                                color: "white",
                                fontSize: "14px",
                                fontWeight: "bold",
                                textAlign: "center",
                                borderRight: "1px solid white",
                                padding: "15px"
                            }}>{choose}</TableCell>
                            {props.is_nbaNfl === 'NBA' ?
                                props.salary === 'dk' ?
                                    <>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>PG</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>SG</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>SF</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>PF</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>C</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>G</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>F</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>UTIL</TableCell>
                                    </> : <>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>PG</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>PG</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>SG</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>SG</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>SF</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>SF</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>PF</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            padding: "15px"
                                        }}>PF</TableCell>
                                        <TableCell colSpan={"2"} style={{
                                            color: "white",
                                            fontSize: "14px",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            padding: "15px"
                                        }}>C</TableCell>
                                    </>
                                :
                                <>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>QB</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>RB</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>RB</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>WR</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>WR</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>WR</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>TE</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        borderRight: "1px solid white",
                                        padding: "15px"
                                    }}>FLEX</TableCell>
                                    <TableCell colSpan={"2"} style={{
                                        color: "white",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        padding: "15px"
                                    }}>DST</TableCell>
                                </>
                            }
                        </TableRow>
                    </TableHead>
                    {
                        optimizerData.map((table, index) => {
                            return (
                                <TableBody style={{
                                    borderRadius: "10px",
                                    tableLayout: "fixed",
                                    overflowWrap: "break-word"
                                }}>
                                    <TableRow>
                                        <TableCell style={{
                                            padding: "0px",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            color: "white",
                                            backgroundColor: "darkblue"
                                        }}>Lineup {index + 1}</TableCell>
                                        <TableCell style={{
                                            padding: "5px",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            color: "white",
                                            backgroundColor: "darkblue"
                                        }}>${table.Salary}</TableCell>
                                        <TableCell style={{
                                            padding: "0px",
                                            textAlign: "center",
                                            borderRight: "1px solid white",
                                            color: "white",
                                            backgroundColor: "darkblue"
                                        }}>{table.Score}</TableCell>
                                        {
                                            Object.keys(table.Players).map((insideTable) => {
                                                return (
                                                    <>
                                                        <TableCell colSpan={2}
                                                                   className={props.is_nbaNfl === 'NFL' ? `${"activeNFL" + table.Players[insideTable].team_id}` : `${"activeNBA" + table.Players[insideTable].team_id}`}
                                                                   style={{
                                                                       padding: "0px",
                                                                       textAlign: "center",
                                                                       borderRight: "1px solid white",
                                                                       color: "white",
                                                                       tableLayout: "fixed"
                                                                   }}>
                                                            <TableRow style={{
                                                                width: "100%",
                                                                display: "inline-block",
                                                                borderBottom: "1px solid white"
                                                            }}>
                                                                <TableCell style={{
                                                                    padding: "10px",
                                                                    textAlign: "center",
                                                                    color: "white",
                                                                    display: "inline-flex",
                                                                    width: "max-content",
                                                                    border: "0px",
                                                                    fontSize: "16px",

                                                                }}><span
                                                                    className={props.is_nbaNfl === 'NFL' ? `${"NFL" + table.Players[insideTable].team_id} nfl` : `${"NBA" + table.Players[insideTable].team_id} nba`}></span>{table.Players[insideTable].name}
                                                                </TableCell>
                                                            </TableRow>
                                                            {/*<hr style={{backgroundColor:"white"}}/>*/}
                                                            <TableRow style={{width: "100%", display: "table-cell"}}>

                                                                <TableCell style={{
                                                                    textAlign: "center",
                                                                    borderRight: "1px solid white",
                                                                    color: "white",
                                                                    borderBottom: "0px",
                                                                    display: "table-cell"
                                                                    // borderTop:"1px solid white",
                                                                }}>{table.Players[insideTable].salary}</TableCell>
                                                                <TableCell style={{
                                                                    verticalAlign: "middle",
                                                                    color: "white",
                                                                    borderBottom: "0px",
                                                                    display: "table-cell"
                                                                    // borderTop:"1px solid white"
                                                                }}>{table.Players[insideTable].score}</TableCell>
                                                            </TableRow>
                                                        </TableCell>

                                                    </>
                                                )

                                            })
                                        }
                                    </TableRow>
                                </TableBody>
                            )
                        })
                    }
                </Table>
            </>
        )

    }


    let tableData;
    tableData =
        <>
            <Grid container spacing={2}>
                <Grid xs={2}>

                    <Item style={{"boxShadow": "none"}}>

                        <div style={{position: "relative"}} className="optimizer">
                            {spinner === true ?
                                <>

                                    <Button
                                        variant="contained"
                                        className="btn active ad-group-btn button-optimizer"
                                        fullWidth style={{fontSize:"18px", backgroundColor:"red", color:"white"}}
                                    >
                                        <Spinner/>
                                        </Button>
                                </> : <>
                                    <Button fullWidth style={{fontSize:"18px", backgroundColor:"red", color:"white"}} variant="contained" color="danger" className="btn active ad-group-btn button-optimizer"
                                            onClick={optimizer}
                                    >
                                        <span>OPTIMIZER </span></Button>
                                </>}
                        </div>
                    </Item>
                </Grid>
                <Grid xs={2} style={{"boxShadow": "none"}}>
                    {/*<Item>*/}
                    <div className="inputbold">
                        <TextField id="outlined-search" label="Lineups"
                                   onChange={getData}
                                   variant="outlined"/>
                    </div>
                    {/*</Item>*/}
                </Grid>

                <Grid xs={3} style={{"boxShadow": "none"}}>
                    {/*<Item style={{"boxShadow":"none"}}>*/}
                    <FormControl>
                        <InputLabel id="demo-simple-select-label" sx={{marginTop: -1}}> Choose Value </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            style={{width: 273, padding: '0px', border: "1px solid black"}}
                            onChange={getChoose}
                        >
                            {/*{DK_keys.map((el) => (*/}
                            <MenuItem value="FPTS">
                                FPTS
                            </MenuItem>
                            <MenuItem value="ceil">
                                CEIL
                            </MenuItem>
                            <MenuItem value="floor">
                                FLOOR
                            </MenuItem>
                            {/*))}*/}
                        </Select>
                    </FormControl>
                    {/*</Item>*/}
                </Grid>
                <Grid xs={2}>
                    <ExportToExcel
                                    fileName={'OptimizerExport'}
                                    dataOf={props.is_nbaNfl}
                                    salaryType={props.salary}
                                    excelData={optimizerData}
                                />
                </Grid>
            </Grid>

            {
                isOpen ?
                    <>
                        {/*<Container style={{width:"100%"}}>*/}
                        {optimizerData.length > 0 ?
                            <button style={{marginBottom: "1%", marginLeft: "1%", marginTop: "1%"}}
                                    className="button-playerData"
                                    aria-haspopup="true" onClick={playersUsed}>
                                <span>PLAYERS DATA</span></button> : null}
                        {/*</Container>*/}
                        <div>{showPlayers === true ? <PlayersComp/> : null}</div>
                        {/*<div className="renderCard">*/}
                        {/*<div>{list}</div>*/}
                        {optimizerData.length > 0 ? <RenderCard/> : null}

                        {/*</div>*/}
                    </>
                    : null
            }
        </>


    useEffect(() => {
            let a = sessionStorage.getItem("order")
            let b = sessionStorage.getItem("orderby")
            if (props.salary === 'dk') {
                console.log(b)
                if (b === "fdPos") {
                    b = 'pos';
                } else if (b === "fd_ceiling")
                    b = 'ceiling';
                else if (b === "fd_floor")
                    b = "floor";
                else if (b === "fd_fpts$")
                    b = "fpts$";
                else if (b === "fd_fantasyPoints")
                    b = "fantasyPoints"
                else if (b === "fdSalary")
                    b = "salary"
                else if (b === "nfl_fd_fantasyPoints")
                    b = "nfl_dk_fantasyPoints"
                // else
                //     b='salary';
                console.log("dk " + b)
                sessionStorage.setItem("order", a)
                sessionStorage.setItem("orderby", b)

            } else if (props.salary === "fd") {
                if (b === "pos")
                    b = 'fdPos';
                else if (b === "ceiling")
                    b = 'fd_ceiling';
                else if (b === "floor")
                    b = "fd_floor";
                else if (b === "fpts$")
                    b = "fd_fpts$";
                else if (b === "fantasyPoints")
                    b = "fd_fantasyPoints"
                else if (b === "salary")
                    b = "fdSalary"
                else if (b === "nfl_dk_fantasyPoints")
                    b = "nfl_fd_fantasyPoints"
                console.log("fd " + b)
                sessionStorage.setItem("order", a)
                sessionStorage.setItem("orderby", b)
            }
            // if(props.salary==="fd")
            //     b="fdSalary"
            // else
            //     b="salary"
            setOrder(a)
            setOrderBy(b);
        }
        , [props.salary])

    useEffect(() => {
            setOrder("asc")
            setOrderBy("salary");
            sessionStorage.setItem("order", "asc")
            sessionStorage.setItem("orderby", "salary")
        }
        , [props.is_nbaNfl])

    useEffect(() => {
            setUpdateGameList(props.showData)
            setUpdateNflGameList(props.showData)
        }
        , [props.showData])


    const handleChangePage = (event, newPage) => {
            setPage(newPage);
            update_data = false
        }
    ;

    const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
            update_data = true
        }
    ;

    if (sessionStorage.getItem('pageReset') === 'true0') {
        setPage(0);
        sessionStorage.setItem('pageReset', 'false')
    }

    const handleChangeMinus = (e) => {
        let rowId = e.target.id
        let nbaMinus = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for (let i = 0; i < updateGameList.length; i++) {
            if (updateGameList[i].Id === rowId) {
                updateGameList[i]['Minutes'] = nbaMinus
                break
            }
        }
    }
    const handleChangePoints = (e) => {
        let rowId = e.target.id
        let nbaPoints = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for (let i = 0; i < updateGameList.length; i++) {
            if (updateGameList[i].Id === rowId) {
                updateGameList[i]['Points'] = nbaPoints
                break
            }
        }
    }
    const handleChangeRebounds = (e) => {
        let rowId = e.target.id
        let nbaRebounds = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for (let i = 0; i < updateGameList.length; i++) {
            if (updateGameList[i].Id === rowId) {
                updateGameList[i]['Rebounds'] = nbaRebounds
                break
            }
        }
    }
    const handleChangeAssists = (e) => {
        let rowId = e.target.id
        let nbaAssists = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for (let i = 0; i < updateGameList.length; i++) {
            if (updateGameList[i].Id === rowId) {
                updateGameList[i]['Assists'] = nbaAssists
                break
            }
        }
    }
    const handleChangeBlockedShots = (e) => {
        let rowId = e.target.id
        let nbaBlockedShots = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for (let i = 0; i < updateGameList.length; i++) {
            if (updateGameList[i].Id === rowId) {
                updateGameList[i]['BlockedShots'] = nbaBlockedShots
                break
            }
        }
    }
    const handleChangeSteals = (e) => {
        let rowId = e.target.id
        let nbaSteals = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for (let i = 0; i < updateGameList.length; i++) {
            if (updateGameList[i].Id === rowId) {
                updateGameList[i]['Steals'] = nbaSteals
                break
            }
        }
    }
    const handleChangeTurnovers = (e) => {
        let rowId = e.target.id
        let nbaTurnovers = e.target.value === "" ? 0 : parseFloat(e.target.value)
        for (let i = 0; i < updateGameList.length; i++) {
            if (updateGameList[i].Id === rowId) {
                updateGameList[i]['Turnovers'] = nbaTurnovers
                break
            }
        }
    }

    //  NFL data updating

    const handleChangeCompletion = (e) => {
        let rowId = e.target.id
        let nflPassingCompletions = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['PassingCompletions'] = nflPassingCompletions
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['PassingCompletions'] = nflPassingCompletions
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }

    const handleChangePassingAttempts = (e) => {
        let rowId = e.target.id
        let nflPassingAttempts = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['PassingAttempts'] = nflPassingAttempts
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['PassingAttempts'] = nflPassingAttempts
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }

    }
    const handleChangePassingYards = (e) => {
        let rowId = e.target.id
        let nflPassingYards = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['PassingYards'] = nflPassingYards
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['PassingYards'] = nflPassingYards
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangePassingTouchdowns = (e) => {
        let rowId = e.target.id
        let nflPassingTouchdowns = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['PassingTouchdowns'] = nflPassingTouchdowns
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['PassingTouchdowns'] = nflPassingTouchdowns
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }

    const handleChangeRushingAttempts = (e) => {
        let rowId = e.target.id
        let nflRushingAttempts = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['RushingAttempts'] = nflRushingAttempts
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['RushingAttempts'] = nflRushingAttempts
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangeRushingYards = (e) => {
        let rowId = e.target.id
        let nflRushingYards = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['RushingYards'] = nflRushingYards
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['RushingYards'] = nflRushingYards
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangeRushingTouchdowns = (e) => {
        let rowId = e.target.id
        let nflRushingTouchdowns = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['RushingTouchdowns'] = nflRushingTouchdowns
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['RushingTouchdowns'] = nflRushingTouchdowns
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceptions = (e) => {
        let rowId = e.target.id
        let nflReceptions = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['Receptions'] = nflReceptions
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['Receptions'] = nflReceptions
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceivingYards = (e) => {
        let rowId = e.target.id
        let nflReceivingYards = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['ReceivingYards'] = nflReceivingYards
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['ReceivingYards'] = nflReceivingYards
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangeReceivingTouchdowns = (e) => {
        let rowId = e.target.id
        let nflReceivingTouchdowns = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['ReceivingTouchdowns'] = nflReceivingTouchdowns
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['ReceivingTouchdowns'] = nflReceivingTouchdowns
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangeFieldGoalsMade = (e) => {
        let rowId = e.target.id
        let nflFieldGoalsMade = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['FieldGoalsMade'] = nflFieldGoalsMade
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['FieldGoalsMade'] = nflFieldGoalsMade
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }
    const handleChangeFieldGoalsAttempted = (e) => {
        let rowId = e.target.id
        let nflFieldGoalsAttempted = e.target.value === "" ? 0 : parseFloat(e.target.value)
        let is_exist = true
        for (let i = 0; i < nflList.length; i++) {
            if (nflList[i].Id === rowId) {
                nflList[i]['FieldGoalsAttempted'] = nflFieldGoalsAttempted
                is_exist = false
                break
            }
        }
        if (is_exist) {
            for (let i = 0; i < updateNflGameList.length; i++) {
                if (updateNflGameList[i].Id === rowId) {
                    updateNflGameList[i]['FieldGoalsAttempted'] = nflFieldGoalsAttempted
                    setNflList(nflList.concat(updateNflGameList[i]))
                    is_exist = false
                }
            }
            is_exist = false
        }
    }

    if (saveData) {
        if (props.is_nbaNfl === 'NFL') {
            props.onSavePlayerStats(updateNflGameList)
        } else {
            props.onSavePlayerStats(updateGameList)
        }
    }

    if (props.is_nbaNfl === "NFL") {
        update_data = true
        nft_header = true
        let pos, salary, ceiling, nfl_points, nfl_floor, nfl_fpts$
        if (props.salary === 'dk') {
            pos = 'pos';
            salary = 'salary';
            ceiling = 'ceiling';
            nfl_points = 'nfl_dk_fantasyPoints';
            nfl_floor = 'floor';
            nfl_fpts$ = 'fpts$'
        } else {
            pos = 'fdPos';
            salary = 'fdSalary';
            ceiling = 'fd_ceiling';
            nfl_points = 'nfl_fd_fantasyPoints';
            nfl_floor = 'fd_floor';
            nfl_fpts$ = 'fd_fpts$'
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

            {id: nfl_points, numeric: false, disablePadding: false, label: 'fpts'},
            {id: ceiling, numeric: false, disablePadding: false, label: 'ceil'},
            {id: nfl_floor, numeric: false, disablePadding: false, label: 'floor'},
            {id: nfl_fpts$, numeric: false, disablePadding: false, label: 'val'},

        ];
    }
    if (props.is_nbaNfl === "NBA") {
        update_data = true
        // user_data = props.showData
        let pos, salary, ceiling, fpts$, floor, fantasyPoints
        if (props.salary === 'dk') {
            pos = 'pos';
            salary = 'salary';
            ceiling = 'ceiling';
            floor = "floor";
            fpts$ = "fpts$";
            fantasyPoints = "fantasyPoints"
        } else {
            pos = 'fdPos';
            salary = 'fdSalary';
            ceiling = 'fd_ceiling';
            floor = "fd_floor";
            fpts$ = "fd_fpts$";
            fantasyPoints = "fd_fantasyPoints"
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
            if ((user_data[data].Name !== undefined)) {
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
                        nflTeamId: user_data[data].GlobalTeamID,
                        salary: user_data[data].DraftKingsSalary === undefined || user_data[data].DraftKingsSalary === null ? 0 : parseFloat(user_data[data].DraftKingsSalary),
                        fdSalary: user_data[data].FanDuelSalary === undefined || user_data[data].FanDuelSalary === null ? 0 : parseFloat(user_data[data].FanDuelSalary),
                        minus: user_data[data].Minutes === undefined || user_data[data].Minutes === null ? 0 : parseFloat(user_data[data].Minutes),
                        points: user_data[data].Points === undefined || user_data[data].Points === null ? 0 : parseFloat(user_data[data].Points),
                        rebound: user_data[data].Rebounds === undefined || user_data[data].Rebounds === null ? 0 : parseFloat(user_data[data].Rebounds),
                        assists: user_data[data].Assists === undefined || user_data[data].Assists === null ? 0 : parseFloat(user_data[data].Assists),
                        steals: user_data[data].Steals === undefined || user_data[data].Steals === null ? 0 : parseFloat(user_data[data].Steals),
                        blockedShots: user_data[data].BlockedShots === undefined || user_data[data].BlockedShots === null ? 0 : parseFloat(user_data[data].BlockedShots),
                        to: user_data[data].Turnovers === undefined || user_data[data].Turnovers === null ? 0 : parseFloat(user_data[data].Turnovers),
                        fantasyPoints: user_data[data].DK_Proj === undefined || user_data[data].DK_Proj === null ? 0 : parseFloat(user_data[data].DK_Proj),
                        fd_fantasyPoints: user_data[data].FD_Proj === undefined || user_data[data].FD_Proj === null ? 0 : parseFloat(user_data[data].FD_Proj),
                        nfl_dk_fantasyPoints: user_data[data].DK_Proj === undefined || user_data[data].DK_Proj === null ? 0 : parseFloat(user_data[data].DK_Proj),
                        nfl_fd_fantasyPoints: user_data[data].FD_Proj === undefined || user_data[data].FD_Proj === null ? 0 : parseFloat(user_data[data].FD_Proj),
                        // ceiling: parseFloat(user_data[data].DK_Ceil),
                        // fd_ceiling: parseFloat(user_data[data].FD_Ceil),
                        // floor: parseFloat(user_data[data].DK_Floor),
                        // fd_floor: parseFloat(user_data[data].FD_Floor),
                        // fpts$: parseFloat(user_data[data].DK_Value),
                        // fd_fpts$: parseFloat(user_data[data].FD_Value),
                        ceiling: user_data[data].DK_Ceil === undefined || user_data[data].DK_Ceil === null ? 0 : parseFloat(user_data[data].DK_Ceil),
                        fd_ceiling: user_data[data].FD_Ceil === undefined || user_data[data].FD_Ceil === null ? 0 : parseFloat(user_data[data].FD_Ceil),
                        floor: user_data[data].DK_Floor === undefined || user_data[data].DK_Floor === null ? 0 : parseFloat(user_data[data].DK_Floor),
                        fd_floor: user_data[data].FD_Floor === undefined || user_data[data].FD_Floor === null ? 0 : parseFloat(user_data[data].FD_Floor),
                        fpts$: user_data[data].DK_Value === undefined || user_data[data].DK_Value === null ? 0 : parseFloat(user_data[data].DK_Value),
                        fd_fpts$: user_data[data].DK_Value === undefined || user_data[data].DK_Value === null ? 0 : parseFloat(user_data[data].FD_Value),

                        // nflOppId: user_data[data].OpponentID,
                        completion: user_data[data].PassingCompletions === undefined || user_data[data].PassingCompletions === null ? 0 : parseFloat(user_data[data].PassingCompletions),
                        passingattempts: user_data[data].PassingAttempts === undefined || user_data[data].PassingAttempts === null ? 0 : parseFloat(user_data[data].PassingAttempts),
                        passingyards: user_data[data].PassingYards === undefined || user_data[data].PassingYards === null ? 0 : parseFloat(user_data[data].PassingYards),
                        passingtouchdowns: user_data[data].PassingTouchdowns === undefined || user_data[data].PassingTouchdowns === null ? 0 : parseFloat(user_data[data].PassingTouchdowns),
                        rushingattempts: user_data[data].RushingAttempts === undefined || user_data[data].RushingAttempts === null ? 0 : parseFloat(user_data[data].RushingAttempts),
                        rushingyards: user_data[data].RushingYards === undefined || user_data[data].RushingYards === null ? 0 : parseFloat(user_data[data].RushingYards),
                        rushingtouchdowns: user_data[data].RushingTouchdowns === undefined || user_data[data].RushingTouchdowns === null ? 0 : parseFloat(user_data[data].RushingTouchdowns),
                        receptions: user_data[data].Receptions === undefined || user_data[data].Receptions === null ? 0 : parseFloat(user_data[data].Receptions),
                        receivingyards: user_data[data].ReceivingYards === undefined || user_data[data].ReceivingYards === null ? 0 : parseFloat(user_data[data].ReceivingYards),
                        receivingtouchdowns: user_data[data].ReceivingTouchdowns === undefined || user_data[data].ReceivingTouchdowns === null ? 0 : parseFloat(user_data[data].ReceivingTouchdowns),
                        fieldgoalsmade: user_data[data].FieldGoalsMade === undefined || user_data[data].FieldGoalsMade === null ? 0 : parseFloat(user_data[data].FieldGoalsMade),
                        fieldgoalsattempted: user_data[data].FieldGoalsAttempted === undefined || user_data[data].FieldGoalsAttempted === null ? 0 : parseFloat(user_data[data].FieldGoalsAttempted),
                    })
            }

            update_data = false
        }

        if (loader) {
            sleep(3000).then(r => {
                setLoader(false);
            })
        }
    }


    const handleRequestSort = (event, property) => {
            console.error(orderBy, order)
            const isAsc = orderBy === property && order === 'asc';
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(property);
            sessionStorage.setItem("order", isAsc ? 'desc' : 'asc')
            sessionStorage.setItem("orderby", property)
        }
    ;

    const handleSelectAllClick = (event) => {
            if (event.target.checked) {
                const newSelecteds = rows.map((n) => n.name);
                setSelected(newSelecteds);
                return;
            }
            setSelected([]);
        }
    ;

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
        }
    ;


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
                                    salType={props.salary}
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
                                                    <TableCell id={labelId} scope="row" padding="none"
                                                               className={classes.border} style={{
                                                        "text-align-last": "left",
                                                        "padding-left": "25px"
                                                    }}>

                                                        {row.name}
                                                    </TableCell>
                                                    {props.salary === 'dk' ?
                                                        <TableCell align="center"
                                                                   className={classes.border}>{row.pos}  </TableCell> :
                                                        <TableCell align="center"
                                                                   className={classes.border}>{row.fdPos}</TableCell>
                                                    }

                                                    <TableCell align="center" className={classes.border}>
                                                        {nft_header ?
                                                            <div className={`${"NFL" + row.nflTeamId} nfl`}></div> :
                                                            <div className={`${"NBA" + row.teamId}`}></div>
                                                        }
                                                        {row.team}
                                                    </TableCell>
                                                    <TableCell align="center" className={classes.border}>
                                                        {nft_header ?
                                                            <div className={`${"NFL" + row.oopId} nfl`}></div> :
                                                            <div className={`${"NBA" + row.oopId}`}></div>
                                                        }
                                                        {row.oop} </TableCell>
                                                    {props.salary === 'dk' ?
                                                        <TableCell align="center"
                                                                   className={classes.border}>${row.salary} </TableCell> :
                                                        <TableCell align="center"
                                                                   className={classes.border}>${row.fdSalary}  </TableCell>
                                                    }

                                                    {nft_header ?
                                                        (props.inputActive ? <>
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>
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
                                                                    <TableCell align="center"
                                                                               className={classes.border}>{row.minus} </TableCell>
                                                                    <TableCell align="center"
                                                                               className={classes.border}>{row.points} </TableCell>
                                                                    <TableCell align="center"
                                                                               className={classes.border}>{row.rebound} </TableCell>
                                                                    <TableCell align="center"
                                                                               className={classes.border}>{row.assists} </TableCell>
                                                                    <TableCell align="center"
                                                                               className={classes.border}>{row.steals} </TableCell>
                                                                    <TableCell className={classes.border}
                                                                               align="center">{row.blockedShots} </TableCell>
                                                                    <TableCell align="center"
                                                                               className={classes.border}>{row.to}</TableCell>
                                                                </>
                                                        )
                                                    }
                                                    {nft_header ?

                                                        (props.salary === 'dk' ?
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.nfl_dk_fantasyPoints}</TableCell>
                                                            :
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.nfl_fd_fantasyPoints}</TableCell>)

                                                        :
                                                        (props.salary === 'dk' ?
                                                                <TableCell align="center"
                                                                           className={classes.border}>{row.fantasyPoints} </TableCell>
                                                                : <TableCell align="center"
                                                                             className={classes.border}>{row.fd_fantasyPoints} </TableCell>
                                                        )


                                                    }
                                                    {props.salary === 'dk' ?
                                                        <>
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.ceiling} </TableCell>
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.floor} </TableCell>
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.fpts$}</TableCell>
                                                        </> :
                                                        <>
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.fd_ceiling} </TableCell>
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.fd_floor} </TableCell>
                                                            <TableCell align="center"
                                                                       className={classes.border}>{row.fd_fpts$}</TableCell>
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
                        {tableData}
                    </Paper>
                </div>
            }
        </>
    );
}
