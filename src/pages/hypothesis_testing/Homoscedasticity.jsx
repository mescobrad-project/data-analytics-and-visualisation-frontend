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

class Homoscedasticity extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",
            selected_method: "Bartlett",
            selected_center: "median"

        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectColumn2Change = this.handleSelectColumn2Change.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectCenterChange = this.handleSelectCenterChange.bind(this);
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
        API.get("check_homoscedasticity",
                {
                    params: {column_1: this.state.selected_column, column_2:this.state.selected_column2, name_test: this.state.selected_method, center: this.state.selected_center}
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
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
    }
    handleSelectCenterChange(event){
        this.setState( {selected_center: event.target.value})
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
                            Select method for Homoscedasticity check
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
                                <FormHelperText>Select Column 01 for Homoscedasticity check</FormHelperText>
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
                                <FormHelperText>Select Column 02 for Homoscedasticity check</FormHelperText>
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
                                    <MenuItem value={"Bartlett"}><em>Bartlett</em></MenuItem>
                                    <MenuItem value={"Fligner-Killeen"}><em>Fligner-Killeen</em></MenuItem>
                                    <MenuItem value={"Levene"}><em>Levene</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <Select
                                        labelid="center-selector-label"
                                        id="center-selector"
                                        value= {this.state.selected_center}
                                        label="Center parameter"
                                        onChange={this.handleSelectCenterChange}
                                >
                                    <MenuItem value={"trimmed"}><em>trimmed</em></MenuItem>
                                    <MenuItem value={"median"}><em>median</em></MenuItem>
                                    <MenuItem value={"mean"}><em>mean</em></MenuItem>
                                </Select>
                                <FormHelperText>Keyword argument controlling which function of the data is used in computing the test statistic. The default is ‘median’.</FormHelperText>
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
                            <p className="result_texts">Statistic :  { this.state.test_data['statistic']}</p>
                            <p className="result_texts">p value :    { this.state.test_data['p-value']}</p>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Homoscedasticity;
