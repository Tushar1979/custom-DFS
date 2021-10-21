import React, {useEffect, useState} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ToggleButton from '@material-ui/lab/ToggleButton';

import '../home/style.css'
import '../datanavbar/datanavbar.css'
import {toast} from "react-toastify";

const active='active'
var aaa=''
let set = new Set()
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [allGameData, setAllGameData] = React.useState([])
    const [updateGameData, setUpdateGameData] = React.useState([])

    let [newGameData, setNewGameData] = React.useState([])
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        if(props.inputActive) {
            props.onSaveGameData(newGameData)
        }
    };
    useEffect(()=>{
        setAllGameData(props.nfl_game_data)
        setUpdateGameData(props.nfl_game_data)
        allGameData.sort(function(a, b) {
            console.log(new Date(b.DateTime) - new Date(a.DateTime))
            return new Date(b.DateTime) - new Date(a.DateTime);
        });

    })
    useEffect(() => {
        for(let i=0;i<props.nfl_game_data.length;i++)
        {
            set.add(props.nfl_game_data[i].AwayTeam)
            set.add(props.nfl_game_data[i].HomeTeam)
        }
    }, props.nfl_game_data)
    let [disable,setDisable] = useState(false)

    const saveModifyGameList = (id, is_check, winner, keyName) =>{
        let is_exist = true
        let is_checked = !is_check
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
                        let listData = updateGameData[i]
                        listData['Winner'] = 'winner'
                        setNewGameData(newGameData => newGameData.concat(listData));
                        is_exist=false
                        break
                    }
                    if(!is_checked && keyName === 'winner') {
                        let listData = updateGameData[i]
                        listData['Winner'] = null
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                    if(is_checked && keyName === 'leftSpreadHome') {
                        let listData = updateGameData[i]
                        listData['PointSpreadHome'] = false
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                    if(!is_checked && keyName === 'leftSpreadHome') {
                        let listData = updateGameData[i]
                        listData['PointSpreadHome'] = null
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                    if(is_checked && keyName === 'rightSpreadHome') {
                        let listData = updateGameData[i]
                        listData['PointSpreadHome'] = true
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                    if(!is_checked && keyName === 'rightSpreadHome') {
                        let listData = updateGameData[i]
                        listData['PointSpreadHome'] = null
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }

                    if(is_checked && keyName === 'over') {
                        let listData = updateGameData[i]
                        listData['OverTotal'] = true
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                    if(!is_checked && keyName === 'over') {
                        let listData = updateGameData[i]
                        listData['OverTotal'] = null
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                    if(is_checked && keyName === 'under') {
                        let listData = updateGameData[i]
                        listData['OverTotal'] = false
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                    if(!is_checked && keyName === 'under') {
                        let listData = updateGameData[i]
                        listData['OverTotal'] = null
                        setNewGameData(newGameData.concat(listData))
                        is_exist=false
                        break
                    }
                }
            }
        }
    }

    const activeDeactive = (e,teamName='',teamname='')=>{
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
                if(leftElement.className.includes("active")){
                    aaa=leftElement.className; set.delete(teamName)
                    leftElement.className=aaa.replace("active",'hover')
                }else{
                    aaa=leftElement.className; set.add(teamName)
                    leftElement.className=aaa.replace("hover",'active')
                }
                if(leftElement.className.includes("active") && rightElement.className.includes("active")){
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                }else{
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                }
            }
            if('right'+game_id.Id === homeNameAttribute){
                if(rightElement.className.includes("active")){
                    aaa=rightElement.className; set.delete(teamName)
                    rightElement.className=aaa.replace("active",'hover')
                }else{
                    aaa=rightElement.className; set.add(teamName)
                    rightElement.className=aaa.replace("hover",'active')
                }
                if(leftElement.className.includes("active") && rightElement.className.includes("active")){
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                }else{
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                }
            }
            if('middle'+game_id.Id === middleNameAttribute) {
                if (middleElement.className === 'middle_team active col-md-2 col-sm-2 col-xs-2') {
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                    aaa = leftElement.className ; set.delete(teamName) ; set.delete(teamname)
                    leftElement.className = aaa.replace("active", 'hover')
                    aaa = rightElement.className
                    rightElement.className = aaa.replace("active", 'hover')
                }
                else {
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                    aaa = leftElement.className ; set.add(teamName) ; set.add(teamname)
                    leftElement.className = aaa.replace("hover", 'active')
                    aaa = rightElement.className
                    rightElement.className = aaa.replace("hover", 'active')
                }
            }
        });
        if(set.size>0)
        {setDisable(false)}
        else
        {setDisable(true)}
    }

    const selectAllTeam = () => {
        set = new Set()
        toast("⭐ All teams Selected...");
        let leftElement = '';
        let middleElement = '';
        let rightElement = '';
        for(let i=0; i<allGameData.length; i++){

            set.add(allGameData[i].AwayTeam)
            set.add(allGameData[i].HomeTeam)
            leftElement = document.getElementById('left'+allGameData[i].Id);
            middleElement = document.getElementById('middle'+allGameData[i].Id);
            rightElement = document.getElementById('right'+allGameData[i].Id);

            aaa = leftElement.className
            leftElement.className = aaa.replace("hover", 'active')
            aaa = rightElement.className
            rightElement.className = aaa.replace("hover", 'active')
            middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
        }
        if(set.size>0)
        {setDisable(false)}
        else
        {setDisable(true)}
    }
    const clearAllTeam = () =>{
        set.clear()
        toast.error("⭐ Clear All Teams...");
        let leftElement = '';
        let middleElement = '';
        let rightElement = '';
        for(let i=0; i<allGameData.length; i++){

            leftElement = document.getElementById('left'+allGameData[i].Id);
            middleElement = document.getElementById('middle'+allGameData[i].Id);
            rightElement = document.getElementById('right'+allGameData[i].Id);

            aaa = leftElement.className
            leftElement.className = aaa.replace("active", 'hover')
            aaa = rightElement.className
            rightElement.className = aaa.replace("active", 'hover')
            middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
        }
        if(set.size>0)
        {setDisable(false);}
        else
        {setDisable(true);}
    }
    const applyTeam = () =>{
        toast.success("⭐ Apply to All Teams...");
        sessionStorage.setItem('pageReset','true0')
        props.setData(set)
    }

    const gameDataInstance = (data) =>{
        setUpdateGameData(data)
    }

    const dropdownMenu = allGameData.map((gameData) => (
        <StyledMenuItem>
            <div className="menu_list_head">
                <div className="team_container row">
                    <div data-awayName={`left${gameData.Id}`} id={`left${gameData.Id}`} awayTeamName={ gameData.AwayTeam }  className={`left_team ${gameData.AwayTeam.length>0 ? active+gameData.AwayTeam : "active"} col-md-5 col-sm-5 col-xs-5`}  onClick={(e)=>{activeDeactive(e,gameData.AwayTeam)}}>
                        {props.is_nbaNfl === 'NFL' ?
                            <div className={`${gameData.AwayTeam} nfl CAR`}></div>
                            : <div className={`${gameData.AwayTeam}`}></div>}
                        {gameData.AwayTeam}
                    </div>
                    <div data-middleName={`middle${gameData.Id}`} id={`middle${gameData.Id}`} awayTeamName={ gameData.AwayTeam } at={"@"} homeTeamName={gameData.HomeTeam}  className="middle_team active  col-md-2 col-sm-2 col-xs-2" onClick={(e)=>{activeDeactive(e,gameData.AwayTeam,gameData.HomeTeam)}}>@</div>
                    <div data-homeName={`right${gameData.Id}`} id={`right${gameData.Id}`} homeTeamName={gameData.HomeTeam} className={`right_team ${gameData.AwayTeam.length>0 ? active+gameData.HomeTeam : "active"} col-md-5 col-sm-5 col-xs-5`} onClick={(e)=>{activeDeactive(e,gameData.HomeTeam)}}>
                        {props.is_nbaNfl === 'NFL' ?
                            <div className={`${gameData.HomeTeam} nfl NYJ`}></div>
                            : <div className={`${gameData.HomeTeam}`}></div>}

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
                            saveModifyGameList={saveModifyGameList}
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
                            All
                        </Button>
                        <Button size="small" variant="contained" color="primary" onClick={clearAllTeam}>
                            Clear
                        </Button>
                        {/*this button is used for diasble apply when nothing is selected*/}
                        {/*<Button size="small" variant="contained" color="primary" onClick={applyTeam} disabled={disable} >*/}
                        {/*    Apply*/}
                        {/*</Button>*/}
                        <Button size="small" variant="contained" color="primary" onClick={applyTeam}>
                            Apply
                        </Button>
                    </div>
                </StyledMenu>
                </div>
            </div>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
    },

}));
function DetailedAccordion(props) {
    const classes = useStyles();

    const winnerAction = (id, is_check, winner, keyName) =>{
        props.saveModifyGameList(id, is_check, winner, keyName)
    }

    return (
        <div className={classes.root}>
            <Accordion>
                { props.collapse ? <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header">
                    <div>
                        <div className="row mr-0 ">
                            <div className="collapse_single text-right">
                            <span className="dateTimeText">
                                        {props.dateTime ?
                                            (new Intl.DateTimeFormat(
                                                'en',
                                                {
                                                    weekday:'long',
                                                    month: 'long',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hourCycle: 'h11'
                                                }
                                            ).format(new Date(props.dateTime)
                                            ))
                                            : null}
                                    </span>
                            </div>
                        </div>
                        <div className="row mr-0">
                            <div className="left_des  col-md-5 col-sm-5 col-xs-5">
                                <span className="">Over/under {props.overUnder}</span>
                            </div>
                            <div className="middle_des  col-md-2 col-sm-2 col-xs-2"></div>
                            <div className="right_des  col-md-5 col-sm-5 col-xs-5">
                                <span className="text-uppercase">{props.HomeTeam}  {props.spread>0 ? "+"+props.spread:props.spread}</span>
                            </div>
                        </div>
                    </div>
                </AccordionSummary>:<AccordionDetails>
                    <div>
                        <div className="row mr-0 ">
                            <div className="collapse_single text-right">
                            <span className="dateTimeText">
                                        {props.dateTime ?
                                            (new Intl.DateTimeFormat(
                                                'en',
                                                {
                                                    weekday:'long',
                                                    month: 'long',
                                                    day: '2-digit',
                                                    year: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hourCycle: 'h11'
                                                }
                                            ).format(new Date(props.dateTime)
                                            ))
                                            : null}
                                    </span>
                            </div>
                        </div>
                        <div className="row mr-0">
                            <div className="left_des  col-md-5 col-sm-5 col-xs-5">
                                <span className="">Over/under {props.overUnder}</span>
                            </div>
                            <div className="middle_des  col-md-2 col-sm-2 col-xs-2"></div>
                            <div className="right_des  col-md-5 col-sm-5 col-xs-5">
                                <span className="text-uppercase">{props.HomeTeam}  {props.spread>0 ? "+"+props.spread:props.spread}</span>
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
                }


                {/*<AccordionSummary*/}
                {/*    expandIcon={<ExpandMoreIcon />}*/}
                {/*    aria-controls="panel1c-content"*/}
                {/*    id="panel1c-header"*/}
                {/*>*/}
                {/*    <div className="row mr-0">*/}
                {/*        <div className="left_des  col-md-5 col-sm-5 col-xs-5">*/}
                {/*            <span className="">Over/under {props.overUnder}</span>*/}
                {/*        </div>*/}
                {/*        <div className="middle_des  col-md-2 col-sm-2 col-xs-2"></div>*/}
                {/*        <div className="right_des  col-md-5 col-sm-5 col-xs-5">*/}
                {/*            <span className="text-uppercase">{props.HomeTeam}  {props.spread>0 ? "+"+props.spread:props.spread}</span>*/}
                {/*        </div>*/}
                {/*    </div>*/}


                {/*</AccordionSummary>*/}

                    <AccordionDetails>
                        <ul className="collapse_container">
                            {props.collapse ?
                                <>
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
                                </>
                            : null }
                                </ul>
                    </AccordionDetails>
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
            {props.TeamName>0 ? "+"+props.TeamName:props.TeamName}
        </ToggleButton>
    );
}