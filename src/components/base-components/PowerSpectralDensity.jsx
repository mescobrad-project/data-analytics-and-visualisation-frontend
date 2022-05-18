import React from 'react';
import API from "../../axiosInstance";
import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
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
// import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";

class PowerSpectralDensity extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of channels sent by the backend
            channels: [],

            // Results of the auto correlation stored in an array
            // Might need to convert to object
            correlation_results: [],

            //Values selected currently on the form
            selected_channel: "",
            selected_fmin: "",
            selected_fmax: "",
            selected_bandwidth: "",
            selected_adaptive: "",
            selected_low_bias: "",
            selected_normalization: "",
            selected_output: "",
            selected_n_jobs: "",
            selected_verbose: "",


            //TEST
            test_chart_html:"",

            // Values to pass to visualisations
            peak_chart_data : [],
            peak_heights_data : [],
            left_thresholds_data : [],
            right_thresholds_data : [],
            prominences_data : [],
            right_bases_data : [],
            left_bases_data : [],
            width_heights_data : [],
            left_ips_data : [],
            right_ips_data : [],
            plateau_sizes_data : [],
            left_edges_data : [],
            right_edges_data : [],

            // Visualisation Hide/Show values
            peak_chart_show : false,
            peak_heights_show : false,
            thresholds_show : false,
            // peak_chart_show : false,
            // peak_chart_show : false,
            // peak_chart_show : false,
            // peak_chart_show : false,
        };

        //Binding functions of the class
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectFMinChange = this.handleSelectFMinChange.bind(this);
        this.handleSelectFMaxChange = this.handleSelectFMaxChange.bind(this);
        this.handleSelectBandwidthChange = this.handleSelectBandwidthChange.bind(this);
        this.handleSelectAdaptiveTypeChange = this.handleSelectAdaptiveTypeChange.bind(this);
        this.handleSelectLowBiasChange = this.handleSelectLowBiasChange.bind(this);
        this.handleSelectNormalizationChange = this.handleSelectNormalizationChange.bind(this);
        this.handleSelectOutputChange = this.handleSelectOutputChange.bind(this);
        this.handleSelectNJobsChange = this.handleSelectNJobsChange.bind(this);
        this.handleSelectVerboseChange = this.handleSelectVerboseChange.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchChannels();
    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchChannels(url, config) {
        API.get("list/channels", {}).then(res => {
            this.setState({channels: res.data.channels})
        });
    }
    
    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        // Convert alpha and nlags from string to int and float
        // let to_send_input_height = null;     //number or array[number,number]
        // let to_send_input_threshold = null;  //number or array[number,number]
        // let to_send_input_distance = null;   //number
        // let to_send_input_prominence = null; //number or array[number,number]
        // let to_send_input_width = null;      //number or array[number,number]
        // let to_send_input_wlen = null;       //int
        // let to_send_input_rel_height = null; //float
        // let to_send_input_plateau = null;    //number or array[number,number]
        //
        // if (!!this.state.selected_distance){
        //     to_send_input_distance = parseInt(this.state.selected_distance)
        // }
        //
        // if (!!this.state.selected_wlen){
        //     to_send_input_wlen = parseInt(this.state.selected_wlen)
        // }
        //
        // if (!!this.state.selected_rel_height){
        //     to_send_input_rel_height = parseFloat(this.state.selected_rel_height)
        // }
        //
        // // MISSING SETTING VALUE AS INFINITY
        // if (this.state.selected_height_type !== "none"){
        //     if(this.state.selected_height_type === "min"){
        //         to_send_input_height = parseFloat(this.state.selected_height_1)
        //     }else if(this.state.selected_height_type === "min-max"){
        //         to_send_input_height = JSON.stringify([parseFloat(this.state.selected_height_1) , parseFloat(this.state.selected_height_2)])
        //     }
        // }
        //
        // if (this.state.selected_threshold_type !== "none"){
        //     if(this.state.selected_threshold_type === "min"){
        //         to_send_input_threshold = parseFloat(this.state.selected_threshold_1)
        //     }else if(this.state.selected_threshold_type === "min-max"){
        //         to_send_input_threshold = [parseFloat(this.state.selected_threshold_1) , parseFloat(this.state.selected_threshold_2)]
        //     }
        // }
        //
        // if (this.state.selected_prominence_type !== "none"){
        //     if(this.state.selected_prominence_type === "min"){
        //         to_send_input_prominence = parseFloat(this.state.selected_prominence_1)
        //     }else if(this.state.selected_prominence_type === "min-max"){
        //         to_send_input_prominence = [parseFloat(this.state.selected_prominence_1) , parseFloat(this.state.selected_prominence_2)]
        //     }
        // }
        //
        // if (this.state.selected_width_type !== "none"){
        //     if(this.state.selected_width_type === "min"){
        //         to_send_input_width = parseFloat(this.state.selected_width_1)
        //     }else if(this.state.selected_width_type === "min-max"){
        //         to_send_input_width = [parseFloat(this.state.selected_width_1) , parseFloat(this.state.selected_width_2)]
        //     }
        // }
        //
        // if (this.state.selected_plateau_size_type !== "none"){
        //     if(this.state.selected_plateau_size_type === "min"){
        //         to_send_input_plateau = parseFloat(this.state.selected_plateau_size_1)
        //     }else if(this.state.selected_plateau_size_type === "min-max"){
        //         to_send_input_plateau = [parseFloat(this.state.selected_plateau_size_1) , parseFloat(this.state.selected_plateau_size_2)]
        //     }
        // }

        //Reset view of optional visualisations preview
        // this.setState({peak_chart_show: false})


        // Set flags for optional data that need to be shown since if this check is done after results have arrived, maybe the
        // data has already been changed and the wrong visualisation will be shown
        // let flag_alpha = false;

        // If alpha is enabled, enable relevant visualisations
        // if(to_send_input_alpha){
        //     flag_alpha = true;
        // }

        // console.log("--------")
        // console.log(to_send_input_height)
        // Send the request
        API.get("return_power_spectral_density",
            {
                params: {input_name: this.state.selected_channel
                }
            }
        ).then(res => {
            const resultJson = res.data;
            console.log("--- Results ---")
            console.log(resultJson)

            // this.setState({test_chart_html: resultJson.figure})
            // // Show only relevant visualisations and load their data
            // // Correlation chart always has results so should always be enabled
            // // this.setState({correlation_results: resultJson.values_partial_autocorrelation})
            // //
            // let temp_array_peaks = []
            // for ( let it =0 ; it < resultJson.peaks.length; it++){
            //     let temp_object = {}
            //     temp_object["category"] = it
            //     temp_object["yValue"] = resultJson.peaks[it]
            //     temp_array_peaks.push(temp_object)
            // }
            // // console.log("")
            // console.log(temp_array_peaks)
            //
            // this.setState({peak_chart_data: temp_array_peaks})
            // this.setState({peak_chart_show: true});

            // let temp_array_height_peaks = []
            // for ( let it =0 ; it < resultJson.peak_heights.length; it++){
            //     let temp_object = {}
            //     temp_object["category"] = it
            //     temp_object["yValue"] = resultJson.peak_heights[it]
            //     temp_array_height_peaks.push(temp_object)
            // }
            // // console.log("")
            // console.log(temp_array_height_peaks)
            //
            // this.setState({peak_heights_data: temp_array_height_peaks})
            // this.setState({peak_heights_show: true});




            //
            //
            // this.setState({correlation_chart_data: temp_array_correlation})
            // this.setState({correlation_chart_show: true})
            //
            // // Alpha optional charts
            // if(flag_alpha){
            //     let temp_array_alpha = []
            //     for ( let it =0 ; it < resultJson.confint.length; it++){
            //         let temp_object = {}
            //         temp_object["category"] = it
            //         temp_object["yValue1"] = resultJson.confint[it][0]
            //         temp_object["yValue2"] = resultJson.confint[it][1]
            //         temp_array_alpha.push(temp_object)
            //     }
            //
            //     this.setState({confint_chart_data: temp_array_alpha})
            //     this.setState({confint_chart_show: true});
            // }

        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }
    handleSelectFMinChange(event){
        this.setState( {selected_fmin: event.target.value})
    }
    handleSelectFMaxChange(event){
        this.setState( {selected_fmax: event.target.value})
    }
    handleSelectBandwidthChange(event){
        this.setState( {selected_bandwidth: event.target.value})
    }
    handleSelectAdaptiveTypeChange(event){
        this.setState( {selected_adaptive: event.target.value})
    }
    handleSelectLowBiasChange(event){
        this.setState( {selected_low_bias: event.target.value})
    }
    handleSelectNormalizationChange(event){
        this.setState( {selected_normalization: event.target.value})
    }
    handleSelectOutputChange(event){
        this.setState( {selected_output: event.target.value})
    }
    handleSelectNJobsChange(event){
        this.setState( {selected_n_jobs: event.target.value})
    }
    handleSelectVerboseChange(event){
        this.setState( {selected_verbose: event.target.value})
    }


    render() {
        return (
            <Grid container direction="row">
                <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Data Preview
                    </Typography>
                    <hr/>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        File Name:
                    </Typography>
                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        trial_av.edf
                    </Typography>
                    <hr/>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Channels:
                    </Typography>
                    <List>
                        {this.state.channels.map((channel) => (
                                <ListItem> <ListItemText primary={channel}/></ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Detection of peaks
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
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="fmin-selector"
                                    value= {this.state.selected_fmin}
                                    label="FMin"
                                    onChange={this.handleSelectFMinChange}
                            />
                            <FormHelperText> The lower frequency of interest </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="fmax-selector"
                                    value= {this.state.selected_fmax}
                                    label="FMin"
                                    onChange={this.handleSelectFMaxChange}
                            />
                            <FormHelperText> The upper  frequency of interest </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="bandwidth-selector"
                                    value= {this.state.selected_bandwidth}
                                    label="Bandwidth"
                                    onChange={this.handleSelectBandwidthChange}
                            />
                            <FormHelperText>     The bandwidth of the multi taper windowing function in Hz. </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="adaptive-selector-label">Adaptive</InputLabel>
                            <Select
                                    labelId="adaptive-selector-label"
                                    id="adaptive-selector"
                                    value= {this.state.selected_adaptive}
                                    label="Adaptive"
                                    onChange={this.handleSelectAdaptiveTypeChange}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText>Use adaptive weights to combine the tapered spectra into PSD</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="low-bias-selector-label">Adaptive</InputLabel>
                            <Select
                                    labelId="low-bias-selector-label"
                                    id="adaptive-selector"
                                    value= {this.state.selected_low_bias}
                                    label="Low Bias"
                                    onChange={this.handleSelectLowBiasChange}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText>Only use tapers with more than 90% spectral concentration within bandwidth.</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="normalization-selector-label">Adaptive</InputLabel>
                            <Select
                                    labelId="normalization-selector-label"
                                    id="normalization-selector"
                                    value= {this.state.selected_normalization}
                                    label="Normalization"
                                    onChange={this.handleSelectNormalizationChange}
                            >
                                <MenuItem value={"full"}><em>Full</em></MenuItem>
                                <MenuItem value={"length"}><em>Length</em></MenuItem>
                            </Select>
                            <FormHelperText>Normalization strategy. If “full”, the PSD will be normalized by the sampling rate as well as the length of the signal </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="output-selector-label">Output</InputLabel>
                            <Select
                                    labelId="output-selector-label"
                                    id="output-selector"
                                    value= {this.state.selected_output}
                                    label="Output"
                                    onChange={this.handleSelectOutputChange}
                            >
                                <MenuItem value={"complex"}><em>Complex</em></MenuItem>
                                <MenuItem value={"power"}><em>Power</em></MenuItem>
                            </Select>
                            <FormHelperText>The format of the returned psds array. Can be either 'complex' or 'power'. If 'power', the power spectral density is returned. If output='complex', the complex fourier coefficients are returned per taper. </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="n-jobs-selector"
                                    value= {this.state.selected_n_jobs}
                                    label="N-Jobs"
                                    onChange={this.handleSelectNJobsChange}
                            />
                            <FormHelperText>The number of jobs to run in parallel. </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="verbose-selector"
                                    value= {this.state.selected_verbose}
                                    label="Verbose"
                                    onChange={this.handleSelectVerboseChange}
                            />
                            <FormHelperText>Control verbosity of the logging output. If None, use the default verbosity level. </FormHelperText>
                        </FormControl>
                       <br/>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={5} sx={{overflow:"auto"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Result Visualisation
                    </Typography>
                    <hr/>
                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peak_chart_show ? 'block' : 'none')  }} noWrap>
                        PSD
                    </Typography>
                    <InnerHTML html={this.state.test_chart_html} />
                    {/*<iframe src="http://127.0.0.1:8000/test/chart" width= "95%" height="95%" ></iframe>*/}

                    {/*<div*/}
                    {/*        dangerouslySetInnerHTML={{__html: this.state.test_chart_html}}*/}
                    {/*/>*/}

                    {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peak_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Peaks*/}
                    {/*</Typography>*/}
                    {/*<div style={{ display: (this.state.peak_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="peak_chart_id" chart_data={ this.state.peak_chart_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.peak_chart_show ? 'block' : 'none') }}/>*/}

                    {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peak_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Height Peak*/}
                    {/*</Typography>*/}
                    {/*<div style={{ display: (this.state.peak_heights_show ? 'block' : 'none') }}><PointChartCustom chart_id="peak_heights_chart_id" chart_data={ this.state.peak_heights_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.peak_heights_show ? 'block' : 'none') }}/>*/}
                </Grid>
            </Grid>
        )
    }
}

export default PowerSpectralDensity;
