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
    Select,
    Typography
} from "@mui/material";

class DataTransformationForANOVA extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",

        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange1 = this.handleSelectColumnChange1.bind(this);
        this.handleSelectColumnChange2 = this.handleSelectColumnChange2.bind(this);
        // // Initialise component
        // // - values of channels from the backend
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
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();

        // Send the request
        API.get("transformed_data_for_use_in_an_ANOVA",
                {
                    params: {column_1: this.state.selected_column, column_2: this.state.selected_column2}
                }
        ).then(res => {
            this.setState({test_data: res.data})
            const resultJson = res.data;
            let temp_array1=[]
            let temp_array2=[]
            // let temp_array_chart = []
            for ( let it =0 ; it < resultJson['transformed_1'].length; it++){
                temp_array1.push(resultJson['transformed_1'][it])}
            for ( let it =0 ; it < resultJson['transformed_2'].length; it++){
                temp_array2.push(resultJson['transformed_2'][it])
                // let temp_object = {}
                // temp_object["category"] = it
                // temp_object["yValue"] = resultJson['Box-Cox power transformed array'][it]
                // temp_array_chart.push(temp_object)
            }
            this.setState({transformed_data_1: temp_array1})
            this.setState({transformed_data_2: temp_array2})
        });
    }


    /**
     * Update state when selection changes in the form
     */
    handleSelectColumnChange1(event){
        this.setState( {selected_column: event.target.value})
    }
    handleSelectColumnChange2(event){
        this.setState( {selected_column2: event.target.value})
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
                    <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Select columns
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="column-selector-label">Column 1</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_column}
                                        label="Column"
                                        onChange={this.handleSelectColumnChange1}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select First column for correlation</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="column2-selector-label">Column 2</InputLabel>
                                <Select
                                        labelId="column2-selector-label"
                                        id="column2-selector"
                                        value= {this.state.selected_column2}
                                        label="Second column"
                                        onChange={this.handleSelectColumnChange2}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Second column for correlation</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <div>
                            <p className="result_texts">Transformed data 1 : { this.state.transformed_data_1}</p>
                            <p className="result_texts">Transformed data 2 : { this.state.transformed_data_2}</p>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default DataTransformationForANOVA;
