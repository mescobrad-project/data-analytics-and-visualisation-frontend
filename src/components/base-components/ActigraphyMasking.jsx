import React from "react";
// import Plot from 'react-plotly.js';
// import actigraph1 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/1actigraphy_visualisation.png";
// import actigraph2 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/2actigraphy_visualisation.png";
// import actigraph3 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/3actigraphy_visualisation.png";
// import act from "C:/neurodesktop-storage/runtime_config/workflow_1/run_1/step_1/output/actigraphy_visualisation.png"
//import "./styles.css";
import Plot from "react-plotly.js";
import API from "../../axiosInstance";
import {GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
// import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
import {
    Button, FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Tabs, Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import {DatePicker, DateTimePicker, LoadingButton} from "@mui/lab";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import ProceedButton from "../ui-components/ProceedButton";
//import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
// import DatePicker from 'react-date-picker';
const params = new URLSearchParams(window.location.search);
const slowave_table_1_columns = [
    {
        field: "Start",
        headerName: "Start",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "NegPeak",
        headerName: "NegPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "MidCrossing",
        headerName: "MidCrossing",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PosPeak",
        headerName: "PosPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "End",
        headerName: "End",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Duration",
        headerName: "Duration",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValNegPeak",
        headerName: "ValNegPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValPosPeak",
        headerName: "ValPosPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PTP",
        headerName: "PTP",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Slope",
        headerName: "Slope",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Frequency",
        headerName: "Frequency",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "SigmaPeak",
        headerName: "SigmaPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PhaseAtSigmaPeak",
        headerName: "PhaseAtSigmaPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ndPAC",
        headerName: "ndPAC",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Stage",
        headerName: "Stage",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Channel",
        headerName: "Channel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "IdxChannel",
        headerName: "IdxChannel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
]

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

class ActigraphyMasking extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            tabvalue: 0,
            selected_file_name: "",
            file_names: [],
            results_show: false,
            inactivity_masking_period_hour: "0",
            inactivity_masking_period_minutes: "00",
            selected: "None",
            mask_period_start: "",
            mask_period_end: "",
            datepicker_start: "",
            datepicker_end: "",
            x_points: [],
            x2: "",
            data_inactivity_mask: [],
            layout_inactivity_mask: [],
            data_add_mask_period: [],
            layout_add_mask_period: [],
            configObj: {
                displayModeBar: true,
                displaylogo: true,
            },
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectInactivityMaskingPeriodHour = this.handleSelectInactivityMaskingPeriodHour.bind(this);
        this.handleSelectInactivityMaskingPeriodMinutes = this.handleSelectInactivityMaskingPeriodMinutes.bind(this);
        this.handleInactivityMask = this.handleInactivityMask.bind(this);
        this.handleMaskPeriodStartDateChange = this.handleMaskPeriodStartDateChange.bind(this);
        this.handleMaskPeriodEndDateChange = this.handleMaskPeriodEndDateChange.bind(this);
        this.handleAddMaskPeriod = this.handleAddMaskPeriod.bind(this);
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

    async handleInactivityMask() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_inactivity_mask_visualisation", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                inactivity_masking_period_hour: this.state.inactivity_masking_period_hour,
                inactivity_masking_period_minutes: this.state.inactivity_masking_period_minutes,
                dataset: this.state.selected_file_name
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_INACTIVE_MASK")
            console.log(res.data.visualisation_inactivity_mask)
            let json_response = JSON.parse(res.data.visualisation_inactivity_mask)
            this.setState({data_inactivity_mask: json_response["data"]})
            this.setState({layout_inactivity_mask: json_response["layout"]})
        });
    }

    async handleAddMaskPeriod() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_add_mask_period", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                mask_period_start: this.state.mask_period_start,
                mask_period_end: this.state.mask_period_end,
                dataset: this.state.selected_file_name
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_ADD_MASK_PERIOD")
            console.log(res.data.visualisation_add_mask_period)
            let json_response = JSON.parse(res.data.visualisation_add_mask_period)
            this.setState({data_add_mask_period: json_response["data"]})
            this.setState({layout_add_mask_period: json_response["layout"]})
        });
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            // this.setState({stats_show: false})
        })
    }

    handleSelectInactivityMaskingPeriodHour(event){
        this.setState({inactivity_masking_period_hour: event.target.value})
    }

    handleSelectInactivityMaskingPeriodMinutes(event){
        this.setState({inactivity_masking_period_minutes: event.target.value})
    }

    handleMaskPeriodStartDateChange(event){
        this.setState({mask_period_start: event.target.value})
    }

    handleMaskPeriodEndDateChange(event){
        this.setState({mask_period_end: event.target.value})
    }

    handleSelectDatePickerStartChange(event){
        this.setState({datepicker_start: event.target.value})
    }

    handleSelectDatePickerEndChange(event){
        this.setState({datepicker_end: event.target.value})
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
                <hr/>
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
                <ProceedButton></ProceedButton>
            </Grid>
                <Grid item xs={9} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Add Masking Period
                    </Typography>
                    <hr/>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Inactivity Masking" {...a11yProps(0)} />
                                <Tab label="Add Mask Period" {...a11yProps(1)} />
                            </Tabs>
                        </Box>

                    </Box>
                    <TabPanel value={this.state.tabvalue} index={0}>
                        <form onSubmit={(event) => {event.preventDefault();this.handleInactivityMask();}}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <FormHelperText>Select the period that you want to automatically visualize masking periods.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <FormControl sx={{m: 1, width:'5%'}} size={"small"}>
                                <InputLabel id="enddate-label">Hours</InputLabel>
                                <Select
                                        labelId="activitystatus-label"
                                        id="activitystatus-selector"
                                        value= {this.state.inactivity_masking_period_hour}
                                        label="activitystatus"
                                        onChange={this.handleSelectInactivityMaskingPeriodHour}
                                >
                                    <MenuItem value={"0"}><em>0</em></MenuItem>
                                    <MenuItem value={"1"}><em>1</em></MenuItem>
                                    <MenuItem value={"2"}><em>2</em></MenuItem>
                                    <MenuItem value={"3"}><em>3</em></MenuItem>
                                    <MenuItem value={"4"}><em>4</em></MenuItem>
                                    <MenuItem value={"5"}><em>5</em></MenuItem>
                                    <MenuItem value={"6"}><em>6</em></MenuItem>
                                    <MenuItem value={"7"}><em>7</em></MenuItem>
                                    <MenuItem value={"8"}><em>8</em></MenuItem>
                                    <MenuItem value={"9"}><em>9</em></MenuItem>
                                    <MenuItem value={"10"}><em>10</em></MenuItem>
                                    <MenuItem value={"11"}><em>11</em></MenuItem>
                                    <MenuItem value={"12"}><em>12</em></MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'5%'}} size={"small"}>
                                <InputLabel id="enddate-label">Minutes</InputLabel>
                                <Select
                                        labelId="activitystatus-label"
                                        id="activitystatus-selector"
                                        value= {this.state.inactivity_masking_period_minutes}
                                        label="activitystatus"
                                        onChange={this.handleSelectInactivityMaskingPeriodMinutes}
                                >
                                    <MenuItem value={"00"}><em>00</em></MenuItem>
                                    <MenuItem value={"05"}><em>05</em></MenuItem>
                                    <MenuItem value={"10"}><em>10</em></MenuItem>
                                    <MenuItem value={"15"}><em>15</em></MenuItem>
                                    <MenuItem value={"20"}><em>20</em></MenuItem>
                                    <MenuItem value={"25"}><em>25</em></MenuItem>
                                    <MenuItem value={"30"}><em>30</em></MenuItem>
                                    <MenuItem value={"35"}><em>35</em></MenuItem>
                                    <MenuItem value={"40"}><em>40</em></MenuItem>
                                    <MenuItem value={"45"}><em>45</em></MenuItem>
                                    <MenuItem value={"50"}><em>50</em></MenuItem>
                                    <MenuItem value={"55"}><em>55</em></MenuItem>
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                            <hr/>
                        </form>
                        <Plot layout={this.state.layout_inactivity_mask} data={this.state.data_inactivity_mask} config={this.state.configObj} onSelected={this.handleSelected}/>
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={1}>
                        <form onSubmit={(event) => {event.preventDefault();this.handleAddMaskPeriod();}}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <FormHelperText>Select the start and end time to visualize and apply the masking period to the dataset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <FormHelperText>The start and end times should be in the following format: 2022-07-19 09:30:00.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <label>
                                Start time:
                                <input type="text" value={this.state.mask_period_start} onChange={this.handleMaskPeriodStartDateChange} />
                                {/*<DatePicker*/}
                                {/*        selected={this.state.datepicker_start}*/}
                                {/*        value={this.state.datepicker_start}*/}
                                {/*        onChange={this.handleSelectDatePickerStartChange}*/}
                                {/*        // timeInputLabel="Time:"*/}
                                {/*        // dateFormat="MM/dd/yyyy h:mm aa"*/}
                                {/*        // showTimeInput*/}
                                {/*/>*/}
                            </label>
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <DateTimePicker label="Basic date time picker" />*/}
                            {/*</FormControl>*/}
                            {/*<FormControl sx={{m: 1, width:'2%'}} size={"small"}>*/}
                            {/*</FormControl>*/}
                            <label>
                                End time:
                                <input type="text" value={this.state.mask_period_end} onChange={this.handleMaskPeriodEndDateChange} />
                            </label>
                            <FormControl sx={{m: 1, width:'2%'}} size={"small"}>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                            <hr/>
                        </form>
                        <Plot layout={this.state.layout_add_mask_period} data={this.state.data_add_mask_period} config={this.state.configObj} onSelected={this.handleSelected}/>
                    </TabPanel>

                </Grid>

        </Grid>
        );
    }
}

export default ActigraphyMasking;
