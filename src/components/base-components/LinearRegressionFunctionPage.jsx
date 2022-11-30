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

            // Hide/show results
            LinearRegression_show : false


        };

        //Binding functions of the class
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectRegularizationChange = this.handleSelectRegularizationChange.bind(this);
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

        this.setState({LinearRegression_show: false})





        // Send the request
        API.get("linear_regressor_statsmodels", {
            params: {dependent_variable: this.state.selected_dependent_variable,
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
            this.setState({third_table: resultJson['third table']})
            this.setState({white_test: resultJson['dataframe white test']})
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
                            LinearRegression Parameterisation
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
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            LinearRegression Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}
                        <div style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.first_table}} />
                        <hr style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }}/>
                        <div style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.second_table}} />
                        <hr style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }}/>
                        <div style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.third_table}} />
                        <hr style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }}/>
                        <div style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.white_test}} />
                        <hr style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }}/>
                        <div style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.influence_points}} />
                        <hr style={{ display: (this.state.LinearRegression_show ? 'block' : 'none') }}/>

                    </Grid>
                </Grid>
        )
    }
}

export default LinearRegressionFunctionPage;
