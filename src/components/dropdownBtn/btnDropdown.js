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
import {ToggleButtonGroup} from "@material-ui/lab";

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
            if(newGameData.length>0){
                props.onSaveGameData(newGameData)
            }
            else{
                props.onSaveGameData(props.nfl_game_data)
            }
        }
    };
    useEffect(()=>{
        setAllGameData(props.nfl_game_data)
        setUpdateGameData(props.nfl_game_data)
        allGameData.sort(function(a, b) {
            return new Date(a.DateTime) - new Date(b.DateTime);
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

    const saveModifyGameList = (id, winner, keyName) =>{
        let is_exist = true

        for(let i=0; i< newGameData.length; i++){
            if(newGameData[i].Id === id){
                // my code
                newGameData[i][keyName] = winner
                // code ended
                is_exist = true
                break
            }
        }
        if(is_exist){
            for(let i=0; i< updateGameData.length; i++){
                if(updateGameData[i].Id === id){
                    updateGameData[i][keyName]=winner
                    setNewGameData( updateGameData);
                }
            }
        }

    }

    const activeDeactive = (e,teamName='',teamname='')=>{
        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
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

            // clear sub-selections

                if(allGameData[i].Winner !== undefined && allGameData[i].Winner !== null)
                {
                    allGameData[i].Winner=undefined
                    let class1=document.getElementById(allGameData[i].Id+"Winner1").getAttribute("class")
                    let class2=document.getElementById(allGameData[i].Id+"Winner2").getAttribute("class")
                    if(class1.includes("ACTIVE"))
                    {class1=class1.replace(" ACTIVE","");
                        document.getElementById(allGameData[i].Id+"Winner1").setAttribute("class",class1) }
                    if(class2.includes("ACTIVE"))
                    {class2=class2.replace(" ACTIVE","");
                        document.getElementById(allGameData[i].Id+"Winner2").setAttribute("class",class2) }
                }
                if(allGameData[i].OverTotal !== undefined)
                {
                    allGameData[i].OverTotal=undefined
                    let class1=document.getElementById(allGameData[i].Id+"OverTotal1").getAttribute("class")
                    let class2=document.getElementById(allGameData[i].Id+"OverTotal2").getAttribute("class")
                    if(class1.includes("ACTIVE"))
                    {class1=class1.replace(" ACTIVE","");
                        document.getElementById(allGameData[i].Id+"OverTotal1").setAttribute("class",class1) }
                    if(class2.includes("ACTIVE"))
                    {class2=class2.replace(" ACTIVE","");
                        document.getElementById(allGameData[i].Id+"OverTotal2").setAttribute("class",class2) }
                }
                if(allGameData[i].PointSpreadHome !== undefined)
                {
                    allGameData[i].PointSpreadHome=undefined
                    let class1=document.getElementById(allGameData[i].Id+"PointSpreadHome1").getAttribute("class");
                    let class2=document.getElementById(allGameData[i].Id+"PointSpreadHome2").getAttribute("class");
                    if(class1.includes("ACTIVE"))
                    {class1=class1.replace(" ACTIVE","");
                        document.getElementById(allGameData[i].Id+"PointSpreadHome1").setAttribute("class",class1) }
                    if(class2.includes("ACTIVE"))
                    {class2=class2.replace(" ACTIVE","");
                        document.getElementById(allGameData[i].Id+"PointSpreadHome2").setAttribute("class",class2) }
                }

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
                    <div data-awayName={`left${gameData.Id}`} id={`left${gameData.Id}`} awayTeamName={ gameData.AwayTeam }  className={`left_team ${ active }${ props.is_nbaNfl === 'NFL' ? "NFL"+gameData.GlobalAwayTeamID : "NBA"+gameData.AwayTeamID} col-md-5 col-sm-5 col-xs-5`}  onClick={(e)=>{activeDeactive(e,gameData.AwayTeam)}}>
                        {props.is_nbaNfl === 'NFL' ?
                            <div data-awayName={`left${gameData.Id}`} className={`${"NFL"+gameData.GlobalAwayTeamID} nfl`}  />

                            : <div data-awayName={`left${gameData.Id}`} className={`${"NBA"+gameData.AwayTeamID}`} />}
                        {gameData.AwayTeam}
                    </div>
                    <div data-middleName={`middle${gameData.Id}`} id={`middle${gameData.Id}`} awayTeamName={ gameData.AwayTeam } at={"@"} homeTeamName={gameData.HomeTeam}  className="middle_team active  col-md-2 col-sm-2 col-xs-2" onClick={(e)=>{activeDeactive(e,gameData.AwayTeam,gameData.HomeTeam)}}>@</div>
                    <div data-homeName={`right${gameData.Id}`} id={`right${gameData.Id}`} homeTeamName={gameData.HomeTeam} className={`right_team ${ active }${ props.is_nbaNfl === 'NFL' ? "NFL"+gameData.GlobalHomeTeamID : "NBA"+gameData.HomeTeamID}  col-md-5 col-sm-5 col-xs-5`} onClick={(e)=>{activeDeactive(e,gameData.HomeTeam)}}>
                        {props.is_nbaNfl === 'NFL' ?
                            <div data-homeName={`right${gameData.Id}`} className={`${"NFL"+gameData.GlobalHomeTeamID} nfl`} />
                            // <div className={`${gameData.HomeTeam} nfl NYJ`}></div>
                            : <div data-homeName={`right${gameData.Id}`} className={`${"NBA"+gameData.HomeTeamID}`} />}

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
                            nflData={props.nfl_game_data}
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

    useEffect(()=>{
        if(props.nflData !== undefined) {
            for (let i = 0; i < props.nflData.length; i++) {
                let x = props.nflData[i].Id
                if (props.nflData[i].Winner === props.nflData[i].HomeTeam) {
                    let classs = document.getElementById(x + "Winner2").getAttribute("class")
                    if(!classs.includes("ACTIVE")){
                        document.getElementById(x + "Winner2").setAttribute("class", classs + " ACTIVE")
                    }
                } else if (props.nflData[i].Winner === props.nflData[i].AwayTeam) {
                    let classs = document.getElementById(x + "Winner1").getAttribute("class")
                    if(!classs.includes("ACTIVE")){
                        document.getElementById(x + "Winner1").setAttribute("class", classs + " ACTIVE")
                    }
                }
                if (props.nflData[i].PointSpreadHome === false) {
                    let classs = document.getElementById(x + "PointSpreadHome1").getAttribute("class")
                    if(!classs.includes("ACTIVE")) {
                        document.getElementById(x + "PointSpreadHome1").setAttribute("class", classs + " ACTIVE")
                    }
                } else if (props.nflData[i].PointSpreadHome === true) {
                    let classs = document.getElementById(x + "PointSpreadHome2").getAttribute("class")
                    if (!classs.includes("ACTIVE")) {
                        document.getElementById(x + "PointSpreadHome2").setAttribute("class", classs + " ACTIVE")
                    }
                }
                if (props.nflData[i].OverTotal === true) {
                    let classs = document.getElementById(x + "OverTotal1").getAttribute("class")
                    if (!classs.includes("ACTIVE")) {
                        document.getElementById(x + "OverTotal1").setAttribute("class", classs + " ACTIVE")
                    }
                }
                else if (props.nflData[i].OverTotal === false) {
                    let classs = document.getElementById(x + "OverTotal2").getAttribute("class")
                    if (!classs.includes("ACTIVE")) {
                        document.getElementById(x + "OverTotal2").setAttribute("class", classs + " ACTIVE")
                    }
                }
            }
        }
    })

    function fff(id, name, key , eleId)
    {
        let xx=document.getElementById(eleId)
        let x,eleId2
        if(eleId.includes(key+'1'))
        {
            eleId2=id+key+"2"
        }
        else if(eleId.includes(key+'2'))
        {
            eleId2=id+key+"1"
        }
        x=document.getElementById(eleId2)                         // get another tag
        let className  = xx.getAttribute("class")     // saving class of tag
        let className2 = x.getAttribute("class" )
        // saving class of tag2
        if(className.includes("ACTIVE"))
        {
            className=className.replace(" ACTIVE","")
            if(className2.includes("ACTIVE"))
            {className2=className2.replace(" ACTIVE","");}
            xx.setAttribute("class", className);
            x.setAttribute("class", className2);
            name=null
        }
        else
        {
            if(className2.includes("ACTIVE"))
            {className2 = className2.replace(" ACTIVE","");}
            xx.setAttribute("class", className+" ACTIVE");
            x.setAttribute("class", className2);
        }
        props.saveModifyGameList(id, name, key)
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
                            <div className="middle_des  col-md-2 col-sm-2 col-xs-2"/>
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
                            <div className="middle_des  col-md-2 col-sm-2 col-xs-2"/>
                            <div className="right_des  col-md-5 col-sm-5 col-xs-5">
                                <span className="text-uppercase">{props.HomeTeam}  {props.spread>0 ? "+"+props.spread:props.spread}</span>
                            </div>
                        </div>
                    </div>
                </AccordionDetails>
                }

                    <AccordionDetails>
                        <ul className="collapse_container">
                            {props.collapse ?
                                <>
                                    <li className="collapse_single">
                                        <span className="text">Winner </span>
                                        <div className={"gameDataButG"}>
                                            <center>
                                            <span className={`gameDataBut`} id={props.id+"Winner1"} onClick={()=>{fff( props.id, props.AwayTeam,"Winner" , props.id+"Winner1")}}> {props.AwayTeam} </span>
                                            <span className={`gameDataButt`} id={props.id+"Winner2"} onClick={()=>{fff( props.id, props.HomeTeam,"Winner" , props.id+"Winner2")}}> {props.HomeTeam} </span>
                                            </center>
                                        </div>
                                    </li>
                                    <li className="collapse_single">
                                        <span className="text">Spread</span>

                                        <div className={"gameDataButG"}>
                                            <center>
                                            <span className={`gameDataBut`} id={props.id+"PointSpreadHome1"} onClick={()=>{fff( props.id, false,"PointSpreadHome" , props.id+"PointSpreadHome1")}}> { (-1*props.spread)>0 ? "+"+(-1*props.spread) : (-1*props.spread) } </span>
                                            <span className={`gameDataButt`} id={props.id+"PointSpreadHome2"} onClick={()=>{fff( props.id, true,"PointSpreadHome" , props.id+"PointSpreadHome2")}}> { props.spread>0 ? "+"+( props.spread) : props.spread} </span>
                                        </center>
                                        </div>
                                    </li>
                                    <li className="collapse_single">
                                        <span className="text">over/under</span>
                                        <div className={"gameDataButG"}>
                                            <center>
                                            <span className={`gameDataBut`} id={props.id+"OverTotal1"} style={{padding: "6px 6px"}} onClick={()=>{fff( props.id, true,"OverTotal" , props.id+"OverTotal1")}}> {"OVER " + parseFloat(props.overUnder)} </span>
                                            <span className={`gameDataButt`} id={props.id+"OverTotal2"} style={{padding: "6px 1px"}} onClick={()=>{fff( props.id, false,"OverTotal" , props.id+"OverTotal2")}}> {"UNDER " + parseFloat(props.overUnder)} </span>
                                            </center>
                                        </div>
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
    const handleChange = (event) => {
        setSelected(!selected)
    }
    const onGameChange = (e) =>{
        if(e.target.getAttribute('away')){
            console.log(e.target.getAttribute('away'))
        }
        if(e.target.getAttribute('home')){
            console.log(e.target.getAttribute('home'))
        }
    }

    return (
        <>
            <ToggleButtonGroup
                    onChange={handleChange}
                    exclusive
                >
        <ToggleButton
            selected={selected}
            onChange={handleChange}
            className={`toggle_btn`}
            id={props.id}
            onClick={onGameChange}
            away={props.TeamName}
        >
            {props.TeamName>0 ? "+"+props.TeamName:props.TeamName}
        </ToggleButton>

        <ToggleButton
            value="check"
            selected={selected}
            onChange={handleChange}
            className={`toggle_btn`}
            id={props.id}
            onClick={onGameChange}
            home={props.HomeTeam}
        >
            {props.HomeTeam>0 ? "+"+props.HomeTeam:props.HomeTeam}
        </ToggleButton>
            </ToggleButtonGroup>
    </>
    );
}