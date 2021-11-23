import React from 'react'
import "./style.css"
import {Link} from "react-router-dom";
import API from '../../networking/api'
const emailReg = new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]/)
class ReportBog extends React.Component {
    api = new API()
    constructor(props) {
        super(props);
        this.state={
            email:'',
            comment:'',
            emailError:false,
            process:false,
            processed:false
        }
    }
    handleSubmit = () =>{
        if(!emailReg.test(this.state.email)){
            this.setState({emailError: true})
        }
        else{
            this.setState({process:true})
            // let data = {
            //     "28fd5d118efab908cf0d4dad911ac5f4":this.state.email,
            //     "38f3676ad9cb4ccc3574ba5f183c0e4f":this.state.comment
            // }
            var axios = require('axios');
            var data = JSON.stringify({"Type":"Feedback","Email":this.state.email,"Comment":this.state.comment});

            var config = {
                method: 'post',
                url: 'https://go4tpuovr7.execute-api.us-east-2.amazonaws.com/email-sending',
                headers: {
                    'Content-Type': 'application/json'
                },
                data : data
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    console.log(error);
                });

            // this.api.PostApi(data, url)
            //     .then((res) => {
            //        // let response_data = JSON.parse(res.request.response)
            //
            //     })
            //     .catch((error) => {
            //         this.setState({loader:false,spinner: false})
            //         console.log(error);
            //     })
            setTimeout(() => { this.setState({process:false, processed:true}) }, 1000);
        }
    }
    render() {
        return (
            <div className="main_container">
                <div className="form_container">
                <div className="container report-container">
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            <h3 className="text-left report-head">
                                To report a bug, ask for help, or provide feedback about CustomDFS please fill out the form below and we will respond ASAP:
                            </h3>
                            <div className="report-form">
                                <div className="form-group">
                                    <label>Email </label>
                                    <input type="email" className="form-control"
                                           aria-describedby="emailHelp" placeholder="Enter email" onChange={e =>this.setState({email: e.target.value})}/>
                                    {this.state.emailError ?
                                        <small id="emailHelp" className="form-text text-danger">Please enter your Email.</small>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label>Comment</label>
                                    <textarea className="form-control" placeholder="Comment" rows="4" onChange={e =>this.setState({comment: e.target.value})}/>
                                </div>
                                <div className=" text-right">
                                    <button className="btn btn-info btn-lg btn-block submit_btn" onClick={this.handleSubmit} disabled={this.state.process || this.state.processed ? true: false}>
                                        {this.state.process ? 'Submitting': (
                                            this.state.processed ? 'thank You': 'Submit'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
                <div className="report-footer">
                    <div className="footer-body">
                        <Link class="report_btn btn btn-info" to="/">Return Home to Customdfs.com</Link>
                    </div>
                </div>
            </div>
        )
    }
}
export default ReportBog