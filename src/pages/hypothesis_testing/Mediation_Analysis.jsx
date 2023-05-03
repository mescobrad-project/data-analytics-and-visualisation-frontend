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

class Mediation_Analysis extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            test_data: {
                Result: "",
                Result2: ""
            },
            binary_columns: [],
            columns: [],
            Results:"",
            Results2:"",
            selected_dependent_variable: "",
            selected_exposure_variable: "",
            selected_mediator_variable: "",
            selected_independent_variables_1: [],
            selected_independent_variables_2: [],
            stats_show: false,
            // svg1_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
            //         + '/step_' + params.get("step_id") + '/output/CCA_XYcorr.svg',
            // svg2_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
            //         + '/step_' + params.get("step_id") + '/output/CCA_comp_corr.svg',
            // svg3_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
            //         + '/step_' + params.get("step_id") + '/output/CCA_XY_c_corr.svg',
            // svg4_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
            //         + '/step_' + params.get("step_id") + '/output/CCA_coefs.svg',

        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectExposureVariableChange = this.handleSelectExposureVariableChange.bind(this);
        this.handleSelectMediatorVariableChange = this.handleSelectMediatorVariableChange.bind(this);
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
        API.get("mediation_analysis",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dependent_1: this.state.selected_dependent_variable,
                        exposure: this.state.selected_exposure_variable,
                        mediator: this.state.selected_mediator_variable,
                        independent_1: this.state.selected_independent_variables_1,
                        independent_2: this.state.selected_independent_variables_2,
                },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data});
            this.setState({Results:JSON.parse(res.data.Result)});
            this.setState({Results2:JSON.parse(res.data.Result2)});
            this.setState({stats_show: true});
            this.setState({tabvalue:0});
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectIndependentVariable1Change(event){
        this.setState( {selected_independent_variables_1: event.target.value})
    }
    handleSelectIndependentVariable2Change(event){
        this.setState( {selected_independent_variables_2: event.target.value})
    }
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
    }
    handleSelectExposureVariableChange(event){
        this.setState( {selected_exposure_variable: event.target.value})
    }
    handleSelectMediatorVariableChange(event){
        this.setState( {selected_mediator_variable: event.target.value})
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
                                <InputLabel id="column-selector-label">Dependent variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Column"
                                        onChange={this.handleSelectDependentVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Dependent variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Exposure variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_exposure_variable}
                                        label="Column"
                                        onChange={this.handleSelectExposureVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Exposure variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Mediator variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_mediator_variable}
                                        label="Column"
                                        onChange={this.handleSelectMediatorVariableChange}
                                >
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Mediator variable</FormHelperText>
                            </FormControl>
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
                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                            Mediation Results. </Typography>
                                        <div style={{textAlign:"center"}}>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.Results}/>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.Results2}/>
                                        </div>
                                    </Grid>
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

export default Mediation_Analysis;
