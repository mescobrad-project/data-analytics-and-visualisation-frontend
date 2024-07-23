import "./samsegdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import React from "react";
import API from "../../../axiosInstance";
import { textAlign } from "@mui/system";
import ProceedButton from "../../ui-components/ProceedButton";
import { Button } from "@mui/material";
import { Box } from "@mui/system";

const userColumns = [
    { field: "measure", headerName: "Measure", maxWidth: 500, minWidth: 140, width: 500, sortable: true },
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
        this.redirectToPage = this.redirectToPage.bind(this);
        this.fetchData();
    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchData(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_samseg_result", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                file_name: this.requested_file
            }
        }).then(res => {
            this.setState({ samseg_data: res.data })
        });
    }

    async redirectToPage(function_name, bucket, file) {
        // Send the request
        const params = new URLSearchParams(window.location.search);
        let files_to_send = []
        for (let it = 0; it < bucket.length; it++) {
            files_to_send.push([bucket[it], file[it]])
        }
        console.log(files_to_send)

        API.put("function/navigation/",
            {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                function: function_name,
                token: "",
                metadata: {
                    // [["saved"] , "demo_sample_questionnaire.csv"],
                    "files": files_to_send
                },
            }
        ).then(res => {
            window.location.assign(res.data.url)
        });
    }

    render() {
        return (
                <Box sx={{width: '100%'}}>
                    <div className="datatable">
                        <div className="datatableTitle">
                            Samseg Results
                        </div>
                        <DataGrid
                                className="datagrid"
                                rows={this.state.samseg_data}
                                columns={userColumns}
                                pageSize={9}
                                rowsPerPageOptions={[9]}
                        />
                    </div>
                    <br></br>
                    <br></br>
                    <Box sx={{borderTop: 1, borderColor: 'divider'}}>
                        <Button
                                variant="contained"
                                color="primary"
                                onClick={this.redirectToPage.bind(this, "free_surfer", [], [])}
                        >
                            Continue to Proceed and Upload data
                        </Button>
                    </Box>
                </Box>
        );
    }
}

export default SamsegDatatable;
