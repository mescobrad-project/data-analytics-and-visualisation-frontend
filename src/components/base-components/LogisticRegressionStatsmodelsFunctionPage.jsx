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
    Select, Tab, Table, TableCell, TableContainer, TableRow, Tabs, Typography
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

class LogisticRegressionStatsmodelsFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            column_names: [],
            file_names:[],
            test_data: {
                Dataframe:""
            },
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_independent_variables: [],
            binary_columns: [],

            dep_variable: "",
            model: "",
            method: "",
            date: "",
            time: "",
            no_observations: "",
            df_resid: "",
            df_mod: "",
            cov_type: "",
            pseudo_r_sq: "",
            log_like: "",
            ll_null: "",
            llr_p: "",

            first_table: "",
            second_table: "",
            intercept: "",
            dataframe: "",
            skew: "",
            kurtosis: "",
            jarque_bera_stat: "",
            jarque_bera_p: "",
            omnibus_test_stat: "",
            omnibus_test_p: "",
            durbin_watson: "",
            actual_values: [],
            predicted_values: [],
            residuals: [],
            coef_deter: "",
            df_scatter: "",
            values_columns: [],
            values_dict: [],
            scatter_chart_data: [],
            selected_x_axis: "",
            selected_y_axis: "",

            // Hide/show results
            LogisticRegressionStatsmodels_show : false,
            LogisticRegressionStatsmodels_step2_show: false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);

        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleSelectVariableNameChange = this.handleSelectVariableNameChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.handleSelectXAxisnChange = this.handleSelectXAxisnChange.bind(this);
        this.handleSelectYAxisnChange = this.handleSelectYAxisnChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleScatter = this.handleScatter.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.fetchFileNames();
        this.fetchColumnNames();

    }

    // debug = () => {
    //     console.log("DEBUG")
    //     console.log(this.state)
    // };


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

        this.setState({LogisticRegressionStatsmodels_show: false})



        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("logistic_regressor_statsmodels", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent_variable: this.state.selected_dependent_variable,
                independent_variables: this.state.selected_independent_variables},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            const resultJson = res.data['Result'];
            const status = res.data['status'];
            console.log(resultJson)
            console.log(status)



            // console.log("")
            // console.log(temp_array)

            this.setState({status: status})
            if (status === 'Success') {
                this.setState({coefficients: resultJson['coefficients']})
                this.setState({intercept: resultJson['intercept']})
                this.setState({dataframe: resultJson['dataframe']})
                this.setState({skew: resultJson['skew']})
                this.setState({kurtosis: resultJson['kurtosis']})
                this.setState({jarque_bera_stat: resultJson['Jarque Bera statistic']})
                this.setState({jarque_bera_p: resultJson['Jarque Bera p-value']})
                this.setState({omnibus_test_stat: resultJson['Omnibus test statistic']})
                this.setState({omnibus_test_p: resultJson['Omnibus test p-value']})
                this.setState({durbin_watson: resultJson['Durbin Watson']})
                this.setState({actual_values: resultJson['actual_values']})
                this.setState({predicted_values: resultJson['predicted values']})
                this.setState({residuals: resultJson['residuals']})
                this.setState({coef_deter: resultJson['coefficient of determination (R^2)']})
                this.setState({df_scatter: resultJson['values_df']})
                this.setState({values_dict: resultJson['values_dict']})
                this.setState({values_columns: resultJson['values_columns']})
                this.setState({first_table: JSON.parse(resultJson['first_table'])})
                this.setState({second_table: JSON.parse(resultJson['second table'])})
                this.setState({dep_variable: resultJson['dep']})
                this.setState({model: resultJson['model']})
                this.setState({method: resultJson['method']})
                this.setState({date: resultJson['date']})
                this.setState({time: resultJson['time']})
                this.setState({no_observations: resultJson['no_obs']})
                this.setState({df_resid: resultJson['resid']})
                this.setState({df_mod: resultJson['df_model']})
                this.setState({cov_type: resultJson['cov_type']})
                this.setState({pseudo_r_sq: resultJson['pseudo_r_squared']})
                this.setState({ll_null: resultJson['LL-Null']})
                this.setState({llr_p: resultJson['LLR p-value']})
                this.setState({log_like: resultJson['log_like']})
                this.setState({converged: resultJson['converged']})

                this.setState({LogisticRegressionStatsmodels_show: true})
            }
            this.setState({tabvalue:1})




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

    async handleScatter(event) {
        event.preventDefault();
        let temp_array = []
        console.log(this.state.values_dict)
        for (let i = 0; i < this.state.values_dict[this.state.selected_x_axis].length; i++) {
            let temp_object = {}

            temp_object["xValue"] = this.state.values_dict[this.state.selected_x_axis][i]
            temp_object["yValue"] = this.state.values_dict[this.state.selected_y_axis][i]

            temp_array.push(temp_object)
        }
        console.log(temp_array)
        this.setState({scatter_chart_data: temp_array})

        this.setState({LogisticRegressionStatsmodels_step2_show: true})

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
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        // this.setState( {selected_variable: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchBinaryColumnNames()
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_independent_variables: []})
            this.setState({selected_independent_variable: ""})
            this.setState({selected_dependent_variable: ""})
            this.state.LogisticRegressionStatsmodels_show=false
            this.state.LogisticRegressionStatsmodels_step2_show=false
        })
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleListDelete(event) {
        let newArray = this.state.selected_independent_variables.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_independent_variables:newList})
    }
    handleSelectVariableNameChange(event){
        this.setState( {selected_independent_variable: event.target.value})
        let newArray = this.state.selected_independent_variables.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_independent_variables:newArray})
    }


    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }

    clear(){
        this.setState({selected_independent_variables: []})
    }
    selectAll(){
        this.setState({selected_independent_variables: this.state.columns})
    }
    handleSelectXAxisnChange(event){
        this.setState({selected_x_axis: event.target.value})
    }
    handleSelectYAxisnChange(event){
        this.setState({selected_y_axis: event.target.value})
    }


    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Logistic Regression (Statsmodels) Parameterisation
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

                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Dependent Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Columns</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variable}
                                        label="Column"
                                        onChange={this.handleSelectVariableNameChange}
                                >

                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Independent Variables</FormHelperText>
                            </FormControl>



                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_dependent_variable && !this.state.selected_independent_variables}>
                                {/*|| !this.state.selected_method*/}
                                Submit
                            </Button>
                        </form>
                        {/*<form onSubmit={this.handleProceed}>*/}
                        {/*    <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"*/}
                        {/*            disabled={!this.state.LogisticRegressionStatsmodels_show} >*/}
                        {/*        Proceed >*/}
                        {/*    </Button>*/}
                        {/*</form>*/}
                        <ProceedButton  disabled={!this.state.LogisticRegressionStatsmodels_show}  ></ProceedButton>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected independent variables [click to remove]</FormHelperText>
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
                            <Button onClick={this.clear}>
                                Clear All
                            </Button>
                        </FormControl>
                        <br/>
                        <br/>
                        {/*<div  style={{display: (this.state.LogisticRegressionStatsmodels_show ? 'block' : 'none')}}>*/}
                        {/*    <hr style={{display: (this.state.LogisticRegressionStatsmodels_show ? 'block' : 'none')}}/>*/}
                        {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                        {/*        Available Variables*/}
                        {/*    </Typography>*/}
                        {/*    <form onSubmit={this.handleScatter}>*/}
                        {/*        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                        {/*            <InputLabel id="x-axis-selector-label">Select X-axis</InputLabel>*/}
                        {/*            <Select*/}
                        {/*                    labelId="x-axis-selector-label"*/}
                        {/*                    id="x-axis-selector"*/}
                        {/*                    value= {this.state.selected_x_axis}*/}
                        {/*                    label="x-axis"*/}
                        {/*                    onChange={this.handleSelectXAxisnChange}*/}
                        {/*            >*/}

                        {/*                {this.state.values_columns.map((column) => (*/}
                        {/*                        <MenuItem value={column}>*/}
                        {/*                            {column}*/}
                        {/*                        </MenuItem>*/}
                        {/*                ))}*/}
                        {/*            </Select>*/}
                        {/*            <FormHelperText>Select Variable for X axis of scatterplot</FormHelperText>*/}
                        {/*        </FormControl>*/}
                        {/*        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                        {/*            <InputLabel id="y-axis-selector-label">Select Y-axis</InputLabel>*/}
                        {/*            <Select*/}
                        {/*                    labelId="y-axis-selector-label"*/}
                        {/*                    id="y-axis-selector"*/}
                        {/*                    value= {this.state.selected_y_axis}*/}
                        {/*                    label="y-axis"*/}
                        {/*                    onChange={this.handleSelectYAxisnChange}*/}
                        {/*            >*/}

                        {/*                {this.state.values_columns.map((column) => (*/}
                        {/*                        <MenuItem value={column}>*/}
                        {/*                            {column}*/}
                        {/*                        </MenuItem>*/}
                        {/*                ))}*/}
                        {/*            </Select>*/}
                        {/*            <FormHelperText>Select Variable for Y axis of scatterplot</FormHelperText>*/}
                        {/*        </FormControl>*/}
                        {/*        <Button variant="contained" color="primary" type="submit">*/}
                        {/*            Submit*/}
                        {/*        </Button>*/}
                        {/*    </form>*/}
                        {/*    <div style={{ display: (this.state.LogisticRegressionStatsmodels_step2_show ? 'block' : 'none') }}>*/}
                        {/*        <ScatterPlot chart_id="scatter_chart_id"  chart_data={this.state.scatter_chart_data}/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </Grid>
                    <Grid  item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Logistic Regression (Statsmodels) Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        {/*<div style={{ display: (this.state.LogisticRegressionStatsmodels_show ? 'block' : 'none') }}>{this.state.coefficients}</div>*/}
                        {/*<div style={{ display: (this.state.LogisticRegressionStatsmodels_show ? 'block' : 'none') }}>{this.state.intercept}</div>*/}
                        {/*<div style={{ display: (this.state.LogisticRegressionStatsmodels_show ? 'block' : 'none') }}>{this.state.dataframe}</div>*/}
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
                                    <div style={{display: (this.state.LogisticRegressionStatsmodels_show ? 'block' : 'none')}}>
                                        <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                            <Table>
                                                <TableRow>
                                                    <TableCell><strong>Dependent Variable:</strong></TableCell>
                                                    <TableCell>{this.state.dep_variable}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Model:</strong></TableCell>
                                                    <TableCell>{this.state.model}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Method:</strong></TableCell>
                                                    <TableCell>{this.state.method}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Date:</strong></TableCell>
                                                    <TableCell>{this.state.date}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Time:</strong></TableCell>
                                                    <TableCell>{this.state.time}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Converged:</strong></TableCell>
                                                    <TableCell>{this.state.converged}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Covariance Type:</strong></TableCell>
                                                    <TableCell>{this.state.cov_type}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>No. Observations:</strong></TableCell>
                                                    <TableCell>{this.state.no_observations}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Df Residuals:</strong></TableCell>
                                                    <TableCell>{this.state.df_resid}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Df Model:</strong></TableCell>
                                                    <TableCell>{this.state.df_mod}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Pseudo R-squared:</strong></TableCell>
                                                    <TableCell>{this.state.pseudo_r_sq}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Log-Likelihood:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.log_like).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>LL-Null:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.ll_null).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>LLR p-value:</strong></TableCell>
                                                    <TableCell>{this.state.llr_p}</TableCell>
                                                </TableRow>
                                            </Table>
                                        </TableContainer>
                                        <JsonTable className="jsonResultsTable" rows = {this.state.second_table}/>
                                    </div>
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
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <div style={{display: (this.state.status === 'Success' ? 'block': 'none')}}>
                                    {/*<JsonTable className="jsonResultsTable" rows = {this.state.df_scatter}/>*/}
                                </div>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default LogisticRegressionStatsmodelsFunctionPage;
