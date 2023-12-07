import React from 'react';
import API from "../../axiosInstance";
// import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
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
import LineMultipleColorsChartCustom from "../ui-components/LineMultipleColorsChartCustom";
import ChannelSignalSpindleSlowwaveChartCustom from "../ui-components/ChannelSignalSpindleSlowwaveChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import ProceedButton from "../ui-components/ProceedButton";
// import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";

class SlowWaves extends React.Component {
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
            selected_freq_sw_low: "0.3",
            selected_freq_sw_high: "1.5",
            duration_negative_low : "0.5",
            duration_negative_high : "1.5",
            selected_duration_positive_low : "0.1",
            selected_duration_positive_high : "1",
            selected_amplitude_positive_low : "10",
            selected_amplitude_positive_high : "150",
            selected_amplitude_negative_low : "40",
            selected_amplitude_negative_high : "200",
            selected_amplitude_p2p_low : "75",
            selected_amplitude_p2p_high : "350",
            selected_min_distance : "500",
            selected_coupling: false,
            selected_remove_outliers : false,

            // Values to pass to visualisations
            signal_chart_data : [],
            signal_chart_highlighted_data : [],

            // Visualisation Hide/Show values
            signal_chart_show : false,
            selected_part_channel: "F8-Ref",
            // peak_chart_show : false,
            // peak_chart_show : false,
            // peak_chart_show : false,
            // peak_chart_show : false,

            //Info from selector
            file_used: null
        };

        //Binding functions of the class
        // this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectedFreqSWLow = this.handleSelectedFreqSWLow.bind(this);
        this.handleSelectedFreqSWHigh = this.handleSelectedFreqSWHigh.bind(this);

        this.handleSelectedDurationNegativeLow = this.handleSelectedDurationNegativeLow.bind(this);
        this.handleSelectedDurationNegativeHigh = this.handleSelectedDurationNegativeHigh.bind(this);

        this.handleSelectedDurationPositiveLow = this.handleSelectedDurationPositiveLow.bind(this);
        this.handleSelectedDurationPositiveHigh = this.handleSelectedDurationPositiveHigh.bind(this);

        this.handleSelectedAmplitudePositiveLow = this.handleSelectedAmplitudePositiveLow.bind(this);
        this.handleSelectedAmplitudePositiveHigh = this.handleSelectedAmplitudePositiveHigh.bind(this);

        this.handleSelectedAmplitudeNegativeLow = this.handleSelectedAmplitudeNegativeLow.bind(this);
        this.handleSelectedAmplitudeNegativeHigh = this.handleSelectedAmplitudeNegativeHigh.bind(this);

        this.handleSelectedAmplitudeP2PLow = this.handleSelectedAmplitudeP2PLow.bind(this);
        this.handleSelectedAmplitudeP2PHigh = this.handleSelectedAmplitudeP2PHigh.bind(this);

        this.handleSelectedRemoveOutliers = this.handleSelectedRemoveOutliers.bind(this);
        this.handleSelectedCoupling = this.handleSelectedCoupling.bind(this);

        this.handleSelectedRemoveOutliers = this.handleSelectedRemoveOutliers.bind(this);
        this.handleGetChannelSignal = this.handleGetChannelSignal.bind(this);
        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleFileUsedChange = this.handleFileUsedChange.bind(this);
        // Initialise component
        // - values of channels from the backend
        // this.fetchChannels();

        // this.handleGetChannelSignal();
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        // Convert alpha and nlags from string to int and float
        let to_send_freq_sw_low = null;     //int
        let to_send_freq_sw_high = null;     //int

        let to_send_duration_negative_low = null;     //int
        let to_send_duration_negative_high = null;     //int

        let to_send_duration_positive_low = null;     //int
        let to_send_duration_positive_high = null;     //int

        let to_send_amplitude_positive_low = null;     //int
        let to_send_amplitude_positive_high = null;     //int

        let to_send_amplitude_negative_low = null;     //int
        let to_send_amplitude_negative_high = null;     //int

        let to_send_amplitude_ptp_low = null;     //int
        let to_send_amplitude_ptp_high = null;     //int

        // let to_send_input_verbose = null;  //bool|str|int
        if (!!this.state.selected_freq_sw_low){
            to_send_freq_sw_low = parseFloat(this.state.selected_freq_sw_low)
        }

        if (!!this.state.selected_freq_sw_high){
            to_send_freq_sw_high = parseFloat(this.state.selected_freq_sw_high)
        }

        if (!!this.state.duration_negative_low){
            to_send_duration_negative_low = parseFloat(this.state.duration_negative_low)
        }

        if (!!this.state.duration_negative_high){
            to_send_duration_negative_high = parseFloat(this.state.duration_negative_high)
        }

        if (!!this.state.selected_duration_positive_low){
            to_send_duration_positive_low = parseFloat(this.state.selected_duration_positive_low)
        }

        if (!!this.state.selected_duration_positive_high){
            to_send_duration_positive_high = parseFloat(this.state.selected_duration_positive_high)
        }


        if (!!this.state.selected_duration_positive_low){
            to_send_amplitude_positive_low = parseInt(this.state.selected_duration_positive_low)
        }

        if (!!this.state.selected_duration_positive_high){
            to_send_amplitude_positive_high = parseInt(this.state.selected_duration_positive_high)
        }

        if (!!this.state.selected_amplitude_negative_low){
            to_send_amplitude_negative_low = parseInt(this.state.selected_amplitude_negative_low)
        }

        if (!!this.state.selected_amplitude_negative_high){
            to_send_amplitude_negative_high = parseInt(this.state.selected_amplitude_negative_high)
        }

        if (!!this.state.selected_amplitude_p2p_low){
            to_send_amplitude_ptp_low = parseInt(this.state.selected_amplitude_p2p_low)
        }

        if (!!this.state.selected_amplitude_p2p_high){
            to_send_amplitude_ptp_high = parseInt(this.state.selected_amplitude_p2p_high)
        }



        const params = new URLSearchParams(window.location.search);
        // Send the request
        API.get("slow_waves_detection",
            {
                params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                    name: this.state.selected_channel,
                    freq_sw_low: to_send_freq_sw_low,
                    freq_sw_high: to_send_freq_sw_high,
                    duration_negative_low: to_send_duration_negative_low,
                    duration_negative_high: to_send_duration_negative_high,
                    duration_positive_low: to_send_duration_positive_low,
                    duration_positive_high: to_send_duration_positive_high,
                    amplitude_positive_low: to_send_amplitude_positive_low,
                    amplitude_positive_high: to_send_amplitude_positive_high,
                    amplitude_negative_low: to_send_amplitude_negative_low,
                    amplitude_negative_high: to_send_amplitude_negative_high,
                    amplitude_ptp_low: to_send_amplitude_ptp_low,
                    amplitude_ptp_high: to_send_amplitude_ptp_high,
                    coupling: this.state.selected_coupling,
                    remove_outliers: this.state.selected_remove_outliers,
                    file_used: this.state.file_used,
                }
            }
        ).then(res => {
            const resultJson = res.data;
            console.log("--- Results ---")
            console.log(resultJson)

            // We do this just once inside the chart compoennt to avoid multiple for loops
            // let temp_array_singal = []
            // for ( let it =0 ; it < resultJson['signal'].length; it++){
            //     if(it > 1000){
            //         break;
            //     }
            //     let temp_object = {}
            //     temp_object["category"] = it
            //     temp_object["yValue"] = resultJson['signal'][it]
            //     // temp_object["strokeSettings"] = {stroke: colorSet.getIndex(0)}
            //     // temp_object["fillSettings"] = {fill: colorSet.getIndex(0)}
            //     // temp_object["bulletSettings"] = {fill: colorSet.getIndex(0)}
            //     temp_array_singal.push(temp_object)
            // }
            // console.log("")
            // console.log(temp_array)


            this.setState({signal_chart_data: resultJson['signal']})
            this.setState({signal_chart_highlighted_data: resultJson['detected_spindles']})
            this.setState({signal_chart_show: true})
        });
    }

    async handleGetChannelSignal() {
        if (this.state.selected_part_channel === "") {
            return
        }
        const params = new URLSearchParams(window.location.search);

        API.get("return_signal",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        input_name: this.state.selected_part_channel,
                        // file_used: "original",
                        // params: {input_name: this.state.selected_channel,
                    }
                }
        ).then(res => {
            const resultJson = res.data;
            console.log(res.data)
            console.log("ORIGINAL LENGTH")
            console.log(resultJson.signal.length)
            this.setState({signal_original_start_seconds: resultJson.start_date_time});

            let temp_array_signal = []
            for (let it = 0; it < resultJson.signal.length; it++) {
                let temp_object = {}
                let adjusted_time = ""
                // First entry is 0 so no need to add any milliseconds
                // Time added is as millisecond/100 so we multiply by 1000
                if (it === 0) {
                    adjusted_time = resultJson.start_date_time
                } else {
                    adjusted_time = resultJson.start_date_time + resultJson.signal_time[it] * 1000
                }

                let temp_date = new Date(adjusted_time)
                temp_object["date"] = temp_date
                temp_object["yValue"] = resultJson.signal[it]
                //TODO
                if(it > 10452 && it <10863 || it > 16546 && it <16832){
                    temp_object["color"] = "red"
                }else{
                    temp_object["color"] = "blue"
                }

                temp_array_signal.push(temp_object)
            }

            this.setState({signal_chart_data: temp_array_signal})
            this.setState({select_signal_chart_show: true});
        });
    }
    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }
    handleSelectedFreqSWLow(event){
        this.setState( {selected_freq_sw_low: event.target.value})
    }
    handleSelectedFreqSWHigh(event){
        this.setState( {selected_freq_sw_high: event.target.value})
    }


    handleSelectedDurationNegativeLow(event){
        this.setState( {duration_negative_low: event.target.value})
    }
    handleSelectedDurationNegativeHigh(event){
        this.setState( {duration_negative_high: event.target.value})
    }

    handleSelectedDurationPositiveLow(event){
        this.setState( {selected_duration_positive_low: event.target.value})
    }
    handleSelectedDurationPositiveHigh(event){
        this.setState( {selected_duration_positive_high: event.target.value})
    }

    handleSelectedAmplitudePositiveLow(event){
        this.setState( {selected_amplitude_positive_low: event.target.value})
    }
    handleSelectedAmplitudePositiveHigh(event){
        this.setState( {selected_amplitude_positive_high: event.target.value})
    }

    handleSelectedAmplitudeNegativeLow(event){
        this.setState( {selected_amplitude_negative_low: event.target.value})
    }
    handleSelectedAmplitudeNegativeHigh(event){
        this.setState( {selected_amplitude_negative_high: event.target.value})
    }

    handleSelectedAmplitudeP2PLow(event){
        this.setState( {selected_amplitude_p2p_low: event.target.value})
    }
    handleSelectedAmplitudeP2PHigh(event){
        this.setState( {selected_amplitude_p2p_high: event.target.value})
    }

    handleSelectedRemoveOutliers(event){
        this.setState( {selected_remove_outliers: event.target.value})
    }

    handleSelectedCoupling(event){
        this.setState( {selected_coupling: event.target.value})
    }

    handleChannelChange(channel_new_value){
        this.setState({channels: channel_new_value})
    }
    handleFileUsedChange(file_used_new_value){
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
                        Slow Waves
                    </Typography>
                    <Divider/>
                    <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                    <Divider/>
                    <form onSubmit={this.handleSubmit} style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
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
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="freq-sp-low-selector"
                                    value= {this.state.selected_freq_sw_low}
                                    label="Freq SW Low"
                                    size={"small"}
                                    onChange={this.handleSelectedFreqSWLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="freq-sp-high-selector"
                                    value= {this.state.selected_freq_sw_high}
                                    label="Freq SW High"
                                    size={"small"}
                                    onChange={this.handleSelectedFreqSWHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-low-selector"
                                    value= {this.state.duration_negative_low}
                                    label="Duration Negative Low"
                                    size={"small"}
                                    onChange={this.handleSelectedDurationNegativeLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-high-selector"
                                    value= {this.state.duration_negative_high}
                                    label="Duration Negative High"
                                    size={"small"}
                                    onChange={this.handleSelectedDurationNegativeHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-low-selector"
                                    value= {this.state.selected_duration_positive_low}
                                    label="Duration Positive Low"
                                    size={"small"}
                                    onChange={this.handleSelectedDurationPositiveLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-high-selector"
                                    value= {this.state.selected_duration_positive_high}
                                    label="Duration Positive High"
                                    size={"small"}
                                    onChange={this.handleSelectedDurationPositiveHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-low-selector"
                                    value= {this.state.selected_amplitude_positive_low}
                                    label="Amplitude Positive Low"
                                    size={"small"}
                                    onChange={this.handleSelectedAmplitudePositiveLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-high-selector"
                                    value= {this.state.selected_amplitude_positive_high}
                                    label="Amplitude  Positive High"
                                    size={"small"}
                                    onChange={this.handleSelectedAmplitudePositiveHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-low-selector"
                                    value= {this.state.selected_amplitude_negative_low}
                                    label="Amplitude Negative Low"
                                    size={"small"}
                                    onChange={this.handleSelectedAmplitudeNegativeLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-high-selector"
                                    value= {this.state.selected_amplitude_negative_high}
                                    label="Amplitude  Negative High"
                                    size={"small"}
                                    onChange={this.handleSelectedAmplitudeNegativeHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-low-selector"
                                    value= {this.state.selected_amplitude_p2p_low}
                                    label="Amplitude Peak to Peak Low"
                                    size={"small"}
                                    onChange={this.handleSelectedAmplitudeP2PLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, width:'90%'}}>
                            <TextField
                                    id="duration-high-selector"
                                    value= {this.state.selected_amplitude_p2p_high}
                                    label="Amplitude Peak to Peak High"
                                    size={"small"}
                                    onChange={this.handleSelectedAmplitudeP2PHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                            <InputLabel id="multi-only-label">Coupling</InputLabel>
                            <Select
                                    labelId="multi-only-label"
                                    id="multi-only-selector"
                                    value= {this.state.selected_coupling}
                                    label="Coupling"
                                    onChange={this.handleSelectedCoupling}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>

                        <hr/>
                        <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                            <InputLabel id="remove-outliers-selector-label">Remove Outliers</InputLabel>
                            <Select
                                    labelId="remove-outliers-selector-label"
                                    id="remove-outliers-selector"
                                    value= {this.state.selected_remove_outliers}
                                    label="Remove Outliers"
                                    onChange={this.handleSelectedRemoveOutliers}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>


                       <br/>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                    <ProceedButton></ProceedButton>

                </Grid>
                <Grid item xs={8} sx={{overflow:"auto"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Result Visualisation
                    </Typography>
                    <hr/>
                    {/*<Typography variant="p" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Showing first 1000 entries*/}
                    {/*</Typography>*/}
                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>
                        Slowwave Results
                    </Typography>
                    <div style={{ display: (this.state.select_signal_chart_show ? 'block' : 'none') }}><ChannelSignalSpindleSlowwaveChartCustom chart_id="singal_chart_id" chart_data={ this.state.signal_chart_data}/></div>

                    {/*<div style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}><LineMultipleColorsChartCustom chart_id="signal_chart_id" chart_data={ this.state.signal_chart_data} highlighted_areas={this.state.signal_chart_highlighted_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}/>*/}
                </Grid>
            </Grid>
        )
    }
}

export default SlowWaves;
