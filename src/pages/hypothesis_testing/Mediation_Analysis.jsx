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
    Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import { CSVLink, CSVDownload } from "react-csv"
import qs from "qs";
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

class Mediation_Analysis extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            test_data: {
                status:'',
                Result: "",
                Result2: ""
            },
            columns: [],
            file_names:[],
            initialdataset:[],
            Results:"",
            // Results2:"",
            selected_dependent_variable: "",
            selected_dependent_variable_wf: "",
            selected_exposure_variable: "",
            selected_exposure_variable_wf: "",
            selected_mediator_variable: "",
            selected_mediator_variable_wf: [],
            selected_independent_variables: [],
            selected_independent_variables_wf: [],
            stats_show: false,
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectExposureVariableChange = this.handleSelectExposureVariableChange.bind(this);
        this.handleSelectMediatorVariableChange = this.handleSelectMediatorVariableChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.handleListMediatorDelete = this.handleListMediatorDelete.bind(this);
        this.handleDeleteMediatorVariable = this.handleDeleteMediatorVariable.bind(this);
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
        API.get("mediation_analysis",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dependent_1: this.state.selected_dependent_variable_wf,
                        exposure: this.state.selected_exposure_variable_wf,
                        mediator: this.state.selected_mediator_variable_wf,
                        independent: this.state.selected_independent_variables_wf.length >0 ? this.state.selected_independent_variables_wf : null
                },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data});
            this.setState({Results:JSON.parse(res.data.Result)});
            // this.setState({Results2:JSON.parse(res.data.Result2)});
            this.setState({stats_show: true});
            this.setState({tabvalue:1});
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
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_independent_variables_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_wf:newArray})
    }
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        this.setState( {selected_dependent_variable_wf: this.state.selected_file_name+"--"+ event.target.value})
    }
    handleSelectExposureVariableChange(event){
        this.setState( {selected_exposure_variable: event.target.value})
        this.setState( {selected_exposure_variable_wf: this.state.selected_file_name+"--"+  event.target.value})
    }
    handleSelectMediatorVariableChange(event){
        this.setState( {selected_mediator_variable: event.target.value})
        var newArray = this.state.selected_mediator_variable_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_mediator_variable_wf:newArray})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleListDelete(event) {
        var newArray = this.state.selected_independent_variables_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_independent_variables_wf:newList})
    }
    handleDeleteVariable(event) {
        this.setState({selected_independent_variables_wf:[]})
    }
    handleListMediatorDelete(event) {
        var newArray = this.state.selected_mediator_variable_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_mediator_variable_wf:newList})
    }
    handleDeleteMediatorVariable(event) {
        this.setState({selected_mediator_variable_wf:[]})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_dependent_variable_wf = ""
            this.handleDeleteMediatorVariable()
            this.state.selected_exposure_variable_wf = ""
            this.handleDeleteVariable()
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
                                <InputLabel id="outcome-selector-label">Outcome variable</InputLabel>
                                <Select
                                        labelId="outcome-selector-label"
                                        id="outcome-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Outcome"
                                        onChange={this.handleSelectDependentVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select outcome variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="predictor-selector-label">Predictor variable</InputLabel>
                                <Select
                                        labelId="predictor-selector-label"
                                        id="predictor-selector"
                                        value= {this.state.selected_exposure_variable}
                                        label="predictor"
                                        onChange={this.handleSelectExposureVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select predictor variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="mediator-selector-label">Mediator variable(s)</InputLabel>
                                <Select
                                        labelId="mediator-selector-label"
                                        id="mediator-selector"
                                        value= {this.state.selected_mediator_variable}
                                        label="mediator"
                                        onChange={this.handleSelectMediatorVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select mediator variable(s).</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Covariate variables</InputLabel>
                                <Select
                                        labelId="Covariate-selector-label"
                                        id="Covariate-selector"
                                        value= {this.state.selected_independent_variables}
                                        label="Covariate"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Covariate variables</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_dependent_variable_wf.length < 1 |
                                            this.state.selected_mediator_variable_wf.length < 1 |
                                            this.state.selected_exposure_variable_wf.length<1}
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
                            <FormHelperText>Outcome variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_dependent_variable_wf}>
                                {this.state.selected_dependent_variable_wf}
                            </Button>
                        </Grid>
                        <Grid>
                            <FormHelperText>Predictor variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_exposure_variable_wf}>
                                {this.state.selected_exposure_variable_wf}
                            </Button>
                        </Grid>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected Mediator variables [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_mediator_variable_wf.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListMediatorDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            <Button onClick={this.handleDeleteMediatorVariable}>
                                Clear all
                            </Button>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected Independent variables [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_independent_variables_wf.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            <Button onClick={this.handleDeleteVariable}>
                                Clear all
                            </Button>
                        </FormControl>
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
                                    {/*<Tab label="Transformed" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid sx={{ flexGrow: 1, textAlign: "center"}}
                                      style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                <Grid>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                        Mediation Results. </Typography>
                                                    <div style={{textAlign:"center"}}>
                                                        <JsonTable className="jsonResultsTable" rows = {this.state.Results}/>
                                                        {/*<JsonTable className="jsonResultsTable" style={{columns: '25px'}} rows = {this.state.Results2}/>*/}
                                                    </div>
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

export default Mediation_Analysis;
