import React from 'react';
import API from "../../axiosInstance";
import "./normality_tests.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import ProceedButton from "../../components/ui-components/ProceedButton";

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class SurvivalAnalysisKaplanMeier extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }        this.state = {
            test_data: {
                status:'',
                survival_function:"",
                confidence_interval:"",
                event_table:"",
            },
            column_names: [],
            file_names:[],
            SurvivalFunction:[],
            ConfidenceInterval:[],
            EventTable:[],
            Conditional_time_to_event:[],
            Confidence_interval_cumulative_density:[],
            Cumulative_density:[],
            Timeline:[],
            Median_survival_time:"",
            selected_exposure_variable: "",
            selected_exposure_variable_wf: "",
            selected_outcome_variable: "",
            selected_outcome_variable_wf: "",
            selected_at_risk_counts: 'True',
            selected_alpha: 0.05,
            selected_label: null,
            stats_show: false,
            svg_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/survival_function.svg',
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectOutcomeVariableChange = this.handleSelectOutcomeVariableChange.bind(this);
        this.handleSelectExposureVariableChange = this.handleSelectExposureVariableChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);
        this.handleSelectAtRiskCountsChange = this.handleSelectAtRiskCountsChange.bind(this);
        // this.fetchBinaryColumnNames();
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
        });
    }
    async fetchFileNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_all_files",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({file_names: res.data.files})
        });
    }
    async fetchDatasetContent() {
        const params = new URLSearchParams(window.location.search);
        API.get("return_dataset",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:0})
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("kaplan_meier",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        column_1: this.state.selected_exposure_variable_wf,
                        column_2: this.state.selected_outcome_variable_wf,
                        at_risk_counts: this.state.selected_at_risk_counts,
                        label:this.state.selected_label,
                        alpha: this.state.selected_alpha,
                        }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({SurvivalFunction:JSON.parse(res.data.survival_function)})
            this.setState({ConfidenceInterval:JSON.parse(res.data.confidence_interval)})
            this.setState({EventTable:JSON.parse(res.data.event_table)})
            this.setState({Conditional_time_to_event:JSON.parse(res.data.conditional_time_to_event)})
            this.setState({Confidence_interval_cumulative_density:JSON.parse(res.data.confidence_interval_cumulative_density)})
            this.setState({Cumulative_density:JSON.parse(res.data.cumulative_density)})
            this.setState({Timeline:JSON.parse(res.data.timeline)})
            this.setState({Median_survival_time:res.data.median_survival_time})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
        });
    }
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        // We changed info file uploading process to the DataLake
        // const file_to_output= window.localStorage.getItem('MY_APP_STATE');
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        console.log(this.state.output_return_data);
        API.get("/task/complete", {
            params: {
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }

    }).then(res => {
            window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
        });
    }
    /**
     * Update state when selection changes in the form
     */
    handleSelectExposureVariableChange(event){
        this.setState( {selected_exposure_variable: event.target.value})
        this.setState( {selected_exposure_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectOutcomeVariableChange(event){
        this.setState( {selected_outcome_variable: event.target.value})
        this.setState( {selected_outcome_variable_wf: this.state.selected_file_name+"--"+ event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    handleSelectAtRiskCountsChange(event){
        this.setState( {selected_at_risk_counts: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectLabelChange(event){
        this.setState({selected_label:event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_exposure_variable_wf=""
            this.state.selected_outcome_variable_wf=""
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", minWidth: 120}} noWrap>
                            Insert Parameters
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
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
                                <InputLabel id="column-selector-label">Status</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_exposure_variable}
                                        label="Column"
                                        onChange={this.handleSelectExposureVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Status Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Duration</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_outcome_variable}
                                        label="Column"
                                        onChange={this.handleSelectOutcomeVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Duration variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="Alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>The alpha value associated with the confidence intervals.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="label-selector-label"
                                        id="label-selector"
                                        value= {this.state.selected_label}
                                        label="Label"
                                        onChange={this.handleSelectLabelChange}
                                />
                                <FormHelperText>Provide a new label for the estimate.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="alpha-selector-label">at_risk_counts</InputLabel>
                                <Select
                                        labelid="at_risk_counts-selector-label"
                                        id="at_risk_counts-selector"
                                        value= {this.state.selected_at_risk_counts}
                                        label="at risk counts parameter"
                                        onChange={this.handleSelectAtRiskCountsChange}
                                >
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                </Select>
                                <FormHelperText>Show group sizes at time points.</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_exposure_variable_wf.length < 1 |
                                            this.state.selected_outcome_variable_wf.length < 1
                                            }
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        <ProceedButton></ProceedButton>
                        <br/>
                        <br/>
                        <hr/>
                        <Grid>
                            <FormHelperText>Exposure variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_exposure_variable_wf}>
                                {this.state.selected_exposure_variable_wf}
                            </Button>
                        </Grid>
                        <Grid>
                            <FormHelperText>Outcome variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_outcome_variable_wf}>
                                {this.state.selected_outcome_variable_wf}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Grid>
                                                <Grid container>
                                                    <Grid item xs={7} >
                                                        <img src={this.state.svg_path + "?random=" + new Date().getTime()}
                                                                // srcSet={this.state.svg_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                        />
                                                    </Grid>
                                                    <Grid item xs={5} >
                                                        <Grid style={{alignContent:'center'}}>
                                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                                Survival Function.
                                                                <JsonTable className="jsonResultsTable" rows = {this.state.SurvivalFunction}/>
                                                            </Typography>
                                                        </Grid>
                                                        <Grid style={{alignContent:'center'}}>
                                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            Cumulative density.
                                                            <JsonTable className="jsonResultsTable" rows = {this.state.Cumulative_density}/>
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <hr className="result"/>
                                                <Grid>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                        Event Table.
                                                    <JsonTable className="jsonResultsTable" rows = {this.state.EventTable}/>
                                                    </Typography>
                                                </Grid>
                                                <hr className="result"/>
                                                <Grid>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                        Conditional time to event.
                                                        <JsonTable className="jsonResultsTable" rows = {this.state.Conditional_time_to_event}/>
                                                    </Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                        Median survival time = {this.state.Median_survival_time} </Typography>
                                                </Grid>
                                                <hr className="result"/>
                                                <Grid container>
                                                    <Grid item xs={6}>
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            Confidence Interval.
                                                            <JsonTable className="jsonResultsTable" rows = {this.state.ConfidenceInterval}/>
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            Confidence Interval cumulative density.
                                                        <JsonTable className="jsonResultsTable" rows = {this.state.Confidence_interval_cumulative_density}/>
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default SurvivalAnalysisKaplanMeier;
