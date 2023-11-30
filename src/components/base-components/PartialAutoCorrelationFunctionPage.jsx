import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "../../pages/hypothesis_testing/normality_tests.scss"
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";

class PartialAutoCorrelationFunctionPage extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/";
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // Utils
            url_params: "",
            // List of channels sent by the backend
            channels: [],

            // Results of the auto correlation stored in an array
            // Might need to convert to object
            correlation_results: [],

            //Values selected currently on the form
            selected_channel: "",
            selected_method: "yw",
            selected_alpha: "",
            selected_nlags: "",

            // Values to pass to visualisations
            correlation_chart_data : [],
            confint_chart_data : false,

            // Visualisation Hide/Show values
            correlation_chart_show : false,
            confint_chart_show : false,

            //Info from selector
            file_used: null,

            partial_autocorrelation_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/partial_autocorrelation.png',
        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectNlagsChange = this.handleSelectNlagsChange.bind(this);
        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleFileUsedChange = this.handleFileUsedChange.bind(this);
        // Initialise component
        // - values of channels from the backend
        // this.fetchChannels();
    }

    
    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        // Convert alpha and nlags from string to int and float
        let to_send_input_alpha = null;
        let to_send_input_nlags = null;

        if (!!this.state.selected_alpha){
            to_send_input_alpha = parseFloat(this.state.selected_alpha)
        }

        if (!!this.state.selected_nlags){
            to_send_input_nlags = parseInt(this.state.selected_nlags)
        }

        //Reset view of optional visualisations preview
        // this.setState({correlation_chart_show: false})
        this.setState({confint_chart_show: false})
        this.setState({qstat_chart_show: false})
        this.setState({pvalues_chart_show: false})

        // Set flags for optional data that need to be shown since if this check is done after results have arrived, maybe the
        // data has already been changed and the wrong visualisation will be shown
        let flag_alpha = false;

        // If alpha is enabled, enable relevant visualisations
        if(to_send_input_alpha){
            flag_alpha = true;
        }

        const params = new URLSearchParams(window.location.search);

        console.log("METHOD VALUE")
        console.log( this.state.selected_method)
        // Send the request
        API.get("return_partial_autocorrelation",
            {
                params: {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                    input_name: this.state.selected_channel,
                    input_method: this.state.selected_method,
                    input_alpha: to_send_input_alpha,
                    input_nlags: to_send_input_nlags}
            }
        ).then(res => {
            const resultJson = res.data;

            // Show only relevant visualisations and load their data
            // Correlation chart always has results so should always be enabled
            this.setState({correlation_results: resultJson.values_partial_autocorrelation})

            let temp_array_correlation = []
            for ( let it =0 ; it < resultJson.values_partial_autocorrelation.length; it++){
                let temp_object = {}
                temp_object["category"] = it
                temp_object["yValue"] = resultJson.values_partial_autocorrelation[it]
                temp_array_correlation.push(temp_object)
            }
            // console.log("")
            // console.log(temp_array)


            this.setState({correlation_chart_data: temp_array_correlation})
            this.setState({correlation_chart_show: true})

            // Alpha optional charts
            if(flag_alpha){
                let temp_array_alpha = []
                for ( let it =0 ; it < resultJson.confint.length; it++){
                    let temp_object = {}
                    temp_object["category"] = it
                    temp_object["yValue1"] = resultJson.confint[it][0]
                    temp_object["yValue2"] = resultJson.confint[it][1]
                    temp_array_alpha.push(temp_object)
                }

                this.setState({confint_chart_data: temp_array_alpha})
                this.setState({confint_chart_show: true});
            }

        });
        // const response = await fetch("http://localhost:8000/test/return_autocorrelation", {
        //     method: "GET",
        //     headers: {"Content-Type": "application/json"},
        //     // body: JSON.stringify({"name": this.state.selected_channel})
        //     // body: newTodo
        // })
        // // .then(response => updateResult(response.json()) )
        // const resultJson = await response.json()
        // // let temp_array = []
        // // for ( let it =0 ; it < resultJson.values_autocorrelation.length; it++){
        // //     let temp_object = {}
        // //     temp_object["order"] = it
        // //     temp_object["value"] = resultJson.values_autocorrelation[it]
        // //     temp_array.push(temp_object)
        // // }
        // // console.log(temp_array)
        // this.setState({correlation_results: resultJson.values_autocorrelation})
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    handleSelectNlagsChange(event){
        this.setState( {selected_nlags: event.target.value})
    }

    handleChannelChange(channel_new_value){
        // console.log("CHANNELS")
        this.setState({channels: channel_new_value})
    }

    handleFileUsedChange(file_used_new_value){
        // console.log("CHANNELS")
        this.setState({file_used: file_used_new_value})
    }

    render() {
        return (
            <Grid container direction="row">
                {/*<Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>*/}
                {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        Data Preview*/}
                {/*    </Typography>*/}
                {/*    <hr/>*/}
                {/*    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        File Name:*/}
                {/*    </Typography>*/}
                {/*    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        trial_av.edf*/}
                {/*    </Typography>*/}
                {/*    <hr/>*/}
                {/*    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        Channels:*/}
                {/*    </Typography>*/}
                {/*    <List>*/}
                {/*        {this.state.channels.map((channel) => (*/}
                {/*                <ListItem> <ListItemText primary={channel}/></ListItem>*/}
                {/*        ))}*/}
                {/*    </List>*/}
                {/*</Grid>*/}
                <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Partial AutoCorrelation Parameterisation
                    </Typography>
                    <Divider/>
                    <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                    <Divider/>
                    <form onSubmit={this.handleSubmit}  style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                            <InputLabel id="channel-selector-label">Channel</InputLabel>
                            <Select
                                labelId="channel-selector-label"
                                id="channel-selector"
                                value= {this.state.selected_channel}
                                label="Channel"
                                onChange={this.handleSelectChannelChange}
                                size={"small"}
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {this.state.channels.map((channel) => (
                                    <MenuItem value={channel}>{channel}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Select Channel to Auto Correlate</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                            <InputLabel id="method-selector-label">Methods</InputLabel>
                            <Select
                                labelId="method-selector-label"
                                id="method-selector"
                                value= {this.state.selected_method}
                                label="Method"
                                onChange={this.handleSelectMethodChange}
                                size={"small"}
                            >
                                {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                <MenuItem value={"yw"}><em>Yule-Walker with sample-size adjustment</em></MenuItem>
                                <MenuItem value={"ywm"}><em> Yule-Walker without adjustment</em></MenuItem>
                                <MenuItem value={"ols"}><em>Regression of time series on lags of it and on constant</em></MenuItem>
                                <MenuItem value={"ols-inefficient"}><em>Regression of time series on lags using a single common sample to estimate all pacf coefficients</em></MenuItem>
                                <MenuItem value={"ols-adjusted"}><em>Regression of time series on lags with a bias adjustment</em></MenuItem>
                                <MenuItem value={"ld"}><em>Levinson-Durbin recursion with bias correction</em></MenuItem>
                                <MenuItem value={"ldb"}><em>Levinson-Durbin recursion without bias correction.</em></MenuItem>
                                {/*<MenuItem value={"burg"}><em>Burg”s partial autocorrelation estimator</em></MenuItem>*/}
                            </Select>
                            <FormHelperText>Specify which method for the calculations to use.</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                            {/*<InputLabel id="alpha-selector-label">Alpha</InputLabel>*/}
                            <TextField
                                // labelId="alpha-selector-label"
                                id="alpha-selector"
                                value= {this.state.selected_alpha}
                                label="Alpha"
                                onChange={this.handleSelectAlphaChange}
                                size={"small"}
                            />
                            <FormHelperText>The confidence intervals for the given level are
                                returned</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                            {/*<InputLabel id="nlags-selector-label">Nlags</InputLabel>*/}
                            <TextField
                                // labelId="nlags-selector-label"
                                id="nlags-selector"
                                value= {this.state.selected_nlags}
                                label="Nlags"
                                onChange={this.handleSelectNlagsChange}
                                size={"small"}
                            />
                            <FormHelperText>Number of lags to return autocorrelation for</FormHelperText>
                        </FormControl>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Result Visualisation
                    </Typography>
                    <Divider sx={{bgcolor: "black"}}/>
                    <Grid item xs={12} container direction='row'>
                        <img src={this.state.partial_autocorrelation_path + "?random=" + new Date().getTime()}
                             srcSet={this.state.partial_autocorrelation_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                             loading="lazy"
                        />
                    </Grid>
                    {/*<hr  class="result"/>*/}
                    {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.correlation_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Correlation Results*/}
                    {/*</Typography>*/}
                    {/*<div style={{ display: (this.state.correlation_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="correlation_chart_id" chart_data={ this.state.correlation_chart_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.correlation_chart_show ? 'block' : 'none') }}/>*/}

                    {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.confint_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Confidence Interval*/}
                    {/*</Typography>*/}
                    {/*<div style={{ display: (this.state.confint_chart_show ? 'block' : 'none') }}><RangeAreaChartCustom chart_id="confint_chart_id" chart_data={ this.state.confint_chart_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.confint_chart_show ? 'block' : 'none') }}/>*/}
                </Grid>
            </Grid>
        )
    }
}

export default PartialAutoCorrelationFunctionPage;
