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
import HistogramChartCustom from "../../components/ui-components/HistogramChartCustom";
import PointChartCustom from "../../components/ui-components/PointChartCustom";

class Normality_Tests extends React.Component {
    constructor(props){
        super(props);
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
            selected_method: "Anderson-Darling",
            selected_axis:"0",
            axis_show:false,
            histogram_chart_show: false,
            stats_show:true
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectAxisChange = this.handleSelectAxisChange.bind(this);
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

        this.setState({histogram_chart_show: false})
        // Send the request
        API.get("normality_tests",
                {
                    params: {column: this.state.selected_column, name_test: this.state.selected_method,
                        axis: this.state.selected_axis}
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

    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
        // if (event.target.value=="Kolmogorov-Smirnov"){
        //     this.setState({alternative_show: true});
        //     this.setState({axis_show: false});
        //     this.setState({nan_policy_show: false})
        //     this.setState({stats_show: true})}
        // else if (event.target.value=="D’Agostino’s K^2"){
        //     this.setState({alternative_show: false});
        //     this.setState({axis_show: true});
        //     this.setState({nan_policy_show: true})
        //     this.setState({stats_show: true})}
        // else if (event.target.value=="Anderson-Darling"){
        //     this.setState({alternative_show: false});
        //     this.setState({axis_show: false});
        //     this.setState({nan_policy_show: false})
        //     this.setState({stats_show: false})}
        // else {this.setState({alternative_show: false});
        //     this.setState({axis_show: false});
        //     this.setState({nan_policy_show: false})
        //     this.setState({stats_show: true})}
    }

    handleSelectAxisChange(event){
        this.setState( {selected_axis: event.target.value})
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
                                <InputLabel id="method-selector-label">Test</InputLabel>
                                <Select
                                        labelId="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    <MenuItem value={"Anderson-Darling"}><em>Anderson-Darling</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
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
                            <p className="result_texts">
                                Test - Statistic :  { this.state.test_data.statistic}<br/>
                            </p>
                            <Typography className="result_texts" variant="h9" sx={{ flexGrow: 1}} noWrap>
                                Significance level : Critical_values
                            </Typography>
                            <List>
                                {this.state.test_data.Description.map((channel) => (
                                        <ListItem> <ListItemText primary={channel}/></ListItem>
                                ))}
                            </List>
                            {/*<p className="result_texts" style={{ color: (this.state.histogram_chart_show=="Sample looks Gaussian (fail to reject H0)" ? 'Red' : 'Green') }}>Description :    {this.state.test_data.Description}</p>*/}
                        </div>
                        <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.histogram_chart_show ? 'block' : 'none')  }} noWrap>
                            Normality test Results
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
