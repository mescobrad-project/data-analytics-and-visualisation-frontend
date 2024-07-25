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
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import PropTypes from "prop-types";
import ProceedButton from "../../components/ui-components/ProceedButton";
import SelectorWithCheckBoxes from "../../components/ui-components/SelectorWithCheckBoxes";

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
class Anova_RM extends React.Component {
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
                DataFrame:[]
            },
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_within_variables: [],
            selected_subject_variable: "",
            selected_correction:"True",
            selected_effsize:"np2",
            FrenderChild:0,
            stats_show:false,
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        // this.handleProceed = this.handleProceed.bind(this);
        this.returnUserCols = this.returnUserCols.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleChildSelectVariableNameChange = this.handleChildSelectVariableNameChange.bind(this);
        this.handleSelectSubjectChange = this.handleSelectSubjectChange.bind(this);
        this.handleSelectCorrectionChange = this.handleSelectCorrectionChange.bind(this);
        this.handleSelectEffsizeChange = this.handleSelectEffsizeChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
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
        API.get("calculate_anova_repeated_measures_pingouin",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                        dv: this.state.selected_dependent_variable,
                        subject: this.state.selected_subject_variable,
                        correction: this.state.selected_correction,
                        within: this.state.selected_within_variables,
                        effsize: this.state.selected_effsize
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            console.log(res)
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
            this.returnUserCols(res.data);
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        // this.setState( {selected_dependent_variable_wf: event.target.value})
    }
    handleSelectSubjectChange(event){
        this.setState( {selected_subject_variable: event.target.value})
        // this.setState( {selected_subject_variable_wf: event.target.value})
    }
    handleSelectCorrectionChange(event){
        this.setState( {selected_correction: event.target.value})
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
                        minWidth: 150,
                    }
            );
        })
        console.log(local)
        console.log(this.state.user_columns)
        this.setState({user_columns: local})
    }
    handleChildSelectVariableNameChange(checkedValues){
        this.setState({selected_within_variables:checkedValues})
    }
    // handleSelectWithinVariableChange(event){
    //     this.setState( {selected_within_variables: event.target.value})
    //     var newArray = this.state.selected_within_variables_wf.slice();
    //     if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
    //     {
    //         newArray.push(this.state.selected_file_name+"--"+event.target.value);
    //     }
    //     this.setState({selected_within_variables_wf:newArray})
    // }
    handleSelectEffsizeChange(event){
        this.setState( {selected_effsize: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    // handleListDelete(event) {
    //     var newArray = this.state.selected_within_variables_wf.slice();
    //     const ind = newArray.indexOf(event.target.id);
    //     let newList = newArray.filter((x, index)=>{
    //         return index!==ind
    //     })
    //     this.setState({selected_within_variables_wf:newList})
    // }
    // handleDeleteVariable(event) {
    //     this.setState({selected_within_variables_wf:[]})
    // }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_dependent_variable=""
            this.state.selected_subject_variable=""
            this.state.selected_within_variables_wf=""
            this.state.FrenderChild+=1
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Anova Repeated Measures
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
                            <SelectorWithCheckBoxes
                                    key={this.state.FrenderChild}
                                    data={this.state.column_names}
                                    onChildClick={this.handleChildSelectVariableNameChange}
                            />
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <InputLabel id="within-selector-label">Within Variable(s)</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="within-selector-label"*/}
                            {/*            id="within-selector"*/}
                            {/*            value= {this.state.selected_within_variables}*/}
                            {/*            label="Within Variable(s)"*/}
                            {/*            onChange={this.handleSelectWithinVariableChange}*/}
                            {/*    >*/}
                            {/*        {this.state.column_names.map((column) => (*/}
                            {/*                <MenuItem value={column}>{column}</MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*    <FormHelperText>Select within variable(s)</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="subject-selector-label">Subject</InputLabel>
                                <Select
                                        labelId="Subject-selector-label"
                                        id="Subject-selector"
                                        value= {this.state.selected_subject_variable}
                                        label="Between factor"
                                        onChange={this.handleSelectSubjectChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the subject.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="correction-selector-label">correction</InputLabel>
                                <Select
                                        labelid="correction-selector-label"
                                        id="correction-selector"
                                        value= {this.state.selected_correction}
                                        label="correction parameter"
                                        onChange={this.handleSelectCorrectionChange}
                                >
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>Whether to also return Greenhouse-Geisser corrected p-value. Must be ‘True’ or ‘False’.</FormHelperText>
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
                                    <MenuItem value={"ng2"}><em>ng2</em></MenuItem>
                                    <MenuItem value={"np2"}><em>np2</em></MenuItem>
                                    <MenuItem value={"n2"}><em>n2</em></MenuItem>
                                </Select>
                                <FormHelperText>Effect size. Must be ‘ng2’ (generalized eta-squared), or ‘np2’ (partial eta-squared), or ‘n2’ (eta-squared).</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_dependent_variable.length < 1 |
                                            this.state.selected_subject_variable.length < 1 |
                                            this.state.selected_within_variables.length < 1 }
                                    type="submit"
                            >
                                Run Analysis
                            </Button>
                        </form>
                        {/*<form onSubmit={this.handleProceed}>*/}
                        {/*    <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"*/}
                        {/*            disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>*/}
                        {/*        Proceed >*/}
                        {/*    </Button>*/}
                        {/*</form>*/}
                        <br/>
                        <br/>
                        <hr/>
                        <Grid>
                            <FormHelperText>Dependent variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_dependent_variable}>
                                {this.state.selected_dependent_variable}
                            </Button>
                        </Grid>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected within variables </FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_within_variables.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    >
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                        </FormControl>
                        <Grid>
                            <FormHelperText>Subject variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_subject_variable}>
                                {this.state.selected_subject_variable}
                            </Button>
                        </Grid>
                        <ProceedButton></ProceedButton>
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
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <div className="datatable">
                                                {/*<p className="result_texts">Pearson’s correlation coefficient :  { this.state.test_data.DataFrame}</p>*/}
                                                    <DataGrid sx={{width:'90%', height:'700px', display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}
                                                              size="large"
                                                              rowHeight={40}
                                                              className="datagrid"
                                                              rows= {this.state.test_data.DataFrame}
                                                              columns={this.state.user_columns}
                                                              pageSize= {15}
                                                              rowsPerPageOptions={[15]}
                                                    />
                                                </div>
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

export default Anova_RM;
