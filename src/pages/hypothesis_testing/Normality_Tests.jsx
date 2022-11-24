import React, { Component } from 'react';
import API from "../../axiosInstance";
import "./normality_tests.scss"
import {
    Button, Divider,
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
import LoadingButton from '@mui/lab/LoadingButton';
import HistogramChartCustom from "../../components/ui-components/HistogramChartCustom";

class Normality_Tests extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        const file_path = params.get("file_path");
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: {
                statistic: "",
                critical_values:[],
                significance_level:[],
                Description:[],
                data:[]
            },
            test_chart_data : [],
            alpha:"",
            //Values selected currently on the form
            selected_column: "",
            selected_method: "Shapiro-Wilk",
            selected_alternative: "two-sided",
            selected_nan_policy:"propagate",
            selected_axis:"0",
            alternative_show:false,
            nan_policy_show:false,
            axis_show:false,
            histogram_chart_show: false,
            stats_show:true,
            req_file: "",
            loading: false,
            finished: false
            // req_file: file_path
        };

        console.log("1st-"+file_path)
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
        this.handleSelectNaNpolicyChange = this.handleSelectNaNpolicyChange.bind(this);
        this.handleSelectAxisChange = this.handleSelectAxisChange.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.fetchColumnNames();

    }

    /**
     * Call backend endpoint to get column names
     */

    // async fetchColumnNames(url, config) {
    //     console.log("2nd- "+ this.state.req_file)
    //     API.get("return_saved_object_columns",
    //             {params: {file_name: this.state.req_file}}
    //     ).then(res => {
    //         this.setState({column_names: res.data.columns})
    //     });
    // }

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

        this.setState({histogram_chart_show: false})
        // Send the request
        API.get("normality_tests",
                {
                    params: {column: this.state.selected_column,
                        file_name: this.state.req_file,
                        name_test: this.state.selected_method,
                        alternative: this.state.selected_alternative,
                        nan_policy: this.state.selected_nan_policy, axis: this.state.selected_axis}
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState( {alpha:0.05})

            const resultJson = res.data;
            // console.log(resultJson)

            // this.setState({test_chart_data: temp_array_chart})
            this.setState({histogram_chart_show: true})

            var maxCols = 10;
            function getHistogramData(source) {
                // Init
                var data = [];
                var min = Math.min.apply(null, source);
                var max = Math.max.apply(null, source);
                var range = max - min;
                var step = range / maxCols;
                // console.log(min, max, range, step, source)
                // Create items
                for(var i = 0; i < maxCols; i++) {
                    var from = min + i * step;
                    var to = min + (i + 1) * step;
                    data.push({
                        from: from,
                        to: to,
                        count: 0
                    });
                }
                // Calculate range of the values
                for(var i = 0; i < source.length; i++) {
                    var value = source[i];
                    var item = data.find(function(el) {
                        return (value >= el.from) && (value <= el.to);
                    });
                    item.count++;
                }
                return data;
            }
            let temp_array_chart = getHistogramData(resultJson['data'])
            let temp_array_histograme = []
            if (temp_array_chart.length) {
                for (let it = 0; it < temp_array_chart.length; it++) {
                    let temp_object = {}
                    temp_object["category"] = [it]
                    temp_object["yValue"] = temp_array_chart[it]['count']
                    temp_array_histograme.push(temp_object)
                }
                this.setState({test_chart_data: temp_array_histograme})
                // this.setState({test_chart_data: getHistogramData(resultJson['data'])})
            }

        });
    }


    /**
     * Update state when selection changes in the form
     */
    handleSelectColumnChange(event){
        this.setState( {selected_column: event.target.value})
    }
    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
        if (event.target.value=="Kolmogorov-Smirnov"){
            this.setState({alternative_show: true});
            this.setState({axis_show: false});
            this.setState({nan_policy_show: false})
            this.setState({stats_show: true})}
        else if (event.target.value=="D’Agostino’s K^2"){
            this.setState({alternative_show: false});
            this.setState({axis_show: true});
            this.setState({nan_policy_show: true})
            this.setState({stats_show: true})}
        else {this.setState({alternative_show: false});
            this.setState({axis_show: false});
            this.setState({nan_policy_show: false})
            this.setState({stats_show: true})}
    }
    handleSelectNaNpolicyChange(event){
        this.setState( {selected_nan_policy: event.target.value})
    }
    handleSelectAxisChange(event){
        this.setState( {selected_axis: event.target.value})
    }


    render() {
        const { loading, finished } = this.state;
        const setLoading = !finished && loading;
        return (
                <Grid container direction="row">
                    <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Dataset  Preview
                        </Typography>
                        <hr/>
                        <List>
                            {this.state.column_names.map((column) => (
                                    <ListItem> <ListItemText primary={column}/></ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
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
                                <InputLabel id="method-selector-label">Test</InputLabel>
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
                                    {/*<MenuItem value={"Anderson-Darling"}><em>Anderson-Darling</em></MenuItem>*/}
                                    <MenuItem value={"D’Agostino’s K^2"}><em>D’Agostino’s K^2</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}
                                         style={{ display: (this.state.nan_policy_show ? 'block' : 'none') }}>
                                <InputLabel id="nanpolicy-selector-label">Nan policy</InputLabel>
                                <Select
                                        labelid="nanpolicy-selector-label"
                                        id="nanpolicy-selector"
                                        value= {this.state.selected_nan_policy}
                                        label="Nan_policy"
                                        onChange={this.handleSelectNaNpolicyChange}
                                >
                                    <MenuItem value={"propagate"}><em>propagate</em></MenuItem>
                                    <MenuItem value={"raise"}><em>raise</em></MenuItem>
                                    <MenuItem value={"omit"}><em>omit</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines how to handle when input contains NaNs.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}
                                         style={{ display: (this.state.alternative_show ? 'block' : 'none') }}>
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
                            <FormControl sx={{m: 1, minWidth: 120}}
                                         style={{ display: (this.state.axis_show ? 'block' : 'none') }}>
                                <TextField
                                        labelid="axis-selector-label"
                                        id="axis-selector"
                                        value= {this.state.selected_axis}
                                        label="axis parameter"
                                        onChange={this.handleSelectAxisChange}
                                />
                                <FormHelperText>Axis along which to compute test.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                            <LoadingButton sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                           loading={setLoading}
                                           loadingIndicator="Loading…"
                                           variant="outlined"
                                           done={finished}
                                           onClick={() => {
                                               // Clicked, so show the progress dialog
                                               this.setState({ loading: true });

                                               // In a 1.5 seconds, end the progress to show that it's done
                                               setTimeout(() => { this.setState({ finished: true })}, 1500);
                                           }}
                            >
                                Submit
                            </LoadingButton>

                        </form>
                        {/*<Divider/>*/}
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            window.location.replace("/")
                            // Send the request
                        }}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit">
                                Proceed >
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Normality test Results
                        </Typography>
                        <div className="result_texts" style={{ display: (this.state.stats_show ? 'block' : 'none') }}>
                            Test - Statistic :  { this.state.test_data.statistic}<br/>
                            p-value : {this.state.test_data.p_value}<br/>
                            Compared to significance level :    {this.state.alpha}<br/>
                            <p style={{ color: (this.state.test_data.Description=="Sample looks Gaussian (fail to reject H0)" ? 'Red' : 'Green') }}>Description :    {this.state.test_data.Description}</p>
                        </div>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.histogram_chart_show ? 'block' : 'none')  }}>
                            Histogram of Selected data
                        </Typography>
                        <div style={{ display: (this.state.histogram_chart_show ? 'block' : 'none') }}>
                            <HistogramChartCustom chart_id="histogram_chart_id" chart_data={ this.state.test_chart_data}/></div>
                        <hr style={{ display: (this.state.histogram_chart_show ? 'block' : 'none') }}/>
                    </Grid>
                </Grid>
        )
    }
}

export default Normality_Tests;
