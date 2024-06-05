import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import API from "../../axiosInstance";
import {DataGrid, GridCell, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, Tab, Tabs, TextField, Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import {LoadingButton} from "@mui/lab";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import ReactLoading from "react-loading";
import LoadingWidget from "../ui-components/LoadingWidget";
const params = new URLSearchParams(window.location.search);

function CustomToolbar() {
    return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
    );
}

async function redirectToPage(workflow_id, run_id, step_id, function_name, bucket, file) {
    // Send the request
    let files_to_send = []
    for (let it=0 ; it< bucket.length;it++){
        files_to_send.push([bucket[it], file[it]])
    }

    API.put("function/navigation/",
            {
                workflow_id: workflow_id,
                run_id: run_id,
                step_id: step_id,
                function: function_name,
                metadata: {
                    // [["saved"] , "demo_sample_questionnaire.csv"],
                    "files": files_to_send
                },
            }
    ).then(res => {
        window.location.assign(res.data.url)
    });
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
            <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
            >
                {value === index && (
                        <Box sx={{ p: 3 }}>
                            <Typography>{children}</Typography>
                        </Box>
                )}
            </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

class ActigraphySummary extends React.Component {

    constructor(props) {
        let ip = "http://127.0.0.1:8000/"
        super(props);
        this.state = {
            done: true,
            tabvalue: 0,
            start_date: "",
            end_date: "",
            selected_file_name: "",
            file_names: [],
            dates: [],
            results_dataframe: [],
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleActigraphySummaries = this.handleActigraphySummaries.bind(this);
        this.handleSelectDatasetChange = this.handleSelectDatasetChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchFileNames();
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
    }

    async fetchDates(url, config) {
        const params = new URLSearchParams(window.location.search);

        API.get("return_dates",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dataset:this.state.selected_file_name
                    }}).then(res => {
            this.setState({dates: res.data.dates})
        });
    }

    handleSelected = (selected) => {
        console.log("Selected points", selected);
        this.setState({x_points:selected.range.x})
    };

    handleSelectDatasetChange(event){
        this.setState({dataset: event.target.value})
    }

    async fetchFileNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_all_files",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }
                }).then(res => {
            this.setState({file_names: res.data.files})
        });
    }

    async handleActigraphySummaries() {
        const params = new URLSearchParams(window.location.search);
        API.get("/actigraphy_summary_table", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_SUMMARIES")
            console.log(res.data)
            let json_response = JSON.parse(res.data.summary_dataframe)
            console.log(json_response)
            this.setState({results_dataframe: JSON.parse(res.data.summary_dataframe)})
            console.log(this.state.results_dataframe)
            // let json_response_duration = JSON.parse(res.data.duration)
            // this.setState({duration: json_response_duration})
            this.setState({done: true})
        });
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchDates()
            // this.setState({done: false})
        })
    }

    handleSelectStartDateChange(event){
        this.setState({start_date: event.target.value})
    }

    handleSelectEndDateChange(event){
        this.setState({end_date: event.target.value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
        <Grid container direction="row">
            <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Actigraphies Summary Table Parameterisation
                </Typography>
                <hr/>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Data Preview
                    </Typography>
                </FormControl>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                    <InputLabel id="file-selector-label">File</InputLabel>
                    <Select
                            labelId="file-selector-label"
                            id="file-selector"
                            value= {this.state.selected_file_name}
                            label="File Variable"
                            onChange={this.handleSelectFileNameChange}
                    >
                        {this.state.file_names.map((column) => (
                                <MenuItem value={column}>{column}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select dataset.</FormHelperText>
                </FormControl>

                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                        Click here to produce a summary table on the selected dataset above.
                    </Typography>
                </FormControl>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                    <InputLabel id="startdate-label">Start Date</InputLabel>
                    <Select
                            labelId="startdate-label"
                            id="startdate-selector"
                            value= {this.state.start_date}
                            label="startdate"
                            onChange={this.handleSelectStartDateChange}
                    >
                        {this.state.dates.map((column) => (
                                <MenuItem value={column}>
                                    {column}
                                </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                </FormControl>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                    <InputLabel id="enddate-label">End Date</InputLabel>
                    <Select
                            labelId="enddate-label"
                            id="enddate-selector"
                            value= {this.state.end_date}
                            label="enddate"
                            onChange={this.handleSelectEndDateChange}
                    >
                        {this.state.dates.map((column) => (
                                <MenuItem value={column}>
                                    {column}
                                </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                </FormControl>
                <form onSubmit={(event) => {event.preventDefault();this.handleActigraphySummaries();}}>
                    <FormControl sx={{m: 1, width:'20%'}} size={"small"} >
                        <Button variant="contained" color="primary" type="submit" onClick={() => {
                            this.setState({done: false});
                        }}>
                            Submit
                        </Button>
                    </FormControl>
                    <hr/>
                </form>
            </Grid>
               <Grid item xs={9} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Summary Table
                    </Typography>
                   <hr/>
                    {!this.state.done ? (
                            <LoadingWidget/>
                    ) : (
                            <JsonTable className="jsonResultsTable"
                                       rows = {this.state.results_dataframe}
                                       noRowsMessage="No dataset selected" />
                    )}
               </Grid>
        </Grid>
        );
    }
}

export default ActigraphySummary;
