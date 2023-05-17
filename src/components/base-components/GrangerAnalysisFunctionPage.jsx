import React, {Fragment} from 'react';
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

class GrangerAnalysisFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_independent_variable: "",
            // selected_max_lags: "",
            max_lags: [],


            num_lags: [],
            lags: [],

            // Hide/show results
            GrangerAnalysis_show : false,
            GrangerAnalysis_step2_show: false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        // this.handleSelectNumLagsChange = this.handleSelectNumLagsChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        // Initialise component
        // - values of channels from the backend
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
                predictor_variable: this.state.selected_dependent_variable,
                response_variable: this.state.selected_independent_variable,
                num_lags: this.state.max_lags.map((value) => parseInt(value)) },
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

        this.setState({GrangerAnalysis_step2_show: true})

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

    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variable: event.target.value})
    }

    // handleSelectNumLagsChange(event){
    //     this.setState( {selected_max_lags: event.target.value})
    // }


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
                                <InputLabel id="dependent-variable-selector-label">Predictor Variable</InputLabel>
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
                                <FormHelperText>Select Predictor Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="independent-variable-selector-label">Response Variable</InputLabel>
                                <Select
                                        labelId="independent-variable-selector-label"
                                        id="independent-variable-selector"
                                        value= {this.state.selected_independent_variable}
                                        label="Independent Variable"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >

                                    {this.state.columns.map((column) => (
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
                    </Grid>
                    <Grid  item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Granger Analysis Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        {/*<div style={{ display: (this.state.GrangerAnalysis_show ? 'block' : 'none') }}>{this.state.coefficients}</div>*/}
                        {/*<div style={{ display: (this.state.GrangerAnalysis_show ? 'block' : 'none') }}>{this.state.intercept}</div>*/}
                        {/*<div style={{ display: (this.state.GrangerAnalysis_show ? 'block' : 'none') }}>{this.state.dataframe}</div>*/}
                        <hr style={{ display: (this.state.GrangerAnalysis_show ? 'block' : 'none') }}/>
                        <div dangerouslySetInnerHTML={{__html: this.state.dataframe}} />
                        <div style={{display: (this.state.GrangerAnalysis_show ? 'block' : 'none')}}>
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

export default GrangerAnalysisFunctionPage;
