import "./samsegdatatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import API from "../../../axiosInstance";

// const SamsegDatatable = () => {
//     const [data, setData] = useState(userRows);
//
//     const handleDelete = (id) => {
//         setData(data.filter((item) => item.id !== id));
//     };
const userColumns = [
    { field: "measure", headerName: "Measure", width: 200 },
    {
        field: "value",
        headerName: "Value",
        width: 100,
    },
    {
        field: "unit",
        headerName: "Unit",
        width: 100,
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
        // let tb_data = this.state.samseg_data.map((item) => {
        //     <div>
        //         <p><strong>Unit : </strong>{item['unit']}</p>
        //     </div>
        // }
        // )
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
