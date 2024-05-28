import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "../../pages/hypothesis_testing/normality_tests.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Typography,
    Table, TableRow, TableCell, TableContainer, Paper, Tabs, Tab, TextField, TableHead, TableBody
} from "@mui/material";

// Amcharts
import qs from "qs";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
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


class LinearRegressionModelCreation extends React.Component {
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
            test_data: {
                mse: "",
                r2_score: "",
                Loss:'',
                coeff_determination:'',
                intercept:'',
                mae:'',
                rmse:'',
                slope:''
            },
            dfslope:'',
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_independent_variables: [],
            selected_independent_variable: "",
            selected_test_size:'0.01',
            selected_random_state:'10',
            selected_shuffle:false,
            selected_file_name: "",
            FrenderChild:0,
            model_name:'LR-'+crypto.randomUUID(),
            svg1_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/shap_summary_lr.svg',
            svg2_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/shap_waterfall_lr.svg',
            svg3_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/shap_heatmap_lr.svg',
            // svg4_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
            //         + '/step_' + params.get("step_id") + '/output/shap_bar_lr.svg',
            svg5_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/shap_violin_lr.svg',
            // model_name:'LR - '+ Date().toLocaleString("en-GB")
        };

        //Binding functions of the class
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleSelectModelNameChange = this.handleSelectModelNameChange.bind(this);
        this.handleSelectTestSizeChange = this.handleSelectTestSizeChange.bind(this);
        this.handleSelectRandomStateChange = this.handleSelectRandomStateChange.bind(this);
        this.handleSelectShuffleChange = this.handleSelectShuffleChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectVariableNameChange = this.handleSelectVariableNameChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
    }
    /**
     * Process and send the request for auto correlation and handle the response
     */

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({LinearRegression_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("linear_reg_create_model", {
            params: {
                workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                file_name: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                dependent_variable: this.state.selected_dependent_variable,
                independent_variables: this.state.selected_independent_variables,
                test_size: this.state.selected_test_size,
                random_state:this.state.selected_random_state,
                shuffle:this.state.selected_shuffle,
                model_name:this.state.model_name},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({LinearRegression_show: true})
            this.setState({dfslope:JSON.parse(res.data.slope)});
            this.setState({tabvalue:1})
        });
    }
    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames() {
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
        API.get("/task/complete", {
            params: {
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }
        }).then(res => {
            window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
        });
    }
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
    }
    handleSelectModelNameChange(event){
        this.setState( {model_name: event.target.value})
    }
    handleSelectTestSizeChange(event){
        this.setState( {selected_test_size: event.target.value})
    }
    handleSelectRandomStateChange(event){
        this.setState( {selected_random_state: event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_independent_variables: []})
            this.setState({selected_dependent_variable: ""})
            this.state.LinearRegression_show=false
            this.state.FrenderChild+=1
        })
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectVariableNameChange(checkedValues){
        this.setState({selected_independent_variables:checkedValues})
    }
    handleSelectShuffleChange(event){
        this.setState({selected_shuffle: event.target.value})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Regression Parameterisation
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
                            <SelectorWithCheckBoxes
                                    key={this.state.FrenderChild}
                                    data={this.state.column_names}
                                    onChildClick={this.handleSelectVariableNameChange}
                            />
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="model-name-selector-label"
                                        id="model-name-selector"
                                        value= {this.state.model_name}
                                        label="model-name"
                                        onChange={this.handleSelectModelNameChange}
                                />
                                <FormHelperText>This name will be used for storing the model instance.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        type="number"
                                        labelid="test_size-selector-label"
                                        id="test_size-selector"
                                        value= {this.state.selected_test_size}
                                        label="test size"
                                        onChange={this.handleSelectTestSizeChange}
                                        InputProps={{ inputProps: { min: 0, max:1, step:0.01 } }}
                                />
                                <FormHelperText>If float, should be between 0.0 and 1.0 and represent the proportion of the dataset to include in the train split.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="random_state-selector-label"
                                        id="random_state-selector"
                                        value= {this.state.selected_random_state}
                                        label="random state"
                                        onChange={this.handleSelectRandomStateChange}
                                />
                                <FormHelperText>Controls the shuffling applied to the data before applying the split.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="shuffle-selector-label">Shuffle</InputLabel>
                                <Select
                                        labelid="shuffle-selector-label"
                                        id="shuffle-selector"
                                        value= {this.state.selected_shuffle}
                                        label="shuffle"
                                        onChange={this.handleSelectShuffleChange}
                                >
                                    <MenuItem value={"true"}><em>True</em></MenuItem>
                                    <MenuItem value={"false"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>Whether or not to shuffle the data before splitting. . </FormHelperText>
                            </FormControl>
                            <hr/>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_dependent_variable && !this.state.selected_independent_variables}>
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.LinearRegression_show}>
                                Proceed >
                            </Button>
                        </form>
                            <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                                <FormHelperText>Selected independent variables</FormHelperText>
                                <div>
                                <span>
                                    {this.state.selected_independent_variables.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                                </div>
                            </FormControl>
                        <br/>
                        <br/>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Regression Results
                        </Typography>
                        <hr className="result"/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    <Tab label="New Dataset" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset}/>
                            </TabPanel>
                             <TabPanel value={this.state.tabvalue} index={1}>
                                 <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'90%'}}>
                                     <Table>
                                         <TableHead>
                                             <TableRow>
                                                 <TableCell className="tableHeadCell">Mean Squared Error (MSE)</TableCell>
                                                 <TableCell className="tableHeadCell">R-squared (R²)</TableCell>
                                                 <TableCell className="tableHeadCell">Test Loss</TableCell>
                                                 <TableCell className="tableHeadCell">Coefficient of Determination</TableCell>
                                                 <TableCell className="tableHeadCell">Intercept</TableCell>
                                                 <TableCell className="tableHeadCell">Mean Absolute Error (MAE)</TableCell>
                                                 <TableCell className="tableHeadCell">Root Mean Squared Error (RMSE)</TableCell>
                                             </TableRow>
                                         </TableHead>
                                         <TableBody>
                                             <TableRow>
                                                 <TableCell className="tableCell" >{Number.parseFloat(this.state.test_data.mse).toExponential(9)}</TableCell>
                                                 <TableCell className="tableCell" >{Number.parseFloat(this.state.test_data.r2_score).toExponential(9)}</TableCell>
                                                 <TableCell className="tableCell" >{Number.parseFloat(this.state.test_data.Loss).toExponential(9)}</TableCell>
                                                 <TableCell className="tableCell" >{ Number.parseFloat(this.state.test_data.coeff_determination).toExponential(9)}</TableCell>
                                                 <TableCell className="tableCell" >{ Number.parseFloat(this.state.test_data.intercept).toExponential(9)}</TableCell>
                                                 <TableCell className="tableCell" >{ Number.parseFloat(this.state.test_data.mae).toExponential(9)}</TableCell>
                                                 <TableCell className="tableCell" >{ Number.parseFloat(this.state.test_data.rmse).toExponential(9)}</TableCell>
                                             </TableRow>
                                         </TableBody>
                                     </Table>
                                 </TableContainer>
                                <br/>
                                 <Box component={Paper} className="SampleCharacteristics" sx={{width:'90%'}}
                                      mb={2}
                                      display="flex"
                                      flexDirection="column"
                                      marginLeft='auto'
                                      marginRight= 'auto'
                                      padding='5px'>
                                     <Typography variant="h6" component="div">Estimated coefficients for the linear regression problem.</Typography>
                                     <JsonTable className="jsonResultsTable"
                                                 rows = {this.state.dfslope}/></Box>
                                 <Grid container padding='5px'>
                                     <Grid item xs={6} >
                                         <img src={this.state.svg1_path + "?random=" + new Date().getTime()}
                                              loading="lazy"
                                              style={{zoom:'80%'}}
                                         />
                                     </Grid>
                                     <Grid item xs={6} >
                                         <img src={this.state.svg5_path + "?random=" + new Date().getTime()}
                                              loading="lazy"
                                              style={{zoom:'80%'}}
                                         />
                                     </Grid>
                                 </Grid>
                                 <Grid container>
                                     <Grid item xs={6} >
                                         <img src={this.state.svg2_path + "?random=" + new Date().getTime()}
                                              loading="lazy"
                                              style={{zoom:'80%'}}
                                         />
                                     </Grid>
                                     <Grid item xs={6} >
                                         <img src={this.state.svg3_path + "?random=" + new Date().getTime()}
                                              loading="lazy"
                                              style={{zoom:'80%'}}
                                         />
                                     </Grid>
                                 </Grid>
                            </TabPanel>
                            {/*<TabPanel value={this.state.tabvalue} index={2}>*/}
                            {/*    <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}} dangerouslySetInnerHTML={{__html: this.state.influence_points}} />*/}
                            {/*</TabPanel>*/}
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default LinearRegressionModelCreation;
