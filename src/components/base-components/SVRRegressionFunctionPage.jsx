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
import ProceedButton from "../ui-components/ProceedButton";

class SVRRegressionFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],

            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_degree: "3",
            selected_max_iter: "-1",
            selected_epsilon: "0.1",
            selected_C: "1",
            selected_coef0: "0",
            selected_gamma: "scale",
            selected_kernel: "rbf",
            selected_independent_variables: [],

            coefficients: "",
            intercept: "",
            dataframe: "",

            // Hide/show results
            SVRRegression_show : false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectDegreeChange = this.handleSelectDegreeChange.bind(this);
        this.handleSelectMaxIterChange = this.handleSelectMaxIterChange.bind(this);
        this.handleSelectEpsilonChange = this.handleSelectEpsilonChange.bind(this);
        this.handleSelectCChange = this.handleSelectCChange.bind(this);
        this.handleSelectCoef0Change = this.handleSelectCoef0Change.bind(this);
        this.handleSelectGammaChange = this.handleSelectGammaChange.bind(this);
        this.handleSelectKernelChange = this.handleSelectKernelChange.bind(this);
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

        this.setState({SVRRegression_show: false})





        // Send the request
        API.get("svr_regression", {
            params: {dependent_variable: this.state.selected_dependent_variable,
                alpha: this.state.selected_alpha,
                max_iter: this.state.max_iter,
                epsilon: this.state.epsilon,
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
            this.setState({SVRRegression_show: true})


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
    handleSelectDegreeChange(event){
        this.setState({selected_degree: event.target.value})
    }
    handleSelectMaxIterChange(event){
        this.setState({selected_max_iter: event.target.value})
    }
    handleSelectEpsilonChange(event){
        this.setState({selected_epsilon: event.target.value})
    }
    handleSelectCChange(event){
        this.setState({selected_C: event.target.value})
    }
    handleSelectCoef0Change(event){
        this.setState({selected_coef0: event.target.value})
    }
    handleSelectGammaChange(event){
        this.setState({selected_gamma: event.target.value})
    }
    handleSelectKernelChange(event){
        this.setState({selected_kernel: event.target.value})
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
                            SVRRegression Parameterisation
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
                                        labelId="degree-label"
                                        id="degree-selector"
                                        value= {this.state.selected_degree}
                                        label="degree"
                                        onChange={this.handleSelectDegreeChange}
                                />
                                <FormHelperText>Degree</FormHelperText>
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
                                        labelId="C-label"
                                        id="C-selector"
                                        value= {this.state.selected_C}
                                        label="C"
                                        onChange={this.handleSelectCChange}
                                />
                                <FormHelperText>C</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="coef0-label"
                                        id="coef0-selector"
                                        value= {this.state.selected_coef0}
                                        label="coef0"
                                        onChange={this.handleSelectCoef0Change}
                                />
                                <FormHelperText>coef0</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="gamma-label">Gamma</InputLabel>
                                <Select
                                        labelId="gamma-label"
                                        id="gamma-selector"
                                        value= {this.state.selected_gamma}
                                        label="gamma"
                                        onChange={this.handleSelectGammaChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"scale"}><em>scale</em></MenuItem>
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which gamma to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="kernel-label">Kernel</InputLabel>
                                <Select
                                        labelId="kernel-label"
                                        id="kernel-selector"
                                        value= {this.state.selected_kernel}
                                        label="kernel"
                                        onChange={this.handleSelectKernelChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"rbf"}><em>rbf</em></MenuItem>
                                    <MenuItem value={"linear"}><em>linear</em></MenuItem>
                                    <MenuItem value={"poly"}><em>poly</em></MenuItem>
                                    <MenuItem value={"sigmoid"}><em>sigmoid</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which kernel to use.</FormHelperText>
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
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            SVRRegression Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        <div style={{ display: (this.state.SVRRegression_show ? 'block' : 'none') }}>{this.state.coefficients}</div>
                        <div style={{ display: (this.state.SVRRegression_show ? 'block' : 'none') }}>{this.state.outliers}</div>
                        <div style={{ display: (this.state.SVRRegression_show ? 'block' : 'none') }}>{this.state.intercept}</div>
                        <div style={{ display: (this.state.SVRRegression_show ? 'block' : 'none') }}>{this.state.dataframe}</div>
                        <hr style={{ display: (this.state.SVRRegression_show ? 'block' : 'none') }}/>
                    </Grid>
                </Grid>
        )
    }
}

export default SVRRegressionFunctionPage;
