import React from 'react';
import API from "../../axiosInstance";
import "./normality_tests.scss"
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

class Normality_Tests extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_method: "Shapiro-Wilk",

        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
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
        API.get("normality_tests",
                {
                    params: {column: this.state.selected_column, name_test: this.state.selected_method}
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
    handleSelectMethodChange(event){
        this.setState( {selected_window: event.target.value})
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
                            Select Normality Test
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
                                <FormHelperText>Select Column for Normality test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="method-selector-label">Method</InputLabel>
                                <Select
                                        labelId="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"Shapiro-Wilk"}><em>Shapiro-Wilk</em></MenuItem>
                                    <MenuItem value={"Kolmogorov-Smirnov"}><em>Kolmogorov-Smirnov</em></MenuItem>
                                    <MenuItem value={"Anderson-Darling"}><em>Anderson-Darling</em></MenuItem>
                                    <MenuItem value={"D’Agostino’s K^2"}><em>D’Agostino’s K^2</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
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
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peridogram_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Normality test Results*/}
                        {/*</Typography>*/}

                        <div>
                            <p>Statistic :  { this.state.test_data.statistic}</p>
                            <p>p_value :    { this.state.test_data.p_value}</p>
                            <p>Description :    {this.state.test_data.Description}</p>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Normality_Tests;
