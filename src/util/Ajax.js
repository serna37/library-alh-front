import axios from "axios"

const DOMAIN = window.location.host.startsWith("localhost") ? "http://localhost:8282" : "https://neras-sta.com"

export const Ajax = {
  POST: (uri, data, callback, err) => {
    console.debug(`${DOMAIN}${uri}`)
    axios.post(`${DOMAIN}${uri}`, data)
      .then(res => {
        callback(res.data)
      })
      .catch(e => {
        console.debug(e.response.status)
        if (err === undefined || err === null) {
          return
        }
        err(e.response.data)
      })
  }
}

