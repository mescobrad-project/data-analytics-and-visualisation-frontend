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
        field: "interval_type",
        headerName: "Interval Type",
        maxWidth: 500, minWidth: 100, width: 100
    },
    {
        field: "interval",
        headerName: "Interval",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "date_start",
        headerName: "Date Start",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "time_start",
        headerName: "Time Start",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "date_stop",
        headerName: "Date Stop",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "time_stop",
        headerName: "Time Stop",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "duration",
        headerName: "Duration Status",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "invalid_sw",
        headerName: "Invalid sw",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "efficiency",
        headerName: "Efficiency",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "wake_time",
        headerName: "Wake time",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "sleep_time",
        headerName: "Sleep time",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "sleep",
        headerName: "Sleep",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "exposure_white",
        headerName: "Exposure White",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "average_white",
        headerName: "Average white",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "max_white",
        headerName: "Max White",
        maxWidth: 200, minWidth: 80, width: 100
    },{
        field: "talt_white",
        headerName: "Talt White",
        maxWidth: 200, minWidth: 80, width: 100
    },
    {
        field: "invalid_white",
        headerName: "Invalid White",
        maxWidth: 200, minWidth: 80, width: 100
    }
];

class ActigraphyGeneralDatatable extends React.Component {
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
        API.get("return_actigraphy_general_data", {}).then(res => {
            console.log("res.data")
            console.log(res.data)
            this.setState({acti_data: res.data})
        });
    }
    render () {
        return(
            <div className="datatable">
                <div className="datatableTitle">
                    Actigraphy General Data
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

export default ActigraphyGeneralDatatable;
