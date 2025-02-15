import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    Tab, Tabs, TextField, Typography
} from "@mui/material";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import {GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../ui-components/ProceedButton";
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function CustomToolbar() {
    return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
            <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
            >
                {value === index && (
                        <Box sx={{ p: 3 }}>
                            <Typography>{children}</Typography>
                        </Box>
                )}
            </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


class BackAveragePage extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of channels sent by the backend
            channels: [],
            tabvalue: 0,

            // EEG general variables
            file_used: null,
            selected_channel: "",
            channels_results_produced: [],

            // Back Average selection variables
            selected_time_before_event: '',
            selected_time_after_event: '',
            selected_min_ptp_amplitude: '',
            selected_max_ptp_amplitude: '',
            selected_annotation_name: '',
            selected_volt_display_minimum: '',
            selected_volt_display_maximum: '',

            // Back Average form validation variables
            timeBeforeEventError: false,
            timeAfterEventError: false,
            minPtpAmplitudeError: false,
            maxPtpAmplitudeError: false,
            annotationNameError: false,

            //Plot paths
            base_plot_path: ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id") + '/step_' + params.get("step_id") + '/output',
            back_average_plot_path: ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/back_average_plot.png',
            back_average_plot_path_1: 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/back_average_plot_f4.png',

        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.handleSelectTimeBeforeEventChange = this.handleSelectTimeBeforeEventChange.bind(this);
        this.handleSelectTimeAfterEventChange = this.handleSelectTimeAfterEventChange.bind(this);
        this.handleSelectMinPtpAmplitudeChange = this.handleSelectMinPtpAmplitudeChange.bind(this);
        this.handleSelectMaxPtpAmplitudeChange = this.handleSelectMaxPtpAmplitudeChange.bind(this);
        this.handleSelectAnnotationNameChange = this.handleSelectAnnotationNameChange.bind(this);

        this.handleSelectVoltDisplayMinimumEventChange = this.handleSelectVoltDisplayMinimumEventChange.bind(this);
        this.handleSelectVoltDisplayMaximumEventChange = this.handleSelectVoltDisplayMaximumEventChange.bind(this);

        this.validateAnnotationName = this.validateAnnotationName.bind(this);
        this.validateFloatNumber = this.validateFloatNumber.bind(this);

        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.handleFileUsedChange = this.handleFileUsedChange.bind(this);
        // Initialise component
        // - values of channels from the backend

    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        console.log(
                {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                    input_name: this.state.selected_channel,
                    time_before_event: parseFloat(this.state.selected_time_before_event),
                    time_after_event: parseFloat(this.state.selected_time_after_event),
                    min_ptp_amplitude: parseFloat(this.state.selected_min_ptp_amplitude),
                    max_ptp_amplitude: parseFloat(this.state.selected_max_ptp_amplitude),
                    annotation_name: this.state.selected_annotation_name,
                    // Add other input parameters as required
                    // file_used: this.state.file_used
                }
        )
        API.get("back_average", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                input_name: this.state.selected_channel,
                time_before_event: parseFloat(this.state.selected_time_before_event),
                time_after_event: parseFloat(this.state.selected_time_after_event),
                min_ptp_amplitude: parseFloat(this.state.selected_min_ptp_amplitude),
                max_ptp_amplitude: parseFloat(this.state.selected_max_ptp_amplitude),
                annotation_name: this.state.selected_annotation_name,
                // Convert nan values from parseFloat to null if no value given
                volt_display_minimum: parseFloat(this.state.selected_volt_display_minimum) || null,
                volt_display_maximum: parseFloat(this.state.selected_volt_display_maximum) || null,
                // Add other input parameters as required
                // file_used: this.state.file_used
            }
        }).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            this.setState({channels_results_produced: resultJson['channels']});
            // this.setState({result_periodogram_alpha_delta_ratio: resultJson['alpha_delta_ratio']});
            // this.setState({result_periodogram_alpha_delta_ratio_dataframe: JSON.parse(resultJson['alpha_delta_ratio_df'])});
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }

    handleSelectVoltDisplayMinimumEventChange = (event) => {
        this.setState({ selected_volt_display_minimum: event.target.value });
    }

    handleSelectVoltDisplayMaximumEventChange = (event) => {
        this.setState({ selected_volt_display_maximum: event.target.value });
    }

    handleSelectTimeBeforeEventChange = (event) => {
        this.setState({ selected_time_before_event: event.target.value });
    }

    handleSelectTimeAfterEventChange = (event) => {
        this.setState({ selected_time_after_event: event.target.value });
    }

    handleSelectMinPtpAmplitudeChange = (event) => {
        this.setState({ selected_min_ptp_amplitude: event.target.value });
    }

    handleSelectMaxPtpAmplitudeChange = (event) => {
        this.setState({ selected_max_ptp_amplitude: event.target.value });
    }

    handleSelectAnnotationNameChange = (event) => {
        this.setState({ selected_annotation_name: event.target.value });
    }

    handleChannelChange(channel_new_value){
        // console.log("CHANNELS")
        this.setState({channels: channel_new_value})
    }


    handleFileUsedChange(file_used_new_value){
        // console.log("CHANNELS")
        this.setState({file_used: file_used_new_value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    // Form validation
    validateAnnotationName() {
        const value = this.state.selected_annotation_name;
        const isError = value.trim() === '';
        this.setState({ annotationNameError: isError });
    };

    validateFloatNumber(value, stateKey) {
        const floatValue = parseFloat(value);
        const isValid = !isNaN(floatValue);
        this.setState({ [stateKey]: !isValid });
    }
    render() {
        return (
                <Grid container direction="row">
                    {/*<Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>*/}
                    {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                    {/*        Data Preview*/}
                    {/*    </Typography>*/}
                    {/*    <hr/>*/}
                    {/*    <List>*/}
                    {/*        {this.state.channels.map((channel) => (*/}
                    {/*                <ListItem> <ListItemText primary={channel}/></ListItem>*/}
                    {/*        ))}*/}
                    {/*    </List>*/}
                    {/*</Grid>*/}
                    <Grid item xs={4} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Back Average Parametirisation
                        </Typography>
                        <Divider/>
                        <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                        <Divider/>
                        <form onSubmit={this.handleSubmit} style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <InputLabel id="channel-selector-label">Channel</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="channel-selector-label"*/}
                            {/*            id="channel-selector"*/}
                            {/*            value= {this.state.selected_channel}*/}
                            {/*            label="Channel"*/}
                            {/*            onChange={this.handleSelectChannelChange}*/}
                            {/*    >*/}
                            {/*        <MenuItem value="">*/}
                            {/*            <em>None</em>*/}
                            {/*        </MenuItem>*/}
                            {/*        {this.state.channels.map((channel) => (*/}
                            {/*                <MenuItem value={channel}>{channel}</MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*    <FormHelperText>Select Channel to back average</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <FormControl sx={{m: 1, width:'90%'}} error={this.state.timeBeforeEventError}>
                                <TextField
                                        id="time-before-event"
                                        value={this.state.selected_time_before_event}
                                        label="Time Before Event (s)"
                                        size={"small"}
                                        onChange={this.handleSelectTimeBeforeEventChange}
                                        // onBlur={() => this.validateFloatNumber(this.state.selected_time_before_event, 'timeBeforeEventError')}
                                />
                                <FormHelperText>Time before the event (s)</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} error={this.state.timeAfterEventError}>
                                <TextField
                                        id="time-after-event"
                                        value={this.state.selected_time_after_event}
                                        label="Time After Event (s)"
                                        size={"small"}
                                        onChange={this.handleSelectTimeAfterEventChange}
                                        // onBlur={() => this.validateFloatNumber(this.state.selected_time_after_event, 'timeAfterEventError')}
                                />
                                <FormHelperText>Time after the event(s)</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} error={this.state.minPtpAmplitudeError}>
                                <TextField
                                        id="min-ptp-amplitude"
                                        value={this.state.selected_min_ptp_amplitude}
                                        label="Min PTP Amplitude (V)"
                                        size={"small"}
                                        onChange={this.handleSelectMinPtpAmplitudeChange}
                                        // onBlur={() => this.validateFloatNumber(this.state.selected_min_ptp_amplitude, 'minPtpAmplitudeError')}
                                />
                                <FormHelperText>Minimum peak-to-peak amplitude</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} error = {this.state.maxPtpAmplitudeError}>
                                <TextField
                                        id="max-ptp-amplitude"
                                        value={this.state.selected_max_ptp_amplitude}
                                        label="Max PTP Amplitude (V)"
                                        size={"small"}
                                        onChange={this.handleSelectMaxPtpAmplitudeChange}
                                        // onBlur={() => this.validateFloatNumber(this.state.selected_max_ptp_amplitude, 'maxPtpAmplitudeError')}
                                />
                                <FormHelperText>Maximum peak-to-peak amplitude</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}}  error={this.state.annotationNameError}>
                                <TextField
                                        id="annotation-name"
                                        value={this.state.selected_annotation_name}
                                        label="Annotation Name"
                                        size={"small"}
                                        onChange={this.handleSelectAnnotationNameChange}
                                        // onBlur={this.validateAnnotationName}
                                />
                                <FormHelperText>Annotation name</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}}>
                                <TextField
                                        id="display-volt-minimum"
                                        value={this.state.selected_volt_display_minimum}
                                        label="Plot Display Volt Minimum (μV)"
                                        size={"small"}
                                        onChange={this.handleSelectVoltDisplayMinimumEventChange}
                                        // onBlur={() => this.validateFloatNumber(this.state.selected_time_before_event, 'timeBeforeEventError')}
                                />
                                <FormHelperText>Plot Display Volt Minimum (μV)</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}}>
                                <TextField
                                        id="display-volt-maximum"
                                        value={this.state.selected_volt_display_maximum}
                                        label="Plot Display Volt Maximum (μV)"
                                        size={"small"}
                                        onChange={this.handleSelectVoltDisplayMaximumEventChange}
                                        // onBlur={() => this.validateFloatNumber(this.state.selected_time_after_event, 'timeAfterEventError')}
                                />
                                <FormHelperText>Plot Display Volt Maximum (μV)</FormHelperText>
                            </FormControl>


                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>

                        </form>
                        <ProceedButton></ProceedButton>

                    </Grid>

                    <Grid item xs={8}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Back Average Results" {...a11yProps(1)} />
                                    <Tab label="Back Average Results Single Plots" {...a11yProps(2)} />

                                </Tabs>
                            </Box>

                        </Box>
                        <TabPanel value={this.state.tabvalue} index={0}>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={1}>
                            <img src={this.state.back_average_plot_path + "?random=" + new Date().getTime()}
                                 srcSet={this.state.back_average_plot_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                 loading="lazy"
                            />
                            {/*<img src={this.state.back_average_plot_path_1 + "?random=" + new Date().getTime()}*/}
                            {/*     srcSet={this.state.back_average_plot_path_1 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                            {/*     loading="lazy"*/}
                            {/*/>*/}
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={2}>
                            {this.state.channels_results_produced.map((channel_name) => (
                                    <img src={this.state.base_plot_path + "/temp_plot_" + channel_name + ".png?random=" + new Date().getTime()}
                                         srcSet={this.state.base_plot_path + "/temp_plot_" + channel_name + ".png?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                         loading="lazy"
                                    />
                            ))}
                        </TabPanel>
                        {/*<hr/>*/}

                        {/*<div style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="peridogram_chart_id" chart_data={ this.state.peridogram_chart_data}/></div>*/}
                        {/*<hr style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}/>*/}
                    </Grid>
                </Grid>
        )
    }
}

export default BackAveragePage;
