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
import LoadingWidget from "../../components/ui-components/LoadingWidget";
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


class LogisticRegressionModelCreation extends React.Component {
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
            binary_columns: [],
            file_names:[],
            test_data: {
                coeff_determination:'',
                decision_function:'',
                intercept:'',
                classification_report:'',
                slope:''
            },
            dfslope:'',
            Classif_rprt:'',
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_independent_variables: [],
            selected_independent_variable: "",
            selected_test_size:'0.01',
            selected_random_state:'10',
            selected_shuffle:false,
            analysisrunning:false,
            selected_file_name: "",
            FrenderChild:0,
            tabvalue:0,
            LogisticRegression_show:false,
            model_name:'Logistic-'+crypto.randomUUID(),
            svg1_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/summary_lg.svg',
            svg2_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/beeswarm_lg.svg',
            svg3_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/shap_waterfall_lg.svg',
            svg4_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/shap_heatmap_lg.svg',
            svg5_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/shap_violin_lg.svg',
            // model_name:'LR - '+ Date().toLocaleString("en-GB")
        };

        //Binding functions of the class
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
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
        // this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
    }
    /**
     * Process and send the request for auto correlation and handle the response
     */

    async handleSubmit(event) {
        event.preventDefault();
        this.setState({LogisticRegression_show: false})
        this.setState({analysisrunning: true})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("logistic_reg_create_model", {
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
            this.setState({LogisticRegression_show: true})
            this.setState({dfslope:JSON.parse(res.data.slope)});
            this.setState({Classif_rprt:JSON.parse(res.data.classification_report)});
            this.setState({Decision_Function:JSON.parse(res.data.decision_function)});
            this.setState({tabvalue:1})
            console.log(res.data.classification_report)
            this.setState({analysisrunning:false})
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
            this.fetchBinaryColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_independent_variables: []})
            this.setState({selected_dependent_variable: ""})
            this.state.LogisticRegression_show=false
            this.state.analysisrunning=false
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
                            Logistic Regression Parameterisation
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
                                            <MenuItem key={column} value={column}>{column}</MenuItem>
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

                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem key={column} value={column}>
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
                                Run Analysis
                            </Button>
                        </form>
                            <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                                <FormHelperText>Selected variables</FormHelperText>
                                <div>
                                <span>
                                    {this.state.selected_independent_variables.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    key={column}
                                                    id={column}
                                                    >
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                                </div>
                            </FormControl>
                        <br/>
                        {this.state.analysisrunning ? (
                                        <LoadingWidget/>
                        ) : (<span></span>)}
                        <br/>
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Logistic Regression Results
                        </Typography>
                        <hr className="result"/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    <Tab label="Decision function" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset}/>
                            </TabPanel>
                             <TabPanel value={this.state.tabvalue} index={1}>
                                 <Grid style={{display: (this.state.LogisticRegression_show ? 'block' : 'none')}}>
                                     {this.state.test_data['status']!=='Success' ? (
                                             <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                     ) : (
                                             <Grid>
                                                 <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'90%'}}>
                                                     <Table>
                                                         <TableHead>
                                                             <TableRow>
                                                                 <TableCell className="tableHeadCell">Coefficient of Determination</TableCell>
                                                                 <TableCell className="tableHeadCell">Intercept</TableCell>
                                                             </TableRow>
                                                         </TableHead>
                                                         <TableBody>
                                                             <TableRow>
                                                                 <TableCell className="tableCell" >{ Number.parseFloat(this.state.test_data.coeff_determination).toExponential(9)}</TableCell>
                                                                 <TableCell className="tableCell" >{ Number.parseFloat(this.state.test_data.intercept).toExponential(9)}</TableCell>
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
                                                     <Typography variant="h6" component="div">Estimated coefficients for the logistic regression problem.</Typography>
                                                     <JsonTable className="jsonResultsTable"
                                                                 rows = {this.state.dfslope}/></Box>
                                                 <Box component={Paper} className="SampleCharacteristics" sx={{width:'90%'}}
                                                      mb={2}
                                                      display="flex"
                                                      flexDirection="column"
                                                      marginLeft='auto'
                                                      marginRight= 'auto'
                                                      padding='5px'>
                                                     <Typography variant="h6" component="div">Classification Report.</Typography>
                                                     {/*{this.state.test_data.classification_report}*/}
                                                     <div><JsonTable className="jsonResultsTable"
                                                                rows = {this.state.Classif_rprt}/>
                                                     </div>
                                                 </Box>
                                                 {/*<Box component={Paper} className="SampleCharacteristics" sx={{width:'90%'}}*/}
                                                 {/*     mb={2}*/}
                                                 {/*     display="flex"*/}
                                                 {/*     flexDirection="column"*/}
                                                 {/*     marginLeft='auto'*/}
                                                 {/*     marginRight= 'auto'*/}
                                                 {/*     padding='5px'>*/}
                                                 {/*    <Typography variant="h6" component="div">Classification Report.</Typography>*/}
                                                 {/*    /!*{this.state.test_data.classification_report}*!/*/}
                                                 {/*    <div><JsonTable className="jsonResultsTable"*/}
                                                 {/*                    rows = {this.state.Decision_Function}/>*/}
                                                 {/*    </div>*/}
                                                 {/*</Box>*/}
                                                     {/*<div >*/}
                                                     {/*    {this.state.Classif_rprt.split('\n').map((item) =>*/}
                                                     {/*            <div>*/}
                                                     {/*                <strong style={{fontSize:'16px'}}>{item}</strong>*/}
                                                     {/*                <TableRow>*/}
                                                     {/*                    { item.substring(item.indexOf(' ')+1).split(' ').map((subitem)=>*/}
                                                     {/*                            <TableCell style={{fontSize:'16px'}}>{subitem}</TableCell>)}*/}
                                                     {/*                </TableRow>*/}
                                                     {/*            </div>)}*/}
                                                     {/*</div>*/}
                                                 {/*</Box>*/}
                                                 <Grid container padding='5px'>
                                                     <Grid item xs={6} >
                                                         <img src={this.state.svg5_path + "?random=" + new Date().getTime()}
                                                              loading="lazy"
                                                              style={{zoom:'80%'}}
                                                         />
                                                     </Grid>
                                                     <Grid item xs={6} >
                                                         <img src={this.state.svg4_path + "?random=" + new Date().getTime()}
                                                              loading="lazy"
                                                              style={{zoom:'80%'}}
                                                         />
                                                     </Grid>
                                                 </Grid>
                                                 <Grid item xs={12} >
                                                     <img src={this.state.svg3_path + "?random=" + new Date().getTime()}
                                                          loading="lazy"
                                                          style={{zoom:'80%'}}
                                                     />
                                                 </Grid>
                                             </Grid>
                                         )}
                                            </Grid>
                                     </TabPanel>
                                    <TabPanel value={this.state.tabvalue} index={2}>
                                        <JsonTable className="jsonResultsTable"
                                                        rows = {this.state.Decision_Function}/>
                                    </TabPanel>

                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default LogisticRegressionModelCreation;
