import React from 'react'
import "./style.css"
class ReportBog extends React.Component {
    render() {
        return (
            <>
                <div className="container report-container">
                    <div className="row">
                        <div className="col-md-6 col-sm-6 col-xs-6">
                            <h1 className="text-left report-head">Feedback about CustomDFS</h1>
                            <form className="report-form">
                                <div className="form-group">
                                    <label>Email address</label>
                                    <input type="email" className="form-control"
                                           aria-describedby="emailHelp" placeholder="Enter email"/>
                                        <small id="emailHelp" className="form-text text-muted">We'll never share your
                                            email with anyone else.</small>
                                </div>
                                <div className="form-group">
                                    <label>Comment</label>
                                    <textarea className="form-control" rows="6"> </textarea>
                                </div>
                                <div className="form-group text-right">
                                    <button className="btn btn-primary btn-lg">Submit</button>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6 col-sm-6 col-xs-6">
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default ReportBog