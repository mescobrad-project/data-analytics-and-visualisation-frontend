import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "../../pages/hypothesis_testing/normality_tests.scss";
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem, Modal,
    Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import EEGSelector from "./EEGSelector";
import {Box} from "@mui/system";
import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import {useLocation} from "react-router-dom";
import {GridCell, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import InnerHTML from "dangerously-set-html-content";
import qs from "qs";
import ProceedButton from "../ui-components/ProceedButton";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95%",
    height: "95%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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

class SlowwaveSpindleFunctionPage extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // Utils
            channels: [],
            tabvalue: 0,
            // Parameters
            general_sampling_freuency_hypno: 1/30,
            bandpower_relative: false,
            bandpower_bandpass: false,
            bandpower_include: [2,3],
            bandpower_include_low: 2,
            bandpower_include_high: 3,


            // Results
            results_show: false,

            result_band_power: {
                "bandpower" : null,
            },
            result_spectogram: {
                "figure": {"figure": []}
            },


            //Values selected currently on the form
            selected_channel: "",
            spectogram_path: ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/spectrogram.png',
        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.fetchChannels = this.fetchChannels.bind(this);

        this.fetchBandPower = this.fetchBandPower.bind(this);
        this.fetchSpectogram = this.fetchSpectogram.bind(this);

        this.handleChangeSamplingFrequencyHypnogram = this.handleChangeSamplingFrequencyHypnogram.bind(this);
        this.handleChangeBandpowerRelative = this.handleChangeBandpowerRelative.bind(this);
        this.handleChangeBandpowerBandpass = this.handleChangeBandpowerBandpass.bind(this);
        this.handleChangeBandpowerIncludeLow = this.handleChangeBandpowerIncludeLow.bind(this);
        this.handleChangeBandpowerIncludeHigh = this.handleChangeBandpowerIncludeHigh.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleChangeBandpowerInclude = this.handleChangeBandpowerInclude.bind(this);
        this.clear = this.clear.bind(this);
        this.selectAll = this.selectAll.bind(this);

        this.fetchChannels()
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();


        await this.fetchBandPower();
        await this.fetchSpectogram();


        this.setState({results_show: true})

        // const params = new URLSearchParams(window.location.search);
        // // Send the request
        // console.log("STUFF")
        // console.log(this.state.file_used)
        // API.get("return_autocorrelation",
        //         {
        //             params: {
        //
        //             }
        //         }
        // ).then(res => {
        //
        // });

    }


    async fetchBandPower() {
        const params = new URLSearchParams(window.location.search);
        console.log("Include")
        console.log(this.state.bandpower_include)
        console.log(typeof this.state.bandpower_include[0])
        let include_to_send = []
        for (let i = 0; i < this.state.bandpower_include.length; i++) {
            include_to_send.push(parseInt(this.state.bandpower_include[i]))
        }
        console.log(include_to_send)
        console.log(typeof include_to_send[0])

        API.get("/bandpower_yasa", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                relative: this.state.bandpower_relative,
                bandpass: this.state.bandpower_bandpass,
                // include: [this.state.bandpower_include_low, this.state.bandpower_include_high],
                include: include_to_send,
                sampling_frequency: this.state.general_sampling_freuency_hypno
            },
            paramsSerializer: params => {
                return qs.stringify(params, { arrayFormat: "repeat" })
            }
        }).then(res => {
            this.setState({result_band_power: res.data})
            console.log("BAND POWER")
            console.log(res.data)

        });
    }

    async fetchSpectogram() {
        const params = new URLSearchParams(window.location.search);
        API.get("/spectrogram_yasa", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                name: this.state.selected_channel,
                // sampling_frequency: 1/30,
            }
        }).then(res => {
            console.log("SPECTOGRAM")
            console.log(res.data)
            this.setState({result_spectogram: res.data})
        });
    }

    async fetchChannels() {
        const params = new URLSearchParams(window.location.search);
        API.get("/list/channels/slowwave", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }

        }).then(res => {
            this.setState({channels: res.data.channels})
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectChannelChange(event) {
        this.setState({selected_channel: event.target.value})
    }

    handleChangeSamplingFrequencyHypnogram(event) {
        this.setState({general_sampling_freuency_hypno: event.target.value})
    }

    handleChangeBandpowerRelative(event) {
        this.setState({bandpower_relative: event.target.value})
    }

    handleChangeBandpowerBandpass(event) {
        this.setState({bandpower_bandpass: event.target.value})
    }

    handleChangeBandpowerIncludeLow(event) {
        this.setState({bandpower_include_low: event.target.value})
    }

    handleChangeBandpowerIncludeHigh(event) {
        this.setState({bandpower_include_high: event.target.value})
    }

    handleChangeBandpowerInclude(event) {
        this.setState({bandpower_include: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    clear(){
        this.setState({bandpower_include: []})
    }
    selectAll(){
        this.setState({bandpower_include: [-2,-1,0,1,2,3,4]})
    }

    debug = () => {
        console.log("DEBUG")
        // console.log(this.state.result_sleep_transition_matrix["figure"]["figure"])
        // console.log(JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"]))
        // console.log(JSON.parse(this.state.result_sleep_transition_matrix["counts_transition_matrix"]))
        // console.log(JSON.parse(this.state.result_sleep_transition_matrix["conditional_probability_transition_matrix"]))
        // console.log(JSON.parse(this.state.result_sleep_stability_extraction["sleep_stage_stability"]))
        console.log(JSON.parse(this.state.result_band_power["bandpower"]))
        // console.log(JSON.parse(this.state.result_spectogram["figure"]["figure"]))
        console.log(this.state.result_spectogram["figure"]["figure"])

    };

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            Spectogram/Bandpower Parameterisation
                        </Typography>
                        <Divider sx={{bgcolor: "black"}}/>

                        {/*<Button variant="contained" color="primary" sx={{marginLeft: "25%"}} disabled={(this.state.selected_part_channel === "" ? true : false)} onClick={this.handleModalOpen}>Open modal</Button>*/}
                        {/*<Modal*/}
                        {/*        open={this.state.open_modal}*/}
                        {/*        onClose={this.handleModalClose}*/}
                        {/*        aria-labelledby="modal-modal-title"*/}
                        {/*        aria-describedby="modal-modal-description"*/}
                        {/*        // disableEnforceFocus={true}*/}
                        {/*>*/}
                        {/*    <Box sx={style}>*/}
                        {/*        <Typography id="modal-modal-title" variant="h6" component="h2">*/}
                        {/*            Select channels and time range | Print to EDF and Save*/}
                        {/*        </Typography>*/}
                        {/*        <EEGSelector/>*/}
                        {/*    </Box>*/}
                        {/*</Modal>*/}
                        <Divider/>
                        {/* The form only appears when this.state.channels has any value which happens only when the forms
                    knows what file to access*/}
                        <form onSubmit={this.handleSubmit}
                              style={{display: (this.state.channels.length != 0 ? 'block' : 'none')}}>

                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                General Parameterisation
                            </Typography>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        id="sampling-frequency-hypnogram"
                                        value= {this.state.general_sampling_freuency_hypno}
                                        label="Sampling Frequency of Hypnogram"
                                        size={"small"}
                                        onChange={this.handleSelectNlagsChange}
                                />
                                <FormHelperText>Current Sampling Frequency of Hypnogram</FormHelperText>
                            </FormControl>
                            <Divider/>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Spectogram Parameterisation
                            </Typography>
                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="channel-selector-label">Channel</InputLabel>
                                <Select
                                        labelId="channel-selector-label"
                                        id="channel-selector"
                                        value={this.state.selected_channel}
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
                            <Divider/>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Bandpower Parameterisation
                            </Typography>
                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="bandpower-relative-selector-label">Bandpower Relative</InputLabel>
                                <Select
                                        labelId="bandpower-relative-selector-label"
                                        id="bandpower-relative-selector"
                                        value={this.state.bandpower_relative}
                                        label="Bandpower Relative"
                                        onChange={this.handleChangeBandpowerRelative}
                                >
                                    <MenuItem value="false">
                                        <em>False</em>
                                    </MenuItem>
                                    <MenuItem value="true">
                                        <em>True</em>
                                    </MenuItem>
                                </Select>
                                <FormHelperText>Bandpower Relative </FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>
                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="bandpower-bandpass-selector-label">Bandpower Bandpass</InputLabel>
                                <Select
                                        labelId="bandpower-bandpass-selector-label"
                                        id="bandpower-bandpass-selector"
                                        value={this.state.bandpower_bandpass}
                                        label="Bandpower Bandpass"
                                        onChange={this.handleChangeBandpowerBandpass}
                                >
                                    <MenuItem value="false">
                                        <em>False</em>
                                    </MenuItem>
                                    <MenuItem value="true">
                                        <em>True</em>
                                    </MenuItem>
                                </Select>
                                <FormHelperText>Bandpower Bandpass </FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                <FormHelperText>Selected Variables</FormHelperText>
                                <List style={{fontSize:'9px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                    {this.state.bandpower_include.map((column) => (
                                            <ListItem disablePadding
                                            >
                                                <ListItemText
                                                        primaryTypographyProps={{fontSize: '10px'}}
                                                        primary={'•  ' + column}
                                                />

                                            </ListItem>
                                    ))}
                                </List>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="include-selector-label">Sleep Stages to include</InputLabel>
                                <Select
                                        labelId="include-selector-label"
                                        id="include-selector"
                                        value= {this.state.bandpower_include}
                                        multiple
                                        label="Include"
                                        onChange={this.handleChangeBandpowerInclude}
                                >
                                    <MenuItem value="-2">Unscored</MenuItem>
                                    <MenuItem value="-1">Artefact/Movement</MenuItem>
                                    <MenuItem value="0">Wake</MenuItem>
                                    <MenuItem value="1">N1 Sleep</MenuItem>
                                    <MenuItem value="2">N2 Sleep</MenuItem>
                                    <MenuItem value="3">N3 Sleep</MenuItem>
                                    <MenuItem value="4">REM Sleep</MenuItem>
                                </Select>
                                <FormHelperText>Select which hypnogram sleep stages to be included in the analysis</FormHelperText>
                                <Button onClick={this.selectAll}>
                                    Select All Variables
                                </Button>
                                <Button onClick={this.clear}>
                                    Clear Selections
                                </Button>
                            </FormControl>


                            {/*<FormControl sx={{m: 1, width:'45%'}} size={"small"}>*/}
                            {/*    <TextField*/}
                            {/*            id="bandpower-include-low"*/}
                            {/*            value= {this.state.bandpower_include_low}*/}
                            {/*            label="Bandpower Include Low"*/}
                            {/*            size={"small"}*/}
                            {/*            onChange={this.handleChangeBandpowerIncludeLow}*/}
                            {/*    />*/}
                            {/*    <FormHelperText>Bandpower Include Low</FormHelperText>*/}
                            {/*</FormControl>*/}
                            {/*<FormControl sx={{m: 1, width:'45%'}} size={"small"}>*/}
                            {/*    <TextField*/}
                            {/*            id="bandpower-include-high"*/}
                            {/*            value= {this.state.bandpower_include_high}*/}
                            {/*            label="Bandpower Include high"*/}
                            {/*            size={"small"}*/}
                            {/*            onChange={this.handleChangeBandpowerIncludeHigh}*/}
                            {/*    />*/}
                            {/*    <FormHelperText>Bandpower Include High</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <Divider/>
                            <Button sx={{float: "left", marginLeft: "2px"}} variant="contained" color="primary"
                                    type="submit">
                                Submit
                            </Button>
                            <ProceedButton></ProceedButton>

                            {/*<Button onClick={this.debug} variant="contained" color="secondary"*/}
                            {/*        sx={{margin: "8px", float: "right"}}>*/}
                            {/*    Debug*/}
                            {/*</Button>*/}
                        </form>
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            window.location.replace("/")
                            // Send the request
                        }}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary"
                                    type="submit">
                                Proceed >
                            </Button>
                        </form>
                    </Grid>

                    {/*<Divider/>*/}
                    <Grid xs={8} direction='column'>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            Result Visualisation
                        </Typography>
                        <Divider sx={{bgcolor: "black"}}/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Bandpower Results" {...a11yProps(1)} />
                                    <Tab label="Spectogram Results" {...a11yProps(2)} />
                                    <Tab label="All Results" {...a11yProps(3)} />
                                </Tabs>
                            </Box>

                        </Box>
                        <TabPanel value={this.state.tabvalue} index={0}>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={1}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Bandpower Results
                            </Typography>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width: '90%'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{alignContent: "right"}}>
                                            <TableCell className="tableHeadCell">Stage/Channel</TableCell>
                                            <TableCell className="tableHeadCell">Delta</TableCell>
                                            <TableCell className="tableHeadCell">Theta</TableCell>
                                            <TableCell className="tableHeadCell">Alpha</TableCell>
                                            <TableCell className="tableHeadCell">Sigma</TableCell>
                                            <TableCell className="tableHeadCell">Beta</TableCell>
                                            <TableCell className="tableHeadCell">Gamma</TableCell>
                                            <TableCell className="tableHeadCell">TotalAbsPow</TableCell>
                                            <TableCell className="tableHeadCell">FreqRes</TableCell>
                                            <TableCell className="tableHeadCell">Relative</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { (  this.state.result_band_power["bandpower"] ? JSON.parse(this.state.result_band_power["bandpower"])["data"] : []).map((item) => {
                                            return (
                                                    <TableRow>
                                                        <TableCell
                                                                className="tableCell"> { item[9] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> {  item[0] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[1] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[2] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[3] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> {  item[4] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[5] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[6] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[7] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[8].toString() } </TableCell>

                                                    </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={2}>
                            <Grid item xs={6}
                                  style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}}>
                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Spectogram Results
                                </Typography>
                                <img src={this.state.spectogram_path + "?random=" + new Date().getTime()}
                                     srcSet={this.state.spectogram_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                     loading="lazy"
                                />
                                {/*<img*/}
                                {/*        src={`http://localhost:8000/static/spectrogram.png?w=164&h=164&fit=crop&auto=format`}*/}
                                {/*        srcSet={`http://localhost:8000/static/spectrogram.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                                {/*        // alt={item.title}*/}
                                {/*        loading="lazy"*/}
                                {/*/>*/}
                                {/*<InnerHTML html={this.state.result_spectogram["figure"]["figure"]}*/}
                                {/*           style={{zoom: '50%'}}/>*/}
                                <hr className="result"/>
                            </Grid>
                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>

                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={3}>
                        </TabPanel>
                    </Grid>
                </Grid>
        )
    }
}

export default SlowwaveSpindleFunctionPage;
