import React from 'react';
import API from "../../axiosInstance";
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

import LineChart from "../ui-components/LineChart";
import EEGSelectModal from "../ui-components/EEGSelectModal";

class EnvelopeTrendAnalysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // List of channels sent by the backend
            channels: [],

            // Results of the auto correlation stored in an array
            // Might need to convert to object
            envelope_results: [],

            //Values selected currently on the form
            selected_channel: "",
            //input_name: str,
            selected_window_size: 20,
            selected_percent: 0.1,
            selected_input_method: 'Simple',

            // Values to pass to visualisations
            envelope_chart_data : [],

            // Visualisation Hide/Show values
            envelope_chart_show : false,

            //Info from selector
            file_used: null
        };

        //Binding functions of the class
        // this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectWindowChange = this.handleSelectWindowChange.bind(this);
        this.handleSelectPercentChange = this.handleSelectPercentChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
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
        let to_send_window_size = null;
        let to_send_input_percent = null;

        if (!!this.state.selected_percent){
            to_send_input_percent = parseFloat(this.state.selected_percent)
        }

        if (!!this.state.selected_window_size){
            to_send_window_size = parseInt(this.state.selected_window_size)
        }

        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("envelope_trend",
            {
                params: {run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                    input_name: this.state.selected_channel, window_size: this.state.selected_window_size,
                    percent: this.state.selected_percent, input_method: this.state.selected_input_method,
                    file_used: this.state.file_used}
            }
        ).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            this.setState({envelope_chart_data: resultJson})
            this.setState({envelope_chart_show: true});
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }
    handleSelectWindowChange(event){
        this.setState( {selected_window_size: event.target.value})
    }
    handleSelectPercentChange(event){
        this.setState( {selected_percent: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_input_method: event.target.value})
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
                        Envelope Analyisis Parameterisation
                    </Typography>
                    <Divider/>
                    <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                    <Divider/>
                    <form onSubmit={this.handleSubmit} style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>
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
                            <TextField
                                    id="window-selector"
                                    value= {this.state.selected_window_size}
                                    label="window_size"
                                    onChange={this.handleSelectWindowChange}
                            />
                            <FormHelperText>Select window</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                    id="percent-selector"
                                    value= {this.state.selected_percent}
                                    label="Percent"
                                    onChange={this.handleSelectPercentChange}
                            />
                            <FormHelperText>Select percent</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="method-selector-label">Method</InputLabel>
                            <Select
                                labelId="method-selector-label"
                                id="method-selector"
                                value= {this.state.selected_method}
                                label="Method"
                                onChange={this.handleSelectMethodChange}
                            >
                                <MenuItem value={"Simple"}><em>Simple</em></MenuItem>
                                <MenuItem value={"Cumulative"}><em>Cumulative</em></MenuItem>
                                <MenuItem value={"Exponential"}><em>Exponential</em></MenuItem>
                            </Select>
                            <FormHelperText>Select moving average Method</FormHelperText>
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
                    <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.envelope_chart_show ? 'block' : 'none')  }} noWrap>
                        Envelope Trend Analysis Results
                    </Typography>
                    <div style={{ display: (this.state.envelope_chart_show ? 'block' : 'none') }}>
                        <LineChart chart_id="envelope_chart_id" chart_data={ this.state.envelope_chart_data}/>
                    </div>
                    <hr style={{ display: (this.state.envelope_chart_show ? 'block' : 'none') }}/>

                </Grid>
            </Grid>
        )
    }
}

export default EnvelopeTrendAnalysis;
