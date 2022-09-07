import "./reconallvolumedatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import API from "../../../axiosInstance";


const userColumns = [
    { field: "source_basename", headerName: "Source file", maxWidth: 500, minWidth: 140, //width: 500,
        align: "left",
        headerAlign: "left",
        flex:2,
        sortable: true},
    {
        field: "structure_name",
        headerName: "Structure name",
        maxWidth: 500, minWidth: 140, //width: 500,
        align: "left",
        headerAlign: "left",
        flex:2
    },
    {
        field: "Volume",
        headerName: "Gray matter volume (mm^3)",
        maxWidth: 500, minWidth: 80, //width: 500,
        align: "center",
        headerAlign: "left",
        flex:1
    }
];

class ReconallVolumeDatatable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { reconall_volume_data: [] };
        this.fetchData = this.fetchData.bind(this);
        this.fetchData();
    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchData(url, config) {
        API.get("return_reconall_stats/structural_measurements", {}).then(res => {
            this.setState({reconall_volume_data: res.data})
        });
    }
    render () {
        return(
            <div className="datatable">
                <div className="datatableTitle">
                    Recon-All Results
                </div>
                <DataGrid
                        rowHeight={40}
                        className="datagrid"
                        rows= {this.state.reconall_volume_data}
                        columns= {userColumns}
                        pageSize= {12}
                        rowsPerPageOptions={[12]}
                />
            </div>
        );
    };
}

export default ReconallVolumeDatatable;
