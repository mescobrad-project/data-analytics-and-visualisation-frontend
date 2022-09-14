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

class Wilcoxon_signed_rank_test extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",
            selected_zero_method:"wilcox",
            selected_correction:false,
            selected_alternative: "two-sided",
            selected_method:"auto",
            selected_nan_policy:"propagate",
            selected_statistical_test:"Wilcoxon signed-rank test"
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectColumn2Change = this.handleSelectColumn2Change.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
        this.handleSelectNanPolicyChange = this.handleSelectNanPolicyChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectZeroMethodChange = this.handleSelectZeroMethodChange.bind(this);
        this.handleSelectCorrectionChange = this.handleSelectCorrectionChange.bind(this);
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
                        zero_method:this.state.selected_zero_method, correction:this.state.selected_correction,
                        alternative: this.state.selected_alternative, method: this.state.selected_method,
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
    handleSelectZeroMethodChange(event){
        this.setState( {selected_zero_method: event.target.value})
    }
    handleSelectCorrectionChange(event){
        this.setState( {selected_correction: event.target.value})
    }
    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
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
                            Wilcoxon signed-rank test
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
                                <InputLabel id="zeromethod-selector-label">zero-method</InputLabel>
                                <Select
                                        labelid="zeromethod-selector-label"
                                        id="zeromethod-selector"
                                        value= {this.state.selected_zero_method}
                                        label="zero-method"
                                        onChange={this.handleSelectZeroMethodChange}
                                >
                                    <MenuItem value={"wilcox"}><em>wilcox</em></MenuItem>
                                    <MenuItem value={"pratt"}><em>pratt</em></MenuItem>
                                    <MenuItem value={"zsplit"}><em>zsplit</em></MenuItem>
                                </Select>
                                <FormHelperText>There are different conventions for handling pairs of observations with equal values (“zero-differences”, or “zeros”).
                                    “wilcox”: Discards all zero-differences.
                                    “pratt”: Includes zero-differences in the ranking process, but drops the ranks of the zeros (more conservative).
                                    “zsplit”: Includes zero-differences in the ranking process and splits the zero rank between positive and negative ones.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="correction-selector-label">Correction</InputLabel>
                                <Select
                                        labelid="correction-selector-label"
                                        id="correction-selector"
                                        value= {this.state.selected_correction}
                                        label="Correction"
                                        onChange={this.handleSelectCorrectionChange}
                                >
                                    <MenuItem value={"false"}><em>false</em></MenuItem>
                                    <MenuItem value={"true"}><em>true</em></MenuItem>
                                </Select>
                                <FormHelperText>If True, apply continuity correction by adjusting the Wilcoxon rank statistic by 0.5 towards the mean value when computing the z-statistic if a normal approximation is used.</FormHelperText>
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
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                    <MenuItem value={"exact"}><em>exact</em></MenuItem>
                                    <MenuItem value={"approx"}><em>approx</em></MenuItem>
                                </Select>
                                <FormHelperText>Method to calculate the p-value.</FormHelperText>
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
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="alternative-selector-label">Alternative</InputLabel>
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

export default Wilcoxon_signed_rank_test;
