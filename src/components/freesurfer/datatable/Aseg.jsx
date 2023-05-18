import React, { useState } from "react";
import API from "../../../axiosInstance";
import "./aseg.scss";

class Aseg extends React.Component {
    constructor(props) {
        super(props);
        let ip = "http://127.0.0.1:8000/";
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {aseg_path : ip + 'static/aseg.png',
        };
        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }

    async fetchData() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_aseg_stats",{
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }
        )}
    render () {
        return(
                <img src={this.state.aseg_path}
                     srcSet={this.state.aseg_path}
                />
        );
    };
}

export default Aseg;
