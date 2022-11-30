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
    Select, TextareaAutosize, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import qs from "qs";

class SGDRegressionFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_alpha: "0.0001",
            selected_max_iter: "1000",
            selected_epsilon: "0.1",
            selected_eta0: "0.01",
            selected_l1_ratio: "0.15",
            selected_loss: "squared_error",
            selected_learning_rate: "invscaling",
            selected_penalty: "l2",
            selected_solver: "auto",
            selected_independent_variables: [],

            coefficients: "",
            intercept: "",
            dataframe: "",

            // Hide/show results
            SGDRegression_show : false


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
        this.handleSubmit = this.handleSubmit.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchColumns();

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





        // Send the request
        API.get("sgd_regression", {
            params: {dependent_variable: this.state.selected_dependent_variable,
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
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')



            // console.log("")
            // console.log(temp_array)


            this.setState({coefficients: resultJson['coefficients']})
            this.setState({intercept: resultJson['intercept']})
            this.setState({dataframe: resultJson['dataframe']})
            this.setState({SGDRegression_show: true})



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
    }

    /**
     * Update state when selection changes in the form
     */

    async fetchColumns(url, config) {
        console.log("Hello")
        API.get("return_columns", {}).then(res =>{
            this.setState({columns: res.data.columns})
        })

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



    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Available Variables
                        </Typography>

                        <hr/>
                        <List>
                            {this.state.columns.map((column) => (
                                    <ListItem> <ListItemText primary={column}/></ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            SGDRegression Parameterisation
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
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="alpha-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="alpha"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>Alpha</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="max-iter-label"
                                        id="max-iter-selector"
                                        value= {this.state.selected_max_iter}
                                        label="max-iter"
                                        onChange={this.handleSelectMaxIterChange}
                                />
                                <FormHelperText>Max Iterations</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="epsilon-label"
                                        id="epsilon-selector"
                                        value= {this.state.selected_epsilon}
                                        label="epsilon"
                                        onChange={this.handleSelectEpsilonChange}
                                />
                                <FormHelperText>Epsilon</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="eta0-label"
                                        id="eta0-selector"
                                        value= {this.state.selected_eta0}
                                        label="eta0"
                                        onChange={this.handleSelectEta0Change}
                                />
                                <FormHelperText>eta0</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="l1-ratio-label"
                                        id="l1-ratio-selector"
                                        value= {this.state.selected_l1_ratio}
                                        label="l1-ratio"
                                        onChange={this.handleSelectL1RatioChange}
                                />
                                <FormHelperText>l1-ratio</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
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
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="loss-label">Learning Rate</InputLabel>
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
                            <FormControl sx={{m: 1, minWidth: 120}}>
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

                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            SGDRegression Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        <div style={{ display: (this.state.SGDRegression_show ? 'block' : 'none') }}>{this.state.coefficients}</div>
                        <div style={{ display: (this.state.SGDRegression_show ? 'block' : 'none') }}>{this.state.intercept}</div>
                        <div style={{ display: (this.state.SGDRegression_show ? 'block' : 'none') }}>{this.state.dataframe}</div>
                        <hr style={{ display: (this.state.SGDRegression_show ? 'block' : 'none') }}/>
                    </Grid>
                </Grid>
        )
    }
}

export default SGDRegressionFunctionPage;
