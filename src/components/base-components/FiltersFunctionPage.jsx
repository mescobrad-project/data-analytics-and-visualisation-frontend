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
            selected_cutoff: "",

            // old
            selected_alpha: "",
            selected_nlags: "",

            // Values to pass to visualisations
            correlation_chart_data : [],
            confint_chart_data : false,

            // Visualisation Hide/Show values
            correlation_chart_show : false,
            confint_chart_show : false,


        };

        //Binding functions of the class
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectBTypeChange = this.handleSelectBTypeChange.bind(this);
        this.handleSelectAnalogChange = this.handleSelectAnalogChange.bind(this);
        this.handleSelectFsChange = this.handleSelectFsChange.bind(this);
        this.handleSelectOutputChange = this.handleSelectOutputChange.bind(this);
        this.handleSelectCutoffChange = this.handleSelectCutoffChange.bind(this);
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
        let to_send_input_alpha = null;
        let to_send_input_nlags = null;

        if (!!this.state.selected_alpha){
            to_send_input_alpha = parseFloat(this.state.selected_alpha)
        }

        if (!!this.state.selected_nlags){
            to_send_input_nlags = parseInt(this.state.selected_nlags)
        }

        //Reset view of optional visualisations preview
        // this.setState({correlation_chart_show: false})
        this.setState({confint_chart_show: false})
        this.setState({qstat_chart_show: false})
        this.setState({pvalues_chart_show: false})

        // Set flags for optional data that need to be shown since if this check is done after results have arrived, maybe the
        // data has already been changed and the wrong visualisation will be shown
        let flag_alpha = false;

        // If alpha is enabled, enable relevant visualisations
        if(to_send_input_alpha){
            flag_alpha = true;
        }

        console.log("METHOD VALUE")
        console.log( this.state.selected_method)
        // Send the request
        API.get("return_partial_autocorrelation",
            {
                params: {input_name: this.state.selected_channel, input_method: this.state.selected_method,
                    input_alpha: to_send_input_alpha, input_nlags: to_send_input_nlags}
            }
        ).then(res => {
            const resultJson = res.data;

            // Show only relevant visualisations and load their data
            // Correlation chart always has results so should always be enabled
            this.setState({correlation_results: resultJson.values_partial_autocorrelation})

            let temp_array_correlation = []
            for ( let it =0 ; it < resultJson.values_partial_autocorrelation.length; it++){
                let temp_object = {}
                temp_object["category"] = it
                temp_object["yValue"] = resultJson.values_partial_autocorrelation[it]
                temp_array_correlation.push(temp_object)
            }
            // console.log("")
            // console.log(temp_array)


            this.setState({correlation_chart_data: temp_array_correlation})
            this.setState({correlation_chart_show: true})

            // Alpha optional charts
            if(flag_alpha){
                let temp_array_alpha = []
                for ( let it =0 ; it < resultJson.confint.length; it++){
                    let temp_object = {}
                    temp_object["category"] = it
                    temp_object["yValue1"] = resultJson.confint[it][0]
                    temp_object["yValue2"] = resultJson.confint[it][1]
                    temp_array_alpha.push(temp_object)
                }

                this.setState({confint_chart_data: temp_array_alpha})
                this.setState({confint_chart_show: true});
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
    }
    handleSelectAnalogChange(event){
        this.setState( {selected_analog: event.target.value})
    }
    handleSelectFsChange(event){
        this.setState( {selected_fs: event.target.value})
    }
    handleSelectOutputChange(event){
        this.setState( {selected_output: event.target.value})
    }
    handleSelectCutoffChange(event){
        this.setState( {selected_cutoff: event.target.value})
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
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="btype-selector-label">Btype</InputLabel>
                            <Select
                                labelId="btype-selector-label"
                                id="btype-selector"
                                value= {this.state.selected_btype}
                                label="BType"
                                onChange={this.handleSelectMethodChange}
                            >
                                {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                <MenuItem value={"lowpass"}><em>Lowpass</em></MenuItem>
                                <MenuItem value={"highpass"}><em> Highpass</em></MenuItem>
                                <MenuItem value={"bandpass"}><em>Bandpass</em></MenuItem>
                                <MenuItem value={"bandstop"}><em>Bandstop</em></MenuItem>
                            </Select>
                            <FormHelperText>Btype</FormHelperText>
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
                            <FormHelperText>Analog.</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <InputLabel id="output-selector-label">Analog</InputLabel>
                            <Select
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
                            <FormHelperText>Analog</FormHelperText>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 120}}>
                            <TextField
                                id="cutoff-selector"
                                value= {this.state.selected_fs}
                                label="Cutoff"
                                onChange={this.handleSelectCutoffChange}
                            />
                            <FormHelperText>Cutoff?</FormHelperText>
                        </FormControl>
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </form>
                </Grid>
                <Grid item xs={5}>
                    {/*<Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                    {/*    Result Visualisation*/}
                    {/*</Typography>*/}
                    {/*<hr/>*/}
                    {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.correlation_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Correlation Results*/}
                    {/*</Typography>*/}
                    {/*<div style={{ display: (this.state.correlation_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="correlation_chart_id" chart_data={ this.state.correlation_chart_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.correlation_chart_show ? 'block' : 'none') }}/>*/}

                    {/*<Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.confint_chart_show ? 'block' : 'none')  }} noWrap>*/}
                    {/*    Confidence Interval*/}
                    {/*</Typography>*/}
                    {/*<div style={{ display: (this.state.confint_chart_show ? 'block' : 'none') }}><RangeAreaChartCustom chart_id="confint_chart_id" chart_data={ this.state.confint_chart_data}/></div>*/}
                    {/*<hr style={{ display: (this.state.confint_chart_show ? 'block' : 'none') }}/>*/}
                </Grid>
            </Grid>
        )
    }
}

export default FiltersFunctionPage;
