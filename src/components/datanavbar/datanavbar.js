import React from 'react'
import './datanavbar.css'
import btn_img1 from '../../images/btn-img1.png'
import btn_img2 from '../../images/btn-logo2.png'
import EnhancedTableHead from "../home/dataTable";
import {Input} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import API from '../../networking/api'

class DataNavBar extends React.Component {

    api = new API()
    constructor(props) {
        super(props);
        this.state =
            {
                players_data:[
                ],
                inputActive: false,
            }
        this.myData = this.myData.bind(this)
        this.customDfs = this.customDfs.bind(this)
        this.getCustomDfsData = this.getCustomDfsData.bind(this)

    }
    componentDidMount() {
        this.getCustomDfsData();
    }
    myData(){
        this.setState({
            inputActive:true
        })
    }
    customDfs(){
        this.setState({
            inputActive:false
        })
    }

    //api calling

    getCustomDfsData(){
        // let url = '2019-MAY-30?key=11806b0dab30479187ccb5b3d0ca58c6'
        let url = ''
        this.api.GetWithParamsApi(url)
            .then((res) => {
                let response_data = JSON.parse(res.request.response)
                if (res.status === 200 ) {
                    this.setState({players_data: response_data.body})
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


    render() {
        return (
            <>

                <div className="container-fluid">
                    <div className="group-buttons">
                        <div className="common-button">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-primary active ad-group-btn" >
                                    <input type="radio" name="options" autoComplete="off" checked onClick={this.customDfs}/>
                                    <span className="btn-text">CustomDFS Data</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off" onClick={this.myData}/>
                                    <span className="btn-text">My Data</span>
                                </label>
                            </div>
                        </div>
                        <div className="common-button">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-primary active ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off" checked/>
                                    <span className="btn-img"> <img src={btn_img2} className="btn-img-logo"/></span>
                                    <span className="btn-text"> DK</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off"/>
                                   <span className="btn-img"> <img src={btn_img1} className="btn-img-logo"/></span>
                                    <span className="btn-text"> FD</span>
                                </label>
                            </div>
                        </div>
                        <div className="common-button">
                            <button className="btn btn-primary ad-group-btn">
                                <span className="btn-text">Game Data</span>
                            </button>
                        </div>
                        <div className="common-button multiple-btn">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-primary active ad-group-btn">
                                    {/*<input type="radio" name="options" autoComplete="off" checked/>*/}
                                    <span className="btn-text"> All</span>
                                </label>
                                <label className="btn btn-primary  ad-group-btn">
                                {/*<input type="radio" name="options" autoComplete="off" checked/>*/}
                                <span className="btn-text"> Clear</span>
                            </label>
                                <label className="btn btn-primary ad-group-btn">
                                    {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                    <span className="btn-text"> pg</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                    <span className="btn-text"> sg</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                    <span className="btn-text"> sf</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                    <span className="btn-text"> pf</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    {/*<input type="radio" name="options" autoComplete="off"/>*/}
                                    <span className="btn-text"> c</span>
                                </label>
                            </div>
                        </div>

                        <div className="common-button">
                            <TextField id="outlined-search" label="Search Player" className="search_input" type="search" variant="outlined" />
                        </div>
                        <div className="common-button">
                            <label className="btn btn-primary ad-group-btn">
                                <input type="file" className="ad-group-btn"/>
                                <span className="btn-text">Export</span>
                            </label>
                        </div>
                        <div className="common-button">
                            <label className="btn btn-primary active ad-group-btn">
                                <span className="btn-text">Reset Data</span>
                            </label>
                        </div>
                        <div className="common-button">
                            <label className="btn btn-primary active ad-group-btn">
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
                    <EnhancedTableHead data={this.state.players_data} inputActive={this.state.inputActive}/>
                </div>
            </>
        )
    }
}
export default DataNavBar