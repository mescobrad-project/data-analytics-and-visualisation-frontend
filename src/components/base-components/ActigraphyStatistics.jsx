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

class ActigraphyStatistics extends React.Component {

    constructor(props) {
        let ip = "http://127.0.0.1:8000/"
        super(props);
        this.state = {
            done: true,
            tabvalue: 0,
            selected_file_name: "",
            period_freq: "15",
            file_names: [],
            duration: "None",
            sleep_stats: [],
            count_trans_matrix: [],
            probs_trans_matrix: [],
            annotations: [],
            periods: [],
            actigraphy_plot_path: ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/actigraphy_hypnogram.png',
            sleep_transition_matrix_plot: ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/sleep_transition_matrix.png',
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleActigraphyStatistics = this.handleActigraphyStatistics.bind(this);
        this.handleSelectDatasetChange = this.handleSelectDatasetChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchFileNames();
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleChangePeriodFreq = this.handleChangePeriodFreq.bind(this);
    }

    handleSelected = (selected) => {
        console.log("Selected points", selected);
        this.setState({x_points:selected.range.x})
    };

    handleSelectDatasetChange(event){
        this.setState({dataset: event.target.value})
    }

    handleChangePeriodFreq(event) {
        this.setState({period_freq: event.target.value})
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

    async handleActigraphyStatistics() {
        const params = new URLSearchParams(window.location.search);
        API.get("/actigraphy_string_sleep_statistics", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name,
                period: this.state.period_freq
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_STATS")

            let json_response_duration = JSON.parse(res.data.duration)
            this.setState({duration: json_response_duration})

            console.log(JSON.parse(res.data.sleep_stats))
            let json_response_sleep_stats = JSON.parse(res.data.sleep_stats)
            this.setState({sleep_stats: json_response_sleep_stats})

            let json_response_count_trans_matrix = JSON.parse(res.data.count_trans_matrix)
            this.setState({count_trans_matrix: json_response_count_trans_matrix})

            let json_response_probs_trans_matrix = JSON.parse(res.data.probs_trans_matrix)
            this.setState({probs_trans_matrix: json_response_probs_trans_matrix})

            let json_response_annotations = JSON.parse(res.data.annotations)
            this.setState({annotations: json_response_annotations})

            let json_response_periods = JSON.parse(res.data.periods)
            this.setState({periods: json_response_periods})
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
                    Actigraphies Statistics Parameterisation
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
                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                    <TextField
                            id="period-frequency-hypnogram"
                            value= {this.state.period_freq}
                            label="Period Frequency of Hypnogram"
                            size={"small"}
                            onChange={this.handleChangePeriodFreq}
                    />
                    <FormHelperText>Select the threshold to find continuous periods of unchanged sleep stages (Default threshold is 15 minutes).</FormHelperText>
                </FormControl>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                        Click here to run statistics on the selected dataset above.
                    </Typography>
                </FormControl>
                <form onSubmit={(event) => {event.preventDefault();this.handleActigraphyStatistics();}}>
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
                        Actigraphy Statistics Results
                    </Typography>
                    <hr/>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="General statistics" {...a11yProps(0)} />
                                <Tab label="Transition matrix results" {...a11yProps(1)} />
                                <Tab label="Stages plot" {...a11yProps(2)} />
                            </Tabs>
                        </Box>

                    </Box>

                    <TabPanel value={this.state.tabvalue} index={0}>
                        <Grid container direction="row">
                            <Grid item xs={12} sx={{ borderRight: "1px solid grey"}}>
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                                    The total duration of the hypnogram calculated in minutes is: {this.state.duration}
                                </Typography>
                            </Grid>
                        </Grid>
                        <hr/>
                        <Grid container direction="row">

                            <Grid item xs={12} sx={{ borderRight: "1px solid grey"}}>
                                {/*{this.state.sleep_stats}*/}
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                    The calculated sleep statistics of the dataset
                                </Typography>
                                {!this.state.done ? (
                                        <LoadingWidget/>
                                ) : (
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.sleep_stats}/>
                                    )}
                            </Grid>
                        </Grid>

                        <hr/>

                        <Grid container direction="row">
                            <Grid item xs={6} sx={{ borderRight: "1px solid grey"}}>
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                    The calculated annotations of the dataset
                                </Typography>
                                {!this.state.done ? (
                                        <LoadingWidget/>
                                ) : (
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.annotations}/>
                                    )}
                            </Grid>
                            <Grid item xs={6} sx={{ borderRight: "1px solid grey"}}>
                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                    Points where the activity status changed on a specific minute time frame
                                </Typography>
                                {!this.state.done ? (
                                        <LoadingWidget/>
                                ) : (
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.periods}/>
                                    )}
                            </Grid>
                        </Grid>
                    </TabPanel>

                   <TabPanel value={this.state.tabvalue} index={1}>
                       <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                           Sleep statistics transition matrix
                       </Typography>
                       <Grid container direction="row">
                           <Grid item xs={6} sx={{ borderRight: "1px solid grey"}}>
                           {!this.state.done ? (
                                   <LoadingWidget/>
                           ) : (
                                   <img src={this.state.sleep_transition_matrix_plot + "?random=" + new Date().getTime()}
                                        srcSet={this.state.sleep_transition_matrix_plot + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                        loading="lazy"
                                        align={'center'}
                                   />
                           )}
                           </Grid>
                       </Grid>
                       <Grid container direction="row">
                           <Grid item xs={6} sx={{ borderRight: "1px solid grey"}}>
                               {/*<Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                               {/*    The calculated duration of records*/}
                               {/*</Typography>*/}
                               {/*{"Duration: " + this.state.duration}*/}
                               <Grid container direction="col">
                                   <Grid item xs={6} sx={{ borderRight: "1px solid grey"}}>
                                       <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                           The count transition matrix
                                       </Typography>
                                       {!this.state.done ? (
                                               <LoadingWidget/>
                                       ) : (
                                               <JsonTable className="jsonResultsTable"
                                                          rows = {this.state.count_trans_matrix}/>
                                       )}
                                   </Grid>
                                   <Grid item xs={6} sx={{ borderRight: "1px solid grey"}}>
                                       <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                           The probability transition matrix
                                       </Typography>
                                       {!this.state.done ? (
                                               <LoadingWidget/>
                                       ) : (
                                               <JsonTable className="jsonResultsTable"
                                                          rows = {this.state.probs_trans_matrix}/>
                                       )}
                                   </Grid>
                               </Grid>
                           </Grid>
                       </Grid>

                   </TabPanel>

                   <TabPanel value={this.state.tabvalue} index={2}>
                       <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                           Plot showing the activity status stages hypnogram (WAKE, NREM, REM)
                       </Typography>
                       {!this.state.done ? (
                               <LoadingWidget/>
                       ) : (
                               <img src={this.state.actigraphy_plot_path + "?random=" + new Date().getTime()}
                                    srcSet={this.state.actigraphy_plot_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                    loading="lazy"
                                    align={'center'}
                               />
                       )}
                   </TabPanel>
               </Grid>
        </Grid>
        );
    }
}

export default ActigraphyStatistics;
