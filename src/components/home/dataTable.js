import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
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


let  rows = [

]
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
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
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
let headCells =[]

if(nft_header){
    console.log("NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN")
    headCells = [
        { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
        { id: 'pos', numeric: false, disablePadding: false, label: 'pos' },
        { id: 'team', numeric: false, disablePadding: false, label: 'team' },
        { id: 'oop', numeric: false, disablePadding: false, label: 'opp' },
        { id: 'salary', numeric: false, disablePadding: false, label: 'salary' },


        { id: 'completions', numeric: false, disablePadding: true, label: 'Completions' },
        { id: 'attempts', numeric: false, disablePadding: true, label: 'Attempts' },
        { id: 'yards', numeric: false, disablePadding: true, label: 'Yards' },
        { id: 'td', numeric: false, disablePadding: true, label: 'TD' },
        { id: 'rush_attempts', numeric: false, disablePadding: true, label: 'Attempts' },
        { id: 'rush_yards', numeric: false, disablePadding: true, label: 'Yards' },
        { id: 'rush_td', numeric: false, disablePadding: true, label: 'TD' },
        { id: 'receiving_receptions', numeric: false, disablePadding: true, label: 'Receptions' },
        { id: 'receiving_td', numeric: false, disablePadding: true, label: 'TD' },
        { id: 'fgm', numeric: false, disablePadding: true, label: 'fgm' },
        { id: 'fga', numeric: false, disablePadding: true, label: 'fga' },

        { id: 'fpts', numeric: false, disablePadding: false, label: 'fpts' },
        { id: 'ceiling', numeric: false, disablePadding: false, label: 'ceiling' },
        { id: 'floor', numeric: false, disablePadding: false, label: 'floor' },
        { id: 'fpts$', numeric: false, disablePadding: false, label: 'fpts/$1' },


    ];

}
else {
    console.log("55555555555555555555555555555555555555")
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

    ];
}

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
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
            <TableRow className="middle_table_head">
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
    let user_data=props.data
    // console.log(props, 'new array')
    if(props.new_array != null){
        update_data=true
        user_data=props.new_array
    }
    if(props.nfl_player_data.length>0){
        update_data=true
        nft_header=true
        user_data=props.nfl_player_data
        rows=[]
    }
    if(props.data.length>0){
        update_data=true
        user_data=props.data
        rows=[]
        nft_header=false
    }

    // update_data=props.update_data
    if(update_data) {
        for (let data = 0; data < user_data.length; data++) {
            rows.push(
                {name:user_data[data].Name,
                    pos:user_data[data].DraftKingsPosition,
                    fdPos:user_data[data].FanDuelPosition,
                    team:user_data[data].Team,
                    oop:user_data[data].Opponent,
                salary:user_data[data].DraftKingsSalary,
                fdSalary:user_data[data].FanDuelSalary,
                    minus:user_data[data].PlusMinus,
                    points:user_data[data].Points,
                    rebound:user_data[data].Rebounds,
                    assists:user_data[data].Assists,
                    steals:user_data[data].Steals,
                    blockedShots:user_data[data].BlockedShots,
                    to:user_data[data].Turnovers,
                    fantasyPoints:user_data[data].FantasyPoints,
                    ceiling:user_data[data].DK_Ceil,
                    floor:user_data[data].DK_Floor,
                    fpts$:user_data[data].FantasyPointsDraftKings,
                    })
            update_data = false
        }
    }

    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('pos');
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
        user_data=false
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        user_data=false
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
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
                                            <TableCell  id={labelId} scope="row" padding="none">
                                                {row.name}
                                            </TableCell>
                                            {props.salary === 'dk' ?
                                            <TableCell align="center">{row.pos}</TableCell>:
                                                <TableCell align="center">{row.fdPos}</TableCell>
                                            }

                                            <TableCell align="center">{row.team}</TableCell>
                                            <TableCell align="center">{row.oop}</TableCell>
                                            {props.salary === 'dk' ?
                                                <TableCell align="center">${row.salary}  </TableCell> :
                                                <TableCell align="center">${row.fdSalary}  </TableCell>
                                            }

                                            {nft_header ? 'sdfsd' :
                                                (props.inputActive ? <> <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        InputProps={{
                                                            inputProps: {
                                                               min: 0
                                                            }
                                                        }}
                                                        defaultValue={row.minus}
                                                        className="table_input"
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
                                                                />
                                                            </TableCell>

                                                        </>
                                                :
                                                <>
                                                    <TableCell align="center">{row.minus}</TableCell>
                                                    <TableCell align="center">{row.points}</TableCell>
                                                    <TableCell align="center">{row.rebound}</TableCell>
                                                    <TableCell align="center">{row.assists}</TableCell>
                                                    <TableCell align="center">{row.steals}</TableCell>
                                                    <TableCell align="center">{row.blockedShots}</TableCell>
                                                    <TableCell align="center">{row.to}</TableCell>
                                                </>
                                                )
                                            }
                                            <TableCell align="center">{row.fantasyPoints}</TableCell>
                                            <TableCell align="center">{row.ceiling}</TableCell>
                                            <TableCell align="center">{row.floor}</TableCell>
                                            <TableCell align="center">{row.fpts$}</TableCell>
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
    );
}
