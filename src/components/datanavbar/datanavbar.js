import React from 'react'
import './datanavbar.css'
import btn_img1 from '../../images/btn-img1.png'
import btn_img2 from '../../images/btn-logo2.png'
import EnhancedTableHead from "../home/dataTable";
import TextField from "@material-ui/core/TextField";
import API from '../../networking/api'
import Loader from "../../loader/loader"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomizedMenus from "../dropdownBtn/btnDropdown"
import Button from "@material-ui/core/Button";
import Spinner from '../Spinner/spinner'
import ExportToExcel from '../exportFile/exportExcel'

let filter_list = []
let pgActive = false
let sgActive = false
let sfActive = false
let pfActive = false
let cActive = false

let nflFilter_list = []
let qbActive = false
let rbActive = false
let wrActive = false
let teActive = false
let kActive = false
let dstActive = false




class DataNavBar extends React.Component {
    api = new API()
    constructor(props) {
        super(props);
        this.state =
            {
                players_data:[],
                init_data:[],
                game_data: [],
                inputActive: false,
                loader:false,
                spinner:false,
                simulationSpinner:false,
                pgActive:false,
                temp_filter_player:null,
                filter_key:null,
                filter: "",
                salary: 'dk',
                update_data:true,
                search_player_data: [],
                allBtn:true,
                allClearBtn:false,
                pgBtn:true,
                sgBtn:true,
                sfBtn:true,
                pfBtn:true,
                cBtn:true,
                nflAction:false,
                qbBtn:false,
                rbBtn:false,
                wrBtn:false,
                teBtn:false,
                kBtn:false,
                dstBtn:false,
                saveData:false,
                is_nbaNfl:'NBA',
                saveBtnActive:false,
                excelDataList: [],
                setData: new Set()
            }
        this.child = React.createRef();
        // this.setupCustomTable()

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
        this.getSetData = this.getSetData.bind(this)
        this.setupCustomTable = this.setupCustomTable.bind(this)
    }
    componentDidMount() {
        this.getCustomDfsData({user:{id:'Master'}, sportView:"NBA"});
        this.setupCustomTable()
    }
    componentDidUpdate(prevProps) {

        if (this.props.triggerChildFunc !== prevProps.triggerChildFunc) {
            this.setState({saveBtnActive:false})
            this.onParentTrigger(this.props.triggerChildFunc[0]);
            if(this.props.triggerChildFunc[0].sportView === 'NFL'){
                qbActive = true
                rbActive = true
                wrActive = true
                teActive = true
                kActive = true
                dstActive = true
                this.setState({temp_filter_player: []})
                this.setState({nflAction: true,
                    pgBtn:false,
                    qbBtn:true,
                    rbBtn:true,
                    wrBtn:true,
                    teBtn:true,
                    kBtn:true,
                    dstBtn:true,
                    sgBtn:false,
                    sfBtn:false,
                    pfBtn:false,
                    cBtn:false,
                    allBtn:true,
                    allClearBtn:false,
                    inputActive:false
                })
            }
            if(this.props.triggerChildFunc[0].sportView === 'NBA'){
                pgActive = true
                sgActive = true
                sfActive = true
                pfActive = true
                cActive = true
                this.setState({temp_filter_player: []})
                this.setState({nflAction: false,
                    pgBtn:true,
                    qbBtn:false,
                    sgBtn:true,
                    sfBtn:true,
                    pfBtn:true,
                    cBtn:true,
                    rbBtn:false,
                    wrBtn:false,
                    teBtn:false,
                    kBtn:false,
                    dstBtn:false,
                    allBtn:true,
                    allClearBtn:false,
                    inputActive:false
                })
            }
            this.dkSalary()
        }

    }

    onParentTrigger(data) {
        this.setState({is_nbaNfl: data.sportView})
        this.getCustomDfsData(data)

        // Let's call the passed variable from parent if it's a function
        if (this.props.triggerChildFunc && {}.toString.call(this.props.triggerChildFunc) === '[object Function]') {
            this.props.triggerChildFunc();
        }
    }

    getSetData(data){

        this.setState({
            setData:data
        }, () => {
            var game_data_array = []
            for(let key of data) {
                var temp_array = []
                temp_array = this.state.temp_filter_player.filter((item) => item.Team.includes(key))
                temp_array.forEach((item) => {
                    game_data_array.push(item)
                })
            }
            this.setState({
                init_data:game_data_array
            },()=>{
                if(this.state.is_nbaNfl==="NBA")
                { this.setState({ players_data : this.filterObj(filter_list)}) }
                else
                { this.setState({ players_data :this.nflFilterObj(nflFilter_list) }) }
            })
        })
    }

    setupCustomTable = () =>{
        // setup custom table
        let payload = {
            data:{user:{id:localStorage.getItem('username')},sportView:"NBA"}
        }
        let url = '/Prod/setup-custom-tables'
        this.api.GetApi(url, payload)
            .then((res) => {
                // let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {

                    let fetch_payload={"user": {"id": localStorage.getItem('username')}, "sportView": this.state.is_nbaNfl}
                    let data_url = '/Prod/fetch-game-data'
                    this.api.GetApi(data_url, fetch_payload)
                        .then((res) => {
                            if (res.status === 200 ) {
                                let fetch_live_stats = '/Prod/fetch-live-stats'
                                let fetch_live_payload={"user": {"id": localStorage.getItem('username')}, "sportView": this.state.is_nbaNfl}
                                this.api.GetApi(fetch_live_stats, fetch_live_payload)
                                    .then((res) => {
                                        if (res.status === 200 ) {
                                        } else if (res.request.status === 401) {
                                            this.props.history.push('/signin')
                                            this.setState({loader:false})
                                        } else {
                                            console.log(res)
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    })
                            } else if (res.request.status === 401) {
                                this.props.history.push('/signin')
                                this.setState({loader:false})
                            } else {
                                console.log(res)
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                    this.setState({loader:false})
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getPlayerState = (data) =>{
        this.setState({update_data:true})
        let payload = {
            data:data
        }
        // player stats api calling
        let url = '/Prod/get-player-stats'
        this.api.GetApi(url, payload)
            .then((res) => {
                this.setState({loader:false})
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    if(data.sportView === "NBA"){
                        if (response_data.body.length === 0 ){
                            this.setState({loader:false , players_data:this.state.temp_filter_player
                                , init_data:this.state.temp_filter_player})
                        }
                        else{
                            this.setState({players_data: response_data.body , init_data:response_data.body})
                            this.setState({loader:false})
                        }

                    }
                    if(data.sportView === "NFL"){
                        if (response_data.body.length !== 0){
                            this.setState({ init_data:response_data.body ,temp_filter_player:response_data.body})
                            this.setState({players_data:response_data.body})
                        }
                        else{
                            this.setState({players_data:this.state.temp_filter_player,  init_data:this.state.temp_filter_player})
                        }
                        this.setState({loader:false})
                    }
                    this.allSelectFilter()
                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                    this.setState({loader:false})
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })

        let game_url= '/Prod/get-game-data'
        this.api.GetApi(game_url, payload)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    if(data.sportView === "NBA"){
                        if(response_data.body.length > 0){
                            this.setState({game_data: response_data.body})
                            this.setState({loader:false})
                        }
                        else{
                            // this.setState({game_data: response_data.body})
                            this.setState({loader:false})
                        }

                    }
                    if(data.sportView === "NFL"){
                        this.setState({game_data: response_data.body})
                        this.setState({loader:false})
                    }

                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                    this.setState({loader:false})
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }


    myData(){
        this.dkSalary()
        toast("⭐ Populating fields...");
        this.setState({
            inputActive:true,
            saveBtnActive:true,
            loader:true
        })
        this.getPlayerState({"user": {"id": localStorage.getItem('username')}, "sportView": this.state.is_nbaNfl})

    }

    customDfs(){
        toast("⭐ Populating fields...");
        this.setState({
            inputActive:false,
            saveBtnActive:false,
            loader:true
        })
            this.getPlayerState( {"user": {"id": "Master"}, "sportView": this.state.is_nbaNfl})

    }

    SaveData = () =>{
        this.setState({saveData:true, spinner: true})
        //toast.success("⭐ ...",{closeOnClick: true,
       //     autoClose:3000});
    }

    //api calling
    getCustomDfsData(data){
        this.setState({loader:true})
        this.setState({update_data:true})
        let payload = {
            data:data
        }
        // player stats api calling
        let url = '/Prod/get-player-stats'
        this.api.GetApi(url, payload)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    if(data.sportView === "NBA"){
                        this.setState({players_data: response_data.body , init_data:response_data.body })
                        this.setState({ temp_filter_player:response_data.body})
                    }
                    if(data.sportView === "NFL"){
                        this.setState({init_data:response_data.body, temp_filter_player:response_data.body})
                        this.setState({players_data: response_data.body})
                    }
                    this.setState({loader:false})
                    this.allSelectFilter()
                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                    this.setState({loader:false})
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })


//    game data api calling
        let game_url= '/Prod/get-game-data'
        this.api.GetApi(game_url, payload)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    if(data.sportView === "NBA"){
                        this.setState({game_data: response_data.body})
                
                    }
                    if(data.sportView === "NFL"){
                        this.setState({game_data: response_data.body})
                       
                    }

                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
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
        sessionStorage.setItem('pageReset', "true0")
        let newArray
        let pgArray
        let sgArray
        let sfArray
        let pfArray
        let cArray
        let player_obj= {
                'players':this.state.init_data
            }

        if(this.state.salary === 'dk'){
            newArray = []
            pgArray = []
            sgArray = []
            sfArray = []
            pfArray = []
            cArray = []

            for(let i = 0; i<keyList.length; i++){
                if(keyList[i] === 'pg'){
                    pgArray = (player_obj.players.filter(function (el){
                        return el.DraftKingsPosition === 'PG' || el.DraftKingsPosition === 'pg' || el.DraftKingsPosition.includes('PG') || el.DraftKingsPosition.includes('pg');
                    }));
                } if(keyList[i] === 'sg'){
                    sgArray = (player_obj.players.filter(function (el){
                        return el.DraftKingsPosition === 'SG' || el.DraftKingsPosition === 'sg' || el.DraftKingsPosition.includes('SG') || el.DraftKingsPosition.includes('sg');
                    }));
                } if(keyList[i] === 'sf'){
                    sfArray = (player_obj.players.filter(function (el){
                        return el.DraftKingsPosition === 'SF' || el.DraftKingsPosition === 'sf' || el.DraftKingsPosition.includes('SF') || el.DraftKingsPosition.includes('sf');
                    }));
                } if(keyList[i] === 'pf'){
                    pfArray = (player_obj.players.filter(function (el){
                        return el.DraftKingsPosition === 'PF' || el.DraftKingsPosition === 'pf' || el.DraftKingsPosition.includes('PF') || el.DraftKingsPosition.includes('pf');
                    }));
                } if(keyList[i] === 'c'){
                    cArray = (player_obj.players.filter(function (el){
                        return el.DraftKingsPosition === 'C' || el.DraftKingsPosition === 'c' || el.DraftKingsPosition.includes('C') || el.DraftKingsPosition.includes('c');
                    }));
                }
            }

            newArray = newArray.concat(pgArray, sgArray,sfArray, pfArray, cArray);
            newArray = new Set(newArray)
            newArray = Array.from(newArray)

            return newArray
        }
        if(this.state.salary === 'fd') {
            newArray = []
            pgArray = []
            sgArray = []
            sfArray = []
            pfArray = []
            cArray = []

            for(let i = 0; i<keyList.length; i++){

                if(keyList[i] === 'pg'){
                    pgArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'PG' || el.FanDuelPosition === 'pg' || el.FanDuelPosition.includes('PG') || el.FanDuelPosition.includes('pg');
                    }));
                }else if(keyList[i] === 'sg'){
                    sgArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'SG' || el.FanDuelPosition === 'sg' || el.FanDuelPosition.includes('SG') || el.FanDuelPosition.includes('sg');
                    }));
                }else if(keyList[i] === 'sf'){
                    sfArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'SF' || el.FanDuelPosition === 'sf' || el.FanDuelPosition.includes('SF') || el.FanDuelPosition.includes('sf');
                    }));
                }else if(keyList[i] === 'pf'){
                    pfArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'PF' || el.FanDuelPosition === 'pf' || el.FanDuelPosition.includes('PF') || el.FanDuelPosition.includes('pf');
                    }));
                }else if(keyList[i] === 'c'){
                    cArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'C' || el.FanDuelPosition === 'c' || el.FanDuelPosition.includes('C') || el.FanDuelPosition.includes('c');
                    }));
                }
            }

            newArray = newArray.concat(pgArray, sgArray,sfArray, pfArray, cArray);
            newArray = new Set(newArray)
            newArray = Array.from(newArray)
            return newArray
        }

    }

    nflFilterObj(keyList){
        sessionStorage.setItem('pageReset', "true0")
        let newArray
        let qbArray
        let rbArray
        let wrArray
        let teArray
        let kArray
        let dstArray
        let player_obj
        player_obj= {
            'players':this.state.init_data
        }

        if (this.state.salary === 'dk'){
            newArray = []
            qbArray = []
            rbArray = []
            wrArray = []
            teArray = []
            kArray = []
            dstArray = []

            for(let i = 0; i<keyList.length; i++){
                if(keyList[i] === 'qb'){
                    qbArray = (player_obj.players.filter(function (el){
                        if (el.Name !== undefined){
                            try{
                                return el.DraftKingsPosition === 'QB' || el.DraftKingsPosition === 'qb' || el.DraftKingsPosition.includes('QB') || el.DraftKingsPosition.includes('qb');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'rb'){
                    rbArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.DraftKingsPosition === 'RB' || el.DraftKingsPosition === 'rb' || el.DraftKingsPosition.includes('RB') || el.DraftKingsPosition.includes('rb');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'wr'){
                    wrArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.DraftKingsPosition === 'WR' || el.DraftKingsPosition === 'wr' || el.DraftKingsPosition.includes('WR') || el.DraftKingsPosition.includes('wr');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'te'){
                    teArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.DraftKingsPosition === 'TE' || el.DraftKingsPosition === 'te' || el.DraftKingsPosition.includes('TE') || el.DraftKingsPosition.includes('te');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'k'){
                    kArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.DraftKingsPosition === 'K' || el.DraftKingsPosition === 'k' || el.DraftKingsPosition.includes('K') || el.DraftKingsPosition.includes('k');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'dst'){
                    dstArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.DraftKingsPosition === 'DST' || el.DraftKingsPosition === 'dst' || el.DraftKingsPosition.includes('DST') || el.DraftKingsPosition.includes('dst');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }
            }

            newArray = newArray.concat(qbArray, rbArray,wrArray, teArray, kArray, dstArray);
            newArray = new Set(newArray)
            newArray = Array.from(newArray)

            return newArray
        }
        if(this.state.salary === 'fd'){
            newArray = []
            qbArray = []
            rbArray = []
            wrArray = []
            teArray = []
            kArray = []
            dstArray = []
            for(let i = 0; i<keyList.length; i++){

                if(keyList[i] === 'qb'){
                    qbArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.FanDuelPosition === 'QB' || el.FanDuelPosition === 'qb' || el.FanDuelPosition.includes('QB') || el.FanDuelPosition.includes('qb');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'rb'){
                    rbArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.FanDuelPosition === 'RB' || el.FanDuelPosition === 'rb' || el.FanDuelPosition.includes('RB') || el.FanDuelPosition.includes('rb');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'wr'){
                    wrArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.FanDuelPosition === 'WR' || el.FanDuelPosition === 'wr' || el.FanDuelPosition.includes('WR') || el.FanDuelPosition.includes('wr');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'te'){
                    teArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.FanDuelPosition === 'TE' || el.FanDuelPosition === 'te' || el.FanDuelPosition.includes('TE') || el.FanDuelPosition.includes('te');
                            }
                            catch (ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'k'){
                    kArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.FanDuelPosition === 'K' || el.FanDuelPosition === 'k' || el.FanDuelPosition.includes('K') || el.FanDuelPosition.includes('k');
                            }
                            catch(ex){
                                console.log(ex)
                            }
                        }
                    }));
                }else if(keyList[i] === 'dst'){
                    dstArray = (player_obj.players.filter(function (el){
                        if(el.Name !== undefined){
                            try{
                                return el.FanDuelPosition === 'DST' || el.FanDuelPosition === 'dst' || el.FanDuelPosition.includes('DST') || el.FanDuelPosition.includes('dst');
                            }
                            catch(ex){
                                console.log(ex)
                            }
                        }
                    }));
                }
            }

            newArray = newArray.concat(qbArray, rbArray,wrArray, teArray, kArray, dstArray);

            newArray = new Set(newArray)
            newArray = Array.from(newArray)
            return newArray
        }

    }
    pgFilters(){
        if(pgActive){
            filter_list=this.removeArray(filter_list, 'pg');
        }
        else {
            filter_list.push('pg')
        }
        pgActive = !pgActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            pgBtn:!this.state.pgBtn,
        })
        if(filter_list.length === 5){
            this.setState({
                allBtn:true
            })
        }

    }

    qbFilters = () =>{
        if(qbActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'qb');
        }
        else {
            nflFilter_list.push('qb')
        }
        qbActive = !qbActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            qbBtn:!this.state.qbBtn,
        })
        if(nflFilter_list.length === 6){
            this.setState({
                allBtn:true
            })
        }
    }

    rbFilters = () =>{
        if(rbActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'rb');
        }
        else {
            nflFilter_list.push('rb')
        }
        rbActive = !rbActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            rbBtn:!this.state.rbBtn,
        })
        if(nflFilter_list.length === 6){
            this.setState({
                allBtn:true
            })
        }
    }

    wrFilters = () =>{
        if(wrActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'wr');
        }
        else {
            nflFilter_list.push('wr')
        }
        wrActive = !wrActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            wrBtn:!this.state.wrBtn,
        })
        if(nflFilter_list.length === 6){
            this.setState({
                allBtn:true
            })
        }
    }

    teFilters = () =>{
        if(teActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'te');
        }
        else {
            nflFilter_list.push('te')
        }
        teActive = !teActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            teBtn:!this.state.teBtn,
        })
        if(nflFilter_list.length === 6){
            this.setState({
                allBtn:true
            })
        }
    }

    kFilters = () =>{
        if(kActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'k');
        }
       else {
            nflFilter_list.push('k')
        }
        kActive = !kActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            kBtn:!this.state.kBtn,
        })
        if(nflFilter_list.length === 6){
            this.setState({
                allBtn:true
            })
        }
    }

    dstFilters = () =>{
        if(dstActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'dst');
        }
        else {
            nflFilter_list.push('dst')
        }
        dstActive = !dstActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            dstBtn:!this.state.dstBtn,
        })
        if(nflFilter_list.length === 6){
            this.setState({
                allBtn:true
            })
        }
    }

    sgFilters(){
        if(sgActive){
            filter_list=this.removeArray(filter_list, 'sg');
        }
        else {
            filter_list.push('sg')
        }
        sgActive = !sgActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            sgBtn:!this.state.sgBtn,
        })
        if(filter_list.length === 5){
            this.setState({
                allBtn:true
            })
        }
    }

    sfFilters(){
        if(sfActive){
            filter_list=this.removeArray(filter_list, 'sf');
        }
        else {
            filter_list.push('sf')
        }
        sfActive = !sfActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            sfBtn:!this.state.sfBtn,
        })
        if(filter_list.length === 5){
            this.setState({
                allBtn:true
            })
        }
    }

    pfFilters(){
        if(pfActive){
            filter_list=this.removeArray(filter_list, 'pf');
        }
        else {
            filter_list.push('pf')
        }
        pfActive = !pfActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            pfBtn:!this.state.pfBtn,
        })
        if(filter_list.length === 5){
            this.setState({
                allBtn:true
            })
        }

    }

    cFilters(){
        if(cActive){
            filter_list=this.removeArray(filter_list, 'c');
        }
       else {
            filter_list.push('c')
        }
        cActive = !cActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({ players_data:filter_data ,search_player_data:filter_data})
        }
        else{
            this.setState({ players_data:[] ,search_player_data:[]})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            cBtn:!this.state.cBtn,
        })
        if(filter_list.length === 5){
            this.setState({
                allBtn:true
            })
        }
    }

    allSelectFilter(){
        sessionStorage.setItem('pageReset', "true0")
        if(this.state.nflAction){
            nflFilter_list = ['qb', 'rb', 'wr', 'te', 'k', 'dst']
            qbActive=true
            rbActive=true
            wrActive=true
            teActive=true
            kActive=true
            dstActive=true
            this.setState({
                players_data: this.state.init_data,
                search_player_data:this.state.init_data,
                allBtn:true,
                allClearBtn:false,
                qbBtn:true,
                rbBtn:true,
                wrBtn:true,
                teBtn:true,
                kBtn:true,
                dstBtn:true,
                qbActive:true,
                rbActive:true,
                wrActive:true,
                teActive:true,
                kActive:true,
                dstActive:true
            })
        }
        else{
            filter_list = ['pg', 'sg', 'sf', 'pf', 'c']
            pgActive=true
            sgActive=true
            sfActive=true
            pfActive=true
            cActive=true
            this.setState({
                players_data: this.state.init_data,
                search_player_data:this.state.init_data,
                allBtn:true,
                allClearBtn:false,
                pgBtn:true,
                sgBtn:true,
                sfBtn:true,
                pfBtn:true,
                cBtn:true,
                pgActive:true,
                sgActive:true,
                sfActive:true,
                pfActive:true,
                cActive:true
            })
        }
    }

    allClearFilter(){
        if(this.state.nflAction){
            qbActive=false
            rbActive=false
            wrActive=false
            teActive=false
            kActive=false
            dstActive=false
            nflFilter_list = []
            this.setState({
                players_data: [],
                search_player_data:[],
                allBtn:false,
                allClearBtn:true,
                pgBtn:false,
                sgBtn:false,
                sfBtn:false,
                pfBtn:false,
                cBtn:false,
                qbBtn:false,
                rbBtn:false,
                wrBtn:false,
                teBtn:false,
                kBtn:false,
                dstBtn:false,})
        }
        else{
            pgActive=false
            sgActive=false
            sfActive=false
            pfActive=false
            cActive=false
            filter_list = []
            this.setState({
                players_data: [],
                search_player_data:[],
                allBtn:false,
                allClearBtn:true,
                pgBtn:false,
                sgBtn:false,
                sfBtn:false,
                pfBtn:false,
                cBtn:false,
                qbBtn:false,
                rbBtn:false,
                wrBtn:false,
                teBtn:false,
                kBtn:false,
                dstBtn:false,})
        }
    }

    resetData(){
        toast("⭐ Populating fields...",{closeOnClick: true});
        let data;
        data= {user:{id:'Master'},
            sportView:this.state.is_nbaNfl}
        this.setState({update_data:true})

        let payload = {
            data:data
        }
        // player stats api calling
        let url = '/Prod/get-player-stats'
        this.api.GetApi(url, payload)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    if(data.sportView === "NBA"){
                        this.setState({players_data: response_data.body , init_data:response_data.body })
                        this.setState({ temp_filter_player:response_data.body})
                        this.setState({loader:false})
                        this.allClearFilter()
                        this.allSelectFilter()
                    }
                    if(data.sportView === "NFL"){
                        this.setState({init_data:response_data.body, temp_filter_player:response_data.body})
                        this.setState({players_data: response_data.body})
                        this.setState({loader:false})
                        this.allClearFilter()
                        this.allSelectFilter()
                    }
                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                    this.setState({loader:false})
                } else {
                    console.log(res)
                }
            })
            .catch((error) => {
                console.log(error);
            })
        // this.allSelectFilter()
    }

    handleChange (event) {
        sessionStorage.setItem('pageReset', "true0")
        let searching_data = this.state.players_data
        function filterByValue(searching_data, term) {
            term = term.toLowerCase()
            let ans = searching_data.filter(function(v,i) {
                if((v.Name || v.Team) === undefined){
                    return false
                }
                else if (v.Name.toLowerCase().indexOf(term) >= 0) {
                    return true;
                }
                else
                {
                    return v.Team.toLowerCase().indexOf(term) >= 0;
                }
            });
            return ans
        }
        let search_filter = filterByValue(searching_data, event.target.value);
        if(event.target.value.length>0)
            this.setState({players_data:search_filter})
        else
            this.setState({players_data:this.state.search_player_data})
    }

    dkSalary = event => {
        this.setState({salary:'dk'})
    }

    fdSalary = event => {
        this.setState({salary:'fd'})
    }

    handlePlayerStats = (playerStats) =>{
        //this.setState({spinner: true})
        let payload = {
                data:{playerStats: playerStats, user: {id: localStorage.getItem('username')}, sportView: this.state.is_nbaNfl}
            }
            // player stats api calling
            let url = '/Prod/save-player-stats'
            this.api.PostApi(payload, url)
                .then((res) => {
                    if (res.status === 200 ) {
                        toast.success("⭐ Data Saved Successfully...");
                        this.setState({
                            inputActive:true,
                            saveBtnActive:true
                        })
                        // this.getPlayerState({"user": {"id": localStorage.getItem('username')}, "sportView": this.state.is_nbaNfl})
                    } else if (res.request.status === 401) {
                        this.props.history.push('/')
                        this.setState({loader:false,spinner: false})
                    } else {
                        this.setState({loader:false,spinner: false})
                        console.log(res)
                    }
                })
                .catch((error) => {
                    this.setState({loader:false,spinner: false})
                    console.log(error);
                })
        this.setState({saveData:false})
        this.setState({spinner: false})
    }

    handleSimulations = () =>{
        toast.success("⭐ Simulation Started...");
        this.setState({simulationSpinner: true})

            let payload = {
                User: localStorage.getItem('username')
            }
            let url
        if(this.state.is_nbaNfl === 'NFL') {
            url = '/Prod/run-simulation-nfl'
        }
        else{
            url = '/Prod/run-simulation'
        }
        this.api.PostApi(payload, url)
            .then((res) => {
                //let response_data = JSON.parse(res.request.response)
                if (res.status === 200) {
                    this.setState({
                        inputActive:true,
                        saveBtnActive:true
                    })
                    this.setState({simulationSpinner: false},()=>{toast("Populating Fields")})
                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                    this.setState({loader: false, simulationSpinner: false})
                } else {
                    this.setState({simulationSpinner: false, loader: false})
                    console.log(res)
                }
            }).then(()=>{this.getPlayerState({"user": {"id": localStorage.getItem('username')}, "sportView": this.state.is_nbaNfl})})
            .catch((error) => {
                this.setState({simulationSpinner: false, loader: false})
                console.log(error);
            })
        //setTimeout(() => { toast("⭐ Populating fields..."); }, 3000);
    }

    handleSaveGameData = (props) =>{
        console.log(props)
        this.setState({spinner: true})
        let payload = {
            data:{playerStats: props, user: {id: localStorage.getItem('username')}, sportView: this.state.is_nbaNfl}
        }
        // player stats api calling
        let url = '/Prod/save-game-data'
        this.api.PostApi(payload, url)
            .then((res) => {
                //let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) { }
                else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                    this.setState({loader:false,spinner: false})
                } else {
                    this.setState({loader:false,spinner: false})
                    console.log(res)
                }
            })
            .catch((error) => {
                this.setState({loader:false,spinner: false})
                console.log(error);
            })
        this.setState({saveData:false,spinner: false})
        toast.success("⭐ Apply to All Teams...");

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
                                <div className="btn-group ">
                                    <label className={this.state.inputActive ? "btn btn-primary ad-group-btn":"btn btn-primary active ad-group-btn"}>
                                        <input type="radio" name="options" autoComplete="off" defaultChecked
                                               onClick={this.customDfs}/>
                                        <span className="btn-text">CustomDFS Data</span>
                                    </label>
                                    <label className={this.state.inputActive ? "btn btn-primary active ad-group-btn" : "btn btn-primary ad-group-btn"}>
                                        <input type="radio" name="options" autoComplete="off" onClick={this.myData}/>
                                        <span className="btn-text">My Data</span>
                                    </label>
                                </div>
                            </div>
                            <div className="common-button">
                                <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                    <label className="btn btn-primary active ad-group-btn">
                                        <input type="radio" name="options" autoComplete="off" checked onClick={this.dkSalary}/>
                                        <span className="btn-img"> <img src={btn_img2} className="btn-img-logo" alt="Image2"/></span>
                                        <span className="btn-text"> DK</span>
                                    </label>
                                    <label className="btn btn-primary ad-group-btn">
                                        <input type="radio" name="options" autoComplete="off" onClick={this.fdSalary}/>
                                        <span className="btn-img"> <img src={btn_img1} className="btn-img-logo" alt="Image1"/></span>
                                        <span className="btn-text"> FD</span>
                                    </label>
                                </div>
                            </div>
                            <div className="common-button">

                                <CustomizedMenus
                                    nfl_game_data={this.state.game_data}
                                    inputActive={this.state.inputActive}
                                    onSaveGameData={this.handleSaveGameData}
                                    is_nbaNfl={this.state.is_nbaNfl}
                                    setData = {this.getSetData}
                                />
                            </div>
                            <div className="common-button ">
                                <div className="btn-group" >
                                    <label className={`${this.state.allBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={()=>{this.allSelectFilter('nfl')}}>
                                        <span className="btn-text"> All</span>
                                    </label>
                                    <label className={`${this.state.allClearBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`} onClick={this.allClearFilter}>
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
                                            <label
                                                className={`${this.state.dstBtn ? 'btn btn-primary active ad-group-btn' : 'btn btn-primary ad-group-btn'}`}
                                                onClick={this.dstFilters}>
                                                <span className="btn-text"> dst</span>
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
                                <ExportToExcel
                                    nba_player_data={this.state.players_data}
                                    fileName={'customDFSExport'}
                                    dataOf={this.state.is_nbaNfl}
                                    salaryType={this.state.salary}
                                    excelData={this.state.excelDataList}
                                />
                            </div>
                            <div className="common-button">
                                <label className="btn btn-primary active ad-group-btn" onClick={this.resetData}>
                                    <span className="btn-text">Reset Data</span>
                                </label>
                            </div>
                            <div className="common-button">
                                {this.state.spinner ?
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="btn btn-primary active ad-group-btn"
                                    >
                                        <Spinner/>
                                    </Button>
                                    :
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className="btn btn-primary active ad-group-btn"
                                    onClick={this.SaveData}
                                    disabled={!this.state.saveBtnActive}
                                >
                                    Save
                                </Button>
                                    }
                            </div>
                            <div className="common-button">
                                {this.state.simulationSpinner ?
                                    <Button
                                        variant="contained"
                                        color="danger"
                                        className="btn btn-danger active ad-group-btn simulationSpinner"
                                    >
                                        <Spinner/>
                                    </Button>
                                    :

                                    <Button
                                        variant="contained"
                                        color="danger"
                                        className="btn btn-danger active ad-group-btn simulationSpinner"
                                        onClick={this.handleSimulations}
                                        disabled={!this.state.saveBtnActive}
                                    >
                                        Simulate
                                    </Button>
                                }
                            </div>
                        </div>

                    </div>
                    <div className="container-fluid">
                        <EnhancedTableHead
                            salary={this.state.salary}              //  dk/fd
                            showData={this.state.players_data}      // main data to show in data table
                            inputActive={this.state.inputActive}   //   input field on game data (true/false)
                            update_data={this.state.update_data}    //  true/false on change of some data to update it in rows
                            saveDataBtn={this.state.saveData}       //    active on saveBtn click (true/false)
                            is_nbaNfl={this.state.is_nbaNfl}         //   nba/nfl
                            onSavePlayerStats={this.handlePlayerStats} // callback func for onClick saveBtn
                        />
                    </div>
                </>
            )
        }
    }
}
export default DataNavBar