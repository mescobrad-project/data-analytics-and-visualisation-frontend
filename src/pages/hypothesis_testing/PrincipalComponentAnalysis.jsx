import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button, Card, CardContent,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from "@mui/material";

import qs from "qs";
import Paper from "@mui/material/Paper";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import Plot from "react-plotly.js";
import {CSVLink} from "react-csv";
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

class PrincipalComponentAnalysis extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of columns sent by the backend
            column_names: [],
            file_names:[],
            Principal_axes:'',
            Explained_variance:'',
            Explained_variance_ratio:'',
            Singular_values:'',
            PrincipalComponents_Df:'',
            //Values selected currently on the form
            selected_column: "",
            selected_file_name: "",
            selected_categorical_column:'',
            selected_n_components_1: 2,
            selected_svd_solver: 'auto',
            selected_categorical_variable: '',
            selected_independent_variables: '',
            selected_independent_variables_wf: [],
            test_data:{
                columns:[],
                n_features_:"",
                n_features_in_:"",
                n_samples_:"",
                random_state:"",
                iterated_power:"",
                mean_:[],
                explained_variance_:[],
                noise_variance_:"",
                pve: [],
                singular_values: [],
                principal_axes: []
            },
            // Hide/show results
            PCA_show : false,
            svg1_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/PCA.svg',
        };

        //Binding functions of the class
        this.handleSelectNComponents1Change = this.handleSelectNComponents1Change.bind(this);
        this.handleSelectSVDChange = this.handleSelectSVDChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectCategoricalColumnChange = this.handleSelectCategoricalColumnChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);this.handleListDelete = this.handleListDelete.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.debug = this.debug.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchFileNames();
        this.fetchColumnNames();
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
        this.setState({PCA_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("principal_component_analysis", {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        n_components_1: this.state.selected_n_components_1,
                        svd_solver: this.state.selected_svd_solver,
                        categorical_variable:this.state.selected_categorical_variable,
                        independent_variables: this.state.selected_independent_variables_wf},
                paramsSerializer : params => {
                    return qs.stringify(params, { arrayFormat: "repeat" })
                }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({Principal_axes: JSON.parse(res.data.principal_axes)})
            this.setState({Explained_variance: JSON.parse(res.data.explained_variance_)})
            this.setState({Explained_variance_ratio: JSON.parse(res.data.pve)})
            this.setState({Singular_values: JSON.parse(res.data.singular_values)})
            this.setState({PrincipalComponents_Df: JSON.parse(res.data.principalComponents_Df)})
            this.setState({PCA_show: true})
            this.setState({tabvalue:1})

        });
    }

    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
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
    resetResultArea(){
        this.setState({PCA_show: false})
    }
    handleSelectNComponents1Change(event){
        this.setState( {selected_n_components_1: event.target.value})
        this.resetResultArea()
    }
    handleSelectSVDChange(event){
        this.setState( {selected_svd_solver: event.target.value})
        this.resetResultArea()
    }
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_independent_variables_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_wf:newArray})
        this.resetResultArea()
    }
    handleSelectCategoricalColumnChange(event){
        this.setState( {selected_categorical_column: event.target.value})
        this.setState( {selected_categorical_variable: this.state.selected_file_name+"--"+event.target.value})
        this.resetResultArea()
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
            this.handleDeleteVariable()
            this.resetResultArea()
        })
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
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
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Principal component analysis Parameterisation
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
                                <InputLabel id="categorical-selector-label">Categorical variable</InputLabel>
                                <Select
                                        labelId="categorical-selector-label"
                                        id="categorical-selector"
                                        value= {this.state.selected_categorical_column}
                                        label="Categorical variable"
                                        onChange={this.handleSelectCategoricalColumnChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Column for Normality test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="n_components_1-label"
                                        id="n_components_1-selector"
                                        value= {this.state.selected_n_components_1}
                                        label="No components"
                                        onChange={this.handleSelectNComponents1Change}
                                        type="number"
                                />
                                <FormHelperText>Selection must be an integer</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="svd_solver-label">svd solver</InputLabel>
                                <Select
                                        labelId="svd_solver-label"
                                        id="svd_solver-selector"
                                        value= {this.state.selected_svd_solver}
                                        label="SVD solver"
                                        onChange={this.handleSelectSVDChange}
                                        // type="number"
                                >
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                    <MenuItem value={"full"}><em>full</em></MenuItem>
                                </Select>
                                <FormHelperText>The solver is selected by a default policy based on X.shape and n_components</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Columns</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        // multiple
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
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        {/*<form onSubmit={this.handleProceed}>*/}
                        {/*    <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"*/}
                        {/*            disabled={!this.state.PCA_show || !(this.state.test_data.status==='Success')}>*/}
                        {/*        Proceed*/}
                        {/*    </Button>*/}
                        {/*</form>*/}
                        <ProceedButton disabled={!this.state.PCA_show || !(this.state.test_data.status==='Success')}></ProceedButton>
                        <br/>
                        <br/>
                        <hr/>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected Training vectors [click to remove]</FormHelperText>
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
                            Principal component analysis Result
                        </Typography>
                        <hr class="result"/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    <Tab label="Components" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                {this.state.test_data['status']!=='Success' ? (
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                ) : (
                                    <Grid container direction="row">
                                        <Grid sx={{ flexGrow: 1}} >
                                            <div style={{ display: (this.state.PCA_show ? 'block' : 'none') }}>
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
                                                                <TableCell className="tableCell">{'Number of features in the training data.'}</TableCell>
                                                                <TableCell className="tableCell">{this.state.test_data.n_features_}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'Number of features seen during fit.'}</TableCell>
                                                                <TableCell className="tableCell">{this.state.test_data.n_features_in_}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'Number of samples in the training data.'}</TableCell>
                                                                <TableCell className="tableCell">{this.state.test_data.n_samples_}</TableCell>
                                                            </TableRow>
                                                            {/*<TableRow>*/}
                                                            {/*    <TableCell className="tableCell">{'Used when the ‘arpack’ or ‘randomized’ solvers are used.'}</TableCell>*/}
                                                            {/*    <TableCell className="tableCell">{this.state.test_data.random_state}</TableCell>*/}
                                                            {/*</TableRow>*/}
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'Number of iterations for the power method.'}</TableCell>
                                                                <TableCell className="tableCell">{this.state.test_data.iterated_power}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'The estimated noise covariance following the Probabilistic PCA model from Tipping and Bishop 1999.'}</TableCell>
                                                                <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.noise_variance_).toFixed(6)}</TableCell>
                                                            </TableRow>
                                                            {/*{this.state.test_data.explained_variance_.map((item)=> {*/}
                                                            {/*    return (*/}
                                                            {/*            <TableRow>*/}
                                                            {/*                <TableCell className="tableCell">{'The amount of variance explained by each of the selected components. The variance estimation uses n_samples - 1 degrees of freedom.'}</TableCell>*/}
                                                            {/*                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>*/}
                                                            {/*            </TableRow>);*/}
                                                            {/*})}*/}
                                                            {/*{this.state.test_data.pve.map((item)=> {*/}
                                                            {/*    return (*/}
                                                            {/*            <TableRow>*/}
                                                            {/*                <TableCell className="tableCell">{'Percentage of variance explained by each of the selected components.'}</TableCell>*/}
                                                            {/*                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>*/}
                                                            {/*            </TableRow>);*/}
                                                            {/*})}*/}
                                                            {/*{this.state.test_data.singular_values.map((item)=> {*/}
                                                            {/*    return (*/}
                                                            {/*            <TableRow>*/}
                                                            {/*                <TableCell className="tableCell">{'The singular values corresponding to each of the selected components.'}</TableCell>*/}
                                                            {/*                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>*/}
                                                            {/*            </TableRow>);*/}
                                                            {/*})}*/}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow sx={{alignContent:"right"}}>
                                                                <TableCell className="tableHeadCell" sx={{width:'30%'}}></TableCell>
                                                            {
                                                            this.state.test_data.columns.map((item)=>{
                                                                return (
                                                                            <TableCell className="tableHeadCell">{item}</TableCell>
                                                                        )})}
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="tableCell">{'Mean'}</TableCell>
                                                                {this.state.test_data.mean_.map((item)=> {
                                                                    return (
                                                                            <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>
                                                                    );
                                                                })}
                                                            </TableRow>
                                                            {/*<TableRow>*/}
                                                            {/*    <TableCell className="tableCell">{'Principal axes in feature space, representing the directions of maximum variance in the data.'}</TableCell>*/}
                                                            {/*    {this.state.test_data.principal_axes.map((item)=> {*/}
                                                            {/*        return (*/}
                                                            {/*                <TableCell className="tableCell">{Number.parseFloat(item).toFixed(6)}</TableCell>*/}
                                                            {/*        );*/}
                                                            {/*    })}*/}
                                                            {/*</TableRow>*/}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Card style={{ display: (this.state.PCA_show ? 'block' : 'none'), padding:'5px' }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            Principal axes in feature space, representing the directions of maximum variance in the data. </Typography>
                                                        <JsonTable className="jsonResultsTable"
                                                                   rows = {this.state.Principal_axes}/>
                                                    </CardContent>
                                                </Card>
                                                <Card style={{ display: (this.state.PCA_show ? 'block' : 'none'), padding:'5px' }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            The amount of variance explained by each of the selected components. </Typography>
                                                        <JsonTable className="jsonResultsTable"
                                                                   rows = {this.state.Explained_variance}/>
                                                    </CardContent>
                                                </Card>
                                                <Card style={{ display: (this.state.PCA_show ? 'block' : 'none'), padding:'5px' }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            Percentage of variance explained by each of the selected components. </Typography>
                                                        <JsonTable className="jsonResultsTable"
                                                                   rows = {this.state.Explained_variance_ratio}/>
                                                    </CardContent>
                                                </Card>
                                                <Card style={{ display: (this.state.PCA_show ? 'block' : 'none'), padding:'5px' }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            Percentage of variance explained by each of the selected components. </Typography>
                                                        <JsonTable className="jsonResultsTable"
                                                                   rows = {this.state.Singular_values}/>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                            <Grid item xs={12} style={{ display: 'inline-block', padding:'20px'}}>
                                                <Card style={{ display: (this.state.PCA_show ? 'block' : 'none') }}>
                                                    <CardContent sx={{m: 1, width:'100%', alignContent:'center'}}>
                                                        <Typography variant="h5" component="div">
                                                            Components. </Typography>
                                                        <img src={this.state.svg1_path + "?random=" + new Date().getTime()}
                                                                // srcSet={this.state.svg1_path + "?random=" + new Date().getTime() +'?w=100&h=100&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                             style={{width: '100%'}}
                                                                // style={{zoom:'70%'}}
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                                <hr className="result" style={{display: (this.state.stats_show ? 'block' : 'none')}}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.initialdataset}/>
                                </Box>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <Box>
                                    <CSVLink data={this.state.PrincipalComponents_Df}
                                             filename="PCA_components.csv">Download</CSVLink>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.PrincipalComponents_Df}/>
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default PrincipalComponentAnalysis;
