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
    Paper, Tabs, Tab
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


class LinearRegressionModelLoad extends React.Component {
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
            file_names:[],
            test_data: {
                coeff_determination:'',
                intercept:0,
                status: '',
                y_pred: [],
                dependent_param:'',
                independent_params:'',
                result_dataset:[]
            },
            Test_params:[],
            Test_dependent:'',
            ResultData:[],
            //Values selected currently on the form
            selected_file_name: "",
            selected_model_name: "",
            model_name:'LR-0250254',
            tabvalue:0,
        };

        //Binding functions of the class
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleSelectModelNameChange = this.handleSelectModelNameChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
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
        API.get("linear_reg_load_model", {
            params: {
                workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                file_name: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                model_name:this.state.selected_model_name},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({test_data: res.data})
            this.setState({LinearRegression_show: true})
            this.setState({New_dataset:JSON.parse(res.data.result_dataset)});
            this.setState({Coeff_determination:JSON.parse(res.data.coeff_determination)});
            this.setState({Test_params:res.data.independent_params});
            this.setState({Test_dependent:res.data.dependent_param});
            // this.setState({Test_params:JSON.parse(res.data.params)});
            this.setState({tabvalue:1})
        });
    }
    /**
     * Update state when selection changes in the form
     */

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

    handleSelectModelNameChange(event){
        this.setState( {selected_model_name: event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchDatasetContent()
            this.state.LinearRegression_show=false
        })
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Regression - Select Model
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="file-selector-label">Dataset</InputLabel>
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
                                <InputLabel id="model-selector-label">Load Model</InputLabel>
                                <Select
                                        labelId="model-selector-label"
                                        id="model-selector"
                                        value= {this.state.selected_model_name}
                                        label="Model"
                                        onChange={this.handleSelectModelNameChange}
                                >
                                    {this.state.file_names.filter(file => file.endsWith('.sav')).map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select model.</FormHelperText>
                            </FormControl>

                            <hr/>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_file_name && !this.state.selected_model_name}>
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.LinearRegression_show}>
                                Proceed >
                            </Button>
                        </form>
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
                                                                 <br/>
                                 <Box component={Paper} className="SampleCharacteristics" sx={{width:'90%'}}
                                      mb={2}
                                      display="flex"
                                      flexDirection="column"
                                      marginLeft='auto'
                                      marginRight= 'auto'
                                      padding='5px'>
                                     <Typography variant="h5" component="div">Dependent variable</Typography>
                                     {this.state.Test_dependent}<br/>
                                     <Typography variant="h5" component="div">Intercept</Typography>
                                     {this.state.test_data.intercept}<br/>
                                     <Typography variant="h5" component="div">Estimated coefficients for the linear regression problem.</Typography>
                                     <JsonTable className="jsonResultsTable"
                                                rows = {this.state.Coeff_determination}/>
                                     {/*<Typography variant="h5" component="div">Independent variables</Typography>*/}
                                     {/*{this.state.Test_params.map((value, index)=>*/}
                                     {/*        <p>{value}</p>)}*/}
                                 </Box>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.New_dataset}/>
                                </Box>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default LinearRegressionModelLoad;
