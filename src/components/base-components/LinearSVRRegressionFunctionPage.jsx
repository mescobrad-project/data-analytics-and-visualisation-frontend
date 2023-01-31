import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem, Paper,
    Select, Table, TableCell, TableContainer, TableRow, TextareaAutosize, TextField, Typography
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

class LinearSVRRegressionFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_alpha: "0.0001",
            selected_max_iter: "1000",
            selected_epsilon: "0",
            selected_C: "1",
            selected_loss: "epsilon_insensitive",
            selected_independent_variables: [],

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
            LinearSVRRegression_show : false,
            LinearSVRRegression_step2_show: false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectMaxIterChange = this.handleSelectMaxIterChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectEpsilonChange = this.handleSelectEpsilonChange.bind(this);
        this.handleSelectLossChange = this.handleSelectLossChange.bind(this);
        this.handleSelectCChange = this.handleSelectCChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleScatter = this.handleScatter.bind(this);

        this.handleSelectXAxisnChange = this.handleSelectXAxisnChange.bind(this);
        this.handleSelectYAxisnChange = this.handleSelectYAxisnChange.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        // Initialise component
        // - values of channels from the backend
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

        this.setState({LinearSVRRegression_show: false})



        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("linearsvr_regression", {
            params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent_variable: this.state.selected_dependent_variable,
                alpha: this.state.selected_alpha,
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

            this.setState({LinearSVRRegression_show: true})




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

        this.setState({LinearSVRRegression_step2_show: true})

    }



    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({columns: res.data.columns})
        });
    }


    handleSelectDependentVariableChange(event){
        this.setState({selected_dependent_variable: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState({selected_alpha: event.target.value})
    }
    handleSelectMaxIterChange(event){
        this.setState({selected_max_iter: event.target.value})
    }

    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    handleSelectEpsilonChange(event){
        this.setState( {selected_solver: event.target.value})
    }
    handleSelectLossChange(event){
        this.setState({selected_loss: event.target.value})
    }
    handleSelectCChange(event){
        this.setState({selected_C: event.target.value})
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
                            LinearSVRRegression Parameterisation
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
                                        value= {this.state.selected_independent_variables}
                                        multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >

                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Independent Variables</FormHelperText>
                                <Button onClick={this.selectAll}>
                                    Select All Variables
                                </Button>
                                <Button onClick={this.clear}>
                                    Clear Selections
                                </Button>
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
                                        labelId="C-label"
                                        id="C-selector"
                                        value= {this.state.selected_C}
                                        label="C"
                                        onChange={this.handleSelectCChange}
                                />
                                <FormHelperText>C</FormHelperText>
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
                                    <MenuItem value={"epsilon_insensitive"}><em>epsilon insensitive</em></MenuItem>
                                    <MenuItem value={"squared_epsilon_insensitive"}><em>squared epsilon insensitive</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which loss to use.</FormHelperText>
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


                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            window.location.replace("/")
                            // Send the request
                        }}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit">
                                Proceed >
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <div  style={{display: (this.state.LinearSVRRegression_show ? 'block' : 'none')}}>
                            <hr style={{display: (this.state.LinearSVRRegression_show ? 'block' : 'none')}}/>
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
                            <div style={{ display: (this.state.LinearSVRRegression_step2_show ? 'block' : 'none') }}>
                                <ScatterPlot chart_id="scatter_chart_id"  chart_data={this.state.scatter_chart_data}/>
                            </div>
                        </div>
                    </Grid>
                    <Grid  item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            LinearSVRRegression Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        {/*<div style={{ display: (this.state.LinearSVRRegression_show ? 'block' : 'none') }}>{this.state.coefficients}</div>*/}
                        {/*<div style={{ display: (this.state.LinearSVRRegression_show ? 'block' : 'none') }}>{this.state.intercept}</div>*/}
                        {/*<div style={{ display: (this.state.LinearSVRRegression_show ? 'block' : 'none') }}>{this.state.dataframe}</div>*/}
                        <hr style={{ display: (this.state.LinearSVRRegression_show ? 'block' : 'none') }}/>
                        <div dangerouslySetInnerHTML={{__html: this.state.dataframe}} />
                        <div style={{display: (this.state.LinearSVRRegression_show ? 'block' : 'none')}}>
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
                            <div dangerouslySetInnerHTML={{__html: this.state.df_scatter}} />
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default LinearSVRRegressionFunctionPage;
