import React, {useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';

import ToggleButton from '@material-ui/lab/ToggleButton';

import '../datanavbar/datanavbar.css'
import {toast, ToastContainer} from "react-toastify";

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
        maxHeight:'auto',
        overflow: 'none'
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {

    },
}))(MenuItem);

export default function CustomizedMenus(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [allGameData, setAllGameData] = React.useState([])
    const [updateGameData, setUpdateGameData] = React.useState([])
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(()=>{
        setAllGameData(props.nfl_game_data)
        // let demo_array = allGameData
        for(let i=0; i<allGameData.length; i++){
            allGameData[i]['IsAwayTeamActive']=true
            allGameData[i]['IsHomeTeamActive']=true
            allGameData[i]['IsBothTeamActive']=true
        }
        // sorting function
        allGameData.sort(function(a, b) {
            return a.DateTime - b.DateTime;
        });

    })
    const activeDeactive = (e)=>{

        let awayNameAttribute = e.target.getAttribute("data-awayName")
        let homeNameAttribute = e.target.getAttribute("data-homeName")
        let middleNameAttribute = e.target.getAttribute("data-middleName")

        let leftElement = '';
        let middleElement = '';
        let rightElement = '';
        allGameData.filter(game_id => {
            leftElement = document.getElementById('left'+game_id.Id);
            middleElement = document.getElementById('middle'+game_id.Id);
            rightElement = document.getElementById('right'+game_id.Id);
            if('left'+game_id.Id === awayNameAttribute){
                 game_id['IsAwayTeamActive'] = !game_id.IsAwayTeamActive
                 game_id['IsBothTeamActive'] = game_id.IsAwayTeamActive === game_id.IsHomeTeamActive

                if(leftElement.className === 'left_team active col-md-5 col-sm-5 col-xs-5'){
                    leftElement.className = 'left_team col-md-5 col-sm-5 col-xs-5'
                }else{
                    leftElement.className = 'left_team active col-md-5 col-sm-5 col-xs-5'
                }
                if(leftElement.className === 'left_team active col-md-5 col-sm-5 col-xs-5' && rightElement.className === 'right_team active col-md-5 col-sm-5 col-xs-5'){
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                }else{
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                }

            }
            if('right'+game_id.Id === homeNameAttribute){
                game_id['IsAwayTeamActive'] = !game_id.IsHomeTeamActive
                game_id['IsBothTeamActive'] = game_id.IsAwayTeamActive === game_id.IsHomeTeamActive

                if(rightElement.className === 'right_team active col-md-5 col-sm-5 col-xs-5'){
                    rightElement.className = 'right_team col-md-5 col-sm-5 col-xs-5'
                }else{
                    rightElement.className = 'right_team active col-md-5 col-sm-5 col-xs-5'
                }
                if(leftElement.className === 'left_team active col-md-5 col-sm-5 col-xs-5' && rightElement.className === 'right_team active col-md-5 col-sm-5 col-xs-5'){
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                }else{
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                }
            }
            if('middle'+game_id.Id === middleNameAttribute){
                game_id['IsBothTeamActive'] = !game_id.IsBothTeamActive
                if(middleElement.className === 'middle_team active col-md-2 col-sm-2 col-xs-2'){
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                    leftElement.className = 'left_team col-md-5 col-sm-5 col-xs-5'
                    rightElement.className = 'right_team col-md-5 col-sm-5 col-xs-5'
                }else{
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                    leftElement.className = 'left_team active col-md-5 col-sm-5 col-xs-5'
                    rightElement.className = 'right_team active col-md-5 col-sm-5 col-xs-5'
                }
            }
        });
    }
    const selectAllTeam = () => {
        toast("⭐ All teams Selected...");
        let leftElement = '';
        let middleElement = '';
        let rightElement = '';
        for(let i=0; i<allGameData.length; i++){
            allGameData[i]['IsAwayTeamActive']=true
            allGameData[i]['IsHomeTeamActive']=true
            allGameData[i]['IsBothTeamActive']=true

            leftElement = document.getElementById('left'+allGameData[i].Id);
            middleElement = document.getElementById('middle'+allGameData[i].Id);
            rightElement = document.getElementById('right'+allGameData[i].Id);

            leftElement.className = 'left_team active col-md-5 col-sm-5 col-xs-5'
            rightElement.className = 'right_team active col-md-5 col-sm-5 col-xs-5'
            middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
        }
    }
    const clearAllTeam = () =>{
        toast.error("⭐ Clear All Teams...");
        let leftElement = '';
        let middleElement = '';
        let rightElement = '';
        for(let i=0; i<allGameData.length; i++){
            allGameData[i]['IsAwayTeamActive']=false
            allGameData[i]['IsHomeTeamActive']=false
            allGameData[i]['IsBothTeamActive']=false

            leftElement = document.getElementById('left'+allGameData[i].Id);
            middleElement = document.getElementById('middle'+allGameData[i].Id);
            rightElement = document.getElementById('right'+allGameData[i].Id);

            leftElement.className = 'left_team col-md-5 col-sm-5 col-xs-5'
            rightElement.className = 'right_team col-md-5 col-sm-5 col-xs-5'
            middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
        }
    }
    const applyTeam = () =>{
        props.onSaveGameData(updateGameData)
        // toast.success("⭐ Apply to All Teams...");
    }
    const gameDataInstance = (data) =>{
        setUpdateGameData(data)
    }

    const dropdownMenu = allGameData.map((gameData) => (
        <StyledMenuItem>
            <div className="menu_list_head">
                <div className="team_container row">
                    <div data-awayName={`left${gameData.Id}`} id={`left${gameData.Id}`}  className="left_team active col-md-5 col-sm-5 col-xs-5"  onClick={activeDeactive}>
                        {gameData.AwayTeam}
                    </div>
                    <div data-middleName={`middle${gameData.Id}`} id={`middle${gameData.Id}`}  className="middle_team active  col-md-2 col-sm-2 col-xs-2" onClick={activeDeactive}>@</div>
                    <div data-homeName={`right${gameData.Id}`} id={`right${gameData.Id}`}  className="right_team active  col-md-5 col-sm-5 col-xs-5" onClick={activeDeactive}>
                       {gameData.HomeTeam}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <DetailedAccordion
                            overUnder={gameData.OverUnder}
                            spread={gameData.PointSpread}
                            AwayTeam={gameData.AwayTeam}
                            HomeTeam={gameData.HomeTeam}
                            gameData={allGameData}
                            collapse={props.inputActive}
                            id={gameData.Id}
                            updateGame={gameDataInstance}
                            dateTime={gameData.DateTime}

                        />
                    </div>
                </div>
            </div>

        </StyledMenuItem>

    ))
    return (
            <div>
                <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    className="ad-group-btn btn-primary dropdownBtn"
                >
                    game data
                </Button>

                {allGameData.length>0 ?
                <div className="class_head">
                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <div className="overflow_list">
                    {dropdownMenu}
                    </div>
                    <div className="listFooterContainer">
                        <Button size="small" variant="contained" color="primary" onClick={selectAllTeam}>
                            <ToastContainer
                                position="bottom-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                className='toasterStyle'
                            />
                            All
                        </Button>
                        <Button size="small" variant="contained" color="primary" onClick={clearAllTeam}>
                            <ToastContainer
                                position="bottom-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                className='toasterStyle'
                            />
                            Clear
                        </Button>
                        <Button size="small" variant="contained" color="primary" onClick={applyTeam}>
                            <ToastContainer
                                position="bottom-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                className='toasterStyle'
                            />
                            Apply
                        </Button>
                    </div>
                </StyledMenu>
                </div>
                    : null}
            </div>

    );
}

const useStyles = makeStyles((theme) => ({
    root: {
    },

}));
function DetailedAccordion(props) {
    const classes = useStyles();
    const [updateGameData, setUpdateGameData] = React.useState([])
    const [newGameData, setNewGameData] = React.useState([])

    useEffect(()=>{
        setUpdateGameData(props.gameData)
        console.log(props)

    })

    const winnerAction = (id, is_check, winner, keyName) =>{
        let is_checked = !is_check
        let is_exist = true

        for(let i=0; i< newGameData.length; i++){
            if(newGameData[i].Id === id){
                if(is_checked && keyName === 'winner') {
                newGameData[i]['Winner'] = winner
                }
                if(!is_checked && keyName === 'winner') {
                    newGameData[i]['Winner'] = null
                }
                if(is_checked && keyName === 'leftSpreadHome') {
                    newGameData[i]['PointSpreadHome'] = false
                }
                if(!is_checked && keyName === 'leftSpreadHome') {
                    newGameData[i]['PointSpreadHome'] = null
                }
                if(is_checked && keyName === 'rightSpreadHome') {
                    newGameData[i]['PointSpreadHome'] = true
                }
                if(!is_checked && keyName === 'rightSpreadHome') {
                    newGameData[i]['PointSpreadHome'] = null
                }
                if(is_checked && keyName === 'over') {
                    newGameData[i]['OverTotal'] = true
                }
                if(!is_checked && keyName === 'over') {
                    newGameData[i]['OverTotal'] = null
                }
                if(is_checked && keyName === 'under') {
                    newGameData[i]['OverTotal'] = false
                }
                if(!is_checked && keyName === 'under') {
                    newGameData[i]['OverTotal'] = null
                }

                is_exist = false
                break
            }
        }
        if(is_exist){
            for(let i=0; i< updateGameData.length; i++){
                if(updateGameData[i].Id === id){
                    if(is_checked && keyName === 'winner') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'Winner': winner}, newGameData);
                        is_exist=false
                        break
                    }
                    if(!is_checked && keyName === 'winner') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'Winner': null}, newGameData);
                        is_exist=false
                        break
                    }
                    if(is_checked && keyName === 'leftSpreadHome') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'PointSpreadHome': false}, newGameData);
                        is_exist=false
                        break
                    }
                    if(!is_checked && keyName === 'leftSpreadHome') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'PointSpreadHome': null}, newGameData);
                        is_exist=false
                        break
                    }
                    if(is_checked === true && keyName === 'rightSpreadHome') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'PointSpreadHome': true}, newGameData);
                        is_exist=false
                        break
                    }
                    if(!is_checked === true && keyName === 'rightSpreadHome') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'PointSpreadHome': null}, newGameData);
                        is_exist=false
                        break
                    }

                    if(is_checked === true && keyName === 'over') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'OverTotal': true}, newGameData);
                        is_exist=false
                        break
                    }
                    if(!is_checked === true && keyName === 'over') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'OverTotal': null}, newGameData);
                        is_exist=false
                        break
                    }
                    if(is_checked === true && keyName === 'under') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'OverTotal': false}, newGameData);
                        is_exist=false
                        break
                    }
                    if(!is_checked === true && keyName === 'under') {
                        setNewGameData(newGameData.concat(updateGameData[i]))
                        let data = Object.assign({}, {'OverTotal': null}, newGameData);
                        is_exist=false
                        break
                    }
                }
            }
        }
        props.updateGame(newGameData)
    }

    return (
        <div className={classes.root}>
            <Accordion >
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    // aria-controls="panel1c-content"
                    // id="panel1c-header"
                >
                    <div className="row mr-0">

                        <div className="left_des  col-md-5 col-sm-5 col-xs-5">

                            <span className="">Over/under {props.overUnder}</span>
                        </div>
                        <div className="middle_des  col-md-2 col-sm-2 col-xs-2"></div>
                        <div className="right_des  col-md-5 col-sm-5 col-xs-5">
                            <span className="">car {props.spread}</span>
                        </div>
                    </div>
                </AccordionSummary>
                {props.collapse ?
                    <AccordionDetails>
                        <ul className="collapse_container">
                            <li className="collapse_single text-right">
                                <span className="dateTimeText">
                                    {new Intl.DateTimeFormat(
                                            'en',
                                            {
                                                month: 'long',
                                                day: '2-digit',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric',
                                                hourCycle: 'h11'
                                            }
                                        ).format(new Date(props.dateTime)
                                        )}

                                </span>
                            </li>
                                    <li className="collapse_single">
                                        <span className="text">Winner </span>
                                        <span className="input">
                                            <StandaloneToggleButton
                                                gameData={props.gameData}
                                                spread={props.spread}
                                                TeamName={props.AwayTeam}
                                                HomeTeam={props.HomeTeam}
                                                id={props.id}
                                                onUpdateWinner={winnerAction}
                                                actionKey={'winner'}
                                            />
                                        </span>
                                        <span className="input">
                                            <StandaloneToggleButton
                                                gameData={props.gameData}
                                                spread={props.spread}
                                                TeamName={props.HomeTeam}
                                                id={props.id}
                                                onUpdateWinner={winnerAction}
                                                actionKey={'winner'}
                                            />
                                        </span>
                                    </li>
                                    <li className="collapse_single">
                                        <span className="text">Spread</span>
                                        <span className="input">
                                            <StandaloneToggleButton
                                                gameData={props.gameData}
                                                TeamName={-(props.spread)}
                                                id={props.id}
                                                onUpdateWinner={winnerAction}
                                                actionKey={'spreadHome'}
                                            />
                                        </span>
                                        <span className="input">
                                            <StandaloneToggleButton
                                                gameData={-(props.gameData)}
                                                TeamName={(props.spread)}
                                                id={props.id}
                                                onUpdateWinner={winnerAction}
                                                actionKey={'rightSpreadHome'}
                                            />
                                        </span>
                                    </li>
                                    <li className="collapse_single">
                                        <span className="text">over/under</span>
                                        <span className="input">
                                            <StandaloneToggleButton
                                                gameData={props.gameData}
                                                TeamName={"OVER " + props.overUnder}
                                                id={props.id}
                                                onUpdateWinner={winnerAction}
                                                actionKey={'over'}
                                            />
                                        </span>
                                        <span className="input">
                                            <StandaloneToggleButton
                                                gameData={props.gameData}
                                                TeamName={"UNDER "+props.overUnder}
                                                id={props.id}
                                                onUpdateWinner={winnerAction}
                                                actionKey={'under'}
                                            />
                                        </span>
                                    </li>
                                </ul>
                    </AccordionDetails>
                    : null }
                <Divider />
            </Accordion>
        </div>
    );
}



function StandaloneToggleButton(props) {
    const [selected, setSelected] = React.useState(false);
    const onGameChange = () =>{
            props.onUpdateWinner(props.id, selected, props.TeamName, props.actionKey)

    }

    return (
        <ToggleButton
            value="check"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
            }}
            className={`toggle_btn`}
            id={props.id}
            onClick={onGameChange}
        >
            {props.TeamName}
        </ToggleButton>
    );
}