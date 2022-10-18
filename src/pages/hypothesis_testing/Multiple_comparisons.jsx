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
    Select, TextField,
    Typography
} from "@mui/material";

class Multiple_comparisons extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: {
                rejected:[],
                corrected_p_values:[]
            },
            //Values selected currently on the form
            selected_column: [0.025932, 0.034590009986, 0.0000456840, 0.000456389, 0.000002569, 0.025698712, 0.0000593328, 0.000000015464125663849667],
            selected_alpha: 0.05,
            selected_method: "Bonferroni",

        };
        //Binding functions of the class
        // this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        // this.fetchColumnNames();

    }

    // /**
    //  * Call backend endpoint to get column names
    //  */
    // async fetchColumnNames(url, config) {
    //     API.get("return_columns", {}).then(res => {
    //         this.setState({column_names: res.data.columns})
    //     });
    // }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();

        let data_to_send = {
            p_value: this.state.selected_column,
            method: this.state.selected_method,
            alpha: this.state.selected_alpha
        }

        API.post("multiple_comparisons",
                data_to_send
                , {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(res =>{this.setState({test_data: res.data})
        });
        // // Send the request
        // API.get("multiple_comparisons",
        //         {
        //             params: {p_value: this.state.selected_column, method: this.state.selected_method,
        //                 alpha: this.state.selected_alpha}
        //         }
        // ).then(res => {
        //     this.setState({test_data: res.data})
        // });
    }


    /**
     * Update state when selection changes in the form
     */
    // handleSelectColumnChange(event){
    //     this.setState( {selected_column: event.target.value})
    // }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Selected p-value list
                        </Typography>
                        <hr/>
                        <List>
                            {this.state.selected_column.map((column) => (
                                    <ListItem
                                            disabled
                                            maxrows={2}
                                            multiline="true"
                                            variant="filled"
                                            >
                                        <ListItemText primary={column}/></ListItem>
                            ))}
                        </List>
                        {/*<TextField disabled*/}
                        {/*           multiline*/}
                        {/*           fullWidth*/}
                        {/*           variant="filled"*/}
                        {/*           value= {this.state.selected_column.map(.toString()}*/}
                        {/*/>*/}
                    </Grid>
                    <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Multiple Tests and P-Value Correction
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
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
                                    <MenuItem value={"Bonferroni"}><em>Bonferroni: one-step correction</em></MenuItem>
                                    <MenuItem value={"sidak"}><em>Sidak</em></MenuItem>
                                    <MenuItem value={"holm-sidak"}><em>Holm-Sidak</em></MenuItem>
                                    <MenuItem value={"holm"}><em>Holm</em></MenuItem>
                                    <MenuItem value={"simes-hochberg"}><em>Simes-Hochberg</em></MenuItem>
                                    <MenuItem value={"benjamini-hochberg"}><em>Benjamini-Hochberg</em></MenuItem>
                                    <MenuItem value={"benjamini-yekutieli"}><em>Benjamini-Yekutieli</em></MenuItem>
                                    <MenuItem value={"fdr_tsbh"}><em>fdr_tsbh</em></MenuItem>
                                    <MenuItem value={"fdr_tsbky"}><em>fdr_tsbky: two stage fdr correction (non-negative)</em></MenuItem>
                                </Select>
                                <FormHelperText>Method used for testing and adjustment of pvalues.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="alpha-selector-label">alpha</InputLabel>*/}
                                <TextField
                                        labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>family-wise error rate, e.g. 0.1.</FormHelperText>
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
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peridogram_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Normality test Results*/}
                        {/*</Typography>*/}

                        {/*<div>*/}
                        {/*    <p className="result_texts">Reject hypothesis :  {*/}
                        {/*        this.state.test_data['true for hypothesis that can be rejected for given alpha']}*/}
                        {/*    </p>*/}
                        {/*    <p className="result_texts">p_value :    { this.state.test_data['corrected_p_values']}</p>*/}
                        {/*    /!*<p className="result_texts">Description :    {this.state.test_data.Description}</p>*!/*/}
                        {/*</div>*/}
                        <div style={{display:"flex"}}>
                            {/*<p className="result_texts">Transformed data 1 : { this.state.transformed_data_1}</p>*/}
                            <List style={{flex:2, width: "fit-content"}}>
                                Hypothesis that can be rejected:
                                {this.state.test_data.rejected.map((channel) => (
                                        <ListItem> <ListItemText primary={channel}/></ListItem>
                                ))}
                            </List>
                            {/*<p className="result_texts">Transformed data 2 : { this.state.transformed_data_2}</p>*/}
                            <List style={{flex:2, width: "fit-content"}}>
                                corrected p-values:
                                {this.state.test_data.corrected_p_values.map((channel) => (
                                        <ListItem> <ListItemText primary={channel}/></ListItem>
                                ))}
                            </List>
                        </div>

                    </Grid>
                </Grid>
        )
    }
}

export default Multiple_comparisons;
