import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
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
    Select, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";

class AutoCorrelationFunctionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // List of channels sent by the backend
            channels: [],

            // Results of the auto correlation stored in an array
            // Might need to convert to object
            correlation_results: [],

            //Values selected currently on the form
            selected_channel: "",
            selected_adjusted: false,
            selected_qstat: false,
            selected_fft: true,
            selected_bartlett_confint: true,
            selected_missing: "none",
            selected_alpha: "",
            selected_nlags: "",

            // Values to pass to visualisations
            correlation_chart_data : [],
            confint_chart_data : false,
            qstat_chart_data : false,
            pvalues_chart_data : false,

            // Visualisation Hide/Show values
            correlation_chart_show : false,
            confint_chart_show : false,
            qstat_chart_show : false,
            pvalues_chart_show : false,

        };

        //Binding functions of the class
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectAdjustedChange = this.handleSelectAdjustedChange.bind(this);
        this.handleSelectQstatChange = this.handleSelectQstatChange.bind(this);
        this.handleSelectFFTChange = this.handleSelectFFTChange.bind(this);
        this.handleSelectBartlettConfintChange = this.handleSelectBartlettConfintChange.bind(this);
        this.handleSelectMissingChange = this.handleSelectMissingChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectNlagsChange = this.handleSelectNlagsChange.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchChannels();

    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchChannels(url, config) {
        API.get("test/list/channels", {}).then(res => {
            this.setState({channels: res.data.channels})
        });
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
        let flag_qstat = false;

        // If alpha is enabled, enable relevant visualisations
        if(to_send_input_alpha){
            flag_alpha = true;
        }

        // If qstat is enabled, enable relevant visualisations
        if(this.state.selected_qstat){
            flag_qstat = true;
        }



        // Send the request
        API.get("test/return_autocorrelation",
            {
                params: {input_name: this.state.selected_channel, input_adjusted: this.state.selected_adjusted,
                    input_qstat: this.state.selected_qstat, input_fft: this.state.selected_fft,
                    input_bartlett_confint: this.state.selected_bartlett_confint, input_missing: this.state.selected_missing,
                    input_alpha: to_send_input_alpha, input_nlags: to_send_input_nlags}
            }
        ).then(res => {
            const resultJson = res.data;

            // Show only relevant visualisations and load their data
            // Correlation chart always has results so should always be enabled
            this.setState({correlation_results: resultJson.values_autocorrelation})

            let temp_array_correlation = []
            for ( let it =0 ; it < resultJson.values_autocorrelation.length; it++){
                let temp_object = {}
                temp_object["category"] = it
                temp_object["yValue"] = resultJson.values_autocorrelation[it]
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
                // co

                this.setState({confint_chart_data: temp_array_alpha})
                this.setState({confint_chart_show: true});
            }

            // Qstat optional charts
            if(flag_qstat){
                let temp_array_qstat = []
                for ( let it =0 ; it < resultJson.qstat.length; it++){
                    let temp_object = {}
                    temp_object["category"] = it
                    temp_object["yValue"] = resultJson.qstat[it]
                    temp_array_qstat.push(temp_object)
                }
                this.setState({qstat_chart_data: temp_array_qstat})
                this.setState({qstat_chart_show: true});

                let temp_array_pvalues = []
                for ( let it =0 ; it < resultJson.pvalues.length; it++){
                    let temp_object = {}
                    temp_object["category"] = it
                    temp_object["yValue"] = resultJson.pvalues[it]
                    temp_array_pvalues.push(temp_object)
                }
                this.setState({pvalues_chart_data: temp_array_pvalues})
                this.setState({pvalues_chart_show: true});
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
    handleSelectAdjustedChange(event){
        this.setState( {selected_adjusted: event.target.value})
    }
    handleSelectQstatChange(event){
        this.setState( {selected_qstat: event.target.value})
    }
    handleSelectFFTChange(event){
        this.setState( {selected_fft: event.target.value})
    }
    handleSelectBartlettConfintChange(event){
        this.setState( {selected_bartlett_confint: event.target.value})
    }
    handleSelectMissingChange(event){
        this.setState( {selected_missing: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    handleSelectNlagsChange(event){
        this.setState( {selected_nlags: event.target.value})
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
                        {this.state.channels.map((channel) => (
                            <ListItem> <ListItemText primary={channel}/></ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        AutoCorrelation Parameterisation
                    </Typography>
                    <hr/>
                    <form onSubmit={this.handleSubmit}>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="channel-selector-label">Channel</InputLabel>
                            <Select
                                labelId="channel-selector-label"
                                id="channel-selector"
                                value= {this.state.selected_channel}
                                label="Channel"
                                onChange={this.handleSelectChannelChange}
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
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="adjusted-selector-label">Adjusted</InputLabel>
                            <Select
                                labelId="adjusted-selector-label"
                                id="adjusted-selector"
                                value= {this.state.selected_adjusted}
                                label="Adjusted"
                                defaultValue={1}
                                onChange={this.handleSelectAdjustedChange}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText>Should channels be adjusted</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="qstat-selector-label">Qstat</InputLabel>
                            <Select
                                labelId="qstat-selector-label"
                                id="qstat-selector"
                                value= {this.state.selected_qstat}
                                label="Qstat"
                                onChange={this.handleSelectQstatChange}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText>Should Qstat be on?</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="fft-selector-label">FFT</InputLabel>
                            <Select
                                labelId="fft-selector-label"
                                id="fft-selector"
                                value= {this.state.selected_fft}
                                label="FFT"
                                onChange={this.handleSelectFFTChange}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText>Should FFT be on?</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="bartlett-confint-selector-label">Bartlet</InputLabel>
                            <Select
                                labelId="bartlett-confint-selector-label"
                                id="bartlett-confint-selector"
                                value= {this.state.selected_bartlett_confint}
                                label="bartlett-confint"
                                onChange={this.handleSelectBartlettConfintChange}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText>Should Bartlett Confint be on?</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="missing-selector-label">Missing</InputLabel>
                            <Select
                                labelId="missing-selector-label"
                                id="missing-selector"
                                value= {this.state.selected_missing}
                                label="Missing"
                                onChange={this.handleSelectMissingChange}
                            >
                                <MenuItem value={"none"}><em>None</em></MenuItem>
                                <MenuItem value={"raise"}><em>Raise</em></MenuItem>
                                <MenuItem value={"conservative"}><em>Conservative</em></MenuItem>
                                <MenuItem value={"drop"}><em>Drop</em></MenuItem>
                            </Select>
                            <FormHelperText>Should Bartlett Confint be on?</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            {/*<InputLabel id="alpha-selector-label">Alpha</InputLabel>*/}
                            <TextField
                                // labelId="alpha-selector-label"
                                id="alpha-selector"
                                value= {this.state.selected_alpha}
                                label="Alpha"
                                onChange={this.handleSelectAlphaChange}
                            />
                            <FormHelperText>Alpha to be checked?</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            {/*<InputLabel id="nlags-selector-label">Nlags</InputLabel>*/}
                            <TextField
                                // labelId="nlags-selector-label"
                                id="nlags-selector"
                                value= {this.state.selected_nlags}
                                label="Nlags"
                                onChange={this.handleSelectNlagsChange}
                            />
                            <FormHelperText>Nlags to be checked?</FormHelperText>
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
                    {/*<List>*/}
                    {/*{this.state.correlation_results.map((result) => (*/}
                    {/*    <ListItem> <ListItemText primary={result}/></ListItem>*/}
                    {/*))}*/}
                    {/*</List>*/}
                    {/*// Probably should be removed to a new component !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.correlation_chart_show ? 'block' : 'none')  }} noWrap>
                        Correlation Results
                    </Typography>
                    <div style={{ display: (this.state.correlation_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="correlation_chart_id" chart_data={ this.state.correlation_chart_data}/></div>
                    <hr style={{ display: (this.state.correlation_chart_show ? 'block' : 'none') }}/>

                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.confint_chart_show ? 'block' : 'none')  }} noWrap>
                        Confidence Interval
                    </Typography>
                    <div style={{ display: (this.state.confint_chart_show ? 'block' : 'none') }}><RangeAreaChartCustom chart_id="confint_chart_id" chart_data={ this.state.confint_chart_data}/></div>
                    <hr style={{ display: (this.state.confint_chart_show ? 'block' : 'none') }}/>

                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.qstat_chart_show ? 'block' : 'none')  }} noWrap>
                        Qstat
                    </Typography>
                    <div style={{ display: (this.state.qstat_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="qstat_chart_id" chart_data={ this.state.qstat_chart_data}/></div>
                    <hr style={{ display: (this.state.qstat_chart_show ? 'block' : 'none') }}/>

                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.pvalues_chart_show ? 'block' : 'none')  }} noWrap>
                        Pvalues
                    </Typography>
                    <div style={{ display: (this.state.pvalues_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="pvalues_chart_id" chart_data={ this.state.pvalues_chart_data}/></div>
                    <hr style={{ display: (this.state.pvalues_chart_show ? 'block' : 'none') }}/>

                </Grid>
            </Grid>
        )
    }
}

export default AutoCorrelationFunctionPage;