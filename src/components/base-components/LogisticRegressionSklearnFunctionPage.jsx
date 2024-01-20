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
    Select, Tab, Table, TableCell, TableContainer, TableRow, Tabs, TextareaAutosize, TextField, Typography
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
import ProceedButton from "../ui-components/ProceedButton";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
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
class LogisticRegressionSklearnFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],
            file_names:[],

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_C: "1",
            selected_l1_ratio: "",
            selected_max_iter: "100",
            selected_solver: "lbfgs",
            selected_independent_variables: [],
            selected_penalty: "l2",

            log_full: "",
            log_null: "",
            pseudo_r_sq: "",
            intercept: "",
            dataframe: "",

            // Hide/show results
            LogisticRegressionSklearn_show : false,
            LogisticRegressionSklearn_step2_show: false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectCChange = this.handleSelectCChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectMaxIterChange = this.handleSelectMaxIterChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectSolverChange = this.handleSelectSolverChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleScatter = this.handleScatter.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleSelectXAxisnChange = this.handleSelectXAxisnChange.bind(this);
        this.handleSelectYAxisnChange = this.handleSelectYAxisnChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this)
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this)
        this.handleSelectVariableNameChange = this.handleSelectVariableNameChange.bind(this)
        // Initialise component
        // - values of channels from the backend
        this.fetchFileNames();
        this.fetchColumnNames();

    }

    // debug = () => {
    //     console.log("DEBUG")
    //     console.log(this.state)
    // };
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.setState({selected_independent_variables: []})
            this.setState({selected_independent_variable: ""})
            this.setState({selected_dependent_variable: ""})
            this.state.LogisticRegressionSK_show=false
            this.state.LogisticRegressionSK_step2_show=false
        })
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */

    async handleSubmit(event) {
        event.preventDefault();

        let to_send_l1_ratio = null;
        // let to_send_shrinkage_3 = null;
        //
        if (!!this.state.selected_l1_ratio){
            to_send_l1_ratio = parseFloat(this.state.selected_l1_ratio)
        }
        // if (!!this.state.selected_shrinkage_3){
        //     to_send_shrinkage_3 = parseFloat(this.state.selected_shrinkage_3)
        // }

        this.setState({LogisticRegressionSklearn_show: false})



        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("logistic_regression_sklearn", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent_variable: this.state.selected_dependent_variable,
                C: this.state.selected_C,
                l1_ratio: to_send_l1_ratio,
                penalty: this.state.selected_penalty,
                solver: this.state.selected_solver,
                max_iter: this.state.max_iter,
                independent_variables: this.state.selected_independent_variables},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')



            // console.log("")
            // console.log(temp_array)



            this.setState({dataframe: resultJson['dataframe']})
            this.setState({log_full: resultJson['Log-Likelihood (full)']})
            this.setState({log_null: resultJson['Log-Likelihood (Null - model with only intercept)']})
            this.setState({intercept: resultJson['intercept']})
            this.setState({pseudo_r_sq: resultJson['Pseudo R-squar. (McFadden’s R^2)']})


            this.setState({LogisticRegressionSklearn_show: true})

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

        this.setState({LogisticRegressionSklearn_step2_show: true})

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

    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({columns: res.data.columns})
        });
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


    handleSelectDependentVariableChange(event){
        this.setState({selected_dependent_variable: event.target.value})
    }
    handleSelectCChange(event){
        this.setState({selected_C: event.target.value})
    }
    handleSelectMaxIterChange(event){
        this.setState({selected_max_iter: event.target.value})
    }

    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    handleSelectSolverChange(event){
        this.setState( {selected_solver: event.target.value})
    }
    handleSelectL1ratioChange(event){
        this.setState( {selected_l1_ratio: event.target.value})
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
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            LogisticRegressionSklearn Parameterisation
                        </Typography>
                        <hr/>
                        <Grid container justifyContent = "center">
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextareaAutosize
                                        area-label="textarea"
                                        placeholder="Selected Independent Variables"
                                        style={{ width: 200 }}
                                        value={this.state.selected_independent_variables}
                                        inputProps={
                                            { readOnly: true, }
                                        }
                                />
                                <FormHelperText>Selected Independent Variables</FormHelperText>
                            </FormControl>
                        </Grid>
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

                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Dependent Variable (Categorical)</FormHelperText>
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
                            <Button onClick={this.selectAll}>
                                    Select All Variables
                                </Button>
                                <Button onClick={this.clear}>
                                    Clear Selections
                                </Button>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="C-label"
                                        id="C-selector"
                                        value= {this.state.selected_C}
                                        label="C"
                                        onChange={this.handleSelectCChange}
                                />
                                <FormHelperText>C</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelId="l1-label"
                                        id="l1-selector"
                                        value= {this.state.selected_l1_ratio}
                                        label="l1"
                                        onChange={this.handleSelectL1ratioChange}
                                />
                                <FormHelperText>l1-ratio</FormHelperText>
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
                                <InputLabel id="Penalty-selector-label">Penalty</InputLabel>
                                <Select
                                        labelId="Penalty-selector-label"
                                        id="Penalty-selector"
                                        value= {this.state.selected_penalty}
                                        label="Penalty"
                                        onChange={this.handleSelectPenaltyChange}
                                >
                                    <MenuItem value={"l2"}><em>l2</em></MenuItem>
                                    <MenuItem value={"l1"}><em>l1</em></MenuItem>
                                    <MenuItem value={"elasticnet"}><em>elasticnet</em></MenuItem>
                                    <MenuItem value={"None"}><em>None</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Penalty</FormHelperText>
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
                                    <MenuItem value={"lbfgs"}><em>lbfgs</em></MenuItem>
                                    <MenuItem value={"liblinear"}><em>liblinear</em></MenuItem>
                                    <MenuItem value={"newton-cg"}><em>newton-cg</em></MenuItem>
                                    <MenuItem value={"newton-cholesky"}><em>newton-cholesky</em></MenuItem>
                                    <MenuItem value={"sag"}><em>sag</em></MenuItem>
                                    <MenuItem value={"saga"}><em>saga</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Solver</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_dependent_variable && !this.state.selected_independent_variables}>
                                {/*|| !this.state.selected_method*/}
                                Submit
                            </Button>
                        </form>
                        <ProceedButton disabled={!this.state.LogisticRegressionSK_show}></ProceedButton>

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
                        {/*<div  style={{display: (this.state.LogisticRegressionSklearn_show ? 'block' : 'none')}}>*/}
                        {/*    <hr style={{display: (this.state.LogisticRegressionSklearn_show ? 'block' : 'none')}}/>*/}
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
                        {/*    <div style={{ display: (this.state.LogisticRegressionSklearn_step2_show ? 'block' : 'none') }}>*/}
                        {/*        <ScatterPlot chart_id="scatter_chart_id"  chart_data={this.state.scatter_chart_data}/>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </Grid>
                    <Grid  item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            LogisticRegressionSklearn Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        {/*<div style={{ display: (this.state.LogisticRegressionSklearn_show ? 'block' : 'none') }}>{this.state.coefficients}</div>*/}
                        {/*<div style={{ display: (this.state.LogisticRegressionSklearn_show ? 'block' : 'none') }}>{this.state.intercept}</div>*/}
                        {/*<div style={{ display: (this.state.LogisticRegressionSklearn_show ? 'block' : 'none') }}>{this.state.dataframe}</div>*/}
                        <hr style={{ display: (this.state.LogisticRegressionSklearn_show ? 'block' : 'none') }}/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <div dangerouslySetInnerHTML={{__html: this.state.dataframe}} />
                                <hr style={{ display: (this.state.LogisticRegressionSK_show ? 'block' : 'none') }}/>
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
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default LogisticRegressionSklearnFunctionPage;
