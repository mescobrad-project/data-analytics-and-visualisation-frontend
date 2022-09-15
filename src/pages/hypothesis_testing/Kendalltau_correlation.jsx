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

class Kendalltau_correlation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",
            selected_method: "auto",
            selected_alternative: "two-sided",
            selected_variant: "b",
            selected_nan_policy:"propagate"
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectColumn2Change = this.handleSelectColumn2Change.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
        this.handleSelectNanPolicyChange = this.handleSelectNanPolicyChange.bind(this);
        this.handleSelectVariantChange = this.handleSelectVariantChange.bind(this);
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
        API.get("compute_kendalltau_correlation",
                {
                    params: {column_1: this.state.selected_column, column_2:this.state.selected_column2,
                        method: this.state.selected_method, alternative: this.state.selected_alternative,
                        variant: this.state.selected_variant, nan_policy: this.state.selected_nan_policy}
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
    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
    }
    handleSelectNanPolicyChange(event){
        this.setState( {selected_nan_policy: event.target.value})
    }
    handleSelectVariantChange(event){
        this.setState( {selected_variant: event.target.value})
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
                            Select method for Kendall’s tau correlation measure
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
                                <FormHelperText>Select Column 01 for correlation check</FormHelperText>
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
                                <FormHelperText>Select Column 02 for correlation check</FormHelperText>
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
                                <FormHelperText>Defines how to handle when input contains nan.</FormHelperText>
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
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                    <MenuItem value={"asymptotic"}><em>asymptotic</em></MenuItem>
                                    <MenuItem value={"exact"}><em>exact</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines which method is used to calculate the p-value.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="variant-selector-label">Variant</InputLabel>
                                <Select
                                        labelid="variant-selector-label"
                                        id="variant-selector"
                                        value= {this.state.selected_variant}
                                        label="Variant"
                                        onChange={this.handleSelectVariantChange}
                                >
                                    <MenuItem value={"b"}><em>b</em></MenuItem>
                                    <MenuItem value={"c"}><em>c</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines which variant of Kendall’s tau is returned.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="alternative-selector-label">Variant</InputLabel>
                                <Select
                                        labelid="alternative-selector-label"
                                        id="alternative-selector"
                                        value= {this.state.selected_alternative}
                                        label="Alternative parameter"
                                        onChange={this.handleSelectAlternativeChange}
                                >
                                    <MenuItem value={"two-sided"}><em>two-sided</em></MenuItem>
                                    <MenuItem value={"less"}><em>less</em></MenuItem>
                                    <MenuItem value={"greater"}><em>greater</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines the alternative hypothesis. </FormHelperText>
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
                            <p className="result_texts">Kendall's tau correlation coefficient :  { this.state.test_data['kendalltau correlation coefficient']}</p>
                            <p className="result_texts">p value :    { this.state.test_data['p-value']}</p>
                        </div>
                    </Grid>
                </Grid>
        )
    }
}

export default Kendalltau_correlation;
