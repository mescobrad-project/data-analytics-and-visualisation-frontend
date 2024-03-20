import "./samsegdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import React from "react";
import API from "../../../axiosInstance";
import {textAlign} from "@mui/system";


const userColumns = [
    { field: "line",
        headerName: "Line",
        maxWidth: 500, minWidth: 100, width: 100, sortable: true},
    {
        field: "date",
        headerName: "Date",
        maxWidth: 500, minWidth: 100, width: 100
    },
    {
        field: "time",
        headerName: "Time",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "activity",
        headerName: "Activity",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "marker",
        headerName: "Marker",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "whitelight",
        headerName: "Whitelight",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "sleep_wake",
        headerName: "Sleep/Wake",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "interval_status",
        headerName: "Interval Status",
        maxWidth: 200, minWidth: 80, width: 100
    }
];

class ActigraphyDatatable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { acti_data: [] };
        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchData(url, config) {
        API.get("return_actigraphy_data", {}).then(res => {
            console.log("res.data")
            console.log(res.data)
            this.setState({acti_data: res.data})
        });
    }
    render () {
        return(
            <div className="datatable">
                <div className="datatableTitle">
                    Actigraphy Data
                </div>
                <DataGrid
                        className="datagrid"
                        rows= {this.state.acti_data}
                        columns= {userColumns}
                        pageSize= {9}
                        rowsPerPageOptions={[9]}
                />
            </div>
        );
    };
}

export default ActigraphyDatatable;
