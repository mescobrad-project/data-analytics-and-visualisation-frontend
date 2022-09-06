import "./samsegdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import API from "../../../axiosInstance";


const userColumns = [
    { field: "measure", headerName: "Measure", maxWidth: 500, minWidth: 140, width: 500, sortable: true},
    {
        field: "value",
        headerName: "Value",
        maxWidth: 500, minWidth: 140, width: 500
    },
    {
        field: "unit",
        headerName: "Unit",
        maxWidth: 200, minWidth: 80, width: 200
    }
];

class SamsegDatatable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { samseg_data: [] };
        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchData(url, config) {
        API.get("return_samseg_result", {}).then(res => {
            this.setState({samseg_data: res.data})
        });
    }
    render () {
        return(
            <div className="datatable">
                <div className="datatableTitle">
                    Samseg Results
                </div>
                <DataGrid
                        className="datagrid"
                        rows= {this.state.samseg_data}
                        columns= {userColumns}
                        pageSize= {9}
                        rowsPerPageOptions={[9]}
                />
            </div>
        );
    };
}

export default SamsegDatatable;