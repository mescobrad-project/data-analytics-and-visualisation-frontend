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
import LineMultipleColorsChartCustom from "../ui-components/LineMultipleColorsChartCustom";
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
        API.get("return_spindles_detection",
            {
                params: {input_name: this.state.selected_channel,
                    input_freq_sp_low: to_send_input_freq_sp_low,
                    input_freq_sp_high: to_send_input_freq_sp_high,
                    input_freq_broad_low: to_send_input_freq_broad_low,
                    input_freq_broad_high: to_send_input_freq_broad_high,
                    input_duration_low: to_send_input_duration_low,
                    input_duration_high: to_send_input_duration_high,
                    input_min_distance: to_send_input_min_distance,
                    input_thresh_rel_pow: to_send_input_thresh_rel_pow,
                    input_thresh_corr: to_send_input_thresh_corr,
                    input_thresh_rms: to_send_input_thresh_rms,
                    input_multi_only: this.state.selected_multi_only,
                    input_remove_outliers: this.state.selected_remove_outliers
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
                        Spindle Detection
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
                                    id="freq-sp-low-selector"
                                    value= {this.state.selected_freq_sp_low}
                                    label="Freq Sp Low"
                                    onChange={this.handleSelectedFreqSpLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="freq-sp-high-selector"
                                    value= {this.state.selected_freq_sp_high}
                                    label="Freq Sp High"
                                    onChange={this.handleSelectedFreqSpHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="freq-broad-low-selector"
                                    value= {this.state.selected_freq_broad_low}
                                    label="Freq Broad Low"
                                    onChange={this.handleSelectedFreqBroadLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="freq-broad-high-selector"
                                    value= {this.state.selected_freq_broad_high}
                                    label="Freq Broad High"
                                    onChange={this.handleSelectedFreqBroadHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="duration-low-selector"
                                    value= {this.state.selected_duration_low}
                                    label="Duration Low"
                                    onChange={this.handleSelectedDurationLow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="duration-high-selector"
                                    value= {this.state.selected_duration_high}
                                    label="Duration High"
                                    onChange={this.handleSelectedDurationHigh}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="min-distance-selector"
                                    value= {this.state.selected_min_distance}
                                    label="Min Distance"
                                    onChange={this.handleSelectedMinDistance}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="thresh-rel-pow-selector"
                                    value= {this.state.selected_thresh_rel_pow}
                                    label="Threshold Rel Pow"
                                    onChange={this.handleSelectedThreshRelPow}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="thresh-corr-selector"
                                    value= {this.state.selected_thresh_corr}
                                    label="Thresh Corr"
                                    onChange={this.handleSelectedThreshRelCorr}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="thresh-rms-selector"
                                    value= {this.state.selected_thresh_rms}
                                    label="Thresh rms"
                                    onChange={this.handleSelectedThreshRelRms}
                            />
                            <FormHelperText>  </FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="multi-only-label">Multi Only</InputLabel>
                            <Select
                                    labelId="multi-only-label"
                                    id="multi-only-selector"
                                    value= {this.state.selected_multi_only}
                                    label="Multi Only"
                                    onChange={this.handleSelectedMultiOnly}
                            >
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em>False</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
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
                </Grid>
                <Grid item xs={5} sx={{overflow:"auto"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Result Visualisation
                    </Typography>
                    <hr/>
                    {/*<Typography variant="p" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Showing first 1000 entries*/}
                    {/*</Typography>*/}
                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.psd_chart_show ? 'block' : 'none')  }} noWrap>
                        Welch Results
                    </Typography>

                    <div style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}><LineMultipleColorsChartCustom chart_id="signal_chart_id" chart_data={ this.state.signal_chart_data} highlighted_areas={this.state.signal_chart_highlighted_data}/></div>
                    <hr style={{ display: (this.state.signal_chart_show ? 'block' : 'none') }}/>
                </Grid>
            </Grid>
        )
    }
}

export default SpindleDetection;
