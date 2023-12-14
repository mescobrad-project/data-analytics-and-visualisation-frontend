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

class PCAFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns sent by the backend
            columns: [],

            //Values selected currently on the form
            selected_n_components_1: "",
            selected_n_components_2: "",
            selected_independent_variables: [],



            explained_variance_ratio: "",
            singular_values: "",
            components: "",

            // Hide/show results
            PCA_show : false


        };

        //Binding functions of the class
        this.handleSelectNComponents1Change = this.handleSelectNComponents1Change.bind(this);
        this.handleSelectNComponents2Change = this.handleSelectNComponents2Change.bind(this);
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

        this.setState({PCA_show: false})





        // Send the request
        API.get("principal_component_analysis", {
            params: {n_components_1: this.state.selected_n_components_1,
                n_components_2: this.state.selected_n_components_2,
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


            this.setState({explained_variance_ratio: resultJson['Percentage of variance explained by each of the selected components']})
            this.setState({singular_values: resultJson['The singular values corresponding to each of the selected components. ']})
            this.setState({components: resultJson['Principal axes in feature space, representing the directions of maximum variance in the data.']})
            this.setState({PCA_show: true})



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
        console.log(this.state.selected_solver)
        console.log("First")
        console.log(this.state)
    }

    handleSelectNComponents1Change(event){
        this.setState({selected_n_components_1: event.target.value})
    }
    handleSelectNComponents2Change(event){
        this.setState({selected_n_components_2: event.target.value})
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
                            PCA Parameterisation
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
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="n-components-1-label"
                                        id="n-components-1-selector"
                                        value= {this.state.selected_n_components_1}
                                        label="n-components-1"
                                        onChange={this.handleSelectNComponents1Change}
                                />
                                <FormHelperText>n-components-1</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="n-components-2-label"
                                        id="n-components-2-selector"
                                        value= {this.state.selected_n_components_2}
                                        label="n-components-2"
                                        onChange={this.handleSelectNComponents2Change}
                                />
                                <FormHelperText>n-components-2</FormHelperText>
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
                            PCA Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        <div style={{ display: (this.state.PCA_show ? 'block' : 'none') }}>{this.state.explained_variance_ratio}</div>
                        <div style={{ display: (this.state.PCA_show ? 'block' : 'none') }}>{this.state.singular_values}</div>
                        <div style={{ display: (this.state.PCA_show ? 'block' : 'none') }}>{this.state.components}</div>
                        <hr style={{ display: (this.state.PCA_show ? 'block' : 'none') }}/>
                    </Grid>
                </Grid>
        )
    }
}

export default PCAFunctionPage;
