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

class Alexander_Govern_test extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",
            selected_nan_policy:"propagate",
            selected_statistical_test:"Alexander Govern test"
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectColumn2Change = this.handleSelectColumn2Change.bind(this);
        this.handleSelectNanPolicyChange = this.handleSelectNanPolicyChange.bind(this);

        // // Initialise component
        // // - values of channels from the backend
        this.fetchColumnNames();

    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames(url, config) {
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
        API.get("statistical_tests",
                {
                    params: {column_1: this.state.selected_column, column_2:this.state.selected_column2,
                        nan_policy: this.state.selected_nan_policy,
                        statistical_test: this.state.selected_statistical_test}
                }
        ).then(res => {
            this.setState({test_data: res.data})
        });
    }


    /**
     * Update state when selection changes in the form
     */
    handleSelectColumnChange(event){
        this.setState( {selected_column: event.target.value})
    }
    handleSelectColumn2Change(event){
        this.setState( {selected_column2: event.target.value})
    }
    handleSelectNanPolicyChange(event){
        this.setState( {selected_nan_policy: event.target.value})
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
                            Alexander Govern test
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="column-selector-label">Column</InputLabel>
                                <Select
                                        labelId="column-selector-label"
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
                                <FormHelperText>Select sample 01 </FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="column2-selector-label">Column</InputLabel>
                                <Select
                                        labelId="column2-selector-label"
                                        id="column2-selector"
                                        value= {this.state.selected_column2}
                                        label="Column"
                                        onChange={this.handleSelectColumn2Change}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select sample 02</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="nanpolicy-selector-label">Nan policy</InputLabel>
                                <Select
                                        labelid="nanpolicy-selector-label"
                                        id="nanpolicy-selector"
                                        value= {this.state.selected_nan_policy}
                                        label="Nan_policy"
                                        onChange={this.handleSelectNanPolicyChange}
                                >
                                    <MenuItem value={"propagate"}><em>propagate</em></MenuItem>
                                    <MenuItem value={"raise"}><em>raise</em></MenuItem>
                                    <MenuItem value={"omit"}><em>omit</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines how to handle when input contains NaNs.</FormHelperText>
                            </FormControl>
                            <hr/>
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
                            <p className="result_texts">Statistic :  { this.state.test_data['statistic']}</p>
                            <p className="result_texts">p value :    { this.state.test_data['p-value']}</p>
                            <p className="result_texts">mean_positive :    { this.state.test_data['mean_positive']}</p>
                            <p className="result_texts">mean_negative :    { this.state.test_data['mean_negative']}</p>
                            <p className="result_texts">standard_deviation_positive :    { this.state.test_data['standard_deviation_positive']}</p>
                            <p className="result_texts">standard_deviation_negative :    { this.state.test_data['standard_deviation_negative']}</p>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Alexander_Govern_test;
