import React, { useState } from "react";
import API from "../../../axiosInstance";
import "./aseg.scss";


class Aseg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {aseg_path : 'http://localhost:8000/static/aseg.png',
        };
        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }

    async fetchData() {
        API.get("/return_aseg_stats"
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
