import React, {useEffect} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';

import ToggleButton from '@material-ui/lab/ToggleButton';

import '../datanavbar/datanavbar.css'
import TextField from "@material-ui/core/TextField";

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
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
    console.log(props.nfl_game_data)
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
        console.log(props.inputActive,"##############")
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

                if(leftElement.className === 'left_team active col-md-4 col-sm-4 col-xs-4'){
                    leftElement.className = 'left_team col-md-4 col-sm-4 col-xs-4'
                }else{
                    leftElement.className = 'left_team active col-md-4 col-sm-4 col-xs-4'
                }
                if(leftElement.className === 'left_team active col-md-4 col-sm-4 col-xs-4' && rightElement.className === 'right_team active col-md-4 col-sm-4 col-xs-4'){
                    middleElement.className = 'middle_team active'
                }else{
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                }

            }
            if('right'+game_id.Id === homeNameAttribute){
                game_id['IsAwayTeamActive'] = !game_id.IsHomeTeamActive
                game_id['IsBothTeamActive'] = game_id.IsAwayTeamActive === game_id.IsHomeTeamActive

                if(rightElement.className === 'right_team active col-md-4 col-sm-4 col-xs-4'){
                    rightElement.className = 'right_team col-md-4 col-sm-4 col-xs-4'
                }else{
                    rightElement.className = 'right_team active col-md-4 col-sm-4 col-xs-4'
                }
                if(leftElement.className === 'left_team active col-md-4 col-sm-4 col-xs-4' && rightElement.className === 'right_team active col-md-4 col-sm-4 col-xs-4'){
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                }else{
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                }
            }
            if('middle'+game_id.Id === middleNameAttribute){
                game_id['IsBothTeamActive'] = !game_id.IsBothTeamActive
                if(middleElement.className === 'middle_team active col-md-2 col-sm-2 col-xs-2'){
                    middleElement.className = 'middle_team col-md-2 col-sm-2 col-xs-2'
                    leftElement.className = 'left_team col-md-4 col-sm-4 col-xs-4'
                    rightElement.className = 'right_team col-md-4 col-sm-4 col-xs-4'
                }else{
                    middleElement.className = 'middle_team active col-md-2 col-sm-2 col-xs-2'
                    leftElement.className = 'left_team active col-md-4 col-sm-4 col-xs-4'
                    rightElement.className = 'right_team active col-md-4 col-sm-4 col-xs-4'
                }
            }
        });
    }

    const dropdownMenu = allGameData.map((gameData) => (
        <StyledMenuItem>
            <div className="menu_list_head">
                <div className="team_container row mr-0">
                    <div data-awayName={`left${gameData.Id}`} id={`left${gameData.Id}`}  className="left_team active col-md-4 col-sm-4 col-xs-4"  onClick={activeDeactive}>
                        {gameData.AwayTeam}
                    </div>
                    <div data-middleName={`middle${gameData.Id}`} id={`middle${gameData.Id}`}  className="middle_team active  col-md-2 col-sm-2 col-xs-2" onClick={activeDeactive}>@</div>
                    <div data-homeName={`right${gameData.Id}`} id={`right${gameData.Id}`}  className="right_team active  col-md-4 col-sm-4 col-xs-4" onClick={activeDeactive}>
                       {gameData.HomeTeam}
                    </div>
                </div>
                {/*<div className="row mr-0">*/}
                {/*    <div className="left_des  col-md-4 col-sm-4 col-xs-4">*/}
                {/*        <span className="">Over/under {gameData.OverUnder}</span>*/}
                {/*    </div>*/}
                {/*    <div className="middle_des  col-md-2 col-sm-2 col-xs-2"></div>*/}
                {/*    <div className="right_des  col-md-4 col-sm-4 col-xs-4">*/}
                {/*        <span className="">car {gameData.PointSpread}</span>*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className="row">
                    <div className="col-md-12">
                        <DetailedAccordion
                            overUnder={gameData.OverUnder}
                            spread={gameData.PointSpread}
                            AwayTeam={gameData.AwayTeam}
                            HomeTeam={gameData.HomeTeam}
                            gameData={allGameData}
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
            <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {dropdownMenu}
                <div>sdjkasjljia</div>
            </StyledMenu>
        </div>
    );
}




const useStyles = makeStyles((theme) => ({
    root: {
    },

}));


function DetailedAccordion(props) {
    const classes = useStyles();

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
                <AccordionDetails>
                            <ul className="collapse_container">
                                <li className="collapse_single">
                                    <span className="text">Winner </span>
                                    <span className="input">
                                        <StandaloneToggleButton
                                            gameData={props.gameData}
                                            spread={props.spread}
                                            TeamName={props.AwayTeam}
                                            HomeTeam={props.HomeTeam}
                                        />
                                    </span>
                                    <span className="input">
                                        <StandaloneToggleButton
                                            gameData={props.gameData}
                                            spread={props.spread}
                                            TeamName={props.HomeTeam}
                                        />
                                    </span>
                                </li>
                                <li className="collapse_single">
                                    <span className="text">Spread</span>
                                    <span className="input">
                                        <StandaloneToggleButton
                                            gameData={props.gameData}
                                            TeamName={-(props.spread)}
                                        />
                                    </span>
                                    <span className="input">
                                        <StandaloneToggleButton
                                            gameData={props.gameData}
                                            TeamName={-(props.spread)}
                                        />
                                    </span>
                                </li>
                                <li className="collapse_single">
                                    <span className="text">over/under</span>
                                    <span className="input">
                                        <StandaloneToggleButton
                                            gameData={props.gameData}
                                            TeamName={"OVER " + props.overUnder}
                                        />
                                    </span>
                                    <span className="input">
                                        <StandaloneToggleButton
                                            gameData={props.gameData}
                                            TeamName={"UNDER "+props.overUnder}
                                        />
                                    </span>
                                </li>
                            </ul>
                </AccordionDetails>
                <Divider />
            </Accordion>
        </div>
    );
}



function StandaloneToggleButton(props) {
    const [selected, setSelected] = React.useState(false);
    return (
        <ToggleButton
            value="check"
            selected={selected}
            onChange={() => {
                setSelected(!selected);
            }}
            className="toggle_btn"
        >
            {props.TeamName}
        </ToggleButton>
    );
}