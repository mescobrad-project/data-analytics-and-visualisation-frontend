import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
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
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";

class AsymmetryIndicesFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of channels sent by the backend
            channels: [],

            //Values selected currently on the form
            selected_channel_1: "",
            selected_channel_2: "",
            selected_window: "hann",
            selected_nperseg: "256",
            selected_noverlap: "",
            selected_nfft: "256",
            selected_return_onesided: true,
            selected_scaling: "density",
            selected_axis: "-1",
            selected_average: "mean",


            asymmetry_indices : "",

            // Hide/show results
            asymmetry_indices_show : false,

            //Info from selector
            file_used: null
        };

        //Binding functions of the class
        // this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannel1Change = this.handleSelectChannel1Change.bind(this);
        this.handleSelectChannel2Change = this.handleSelectChannel2Change.bind(this);
        this.handleSelectWindowChange = this.handleSelectWindowChange.bind(this);
        this.handleSelectNpersegChange = this.handleSelectNpersegChange.bind(this);
        this.handleSelectNoverlapChange = this.handleSelectNoverlapChange.bind(this);
        this.handleSelectNfftChange = this.handleSelectNfftChange.bind(this);
        this.handleSelectReturnonesidedChange = this.handleSelectReturnonesidedChange.bind(this);
        this.handleSelectScalingChange = this.handleSelectScalingChange.bind(this);
        this.handleSelectAxisChange = this.handleSelectAxisChange.bind(this);
        this.handleSelectAverageChange = this.handleSelectAverageChange.bind(this);
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
        // Convert nperseg, noverlap, nfft from string to int
        let to_send_input_nperseg = null;
        let to_send_input_noverlap = null;
        let to_send_input_nfft = null;

        if (!!this.state.selected_nperseg){
            to_send_input_nperseg = parseInt(this.state.selected_nperseg)
        }

        if (!!this.state.selected_noverlap){
            to_send_input_noverlap = parseInt(this.state.selected_noverlap)
        }

        if (!!this.state.selected_nfft){
            to_send_input_nfft = parseInt(this.state.selected_nfft)
        }

        const params = new URLSearchParams(window.location.search);

        // Send the request
        API.get("return_asymmetry_indices",
                {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),input_name_1: this.state.selected_channel_1, input_name_2: this.state.selected_channel_2, input_window: this.state.selected_window,
                        input_nperseg: to_send_input_nperseg, input_noverlap: to_send_input_noverlap,
                        input_nfft: to_send_input_nfft, input_return_onesided: this.state.selected_return_onesided,
                        input_scaling: this.state.selected_scaling, input_axis: this.state.selected_axis,
                        input_average: this.state.selected_average,file_used: this.state.file_used
                    }
                }
        ).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')



            // console.log("")
            // console.log(temp_array)


            this.setState({asymmetry_indices: resultJson['asymmetry_indices']})
            this.setState({asymmetry_indices_show: true})



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
    handleSelectChannel1Change(event){
        this.setState( {selected_channel_1: event.target.value})
    }
    handleSelectChannel2Change(event){
        this.setState( {selected_channel_2: event.target.value})
    }
    handleSelectWindowChange(event){
        this.setState( {selected_window: event.target.value})
    }
    handleSelectNpersegChange(event){
        this.setState( {selected_nperseg: event.target.value})
    }
    handleSelectNoverlapChange(event){
        this.setState( {selected_noverlap: event.target.value})
    }
    handleSelectNfftChange(event){
        this.setState( {selected_nfft: event.target.value})
    }
    handleSelectReturnonesidedChange(event){
        this.setState( {selected_return_onesided: event.target.value})
    }
    handleSelectScalingChange(event){
        this.setState( {selected_scaling: event.target.value})
    }
    handleSelectAxisChange(event){
        this.setState( {selected_axis: event.target.value})
    }
    handleSelectAverageChange(event){
        this.setState( {selected_average: event.target.value})
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
                        <List>
                            {this.state.channels.map((channel) => (
                                    <ListItem> <ListItemText primary={channel}/></ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Asymmetry Indices Parameterisation
                        </Typography>
                        <Divider/>
                        <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                        <Divider/>
                        <form onSubmit={this.handleSubmit} style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="channel1-selector-label">Channel 1</InputLabel>
                                <Select
                                        labelId="channel1-selector-label"
                                        id="channel1-selector"
                                        value= {this.state.selected_channel_1}
                                        label="Channel 1"
                                        onChange={this.handleSelectChannel1Change}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.channels.map((channel) => (
                                            <MenuItem value={channel}>{channel}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Channel 1 for Welch</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="channel2-selector-label">Channel 2</InputLabel>
                                <Select
                                        labelId="channel2-selector-label"
                                        id="channel2-selector"
                                        value= {this.state.selected_channel_2}
                                        label="Channel 2"
                                        onChange={this.handleSelectChannel2Change}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.channels.map((channel) => (
                                            <MenuItem value={channel}>{channel}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Channel 2 for Welch</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="window-selector-label">Window</InputLabel>
                                <Select
                                        labelId="window-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Window"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"hann"}><em>Hann</em></MenuItem>
                                    <MenuItem value={"boxcar"}><em>Boxcar</em></MenuItem>
                                    <MenuItem value={"triang"}><em>Triang</em></MenuItem>
                                    <MenuItem value={"blackman"}><em>Blackman</em></MenuItem>
                                    <MenuItem value={"bartlett"}><em>Bartlett</em></MenuItem>
                                    <MenuItem value={"flattop"}><em>Flattop</em></MenuItem>
                                    <MenuItem value={"parzen"}><em>Parzen</em></MenuItem>
                                    <MenuItem value={"bohman"}><em>Bohman</em></MenuItem>
                                    <MenuItem value={"blackmanharris"}><em>Blackmanharris</em></MenuItem>
                                    <MenuItem value={"nuttall"}><em>Nuttall</em></MenuItem>
                                    <MenuItem value={"barthann"}><em>Barthann</em></MenuItem>
                                    <MenuItem value={"exponential"}><em>Exponential</em></MenuItem>
                                    <MenuItem value={"tukey"}><em>Tukey</em></MenuItem>
                                    <MenuItem value={"taylor"}><em>Taylor</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which window to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        labelId="nperseg-selector-label"
                                        id="nperseg-selector"
                                        value= {this.state.selected_nperseg}
                                        label="Nperseg"
                                        onChange={this.handleSelectNpersegChange}
                                />
                                <FormHelperText>Length of each segment</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                <TextField
                                        labelId="noverlap-selector-label"
                                        id="noverlap-selector"
                                        value= {this.state.selected_noverlap}
                                        label="Noverlap"
                                        onChange={this.handleSelectNoverlapChange}
                                />
                                <FormHelperText>Number of points to overlap between segments</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        // labelId="nfft-selector-label"
                                        id="nfft-selector"
                                        value= {this.state.selected_nfft}
                                        label="Nfft"
                                        onChange={this.handleSelectNfftChange}
                                />
                                <FormHelperText>Length of the FFT used, Nfft must be equal or higher than Nperseg</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="return-onesided-selector-label">Return Onesided</InputLabel>
                                <Select
                                        labelId="return-onesided-selector-label"
                                        id="return-onesided-selector"
                                        value= {this.state.selected_return_onesided}
                                        label="Return-onesided"
                                        onChange={this.handleSelectReturnonesidedChange}
                                >
                                    <MenuItem value={"true"}><em>True</em></MenuItem>
                                    <MenuItem value={"false"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>If True, return a one-sided spectrum</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="scaling-selector-label">Scaling</InputLabel>
                                <Select
                                        // labelId="scaling-selector-label"
                                        id="scaling-selector"
                                        value= {this.state.selected_scaling}
                                        label="Scaling"
                                        onChange={this.handleSelectScalingChange}
                                >
                                    <MenuItem value={"density"}><em>Density</em></MenuItem>
                                    <MenuItem value={"spectrum"}><em>Spectrum</em></MenuItem>
                                </Select>
                                <FormHelperText>Selects between computing the power spectral density or the power spectrum</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <TextField
                                        // labelId="nfft-selector-label"
                                        id="axis-selector"
                                        value= {this.state.selected_axis}
                                        label="Axis"
                                        onChange={this.handleSelectAxisChange}
                                />
                                <FormHelperText>Axis along which the periodogram is computed</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="average-selector-label">Average</InputLabel>
                                <Select
                                        // labelId="nfft-selector-label"
                                        id="average-selector"
                                        value= {this.state.selected_average}
                                        label="Average"
                                        onChange={this.handleSelectAverageChange}
                                >
                                    <MenuItem value={"mean"}><em>Mean</em></MenuItem>
                                    <MenuItem value={"median"}><em>Median</em></MenuItem>
                                </Select>
                                <FormHelperText>Method to use when averaging periodograms</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={5}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Asymmetry Indices Result
                        </Typography>
                        <hr/>
                        {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>*/}
                        {/*    Welch Results*/}
                        {/*</Typography>*/}

                        <div style={{ display: (this.state.asymmetry_indices_show ? 'block' : 'none') }}>{this.state.asymmetry_indices}</div>
                        <hr style={{ display: (this.state.asymmetry_indices_show ? 'block' : 'none') }}/>
                    </Grid>
                </Grid>
        )
    }
}

export default AsymmetryIndicesFunctionPage;
