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
import {DataGrid, GridCell, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import InnerHTML from "dangerously-set-html-content";

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

const slowave_table_1_columns = [
    {
        field: "Start",
        headerName: "Start",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "NegPeak",
        headerName: "NegPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "MidCrossing",
        headerName: "MidCrossing",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PosPeak",
        headerName: "PosPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "End",
        headerName: "End",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Duration",
        headerName: "Duration",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValNegPeak",
        headerName: "ValNegPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValPosPeak",
        headerName: "ValPosPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PTP",
        headerName: "PTP",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Slope",
        headerName: "Slope",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Frequency",
        headerName: "Frequency",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "SigmaPeak",
        headerName: "SigmaPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PhaseAtSigmaPeak",
        headerName: "PhaseAtSigmaPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ndPAC",
        headerName: "ndPAC",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Stage",
        headerName: "Stage",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Channel",
        headerName: "Channel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "IdxChannel",
        headerName: "IdxChannel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
]

const slowave_table_2_columns = [
    {
        field: "Count",
        headerName: "Count",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Density",
        headerName: "Density",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Duration",
        headerName: "Duration",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValNegPeak",
        headerName: "ValNegPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValPosPeak",
        headerName: "ValPosPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PTP",
        headerName: "PTP",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Slope",
        headerName: "Slope",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Frequency",
        headerName: "Frequency",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PhaseAtSigmaPeak",
        headerName: "PhaseAtSigmaPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ndPAC",
        headerName: "ndPAC",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    }
]

const spindle_table_1_columns = [
    {
        field: "Start",
        headerName: "Start",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Peak",
        headerName: "Peak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "End",
        headerName: "End",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Duration",
        headerName: "Duration",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Amplitude",
        headerName: "Amplitude",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "RMS",
        headerName: "RMS",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "AbsPower",
        headerName: "AbsPower",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "RelPower",
        headerName: "RelPower",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Frequency",
        headerName: "Frequency",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Oscillations",
        headerName: "Oscillations",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Symmetry",
        headerName: "Symmetry",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Stage",
        headerName: "Stage",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Channel",
        headerName: "Channel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "IdxChannel",
        headerName: "IdxChannel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    }
]

const spindle_table_2_columns = [
    {
        field: "Count",
        headerName: "Count",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Density",
        headerName: "Density",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Duration",
        headerName: "Duration",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Amplitude",
        headerName: "Amplitude",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "RMS",
        headerName: "RMS",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "AbsPower",
        headerName: "AbsPower",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "RelPower",
        headerName: "RelPower",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Frequency",
        headerName: "Frequency",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Oscillations",
        headerName: "Oscillations",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    }
]

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
        this.state = {
            // Utils
            channels: [],
            tabvalue: 0,
            // Parameters
            general_sampling_freuency_hypno: 1/30,

            spindle_min_distance: 500,
            spindle_freq_sp_low: 12,
            spindle_freq_sp_high: 15,
            spindle_freq_broad_low: 1,
            spindle_freq_broad_high: 30,
            spindle_include_low: 2,
            spindle_include_high: 3,
            spindle_outliers: false,

            slowwave_freq_sw_low: 0.3,
            slowwave_freq_sw_high: 1.5,
            slowwave_dur_neg_low: 0.3,
            slowwave_dur_neg_high: 1.5,
            slowwave_dur_pos_low:0.1,
            slowwave_dur_pos_high:1,
            slowwave_amp_neg_low: 40,
            slowwave_amp_neg_high: 200,
            slowwave_amp_pos_low: 10,
            slowwave_amp_pos_high: 150,
            slowwave_amp_ppt_low: 75,
            slowwave_amp_ptp_high: 350,
            slowwave_include_low: 2,
            slowwave_include_high: 3,
            slowwave_outliers: true,
            slowwave_coupling: true,

            pac_window: 15,
            pac_step: 15,

            extra_pac_window: 15,
            extra_pac_step: 15,
            // Results
            results_show: false,

            result_spindles : {
                "data_frame_1" : null,
                "data_frame_2" : null,
            },
            result_spindles_dataframe_1_table : [],
            result_spindles_dataframe_2_table : [],

            result_slowwave : {
                "data_frame_1" : null,
                "data_frame_2" : null,
                "circular_mean" : null,
                "vector_length" : null,
            },
            result_slowave_dataframe_1_table : [],
            result_slowave_dataframe_2_table : [],
            result_pac : {

            },
            result_pac_extra : {

            },
            //Values selected currently on the form
            selected_channel: "",

        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);
        this.fetchChannels = this.fetchChannels.bind(this);

        this.fetchSpindles = this.fetchSpindles.bind(this);
        this.fetchSlowwave = this.fetchSlowwave.bind(this);
        this.fetchPAC = this.fetchPAC.bind(this);
        this.fetchPACExtra = this.fetchPACExtra.bind(this);
        this.handleChangeSamplingFrequencyHypnogram = this.handleChangeSamplingFrequencyHypnogram.bind(this);

        this.handleChangeSpindleMinDistance = this.handleChangeSpindleMinDistance.bind(this);
        this.handleChangeSpindleFreqSpLow = this.handleChangeSpindleFreqSpLow.bind(this);
        this.handleChangeSpindleFreqSpHigh = this.handleChangeSpindleFreqSpHigh.bind(this);
        this.handleChangeSpindleFreqBroadLow = this.handleChangeSpindleFreqBroadLow.bind(this);
        this.handleChangeSpindleFreqBroadHigh = this.handleChangeSpindleFreqBroadHigh.bind(this);
        this.handleChangeSpindleIncludeLow = this.handleChangeSpindleIncludeLow.bind(this);
        this.handleChangeSpindleIncludeHigh = this.handleChangeSpindleIncludeHigh.bind(this);
        this.handleChangeSpindleOutliers = this.handleChangeSpindleOutliers.bind(this);
        this.handleChangeSlowwaveFreqSwLow = this.handleChangeSlowwaveFreqSwLow.bind(this);
        this.handleChangeSlowwaveFreqSwHigh = this.handleChangeSlowwaveFreqSwHigh.bind(this);
        this.handleChangeSlowwaveDurNegLow = this.handleChangeSlowwaveDurNegLow.bind(this);
        this.handleChangeSlowwaveDurNegHigh = this.handleChangeSlowwaveDurNegHigh.bind(this);
        this.handleChangeSlowwaveDurPosLow = this.handleChangeSlowwaveDurPosLow.bind(this);
        this.handleChangeSlowwaveDurPosHigh = this.handleChangeSlowwaveDurPosHigh.bind(this);
        this.handleChangeSlowwaveAmpNegLow = this.handleChangeSlowwaveAmpNegLow.bind(this);
        this.handleChangeSlowwaveAmpNegHigh = this.handleChangeSlowwaveAmpNegHigh.bind(this);
        this.handleChangeSlowwaveAmpPosLow = this.handleChangeSlowwaveAmpPosLow.bind(this);
        this.handleChangeSlowwaveAmpPosHigh = this.handleChangeSlowwaveAmpPosHigh.bind(this);
        this.handleChangeSlowwaveAmpPptLow = this.handleChangeSlowwaveAmpPptLow.bind(this);
        this.handleChangeSlowwaveAmpPptHigh = this.handleChangeSlowwaveAmpPptHigh.bind(this);
        this.handleChangeSlowwaveIncludeLow = this.handleChangeSlowwaveIncludeLow.bind(this);
        this.handleChangeSlowwaveIncludeHigh = this.handleChangeSlowwaveIncludeHigh.bind(this);
        this.handleChangeSlowwaveOutliers = this.handleChangeSlowwaveOutliers.bind(this);
        this.handleChangeSlowwaveCoupling = this.handleChangeSlowwaveCoupling.bind(this);
        this.handleChangePacWindow = this.handleChangePacWindow.bind(this);
        this.handleChangePacStep = this.handleChangePacStep.bind(this);
        this.handleChangeExtraPacWindow = this.handleChangeExtraPacWindow.bind(this);
        this.handleChangeExtraPacStep = this.handleChangeExtraPacStep.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.fetchChannels()
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();

        await this.fetchSpindles();
        await this.fetchSlowwave();
        await this.fetchPAC();
        await this.fetchPACExtra();

        this.setState({results_show: true})

    }

    async fetchSpindles() {
        const params = new URLSearchParams(window.location.search);
        API.get("/spindles_detect_two_dataframes", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                min_distance: this.state.spindle_min_distance,
                freq_sp: [this.state.spindle_freq_sp_low, this.state.spindle_freq_sp_high],
                freq_broad: [this.state.spindle_freq_broad_low, this.state.spindle_freq_broad_high],
                include: [this.state.spindle_include_low, this.state.spindle_include_high],
                remove_outliers: this.state.spindle_outliers,
                current_sampling_frequency_of_the_hypnogram: this.state.general_sampling_freuency_hypno
                // name: this.state.selected_channel,
                // sampling_frequency: 1/30,
            }
        }).then(res => {
            console.log("SPINDLES")
            console.log(res.data)
            this.setState({result_spindles: res.data})
            this.setState({result_spindles_dataframe_1_table: JSON.parse(res.data.data_frame_1)})
            // this.setState({result_spindles_dataframe_2_table: JSON.parse(res.data.data_frame_2)})

            console.log( JSON.parse(res.data["data_frame_1"]))

        });
    }

    async fetchSlowwave() {
        const params = new URLSearchParams(window.location.search);
        API.get("/sw_detect_two_dataframes", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                freq_sw: [this.state.slowwave_freq_sw_low, this.state.slowwave_freq_sw_high],
                dur_neg: [this.state.slowwave_dur_neg_low, this.state.slowwave_dur_neg_high],
                dur_pos: [this.state.slowwave_dur_pos_low, this.state.slowwave_dur_pos_high],
                amp_neg: [this.state.slowwave_amp_neg_low, this.state.slowwave_amp_neg_high],
                amp_pos: [this.state.slowwave_amp_pos_low, this.state.slowwave_amp_pos_high],
                amp_ptp: [this.state.slowwave_amp_ppt_low, this.state.slowwave_amp_ptp_high],
                include: [this.state.slowwave_include_low, this.state.slowwave_include_high],
                remove_outliers: this.state.slowwave_outliers,
                coupling: this.state.slowwave_coupling,
                // current_sampling_frequency_of_the_hypnogram: this.state.general_sampling_freuency_hypno
                // name: this.state.selected_channel,
                // sampling_frequency: 1/30,
            }
        }).then(res => {
            console.log("Slowwave")
            console.log(res.data)
            console.log( JSON.parse(res.data["data_frame_1"]))
            // console.log( JSON.parse(res.data["circular_mean"]))
            // console.log( JSON.parse(res.data["vector_length"]))

            this.setState({result_slowwave: res.data})
            this.setState({result_slowave_dataframe_1_table: JSON.parse(res.data.data_frame_1)})
            // this.setState({result_slowave_dataframe_2_table: JSON.parse(res.data.data_frame_2)})

        });
    }

    async fetchPAC() {
        const params = new URLSearchParams(window.location.search);
        API.get("/PAC_values", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                window: this.state.pac_window,
                step: this.state.pac_step,
                current_sampling_frequency_of_the_hypnogram: this.state.general_sampling_freuency_hypno
                // name: this.state.selected_channel,
                // sampling_frequency: 1/30,
            }
        }).then(res => {
            console.log("PAC")
            console.log(res.data)
            this.setState({result_pac: res.data})
        });
    }

    async fetchPACExtra() {
        const params = new URLSearchParams(window.location.search);
        API.get("/extra_PAC_values", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                window: this.state.extra_pac_window,
                step: this.state.extra_pac_step,
                current_sampling_frequency_of_the_hypnogram: this.state.general_sampling_freuency_hypno
                // name: this.state.selected_channel,
                // sampling_frequency: 1/30,
            }
        }).then(res => {
            console.log("EXTRA_PAC")
            console.log(res.data)
            this.setState({result_extra_pac: res.data})
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

    handleChangeSpindleMinDistance(event) {
        this.setState({spindle_min_distance: event.target.value})
    }

    handleChangeSpindleFreqSpLow(event) {
        this.setState({spindle_freq_sp_low: event.target.value})
    }

    handleChangeSpindleFreqSpHigh(event) {
        this.setState({spindle_freq_sp_high: event.target.value})
    }

    handleChangeSpindleFreqBroadLow(event) {
        this.setState({spindle_freq_broad_low: event.target.value})
    }

    handleChangeSpindleFreqBroadHigh(event) {
        this.setState({spindle_freq_broad_high: event.target.value})
    }

    handleChangeSpindleIncludeLow(event) {
        this.setState({spindle_include_low: event.target.value})
    }

    handleChangeSpindleIncludeHigh(event) {
        this.setState({spindle_include_high: event.target.value})
    }

    handleChangeSpindleOutliers(event) {
        this.setState({spindle_outliers: event.target.value})
    }

    handleChangeSlowwaveFreqSwLow(event) {
        this.setState({slowwave_freq_sw_low: event.target.value})
    }

    handleChangeSlowwaveFreqSwHigh(event) {
        this.setState({slowwave_freq_sw_high: event.target.value})
    }

    handleChangeSlowwaveDurNegLow(event) {
        this.setState({slowwave_dur_neg_low: event.target.value})
    }

    handleChangeSlowwaveDurNegHigh(event) {
        this.setState({slowwave_dur_neg_high: event.target.value})
    }

    handleChangeSlowwaveDurPosLow(event) {
        this.setState({slowwave_dur_pos_low: event.target.value})
    }

    handleChangeSlowwaveDurPosHigh(event) {
        this.setState({slowwave_dur_pos_high: event.target.value})
    }
    handleChangeSlowwaveAmpNegLow(event) {
        this.setState({slowwave_amp_neg_low: event.target.value})
    }
    handleChangeSlowwaveAmpNegHigh(event) {
        this.setState({slowwave_amp_neg_high: event.target.value})
    }
    handleChangeSlowwaveAmpPosLow(event) {
        this.setState({slowwave_amp_pos_low: event.target.value})
    }
    handleChangeSlowwaveAmpPosHigh(event) {
        this.setState({slowwave_amp_pos_high: event.target.value})
    }
    handleChangeSlowwaveAmpPptLow(event) {
        this.setState({slowwave_amp_ppt_low: event.target.value})
    }
    handleChangeSlowwaveAmpPptHigh(event) {
        this.setState({slowwave_amp_ptp_high: event.target.value})
    }
    handleChangeSlowwaveIncludeLow(event) {
        this.setState({slowwave_include_low: event.target.value})
    }
    handleChangeSlowwaveIncludeHigh(event) {
        this.setState({slowwave_include_high: event.target.value})
    }
    handleChangeSlowwaveOutliers(event) {
        this.setState({slowwave_outliers: event.target.value})
    }
    handleChangeSlowwaveCoupling(event) {
        this.setState({slowwave_coupling: event.target.value})
    }

    handleChangePacWindow(event) {
        this.setState({pac_window: event.target.value})
    }

    handleChangePacStep(event) {
        this.setState({pac_step: event.target.value})
    }

    handleChangeExtraPacWindow(event) {
        this.setState({extra_pac_window: event.target.value})
    }

    handleChangeExtraPacStep(event) {
        this.setState({extra_pac_step: event.target.value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
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
                            Slowwave/Spindle Parameterisation
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
                            {/*<FormControl sx={{m: 1, width: '90%'}} size={"small"}>*/}
                            {/*    <InputLabel id="channel-selector-label">Channel</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="channel-selector-label"*/}
                            {/*            id="channel-selector"*/}
                            {/*            value={this.state.selected_channel}*/}
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
                            {/*    <FormHelperText>Select Channel to Auto Correlate</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <Divider/>
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
                                Spindles Parameterisation
                            </Typography>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="spindle-min-distance"
                                        value= {this.state.spindle_min_distance}
                                        label="Spindle Min Distance"
                                        size={"small"}
                                        onChange={this.handleChangeSpindleMinDistance}
                                />
                                <FormHelperText>Spindle Min Distance</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="spindle-freq-sp-low"
                                        value= {this.state.spindle_freq_sp_low}
                                        label="Spindle freq sp Low"
                                        size={"small"}
                                        onChange={this.handleChangeSpindleFreqSpLow}
                                />
                                <FormHelperText>Spindle Freq sp Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="spindle-freq-sp-high"
                                        value= {this.state.spindle_freq_sp_high}
                                        label="Spindle freq sp High"
                                        size={"small"}
                                        onChange={this.handleChangeSpindleFreqSpHigh}
                                />
                                <FormHelperText>Spindle Freq sp High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="spindle-freq-broad-low"
                                        value= {this.state.spindle_freq_broad_low}
                                        label="Spindle freq broad Low"
                                        size={"small"}
                                        onChange={this.handleChangeSpindleFreqBroadLow}
                                />
                                <FormHelperText>Spindle Freq broad Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="spindle-freq-broad-high"
                                        value= {this.state.spindle_freq_broad_high}
                                        label="Spindle freq broad High"
                                        size={"small"}
                                        onChange={this.handleChangeSpindleFreqBroadHigh}
                                />
                                <FormHelperText>Spindle Freq broad High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="spindle-include-low"
                                        value= {this.state.spindle_include_low}
                                        label="Spindle Include Low"
                                        size={"small"}
                                        onChange={this.handleChangeSpindleIncludeLow}
                                />
                                <FormHelperText>Spindle Freq broad Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="spindle-include-high"
                                        value= {this.state.spindle_include_high}
                                        label="Spindle Include High"
                                        size={"small"}
                                        onChange={this.handleChangeSpindleIncludeHigh}
                                />
                                <FormHelperText>Spindle Include High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="spindle-outliers-selector-label">Spindle Outliers</InputLabel>
                                <Select
                                        labelId="spindle-outliers-selector-label"
                                        id="spindle-outliers-selector"
                                        value={this.state.spindle_outliers}
                                        label="Spindle outliers"
                                        onChange={this.handleChangeSpindleOutliers}
                                >
                                    <MenuItem value="false">
                                        <em>False</em>
                                    </MenuItem>
                                    <MenuItem value="true">
                                        <em>True</em>
                                    </MenuItem>
                                </Select>
                                <FormHelperText>Spindle Outliers </FormHelperText>
                            </FormControl>
                            <Divider/>

                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Slowwaves Parameterisation
                            </Typography>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-freq-sw-low"
                                        value= {this.state.slowwave_freq_sw_low}
                                        label="Slowwave freq sw Low"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveFreqSwLow}
                                />
                                <FormHelperText>Slowwave Freq sw Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-freq-sw-high"
                                        value= {this.state.slowwave_freq_sw_high}
                                        label="Slowwave freq sw High"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveFreqSwHigh}
                                />
                                <FormHelperText>Slowwave Freq sw High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-freq-dur-neg-low"
                                        value= {this.state.slowwave_dur_neg_low}
                                        label="Slowwave freq dur neg Low"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveDurNegLow}
                                />
                                <FormHelperText>Slowwave Dur Neg Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-freq-dur-neg-high"
                                        value= {this.state.slowwave_dur_neg_high}
                                        label="Slowwave dur neg High"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveDurNegHigh}
                                />
                                <FormHelperText>Slowwave Dur Neg High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-freq-dur-pos-low"
                                        value= {this.state.slowwave_dur_pos_low}
                                        label="Slowwave freq dur pos Low"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveDurPosLow}
                                />
                                <FormHelperText>Slowwave Dur Pos Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-freq-dur-pos-high"
                                        value= {this.state.slowwave_dur_pos_high}
                                        label="Slowwave dur pos High"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveDurPosHigh}
                                />
                                <FormHelperText>Slowwave Dur Pos High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-amp-neg-low"
                                        value= {this.state.slowwave_amp_neg_low}
                                        label="Slowwave amp neg Low"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveAmpNegLow}
                                />
                                <FormHelperText>Slowwave Amp Neg Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-amp-neg-high"
                                        value= {this.state.slowwave_amp_neg_high}
                                        label="Slowwave amp neg High"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveAmpNegHigh}
                                />
                                <FormHelperText>Slowwave Amp Neg High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-amp-pos-low"
                                        value= {this.state.slowwave_amp_pos_low}
                                        label="Slowwave amp pos Low"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveAmpPosLow}
                                />
                                <FormHelperText>Slowwave Amp Pos Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-amp-pos-high"
                                        value= {this.state.slowwave_amp_pos_high}
                                        label="Slowwave amp pos High"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveAmpPosHigh}
                                />
                                <FormHelperText>Slowwave Amp Pos High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-amp-ptp-low"
                                        value= {this.state.slowwave_amp_ppt_low}
                                        label="Slowwave amp ptp Low"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveAmpPptLow}
                                />
                                <FormHelperText>Slowwave Amp ptp Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-amp-ptp-high"
                                        value= {this.state.slowwave_amp_ptp_high}
                                        label="Slowwave amp ptp High"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveAmpPptHigh}
                                />
                                <FormHelperText>Slowwave Amp ptp High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-include-low"
                                        value= {this.state.slowwave_include_low}
                                        label="Slowwave Include Low"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveIncludeLow}
                                />
                                <FormHelperText>Slowwave Amp ptp Low</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="slowwave-include-high"
                                        value= {this.state.slowwave_include_high}
                                        label="Slowwave Include High"
                                        size={"small"}
                                        onChange={this.handleChangeSlowwaveIncludeHigh}
                                />
                                <FormHelperText>Slowwave Amp ptp High</FormHelperText>
                            </FormControl>
                            <Divider sx={{opacity: 0.4}}/>

                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="slowwave-outliers-selector-label">Slowwave Outliers</InputLabel>
                                <Select
                                        labelId="slowwave-outliers-selector-label"
                                        id="slowwave-outliers-selector"
                                        value={this.state.slowwave_outliers}
                                        label="Slowwave outliers"
                                        onChange={this.handleChangeSlowwaveOutliers}
                                >
                                    <MenuItem value="false">
                                        <em>False</em>
                                    </MenuItem>
                                    <MenuItem value="true">
                                        <em>True</em>
                                    </MenuItem>
                                </Select>
                                <FormHelperText>Slowwave Outliers </FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="slowwave-coupling-selector-label">Slowwave Coupling</InputLabel>
                                <Select
                                        labelId="slowwave-coupling-selector-label"
                                        id="slowwave-coupling-selector"
                                        value={this.state.slowwave_coupling}
                                        label="Spindle coupling"
                                        onChange={this.handleChangeSlowwaveCoupling}
                                >
                                    <MenuItem value="false">
                                        <em>False</em>
                                    </MenuItem>
                                    <MenuItem value="true">
                                        <em>True</em>
                                    </MenuItem>
                                </Select>
                                <FormHelperText>Slowwave Coupling </FormHelperText>
                            </FormControl>
                            <Divider/>

                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                PAC Parameterisation
                            </Typography>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="pac-window"
                                        value= {this.state.pac_window}
                                        label="PAC Window"
                                        size={"small"}
                                        onChange={this.handleChangePacWindow}
                                />
                                <FormHelperText>PAC Window</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="pac-step"
                                        value= {this.state.pac_step}
                                        label="PAC Step"
                                        size={"small"}
                                        onChange={this.handleChangePacStep}
                                />
                                <FormHelperText>PAC Step</FormHelperText>
                            </FormControl>
                            <Divider/>

                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Extra PAC Parameterisation
                            </Typography>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="extra-pac-window"
                                        value= {this.state.extra_pac_window}
                                        label="Extra PAC Window"
                                        size={"small"}
                                        onChange={this.handleChangeExtraPacWindow}
                                />
                                <FormHelperText>PAC Window</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'45%'}} size={"small"}>
                                <TextField
                                        id="extra-pac-step"
                                        value= {this.state.extra_pac_step}
                                        label="Extra PAC Step"
                                        size={"small"}
                                        onChange={this.handleChangeExtraPacStep}
                                />
                                <FormHelperText>PAC Step</FormHelperText>
                            </FormControl>
                            <Divider/>
                            <Button sx={{float: "left", marginLeft: "2px"}} variant="contained" color="primary"
                                    type="submit">
                                Submit
                            </Button>
                            <Button onClick={this.debug} variant="contained" color="secondary"
                                    sx={{margin: "8px", float: "right"}}>
                                Debug
                            </Button>
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
                                    <Tab label="Slowwaves Results" {...a11yProps(1)} />
                                    <Tab label="Spindles results" {...a11yProps(2)} />
                                    <Tab label="PAC results" {...a11yProps(3)} />
                                    <Tab label="Extra PAC results" {...a11yProps(4)} />
                                    <Tab label="All Results" {...a11yProps(5)} />
                                </Tabs>
                            </Box>

                        </Box>
                        <TabPanel value={this.state.tabvalue} index={0}>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={1}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Slowwaves Results
                            </Typography>
                            {/*<Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Circular Mean: { this.state.result_slowwave["circular_mean"]}</Typography>*/}
                            {/*<Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Vector Length: { this.state.result_slowwave["vector_length"]}</Typography>*/}

                            <Grid item xs={6}
                                  style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}}>
                                <img
                                        src={`http://localhost:8000/static/slowwaves.png?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`http://localhost:8000/static/slowwaves.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        // alt={item.title}
                                        loading="lazy"
                                />
                                {/*<InnerHTML html={this.state.result_spectogram["figure"]["figure"]}*/}
                                {/*           style={{zoom: '50%'}}/>*/}
                                <hr className="result"/>
                            </Grid>
                            <Grid item xs={6}
                                  style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}}>
                                <img
                                        src={`http://localhost:8000/static/rose_plot.png?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`http://localhost:8000/static/rose_plot.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        // alt={item.title}
                                        loading="lazy"
                                />
                                {/*<InnerHTML html={this.state.result_spectogram["figure"]["figure"]}*/}
                                {/*           style={{zoom: '50%'}}/>*/}
                                <hr className="result"/>
                            </Grid>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.result_slowave_dataframe_1_table}
                                      columns= {slowave_table_1_columns}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />

                            {/*<DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}*/}
                            {/*          zeroMinWidth*/}
                            {/*          rowHeight={40}*/}
                            {/*          className="datagrid"*/}
                            {/*          rows= {this.state.result_slowave_dataframe_2_table}*/}
                            {/*          columns= {slowave_table_2_columns}*/}
                            {/*          pageSize= {10}*/}
                            {/*          rowsPerPageOptions={[10]}*/}
                            {/*          components={{*/}
                            {/*              Toolbar: CustomToolbar,*/}
                            {/*          }}*/}
                            {/*/>*/}


                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={2}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Spindles Results
                            </Typography>
                            <Grid item xs={6}
                                  style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}}>
                                <img
                                        src={`http://localhost:8000/static/spindles.png?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`http://localhost:8000/static/spindles.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        // alt={item.title}
                                        loading="lazy"
                                />
                                {/*<InnerHTML html={this.state.result_spectogram["figure"]["figure"]}*/}
                                {/*           style={{zoom: '50%'}}/>*/}
                                <hr className="result"/>
                            </Grid>
                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>
                            <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                      zeroMinWidth
                                      rowHeight={40}
                                      className="datagrid"
                                      rows= {this.state.result_spindles_dataframe_1_table}
                                      columns= {spindle_table_1_columns}
                                      pageSize= {10}
                                      rowsPerPageOptions={[10]}
                                      components={{
                                          Toolbar: CustomToolbar,
                                      }}
                            />
                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>
                            {/*<DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}*/}
                            {/*          zeroMinWidth*/}
                            {/*          rowHeight={40}*/}
                            {/*          className="datagrid"*/}
                            {/*          rows= {this.state.result_spindles_dataframe_2_table}*/}
                            {/*          columns= {spindle_table_2_columns}*/}
                            {/*          pageSize= {10}*/}
                            {/*          rowsPerPageOptions={[10]}*/}
                            {/*          components={{*/}
                            {/*              Toolbar: CustomToolbar,*/}
                            {/*          }}*/}
                            {/*/>*/}
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={3}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                PAC Values Results
                            </Typography>
                            <Grid item xs={12}
                                  style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}}>
                                <img
                                        src={`http://localhost:8000/static/pac_values.png?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`http://localhost:8000/static/pac_values.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        // alt={item.title}
                                        loading="lazy"
                                />
                                {/*<InnerHTML html={this.state.result_spectogram["figure"]["figure"]}*/}
                                {/*           style={{zoom: '50%'}}/>*/}
                                <hr className="result"/>
                            </Grid>
                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={4}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                PAC Extra Results
                            </Typography>
                            <Grid item xs={12}
                                  style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}}>
                                <img
                                        src={`http://localhost:8000/static/extra_pac_values.png?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`http://localhost:8000/static/extra_pac_values.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        // alt={item.title}
                                        loading="lazy"
                                />
                                {/*<InnerHTML html={this.state.result_spectogram["figure"]["figure"]}*/}
                                {/*           style={{zoom: '50%'}}/>*/}
                                <hr className="result"/>
                            </Grid>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={5}>
                        </TabPanel>
                        <Grid container direction="row" style={{display: (this.state.results_show ? 'block' : 'none')}}>





                        </Grid>
                        {/*<NewWindow>*/}
                        {/*    <EEGSelector/>*/}
                        {/*</NewWindow>*/}
                    </Grid>
                </Grid>
        )
    }
}

export default SlowwaveSpindleFunctionPage;
