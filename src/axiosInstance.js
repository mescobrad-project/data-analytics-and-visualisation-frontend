import axios from "axios";

let ip = "http://127.0.0.1:8000/"
if (process.env.REACT_APP_BASEURL)
{
    ip = process.env.REACT_APP_BASEURL
}

export default axios.create({
    baseURL: ip,
    withCredentials: true
});
