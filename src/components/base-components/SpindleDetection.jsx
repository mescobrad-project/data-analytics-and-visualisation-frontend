import React from 'react';
import API from "../../axiosInstance";
import "../../pages/hypothesis_testing/normality_tests.scss"

// import PropTypes from 'prop-types';
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
    Select, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import LineMultipleColorsChartCustom from "../ui-components/LineMultipleColorsChartCustom";
import InnerHTML from "dangerously-set-html-content";
import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";
import ChannelSignalSpindleSlowwaveChartCustom from "../ui-components/ChannelSignalSpindleSlowwaveChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";
// import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";

class SpindleDetection extends React.Component {
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
            selected_freq_sp_low: "12",
            selected_freq_sp_high: "15",
            selected_freq_broad_low : "1",
            selected_freq_broad_high : "30",
            selected_duration_low : "0.5",
            selected_duration_high : "2",
            selected_min_distance : "500",
            selected_thresh_rel_pow : "0.2",
            selected_thresh_corr : "0.65",
            selected_thresh_rms : "1.5",
            selected_multi_only : false,
            selected_remove_outliers : false,

            // Values to pass to visualisations
            signal_chart_data : [],
            signal_chart_highlighted_data : [],

            // Visualisation Hide/Show values
            signal_chart_show : false,
            test_chart_html: [],
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
        this.handleGetChannelSignal = this.handleGetChannelSignal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectedFreqSpLow = this.handleSelectedFreqSpLow.bind(this);
        this.handleSelectedFreqSpHigh = this.handleSelectedFreqSpHigh.bind(this);
        this.handleSelectedFreqBroadLow = this.handleSelectedFreqBroadLow.bind(this);
        this.handleSelectedFreqBroadHigh = this.handleSelectedFreqBroadHigh.bind(this);
        this.handleSelectedDurationLow = this.handleSelectedDurationLow.bind(this);
        this.handleSelectedDurationHigh = this.handleSelectedDurationHigh.bind(this);
        this.handleSelectedMinDistance = this.handleSelectedMinDistance.bind(this);
        this.handleSelectedThreshRelPow = this.handleSelectedThreshRelPow.bind(this);
        this.handleSelectedThreshRelCorr = this.handleSelectedThreshRelCorr.bind(this);
        this.handleSelectedThreshRelRms = this.handleSelectedThreshRelRms.bind(this);
        this.handleSelectedMultiOnly = this.handleSelectedMultiOnly.bind(this);
        this.handleSelectedRemoveOutliers = this.handleSelectedRemoveOutliers.bind(this);
        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleFileUsedChange = this.handleFileUsedChange.bind(this);

        // Initialise component
        // - values of channels from the backend
        // this.fetchChannels();
        // this.handleGetChannelSignal();
    }


    async handleGetChannelSignal() {
        if (this.state.selected_part_channel === "") {
            return
        }

        const params = new URLSearchParams(window.location.search);

        API.get("return_signal",
                {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        input_name: this.state.selected_part_channel,
                        // params: {input_name: this.state.selected_channel,
                    }
                }
        ).then(res => {
            const resultJson = res.data;
            // console.log("resultJson.figure")
            // console.log(resultJson.figure)
            // this.setState({"test_chart_html": resultJson.figure})

            // const resultJson = res.data;
            // console.log(res.data)
            // console.log("ORIGINAL LENGTH")
            // console.log(resultJson.signal.length)
            // this.setState({signal_original_start_seconds: resultJson.start_date_time});
            //
            // let temp_array_signal = []
            // for (let it = 0; it < resultJson.signal.length; it++) {
            //     let temp_object = {}
            //     let adjusted_time = ""
            //     // First entry is 0 so no need to add any milliseconds
            //     // Time added is as millisecond/100 so we multiply by 1000
            //     if (it === 0) {
            //         adjusted_time = resultJson.start_date_time
            //     } else {
            //         adjusted_time = resultJson.start_date_time + resultJson.signal_time[it] * 1000
            //     }
            //
            //     let temp_date = new Date(adjusted_time)
            //     temp_object["date"] = temp_date
            //     temp_object["yValue"] = resultJson.signal[it]
            //     //TODO
            //     if(it > 12579 && it <12793){
            //         temp_object["color"] = "red"
            //     }else{
            //         temp_object["color"] = "blue"
            //     }
            //
            //     temp_array_signal.push(temp_object)
            // }
            //
            // this.setState({signal_chart_data: temp_array_signal})
            // this.setState({select_signal_chart_show: true});
        });
    }
    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        let to_send_input_freq_sp_low = null;     //float
        let to_send_input_freq_sp_high = null;     //float
        let to_send_input_freq_broad_low = null;     //float
        let to_send_input_freq_broad_high = null;     //float
        let to_send_input_duration_low = null;     //float
        let to_send_input_duration_high = null;     //float
        let to_send_input_min_distance = null;     //float
        let to_send_input_thresh_rel_pow = null;     //float
        let to_send_input_thresh_corr = null;     //float
        let to_send_input_thresh_rms = null;     //float

        // let to_send_input_verbose = null;  //bool|str|int

        if (!!this.state.selected_freq_sp_low){
            to_send_input_freq_sp_low = parseFloat(this.state.selected_freq_sp_low)
        }

        if (!!this.state.selected_freq_sp_high){
            to_send_input_freq_sp_high = parseFloat(this.state.selected_freq_sp_high)
        }

        if (!!this.state.selected_freq_broad_low){
            to_send_input_freq_broad_low = parseFloat(this.state.selected_freq_broad_low)
        }

        if (!!this.state.selected_freq_broad_high){
            to_send_input_freq_broad_high = parseFloat(this.state.selected_freq_broad_high)
        }

        if (!!this.state.selected_duration_low){
            to_send_input_duration_low = parseFloat(this.state.selected_duration_low)
        }

        if (!!this.state.selected_duration_high){
            to_send_input_duration_high = parseFloat(this.state.selected_duration_high)
        }

        if (!!this.state.selected_min_distance){
            to_send_input_min_distance = parseInt(this.state.selected_min_distance)
        }

        if (!!this.state.selected_thresh_rel_pow){
            to_send_input_thresh_rel_pow = parseFloat(this.state.selected_thresh_rel_pow)
        }

        if (!!this.state.selected_thresh_corr){
            to_send_input_thresh_corr = parseFloat(this.state.selected_thresh_corr)
        }

        if (!!this.state.selected_thresh_rms){
            to_send_input_thresh_rms = parseFloat(this.state.selected_thresh_rms)
        }

        // Send the request
        API.get("spindles_detection",
                {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        name: this.state.selected_channel,
                        freq_sp_low: to_send_input_freq_sp_low,
                        freq_sp_high: to_send_input_freq_sp_high,
                        freq_broad_low: to_send_input_freq_broad_low,
                        freq_broad_high: to_send_input_freq_broad_high,
                        duration_low: to_send_input_duration_low,
                        duration_high: to_send_input_duration_high,
                        min_distance: to_send_input_min_distance,
                        rel_pow: to_send_input_thresh_rel_pow,
                        corr: to_send_input_thresh_corr,
                        rms: to_send_input_thresh_rms,
                        multi_only: this.state.multi_only,
                        remove_outliers: this.state.remove_outliers,
                        file_used: this.state.file_used
                    }
                }
        ).then(res => {
            const resultJson = res.data;
            console.log("--- Results ---")
            console.log(resultJson)

            console.log("resultJson.figure")
            console.log(resultJson.figure)
            this.setState({"test_chart_html": resultJson.figure})

            // Send the request
            API.get("save_annotation_to_file",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                            step_id: params.get("step_id"),
                            name: this.state.selected_channel,
                            annotations_to_add: "",
                            file_used: this.state.file_used
                        }
                    }
            ).then(res => {
                console.log(res.data)
                console.log("ANNOTATED")
            })
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }
    handleSelectedFreqSpLow(event){
        this.setState( {selected_freq_sp_low: event.target.value})
    }
    handleSelectedFreqSpHigh(event){
        this.setState( {selected_freq_sp_high: event.target.value})
    }
    handleSelectedFreqBroadLow(event){
        this.setState( {selected_freq_broad_low: event.target.value})
    }
    handleSelectedFreqBroadHigh(event){
        this.setState( {selected_freq_broad_high: event.target.value})
    }
    handleSelectedDurationLow(event){
        this.setState( {selected_duration_low: event.target.value})
    }
    handleSelectedDurationHigh(event){
        this.setState( {selected_duration_high: event.target.value})
    }
    handleSelectedMinDistance(event){
        this.setState( {selected_min_distance: event.target.value})
    }
    handleSelectedThreshRelPow(event){
        this.setState( {selected_thresh_rel_pow: event.target.value})
    }
    handleSelectedThreshRelCorr(event){
        this.setState( {selected_thresh_corr: event.target.value})
    }
    handleSelectedThreshRelRms(event){
            this.setState( {selected_thresh_rms: event.target.value})
    }
    handleSelectedMultiOnly(event){
            this.setState( {selected_multi_only: event.target.value})
    }
    handleSelectedRemoveOutliers(event){
            this.setState( {selected_remove_outliers: event.target.value})
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
                <Grid item xs={4}  sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Spindle Detection
                    </Typography>
                    <Divider/>
                    <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                    <form onSubmit={this.handleSubmit} style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>
                        <FormControl sx={{m: 1,  width:'90%'}} size={"small"}>
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
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="freq-sp-low-selector"
                                    value= {this.state.selected_freq_sp_low}
                                    label="Freq Sp Low"
                                    size={"small"}
                                    onChange={this.handleSelectedFreqSpLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="freq-sp-high-selector"
                                    value= {this.state.selected_freq_sp_high}
                                    label="Freq Sp High"
                                    size={"small"}
                                    onChange={this.handleSelectedFreqSpHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="freq-broad-low-selector"
                                    value= {this.state.selected_freq_broad_low}
                                    label="Freq Broad Low"
                                    size={"small"}
                                    onChange={this.handleSelectedFreqBroadLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="freq-broad-high-selector"
                                    value= {this.state.selected_freq_broad_high}
                                    label="Freq Broad High"
                                    size={"small"}
                                    onChange={this.handleSelectedFreqBroadHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="duration-low-selector"
                                    value= {this.state.selected_duration_low}
                                    label="Duration Low"
                                    size={"small"}
                                    onChange={this.handleSelectedDurationLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="duration-high-selector"
                                    value= {this.state.selected_duration_high}
                                    label="Duration High"
                                    size={"small"}
                                    onChange={this.handleSelectedDurationHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="min-distance-selector"
                                    value= {this.state.selected_min_distance}
                                    label="Min Distance"
                                    size={"small"}
                                    onChange={this.handleSelectedMinDistance}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="thresh-rel-pow-selector"
                                    value= {this.state.selected_thresh_rel_pow}
                                    label="Threshold Rel Pow"
                                    size={"small"}
                                    onChange={this.handleSelectedThreshRelPow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="thresh-corr-selector"
                                    value= {this.state.selected_thresh_corr}
                                    label="Thresh Corr"
                                    size={"small"}
                                    onChange={this.handleSelectedThreshRelCorr}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <TextField
                                    id="thresh-rms-selector"
                                    value= {this.state.selected_thresh_rms}
                                    label="Thresh rms"
                                    size={"small"}
                                    onChange={this.handleSelectedThreshRelRms}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1,  width:'90%'}}>
                            <InputLabel id="multi-only-label">Multi Only</InputLabel>
                            <Select
                                    labelId="multi-only-label"
                                    id="multi-only-selector"
                                    value= {this.state.selected_multi_only}
                                    label="Multi Only"
                                    size={"small"}
                                    onChange={this.handleSelectedMultiOnly}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1,  width:'90%'}} size={"small"}>
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
                {/*<Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>*/}
                {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        Spindle Detection*/}
                {/*    </Typography>*/}
                {/*  <Divider/>*/}
                {/*</Grid>*/}
                <Grid item xs={8} sx={{overflow:"auto"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Result Visualisation
                    </Typography>
                    <hr class="result"/>
                    {/*<Typography variant="p" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Showing first 1000 entries*/}
                    {/*</Typography>*/}
                    <Typography variant="h6" sx={{ flexGrow: 1,   }} noWrap>
                        Spindle Results
                    </Typography>
                    <InnerHTML html={this.state.test_chart_html} style={{zoom:'50%'}} />
                    {/*<div style={{ display: (this.state.select_signal_chart_show ? 'block' : 'none') }}><ChannelSignalSpindleSlowwaveChartCustom chart_id="singal_chart_id" chart_data={ this.state.signal_chart_data}/></div>*/}

                    {/*<div style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}><LineMultipleColorsChartCustom chart_id="signal_chart_id" chart_data={ this.state.signal_chart_data} highlighted_areas={this.state.signal_chart_highlighted_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}/>*/}
                </Grid>
            </Grid>
        )
    }
}

export default SpindleDetection;
