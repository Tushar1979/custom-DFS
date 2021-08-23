import React from 'react'
import './datanavbar.css'
import btn_img1 from '../../images/btn-img1.png'
import btn_img2 from '../../images/btn-logo2.png'
class DataNavBar extends React.Component {
    render() {
        return (
            <>
                <div className="container-fluid">
                    <div className="group-buttons">
                        <div className="common-button">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-primary active ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off" checked/>
                                    <span className="btn-text">CustomDFS Data</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off"/>
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
                        <div className="common-button">
                            <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                <label className="btn btn-primary active ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off" checked/>
                                    <span className="btn-text"> All</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off"/>
                                    <span className="btn-text"> pg</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off"/>
                                    <span className="btn-text"> sg</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off"/>
                                    <span className="btn-text"> sf</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off"/>
                                    <span className="btn-text"> pf</span>
                                </label>
                                <label className="btn btn-primary ad-group-btn">
                                    <input type="radio" name="options" autoComplete="off"/>
                                    <span className="btn-text"> c</span>
                                </label>
                            </div>
                        </div>

                        <div className="common-button">
                            <input type="text" className="ad-group-btn" placeholder="Search Player"/>
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
            </>
        )
    }
}
export default DataNavBar