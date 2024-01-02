import axios from "axios"

export function calling(url, data) {

    const host = window.location.host.startsWith("localhost") ? "http://localhost:8282/library" : "https://neras-sta.com/library"
    let token = document.cookie.split(";").map(v => v.trim()).filter(v => v.startsWith("token="))
    token = token.length === 0 ? "" : token[0].split("=")[1]
    const headers = {
        'Content-Type': 'application/json',
        'x-auth-header': sessionStorage.getItem("header"),
        'token': token
    }
    return axios.post(host + url, data, {headers: headers})
}


