import React from 'react';
import API from "../../axiosInstance";
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
    Select, TextField,
    Typography
} from "@mui/material";
import PointChartCustom from "../../components/ui-components/PointChartCustom"
import ClusteredBoxPlot from "../../components/ui-components/ClusteredBoxPlot";
// import PointChartCustom from "../../components/ui-components/PointChartCustom";

class Transform_data extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_method: "Box-Cox",
            selected_lmbda: "",
            selected_alpha: "",
            // Values to pass to visualisations
            transformation_chart_data : [],

            // Visualisation Hide/Show values
            transformation_chart_show : false
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectLmbdaChange = this.handleSelectLmbdaChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.renderArrayValues = this.renderArrayValues.bind(this)
        this.fetchColumnNames();
    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames() {
        API.get("return_columns", {}).then(res => {
            this.setState({column_names: res.data.columns})
        });
    }

    /**
     * Get result values
     */
    renderArrayValues = (List_to_render) => {
        let temp_list = []
        if (!List_to_render) {List_to_render=temp_list}
        return(
                List_to_render.map( (item, index) => {
                    return(
                            <p key={index} className="mr-1 text-default">{index+1}: {item}</p>
                    )
                })
        )
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        let to_send_input_lmbda = null;
        let to_send_input_alpha = null;

        if (!!this.state.selected_lmbda){
            to_send_input_lmbda = parseInt(this.state.selected_lmbda)
        }
        if (!!this.state.selected_alpha){
            to_send_input_alpha = parseInt(this.state.selected_alpha)
        }

        //Reset view of optional visualisations preview
        this.setState({transformation_chart_show: false})

        // Send the request
        API.get("transform_data",
                {
                    params: {column: this.state.selected_column, name_test: this.state.selected_method,
                        lmbd: to_send_input_lmbda, alpha: to_send_input_alpha}
                }
        ).then(res => {
            this.setState({test_data: res.data})
            const resultJson = res.data;
            // console.log(resultJson)
            // console.log('Test')
            // let temp_array = []
            let temp_array_chart = []
            for ( let it =0 ; it < resultJson['Box-Cox power transformed array'].length; it++){
                // for testing
                // -----------
                // temp_array.push(resultJson['Box-Cox power transformed array'][it])
                let temp_object = {}
                temp_object["category"] = it
                temp_object["yValue"] = resultJson['Box-Cox power transformed array'][it]
                temp_array_chart.push(temp_object)
            }
            // for testing
            // -----------
            // this.setState({transformation_data: temp_array})
            this.setState({lamda_value: resultJson['lambda that maximizes the log-likelihood function']})
            this.setState({min_confidence: resultJson['minimum confidence limit']})
            this.setState({max_confidence: resultJson['maximum confidence limit']})

            this.setState({transformation_chart_data: temp_array_chart})
            this.setState({transformation_chart_show: true})
        });
    }


    /**
     * Update state when selection changes in the form
     */
    handleSelectColumnChange(event){
        this.setState( {selected_column: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
    }
    handleSelectLmbdaChange(event){
        this.setState( {selected_lmbda: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Data Preview
                        </Typography>
                        <hr/>
                        <List>
                            {this.state.column_names.map((column) => (
                                    <ListItem> <ListItemText primary={column}/></ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", minWidth: 120}} noWrap>
                            Select Dataset for Transformation
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="column-selector-label">Column</InputLabel>
                                <Select
                                        labelid="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_column}
                                        label="Column"
                                        onChange={this.handleSelectColumnChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Column for Transformation</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="method-selector-label">Method</InputLabel>
                                <Select
                                        labelid="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"Box-Cox"}><em>Box-Cox</em></MenuItem>
                                    <MenuItem value={"Yeo-Johnson"}><em>Yeo-Johnson</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelid="lmbda-selector-label"
                                        id="lmbda-selector"
                                        value= {this.state.selected_lmbda}
                                        label="Lmbda parameter"
                                        onChange={this.handleSelectLmbdaChange}
                                />
                                <FormHelperText>If lmbda is None (default), find the value of lmbda that maximizes the log-likelihood function and return it as the second output argument.
                                    If lmbda is not None, do the transformation for that value.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="Alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>If lmbda is None and alpha is not None (default), return the 100 * (1-alpha)% confidence interval for lmbda as the third output argument. Must be between 0.0 and 1.0.
                                    If lmbda is not None, alpha is ignored.</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <div>
                            <p className="result_texts"> Lamda parameter: {this.state.lamda_value}</p>
                            <p className="result_texts"> Minimum confidence limit: {this.state.min_confidence}</p>
                            <p className="result_texts"> Maximum confidence limit: {this.state.max_confidence}</p>
                            {/*/!*For testing*!/*/}
                            {/*------------*/}
                            {/*<p className="result_texts"> Box-Cox power transformed array:*/}
                            {/*    {this.state.transformation_data}*/}
                            {/*</p>*/}
                            {/*<p>Values:</p>*/}
                            {/*<p>{this.renderArrayValues(this.state.transformation_data)}</p>*/}

                        </div>
                        <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.transformation_chart_show ? 'block' : 'none')  }} noWrap>
                            Transformation test Results
                        </Typography>
                        <div style={{display:"flex"}}>
                            <div style={{flex:2, width: "fit-content"}}>
                                <div style={{display: (this.state.transformation_chart_show ? 'block' : 'none') }}>
                                    <PointChartCustom chart_id="transformation_chart_id" chart_data={ this.state.transformation_chart_data}/>
                                </div>
                                <hr style={{display: (this.state.transformation_chart_show ? 'block' : 'none') }}/>
                            </div>
                            {/*<div style={{flex:2, width: "fit-content"}}>*/}
                            {/*    <ClusteredBoxPlot chart_id="boxplot_chart_id" />*/}
                            {/*</div>*/}
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Transform_data;
