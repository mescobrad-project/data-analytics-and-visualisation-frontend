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
    Select, Tab, Tabs, TextField, Typography
} from "@mui/material";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import {DataGrid, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../ui-components/ProceedButton";

const sleepStageColumns = [
    { field: "N1",
        headerName: "N1",
        width: '10%',
        align: "left",
        headerAlign: "left",
        flex:1,
        sortable: true},
    { field: "N2",
        headerName: "N2",
        width: '10%',
        align: "left",
        headerAlign: "left",
        flex:1,
        sortable: true},
    { field: "N3",
        headerName: "N3",
        width: '10%',
        align: "left",
        headerAlign: "left",
        flex:1,
        sortable: true},
    { field: "R",
        headerName: "R",
        width: '10%',
        align: "left",
        headerAlign: "left",
        flex:1,
        sortable: true},
    { field: "W",
        headerName: "W",
        width: '10%',
        align: "left",
        headerAlign: "left",
        flex:1,
        sortable: true},
];

const sleepStageConfidenceColumns = [
    { field: "Stage",
        headerName: "Stage",
        width: '10%',
        align: "left",
        headerAlign: "left",
        flex:1,
        sortable: true},
    { field: "Confidence",
        headerName: "Confidence",
        width: '10%',
        align: "left",
        headerAlign: "left",
        flex:1,
        sortable: true},
];


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


class SleepStageClassificationPage extends React.Component {
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
            selected_eeg_channel: "",
            selected_eog_channel: "",
            selected_emg_channel: "",
            channels_results_produced: [],

            // Results
            result_sleep_stage_confidence: [],
            result_sleep_stage: [],

            //Plot paths
            base_plot_path: ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id") + '/step_' + params.get("step_id") + '/output',
        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);


        this.handleSelectEEGChannelChange = this.handleSelectEEGChannelChange.bind(this);
        this.handleSelectEOGChannelChange = this.handleSelectEOGChannelChange.bind(this);
        this.handleSelectEMGChannelChange = this.handleSelectEMGChannelChange.bind(this);

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

        console.log({
            workflow_id: params.get("workflow_id"),
            run_id: params.get("run_id"),
            step_id: params.get("step_id"),
            eeg_chanel_name: this.state.selected_eeg_channel,
            eog_channel_name: this.state.selected_eog_channel,
            emg_channel_name: this.state.selected_emg_channel,
            // Add other input parameters as required
            file_used: this.state.file_used
        })
        API.get("sleep_stage_classification", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                eeg_chanel_name: this.state.selected_eeg_channel,
                eog_channel_name: this.state.selected_eog_channel || null,
                emg_channel_name: this.state.selected_emg_channel || null,
                // Add other input parameters as required
                file_used: this.state.file_used
            }
        }).then(res => {
            const resultJson = res.data;
            console.log(resultJson)
            this.setState({result_sleep_stage_confidence: JSON.parse(resultJson["sleep_stage_confidence"]) });
            this.setState({result_sleep_stage: JSON.parse(resultJson["sleep_stage"]) });
            // this.setState({channels_results_produced: resultJson['channels']});
            // this.setState({result_periodogram_alpha_delta_ratio: resultJson['alpha_delta_ratio']});
            // this.setState({result_periodogram_alpha_delta_ratio_dataframe: JSON.parse(resultJson['alpha_delta_ratio_df'])});
        });
    }

    /**
     * Update state when selection changes in the form
     */


    handleSelectEEGChannelChange(event){
        this.setState( {selected_eeg_channel: event.target.value})
    }

    handleSelectEOGChannelChange(event){
        this.setState( {selected_eog_channel: event.target.value})
    }

    handleSelectEMGChannelChange(event){
        this.setState( {selected_emg_channel: event.target.value})
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
                            Automatic Sleep Staging Classification
                        </Typography>
                        <Divider/>
                        <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                        <Divider/>
                        <form onSubmit={this.handleSubmit} style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="channel-selector-label">Channel</InputLabel>
                                <Select
                                        labelId="channel-selector-label"
                                        id="channel-selector"
                                        value= {this.state.selected_eeg_channel}
                                        label="EEG Channel"
                                        onChange={this.handleSelectEEGChannelChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.channels.map((channel) => (
                                            <MenuItem value={channel}>{channel}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select EEG Channel for the sleep staging</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="channel-eog-selector-label">Channel</InputLabel>
                                <Select
                                        labelId="channel-eog-selector-label"
                                        id="channel-eog-selector"
                                        value= {this.state.selected_eog_channel}
                                        label="EOG Channel"
                                        onChange={this.handleSelectEOGChannelChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.channels.map((channel) => (
                                            <MenuItem value={channel}>{channel}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select EOG Channel for the sleep staging</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="channel-emg-selector-label">Channel</InputLabel>
                                <Select
                                        labelId="channel-emg-selector-label"
                                        id="channel-emg-selector"
                                        value= {this.state.selected_emg_channel}
                                        label="EMG Channel"
                                        onChange={this.handleSelectEMGChannelChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.channels.map((channel) => (
                                            <MenuItem value={channel}>{channel}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select EMG Channel for the sleep staging</FormHelperText>
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
                                    <Tab label="Sleep Staging Results" {...a11yProps(1)} />
                                </Tabs>
                            </Box>

                        </Box>
                        <TabPanel value={this.state.tabvalue} index={0}>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={1}>
                            <DataGrid sx={{width:'90%', height:'550px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.result_sleep_stage}
                                      columns= {sleepStageColumns}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                            <DataGrid sx={{width:'90%', height:'550px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.result_sleep_stage_confidence}
                                      columns= {sleepStageConfidenceColumns}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                            {/*<img src={this.state.back_average_plot_path + "?random=" + new Date().getTime()}*/}
                            {/*     srcSet={this.state.back_average_plot_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                            {/*     loading="lazy"*/}
                            {/*/>*/}
                            {/*<img src={this.state.back_average_plot_path_1 + "?random=" + new Date().getTime()}*/}
                            {/*     srcSet={this.state.back_average_plot_path_1 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                            {/*     loading="lazy"*/}
                            {/*/>*/}
                        </TabPanel>

                        {/*<hr/>*/}

                        {/*<div style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="peridogram_chart_id" chart_data={ this.state.peridogram_chart_data}/></div>*/}
                        {/*<hr style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}/>*/}
                    </Grid>
                </Grid>
        )
    }
}

export default SleepStageClassificationPage;
