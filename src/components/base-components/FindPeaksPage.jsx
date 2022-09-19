import React from 'react';
import API from "../../axiosInstance";
// import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
import {
    Breadcrumbs,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel, Link,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, TextField, Typography
} from "@mui/material";

import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";

class FindPeaksPage extends React.Component {
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
            selected_height_type: "none",
            selected_height_1: "",
            selected_height_2: "",
            selected_threshold_type: "none",
            selected_threshold_1: "",
            selected_threshold_2: "",
            selected_distance: "",
            selected_prominence_type: "none",
            selected_prominence_1: "",
            selected_prominence_2: "",
            selected_width_type: "none",
            selected_width_1: "",
            selected_width_2: "",
            selected_wlen: "",
            selected_rel_height: "",
            selected_plateau_size_type: "none",
            selected_plateau_size_1: "",
            selected_plateau_size_2: "",

            //TEST
            test_chart_html:"",

            // Values to pass to visualisations
            peak_chart_data : [],
            peaks_length : 0,
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
        this.handleSelectHeightTypeChange = this.handleSelectHeightTypeChange.bind(this);
        this.handleSelectHeight1Change = this.handleSelectHeight1Change.bind(this);
        this.handleSelectHeight2Change = this.handleSelectHeight2Change.bind(this);
        this.handleSelectThresholdTypeChange = this.handleSelectThresholdTypeChange.bind(this);
        this.handleSelectThreshold1Change = this.handleSelectThreshold1Change.bind(this);
        this.handleSelectThreshold2Change = this.handleSelectThreshold2Change.bind(this);
        this.handleSelectDistanceChange = this.handleSelectDistanceChange.bind(this);
        this.handleSelectProminenceTypeChange = this.handleSelectProminenceTypeChange.bind(this);
        this.handleSelectProminence1Change = this.handleSelectProminence1Change.bind(this);
        this.handleSelectProminence2Change = this.handleSelectProminence2Change.bind(this);
        this.handleSelectWidthTypeChange = this.handleSelectWidthTypeChange.bind(this);
        this.handleSelectWidth1Change = this.handleSelectWidth1Change.bind(this);
        this.handleSelectWidth2Change = this.handleSelectWidth2Change.bind(this);
        this.handleSelectWlenChange = this.handleSelectWlenChange.bind(this);
        this.handleSelectRelHeightChange = this.handleSelectRelHeightChange.bind(this);
        this.handleSelectPlateauSizeTypeChange = this.handleSelectPlateauSizeTypeChange.bind(this);
        this.handleSelectPlateauSize1Change = this.handleSelectPlateauSize1Change.bind(this);
        this.handleSelectPlateauSize2Change = this.handleSelectPlateauSize2Change.bind(this);

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
        let to_send_input_height = null;     //number or array[number,number]
        let to_send_input_threshold = null;  //number or array[number,number]
        let to_send_input_distance = null;   //number
        let to_send_input_prominence = null; //number or array[number,number]
        let to_send_input_width = null;      //number or array[number,number]
        let to_send_input_wlen = null;       //int
        let to_send_input_rel_height = null; //float
        let to_send_input_plateau = null;    //number or array[number,number]

        if (!!this.state.selected_distance){
            to_send_input_distance = parseInt(this.state.selected_distance)
        }

        if (!!this.state.selected_wlen){
            to_send_input_wlen = parseInt(this.state.selected_wlen)
        }

        if (!!this.state.selected_rel_height){
            to_send_input_rel_height = parseFloat(this.state.selected_rel_height)
        }

        // MISSING SETTING VALUE AS INFINITY
        if (this.state.selected_height_type !== "none"){
            if(this.state.selected_height_type === "min"){
                to_send_input_height = parseFloat(this.state.selected_height_1)
            }else if(this.state.selected_height_type === "min-max"){
                to_send_input_height = JSON.stringify([parseFloat(this.state.selected_height_1) , parseFloat(this.state.selected_height_2)])
            }
        }

        if (this.state.selected_threshold_type !== "none"){
            if(this.state.selected_threshold_type === "min"){
                to_send_input_threshold = parseFloat(this.state.selected_threshold_1)
            }else if(this.state.selected_threshold_type === "min-max"){
                to_send_input_threshold = [parseFloat(this.state.selected_threshold_1) , parseFloat(this.state.selected_threshold_2)]
            }
        }

        if (this.state.selected_prominence_type !== "none"){
            if(this.state.selected_prominence_type === "min"){
                to_send_input_prominence = parseFloat(this.state.selected_prominence_1)
            }else if(this.state.selected_prominence_type === "min-max"){
                to_send_input_prominence = [parseFloat(this.state.selected_prominence_1) , parseFloat(this.state.selected_prominence_2)]
            }
        }

        if (this.state.selected_width_type !== "none"){
            if(this.state.selected_width_type === "min"){
                to_send_input_width = parseFloat(this.state.selected_width_1)
            }else if(this.state.selected_width_type === "min-max"){
                to_send_input_width = [parseFloat(this.state.selected_width_1) , parseFloat(this.state.selected_width_2)]
            }
        }

        if (this.state.selected_plateau_size_type !== "none"){
            if(this.state.selected_plateau_size_type === "min"){
                to_send_input_plateau = parseFloat(this.state.selected_plateau_size_1)
            }else if(this.state.selected_plateau_size_type === "min-max"){
                to_send_input_plateau = [parseFloat(this.state.selected_plateau_size_1) , parseFloat(this.state.selected_plateau_size_2)]
            }
        }

        //Reset view of optional visualisations preview
        this.setState({peak_chart_show: false})


        // Set flags for optional data that need to be shown since if this check is done after results have arrived, maybe the
        // data has already been changed and the wrong visualisation will be shown
        // let flag_alpha = false;

        // If alpha is enabled, enable relevant visualisations
        // if(to_send_input_alpha){
        //     flag_alpha = true;
        // }

        console.log("--------")
        console.log(to_send_input_height)
        // Send the request
        API.get("return_peaks",
            {
                params: {input_name: this.state.selected_channel,
                        input_height: to_send_input_height,
                        input_threshold:to_send_input_threshold ,
                        input_distance: to_send_input_distance,
                        input_prominence: to_send_input_prominence,
                        input_width: to_send_input_width,
                        input_wlen: to_send_input_wlen,
                        input_rel_height: to_send_input_rel_height,
                        input_plateau: to_send_input_plateau
                }
            }
        ).then(res => {
            const resultJson = res.data;
            this.setState({test_chart_html: resultJson.figure})
            // Show only relevant visualisations and load their data
            // Correlation chart always has results so should always be enabled
            // this.setState({correlation_results: resultJson.values_partial_autocorrelation})
            //
            let temp_array_peaks = []
            let peak_it = 0;

            // Set number of peak detected to be shown to the user
            this.setState({peaks_length: resultJson.peaks.length})
            for ( let it =0 ; it < resultJson.signal.length; it++){
                let temp_object = {}
                temp_object["category"] = it
                let adjusted_time = ""

                // First entry is 0 so no need to add any milliseconds
                // Time added is as millisecond/100 so we multiply by 10000
                if(it === 0){
                    adjusted_time = resultJson.start_date_time
                }else{
                    adjusted_time = resultJson.start_date_time + resultJson.signal_time[it]*10000
                }

                let temp_date = new Date(adjusted_time )
                temp_object["date"] = temp_date
                temp_object["yValue"] = resultJson.signal[it]

                // Only show bullets for the entries that have them
                // Colours can also be added but are currently commented to avoid issues with scaling and graph not even laoding
                if(resultJson.peaks[peak_it] === it){
                    temp_object["show_peak"] = false
                    // temp_object["color"] = "red"

                    //Increase the iterator to the next detected peak
                    peak_it++;
                }else{
                    temp_object["show_peak"] = true
                    // temp_object["color"] = "blue"
                }

                temp_array_peaks.push(temp_object)
            }

            this.setState({peak_chart_data: temp_array_peaks})
            this.setState({peak_chart_show: true});
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }
    handleSelectHeightTypeChange(event){
        this.setState( {selected_height_type: event.target.value})
    }
    handleSelectHeight1Change(event){
        this.setState( {selected_height_1: event.target.value})
    }
    handleSelectHeight2Change(event){
        this.setState( {selected_height_2: event.target.value})
    }
    handleSelectThresholdTypeChange(event){
        this.setState( {selected_threshold_type: event.target.value})
    }
    handleSelectThreshold1Change(event){
        this.setState( {selected_threshold_1: event.target.value})
    }
    handleSelectThreshold2Change(event){
        this.setState( {selected_threshold_2: event.target.value})
    }
    handleSelectDistanceChange(event){
        this.setState( {selected_distance: event.target.value})
    }
    handleSelectProminenceTypeChange(event){
        this.setState( {selected_prominence_type: event.target.value})
    }
    handleSelectProminence1Change(event){
        this.setState( {selected_prominence_1: event.target.value})
    }
    handleSelectProminence2Change(event){
        this.setState( {selected_prominence_2: event.target.value})
    }
    handleSelectWidthTypeChange(event){
        this.setState( {selected_width_type: event.target.value})
    }
    handleSelectWidth1Change(event){
        this.setState( {selected_width_1: event.target.value})
    }
    handleSelectWidth2Change(event){
        this.setState( {selected_width_2: event.target.value})
    }
    handleSelectWlenChange(event){
        this.setState( {selected_wlen: event.target.value})
    }
    handleSelectRelHeightChange(event){
        this.setState( {selected_rel_height: event.target.value})
    }
    handleSelectPlateauSizeTypeChange(event){
        this.setState( {selected_plateau_size_type: event.target.value})
    }
    handleSelectPlateauSize1Change(event){
        this.setState( {selected_plateau_size_1: event.target.value})
    }
    handleSelectPlateauSize2Change(event){
        this.setState( {selected_plateau_size_2: event.target.value})
    }


    render() {
        return (
            <Grid container direction="row">
                <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                    {/*<Breadcrumbs separator="›" aria-label="breadcrumb">*/}
                    {/*    <Link underline="hover" key="1" color="inherit" href="/" >*/}
                    {/*        EEG Preprocessing*/}
                    {/*    </Link>,*/}
                    {/*    <Typography key="2" color="text.primary">*/}
                    {/*        Find Peaks*/}
                    {/*    </Typography>,*/}
                    {/*</Breadcrumbs>*/}
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
                            <InputLabel id="height-type-selector-label">Height Input Type</InputLabel>
                            <Select
                                    labelId="height-type-selector-label"
                                    id="height-type-selector"
                                    value= {this.state.selected_height_type}
                                    label="Height Type"
                                    onChange={this.handleSelectHeightTypeChange}
                            >
                                <MenuItem value={"none"}><em>No specific </em></MenuItem>
                                <MenuItem value={"min"}><em>Minimum </em></MenuItem>
                                <MenuItem value={"min-max"}><em> Minimum and Maximum</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_height_type !== "none" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type isn't none */}
                            <TextField
                                    id="height-1-selector"
                                    value= {this.state.selected_height_1}
                                    label="Height Min"
                                    onChange={this.handleSelectHeight1Change}
                            />
                            <FormHelperText> The minimum number</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_height_type === "min-max" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type reqruies both fields */}
                            <TextField
                                    id="height-2-selector"
                                    value= {this.state.selected_height_2}
                                    label="Height Max"
                                    onChange={this.handleSelectHeight2Change}
                            />
                            <FormHelperText> The maximum number</FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="threshold-type-selector-label">Threshold Input Type</InputLabel>
                            <Select
                                    labelId="threshold-type-selector-label"
                                    id="threshold-type-selector"
                                    value= {this.state.selected_threshold_type}
                                    label="Threshold Type"
                                    onChange={this.handleSelectThresholdTypeChange}
                            >
                                <MenuItem value={"none"}><em>No specific </em></MenuItem>
                                <MenuItem value={"min"}><em>Minimum </em></MenuItem>
                                <MenuItem value={"min-max"}><em> Minimum and Maximum</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_threshold_type !== "none" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type isn't none */}
                            <TextField
                                    id="threshold-1-selector"
                                    value= {this.state.selected_threshold_1}
                                    label="Threshold Min"
                                    onChange={this.handleSelectThreshold1Change}
                            />
                            <FormHelperText> The minimum number</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_threshold_type === "min-max" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type reqruies both fields */}
                            <TextField
                                    id="threshold-2-selector"
                                    value= {this.state.selected_threshold_2}
                                    label="Threshold Max"
                                    onChange={this.handleSelectThreshold2Change}
                            />
                            <FormHelperText> The maximum number</FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="prominence-type-selector-label">Prominence Input Type</InputLabel>
                            <Select
                                    labelId="prominence-type-selector-label"
                                    id="prominence-type-selector"
                                    value= {this.state.selected_prominence_type}
                                    label="Prominence Type"
                                    onChange={this.handleSelectProminenceTypeChange}
                            >
                                <MenuItem value={"none"}><em>No specific </em></MenuItem>
                                <MenuItem value={"min"}><em>Minimum </em></MenuItem>
                                <MenuItem value={"min-max"}><em> Minimum and Maximum</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_prominence_type !== "none" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type isn't none */}
                            <TextField
                                    id="prominence-1-selector"
                                    value= {this.state.selected_prominence_1}
                                    label="Prominence Min"
                                    onChange={this.handleSelectProminence1Change}
                            />
                            <FormHelperText> The minimum number</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_prominence_type === "min-max" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type reqruies both fields */}
                            <TextField
                                    id="prominence-2-selector"
                                    value= {this.state.selected_prominence_2}
                                    label="Prominence Max"
                                    onChange={this.handleSelectProminence2Change}
                            />
                            <FormHelperText> The maximum number</FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="width-type-selector-label">Width Input Type</InputLabel>
                            <Select
                                    labelId="width-type-selector-label"
                                    id="width-type-selector"
                                    value= {this.state.selected_width_type}
                                    label="Width Type"
                                    onChange={this.handleSelectWidthTypeChange}
                            >
                                <MenuItem value={"none"}><em>No specific </em></MenuItem>
                                <MenuItem value={"min"}><em>Minimum </em></MenuItem>
                                <MenuItem value={"min-max"}><em> Minimum and Maximum</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_width_type !== "none" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type isn't none */}
                            <TextField
                                    id="width-1-selector"
                                    value= {this.state.selected_width_1}
                                    label="Width Min"
                                    onChange={this.handleSelectWidth1Change}
                            />
                            <FormHelperText> The minimum number</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_width_type === "min-max" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type reqruies both fields */}
                            <TextField
                                    id="width-2-selector"
                                    value= {this.state.selected_width_2}
                                    label="Width Max"
                                    onChange={this.handleSelectWidth2Change}
                            />
                            <FormHelperText> The maximum number</FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="plateau-size-type-selector-label">Plateau size Input Type</InputLabel>
                            <Select
                                    labelId="plateau-size-type-selector-label"
                                    id="plateau-size-type-selector"
                                    value= {this.state.selected_plateau_size_type}
                                    label="Plateau Size Type"
                                    onChange={this.handleSelectPlateauSizeTypeChange}
                            >
                                <MenuItem value={"none"}><em>No specific </em></MenuItem>
                                <MenuItem value={"min"}><em>Minimum </em></MenuItem>
                                <MenuItem value={"min-max"}><em> Minimum and Maximum</em></MenuItem>
                            </Select>
                            <FormHelperText> </FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_plateau_size_type !== "none" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type isn't none */}
                            <TextField
                                    id="plateau-size-1-selector"
                                    value= {this.state.selected_plateau_size_1}
                                    label="Width Min"
                                    onChange={this.handleSelectPlateauSize1Change}
                            />
                            <FormHelperText> The minimum number</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_plateau_size_type === "min-max" ? 'block' : 'none')  }}>
                            {/* This field currently appears if the type reqruies both fields */}
                            <TextField
                                    id="plateau-size-2-selector"
                                    value= {this.state.selected_plateau_size_2}
                                    label="Width Max"
                                    onChange={this.handleSelectPlateauSize2Change}
                            />
                            <FormHelperText> The maximum number</FormHelperText>
                        </FormControl>
                        <hr/>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="distance-selector"
                                    value= {this.state.selected_distance}
                                    label="Distance"
                                    onChange={this.handleSelectDistanceChange}
                            />
                            <FormHelperText> The Distance (Number not int)</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="wLen-selector"
                                    value= {this.state.selected_wlen}
                                    label="WLen"
                                    onChange={this.handleSelectWlenChange}
                            />
                            <FormHelperText> The WLen (int)</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="rel-height-selector"
                                    value= {this.state.selected_rel_height}
                                    label="Rel Height"
                                    onChange={this.handleSelectRelHeightChange}
                            />
                            <FormHelperText> The Rel height (float)</FormHelperText>
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
                    {/* Alternative way to delvier graphs left here for alternatives */}
                    {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peak_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Peaks*/}
                    {/*</Typography>*/}
                    {/*<InnerHTML html={this.state.test_chart_html} />*/}


                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peak_chart_show ? 'block' : 'none')  }} noWrap>
                        Peaks
                    </Typography>
                    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center", display: (this.state.peak_chart_show ? 'block' : 'none') }} >
                        Peaks in graph: {this.state.peaks_length}
                    </Typography>
                    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center", display: (this.state.peak_chart_show ? 'block' : 'none') }} >
                        If no peaks are apparent in the graph but the counter mentions more, there are probably too many to be displayed.
                        Zoom in to see them.
                    </Typography>
                    <div style={{ display: (this.state.peak_chart_show ? 'block' : 'none') }}><ChannelSignalPeaksChartCustom chart_id="peak_chart_id" chart_data={ this.state.peak_chart_data}/></div>
                </Grid>
            </Grid>
        )
    }
}

export default FindPeaksPage;
