import React from 'react';
import API from "../../axiosInstance";
// import InnerHTML from 'dangerously-set-html-content'

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
            selected_fmin: "0",
            selected_fmax: "",
            selected_bandwidth: "",
            selected_adaptive: false,
            selected_low_bias: true,
            selected_normalization: "length",
            selected_output: "power",
            selected_n_jobs: "1",
            selected_verbose: "",

            // Values to pass to visualisations
            psd_chart_data : [],

            // Visualisation Hide/Show values
            psd_chart_show : false,

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
        let to_send_input_fmin = null;     //float
        let to_send_input_fmax = null;  //float
        let to_send_input_bandwidth = null;  //float
        let to_send_input_n_jobs = null;  //float
        // let to_send_input_verbose = null;  //bool|str|int


        if (!!this.state.selected_fmin){
            to_send_input_fmin = parseFloat(this.state.selected_fmin)
        }

        if (!!this.state.selected_fmax){
            to_send_input_fmax = parseFloat(this.state.selected_fmax)
        }else{
            to_send_input_fmax = null
        }

        if (!!this.state.selected_bandwidth){
            to_send_input_bandwidth = parseFloat(this.state.selected_bandwidth)
        }

        if (!!this.state.selected_n_jobs){
            to_send_input_n_jobs = parseFloat(this.state.selected_n_jobs)
        }
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


        // Send the request
        API.get("return_power_spectral_density",
            {
                params: {input_name: this.state.selected_channel,
                    input_fmin: to_send_input_fmin,
                    input_fmax: to_send_input_fmax,
                input_bandwidth: to_send_input_bandwidth,
                    input_adaptive: this.state.selected_adaptive ,
                    input_low_bias: this.state.selected_low_bias,
                    input_normalization: this.state.selected_normalization,
                    input_output: this.state.selected_output,
                    input_n_jobs: to_send_input_n_jobs,
                    input_verbose: this.state.selected_verbose

                }
            }
        ).then(res => {
            const resultJson = res.data;
            console.log("--- Results ---")
            console.log(resultJson)

            let temp_array_psd = []
            for ( let it =0 ; it < resultJson['power spectral density'].length; it++){
                if(it > 1000){
                    break;
                }
                let temp_object = {}
                temp_object["category"] = resultJson['frequencies'][it]
                temp_object["yValue"] = resultJson['power spectral density'][it]
                temp_array_psd.push(temp_object)
            }
            // console.log("")
            // console.log(temp_array)


            this.setState({psd_chart_data: temp_array_psd})
            this.setState({psd_chart_show: true})
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
                        Power Spectral Density
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
                            <FormHelperText>Select Channel</FormHelperText>
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
                                    label="FMax"
                                    onChange={this.handleSelectFMaxChange}
                            />
                            <FormHelperText> The upper  frequency of interest (Leave empty for infinity) </FormHelperText>
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
                            <InputLabel id="low-bias-selector-label">Low Bias</InputLabel>
                            <Select
                                    labelId="low-bias-selector-label"
                                    id="low-bias-selector"
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
                            <InputLabel id="normalization-selector-label">Normalization</InputLabel>
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
                        {/* COMPLEX OUTPUT IS CURRENTLY  DISABLED  CAUSE IT MIGHT NOT BE NEEDED, IF ENABLED DIFFERENT OUTPUT SHOULD BE TAKEN INTO ACCOUNT*/}
                        {/*<FormControl sx={{m: 1, minWidth: 120}}>*/}
                        {/*    <InputLabel id="output-selector-label">Output</InputLabel>*/}
                        {/*    <Select*/}
                        {/*            labelId="output-selector-label"*/}
                        {/*            id="output-selector"*/}
                        {/*            value= {this.state.selected_output}*/}
                        {/*            label="Output"*/}
                        {/*            onChange={this.handleSelectOutputChange}*/}
                        {/*    >*/}
                        {/*        <MenuItem value={"complex"}><em>Complex</em></MenuItem>*/}
                        {/*        <MenuItem value={"power"}><em>Power</em></MenuItem>*/}
                        {/*    </Select>*/}
                        {/*    <FormHelperText>The format of the returned psds array. Can be either 'complex' or 'power'. If 'power', the power spectral density is returned. If output='complex', the complex fourier coefficients are returned per taper. </FormHelperText>*/}
                        {/*</FormControl>*/}
                        {/*<FormControl sx={{m: 1, minWidth: 120}}>*/}
                        {/*    <TextField*/}
                        {/*            id="n-jobs-selector"*/}
                        {/*            value= {this.state.selected_n_jobs}*/}
                        {/*            label="N-Jobs"*/}
                        {/*            onChange={this.handleSelectNJobsChange}*/}
                        {/*    />*/}
                        {/*    <FormHelperText>The number of jobs to run in parallel. </FormHelperText>*/}
                        {/*</FormControl>*/}
                        {/*<FormControl sx={{m: 1, minWidth: 120}}>*/}
                        {/*    <TextField*/}
                        {/*            id="verbose-selector"*/}
                        {/*            value= {this.state.selected_verbose}*/}
                        {/*            label="Verbose"*/}
                        {/*            onChange={this.handleSelectVerboseChange}*/}
                        {/*    />*/}
                        {/*    <FormHelperText>Control verbosity of the logging output. If None, use the default verbosity level. </FormHelperText>*/}
                        {/*</FormControl>*/}
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
                    <Typography variant="p" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>
                        Showing first 1000 entries
                    </Typography>
                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>
                        Welch Results
                    </Typography>

                    <div style={{ display: (this.state.psd_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="psd_chart_id" chart_data={ this.state.psd_chart_data}/></div>
                    <hr style={{ display: (this.state.psd_chart_show ? 'block' : 'none') }}/>
                </Grid>
            </Grid>
        )
    }
}

export default PowerSpectralDensity;
