import "./reconallvolumedatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import API from "../../../axiosInstance";

class ReconallVolumeDatatable extends React.Component {
    requested_file;
    constructor(props) {
        super(props);
        this.state = { file_rows: [],
                       file_columns: []};
        this.fetchData = this.fetchData.bind(this);
        this.requested_file = this.props.requested_file
        this.fetchData();
    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchData(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_reconall_stats/table",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name: this.requested_file
                    }
                }).then(res => {
            this.setState({file_rows: res.data["table"]})
            this.setState({file_columns: res.data["columns"]})
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
                        rows= {this.state.file_rows}
                        columns= {this.state.file_columns}
                        pageSize= {12}
                        rowsPerPageOptions={[12]}
                />
            </div>
        );
    };
}

export default ReconallVolumeDatatable;
