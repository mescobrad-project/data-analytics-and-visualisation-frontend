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

class PeriodogramFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of channels sent by the backend
            channels: [],

            //Values selected currently on the form
            selected_channel: "",
            selected_window: "hann",
            selected_nfft: "256",
            selected_return_onesided: true,
            selected_scaling: "density",
            selected_axis: "-1",

            // Values to pass to visualisations
            periodogram_chart_data : [],

            // Visualisation Hide/Show values
            periodogram_chart_show : false


        };

        //Binding functions of the class
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectWindowChange = this.handleSelectWindowChange.bind(this);
        this.handleSelectNfftChange = this.handleSelectNfftChange.bind(this);
        this.handleSelectReturnonesidedChange = this.handleSelectReturnonesidedChange.bind(this);
        this.handleSelectScalingChange = this.handleSelectScalingChange.bind(this);
        this.handleSelectAxisChange = this.handleSelectAxisChange.bind(this);
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
        // Convert nfft from string to int

        let to_send_input_nfft = null;

        if (!!this.state.selected_nfft){
            to_send_input_nfft = parseInt(this.state.selected_nfft)
        }

        //Reset view of optional visualisations preview
        this.setState({periodogram_chart_show: false})


        // Send the request
        API.get("return_periodogram",
                {
                    params: {input_name: this.state.selected_channel, input_window: this.state.selected_window,
                        input_nfft: to_send_input_nfft, input_return_onesided: this.state.selected_return_onesided,
                        input_scaling: this.state.selected_scaling, input_axis: this.state.selected_axis}
                }
        ).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')
            let temp_array_peridogram = []
            for ( let it =0 ; it < resultJson['power spectral density'].length; it++){
                let temp_object = {}
                temp_object["category"] = resultJson['frequencies'][it]
                temp_object["yValue"] = resultJson['power spectral density'][it]
                temp_array_peridogram.push(temp_object)
            }
            // console.log("")
            // console.log(temp_array)


            this.setState({peridogram_chart_data: temp_array_peridogram})
            this.setState({peridogram_chart_show: true})



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
    handleSelectWindowChange(event){
        this.setState( {selected_window: event.target.value})
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
                            Periodogram Parameterisation
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
                                <FormHelperText>Select Channel for Periodogram</FormHelperText>
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
                                        // labelId="nfft-selector-label"
                                        id="nfft-selector"
                                        value= {this.state.selected_nfft}
                                        label="Nfft"
                                        onChange={this.handleSelectNfftChange}
                                />
                                <FormHelperText>Nfft </FormHelperText>
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
                        <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.peridogram_chart_show ? 'block' : 'none')  }} noWrap>
                            Periodogram Results
                        </Typography>

                        <div style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="peridogram_chart_id" chart_data={ this.state.peridogram_chart_data}/></div>
                        <hr style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}/>
                    </Grid>
                </Grid>
        )
    }
}

export default PeriodogramFunctionPage;