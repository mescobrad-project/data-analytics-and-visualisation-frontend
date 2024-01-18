import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Tabs,
    Typography
} from "@mui/material";
import qs from "qs";
import JsonTable from "ts-react-json-table";
import {CSVLink} from "react-csv";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import ProceedButton from "../../components/ui-components/ProceedButton";
import {DataGrid} from "@mui/x-data-grid";

const userColumns = [
    { field: "Source",
        headerName: "Names of the factor considered",
        align: "left",
        headerAlign: "left",
        minWidth:100,
        flex:2,
        resizable:false,
        sortable: true},
    {
        field: "SS",
        headerName: "SS",
        // width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "DF1",
        headerName: "DF1",
        // width: '5%',
        align: "center",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "DF2",
        headerName: "DF2",
        // width: '5%',
        align: "center",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "MS",
        headerName: "MS",
        // width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "F",
        headerName: "F-values",
        // width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "p-unc",
        headerName: "p-unc",
        // width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "np2",
        headerName: "np2",
        // width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "eps",
        headerName: "epsilon factor",
        // width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    }];

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

class Mixed_Anova extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            initialdataset:[],
            selected_file_name: "",
            test_data: {
                status:'',
                Dataframe:[]
            },
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_dependent_variable_wf: "",
            selected_subject_variable: "",
            selected_subject_variable_wf: "",
            selected_within_variable: "",
            selected_within_variable_wf: "",
            selected_between_factor: "",
            selected_between_factor_wf: "",
            selected_correction_factor:'True',
            selected_effsize:"np2",
            stats_show: false,
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectSubjectVariableChange = this.handleSelectSubjectVariableChange.bind(this);
        this.handleSelectWithinVariableChange = this.handleSelectWithinVariableChange.bind(this);
        this.handleSelectBetweenFactorChange = this.handleSelectBetweenFactorChange.bind(this);
        this.handleSelectCorrectionFactorChange = this.handleSelectCorrectionFactorChange.bind(this);
        this.handleSelectEffsizeChange = this.handleSelectEffsizeChange.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
    }

    /**
     * Call backend endpoint to get column names
     */
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

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        if (this.state.selected_dependent_variable===this.state.selected_between_factor)
        {
            alert("Variable <" + this.state.selected_dependent_variable +"> can not be selected as " +
                    "Dependent variable and Between factor. Please change your selection.")
            return
        }

        //TODO Check more
        // Send the request
        API.get("calculate_mixed_anova",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dependent_variable: this.state.selected_dependent_variable_wf,
                        subject:this.state.selected_subject_variable_wf,
                        within:this.state.selected_within_variable_wf,
                        between: this.state.selected_between_factor_wf,
                        correction:this.state.selected_correction_factor,
                        effsize: this.state.selected_effsize
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
        });
    }
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        console.log(this.state.output_return_data);
        window.location.replace("/")
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        this.setState( {selected_dependent_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }

    handleSelectSubjectVariableChange(event){
        this.setState( {selected_subject_variable: event.target.value})
        this.setState( {selected_subject_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectWithinVariableChange(event){
        this.setState( {selected_within_variable: event.target.value})
        this.setState( {selected_within_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectBetweenFactorChange(event){
        this.setState( {selected_between_factor: event.target.value})
        this.setState( {selected_between_factor_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectCorrectionFactorChange(event){
        this.setState( {selected_correction_factor: event.target.value})
    }
    handleSelectEffsizeChange(event){
        this.setState( {selected_effsize: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_dependent_variable_wf=""
            this.state.selected_between_factor_wf=""
            this.state.selected_subject_variable_wf=""
            this.state.selected_within_variable_wf=""
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Mixed Anova Parameterisation
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
                                <InputLabel id="column-selector-label">Dependent Variable</InputLabel>
                                <Select
                                        labelId="dependent-selector-label"
                                        id="dependent-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Dependent Variable"
                                        onChange={this.handleSelectDependentVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the dependent variable.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Subject Variable</InputLabel>
                                <Select
                                        labelId="Subject-selector-label"
                                        id="Subject-selector"
                                        value= {this.state.selected_subject_variable}
                                        label="Subject Variable"
                                        onChange={this.handleSelectSubjectVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column containing the between-subject identifier.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Within Variable</InputLabel>
                                <Select
                                        labelId="Within-selector-label"
                                        id="Within-selector"
                                        value= {this.state.selected_within_variable}
                                        label="Within Variable"
                                        onChange={this.handleSelectWithinVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column containing the within-subject factor (repeated measurements).</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Between factor</InputLabel>
                                <Select
                                        labelId="Between-selector-label"
                                        id="Between-selector"
                                        value= {this.state.selected_between_factor}
                                        label="Between factor"
                                        onChange={this.handleSelectBetweenFactorChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column containing the between factor.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="correction-selector-label">Correction</InputLabel>
                                <Select
                                        labelid="correction-selector-label"
                                        id="correction-selector"
                                        value= {this.state.selected_correction_factor}
                                        label="correction parameter"
                                        onChange={this.handleSelectCorrectionFactorChange}
                                >
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                </Select>
                                <FormHelperText>If True, return Greenhouse-Geisser corrected p-value.
                                    If ‘auto’ (default), compute Mauchly’s test of sphericity to determine whether the p-values needs to be corrected.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="effsize-selector-label">effsize</InputLabel>
                                <Select
                                        labelid="effsize-selector-label"
                                        id="effsize-selector"
                                        value= {this.state.selected_effsize}
                                        label="effsize parameter"
                                        onChange={this.handleSelectEffsizeChange}
                                >
                                    <MenuItem value={"np2"}><em>np2</em></MenuItem>
                                    <MenuItem value={"n2"}><em>n2</em></MenuItem>
                                    <MenuItem value={"ng2"}><em>ng2</em></MenuItem>
                                </Select>
                                <FormHelperText>Effect size. Must be one of ‘np2’ (partial eta-squared), ‘n2’ (eta-squared) or ‘ng2’(generalized eta-squared).</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_dependent_variable_wf.length < 1 |
                                            this.state.selected_between_factor_wf.length < 1 |
                                            this.state.selected_subject_variable_wf <1 |
                                            this.state.selected_within_variable_wf }
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>
                                Proceed >
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <hr/>
                        <Grid>
                            <FormHelperText>Dependent variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_dependent_variable_wf}>
                                {this.state.selected_dependent_variable_wf}
                            </Button>
                        </Grid>
                        <Grid>
                            <FormHelperText>Between factor =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_between_factor_wf}>
                                {this.state.selected_between_factor_wf}
                            </Button>
                        </Grid>
                        <Grid>
                            <FormHelperText>Subject Variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_subject_variable_wf}>
                                { this.state.selected_subject_variable_wf}
                            </Button>
                        </Grid>
                        <Grid>
                            <FormHelperText>Within Variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_within_variable_wf}>
                                {this.state.selected_within_variable_wf}
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
                                    <Tab label="Transformed" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid sx={{ flexGrow: 1, textAlign: "center"}}
                                      style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Box sx={{ height: 400, width: '100%' }}>
                                            <div className="datatable">
                                                {/*<p className="result_texts">Pearson’s correlation coefficient :  { this.state.test_data.DataFrame}</p>*/}
                                                <DataGrid sx={{width:'99%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}
                                                          zeroMinWidth
                                                          rowHeight={40}
                                                          className="datagrid"
                                                          rows= {this.state.test_data.Dataframe}
                                                          columns= {userColumns}
                                                          pageSize= {15}
                                                          rowsPerPageOptions={[15]}
                                                />
                                            </div>
                                            </Box>

                                    )}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset}/>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default Mixed_Anova;
