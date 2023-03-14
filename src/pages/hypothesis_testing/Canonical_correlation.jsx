import React from 'react';
import API from "../../axiosInstance";
import "./linearmixedeffectsmodel.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel, List, ListItem, ListItemText,
    MenuItem,
    Select,
    Tab,
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
import JsonTable from "ts-react-json-table";
import Paper from "@mui/material/Paper";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import { CSVLink, CSVDownload } from "react-csv"
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
        this.state = {
            test_data: {
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
            binary_columns: [],
            columns: [],
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
            selected_independent_variables_1: [],
            selected_independent_variables_2: [],
            stats_show: false,
            svg1_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_XYcorr.svg',
            svg2_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_comp_corr.svg',
            svg3_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_XY_c_corr.svg',
            svg4_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/CCA_coefs.svg',

        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.handleSelectComponentsChange = this.handleSelectComponentsChange.bind(this);
        this.handleSelectIndependentVariable1Change = this.handleSelectIndependentVariable1Change.bind(this);
        this.handleSelectIndependentVariable2Change = this.handleSelectIndependentVariable2Change.bind(this);
        this.fetchBinaryColumnNames();
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchColumnNames();
        this.handleTabChange = this.handleTabChange.bind(this);
        this.clearX = this.clearX.bind(this);
        this.selectAllX = this.selectAllX.bind(this);
        this.clearY = this.clearY.bind(this);
        this.selectAllY = this.selectAllY.bind(this);
    }

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({columns: res.data.columns})
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:1})
        });
    }

    async fetchBinaryColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_binary_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            // console.log(res.data.columns)
            this.setState({binary_columns: res.data.columns})
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
                        independent_variables_1: this.state.selected_independent_variables_1,
                        independent_variables_2: this.state.selected_independent_variables_2,
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
            this.setState({tabvalue:0});
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectIndependentVariable1Change(event){
        if (event.target.value !== this.state.selected_independent_variables_2)
        {
            this.setState( {selected_independent_variables_1: event.target.value})
        }else{
            alert("You must select a different variable.")
            return
        }
    }
    handleSelectIndependentVariable2Change(event){
        if (event.target.value !== this.state.selected_independent_variables_1)
        {
            this.setState( {selected_independent_variables_2: event.target.value})
        }else{
            alert("You must select a different variable.")
            return
        }
    }
    handleSelectComponentsChange(event){
        this.setState( {selected_n_components: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    clearX(){
        this.setState({selected_independent_variables_1: []})
    }
    selectAllX(){
        this.setState({selected_independent_variables_1: this.state.columns})
    }
    clearY(){
        this.setState({selected_independent_variables_2: []})
    }
    selectAllY(){
        this.setState({selected_independent_variables_2: this.state.columns})
    }

    render() {

        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", minWidth: 120}} noWrap>
                            Insert Parameters
                        </Typography>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                            <FormHelperText>Selected features in sample X</FormHelperText>
                            <List style={{fontSize:'9px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                {this.state.selected_independent_variables_1.map((column) => (
                                        <ListItem disablePadding
                                        >
                                            <ListItemText
                                                    primaryTypographyProps={{fontSize: '10px'}}
                                                    primary={'•  ' + column}
                                            />
                                        </ListItem>
                                ))}
                            </List>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                            <FormHelperText>Selected targets in sample Y</FormHelperText>
                            <List style={{fontSize:'9px', backgroundColor:"lightgrey", borderRadius:'10%'}}>
                                {this.state.selected_independent_variables_2.map((column) => (
                                        <ListItem disablePadding
                                        >
                                            <ListItemText
                                                    primaryTypographyProps={{fontSize: '10px'}}
                                                    primary={'•  ' + column}
                                            />
                                        </ListItem>
                                ))}
                            </List>
                        </FormControl>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Features variables</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables_1}
                                        multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariable1Change}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variables for correlation test</FormHelperText>
                                <Button onClick={this.selectAllX}>
                                    Select All Variables
                                </Button>
                                <Button onClick={this.clearX}>
                                    Clear Selections
                                </Button>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Target variables</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables_2}
                                        multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariable2Change}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variables for correlation test</FormHelperText>
                                <Button onClick={this.selectAllY}>
                                    Select All Variables
                                </Button>
                                <Button onClick={this.clearY}>
                                    Clear Selections
                                </Button>
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
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Results" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset" {...a11yProps(1)} />
                                    <Tab label="Transformed" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
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
                                    </Grid>
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
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
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
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default Canonical_correlation;
