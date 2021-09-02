// state = { loading: true };
// render() {
//     if (this.state.loading) return <Loader />;

// constructor() {
//     this.state = { isLoading: true }
// }
//
// componentDidMount() {
//     this.setState({isLoading: false})
// }
//
// render() {
//     return(
//         this.state.isLoading ? *showLoadingScreen* : *yourPage()*
// )
// }


import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import './style.css'
class AdLoader extends Component {
    render() {
        return (
            <>
                <div className="loader_container">
                <Loader type="Circles" color="#00BFFF" height={80} width={80}/>
                </div>
            </>
        )
    }
}
export default AdLoader;