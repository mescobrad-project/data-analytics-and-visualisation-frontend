import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "./normality_tests.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Table, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography
} from "@mui/material";

import qs from "qs";
import Paper from "@mui/material/Paper";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";

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

class LinearMixedEffectsModel extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            column_names: [],
            file_names:[],
            initialdataset:[],
            binary_columns: [],
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_dependent_variable_wf: "",
            selected_groups: "",
            selected_groups_wf: "",
            selected_use_sqrt: "True",
            selected_independent_variables: [],
            selected_independent_variables_wf: [],
            test_data:{
                status:'',
                first_table: [],
                second_table: []
            },
            // Hide/show results
            LMEM_show : false,
        };
        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectGroupsChange = this.handleSelectGroupsChange.bind(this);
        this.handleSelectUseSqrtChange = this.handleSelectUseSqrtChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchFileNames();
    };

    /***/
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
     * Update state when selection changes in the form
     */
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({LMEM_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("linear_mixed_effects_model", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent: this.state.selected_dependent_variable_wf,
                groups: this.state.selected_groups_wf,
                use_sqrt: this.state.selected_use_sqrt,
                independent: this.state.selected_independent_variables_wf},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({LMEM_show: true})
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
        window.location.replace("/")
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

    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        this.setState( {selected_dependent_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectGroupsChange(event){
        this.setState( {selected_groups: event.target.value})
        this.setState( {selected_groups_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectUseSqrtChange(event){
        this.setState( {selected_use_sqrt: event.target.value})
    }
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_independent_variables_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_wf:newArray})
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
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.fetchBinaryColumnNames();
            this.state.selected_dependent_variable_wf=""
            this.state.selected_groups_wf=""
            this.handleDeleteVariable()
            this.setState({LMEM_show: false})
        })
    }
    render() {

        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Mixed Effects Model Parameterisation
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
                                <InputLabel id="dependent-variable-selector-label">Dependent Variable</InputLabel>
                                <Select
                                        labelId="dependent-variable-selector-label"
                                        id="dependent-variable-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Dependent Variable"
                                        onChange={this.handleSelectDependentVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Dependent Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="groups-label">Groups</InputLabel>
                                <Select
                                        labelId="groups-label"
                                        id="groups-selector"
                                        value= {this.state.selected_groups}
                                        label="groups"
                                        onChange={this.handleSelectGroupsChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Specify group.</FormHelperText>
                            </FormControl>
                            <div>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="shrinkage-label">Use sqrt</InputLabel>
                                    <Select
                                            labelId="shrinkage-label"
                                            id="shrinkage-selector"
                                            value= {this.state.selected_use_sqrt}
                                            label="Shrinkage"
                                            onChange={this.handleSelectUseSqrtChange}
                                    >
                                        <MenuItem value={"True"}><em>True</em></MenuItem>
                                        <MenuItem value={"False"}><em>False</em></MenuItem>
                                    </Select>
                                    <FormHelperText>If True, optimization is carried out using the lower triangle of the
                                        square root of the random effects covariance matrix, otherwise it is carried out
                                        using the lower triangle of the random effects covariance matrix.</FormHelperText>
                                </FormControl>
                            </div>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Columns</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >

                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Independent Variables</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_dependent_variable_wf.length < 1 |
                                            this.state.selected_groups_wf.length < 1 |
                                            this.state.selected_independent_variables_wf.length<1}
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.LMEM_show || !(this.state.test_data.status==='Success')}>
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
                            <FormHelperText>Group variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_groups_wf}>
                                {this.state.selected_groups_wf}
                            </Button>
                        </Grid>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected variables [click to remove]</FormHelperText>
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
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Mixed Linear Model Regression Results
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
                                      style={{display: (this.state.LMEM_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Grid container direction="row" style={{ display: (this.state.LMEM_show ? 'block' : 'none') }}>
                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow sx={{alignContent:"right"}}>
                                                                <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'25%'}}></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        { this.state.test_data.first_table.map((item) => {
                                                                return (
                                                                        <TableRow>
                                                                            <TableCell className="tableCell">{item.col0}</TableCell>
                                                                            <TableCell className="tableCell">{item.col1}</TableCell>
                                                                            <TableCell className="tableCell">{item.col2}</TableCell>
                                                                            <TableCell className="tableCell">{item.col3}</TableCell>
                                                                        </TableRow>
                                                                );
                                                        })}
                                                    </Table>
                                                </TableContainer>
                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell className="tableHeadCell" sx={{width:'15%'}}></TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'15%'}}>Coef.</TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'15%'}}>Std.Err.</TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'15%'}}>z</TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'15%'}}>P>|z|</TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'15%'}}>[0.025</TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'15%'}}>0.975]</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        { this.state.test_data.second_table.map((item) => {
                                                            return (
                                                                    <TableRow>
                                                                        <TableCell className="tableCell">{item.id}</TableCell>
                                                                        <TableCell className="tableCell">{item.col0}</TableCell>
                                                                        <TableCell className="tableCell">{item.col1}</TableCell>
                                                                        <TableCell className="tableCell">{item.col2}</TableCell>
                                                                        <TableCell className="tableCell">{item.col3}</TableCell>
                                                                        <TableCell className="tableCell">{item.col4}</TableCell>
                                                                        <TableCell className="tableCell">{item.col5}</TableCell>
                                                                    </TableRow>
                                                            );
                                                        })}
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
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
export default LinearMixedEffectsModel;
