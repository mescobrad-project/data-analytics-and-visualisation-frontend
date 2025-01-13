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


class AutoencoderModelCreation extends React.Component {
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
            // test_data: {
            //     mse: "",
            //     r2_score: "",
            //     Loss:'',
            //     coeff_determination:'',
            //     intercept:'',
            //     mae:'',
            //     rmse:'',
            //     slope:''
            // },
            // dfslope:'',
            //Values selected currently on the form
            selected_file_name: "",
            selected_no_of_features: 800,
            selected_test_size:0.10,
            selected_iterations:2,
            selected_lr: 0.01,
            selected_early_stopping_patience: 40,

            FrenderChild:0,
            model_name:'AE-'+crypto.randomUUID(),
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
    //
        //Binding functions of the class
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleSelectModelNameChange = this.handleSelectModelNameChange.bind(this);
        this.handleSelectTestSizeChange = this.handleSelectTestSizeChange.bind(this);
        this.handleSelectIterationsChange = this.handleSelectIterationsChange.bind(this);
        this.handleSelectEarlyStoppingPatienceChange = this.handleSelectEarlyStoppingPatienceChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        // this.renderIterationTabs - this.renderIterationTabs.bind(this);
        this.handleSelectNoOfFeaturesChange = this.handleSelectNoOfFeaturesChange.bind(this);
        this.handleSelectLrChange = this.handleSelectLrChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
    }
    // /**
    //  * Process and send the request for auto correlation and handle the response
    //  */
    //
    async handleSubmit(event) {
        event.preventDefault();
        this.setState({LinearRegression_show: false})
        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("ai_tabular_ae_training_experiment", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                csv_path: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                no_of_features: this.state.selected_no_of_features,
                test_size: this.state.selected_test_size,
                iterations: this.state.selected_iterations,
                lr: this.state.selected_lr,
                early_stopping_patience: this.state.selected_early_stopping_patience},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            console.log(res.results)
            // this.setState({test_data: res.data})
            // this.setState({LinearRegression_show: true})
            // this.setState({dfslope:JSON.parse(res.data.slope)});
            // this.setState({tabvalue:1})
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
    //
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

    handleSelectNoOfFeaturesChange(event){
        this.setState( {selected_no_of_features: event.target.value})
    }
    handleSelectModelNameChange(event){
        this.setState( {model_name: event.target.value})
    }
    handleSelectTestSizeChange(event){
        this.setState( {selected_test_size: event.target.value})
    }
    handleSelectIterationsChange(event){
        this.setState( {selected_iterations: event.target.value})
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
    renderIterationTabs(){
        return Array.from({ length: this.state.selected_iterations }, (_, index) => (
                <Tab key={index} label={`Iteration ${index + 1}`} {...a11yProps(index)} />
        ));
    }
    renderIterationPanels() {
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        const { selected_iterations, tabvalue } = this.state;
        const basePath = ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                + '/step_' + params.get("step_id") + '/output'; // Update this path

        return Array.from({ length: selected_iterations }, (_, index) => (
                <TabPanel key={index} value={tabvalue} index={index}>
                    <img src={`${basePath}/train_val_metrics_plot_experiment${index + 1}.png`} alt={`Train-Val Metrics Plot ${index + 1}`} style={{ width: '70%', marginBottom: '10px' }} />
                    <img src={`${basePath}/classification_report_experiment${index + 1}.png`} alt={`Classification Report ${index + 1}`} style={{ width: '70%', marginBottom: '10px' }} />
                    <img src={`${basePath}/confusion_matrix_experiment${index + 1}.png`} alt={`Confusion Matrix ${index + 1}`} style={{ width: '70%', marginBottom: '10px' }} />
                </TabPanel>
        ));
    }
    handleSelectLrChange(event){
        this.setState({selected_lr: event.target.value})
    }
    handleSelectEarlyStoppingPatienceChange(event){
        this.setState({selected_early_stopping_patience: event.target.value})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Auto Encoder Parameterisation
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
                                <TextField
                                        type="number"
                                        labelid="no_of_features-selector-label"
                                        id="no_of_features-selector"
                                        value= {this.state.selected_no_of_features}
                                        label="no of features"
                                        onChange={this.handleSelectNoOfFeaturesChange}
                                        // InputProps={{ inputProps: { min: 0, max:1, step:0.01 } }}
                                />
                                <FormHelperText>If float, should be between 0.0 and 1.0 and represent the proportion of the dataset to include in the train split.</FormHelperText>
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
                                        type="number"
                                        labelid="iterations-selector-label"
                                        id="iterations-selector"
                                        value= {this.state.selected_iterations}
                                        label="iterations"
                                        onChange={this.handleSelectIterationsChange}
                                        // InputProps={{ inputProps: { min: 0, max:1, step:0.01 } }}
                                />
                                <FormHelperText>If float, should be between 0.0 and 1.0 and represent the proportion of the dataset to include in the train split.</FormHelperText>
                            </FormControl>

                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        type="number"
                                        labelid="lr-selector-label"
                                        id="lr-selector"
                                        value= {this.state.selected_lr}
                                        label="lr"
                                        onChange={this.handleSelectLrChange}
                                        InputProps={{ inputProps: { min: 0, max:1, step:0.01 } }}
                                />
                                <FormHelperText>If float, should be between 0.0 and 1.0 and represent the proportion of the dataset to include in the train split.</FormHelperText>
                            </FormControl>

                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        type="number"
                                        labelid="early_stopping_patience-selector-label"
                                        id="early_stopping_patience-selector"
                                        value= {this.state.selected_early_stopping_patience}
                                        label="early stopping patience"
                                        onChange={this.handleSelectEarlyStoppingPatienceChange}
                                        // InputProps={{ inputProps: { min: 0, max:1, step:0.01 } }}
                                />
                                <FormHelperText>If float, should be between 0.0 and 1.0 and represent the proportion of the dataset to include in the train split.</FormHelperText>
                            </FormControl>


                            <hr/>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_dependent_variable && !this.state.selected_independent_variables}>
                                Run Analysis
                            </Button>
                        </form>

                        <br/>
                        {this.state.analysisrunning ? (
                                <LoadingWidget/>
                        ) : (<span></span>)}
                        <br/>
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Auto Encoder Results
                        </Typography>
                        <hr className="result"/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="iteration tabs">
                                    {this.renderIterationTabs()}
                                </Tabs>
                                {this.renderIterationPanels()}
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default AutoencoderModelCreation;
