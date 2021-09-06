import axios from 'axios';
// import {Redirect} from "react-router";


export default class API {
    baseUrl = ''

    async setToken(token) {
        try {
            await localStorage.setItem('token', token)
        } catch (error) {
            console.log(error);
        }
    }

    async GetApi(url, payload) {
        // let token = localStorage.getItem('token')
        try {
            let response = axios.post(
                this.baseUrl + url,
                 payload

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

    async PostApi(data, url) {
        try {
            let response = axios.post(
                this.baseUrl + url,
                data
            )
                .then((res) => {
                    return res
                })
                .catch((error) => {
                    return error
                })
            return response
        } catch (error) {
            return error
        }
    }


};