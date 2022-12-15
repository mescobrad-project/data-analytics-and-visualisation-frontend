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
    MenuItem,
    Select, TextareaAutosize, TextField, Typography,
    Table, TableHead, TableRow, TableBody, TableCell, TableContainer, Paper
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import qs from "qs";
import ChannelSignalSpindleSlowwaveChartCustom from "../ui-components/ChannelSignalSpindleSlowwaveChartCustom";
import ScatterPlot from "../ui-components/ScatterPlot";

class LinearRegressionFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_independent_variables: [],
            selected_regularization: "False",

            influence_points: [],
            first_table: [],
            second_table: [],
            third_table: [],
            white_test: [],
            dep_variable: "",
            model: "",
            method: "",
            date: "",
            time: "",
            no_observations: "",
            df_resid: "",
            df_mod: "",
            cov_type: "",
            r_sq: "",
            adj_r_sq: "",
            f_stat: ",",
            prob_f: "",
            log_like: "",
            aic: "",
            bic: "",
            omnibus: "",
            prob_omni: "",
            skew: "",
            kurtosis: "",
            durbin: "",
            jb: "",
            prob_jb: "",
            cond: "",
            test_stat: "",
            test_stat_p: "",
            white_f_stat: "",
            white_prob_f: "",
            infl_cols: [],
            influence_dict: [],
            selected_x_axis: "",
            selected_y_axis: "",
            scatter_chart_data: [],
            bresuch_lagrange: "",
            bresuch_p_value: "",
            bresuch_f_value: "",
            bresuch_f_p_value: "",

            // Hide/show results
            LinearRegression_show : false,
            linear_regression_step2_show: false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectRegularizationChange = this.handleSelectRegularizationChange.bind(this);
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

        this.setState({LinearRegression_show: false})



        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("linear_regressor_statsmodels", {
            params: {run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dependent_variable: this.state.selected_dependent_variable,
                independent_variables: this.state.selected_independent_variables,
                regularization: this.state.selected_regularization},
            paramsSerializer : params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')



            // console.log("")
            // console.log(temp_array)

            this.setState({influence_points: resultJson['DataFrame with all available influence results']})
            this.setState({first_table: resultJson['first_table']})
            this.setState({second_table: resultJson['second table']})
            this.setState({third_table: resultJson['third table']['Values']})
            this.setState({white_test: resultJson['dataframe white test']})
            this.setState({dep_variable: resultJson['dep']})
            this.setState({model: resultJson['model']})
            this.setState({method: resultJson['method']})
            this.setState({date: resultJson['date']})
            this.setState({time: resultJson['time']})
            this.setState({no_observations: resultJson['no_obs']})
            this.setState({df_resid: resultJson['resid']})
            this.setState({df_mod: resultJson['df_model']})
            this.setState({cov_type: resultJson['cov_type']})
            this.setState({r_sq: resultJson['r_squared']})
            this.setState({adj_r_sq: resultJson['adj_r_squared']})
            this.setState({f_stat: resultJson['f_stat']})
            this.setState({prob_f: resultJson['prob_f']})
            this.setState({log_like: resultJson['log_like']})
            this.setState({aic: resultJson['aic']})
            this.setState({bic: resultJson['bic']})
            this.setState({omnibus: resultJson['omnibus']})
            this.setState({prob_omni: resultJson['prob_omni']})
            this.setState({skew: resultJson['skew']})
            this.setState({kurtosis: resultJson['kurtosis']})
            this.setState({durbin: resultJson['durbin']})
            this.setState({jb: resultJson['jb']})
            this.setState({prob_jb: resultJson['prob_jb']})
            this.setState({cond: resultJson['cond']})
            this.setState({test_stat: resultJson['test_stat']})
            this.setState({test_stat_p: resultJson['test_stat_p']})
            this.setState({white_f_stat: resultJson['white_f_stat']})
            this.setState({white_prob_f: resultJson['white_prob_f']})
            this.setState({infl_cols: resultJson['influence_columns']})
            this.setState({influence_dict: resultJson['influence_dict']})
            this.setState({bresuch_lagrange: resultJson['bresuch_lagrange']})
            this.setState({bresuch_p_value: resultJson['bresuch_p_value']})
            this.setState({bresuch_f_value: resultJson['bresuch_f_value']})
            this.setState({bresuch_f_p_value: resultJson['bresuch_f_p_value']})

            this.setState({LinearRegression_show: true})


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
        for (let i = 0; i < this.state.influence_dict[this.state.selected_x_axis].length; i++) {
            let temp_object = {}

            temp_object["xValue"] = this.state.influence_dict[this.state.selected_x_axis][i]
            temp_object["yValue"] = this.state.influence_dict[this.state.selected_y_axis][i]

            temp_array.push(temp_object)
        }
        console.log(temp_array)
        this.setState({scatter_chart_data: temp_array})

        this.setState({linear_regression_step2_show: true})

    }
    /**
     * Update state when selection changes in the form
     */

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({columns: res.data.columns})
        });
    }


    handleSelectDependentVariableChange(event){
        this.setState({selected_dependent_variable: event.target.value})
    }
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
    }
    handleSelectRegularizationChange(event){
        this.setState({selected_regularization: event.target.value})
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
                    {/*<Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>*/}
                    {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                    {/*        Available Variables*/}
                    {/*    </Typography>*/}

                    {/*    <hr/>*/}
                    {/*    <List>*/}
                    {/*        {this.state.columns.map((column) => (*/}
                    {/*                <ListItem> <ListItemText primary={column}/></ListItem>*/}
                    {/*        ))}*/}
                    {/*    </List>*/}
                    {/*</Grid>*/}
                    <Grid item xs={6} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Regression Parameterisation
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
                            <FormControl sx={{m: 1, minWidth: 120, maxWidth: 250}}>
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
                            <FormControl sx={{m: 1, minWidth: 120, maxWidth: 250}}>
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
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="regularization-label">Regularization</InputLabel>
                                <Select
                                        labelId="regularization-label"
                                        id="regularization-selector"
                                        value= {this.state.selected_regularization}
                                        label="regularization"
                                        onChange={this.handleSelectRegularizationChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                </Select>
                                <FormHelperText>Select if you want to add regularization</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>

                        <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
                            <hr style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}/>
                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                Available Variables
                            </Typography>
                            <form onSubmit={this.handleScatter}>
                                <FormControl sx={{m: 1, minWidth: 120, maxWidth: 250}}>
                                    <InputLabel id="x-axis-selector-label">Select X-axis</InputLabel>
                                    <Select
                                            labelId="x-axis-selector-label"
                                            id="x-axis-selector"
                                            value= {this.state.selected_x_axis}
                                            label="x-axis"
                                            onChange={this.handleSelectXAxisnChange}
                                    >

                                        {this.state.infl_cols.map((column) => (
                                                <MenuItem value={column}>
                                                    {column}
                                                </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select Variable for X axis of scatterplot</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120, maxWidth: 250}}>
                                    <InputLabel id="y-axis-selector-label">Select Y-axis</InputLabel>
                                    <Select
                                            labelId="y-axis-selector-label"
                                            id="y-axis-selector"
                                            value= {this.state.selected_y_axis}
                                            label="y-axis"
                                            onChange={this.handleSelectYAxisnChange}
                                    >

                                        {this.state.infl_cols.map((column) => (
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
                            <div style={{ display: (this.state.linear_regression_step2_show ? 'block' : 'none') }}><ScatterPlot chart_id="scatter_chart_id"  chart_data={this.state.scatter_chart_data}/></div>
                        </div>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Linear Regression Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}
                        {/*<div style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.first_table}} />*/}
                        {/*<hr style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }}/>*/}

                        <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
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
                                        <TableCell><strong>Covariance Type:</strong></TableCell>
                                        <TableCell>{this.state.cov_type}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>R-squared:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.r_sq).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Adjusted R-squared:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.adj_r_sq).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>F-statistic:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.f_stat).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Prob (F-statistic):</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.prob_f).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Log-Likelihood:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.log_like).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>AIC:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.aic).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>BIC:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.bic).toFixed(5)}</TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </div>
                        <hr style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}/>
                        <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
                            <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                <Table>
                                    <TableRow>
                                        <TableCell><strong>Omnnibus:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.omnibus).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Prob(Omnibus):</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.prob_omni).toFixed(5)}</TableCell>
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
                                        <TableCell><strong>Durbin-Watson:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.durbin).toFixed(5)}</TableCell>
                                    </TableRow>
                                <TableRow>
                                        <TableCell><strong>Jarque-Bera (JB):</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.jb).toFixed(5)}</TableCell>
                                    </TableRow>
                                <TableRow>
                                        <TableCell><strong>Prob(JB):</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.prob_jb).toFixed(5)}</TableCell>
                                    </TableRow>
                                <TableRow>
                                        <TableCell><strong>Cond. No.:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.cond).toFixed(5)}</TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </div>
                        <hr style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}/>
                        <div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                White test (test for heteroscedasticity)
                            </Typography>
                            <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                <Table>
                                    <TableRow>
                                        <TableCell><strong>Test Statistic:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.test_stat).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Test Statistic p-value:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.test_stat_p).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>F-Statistic:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.white_f_stat).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>F-Test p-value:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.white_prob_f).toFixed(5)}</TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        <hr/>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Breusch-Pagan test (test for heteroscedasticity)
                        </Typography>
                            <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                <Table>
                                    <TableRow>
                                        <TableCell><strong>Lagrange Multiplier Statistic:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.bresuch_lagrange).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Lagrange Multiplier Statistic p-value:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.bresuch_p_value).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>F-Statistic:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.bresuch_f_value).toFixed(5)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>F-Test p-value:</strong></TableCell>
                                        <TableCell>{Number.parseFloat(this.state.bresuch_f_p_value).toFixed(5)}</TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        <div dangerouslySetInnerHTML={{__html: this.state.bresuch_test}} />
                        <hr/>
                        <div dangerouslySetInnerHTML={{__html: this.state.second_table}} />
                        <hr/>
                        <div dangerouslySetInnerHTML={{__html: this.state.influence_points}} />
                        <hr/>
                        </div>
                        {/*<div style={{display: (this.state.LinearRegression_show ? 'block' : 'none')}}>*/}
                        {/*    <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>*/}
                        {/*        <Table>*/}
                        {/*            /!*{this.state.columns.map((column) => (*!/*/}
                        {/*            /!*        <MenuItem value={column}>*!/*/}
                        {/*            /!*            {column}*!/*/}
                        {/*            /!*        </MenuItem>*!/*/}
                        {/*            /!*))}*!/*/}
                        {/*            {console.log(typeof (this.state.third_table))}*/}
                        {/*            {this.state.third_table.map((object) => (*/}
                        {/*                <TableRow>*/}
                        {/*                    <TableCell><strong>{object}</strong></TableCell>*/}
                        {/*                    /!*<TableCell>{Number.parseFloat({i}).toFixed(5)}</TableCell>*!/*/}
                        {/*                </TableRow>*/}
                        {/*            ))}*/}
                        {/*        </Table>*/}
                        {/*    </TableContainer>*/}
                        {/*</div>*/}

                    </Grid>
                </Grid>
        )
    }
}

export default LinearRegressionFunctionPage;
