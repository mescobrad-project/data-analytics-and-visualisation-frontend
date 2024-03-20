import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem, Paper,
    Select, Tab, Table, TableCell, TableContainer, TableHead, TableRow, Tabs, TextareaAutosize, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import qs from "qs";
import ScatterPlot from "../ui-components/ScatterPlot";
import "../../pages/hypothesis_testing/normality_tests.scss"
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../ui-components/ProceedButton";
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

class GrangerAnalysisFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            column_names: [],
            file_names:[],
            test_data: [],

            //Values selected currently on the form
            selected_predictor_variable: "",
            selected_response_variable: "",
            // selected_max_lags: "",
            max_lags: [],


            num_lags: [],
            lags: [],

            // Hide/show results
            GrangerAnalysis_show : false,
            GrangerAnalysis_step2_show: false,
            status: ""


        };

        //Binding functions of the class
        this.handleSelectPredictorVariableChange = this.handleSelectPredictorVariableChange.bind(this);

        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        // Initialise component
        // - values of channels from the backend

        this.handleSelectPredictorVariableChange = this.handleSelectPredictorVariableChange.bind(this);
        this.handleSelectResponseVariableChange = this.handleSelectResponseVariableChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchFileNames();
        this.fetchColumnNames();

    }

    // debug = () => {
    //     console.log("DEBUG")
    //     console.log(this.state)
    // };

    handleAdd = (event) => {
        event.preventDefault();
        this.setState((prevState) => ({ max_lags: [...prevState.max_lags, ""] }));
    };

    handleChangeMaxLags = (event, index) => {
        const newValues = [...this.state.max_lags];
        newValues[index] = event.target.value;
        this.setState({ max_lags: newValues });
    };

    handleRemove = (event, index) => {
        event.preventDefault();
        const newValues = [...this.state.max_lags];
        newValues.splice(index, 1);
        this.setState({ max_lags: newValues });
    };


    /**
     * Process and send the request for auto correlation and handle the response
     */

    async handleSubmit(event) {
        event.preventDefault();

        // let to_send_shrinkage_2 = null;
        // let to_send_shrinkage_3 = null;
        //
        // if (!!this.state.selected_shrinkage_2){
        //     to_send_shrinkage_2 = parseFloat(this.state.selected_shrinkage_2)
        // }
        // if (!!this.state.selected_shrinkage_3){
        //     to_send_shrinkage_3 = parseFloat(this.state.selected_shrinkage_3)
        // }

        this.setState({GrangerAnalysis_show: false})



        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("granger_analysis", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                predictor_variable: this.state.selected_file_name+"--"+this.state.selected_predictor_variable,
                response_variable: this.state.selected_file_name+"--"+this.state.selected_response_variable,
                num_lags: this.state.max_lags.map((value) => parseInt(value)) },
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            const resultJson = res.data['lags'];
            const status = res.data['status'];
            console.log(resultJson)
            console.log('Test')

            this.setState({status: status})
            this.setState({test_data: resultJson})
            this.setState({tabvalue:1})

            // console.log("")
            // console.log(temp_array)


            this.setState({GrangerAnalysis_show: true})




        });
        // const response = await fetch("http://localhost:8000/test/return_autocorrelation", {
        //     method: "GET",
        //     headers: {"Content-Type": "application/json"},
        //     // body: JSON.stringify({"name": this.state.selected_channel})
        //     // body: newTodo
        // })
        // // .then(response => updateResult(response.json()) )
        // const resultJson = await response.json()
        // // let temp_array = []
        // // for ( let it =0 ; it < resultJson.values_autocorrelation.length; it++){
        // //     let temp_object = {}
        // //     temp_object["order"] = it
        // //     temp_object["value"] = resultJson.values_autocorrelation[it]
        // //     temp_array.push(temp_object)
        // // }
        // // console.log(temp_array)
        // this.setState({correlation_results: resultJson.values_autocorrelation})
        this.setState.bind(this)
        console.log(this.state)
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
        window.location.replace("/")
    }
    handleSelectPredictorVariableChange(event){
        this.setState( {selected_predictor_variable: event.target.value})
    }
    handleSelectResponseVariableChange(event){
        this.setState( {selected_response_variable: event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_response_variable: ""})
            this.setState({selected_predictor_variable: ""})
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
                            Granger Analysis Parameterisation
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
                                <InputLabel id="predictor-variable-selector-label">Predictor Variable</InputLabel>
                                <Select
                                        labelId="predictor-variable-selector-label"
                                        id="predictor-variable-selector"
                                        value= {this.state.selected_predictor_variable}
                                        label="Predictor Variable"
                                        onChange={this.handleSelectPredictorVariableChange}
                                >

                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Predictor Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="response-variable-selector-label">Response Variable</InputLabel>
                                <Select
                                        labelId="response-variable-selector-label"
                                        id="response-variable-selector"
                                        value= {this.state.selected_response_variable}
                                        label="Response Variable"
                                        onChange={this.handleSelectResponseVariableChange}
                                >

                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Response Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                {this.state.max_lags.map((value, index) => (
                                        <Grid>
                                            <TextField sx={{ width:'85%'}} size={"small"}
                                                    key={index}
                                                    type="number"
                                                    value={value}
                                                    onChange={(event) => this.handleChangeMaxLags(event, index)}
                                            />
                                            <Button sx={{width:'10%', float: "right"}} variant="contained" color="primary" onClick={(event) => this.handleRemove(event, index)}>X</Button>
                                        </Grid>
                                ))}
                                <Button variant="contained" color="primary" onClick={this.handleAdd}>Add Max Lags</Button>
                                <FormHelperText>Select number of max lags. Press Add to add max lags. If an integer, computes the test for all lags up to this number. If you provide more than one integerm, computes the tests only for the lags provided.</FormHelperText>
                            </FormControl>
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <TextField*/}
                            {/*            labelId="num-lag-label"*/}
                            {/*            id="num-lag-selector"*/}
                            {/*            value= {this.state.selected_max_lags}*/}
                            {/*            label="num-lag"*/}
                            {/*            onChange={this.handleSelectNumLagsChange}*/}
                            {/*    />*/}
                            {/*    <FormHelperText>Select number of max lags. If an integer, computes the test for all lags up to this number. If you provide the values with comma between them, computes the tests only for the lags provided.</FormHelperText>*/}
                            {/*</FormControl>*/}


                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <ProceedButton></ProceedButton>
                        {/*<form onSubmit={async (event) => {*/}
                        {/*    event.preventDefault();*/}
                        {/*    window.location.replace("/")*/}
                        {/*    // Send the request*/}
                        {/*}}>*/}
                        {/*    <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit">*/}
                        {/*        Proceed >*/}
                        {/*    </Button>*/}
                        {/*</form>*/}
                        <br/>
                        <br/>
                    </Grid>
                    <Grid  item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Granger Causality Tests Results
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        {/*<div style={{ display: (this.state.LassoRegression_show ? 'block' : 'none') }}>{this.state.coefficients}</div>*/}
                        {/*<div style={{ display: (this.state.LassoRegression_show ? 'block' : 'none') }}>{this.state.intercept}</div>*/}
                        {/*<div style={{ display: (this.state.LassoRegression_show ? 'block' : 'none') }}>{this.state.dataframe}</div>*/}
                        <hr style={{ display: (this.state.GrangerAnalysis_show ? 'block' : 'none') }}/>
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
                                <div style={{display: (this.state.status === 'Success' ? 'block': 'none')}}>
                                    <Grid container direction="row" style={{ display: (this.state.GrangerAnalysis_show ? 'block' : 'none') }}>
                                        { this.state.test_data.map((item) => {
                                            return (
                                                        <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                            <Table>
                                                                <TableHead>
                                                                     <TableRow>
                                                                        <TableCell className="tableHeadCell" sx={{width:'15%'}}>number of lags {item.lag_num}</TableCell>
                                                                        <TableCell className="tableHeadCell" sx={{width:'15%'}}>F</TableCell>
                                                                         <TableCell className="tableHeadCell" sx={{width:'15%'}}>chi2</TableCell>
                                                                         <TableCell className="tableHeadCell" sx={{width:'15%'}}>p</TableCell>
                                                                        <TableCell className="tableHeadCell" sx={{width:'15%'}}>df</TableCell>
                                                                        <TableCell className="tableHeadCell" sx={{width:'15%'}}>df_denom</TableCell>
                                                                        <TableCell className="tableHeadCell" sx={{width:'15%'}}>df_num</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                { item.result.map((elem) => {
                                                                    return (
                                                                            <TableRow>
                                                                                <TableCell className="tableCell">{elem.key}</TableCell>
                                                                                <TableCell className="tableCell">{elem.F}</TableCell>
                                                                                <TableCell className="tableCell">{elem.chi2}</TableCell>
                                                                                <TableCell className="tableCell">{elem.p}</TableCell>
                                                                                <TableCell className="tableCell">{elem.df}</TableCell>
                                                                                <TableCell className="tableCell">{elem.df_denom}</TableCell>
                                                                                <TableCell className="tableCell">{elem.df_num}</TableCell>
                                                                            </TableRow>
                                                                    );
                                                                })}
                                                            </Table>
                                                        </TableContainer>
                                                    );
                                        })}
                                    </Grid>
                                </div>
                                <div style={{display: (this.state.status !== 'Success' ? 'block': 'none')}}>
                                    <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                        <Table>
                                            <TableRow>
                                                <TableCell>{this.state.status}</TableCell>
                                            </TableRow>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default GrangerAnalysisFunctionPage;
