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

class SurvivalAnalysisIncidenceRateDifferenceDataset extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            test_data: {
                status:'',
                table: "",
                col_transormed:{}
            },
            binary_columns: [],
            columns: [],
            file_names:[],
            RiskTable:[],
            Col_transormed:[],
            selected_exposure_variable: "",
            selected_exposure_variable_wf: "",
            selected_outcome_variable: "",
            selected_outcome_variable_wf: "",
            selected_time_variable: "",
            selected_time_variable_wf: "",
            selected_reference: 0,
            selected_alpha: 0.05,
            stats_show: false,
            svg_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/Risktest.svg',
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.handleSelectOutcomeVariableChange = this.handleSelectOutcomeVariableChange.bind(this);
        this.handleSelectExposureVariableChange = this.handleSelectExposureVariableChange.bind(this);
        this.handleSelectTimeChange = this.handleSelectTimeChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectReferenceChange = this.handleSelectReferenceChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
    }

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({columns: res.data.columns})
        });
    }

    async fetchBinaryColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_binary_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({binary_columns: res.data.columns})
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
        API.get("risks",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        exposure: this.state.selected_exposure_variable_wf,
                        outcome: this.state.selected_outcome_variable_wf,
                        time: this.state.selected_time_variable_wf,
                        reference: this.state.selected_reference,
                        alpha: this.state.selected_alpha,
                        method:'incidence_rate_difference'
                        }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({RiskTable:JSON.parse(res.data.table)})
            this.setState({Col_transormed:JSON.parse(res.data.col_transormed)})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
        });
    }
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        console.log(this.state.output_return_data);
        window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
    }
    /**
     * Update state when selection changes in the form
     */
    handleSelectExposureVariableChange(event){
        this.setState( {selected_exposure_variable: event.target.value})
        this.setState( {selected_exposure_variable_wf: this.state.selected_file_name+"--"+ event.target.value})
    }
    handleSelectOutcomeVariableChange(event){
        this.setState( {selected_outcome_variable: event.target.value})
        this.setState( {selected_outcome_variable_wf: this.state.selected_file_name+"--"+ event.target.value})
    }
    handleSelectTimeChange(event){
        this.setState( {selected_time_variable: event.target.value})
        this.setState( {selected_time_variable_wf: this.state.selected_file_name+"--"+ event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    handleSelectReferenceChange(event){
        this.setState( {selected_reference: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchBinaryColumnNames()
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_exposure_variable_wf=""
            this.state.selected_outcome_variable_wf=""
            this.state.selected_time_variable_wf=""
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
                                <InputLabel id="Exposure-selector-label">Exposure Variable</InputLabel>
                                <Select
                                        labelId="Exposure-selector-label"
                                        id="Exposure-selector"
                                        value= {this.state.selected_exposure_variable}
                                        label="Exposure"
                                        onChange={this.handleSelectExposureVariableChange}
                                >
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Exposure Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Outcome Variable</InputLabel>
                                <Select
                                        labelId="Outcome-selector-label"
                                        id="Outcome-selector"
                                        value= {this.state.selected_outcome_variable}
                                        label="Outcome"
                                        onChange={this.handleSelectOutcomeVariableChange}
                                >
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Outcome variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="time-selector-label">Time Variable</InputLabel>
                                <Select
                                        labelId="time-selector-label"
                                        id="time-selector"
                                        value= {this.state.selected_time_variable}
                                        label="Time"
                                        onChange={this.handleSelectTimeChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Time variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="Alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>Alpha value to calculate two-sided Wald confidence intervals.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="reference-selector-label">Reference</InputLabel>
                                <Select
                                        labelid="reference-selector-label"
                                        id="reference-selector"
                                        value= {this.state.selected_reference}
                                        label="Reference parameter"
                                        onChange={this.handleSelectReferenceChange}
                                >
                                    <MenuItem value={"0"}><em>0</em></MenuItem>
                                    <MenuItem value={"1"}><em>1</em></MenuItem>
                                </Select>
                                <FormHelperText>Reference category for comparisons.</FormHelperText>
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
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>
                                Proceed
                            </Button>
                        </form>
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
                        <Grid>
                            <FormHelperText>Time variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_time_variable_wf}>
                                {this.state.selected_time_variable_wf}
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
                                            <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                <Grid container direction="row">
                                                    {this.state.Col_transormed.length>0 ? (
                                                            <Grid item xs={2}>
                                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                                    Encodings
                                                                    <JsonTable className="jsonResultsTable" rows = {this.state.Col_transormed}/>
                                                                </Typography>
                                                            </Grid>
                                                    ):''}
                                                    <Grid item xs={10}>
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            Estimates of Incidence Rate Difference with a (1-alpha)*100% Confidence interval.
                                                            <JsonTable className="jsonResultsTable" rows = {this.state.RiskTable}/>
                                                        </Typography>
                                                    </Grid>
                                                </Grid><hr className="result"/>
                                                <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                    <img src={this.state.svg_path + "?random=" + new Date().getTime()}
                                                         srcSet={this.state.svg_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                         loading="lazy"
                                                    />
                                                </div>
                                            </div>
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

export default SurvivalAnalysisIncidenceRateDifferenceDataset;
