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
    Select, Tab, Table, TableCell, TableContainer, TableRow, Tabs, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import qs from "qs";
import ScatterPlot from "../ui-components/ScatterPlot";
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
class SGDRegressionFunctionPage extends React.Component {
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
            selected_independent_variable: "",
            selected_file_name: "",


            //Values selected currently on the form
            selected_alpha: "0.0001",
            selected_max_iter: "1000",
            selected_epsilon: "0.1",
            selected_eta0: "0.01",
            selected_l1_ratio: "0.15",
            selected_loss: "squared_error",
            selected_learning_rate: "invscaling",
            selected_penalty: "l2",
            selected_solver: "auto",

            coefficients: "",
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
            SGDRegression_show : false,
            SGDRegression_step2_show: false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectMaxIterChange = this.handleSelectMaxIterChange.bind(this);
        this.handleSelectEpsilonChange = this.handleSelectEpsilonChange.bind(this);
        this.handleSelectEta0Change = this.handleSelectEta0Change.bind(this);
        this.handleSelectL1RatioChange = this.handleSelectL1RatioChange.bind(this);
        this.handleSelectLossChange = this.handleSelectLossChange.bind(this);
        this.handleSelectLearningRateChange = this.handleSelectLearningRateChange.bind(this);
        this.handleSelectPenaltyChange = this.handleSelectPenaltyChange.bind(this);
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

        this.setState({SGDRegression_show: false})



        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("sgd_regression", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent_variable: this.state.selected_dependent_variable,
                alpha: this.state.selected_alpha,
                max_iter: this.state.max_iter,
                epsilon: this.state.selected_epsilon,
                eta0: this.state.selected_eta0,
                l1_ratio: this.state.selected_l1_ratio,
                loss: this.state.selected_loss,
                learning_rate: this.state.selected_learning_rate,
                penalty: this.state.penalty,
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

                this.setState({SGDRegression_show: true})
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

        this.setState({SGDRegression_step2_show: true})

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
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        // this.setState( {selected_variable: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_independent_variables: []})
            this.setState({selected_independent_variable: ""})
            this.setState({selected_dependent_variable: ""})
            this.state.SGDRegression_show=false
            this.state.SGDRegression_step2_show=false
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
    // handleSelectRegularizationChange(event){
    //     this.setState({selected_regularization: event.target.value})
    // }

    handleSelectMaxIterChange(event){
        this.setState({selected_max_iter: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState({selected_alpha: event.target.value})
    }
    handleSelectEpsilonChange(event){
        this.setState({selected_epsilon: event.target.value})
    }
    handleSelectEta0Change(event){
        this.setState({selected_eta0: event.target.value})
    }
    handleSelectL1RatioChange(event){
        this.setState({selected_l1_ratio: event.target.value})
    }
    handleSelectLossChange(event){
        this.setState({selected_loss: event.target.value})
    }
    handleSelectLearningRateChange(event){
        this.setState({selected_learning_rate: event.target.value})
    }
    handleSelectPenaltyChange(event){
        this.setState({selected_penalty: event.target.value})
    }

    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
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
                            SGD Regression Parameterisation
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
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="alpha-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="alpha"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>Alpha</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="max-iter-label"
                                        id="max-iter-selector"
                                        value= {this.state.selected_max_iter}
                                        label="max-iter"
                                        onChange={this.handleSelectMaxIterChange}
                                />
                                <FormHelperText>Max Iterations</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="epsilon-label"
                                        id="epsilon-selector"
                                        value= {this.state.selected_epsilon}
                                        label="epsilon"
                                        onChange={this.handleSelectEpsilonChange}
                                />
                                <FormHelperText>Epsilon</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="eta0-label"
                                        id="eta0-selector"
                                        value= {this.state.selected_eta0}
                                        label="eta0"
                                        onChange={this.handleSelectEta0Change}
                                />
                                <FormHelperText>eta0</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="l1-ratio-label"
                                        id="l1-ratio-selector"
                                        value= {this.state.selected_l1_ratio}
                                        label="l1-ratio"
                                        onChange={this.handleSelectL1RatioChange}
                                />
                                <FormHelperText>l1-ratio</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="loss-label">Loss</InputLabel>
                                <Select
                                        labelId="loss-label"
                                        id="loss-selector"
                                        value= {this.state.selected_loss}
                                        label="loss"
                                        onChange={this.handleSelectLossChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"squared_error"}><em>squared error</em></MenuItem>
                                    <MenuItem value={"huber"}><em>huber</em></MenuItem>
                                    <MenuItem value={"epsilon_insensitive"}><em>epsilon insensitive</em></MenuItem>
                                    <MenuItem value={"squared_epsilon_insensitive"}><em>squared epsilon insensitive</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which loss to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="learning-label">Learning Rate</InputLabel>
                                <Select
                                        labelId="learning-rate-label"
                                        id="learning-rate-selector"
                                        value= {this.state.selected_learning_rate}
                                        label="learning-rate"
                                        onChange={this.handleSelectLearningRateChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"invscaling"}><em>invscaling</em></MenuItem>
                                    <MenuItem value={"constant"}><em>constant</em></MenuItem>
                                    <MenuItem value={"optimal"}><em>optimal</em></MenuItem>
                                    <MenuItem value={"adaptive"}><em>adaptive</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which learning rate to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="penalty-label">Penalty</InputLabel>
                                <Select
                                        labelId="penalty-label"
                                        id="penalty-selector"
                                        value= {this.state.selected_penalty}
                                        label="penalty"
                                        onChange={this.handleSelectPenaltyChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"l2"}><em>l2</em></MenuItem>
                                    <MenuItem value={"l1"}><em>l1</em></MenuItem>
                                    <MenuItem value={"elasticnet"}><em>elasticnet</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which penalty to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="solver-selector-label">Solver</InputLabel>
                                <Select
                                        labelId="solver-selector-label"
                                        id="solver-selector"
                                        value= {this.state.selected_solver}
                                        label="Solver"
                                        onChange={this.handleSelectSolverChange}
                                >
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                    <MenuItem value={"svd"}><em>svd</em></MenuItem>
                                    <MenuItem value={"cholesky"}><em>cholesky</em></MenuItem>
                                    <MenuItem value={"sparse_cg"}><em>sparse_cg</em></MenuItem>
                                    <MenuItem value={"lsqr"}><em>lsqr</em></MenuItem>
                                    <MenuItem value={"sag"}><em>sag</em></MenuItem>
                                    <MenuItem value={"lbfgs"}><em>lbfgs</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Solver</FormHelperText>
                            </FormControl>
    
    
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_dependent_variable && !this.state.selected_independent_variables}>
                                {/*|| !this.state.selected_method*/}
                                Submit
                            </Button>
                        </form>
                        {/*<form onSubmit={this.handleProceed}>*/}
                        {/*    <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"*/}
                        {/*            disabled={!this.state.SGDRegression_show}>*/}
                        {/*        Proceed >*/}
                        {/*    </Button>*/}
                        {/*</form>*/}
                        <ProceedButton  disabled={!this.state.SGDRegression_show}></ProceedButton>

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
                        <div  style={{display: (this.state.SGDRegression_show ? 'block' : 'none')}}>
                            <hr style={{display: (this.state.SGDRegression_show ? 'block' : 'none')}}/>
                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                Available Variables
                            </Typography>
                            <form onSubmit={this.handleScatter}>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="x-axis-selector-label">Select X-axis</InputLabel>
                                    <Select
                                            labelId="x-axis-selector-label"
                                            id="x-axis-selector"
                                            value= {this.state.selected_x_axis}
                                            label="x-axis"
                                            onChange={this.handleSelectXAxisnChange}
                                    >
    
                                        {this.state.values_columns.map((column) => (
                                                <MenuItem value={column}>
                                                    {column}
                                                </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select Variable for X axis of scatterplot</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="y-axis-selector-label">Select Y-axis</InputLabel>
                                    <Select
                                            labelId="y-axis-selector-label"
                                            id="y-axis-selector"
                                            value= {this.state.selected_y_axis}
                                            label="y-axis"
                                            onChange={this.handleSelectYAxisnChange}
                                    >
    
                                        {this.state.values_columns.map((column) => (
                                                <MenuItem value={column}>
                                                    {column}
                                                </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select Variable for Y axis of scatterplot</FormHelperText>
                                </FormControl>
                                <Button variant="contained" color="primary" type="submit">
                                    Submit
                                </Button>
                            </form>
                            <div style={{ display: (this.state.SGDRegression_step2_show ? 'block' : 'none') }}>
                                <ScatterPlot chart_id="scatter_chart_id"  chart_data={this.state.scatter_chart_data}/>
                            </div>
                        </div>
                    </Grid>
                    <Grid  item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            SGD Regression Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}
    
                        {/*<div style={{ display: (this.state.SGDRegression_show ? 'block' : 'none') }}>{this.state.coefficients}</div>*/}
                        {/*<div style={{ display: (this.state.SGDRegression_show ? 'block' : 'none') }}>{this.state.intercept}</div>*/}
                        {/*<div style={{ display: (this.state.SGDRegression_show ? 'block' : 'none') }}>{this.state.dataframe}</div>*/}
                        <hr style={{ display: (this.state.SGD_show ? 'block' : 'none') }}/>
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
                                    <div dangerouslySetInnerHTML={{__html: this.state.dataframe}} />
                                    <div style={{display: (this.state.SGDRegression_show ? 'block' : 'none')}}>
                                        <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}}>
                                            <Table>
                                                <TableRow>
                                                    <TableCell><strong>Intercept:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.intercept).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Skew:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.skew).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Kurtosis:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.kurtosis).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Jarque-Bera statistic:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.jarque_bera_stat).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Jarque-Bera p-value:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.jarque_bera_p).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Omnibus test statistic:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.omnibus_test_stat).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Omnibus test p-value:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.omnibus_test_p).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Durbin Watson:</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.durbin_watson).toFixed(5)}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><strong>Coefficient of determination (R^2):</strong></TableCell>
                                                    <TableCell>{Number.parseFloat(this.state.coef_deter).toFixed(5)}</TableCell>
                                                </TableRow>
                                            </Table>
                                        </TableContainer>
                                        <hr/>
                                        <div/>
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
                                    <div style={{display: (this.state.SGDRegression_show ? 'block' : 'none')}} dangerouslySetInnerHTML={{__html: this.state.df_scatter}} />
                                </div>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default SGDRegressionFunctionPage;
