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
import ProceedButton from "../ui-components/ProceedButton";
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

class ActigraphyFunctionPage extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            assessment_list: [],
            temp_assessment_list: [],
            first_tab_done: true,
            second_tab_done: true,
            third_tab_done: true,
            fourth_tab_done: true,
            fifth_tab_done: true,
            tabvalue: 0,
            selected_file_name: "",
            file_names: [],
            dates: [],
            results_show: false,
            start_date: "None",
            end_date: "None",
            activity_status: "REST",
            algorithm: "None",
            selected: "None",
            mask_period_start: "None",
            mask_period_end: "None",
            x_points: [],
            x2: "",
            layoutObj: {
                title: 'Line Chart',
                width: 800,
                height: 600,
            },
            dataArray: [
                {
                    type: 'scatter',
                    y: [1, 2, 1, 4, 3, 6],
                    mode: 'lines',
                },
                {
                    type: 'scatter',
                    y: [2, 7, 0, 4, 6, 2],
                    mode: 'markers',
                },
            ],
            layout_cole_kripke: [{
                title: 'Cole Kripke',
                width: 800,
                height: 600,
            }],
            data_plot_kripke: [],
            data_plot_daily: [],
            layout_daily: [],
            final_data_plot_daily: [],
            final_layout_daily: [],
            data_day_1: [],
            layout_day_1: [],
            data_day_2: [],
            layout_day_2: [],
            data_day_3: [],
            layout_day_3: [],
            data_day_4: [],
            layout_day_4: [],
            data_day_5: [],
            layout_day_5: [],
            data_day_6: [],
            layout_day_6: [],
            data_day_7: [],
            layout_day_7: [],
            data_fml: [],
            layout_fml: [],
            data_inactivity_mask: [],
            layout_inactivity_mask: [],
            data_add_mask_period: [],
            layout_add_mask_period: [],
            configObj: {
                displayModeBar: true,
                displaylogo: true,
            },
            initial_results_dataframe: [],
            final_results_dataframe: [],
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSubmitAssessment = this.handleSubmitAssessment.bind(this);
        this.handleSelectAssessmentChange = this.handleSelectAssessmentChange.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleSelectActivityStatusChange = this.handleSelectActivityStatusChange.bind(this);
        this.handleSubmitActivityStatus = this.handleSubmitActivityStatus.bind(this);
        this.handleSubmit_daily = this.handleSubmit_daily.bind(this);
        this.handleSubmitInitialDataset = this.handleSubmitInitialDataset.bind(this);
        this.handleSubmitFinalDataset = this.handleSubmitFinalDataset.bind(this);
        this.handleSubmitVisualisationResults = this.handleSubmitVisualisationResults.bind(this);
        this.handleSubmitFinalVisualisationResults = this.handleSubmitFinalVisualisationResults.bind(this);
        this.handleMaskPeriodStartDateChange = this.handleMaskPeriodStartDateChange.bind(this);
        this.handleMaskPeriodEndDateChange = this.handleMaskPeriodEndDateChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchFileNames();
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
    }

    handleSelected = (selected) => {
        console.log("Selected points", selected);
        this.setState({x_points:selected.range.x})
    };

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

    async handleSubmitVisualisationResults() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_daily_activity_activity_status_area", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("VisualisationResults")
            console.log(res.data.visualisation_figure)
            let json_response = JSON.parse(res.data.visualisation_figure)
            this.setState({data_plot_daily: json_response["data"]})
            this.setState({layout_daily: json_response["layout"]})
            this.setState({tabvalue:1})
            this.setState({second_tab_done:true})
        });
    }

    async handleSubmitFinalVisualisationResults() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_final_daily_activity_activity_status_area", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("VisualisationResults")
            console.log(res.data.visualisation_figure_final)
            let json_response = JSON.parse(res.data.visualisation_figure_final)
            this.setState({final_data_plot_daily: json_response["data"]})
            this.setState({final_layout_daily: json_response["layout"]})
            this.setState({fifth_tab_done:true})
        });
    }

    async handleSubmitAssessment() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_assessment_algorithm", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                algorithm: this.state.algorithm
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
        });
    }

    async handleSubmitActivityStatus() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/change_activity_status", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name,
                activity_status: this.state.activity_status,
                start_date: this.state.x_points[0],
                end_date: this.state.x_points[1]
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
        });
    }

    async handleSubmitInitialDataset() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_initial_dataset", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_INITIAL_DATASET")
            console.log(res.data)
            let json_response = JSON.parse(res.data.dataframe)
            console.log(json_response)
            this.setState({initial_results_dataframe: JSON.parse(res.data.dataframe)})
            console.log(this.state.initial_results_dataframe)
            this.setState({first_tab_done:true})
        });
    }

    async handleSubmitFinalDataset() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_final_dataset", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_FINAL_DATASET")
            console.log(res.data)
            let json_response = JSON.parse(res.data.dataframe)
            console.log(json_response)
            this.setState({final_results_dataframe: JSON.parse(res.data.dataframe)})
            console.log(this.state.final_results_dataframe)
            this.setState({fourth_tab_done:true})
        });
    }

    async handleSubmit_daily() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_daily_activity", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name,
                algorithm: this.state.algorithm,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_DAILY_PLOT")
            console.log(res.data.figure)

            // let a temp json response
            // parse through the res.data.figure
            // append each dictionary of the response to the temp array using data and layout
            // use setState() to set the assessment_list
            // map the assessment list to plot below in the return method

            // let temp_json_response_list = JSON.parse(res.data.figure)
            // console.log("my loop output")
            // console.log(temp_json_response_list)
            for (let i=0; i<res.data.figure.length; i++) {
                let temp_json_response = JSON.parse(res.data.figure[i])
                console.log("my loop output")
                console.log(temp_json_response)
                this.state.temp_assessment_list.push({
                    data:   temp_json_response["data"],
                    layout: temp_json_response["layout"]
                });
            }
            console.log(this.state.temp_assessment_list)
            this.setState({assessment_list:this.state.temp_assessment_list})
            // console.log(this.state.assessment_list)
            // }
            // this.setState({third_tab_done:true})

            let json_response_day_1 = JSON.parse(res.data.figure[0])
            console.log("json_response_day_1")
            console.log(json_response_day_1)
            this.setState({data_day_1: json_response_day_1["data"]})
            this.setState({layout_day_1: json_response_day_1["layout"]})
            this.setState({third_tab_done:true})

            let json_response_day_2 = JSON.parse(res.data.figure[1])
            console.log("json_response_day_2")
            console.log(json_response_day_2)
            this.setState({data_day_2: json_response_day_2["data"]})
            this.setState({layout_day_2: json_response_day_2["layout"]})
            this.setState({third_tab_done:true})

            let json_response_day_3 = JSON.parse(res.data.figure[2])
            console.log("json_response_day_3")
            console.log(json_response_day_3)
            this.setState({data_day_3: json_response_day_3["data"]})
            this.setState({layout_day_3: json_response_day_3["layout"]})
            this.setState({third_tab_done:true})

            let json_response_day_4 = JSON.parse(res.data.figure[3])
            console.log("json_response_day_4")
            console.log(json_response_day_4)
            this.setState({data_day_4: json_response_day_4["data"]})
            this.setState({layout_day_4: json_response_day_4["layout"]})
            this.setState({third_tab_done:true})

            let json_response_day_5 = JSON.parse(res.data.figure[4])
            console.log("json_response_day_5")
            console.log(json_response_day_5)
            this.setState({data_day_5: json_response_day_5["data"]})
            this.setState({layout_day_5: json_response_day_5["layout"]})
            this.setState({third_tab_done:true})

            let json_response_day_6 = JSON.parse(res.data.figure[5])
            console.log("json_response_day_6")
            console.log(json_response_day_6)
            this.setState({data_day_6: json_response_day_6["data"]})
            this.setState({layout_day_6: json_response_day_6["layout"]})
            this.setState({third_tab_done:true})

            let json_response_day_7 = JSON.parse(res.data.figure[6])
            console.log("json_response_day_7")
            console.log(json_response_day_7)
            this.setState({data_day_7: json_response_day_7["data"]})
            this.setState({layout_day_7: json_response_day_7["layout"]})
            this.setState({third_tab_done:true})

        });
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchDates()
            this.handleSubmitInitialDataset()
            // this.setState({stats_show: false})
        })
        this.setState({first_tab_done:false})
    }

    handleSelectAssessmentChange(event){
        this.setState({algorithm: event.target.value})
    }

    handleSelectStartDateChange(event){
        this.setState({start_date: event.target.value})
    }

    handleSelectEndDateChange(event){
        this.setState({end_date: event.target.value})
    }

    handleSelectActivityStatusChange(event){
        this.setState({activity_status: event.target.value})
    }

    handleMaskPeriodStartDateChange(event){
        this.setState({mask_period_start: event.target.value})
    }

    handleMaskPeriodEndDateChange(event){
        this.setState({mask_period_end: event.target.value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
        <Grid container direction="row">
            <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Actigraphies Parameterisation
                </Typography>
                <hr/>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Data Preview
                </Typography>
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
                <hr/>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Variables</span></FormHelperText>
                    <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                        Dates: {this.state.start_date} - {this.state.end_date}
                    </List>
                    <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                        Assessment Algorithm: {this.state.algorithm}
                    </List>
                </FormControl>
                <hr/>
                <form onSubmit={(event) => {event.preventDefault();this.handleSubmit_daily();this.handleSubmitVisualisationResults();}}>
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
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="rotation-label">Assessment Algorithm</InputLabel>
                        <Select
                                labelId="assessment-label"
                                id="assessment-selector"
                                value= {this.state.algorithm}
                                label="assessment"
                                onChange={this.handleSelectAssessmentChange}
                        >
                            <MenuItem value={"Cole - Kripke"}><em>Cole - Kripke</em></MenuItem>
                            <MenuItem value={"Sadeh - Scripp"}><em>Sadeh - Scripp</em></MenuItem>
                            <MenuItem value={"Oakley"}><em>Oakley</em></MenuItem>
                            <MenuItem value={"Crespo"}><em>Crespo</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the assessment algorithm to run on the dataset.</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m: 1, width:'20%'}} size={"small"} >
                        <Button variant="contained" color="primary" type="submit" onClick={() => {
                            this.setState({second_tab_done: false});
                            this.setState({third_tab_done: false});
                        }}>
                            Submit
                        </Button>
                    </FormControl>
                    <FormControl sx={{m: 1, width:'21%'}} size={"small"} >
                        <ProceedButton></ProceedButton>
                    </FormControl>
                </form>

            </Grid>
                <Grid item xs={9} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Assessment Algorithms Results
                    </Typography>
                    <hr/>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Initial Dataset" {...a11yProps(0)} />
                                <Tab label="Initial Visualisation Results" {...a11yProps(1)} />
                                <Tab label="Assessment Algorithms" {...a11yProps(2)} />
                                <Tab label="Final Dataset" {...a11yProps(3)} />
                                <Tab label="Final Visualisation Results" {...a11yProps(4)} />
                            </Tabs>
                        </Box>

                    </Box>
                    <TabPanel value={this.state.tabvalue} index={0}>
                        {!this.state.first_tab_done ? (
                                <LoadingWidget/>
                        ) : (
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initial_results_dataframe}
                                           noRowsMessage="No dataset selected" />
                        )}
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={1}>
                        {!this.state.second_tab_done ? (
                                <LoadingWidget/>
                        ) : (
                            <Plot layout={this.state.layout_daily} data={this.state.data_plot_daily} config={this.state.configObj} onSelected={this.handleSelected}/>
                        )}
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={2}>
                        {!this.state.third_tab_done ? (
                                <LoadingWidget/>
                        ) : (
                                <Grid container direction="row">
                                    <Grid item xs={7} sx={{ borderRight: "1px solid grey"}}>
                                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                            Activity & Assessment
                                        </Typography>

                                        {this.state.assessment_list.map((column) => (
                                                <Plot layout={column['layout']} data={column['data']} config={this.state.configObj} onSelected={this.handleSelected}/>
                                                // <MenuItem value={column}>{column}</MenuItem>
                                        ))}
                                    </Grid>
                                    <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                                        {/*<Plot layout={this.state.layout_day_1} data={this.state.data_day_1} config={this.state.configObj} onSelected={this.handleSelected}/>*/}
                                        <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleSubmitFinalVisualisationResults();}}>
                                            <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                                <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                                <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                                    Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                                </List>
                                            </FormControl>
                                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                                <InputLabel id="enddate-label">Activity Status</InputLabel>
                                                <Select
                                                        labelId="activitystatus-label"
                                                        id="activitystatus-selector"
                                                        value= {this.state.activity_status}
                                                        label="activitystatus"
                                                        onChange={this.handleSelectActivityStatusChange}
                                                >
                                                    <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                                    <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                                    <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                                    <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                                </Select>
                                                <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                            </FormControl>
                                            <FormControl sx={{m: 1, width:'20%'}} size={"small"} >
                                                <Button variant="contained" color="primary" type="submit" onClick={() => {
                                                    this.setState({fourth_tab_done: false});
                                                    this.setState({fifth_tab_done: false});
                                                }}>
                                                    Submit
                                                </Button>
                                            </FormControl>
                                        </form>
                                    </Grid>
                                </Grid>
                        )}

                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={3}>
                        {!this.state.fourth_tab_done ? (
                                <LoadingWidget/>
                        ) : (
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.final_results_dataframe}/>
                        )}
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={4}>
                        {!this.state.fifth_tab_done ? (
                                <LoadingWidget/>
                        ) : (
                                <Plot layout={this.state.final_layout_daily} data={this.state.final_data_plot_daily} config={this.state.configObj} onSelected={this.handleSelected}/>
                        )}
                    </TabPanel>
                </Grid>
        </Grid>
        );
    }
}

export default ActigraphyFunctionPage;
