import React from 'react'
import './datanavbar.css'
import btn_img1 from '../../images/btn-img1.png'
import btn_img2 from '../../images/btn-logo2.png'
import EnhancedTableHead from "../home/dataTable";
import TextField from "@material-ui/core/TextField";
import API from '../../networking/api'
import Loader from "../../loader/loader"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import CustomizedMenus from "../dropdownBtn/btnDropdown"
import Button from "@material-ui/core/Button";
import Spinner from '../Spinner/spinner'
import ExportToExcel from '../exportFile/exportExcel'

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
let data1 =[]
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
                spinner:false,
                simulationSpinner:false,
                pgActive:false,
                filter_player:null,
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
                excelDataList: []
            }
        this.child = React.createRef();
        this.setupCustomTable()

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
            this.setState({saveBtnActive:false})
            this.onParentTrigger(this.props.triggerChildFunc[0]);
            if(this.props.triggerChildFunc[0].sportView === 'NFL'){
                qbActive = true
                rbActive = true
                wrActive = true
                teActive = true
                kActive = true
                dstActive = true
                this.setState({filter_player: []})
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
                this.setState({filter_player: []})
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

    setupCustomTable = () =>{
        // setup custom table
        let payload = {
            data:{user:{id:localStorage.getItem('username')},sportView:"NBA"}
        }
        let url = '/Prod/setup-custom-tables'
        this.api.GetApi(url, payload)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {

                } else if (res.request.status === 401) {
                    // console.log("login")
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
        this.setState({loader:true})
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
                        if (response_data.body.length <1 ){
                            // this.setState({players_data: })
                            // this.setState({search_player_data: response_data.body, excelDataList:response_data.body})
                            // this.setState({nfl_player_data:[]})
                            this.setState({loader:false})
                            filter_list = ['pg', 'sg', 'sf', 'pf', 'c']
                        }
                        else{
                            this.setState({players_data: response_data.body})
                            this.setState({search_player_data: response_data.body, excelDataList:response_data.body})
                            this.setState({nfl_player_data:[]})

                            this.setState({loader:false})
                            filter_list = ['pg', 'sg', 'sf', 'pf', 'c']
                        }

                    }
                    if(data.sportView === "NFL"){

                        this.setState({nfl_player_data: response_data.body})
                        this.setState({search_player_data: response_data.body, excelDataList:response_data.body})
                        this.setState({players_data: []})

                        this.setState({loader:false})
                        nflFilter_list = ['qb', 'rb', 'wr', 'te', 'k', 'dst']
                    }
                } else if (res.request.status === 401) {
                    // console.log("login")
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
        toast("⭐ Populating fields...");
        this.setState({
            inputActive:true,
            saveBtnActive:true
        })
            this.getPlayerState({"user": {"id": localStorage.getItem('username')}, "sportView": this.state.is_nbaNfl})

        }

    customDfs(){
        toast("⭐ Populating fields...");
        this.setState({
            inputActive:false,
            saveBtnActive:false
        })

            this.getPlayerState( {"user": {"id": "Master"}, "sportView": this.state.is_nbaNfl})

    }

    SaveData = () =>{
        this.setState({saveData:true, spinner: true})
        toast.success("⭐ Successfully loaded...",{closeOnClick: true,
            autoClose:3000});
        // this.setState({saveData:true, spinner: false})
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
                        this.setState({players_data: response_data.body})
                        this.setState({search_player_data: response_data.body, excelDataList:response_data.body})
                        this.setState({nfl_player_data:[]})
                        filter_list = ['pg', 'sg', 'sf', 'pf', 'c']
                    }
                    if(data.sportView === "NFL"){
                        this.setState({nfl_player_data: response_data.body})
                        this.setState({search_player_data: response_data.body, excelDataList:response_data.body})
                        this.setState({players_data: []})
                        nflFilter_list = ['qb', 'rb', 'wr', 'te', 'k', 'dst']
                    }
                } else if (res.request.status === 401) {
                    // console.log("login")
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
                    this.setState({game_data: response_data.body})
                    this.setState({loader:false})
                    // console.log('+++++----++++', response_data.body)
                } else if (res.request.status === 401) {
                    // console.log("login")
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
        let newArray
        let pgArray
        let sgArray
        let sfArray
        let pfArray
        let cArray
        let player_obj= {
                'players':this.state.players_data
            }
            // console.log(player_obj.players)

        if(this.state.salary == 'dk'){
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
            if(keyList.length <=0){
                newArray = this.state.players_data
            }
            newArray = new Set(newArray)
            newArray = Array.from(newArray)
            return newArray
        }
        if(this.state.salary == 'fd') {
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
                } if(keyList[i] === 'sg'){
                    sgArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'SG' || el.FanDuelPosition === 'sg' || el.FanDuelPosition.includes('SG') || el.FanDuelPosition.includes('sg');
                    }));
                } if(keyList[i] === 'sf'){
                    sfArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'SF' || el.FanDuelPosition === 'sf' || el.FanDuelPosition.includes('SF') || el.FanDuelPosition.includes('sf');
                    }));
                } if(keyList[i] === 'pf'){
                    pfArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'PF' || el.FanDuelPosition === 'pf' || el.FanDuelPosition.includes('PF') || el.FanDuelPosition.includes('pf');
                    }));
                } if(keyList[i] === 'c'){
                    cArray = (player_obj.players.filter(function (el){
                        return el.FanDuelPosition === 'C' || el.FanDuelPosition === 'c' || el.FanDuelPosition.includes('C') || el.FanDuelPosition.includes('c');
                    }));
                }
            }

            newArray = newArray.concat(pgArray, sgArray,sfArray, pfArray, cArray);
            if(keyList.length <=0){
                newArray = this.state.players_data
            }
            newArray = new Set(newArray)
            newArray = Array.from(newArray)
            return newArray
        }

    }

    nflFilterObj(keyList){
        let newArray
        let qbArray
        let rbArray
        let wrArray
        let teArray
        let kArray
        let dstArray
        let player_obj
            player_obj= {
                'players':this.state.nfl_player_data
            }
            if (this.state.salary == 'dk'){
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
                            return el.DraftKingsPosition === 'QB' || el.DraftKingsPosition === 'qb' || el.DraftKingsPosition.includes('QB') || el.DraftKingsPosition.includes('qb');
                        }));
                    } if(keyList[i] === 'rb'){
                        rbArray = (player_obj.players.filter(function (el){
                            return el.DraftKingsPosition === 'RB' || el.DraftKingsPosition === 'rb' || el.DraftKingsPosition.includes('RB') || el.DraftKingsPosition.includes('rb');
                        }));
                    } if(keyList[i] === 'wr'){
                        wrArray = (player_obj.players.filter(function (el){
                            return el.DraftKingsPosition === 'WR' || el.DraftKingsPosition === 'wr' || el.DraftKingsPosition.includes('WR') || el.DraftKingsPosition.includes('wr');
                        }));
                    } if(keyList[i] === 'te'){
                        teArray = (player_obj.players.filter(function (el){
                            return el.DraftKingsPosition === 'TE' || el.DraftKingsPosition === 'te' || el.DraftKingsPosition.includes('TE') || el.DraftKingsPosition.includes('te');
                        }));
                    } if(keyList[i] === 'k'){
                        kArray = (player_obj.players.filter(function (el){
                            return el.DraftKingsPosition === 'K' || el.DraftKingsPosition === 'k' || el.DraftKingsPosition.includes('K') || el.DraftKingsPosition.includes('k');
                        }));
                    } if(keyList[i] === 'dst'){
                        dstArray = (player_obj.players.filter(function (el){
                            return el.DraftKingsPosition === 'DST' || el.DraftKingsPosition === 'dst' || el.DraftKingsPosition.includes('DST') || el.DraftKingsPosition.includes('dst');
                        }));
                    }
                }

                newArray = newArray.concat(qbArray, rbArray,wrArray, teArray, kArray, dstArray);
                if(keyList.length <=0){
                    newArray = this.state.players_data
                }

                newArray = new Set(newArray)
                newArray = Array.from(newArray)

                return newArray
            }
            if(this.state.salary == 'fd'){
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
                            return el.FanDuelPosition === 'QB' || el.FanDuelPosition === 'qb' || el.FanDuelPosition.includes('QB') || el.FanDuelPosition.includes('qb');
                        }));
                    } if(keyList[i] === 'rb'){
                        rbArray = (player_obj.players.filter(function (el){
                            return el.FanDuelPosition === 'RB' || el.FanDuelPosition === 'rb' || el.FanDuelPosition.includes('RB') || el.FanDuelPosition.includes('rb');
                        }));
                    } if(keyList[i] === 'wr'){
                        wrArray = (player_obj.players.filter(function (el){
                            return el.FanDuelPosition === 'WR' || el.FanDuelPosition === 'wr' || el.FanDuelPosition.includes('WR') || el.FanDuelPosition.includes('wr');
                        }));
                    } if(keyList[i] === 'te'){
                        teArray = (player_obj.players.filter(function (el){
                            return el.FanDuelPosition === 'TE' || el.FanDuelPosition === 'te' || el.FanDuelPosition.includes('TE') || el.FanDuelPosition.includes('te');
                        }));
                    } if(keyList[i] === 'k'){
                        kArray = (player_obj.players.filter(function (el){
                            return el.FanDuelPosition === 'K' || el.FanDuelPosition === 'k' || el.FanDuelPosition.includes('K') || el.FanDuelPosition.includes('k');
                        }));
                    } if(keyList[i] === 'dst'){
                        dstArray = (player_obj.players.filter(function (el){
                            return el.FanDuelPosition === 'DST' || el.FanDuelPosition === 'dst' || el.FanDuelPosition.includes('DST') || el.FanDuelPosition.includes('dst');
                        }));
                    }
                }

                newArray = newArray.concat(qbArray, rbArray,wrArray, teArray, kArray, dstArray);
                if(keyList.length <=0){
                    newArray = this.state.players_data
                }

                newArray = new Set(newArray)
                newArray = Array.from(newArray)
                return newArray
            }

    }

    pgFilters(){
        if(pgActive){
            filter_list=this.removeArray(filter_list, 'pg');
            // filter_list.push('pg')
        }
        if(!pgActive) {
            filter_list.push('pg')
            // filter_list=this.removeArray(filter_list, 'pg');
        }
        pgActive = !pgActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){

            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.players_data,
                excelDataList: this.state.players_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            pgBtn:!this.state.pgBtn,
        })

    }

    qbFilters = () =>{
        if(qbActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'qb');
            // nflFilter_list.push('qb')
        }
        if(!qbActive) {
            nflFilter_list.push('qb')
            // nflFilter_list=this.removeArray(nflFilter_list, 'qb');
        }
        qbActive = !qbActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data,
                excelDataList: this.state.nfl_player_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            qbBtn:!this.state.qbBtn,
        })

    }

    rbFilters = () =>{
        if(rbActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'rb');
            // nflFilter_list.push('rb')
        }
        if(!rbActive) {
            nflFilter_list.push('rb')
            // nflFilter_list=this.removeArray(nflFilter_list, 'rb');
        }
        rbActive = !rbActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data,
                excelDataList: this.state.nfl_player_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            rbBtn:!this.state.rbBtn,
        })
    }

    wrFilters = () =>{
        if(wrActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'wr');
            // nflFilter_list.push('wr')
        }
        if(!wrActive) {
            nflFilter_list.push('wr')
            // nflFilter_list=this.removeArray(nflFilter_list, 'wr');
        }
        wrActive = !wrActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data,
                excelDataList: this.state.nfl_player_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            wrBtn:!this.state.wrBtn,
        })
    }

    teFilters = () =>{
        if(teActive){
            // nflFilter_list.push('te')
            nflFilter_list=this.removeArray(nflFilter_list, 'te');

        }
        if(!teActive) {
            nflFilter_list.push('te')
            // nflFilter_list=this.removeArray(nflFilter_list, 'te');
        }
        teActive = !teActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data,
                excelDataList: this.state.nfl_player_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            teBtn:!this.state.teBtn,
        })
    }

    kFilters = () =>{
        if(kActive){
            nflFilter_list=this.removeArray(nflFilter_list, 'k');
            // nflFilter_list.push('k')
        }
        if(!kActive) {
            nflFilter_list.push('k')
            // nflFilter_list=this.removeArray(nflFilter_list, 'k');
        }
        kActive = !kActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data,
                excelDataList: this.state.nfl_player_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            kBtn:!this.state.kBtn,
        })
    }

    dstFilters = () =>{
        if(dstActive){
            // nflFilter_list.push('dst')
            nflFilter_list=this.removeArray(nflFilter_list, 'dst');

        }
        if(!dstActive) {
            nflFilter_list.push('dst')
            // nflFilter_list=this.removeArray(nflFilter_list, 'dst');
        }
        dstActive = !dstActive
        let filter_data = this.nflFilterObj(nflFilter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.nfl_player_data,
                excelDataList: this.state.nfl_player_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            dstBtn:!this.state.dstBtn,
        })
    }

    sgFilters(){
        if(sgActive){
            filter_list=this.removeArray(filter_list, 'sg');
            // filter_list.push('sg')
        }
        if(!sgActive) {
            filter_list.push('sg')
            // filter_list=this.removeArray(filter_list, 'sg');
        }
        sgActive = !sgActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.players_data,
                excelDataList: this.state.players_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            sgBtn:!this.state.sgBtn,
        })
    }

    sfFilters(){
        if(sfActive){
            filter_list=this.removeArray(filter_list, 'sf');
            // filter_list.push('sf')
        }
        if(!sfActive) {
            filter_list.push('sf')
            // filter_list=this.removeArray(filter_list, 'sf');
        }
        sfActive = !sfActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.players_data,
                excelDataList: this.state.players_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            sfBtn:!this.state.sfBtn,
        })
    }

    pfFilters(){
        if(pfActive){
            filter_list=this.removeArray(filter_list, 'pf');
            // filter_list.push('pf')
        }
        if(!pfActive) {
            filter_list.push('pf')
            // filter_list=this.removeArray(filter_list, 'pf');
        }
        pfActive = !pfActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.players_data,
                excelDataList: this.state.players_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            pfBtn:!this.state.pfBtn,
        })

    }

    cFilters(){
        if(cActive){
            filter_list=this.removeArray(filter_list, 'c');
            // filter_list.push('c')
        }
        if(!cActive) {
            filter_list.push('c')
            // filter_list=this.removeArray(filter_list, 'c');
        }
        cActive = !cActive
        let filter_data = this.filterObj(filter_list)
        if(filter_data.length > 0){
            this.setState({filter_player:filter_data,
                excelDataList: filter_data,})
        }
        else{
            this.setState({filter_player:this.state.players_data,
                excelDataList: this.state.players_data,})
        }
        this.setState({
            allBtn:false,
            allClearBtn:false,
            cBtn:!this.state.cBtn,
        })
    }

    allSelectFilter(){
        if(this.state.nflAction){
            nflFilter_list = ['qb', 'rb', 'wr', 'te', 'k', 'dst']
            qbActive=true
            rbActive=true
            wrActive=true
            teActive=true
            kActive=true
            dstActive=true
            this.setState({filter_player:this.state.nfl_player_data,
                excelDataList: this.state.nfl_player_data,
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
            this.setState({filter_player:this.state.players_data,
                excelDataList: this.state.players_data,
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
            pgActive=false
            sgActive=false
            sfActive=false
            pfActive=false
            cActive=false
            nflFilter_list = []
            this.setState({filter_player:[],
                // excelDataList: [],
                excelDataList: this.state.nfl_player_data,
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
            filter_list = []
            qbActive=false
            rbActive=false
            wrActive=false
            teActive=false
            kActive=false
            dstActive=false
            console.log("Players_Data", this.state.players_data)
            this.setState({filter_player:[],
                // excelDataList: [],
                excelDataList: this.state.players_data,
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
        this.getCustomDfsData({user: {id: 'Master'}, sportView: this.state.is_nbaNfl})
    }

    handleChange (event) {
        this.setState({ filter: event.target.value });
        let searching_data = this.state.search_player_data
        function filterByValue(searching_data, term) {
            term = term.toLowerCase()
            let ans = searching_data.filter(function(v,i) {
                if((v.Name || v.Team) === undefined){
                    return false
                }
                   else if (v.Name.toLowerCase().indexOf(term) >= 0) {
                        return true;
                    }
                    else return v.Team.toLowerCase().indexOf(term) >= 0;
            });
            return ans
        }
        let search_filter = filterByValue(searching_data, event.target.value);
        this.setState({filter_player:search_filter, excelDataList: search_filter})


    };

    dkSalary = event => {
        this.setState({salary:'dk'}, () => console.log(this.state.salary))
    }
    fdSalary = event => {
        this.setState({salary:'fd'}, () => console.log(this.state.salary))
    }

    handlePlayerStats = (playerStats) =>{
        console.log(playerStats)
        console.log(this.state.is_nbaNfl)
        this.setState({spinner: true})
        let payload = {
                data:{playerStats: playerStats, user: {id: localStorage.getItem('username')}, sportView: this.state.is_nbaNfl}
            }
            // player stats api calling
            let url = '/Prod/save-player-stats'
            this.api.PostApi(payload, url)
                .then((res) => {
                    let response_data = JSON.parse(res.request.response)
                    if (res.status === 200 ) {
                        // console.log('+++++----++++', response_data.body)
                    } else if (res.request.status === 401) {
                        // console.log("login")
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
        this.setState({saveData:false})
        this.setState({spinner: false})
    }
    handleSimulations = () =>{
        toast.success("⭐ Simulation Started...");
        this.setState({simulationSpinner: true})
        if(this.state.is_nbaNfl === 'NFL') {
            let payload = {
                User: localStorage.getItem('username')
            }

            let url = '/Prod/run-simulation-nfl'
            this.api.PostApi(payload, url)
                .then((res) => {
                    let response_data = JSON.parse(res.request.response)
                    if (res.status === 200) {
                        this.getCustomDfsData({user: {id: 'Master'}, sportView: this.state.is_nbaNfl})

                        this.setState({simulationSpinner: false})
                    } else if (res.request.status === 401) {
                        // console.log("login")
                        this.props.history.push('/signin')
                        this.setState({loader: false, simulationSpinner: false})
                    } else {
                        this.setState({simulationSpinner: false, loader: false})
                        console.log(res)
                    }
                })
                .catch((error) => {
                    this.setState({simulationSpinner: false, loader: false})
                    console.log(error);
                })
        }
        else{
            let payload = {
                User: localStorage.getItem('username')
            }

            let url = '/Prod/run-simulation'
            this.api.PostApi(payload, url)
                .then((res) => {
                    let response_data = JSON.parse(res.request.response)
                    if (res.status === 200) {
                        this.getCustomDfsData({user: {id: localStorage.getItem('username')}, sportView: this.state.is_nbaNfl})
                        toast.success("⭐ Simulation Started...");
                        this.setState({simulationSpinner: false})
                    } else if (res.request.status === 401) {
                        // console.log("login")
                        this.props.history.push('/signin')
                        this.setState({loader: false, simulationSpinner: false})
                    } else {
                        this.setState({simulationSpinner: false, loader: false})
                        console.log(res)
                    }
                })
                .catch((error) => {
                    this.setState({simulationSpinner: false, loader: false})
                    console.log(error);
                })
        }
        setTimeout(() => { toast("⭐ Populating fields..."); }, 3000);


    }

    handleSaveGameData = (props) =>{
        this.setState({spinner: true})
        let payload = {
            data:{playerStats: props, user: {id: localStorage.getItem('username')}, sportView: this.state.is_nbaNfl}
        }
        // player stats api calling
        let url = '/Prod/save-game-data'
        this.api.PostApi(payload, url)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {

                    console.log('+++++----++++', response_data.body)
                } else if (res.request.status === 401) {
                    // console.log("login")
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
                                    onSaveGameData={this.handleSaveGameData}
                                    is_nbaNfl={this.state.is_nbaNfl}
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
                                    nfl_player_data={this.state.nfl_player_data}
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
                            salary={this.state.salary}
                            filterKey={this.state.filter}
                            data={this.state.players_data}
                            inputActive={this.state.inputActive}
                            new_array={this.state.filter_player}
                            update_data={this.state.update_data}
                            nfl_player_data={this.state.nfl_player_data}
                            saveDataBtn={this.state.saveData}
                            is_nbaNfl={this.state.is_nbaNfl}
                            onSavePlayerStats={this.handlePlayerStats}
                        />
                    </div>
                </>
            )
        }
    }
}
export default DataNavBar