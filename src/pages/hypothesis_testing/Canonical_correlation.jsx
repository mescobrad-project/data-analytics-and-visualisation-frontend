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
import { CSVLink } from "react-csv"
import qs from "qs";

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

class Canonical_correlation extends React.Component {
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
                xweights: "",
                yweights: "",
                xloadings: "",
                yloadings: "",
                xrotations: "",
                yrotations: "",
                coef_df:"",
                Xc_df:"",
                Yc_df:"",
            },
            column_names: [],
            file_names:[],
            X_weights:"",
            Y_weights:"",
            X_loadings: "",
            Y_loadings: "",
            X_rotations: "",
            Y_rotations: "",
            Coeffic_df:"",
            X_c_df:"",
            Y_c_df:"",
            selected_n_components: 2,
            selected_independent_variables_1: '',
            selected_independent_variables_1_wf: [],
            selected_independent_variables_2: '',
            selected_independent_variables_2_wf: [],
            stats_show: false,
            svg1_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_XYcorr.svg',
            svg2_path : ip + 'runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_comp_corr.svg',
            svg3_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_XY_c_corr.svg',
            svg4_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_coefs.svg',

        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectComponentsChange = this.handleSelectComponentsChange.bind(this);
        this.handleSelectIndependentVariable1Change = this.handleSelectIndependentVariable1Change.bind(this);
        this.handleSelectIndependentVariable2Change = this.handleSelectIndependentVariable2Change.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleListDelete2 = this.handleListDelete2.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable2 = this.handleDeleteVariable2.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
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
        API.get("canonical_correlation_analysis",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        n_components: this.state.selected_n_components,
                        independent_variables_1: this.state.selected_independent_variables_1_wf,
                        independent_variables_2: this.state.selected_independent_variables_2_wf,
                },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data});
            this.setState({X_weights:JSON.parse(res.data.xweights)});
            this.setState({Y_weights:JSON.parse(res.data.yweights)});
            this.setState({X_loadings:JSON.parse(res.data.xloadings)});
            this.setState({Y_loadings:JSON.parse(res.data.yloadings)});
            this.setState({X_rotations:JSON.parse(res.data.xrotations)});
            this.setState({Y_rotations:JSON.parse(res.data.yrotations)});
            this.setState({Coeffic_df:JSON.parse(res.data.coef_df)});
            this.setState({X_c_df:JSON.parse(res.data.Xc_df)});
            this.setState({Y_c_df:JSON.parse(res.data.Yc_df)});
            this.setState({stats_show: true});
            this.setState({tabvalue:1});
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
        window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
    }
    /**
     * Update state when selection changes in the form
     */
    handleSelectIndependentVariable1Change(event){
        this.setState( {selected_independent_variables_1: event.target.value})
        var newArray = this.state.selected_independent_variables_1_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_1_wf:newArray})
    }
    handleSelectIndependentVariable2Change(event){
        this.setState( {selected_independent_variables_2: event.target.value})
        var newArray = this.state.selected_independent_variables_2_wf.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables_2_wf:newArray})
    }
    handleSelectComponentsChange(event){
        this.setState( {selected_n_components: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleListDelete(event) {
        var newArray = this.state.selected_independent_variables_1_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_independent_variables_1_wf:newList})
    }
    handleDeleteVariable(event) {
        this.setState({selected_independent_variables_1_wf:[]})
    }
    handleListDelete2(event) {
        var newArray = this.state.selected_independent_variables_2_wf.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_independent_variables_2_wf:newList})
    }
    handleDeleteVariable2(event) {
        this.setState({selected_independent_variables_2_wf:[]})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.handleDeleteVariable()
            this.handleDeleteVariable2()
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
                                <InputLabel id="column-selector-label">Training vectors</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables_1}
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariable1Change}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variables for correlation test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Target vectors</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables_2}
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariable2Change}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variables for correlation test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="components-selector-label"
                                        id="components-selector"
                                        value= {this.state.selected_n_components}
                                        label="No of components"
                                        onChange={this.handleSelectComponentsChange}
                                />
                                <FormHelperText>Number of components to keep.</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_independent_variables_1_wf.length < 1 |
                                            this.state.selected_independent_variables_2_wf.length<1}
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
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected Training vectors [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_independent_variables_1_wf.map((column) => (
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
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected Target vectors [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_independent_variables_2_wf.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListDelete2}>
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
                                    <Tab label="Transformed" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Grid>
                                                <Grid container alignContent={'center'}>
                                                    <Grid item xs={5} >
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            Correlation Matrix between the selected features of this dataset.
                                                        </Typography>
                                                        <div style={{alignSelf:'center'}}>
                                                            <img src={this.state.svg1_path + "?random=" + new Date().getTime()}
                                                                 // srcSet={this.state.svg1_path + "?random=" + new Date().getTime() +'?w=100&h=100&fit=crop&auto=format&dpr=2 2x'}
                                                                 loading="lazy"
                                                                 style={{zoom:'70%'}}
                                                            />
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={7} container direction="column">
                                                        <Grid>
                                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                                CCA coefficients.
                                                                <br/><br/>
                                                            </Typography>
                                                            <img src={this.state.svg4_path + "?random=" + new Date().getTime()}
                                                                    // srcSet={this.state.svg1_path + "?random=" + new Date().getTime() +'?w=100&h=100&fit=crop&auto=format&dpr=2 2x'}
                                                                 loading="lazy"
                                                                 style={{zoom:'70%'}}
                                                            />
                                                        </Grid>
                                                        <Grid>
                                                            <div style={{textAlign:"center"}}>
                                                                <CSVLink data={this.state.Coeffic_df}
                                                                         filename={"Coefficients.csv"}>Download</CSVLink></div>
                                                            <JsonTable className="jsonResultsTable" rows = {this.state.Coeffic_df}/>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <hr className="result"/>
                                                <Grid container>
                                                    <Grid item xs={6} >
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            Correlations between the pairs of each dimension. </Typography>
                                                        <img src={this.state.svg2_path + "?random=" + new Date().getTime()}
                                                             // srcSet={this.state.svg2_path + "?random=" + new Date().getTime() +'?w=100&h=100&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                             style={{zoom:'60%'}}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={6} container direction="column">
                                                        <Grid>
                                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                                X singular vectors of the cross-covariance matrices of each iteration. </Typography>
                                                            <div style={{textAlign:"center"}}>
                                                                <CSVLink data={this.state.X_weights}
                                                                         filename="X_weights.csv">Download</CSVLink></div>
                                                            <JsonTable className="jsonResultsTable" rows = {this.state.X_weights}/>
                                                        </Grid>
                                                        <Grid>
                                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                                Y singular vectors of the cross-covariance matrices of each iteration.
                                                            </Typography>
                                                            <div style={{textAlign:"center"}}>
                                                                <CSVLink data={this.state.Y_weights}
                                                                         filename="Y_weights.csv">Download</CSVLink></div>
                                                            <JsonTable className="jsonResultsTable" rows = {this.state.Y_weights}/>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                        Scatterplots of two pairs of canonical variates. </Typography>
                                                    <img src={this.state.svg3_path + "?random=" + new Date().getTime()}
                                                            // srcSet={this.state.svg3_path + "?random=" + new Date().getTime() +'?w=100&h=100&fit=crop&auto=format&dpr=2 2x'}
                                                         loading="lazy"
                                                         style={{alignSelf: "center"}}
                                                         style={{zoom:'60%'}}
                                                    />
                                                </Grid>
                                            {/*</Grid>*/}
                                                <hr className="result"/>
                                                <Grid container direction="row">
                                                    <Grid item xs={3} >
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            The loadings of X.
                                                            <br/><br/></Typography>
                                                        <div style={{textAlign:"center"}}>
                                                            <CSVLink data={this.state.X_loadings}
                                                                     filename={"X_loadings.csv"}>Download</CSVLink></div>
                                                        <JsonTable className="jsonResultsTable" rows = {this.state.X_loadings}/>
                                                    </Grid>
                                                    <Grid item xs={3} >
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            The loadings of Y.
                                                            <br/><br/></Typography>
                                                        <div style={{textAlign:"center"}}>
                                                            <CSVLink data={this.state.Y_loadings}
                                                                     filename={"Y_loadings.csv"}>Download</CSVLink></div>
                                                        <JsonTable className="jsonResultsTable" rows = {this.state.Y_loadings}/>
                                                    </Grid>
                                                    <Grid item xs={3} >
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            The projection matrix used to transform X. </Typography>
                                                        <div style={{textAlign:"center"}}>
                                                            <CSVLink data={this.state.X_rotations}
                                                                     filename={"X_rotations.csv"}>Download</CSVLink></div>
                                                        <JsonTable className="jsonResultsTable" rows = {this.state.X_rotations}/>
                                                    </Grid>
                                                    <Grid item xs={3} >
                                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                            The projection matrix used to transform Y. </Typography>
                                                        <div style={{textAlign:"center"}}>
                                                            <CSVLink data={this.state.Y_rotations}
                                                                     filename={"Y_rotations.csv"}>Download</CSVLink></div>
                                                        <JsonTable className="jsonResultsTable" rows = {this.state.Y_rotations}/>
                                                    </Grid>
                                                </Grid>
                                                <hr className="result"/>
                                            </Grid>
                                        )}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                {this.state.test_data['status']!=='Success' ? (
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                ) : (
                                        <Grid container direction="row">
                                            <Grid item xs={6}>
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                    Transformed X. </Typography>
                                                <div style={{textAlign:"center"}}>
                                                    <CSVLink data={this.state.X_c_df}
                                                             filename={"Transformed_X.csv"}>Download</CSVLink></div>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.X_c_df}/>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                    Transformed Y. </Typography>
                                                <div style={{textAlign:"center"}}>
                                                    <CSVLink data={this.state.Y_c_df}
                                                         filename={"Transformed_Y.csv"}>Download</CSVLink></div>
                                                <JsonTable className="jsonResultsTable" rows = {this.state.Y_c_df}/>
                                            </Grid>
                                        </Grid>
                                )}
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default Canonical_correlation;
