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

class FiltersFunctionPage extends React.Component {
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
            selected_btype: "lowpass",
            selected_analog: false,
            selected_fs: "",
            selected_output: "ba",
            selected_cutoff_1: "",
            selected_cutoff_2: "",
            selected_order: "5",
            selected_worn: "",
            selected_whole: false,
            selected_fs_freq: "",
            // old
            // selected_alpha: "",
            // selected_nlags: "",

            // Values to pass to visualisations
            frequency_h_chart_data : [],
            frequency_w_chart_data : [],
            filter_chart_data : [],

            // Visualisation Hide/Show values
            frequency_h_chart_show : false,
            frequency_w_chart_show : false,
            filter_chart_show : false,
        };

        //Binding functions of the class
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectBTypeChange = this.handleSelectBTypeChange.bind(this);
        this.handleSelectAnalogChange = this.handleSelectAnalogChange.bind(this);
        this.handleSelectFsChange = this.handleSelectFsChange.bind(this);
        this.handleSelectOutputChange = this.handleSelectOutputChange.bind(this);
        this.handleSelectCutoff1Change = this.handleSelectCutoff1Change.bind(this);
        this.handleSelectCutoff2Change = this.handleSelectCutoff2Change.bind(this);
        this.handleSelectOrderChange = this.handleSelectOrderChange.bind(this);
        this.handleSelectWornChange = this.handleSelectWornChange.bind(this);
        this.handleSelectWholeChange = this.handleSelectWholeChange.bind(this);
        this.handleSelectFsFreqChange = this.handleSelectFsFreqChange.bind(this);
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
        let to_send_input_cutoff_1 = null;
        let to_send_input_cutoff_2 = null;
        let to_send_input_fs = null;
        let to_send_input_order = null;
        let to_send_input_worn = null;
        let to_send_input_fs_freq = null;

        if (!!this.state.selected_cutoff_1){
            to_send_input_cutoff_1 = parseInt(this.state.selected_cutoff_1)
        }

        if (!!this.state.selected_cutoff_2){
            to_send_input_cutoff_2 = parseInt(this.state.selected_cutoff_2)
        }

        if (!!this.state.selected_fs){
            to_send_input_fs = parseFloat(this.state.selected_fs)
        }

        if (!!this.state.selected_order){
            to_send_input_order = parseInt(this.state.selected_order)
        }

        if (!!this.state.selected_worn){
            to_send_input_worn = parseInt(this.state.selected_worn)
        }
        if (!!this.state.selected_fs_freq){
            to_send_input_fs_freq = parseInt(this.state.selected_fs_freq)
        }

        //Reset view of optional visualisations preview
        // this.setState({correlation_chart_show: false})
        this.setState({frequency_w_chart_show: false})
        this.setState({filter_chart_show: false})

        // Set flags for optional data that need to be shown since if this check is done after results have arrived, maybe the
        // data has already been changed and the wrong visualisation will be shown
        // Only zpk has less visualisation for now
        let flag_output = this.state.selected_output;

        // Send the request
        console.log("---------------------------")
        console.log(this.state.selected_channel)
        console.log(this.state.selected_cutoff_1)
        console.log(this.state.selected_cutoff_2)
        console.log(to_send_input_fs)
        console.log(this.state.selected_analog)
        console.log(this.state.selected_btype)
        console.log(this.state.selected_output)
        console.log(to_send_input_worn)
        console.log(this.state.selected_whole)
        console.log(to_send_input_fs_freq)
        console.log("---------------------------")
        API.get("return_filters",
            {
                params: {input_name: this.state.selected_channel,
                    input_cutoff_1: to_send_input_cutoff_1,
                    input_cutoff_2: to_send_input_cutoff_2,
                    input_order: to_send_input_order,
                    input_fs: to_send_input_fs,
                    input_analog: this.state.selected_analog,
                    input_btype: this.state.selected_btype,
                    input_output: this.state.selected_output,
                    input_worn: to_send_input_worn,
                    input_whole: this.state.selected_whole,
                    input_fs_freq: to_send_input_fs_freq
                }
            }
        ).then(res => {
            const resultJson = res.data;
            console.log("resultJson")
            console.log(resultJson)

            // Show only relevant visualisations and load their data
            // frequnecy chart always has results so should always be enabled

            let temp_array_frequency = []
            for ( let it =0 ; it < resultJson.frequency_w.length; it++){
                let temp_object = {}
                temp_object["category"] = it
                temp_object["yValue"] = resultJson.frequency_w[it]
                temp_array_frequency.push(temp_object)
            }
            // console.log("")
            // console.log(temp_array)


            this.setState({frequency_w_chart_data: temp_array_frequency})
            this.setState({frequency_w_chart_show: true})

            // Filter optional charts
            if(flag_output != "zpk"){
                let temp_array_filter = []
                for ( let it =0 ; it < resultJson.filter.length; it++){
                    if(it > 1000){
                        break;
                    }
                    let temp_object = {}
                    temp_object["category"] = it
                    temp_object["yValue"] = resultJson.filter[it]
                    temp_array_filter.push(temp_object)
                }

                this.setState({filter_chart_data: temp_array_filter})
                this.setState({filter_chart_show: true});
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
    handleSelectBTypeChange(event){
        this.setState( {selected_btype: event.target.value})
        this.setState( {selected_cutoff_2: ""})
    }
    handleSelectAnalogChange(event){
        this.setState( {selected_analog: event.target.value})
    }
    handleSelectFsChange(event){
        this.setState( {selected_fs: event.target.value})
    }
    handleSelectOutputChange(event){
        this.setState( {selected_output: event.target.value})
        this.setState( {selected_whole: false})
        this.setState( {selected_fs_freq: ""})
    }
    handleSelectCutoff1Change(event){
        this.setState( {selected_cutoff_1: event.target.value})
    }
    handleSelectCutoff2Change(event){
        this.setState( {selected_cutoff_2: event.target.value})
    }
    handleSelectWornChange(event){
        this.setState( {selected_worn: event.target.value})
    }
    handleSelectWholeChange(event){
        this.setState( {selected_whole: event.target.value})
    }
    handleSelectFsFreqChange(event){
        this.setState( {selected_fs_freq: event.target.value})
    }
    handleSelectOrderChange(event){
        this.setState( {selected_order: event.target.value})
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
                        Partial AutoCorrelation Parameterisation
                    </Typography>
                    <hr/>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                        Step 1:
                    </Typography>
                    <form onSubmit={this.handleSubmit}>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="channel-selector-label">Channel</InputLabel>
                            <Select
                                required
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
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="btype-selector-label">Btype</InputLabel>
                            <Select
                                required
                                labelId="btype-selector-label"
                                id="btype-selector"
                                value= {this.state.selected_btype}
                                label="BType"
                                onChange={this.handleSelectBTypeChange}
                            >
                                {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                <MenuItem value={"lowpass"}><em>Lowpass</em></MenuItem>
                                <MenuItem value={"highpass"}><em> Highpass</em></MenuItem>
                                <MenuItem value={"bandpass"}><em>Bandpass</em></MenuItem>
                                <MenuItem value={"bandstop"}><em>Bandstop</em></MenuItem>
                            </Select>
                            <FormHelperText>The type of filter</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    required
                                    id="order-selector"
                                    value= {this.state.selected_fs}
                                    label="FS"
                                    onChange={this.handleSelectFsChange}
                            />
                            <FormHelperText>The sampling frequency of the digital sytem, float, FS should have more than double the value from cutoff</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    required
                                    id="cutoff-1-selector"
                                    value= {this.state.selected_cutoff_1}
                                    label="Cutoff"
                                    onChange={this.handleSelectCutoff1Change}
                            />
                            <FormHelperText>Critical frequency cutoff. Cutoff should be less or equal than half of fs</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="analog-selector-label">Analog</InputLabel>
                            <Select
                                    labelId="analog-selector-label"
                                    id="analog-selector"
                                    value= {this.state.selected_analog}
                                    label="Analog"
                                    onChange={this.handleSelectAnalogChange}
                            >
                                {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em> False</em></MenuItem>
                            </Select>
                            <FormHelperText>Should this be an analog filter</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="output-selector-label">Output</InputLabel>
                            <Select
                                    required
                                    labelId="output-selector-label"
                                    id="output-selector"
                                    value= {this.state.selected_output}
                                    label="Output"
                                    onChange={this.handleSelectOutputChange}
                            >
                                {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                <MenuItem value={"ba"}><em>Ba</em></MenuItem>
                                <MenuItem value={"zpk"}><em> ZPK</em></MenuItem>
                                <MenuItem value={"sos"}><em> SOS</em></MenuItem>
                            </Select>
                            <FormHelperText>Type of output</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_btype == "bandpass" ? 'block' : this.state.selected_btype == "bandstop" ? 'block' : 'none')}}>
                            <TextField
                                    id="cutoff-2-selector"
                                    value= {this.state.selected_cutoff_2}
                                    label="Cutoff 2"
                                    onChange={this.handleSelectCutoff2Change}
                            />
                            <FormHelperText>Critical frequency cutoff. For Bandpass/Bandstop Filters cutoff is a length-2 sequence</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="order-selector"
                                    value= {this.state.selected_order}
                                    label="Order"
                                    onChange={this.handleSelectOrderChange}
                            />
                            <FormHelperText>The order of filter</FormHelperText>
                        </FormControl>
                        <hr/>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                            Step 2 Filter Config:
                        </Typography>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="worn-selector"
                                    value= {this.state.selected_worn}
                                    label="WORn"
                                    onChange={this.handleSelectWornChange}
                            />
                            <FormHelperText>WORn?</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_output == "sos" ? 'block' : 'none')}}>
                            <TextField
                                    id="fs-freq-selector"
                                    value= {this.state.selected_fs_freq}
                                    label="Fs Freq"
                                    onChange={this.handleSelectFsFreqChange}
                            />
                            <FormHelperText>Fs Freq?</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120 , display: (this.state.selected_output == "sos" ? 'block' : 'none')}}>
                            <InputLabel id="whole-selector-label">Whole</InputLabel>
                            <Select
                                    labelId="whole-selector-label"
                                    id="whole-selector"
                                    value= {this.state.selected_whole}
                                    label="Whole"
                                    onChange={this.handleSelectWholeChange}
                            >
                                {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                <MenuItem value={"true"}><em>True</em></MenuItem>
                                <MenuItem value={"false"}><em> False</em></MenuItem>
                            </Select>
                            <FormHelperText>Whole.</FormHelperText>
                        </FormControl>
                        <br/>
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
                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.filter_chart_show ? 'block' : 'none')  }} noWrap>
                        Filters
                    </Typography>
                    <Typography variant="p" sx={{ flexGrow: 1, display: (this.state.filter_chart_show ? 'block' : 'none')  }} noWrap>
                        Showing first 1000 entries
                    </Typography>
                    <div style={{ display: (this.state.filter_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="frequency_chart_id" chart_data={ this.state.filter_chart_data}/></div>
                    <hr style={{ display: (this.state.filter_chart_show ? 'block' : 'none') }}/>

                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.frequency_w_chart_show ? 'block' : 'none')  }} noWrap>
                        Frequency
                    </Typography>
                    <div style={{ display: (this.state.frequency_w_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="filter_chart_id" chart_data={ this.state.frequency_w_chart_data}/></div>
                    <hr style={{ display: (this.state.frequency_w_chart_show ? 'block' : 'none') }}/>
                </Grid>
            </Grid>
        )
    }
}

export default FiltersFunctionPage;
