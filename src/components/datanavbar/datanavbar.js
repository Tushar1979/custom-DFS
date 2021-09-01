import React from 'react'
import './datanavbar.css'
import btn_img1 from '../../images/btn-img1.png'
import btn_img2 from '../../images/btn-logo2.png'
import EnhancedTableHead from "../home/dataTable";
import {Input} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import API from '../../networking/api'
import Loader from "../../loader/loader"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import CustomizedMenus from "../dropdownBtn/btnDropdown"

let filter_list = []
let pgActive = false
let sgActive = false
let sfActive = false
let pfActive = false
let cActive = false
let update_salary = 'dk'
class DataNavBar extends React.Component {

    api = new API()
    constructor(props) {
        super(props);
        this.state =
            {
                players_data:[
                ],
                nfl_player_data: [],
                game_data:[],
                inputActive: false,
                loader:false,
                pgActive:false,
                filter_player:null,
                filter_key:null,
                filter: "",
                salary: 'dk',
                update_data:true,
                search_player_data: []
            }

        this.myData = this.myData.bind(this)
        this.customDfs = this.customDfs.bind(this)
        this.getCustomDfsData = this.getCustomDfsData.bind(this)
        this.pgFilters = this.pgFilters.bind(this)
        this.sgFilters = this.sgFilters.bind(this)
        this.sfFilters = this.sfFilters.bind(this)
        this.pfFilters = this.pfFilters.bind(this)
        this.cFilters = this.cFilters.bind(this)
        this.removeArray = this.removeArray.bind(this)
        this.filterObj = this.filterObj.bind(this)
        this.allClearFilter = this.allClearFilter.bind(this)
        this.resetData = this.resetData.bind(this)
        this.handleChange = this.handleChange.bind(this)


    }
    componentDidMount() {
        this.getCustomDfsData({user:{id:'Master'}, sportView:"NBA"});
    }
    componentDidUpdate(prevProps) {
        if (this.props.triggerChildFunc !== prevProps.triggerChildFunc) {
            this.onParentTrigger(this.props.triggerChildFunc[0]);
            // console.log(this.props.triggerChildFunc, "$$$$$$$$$$$")
            if(this.props.triggerChildFunc[0].sportView === 'NFL'){
                this.setState({filter_player: null})
            }
            if(this.props.triggerChildFunc[0].sportView === 'NBA'){
                this.setState({filter_player: null})
            }
        }
    }
    onParentTrigger(data) {
        this.getCustomDfsData(data)

        // Let's call the passed variable from parent if it's a function
        if (this.props.triggerChildFunc && {}.toString.call(this.props.triggerChildFunc) === '[object Function]') {
            this.props.triggerChildFunc();
        }
    }

    myData(){
        toast("⭐ Populating fields...");
        this.setState({
            inputActive:true
        })
    }
    customDfs(){
        toast("⭐ Populating fields...");
        this.setState({
            inputActive:false
        })
    }


    //api calling

    getCustomDfsData(data){
        this.setState({loader:true})
        this.setState({update_data:true})
        // let url = '2019-MAY-30?key=11806b0dab30479187ccb5b3d0ca58c6'
        let payload = {
            data:data
        }
        // player stats api calling
        let url = 'https://o2ygn3a3h3.execute-api.us-east-2.amazonaws.com/Prod/get-player-stats'
        this.api.GetApi(url, payload)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    if(data.sportView === "NBA"){
                        this.setState({players_data: response_data.body})
                        this.setState({search_player_data: response_data.body})
                        this.setState({nfl_player_data:[]})
                    }
                    if(data.sportView === "NFL"){
                        this.setState({nfl_player_data: response_data.body})
                        this.setState({search_player_data: response_data.body})
                        this.setState({players_data: []})
                    }
                    this.setState({loader:false})
                    // console.log('+++++----++++', response_data.body)
                } else if (res.request.status === 401) {
                    console.log("login")
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })


    //    game data api calling
        let game_url= 'https://o2ygn3a3h3.execute-api.us-east-2.amazonaws.com/Prod/get-game-data'
        this.api.GetApi(game_url, payload)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    this.setState({game_data: response_data.body})
                    this.setState({loader:false})
                    // console.log('+++++----++++', response_data.body)
                } else if (res.request.status === 401) {
                    console.log("login")
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    removeArray(arrOriginal, elementToRemove){
        return arrOriginal.filter(function(el){return el !== elementToRemove});
    }

    filterObj(keyList){
        let newArray = []
        let pgArray = []
        let sgArray = []
        let sfArray = []
        let pfArray = []
        let cArray = []
        let player_obj= {
            'players':this.state.players_data
        }
        for(let i = 0; i<keyList.length; i++){
            if(keyList[i] === 'pg'){
                 pgArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'PG' || el.DraftKingsPosition === 'pg'  ;
                }));
            } if(keyList[i] === 'sg'){
                 sgArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'sg' || el.DraftKingsPosition === 'sg'  ;
                }));
            } if(keyList[i] === 'sf'){
                 sfArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'SF' || el.DraftKingsPosition === 'sf'  ;
                }));
            } if(keyList[i] === 'pf'){
                 pfArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'PF' || el.DraftKingsPosition === 'pf'  ;
                }));
            } if(keyList[i] === 'c'){
                 cArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'C' || el.DraftKingsPosition === 'c'  ;
                }));
            }
        }

        newArray = newArray.concat(pgArray, sgArray,sfArray, pfArray, cArray);
        return newArray
    }

    pgFilters(){
        pgActive = !pgActive
        if(pgActive){
            filter_list.push('pg')
        }
        if(!pgActive) {
            filter_list=this.removeArray(filter_list, 'pg');
        }
        let filter_data = this.filterObj(filter_list)
        this.setState({filter_player:filter_data})

    }

    sgFilters(){
        sgActive = !sgActive
        if(sgActive){
            filter_list.push('sg')
        }
        if(!sgActive) {
            filter_list=this.removeArray(filter_list, 'sg');
        }
        let filter_data = this.filterObj(filter_list)
        this.setState({filter_player:filter_data})
    }

    sfFilters(){
        sfActive = !sfActive
        if(sfActive){
            filter_list.push('sf')
        }
        if(!sfActive) {
            filter_list=this.removeArray(filter_list, 'sf');
        }
        let filter_data = this.filterObj(filter_list)
        this.setState({filter_player:filter_data})
    }
    pfFilters(){
        pfActive = !pfActive
        if(pfActive){
            filter_list.push('pf')
        }
        if(!pfActive) {
            filter_list=this.removeArray(filter_list, 'pf');
        }
        let filter_data = this.filterObj(filter_list)
        this.setState({filter_player:filter_data})

    }
    cFilters(){
        cActive = !cActive
        if(cActive){
            filter_list.push('c')
        }
        if(!cActive) {
            filter_list=this.removeArray(filter_list, 'c');
        }
        let filter_data = this.filterObj(filter_list)
        this.setState({filter_player:filter_data})
    }

    allClearFilter(){
        this.setState({filter_player:this.state.players_data})
    }
    resetData(){
        this.allClearFilter()
    }
    handleChange (event) {
        this.setState({ filter: event.target.value });
        let searching_data = this.state.search_player_data
        function filterByValue(searching_data, term) {
            let ans = searching_data.filter(function(v,i) {
                if(v.Name.toLowerCase().indexOf(term) >=0) {
                    return true;
                } else {
                    return false
                };
            });
            return ans
        }
        let search_filter = filterByValue(searching_data, event.target.value);
        this.setState({filter_player:search_filter})


    };
    dkSalary = event => {
        this.setState({salary:'dk'})
    }
    fdSalary = event => {
        this.setState({salary:'fd'})
    }

    render() {
        // if(this.state.loader){
        //     return <Loader/>
        // }
        // else {
            return (
                <>
                    <div className="container-fluid">
                        <div className="group-buttons">
                            <div className="common-button">
                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label className="btn btn-primary active ad-group-btn">
                                        <input type="radio" name="options" autoComplete="off" checked
                                               onClick={this.customDfs}/>
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
                                        <span className="btn-text">CustomDFS Data</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn">
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
                                        <input type="radio" name="options" autoComplete="off" onClick={this.myData}/>
                                        <span className="btn-text">My Data</span>
                                    </label>
                                </div>
                            </div>
                            <div className="common-button">
                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label className="btn btn-primary active ad-group-btn">
                                        <input type="radio" name="options" autoComplete="off" checked onClick={this.dkSalary}/>
                                        <span className="btn-img"> <img src={btn_img2} className="btn-img-logo"/></span>
                                        <span className="btn-text"> DK</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn">
                                        <input type="radio" name="options" autoComplete="off" onClick={this.fdSalary}/>
                                        <span className="btn-img"> <img src={btn_img1} className="btn-img-logo"/></span>
                                        <span className="btn-text"> FD</span>
                                    </label>
                                </div>
                            </div>
                            <div className="common-button">

                                <CustomizedMenus
                                    nfl_game_data={this.state.game_data}
                                    inputActive={this.state.inputActive}
                                />
                            </div>
                            <div className="common-button multiple-btn">
                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label className="btn btn-primary active ad-group-btn" onClick={this.allClearFilter}>
                                        {/*<input type="radio" name="options" autoComplete="off" checked/>*/}
                                        <span className="btn-text"> All</span>
                                    </label>
                                    <label className="btn btn-primary  ad-group-btn" onClick={this.allClearFilter}>
                                        {/*<input type="radio" name="options" autoComplete="off" checked/>*/}
                                        <span className="btn-text"> Clear</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn" onClick={this.pgFilters}>
                                        {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                        <span className="btn-text"> pg</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn" onClick={this.sgFilters}>
                                        {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                        <span className="btn-text"> sg</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn" onClick={this.sfFilters}>
                                        {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                        <span className="btn-text" > sf</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn" onClick={this.pfFilters}>
                                        {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                        <span className="btn-text"> pf</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn" onClick={this.cFilters}>
                                        {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                        <span className="btn-text"> c</span>
                                    </label>
                                </div>
                            </div>

                            <div className="common-button">
                                <TextField id="outlined-search" label="Search Player" className="search_input"
                                           type="search" variant="outlined" onChange={this.handleChange}/>
                            </div>
                            <div className="common-button">
                                {/*<label className="btn btn-primary ad-group-btn">*/}
                                    {/*<input type="file" className="ad-group-btn"/>*/}
                                    {/*<span className="btn-text">Export</span>*/}

                                    <ReactHTMLTableToExcel
                                        className="btn btn-primary active ad-group-btn"
                                        table="data_table"
                                        filename="ReportExcel"
                                        sheet="Sheet"
                                        buttonText="Export" />
                                {/*</label>*/}
                            </div>
                            <div className="common-button">
                                <label className="btn btn-primary active ad-group-btn"onClick={this.resetData}>
                                    <span className="btn-text">Reset Data</span>
                                </label>
                            </div>
                            <div className="common-button">
                                <label className="btn btn-primary active ad-group-btn" >
                                    <span className="btn-text">Save</span>
                                </label>
                            </div>
                            <div className="common-button">
                                <label className="btn btn-danger active ad-group-btn">
                                    <span className="btn-text">Simulate</span>
                                </label>
                            </div>
                        </div>

                    </div>
                    <div className="container-fluid">
                        <EnhancedTableHead
                            salary={this.state.salary}
                            filterKey={this.state.filter}
                            data={this.state.players_data}
                            inputActive={this.state.inputActive}
                            new_array={this.state.filter_player}
                            update_data={this.state.update_data}
                            nfl_player_data={this.state.nfl_player_data}
                        />
                    </div>
                </>
            )
        // }
    }
}
export default DataNavBar