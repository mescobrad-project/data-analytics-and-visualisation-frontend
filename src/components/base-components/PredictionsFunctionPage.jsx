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
import ChannelSignalSpindleSlowwaveChartCustom from "../ui-components/ChannelSignalSpindleSlowwaveChartCustom"


class PredictionsFunctionPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of channels sent by the backend
            channels: [],

            //Values selected currently on the form
            selected_channel: "",
            selected_test_size: "",
            selected_future_seconds: "",
            selected_start_p: "1",
            selected_start_q: "1",
            selected_max_p: "5",
            selected_max_q: "5",
            selected_method: "lbfgs",
            selected_criterion: "aic",

            // Values to pass to visualisations
            predictions_chart_data : [],
            table_1: [],
            table_2: [],
            table_3: [],
            data_2: [],

            // Visualisation Hide/Show values
            predictions_chart_show : false


        };

        //Binding functions of the class
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectTestSizeChange = this.handleSelectTestSizeChange.bind(this);
        this.handleSelectFutureSecondsChange = this.handleSelectFutureSecondsChange.bind(this);
        this.handleSelectStartPChange = this.handleSelectStartPChange.bind(this);
        this.handleSelectStartQChange = this.handleSelectStartQChange.bind(this);
        this.handleSelectMaxPChange = this.handleSelectMaxPChange.bind(this);
        this.handleSelectMaxPChange = this.handleSelectMaxPChange.bind(this);
        this.handleSelectMaxQChange = this.handleSelectMaxQChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectCriterionChange = this.handleSelectCriterionChange.bind(this);
        this.handleGetChannelSignal = this.handleGetChannelSignal.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.fetchChannels();
        this.handleGetChannelSignal();


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
        // Convert nperseg, noverlap, nfft from string to int
        let to_send_input_test_size = null;
        let to_send_input_future_seconds = null;
        let to_send_input_start_p = null;
        let to_send_input_start_q = null;
        let to_send_input_max_p = null;
        let to_send_input_max_q = null;

        if (!!this.state.selected_test_size){
            to_send_input_test_size = parseInt(this.state.selected_test_size)
        }

        if (!!this.state.selected_future_seconds){
            to_send_input_future_seconds = parseInt(this.state.selected_future_seconds)
        }

        if (!!this.state.selected_start_p){
            to_send_input_start_p = parseInt(this.state.selected_start_p)
        }
        if (!!this.state.selected_start_q){
            to_send_input_start_q = parseInt(this.state.selected_start_q)
        }

        if (!!this.state.selected_max_p){
            to_send_input_max_p = parseInt(this.state.selected_max_p)
        }

        if (!!this.state.selected_max_q){
            to_send_input_max_q = parseInt(this.state.selected_max_q)
        }

        //Reset view of optional visualisations preview
        this.setState({welch_chart_show: false})




        // Send the request
        API.get("return_predictions",
                {
                    params: {input_name: this.state.selected_channel,
                        input_test_size: to_send_input_test_size,
                        input_future_seconds: to_send_input_future_seconds,
                        input_start_p: to_send_input_start_p,
                        input_start_q: to_send_input_start_q,
                        input_max_p: to_send_input_max_p,
                        input_max_q: to_send_input_max_q,
                        input_method: this.state.selected_method,
                        input_criterion: this.state.selected_criterion}
                }
        ).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            console.log('Test')
            let temp_array_predictions = []
            // for ( let it =0 ; it < resultJson['power spectral density'].length; it++){
            //     let temp_object = {}
            //     temp_object["category"] = resultJson['frequencies'][it]
            //     temp_object["yValue"] = resultJson['power spectral density'][it]
            //     temp_array_predictions.push(temp_object)
            // }
            // // console.log("")
            // // console.log(temp_array)


            this.setState({predictions_chart_data: resultJson['predictions']})
            this.setState({table_1: resultJson['first_table']})
            this.setState({table_2: resultJson['second_table']})
            this.setState({table_3: resultJson['third_table']})
            this.setState({predictions_chart_show: true})

            // let temp_array = []
            // for ( let it =0 ; it < resultJson['predictions'].length; it++){
            //     let temp_object = {}
            //     temp_object["order"] = it
            //     temp_object["value"] = resultJson.values_autocorrelation[it]
            //     temp_array.push(temp_object)
            // }
            // console.log(temp_array)


        });
        // const response = await fetch("http://localhost:8000/test/return_autocorrelation", {
        //     method: "GET",
        //     headers: {"Content-Type": "application/json"},
        //     // body: JSON.stringify({"name": this.state.selected_channel})
        //     // body: newTodo
        // })
        // // .then(response => updateResult(response.json()) )
        // const resultJson = await response.json()
        // this.setState({correlation_results: resultJson.values_autocorrelation})
    }

    async handleGetChannelSignal() {
        if (this.state.selected_part_channel === "") {
            return
        }

        API.get("return_signal",
                {
                    params: {
                        input_name: this.state.selected_part_channel,
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
    handleSelectTestSizeChange(event){
        this.setState( {selected_test_size: event.target.value})
    }
    handleSelectFutureSecondsChange(event){
        this.setState( {selected_future_seconds: event.target.value})
    }
    handleSelectStartPChange(event){
        this.setState( {selected_start_p: event.target.value})
    }
    handleSelectStartQChange(event){
        this.setState( {selected_start_q: event.target.value})
    }
    handleSelectMaxPChange(event){
        this.setState( {selected_max_p: event.target.value})
    }
    handleSelectMaxQChange(event){
        this.setState( {selected_return_max_q: event.target.value})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
    }
    handleSelectCriterionChange(event){
        this.setState( {selected_criterion: event.target.value})
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
                            Predictions Parameterisation
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
                                <FormHelperText>Select Channel for Predictions</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                <TextField
                                        labelId="test-size-selector-label"
                                        id="test-size-selector"
                                        value= {this.state.selected_test_size}
                                        label="Test Size"
                                        onChange={this.handleSelectTestSizeChange}
                                />
                                <FormHelperText>Select Test Size</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                <TextField
                                        labelId="future-seconds-selector-label"
                                        id="future-seconds-selector"
                                        value= {this.state.selected_future_seconds}
                                        label="Future Seconds"
                                        onChange={this.handleSelectFutureSecondsChange}
                                />
                                <FormHelperText>Select Future Seconds</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                <TextField
                                        labelId="startp-selector-label"
                                        id="startp-selector"
                                        value= {this.state.selected_start_p}
                                        label="Start P"
                                        onChange={this.handleSelectStartPChange}
                                />
                                <FormHelperText>Select start_p</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                <TextField
                                        labelId="startq-selector-label"
                                        id="startq-selector"
                                        value= {this.state.selected_start_q}
                                        label="Start Q"
                                        onChange={this.handleSelectStartQChange}
                                />
                                <FormHelperText>Select start_q</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                <TextField
                                        labelId="maxp-selector-label"
                                        id="maxp-selector"
                                        value= {this.state.selected_max_p}
                                        label="Max P"
                                        onChange={this.handleSelectMaxPChange}
                                />
                                <FormHelperText>Select max_p</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                <TextField
                                        labelId="maxq-selector-label"
                                        id="maxq-selector"
                                        value= {this.state.selected_max_q}
                                        label="Max Q"
                                        onChange={this.handleSelectMaxQChange}
                                />
                                <FormHelperText>Select max_q</FormHelperText>
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
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"lbfgs"}><em>Lbfgs</em></MenuItem>
                                    <MenuItem value={"newton"}><em>Newton</em></MenuItem>
                                    <MenuItem value={"Nm"}><em>Nm</em></MenuItem>
                                    <MenuItem value={"bfgs"}><em>Bfgs</em></MenuItem>
                                    <MenuItem value={"cg"}><em>Cg</em></MenuItem>
                                    <MenuItem value={"ncg"}><em>Ncg</em></MenuItem>
                                    <MenuItem value={"basinhopping"}><em>Basinhopping</em></MenuItem>
                                    <MenuItem value={"powell"}><em>Powell</em></MenuItem>

                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="information-criterion-selector-label">Information Criterion</InputLabel>
                                <Select
                                        labelId="information-criterion-selector-label"
                                        id="information-criterion-selector"
                                        value= {this.state.selected_criterion}
                                        label="Information Criterion"
                                        onChange={this.handleSelectCriterionChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"aic"}><em>Aic</em></MenuItem>
                                    <MenuItem value={"bic"}><em>Bic</em></MenuItem>
                                    <MenuItem value={"hqic"}><em>Hqic</em></MenuItem>
                                    <MenuItem value={"oob"}><em>Oob</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which information criterion to use.</FormHelperText>
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
                        <Typography variant="h6" sx={{ flexGrow: 1, display: (this.state.welch_chart_show ? 'block' : 'none')  }} noWrap>
                            Welch Results
                        </Typography>

                        {/*<div style={{ display: (this.state.predictions_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="predictions_chart_id" chart_data={ this.state.predictions_chart_data}/>*/}
                        {/*    {this.state.data_2}</div>*/}
                        <div style={{ display: (this.state.select_signal_chart_show ? 'block' : 'none') }}><ChannelSignalSpindleSlowwaveChartCustom chart_id="singal_chart_id" chart_data={ this.state.signal_chart_data}/></div>
                        <div style={{ display: (this.state.predictions_chart_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.table_1}} />
                        <hr style={{ display: (this.state.predictions_chart_show ? 'block' : 'none') }}/>
                        <div style={{ display: (this.state.predictions_chart_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.table_2}} />
                        <hr style={{ display: (this.state.predictions_chart_show ? 'block' : 'none') }}/>
                        <div style={{ display: (this.state.predictions_chart_show ? 'block' : 'none') }} dangerouslySetInnerHTML={{__html: this.state.table_3}} />
                        <hr style={{ display: (this.state.predictions_chart_show ? 'block' : 'none') }}/>
                    </Grid>
                </Grid>
        )
    }
}

export default PredictionsFunctionPage;
