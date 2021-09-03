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
let nflFilter_list = []
let pgActive = false
let sgActive = false
let sfActive = false
let pfActive = false
let cActive = false

let qbActive = false
let rbActive = false
let wrActive = false
let teActive = false
let kActive = false
let dstActive = false
let update_salary = 'dk'
class DataNavBar extends React.Component {

    api = new API()
    constructor(props) {
        super(props);
        console.log(props)
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
                search_player_data: [],
                allBtn:false,
                allClearBtn:false,
                pgBtn:false,
                sgBtn:false,
                sfBtn:false,
                pfBtn:false,
                cBtn:false,
                nflAction:false,
                qbBtn:false,
                rbBtn:false,
                wrBtn:false,
                teBtn:false,
                kBtn:false,
                dstBtn:false,
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
        this.allSelectFilter = this.allSelectFilter.bind(this)
        this.resetData = this.resetData.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.nflFilterObj = this.nflFilterObj.bind(this)


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
                this.setState({nflAction: true})
            }
            if(this.props.triggerChildFunc[0].sportView === 'NBA'){
                this.setState({filter_player: null})
                this.setState({nflAction: false})
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
                    // console.log('+++++----++++', response_data.body)
                } else if (res.request.status === 401) {
                    console.log("login")
                    this.setState({loader:false})
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
                    this.setState({loader:false})
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


    nflFilterObj(keyList){
        let newArray = []
        let qbArray = []
        let rbArray = []
        let wrArray = []
        let teArray = []
        let kArray = []
        let dstArray = []
        let player_obj
            player_obj= {
                'players':this.state.nfl_player_data
            }
        for(let i = 0; i<keyList.length; i++){
            if(keyList[i] === 'qb'){
                qbArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'QB' || el.DraftKingsPosition === 'qb'  ;
                }));
            } if(keyList[i] === 'rb'){
                rbArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'RB' || el.DraftKingsPosition === 'rb'  ;
                }));
            } if(keyList[i] === 'wr'){
                wrArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'WR' || el.DraftKingsPosition === 'wr'  ;
                }));
            } if(keyList[i] === 'te'){
                teArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'TE' || el.DraftKingsPosition === 'te'  ;
                }));
            } if(keyList[i] === 'k'){
                kArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'K' || el.DraftKingsPosition === 'k'  ;
                }));
            } if(keyList[i] === 'dst'){
                dstArray = (player_obj.players.filter(function (el){
                    return el.DraftKingsPosition === 'DST' || el.DraftKingsPosition === 'dst'  ;
                }));
            }
        }

        newArray = newArray.concat(qbArray, rbArray,wrArray, teArray, kArray, dstArray);
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
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.players_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            pgBtn:!this.state.pgBtn,
        })

    }



    qbFilters = () =>{
        qbActive = !qbActive
        if(qbActive){
            nflFilter_list.push('qb')
        }
        if(!qbActive) {
            nflFilter_list=this.removeArray(nflFilter_list, 'qb');
        }
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            qbBtn:!this.state.qbBtn,
        })

    }
    rbFilters = () =>{
        rbActive = !rbActive
        if(rbActive){
            nflFilter_list.push('rb')
        }
        if(!rbActive) {
            nflFilter_list=this.removeArray(nflFilter_list, 'rb');
        }
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            rbBtn:!this.state.rbBtn,
        })
    }
    wrFilters = () =>{
        wrActive = !wrActive
        if(wrActive){
            nflFilter_list.push('wr')
        }
        if(!wrActive) {
            nflFilter_list=this.removeArray(nflFilter_list, 'wr');
        }
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            wrBtn:!this.state.wrBtn,
        })
    }

    teFilters = () =>{
        teActive = !teActive
        if(teActive){
            nflFilter_list.push('te')
        }
        if(!teActive) {
            nflFilter_list=this.removeArray(nflFilter_list, 'te');
        }
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            teBtn:!this.state.teBtn,
        })
    }
    kFilters = () =>{
        kActive = !kActive
        if(kActive){
            nflFilter_list.push('k')
        }
        if(!kActive) {
            nflFilter_list=this.removeArray(nflFilter_list, 'k');
        }
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            kBtn:!this.state.kBtn,
        })
    }
    dstFilters = () =>{
        dstActive = !dstActive
        if(kActive){
            nflFilter_list.push('dst')
        }
        if(!dstActive) {
            nflFilter_list=this.removeArray(nflFilter_list, 'dst');
        }
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            dstBtn:!this.state.dstBtn,
        })
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
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.players_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            sgBtn:!this.state.sgBtn,
        })
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
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.players_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            sfBtn:!this.state.sfBtn,
        })
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
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.players_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            pfBtn:!this.state.pfBtn,
        })

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
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data})
        }
        else{
            this.setState({filter_player:this.state.players_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            cBtn:!this.state.cBtn,
        })
    }

    allSelectFilter(){
        if(this.state.nflAction){
            this.setState({filter_player:this.state.nfl_player_data})
        }
        else{
            this.setState({filter_player:this.state.players_data})
        }
        this.setState({
            allBtn:true,
            allClearBtn:false,
            pgBtn:true,
            sgBtn:true,
            sfBtn:true,
            pfBtn:true,
            cBtn:true,
        })
    }
    allClearFilter(){
        if(this.state.nflAction){
            this.setState({filter_player:this.state.nfl_player_data})
        }
        else{
            this.setState({filter_player:this.state.players_data})
        }
        this.setState({
            allBtn:false,
            allClearBtn:true,
            pgBtn:false,
            sgBtn:false,
            sfBtn:false,
            pfBtn:false,
            cBtn:false,
        })
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
        if(this.state.loader){
            return <Loader/>
        }
        else {
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
                            <div className="common-button ">
                                <div className="btn-group" >
                                    <label className={`${this.state.allBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={()=>{this.allSelectFilter('nfl')}}>
                                        {/*<input type="radio" name="options" autoComplete="off" checked/>*/}
                                        <span className="btn-text"> All</span>
                                    </label>
                                    <label className={`${this.state.allClearBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={this.allClearFilter}>
                                        {/*<input type="radio" name="options" autoComplete="off" checked/>*/}
                                        <span className="btn-text"> Clear</span>
                                    </label>
                                    {this.state.nflAction ?
                                        <>
                                        <label
                                            className={`${this.state.qbBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={this.qbFilters}>
                                            <span className="btn-text"> qb</span>
                                        </label>
                                            <label
                                                className={`${this.state.rbBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                                onClick={this.rbFilters}>
                                                <span className="btn-text"> rb</span>
                                            </label>
                                            <label
                                                className={`${this.state.wrBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                                onClick={this.wrFilters}>
                                                <span className="btn-text"> wr</span>
                                            </label>
                                            <label
                                                className={`${this.state.teBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                                onClick={this.teFilters}>
                                                <span className="btn-text"> te</span>
                                            </label>
                                            <label
                                                className={`${this.state.kBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                                onClick={this.kFilters}>
                                                <span className="btn-text"> k</span>
                                            </label>
                                        </>
                                        :
                                        <>
                                        <label
                                            className={`${this.state.pgBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                            onClick={this.pgFilters}>
                                            <span className="btn-text"> pg</span>
                                        </label>
                                        <label className={`${this.state.sgBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={this.sgFilters}>
                                        <span className="btn-text"> sg</span>
                                        </label>
                                        <label className={`${this.state.sfBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={this.sfFilters}>
                                        <span className="btn-text" > sf</span>
                                        </label>
                                        <label className={`${this.state.pfBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={this.pfFilters}>
                                        <span className="btn-text"> pf</span>
                                        </label>
                                        <label className={`${this.state.cBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={this.cFilters}>
                                        <span className="btn-text"> c</span>
                                        </label>
                                        </>
                                    }
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
        }
    }
}
export default DataNavBar