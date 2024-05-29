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

class ActigraphyDetrendedFluctuationAnalysis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            done: true,
            tabvalue: 0,
            selected_file_name: "",
            file_names: [],
            results_show: false,
            start_date: "None",
            end_date: "None",
            selected: "None",
            dataset: "None",

            data_dfa_1: [],
            layout_dfa_1: [],
            data_dfa_2: [],
            layout_dfa_2: [],
            data_dfa_3: [],
            layout_dfa_3: [],

            configObj: {
                displayModeBar: true,
                displaylogo: true,
            },
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleDFA = this.handleDFA.bind(this);
        this.handleSelectDatasetChange = this.handleSelectDatasetChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchFileNames();
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
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

    async handleDFA() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_detrended_fluctuation_analysis", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_DFA")

            console.log(res.data.dfa_figure_1)
            let json_response_1 = JSON.parse(res.data.dfa_figure_1)
            this.setState({data_dfa_1: json_response_1["data"]})
            this.setState({layout_dfa_1: json_response_1["layout"]})

            console.log(res.data.dfa_figure_2)
            let json_response_2 = JSON.parse(res.data.dfa_figure_2)
            this.setState({data_dfa_2: json_response_2["data"]})
            this.setState({layout_dfa_2: json_response_2["layout"]})

            console.log(res.data.dfa_figure_3)
            let json_response_3 = JSON.parse(res.data.dfa_figure_3)
            this.setState({data_dfa_3: json_response_3["data"]})
            this.setState({layout_dfa_3: json_response_3["layout"]})
            this.setState({done: true})
        });
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            // this.setState({stats_show: false})
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
                    Actigraphies Analysis Parameterisation
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
                        Click here to run DFA on the selected dataset above.
                    </Typography>
                </FormControl>
                <form onSubmit={(event) => {event.preventDefault();this.handleDFA();}}>
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
                        Actigraphy Analysis Results
                    </Typography>
                    <hr/>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Detrended Fluctuation Analysis" {...a11yProps(0)} />
                            </Tabs>
                        </Box>

                    </Box>

                    <TabPanel value={this.state.tabvalue} index={0}>
                        {!this.state.done ? (
                                <LoadingWidget/>
                        ) : (
                                <Plot layout={this.state.layout_dfa_1} data={this.state.data_dfa_1} config={this.state.configObj} onSelected={this.handleSelected}></Plot>
                        )}
                        {!this.state.done ? (
                                <LoadingWidget/>
                        ) : (
                                <Plot layout={this.state.layout_dfa_2} data={this.state.data_dfa_2} config={this.state.configObj} onSelected={this.handleSelected}></Plot>
                        )}
                        {!this.state.done ? (
                                <LoadingWidget/>
                        ) : (
                                <Plot layout={this.state.layout_dfa_3} data={this.state.data_dfa_3} config={this.state.configObj} onSelected={this.handleSelected}></Plot>
                            )}
                    </TabPanel>
               </Grid>
        </Grid>
        );
    }
}

export default ActigraphyDetrendedFluctuationAnalysis;
