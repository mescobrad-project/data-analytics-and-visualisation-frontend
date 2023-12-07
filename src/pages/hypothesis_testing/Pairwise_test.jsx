import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Tabs, TextField,
    Typography
} from "@mui/material";
import qs from "qs";
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import PropTypes from "prop-types";

// const userColumns = [
//     { field: "Contrast",
//         headerName: "Contrast",
//         align: "right",
//         headerAlign: "center",
//         flex:0.8,
//         resizable:false,
//         sortable: true},
//     {
//         field: "A",
//         headerName: "1st measurement",
//         // width: '10%',
//         align: "right",
//         headerAlign: "center",
//         flex:1,
//         type: "number"
//     }];
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
class Pairwise_test extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            user_columns: [],
            file_names:[],
            initialdataset:[],
            test_data: {
                status:'',
                DataFrame:[],
                Columns:[],
            },
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_dependent_variable_wf: "",
            selected_between_variables: "",
            selected_between_variables_wf: [],
            selected_within_variables: "",
            selected_within_variables_wf: [],
            selected_subject: "",
            selected_subject_wf: "",
            selected_marginal:"True",
            selected_alpha:"0.05",
            selected_alternative:"two-sided",
            selected_padjust:"none",
            selected_effsize:"hedges",
            selected_correction:"auto",
            selected_nan_policy:"listwise",
            stats_show:false,
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleBetweenDelete = this.handleBetweenDelete.bind(this);
        this.handleWithinDelete = this.handleWithinDelete.bind(this);
        this.handleDeleteAllBetween = this.handleDeleteAllBetween.bind(this);
        this.handleDeleteAllWithin = this.handleDeleteAllWithin.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectBetweenVariableChange = this.handleSelectBetweenVariableChange.bind(this);
        this.handleSelectWithinVariableChange = this.handleSelectWithinVariableChange.bind(this);
        this.handleSelectSubjectChange = this.handleSelectSubjectChange.bind(this);
        this.handleSelectMarginalChange = this.handleSelectMarginalChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
        this.handleSelectPadjustChange = this.handleSelectPadjustChange.bind(this);
        this.handleSelectEffsizeChange = this.handleSelectEffsizeChange.bind(this);
        this.handleSelectCorrectionChange = this.handleSelectCorrectionChange.bind(this);
        this.handleSelectNanPolicyChange = this.handleSelectNanPolicyChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.returnUserCols = this.returnUserCols.bind(this);
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

        // Send the request
        API.get("anova_pairwise_tests",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dv: this.state.selected_dependent_variable_wf,
                        between: this.state.selected_between_variables_wf,
                        within: this.state.selected_within_variables_wf,
                        subject: this.state.selected_subject_wf,
                        marginal: this.state.selected_marginal,
                        alpha: this.state.selected_alpha,
                        alternative: this.state.selected_alternative,
                        padjust: this.state.selected_padjust,
                        effsize: this.state.selected_effsize,
                        correction: this.state.selected_correction,
                        nan_policy: this.state.selected_nan_policy,
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            console.log(res)
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
            this.setState({tabvalue:1});
            this.returnUserCols(res.data);
        })
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
        window.location.replace("/")
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        this.setState( {selected_dependent_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectBetweenVariableChange(event){
        this.setState( {selected_between_variables: event.target.value})
        var newArray = this.state.selected_between_variables_wf.slice();
        if (event.target.value === "None")
        {
            newArray = [this.state.selected_file_name+"--"+event.target.value]
        }
        else if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1) {
            const ind = newArray.indexOf(this.state.selected_file_name + "--" + "None");
            newArray = newArray.filter((x, index) => {
                return index !== ind
            })
            newArray.push(this.state.selected_file_name + "--" + event.target.value);

        }

        this.setState({selected_between_variables_wf:newArray})
    }

    handleSelectWithinVariableChange(event) {
        this.setState({selected_within_variables: event.target.value})
        var newArray = this.state.selected_within_variables_wf.slice();
        if (event.target.value === "None") {
            newArray = [this.state.selected_file_name + "--" + event.target.value]
        } else if (newArray.indexOf(this.state.selected_file_name + "--" + event.target.value) === -1) {
            const ind = newArray.indexOf(this.state.selected_file_name + "--" + "None");
            newArray = newArray.filter((x, index) => {
                return index !== ind
            })
            newArray.push(this.state.selected_file_name + "--" + event.target.value);

        }
        this.setState({selected_within_variables_wf: newArray})
    }

    handleSelectSubjectChange(event) {
        this.setState({selected_subject: event.target.value})
        this.setState({selected_subject_wf: this.state.selected_file_name + "--" + event.target.value})
    }

    handleSelectMarginalChange(event){
        this.setState( {selected_marginal: event.target.value})
    }

    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }

    returnUserCols(arr){
        let local = []
        arr.Columns.forEach((column, index) => {
            local.push(
                    {
                        field: column.col,
                        headerName: column.col,
                        align: "right",
                        headerAlign: "center",
                    }
            );
        })
        console.log(local)
        console.log(this.state.user_columns)
        this.setState({user_columns: local})
    }

    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
    }
    handleSelectEffsizeChange(event){
        this.setState( {selected_effsize: event.target.value})
    }

    handleSelectPadjustChange(event){
    this.setState( {selected_padjust: event.target.value})
    }

    handleSelectCorrectionChange(event){
        this.setState( {selected_correction: event.target.value})
    }

    handleSelectNanPolicyChange(event){
    this.setState( {selected_nan_policy: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleBetweenDelete(event) {
        var newArray = this.state.selected_between_variables_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_between_variables_wf:newList})
    }
    handleWithinDelete(event) {
        var newArray = this.state.selected_within_variables_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_within_variables_wf:newList})
    }
    handleDeleteAllBetween(event) {
        this.setState({selected_between_variables_wf:[]})
    }
    handleDeleteAllWithin(event) {
        this.setState({selected_within_variables_wf:[]})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_within_variables_wf=""
            this.state.selected_subject_wf=""
            this.state.selected_dependent_variable_wf=""
            this.state.selected_between_variables_wf=""
            this.handleDeleteAllWithin()
            this.handleDeleteAllBetween()
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Pairwise Tests
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
                                <InputLabel id="between-selector-label">Between Variable(s)</InputLabel>
                                <Select
                                        labelId="between-selector-label"
                                        id="between-selector"
                                        value= {this.state.selected_between_variables}
                                        label="Between Variable(s)"
                                        onChange={this.handleSelectBetweenVariableChange}
                                >
                                    <MenuItem value={"None"}><em>None</em></MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select between variable(s)</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="within-selector-label">Within Variable(s)</InputLabel>
                                <Select
                                        labelId="within-selector-label"
                                        id="within-selector"
                                        value= {this.state.selected_within_variables}
                                        label="Within Variable(s)"
                                        onChange={this.handleSelectWithinVariableChange}
                                >
                                    <MenuItem value={"None"}><em>None</em></MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select within variable(s)</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="subject-selector-label">Subject</InputLabel>
                                <Select
                                        labelId="subject-selector-label"
                                        id="subject-selector"
                                        value= {this.state.selected_subject}
                                        label="Subject"
                                        onChange={this.handleSelectSubjectChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the subject.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="marginal-selector-label">marginal</InputLabel>
                                <Select
                                        labelid="marginal-selector-label"
                                        id="marginal-selector"
                                        value= {this.state.selected_marginal}
                                        label="Marginal parameter"
                                        onChange={this.handleSelectMarginalChange}
                                >
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>If True, the between-subject pairwise T-test(s) will be calculated after averaging across all levels of the within-subject factor in mixed design</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="alpha-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        inputProps={{pattern: "[0-9]*[.]?[0-9]+"}}
                                        label="Alpha"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>Significance level </FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="alternative-selector-label">Alternative</InputLabel>
                                <Select
                                        labelid="alternative-selector-label"
                                        id="alternative-selector"
                                        value= {this.state.selected_alternative}
                                        label="Alternative hypothesis"
                                        onChange={this.handleSelectAlternativeChange}
                                >
                                    <MenuItem value={"two-sided"}><em>two-sided</em></MenuItem>
                                    <MenuItem value={"greater"}><em>greater</em></MenuItem>
                                    <MenuItem value={"less"}><em>less</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines the alternative hypothesis, or tail of the test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="padjust-selector-label">padjust</InputLabel>
                                <Select
                                        labelid="padjust-selector-label"
                                        id="padjust-selector"
                                        value= {this.state.selected_padjust}
                                        label="padjust parameter"
                                        onChange={this.handleSelectPadjustChange}
                                >
                                    <MenuItem value={"none"}><em>none</em></MenuItem>
                                    <MenuItem value={"bonf"}><em>bonf</em></MenuItem>
                                    <MenuItem value={"sidak"}><em>sidak</em></MenuItem>
                                    <MenuItem value={"holm"}><em>holm</em></MenuItem>
                                    <MenuItem value={"fdr_bh"}><em>fdr_bh</em></MenuItem>
                                    <MenuItem value={"fdr_by"}><em>fdr_by</em></MenuItem>
                                </Select>
                                <FormHelperText>Method used for testing and adjustment of pvalues</FormHelperText>
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
                                    <MenuItem value={"none"}><em>np2</em></MenuItem>
                                    <MenuItem value={"cohen"}><em>cohen</em></MenuItem>
                                    <MenuItem value={"hedges"}><em>hedges</em></MenuItem>
                                    <MenuItem value={"r"}><em>r</em></MenuItem>
                                    <MenuItem value={"eta-square"}><em>eta-square</em></MenuItem>
                                    <MenuItem value={"odds-ratio"}><em>odds-ratio</em></MenuItem>
                                    <MenuItem value={"AUC"}><em>AUC</em></MenuItem>
                                    <MenuItem value={"CLES"}><em>CLES</em></MenuItem>
                                </Select>
                                <FormHelperText>Effect size type</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="correction-selector-label">correction</InputLabel>
                                <Select
                                        labelid="correction-selector-label"
                                        id="correction-selector"
                                        value= {this.state.selected_correction}
                                        label="correction"
                                        onChange={this.handleSelectCorrectionChange}
                                >
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>For independent two sample T-tests, specify whether or not to correct for unequal variances using Welch separate variances T-test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="nan_policy-selector-label">nan policy</InputLabel>
                                <Select
                                        labelid="nan_policy-selector-label"
                                        id="nan_policy-selector"
                                        value= {this.state.selected_nan_policy}
                                        label="nan_policy"
                                        onChange={this.handleSelectNanPolicyChange}
                                >
                                    <MenuItem value={"listwise"}><em>listwise</em></MenuItem>
                                    <MenuItem value={"pairwise"}><em>pairwise</em></MenuItem>
                                </Select>
                                <FormHelperText>Can be ‘listwise’ for listwise deletion of missing values in repeated measures design (= complete-case analysis) or ‘pairwise’ for the more liberal pairwise deletion (= available-case analysis)</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_within_variables_wf.length < 1 |
                                        this.state.selected_subject_wf.length < 1 |
                                        this.state.selected_dependent_variable_wf.length < 1 |
                                        this.state.selected_between_variables_wf.length < 1 }
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
                            <FormHelperText>Subject =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_subject_wf}>
                                {this.state.selected_subject_wf}
                            </Button>
                        </Grid>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected between variables [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_between_variables_wf.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleBetweenDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            <Button onClick={this.handleDeleteAllBetween}>
                                Clear all
                            </Button>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected within variables [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_within_variables_wf.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleWithinDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            <Button onClick={this.handleDeleteAllWithin}>
                                Clear all
                            </Button>
                        </FormControl>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <Grid sx={{ width: '100%' }}>
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
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'5px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Box sx={{ height: 400, width: '100%' }}>
                                            <div className="datatable">
                                                {/*<p className="result_texts">Pearson’s correlation coefficient :  { this.state.test_data.DataFrame}</p>*/}
                                                    <DataGrid sx={{width:'99%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}
                                                              zeroMinWidth
                                                              rowHeight={40}
                                                              className="datagrid"
                                                              rows= {this.state.test_data.DataFrame}
                                                              columns={this.state.user_columns}
                                                              pageSize= {10}
                                                              rowsPerPageOptions={[10]}
                                                    />
                                                </div>
                                            </Box>
                                    )}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.initialdataset}/>
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default Pairwise_test;
