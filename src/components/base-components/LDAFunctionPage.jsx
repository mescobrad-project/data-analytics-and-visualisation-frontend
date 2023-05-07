// import React from 'react';
import * as React from 'react';
import '../../pages/hypothesis_testing/normality_tests.scss'
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Tabs,
    TextField,
    Typography
} from "@mui/material";

import qs from "qs";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import Paper from "@mui/material/Paper";

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


class LDAFunctionPage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            column_names: [],
            file_names:[],
            initialdataset:[],
            result_coefficients:[],
            result_means:[],
            result_priors:[],
            result_xbar:[],
            result_vratio:[],
            result_scaling:[],
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_variable_wf: "",
            selected_solver: "svd",
            selected_shrinkage_1: "none",
            selected_shrinkage_1_show: false,
            selected_shrinkage_2: 0,
            selected_shrinkage_2_show: false,
            selected_independent_variables: [],
            selected_independent_variables_wf: [],
            test_data:{
                status:'',
                result:{
                    number_of_features: '',
                    features_columns: '',
                    classes_: [],
                    number_of_classes:'',
                    number_of_components: '',
                    explained_variance_ratio: '',
                    means_: '',
                    priors_: [],
                    scalings_: [],
                    xbar_: [],
                    coefficients: '',
                    intercept: '',}
            },
            // Hide/show results
            LDA_show : false,
            svd_show : false,
            svdeigen_show : false,
            tabvalue : 0
        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectSolverChange = this.handleSelectSolverChange.bind(this);
        this.handleSelectShrinkage1Change = this.handleSelectShrinkage1Change.bind(this);
        this.handleSelectShrinkage2Change = this.handleSelectShrinkage2Change.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.fetchFileNames();
    }
    debug = () => {
        console.log("DEBUG")
        console.log(this.state)
    };

    /**
     * Process and send the request for auto correlation and handle the response
     */

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({LDA_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("return_LDA", {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dependent_variable: this.state.selected_variable_wf,
                        solver: this.state.selected_solver,
                        shrinkage_1: this.state.selected_shrinkage_1,
                        shrinkage_2: this.state.selected_shrinkage_2,
                        independent_variables: this.state.selected_independent_variables_wf},
                paramsSerializer : params => {
                    return qs.stringify(params, { arrayFormat: "repeat" })
                }
        }).then(res => {
            this.setState({test_data: res.data})
            // const resultJson = res.data
            this.setState({result_coefficients: JSON.parse(res.data.result.coefficients)})
            this.setState({result_means: JSON.parse(res.data.result.means_)})
            this.setState({result_priors: JSON.parse(res.data.result.priors_)})
            this.setState({result_xbar: JSON.parse(res.data.result.xbar_)})
            this.setState({result_vratio: JSON.parse(res.data.result.explained_variance_ratio)})
            this.setState({result_scaling: JSON.parse(res.data.result.scalings_)})
            this.setState({LDA_show: true})
            this.setState({tabvalue:1})
        });
        if (this.state.selected_solver=='svd'){
            this.setState({svd_show: true})
        }
        else{this.setState({svd_show: false})}
        if (this.state.selected_solver=='svd' || this.state.selected_solver=='eigen'){
            this.setState({svdeigen_show: true})
        }
        else{this.setState({svdeigen_show: false})
        }
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
        window.location.replace("/")
    }
    /**
     * Update state when selection changes in the form
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

    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        this.setState( {selected_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectSolverChange(event){
        this.setState( {selected_solver: event.target.value})
        if (event.target.value === 'svd')
        {
            this.state.selected_shrinkage_1_show = false
            this.state.selected_shrinkage_2_show = false
            this.state.selected_shrinkage_2 = 0
        }
        else
        {this.state.selected_shrinkage_1_show = true}
    }
    handleSelectShrinkage1Change(event){
        this.setState( {selected_shrinkage_1: event.target.value})
        if (event.target.value === 'float')
        {this.state.selected_shrinkage_2_show = true}
        else
        {
            this.state.selected_shrinkage_2_show = false
            this.state.selected_shrinkage_2 = 0
        }
    }
    handleSelectShrinkage2Change(event){
        if (event.target.value<0 || event.target.value<1)
        {
            this.setState( {selected_shrinkage_2: event.target.value})

        }else{alert("Select a float between 0 and 1.")
            return}
    }
    // handleSelectShrinkage3Change(event){
    //     this.setState( {selected_shrinkage_3: event.target.value})
    // }
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_independent_variables_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_wf:newArray})}

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
            this.state.selected_variable_wf=[]
            this.state.selected_independent_variables_wf=[]
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            LDA Parameterisation
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
                                <InputLabel id="solver-label">Solver</InputLabel>
                                <Select
                                        labelId="solver-label"
                                        id="solver-selector"
                                        value= {this.state.selected_solver}
                                        label="Solver"
                                        onChange={this.handleSelectSolverChange}
                                >
                                    <MenuItem value={"svd"}><em>svd</em></MenuItem>
                                    <MenuItem value={"lsqr"}><em>lsqr</em></MenuItem>
                                    <MenuItem value={"eigen"}><em>eigen</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which solver to use.</FormHelperText>
                            </FormControl>
                            <div style={{ display: (this.state.selected_shrinkage_1_show ? 'block' : 'none') }}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="shrinkage-label">Shrinkage</InputLabel>
                                <Select
                                        labelId="shrinkage-label"
                                        id="shrinkage-selector"
                                        value= {this.state.selected_shrinkage_1}
                                        label="Shrinkage"
                                        onChange={this.handleSelectShrinkage1Change}
                                >
                                    <MenuItem value={"none"}><em>No shrinkage</em></MenuItem>
                                    <MenuItem value={"auto"}><em>Automatic shrinkage using the Ledoit-Wolf lemma</em></MenuItem>
                                    <MenuItem value={"float"}><em>Fixed shrinkage parameter</em></MenuItem>
                                </Select>
                                <FormHelperText>Shrinkage float</FormHelperText>
                            </FormControl>
                            </div>
                            <div style={{ display: (this.state.selected_shrinkage_2_show ? 'block' : 'none') }}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="shrinkage-2-label"
                                        id="shrinkage-2-selector"
                                        value= {this.state.selected_shrinkage_2}
                                        label="Shrinkage float"
                                        onChange={this.handleSelectShrinkage2Change}
                                        type="number"
                                />
                                <FormHelperText>Selection must be a float between 0 and 1</FormHelperText>
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
                            <hr/>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_independent_variables_wf.length < 1 | this.state.selected_variable_wf.length < 1}
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.LDA_show || !(this.state.test_data.status==='Success')}>
                                Proceed >
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <hr/>
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
                            LDA Result
                        </Typography>
                        <hr/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid container direction="row"
                                      style={{display: (this.state.LDA_show ? 'block' : 'none')}}>
                                    <Grid style={{display: (this.state.test_data.status!=='Success' ? 'block' : 'none')}}>
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    </Grid>
                                    <Grid sx={{ flexGrow: 1, textAlign: "center"}}
                                          style={{display: (this.state.test_data.status==='Success' ? 'block' : 'none')}}>
                                        <div style={{ display: (this.state.LDA_show ? 'block' : 'none')}}>
                                            <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>
                                                <Table sx={{textAlign:"right"}}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className="tableHeadCell" sx={{width:'60%'}}></TableCell>
                                                            <TableCell className="tableHeadCell" sx={{width:'40%'}}>test_statistic</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="tableCell">{'Number of features: '}</TableCell>
                                                            <TableCell className="tableCell">{this.state.test_data.result.number_of_features}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="tableCell">{'Number of classes:'}</TableCell>
                                                            <TableCell className="tableCell">{this.state.test_data.result.number_of_classes}</TableCell>
                                                        </TableRow>
                                                        <TableRow>
                                                            <TableCell className="tableCell">{'Number of components.'}</TableCell>
                                                            <TableCell className="tableCell">{this.state.test_data.result.number_of_components}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <div style={{display: (this.state.svdeigen_show ? 'block' : 'none')}}>
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                    Percentage of variance explained by each of the selected components.
                                                </Typography>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.result_vratio}/>
                                            </div>
                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                Class-wise means.
                                            </Typography>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.result_means}/>
                                            <div style={{display: (this.state.svd_show ? 'block' : 'none')}}>
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                    Overall mean.
                                                </Typography>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.result_xbar}/>
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                    Scaling of the features in the space spanned by the class centroids.
                                                </Typography>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.result_scaling}/>
                                            </div>
                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                Class priors
                                            </Typography>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.result_priors}/>
                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, padding:'20px'}} >
                                                Coefficients and Intercept term
                                            </Typography>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.result_coefficients}/>
                                            {/*<div dangerouslySetInnerHTML={{__html: this.state.test_data.coefficients}} />*/}
                                        </div>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                            {/*<TabPanel value={this.state.tabvalue} index={2}>*/}
                            {/*    Item Three*/}
                            {/*</TabPanel>*/}
                        </Box>

                    </Grid>
                </Grid>
        )
    }
}

export default LDAFunctionPage;
