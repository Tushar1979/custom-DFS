import axios from 'axios';
// import {Redirect} from "react-router";


export default class API {
    baseUrl = 'https://o2ygn3a3h3.execute-api.us-east-2.amazonaws.com/Prod/get-player-stats'

    async setToken(token) {
        try {
            await localStorage.setItem('token', token)
        } catch (error) {
            console.log(error);
        }
    }




    async GetWithParamsApi(url, params) {
        // let token = localStorage.getItem('token')
        try {
            let response = axios.get(
                this.baseUrl + url,
                {
                    // headers: {
                    //     Authorization: 'Bearer ' + token
                    // },
                    params:params
                }
            )
                .then((res) => {
                    return res
                })
                .catch((error) => {
                    return error.response
                })
            return response
        } catch (error) {
            console.log(error);
        }
    }


};