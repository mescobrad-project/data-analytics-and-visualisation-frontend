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

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import {Box} from "@mui/system";
import {GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../ui-components/ProceedButton";

// const alpha_delta_ratio_table_columns = [
//     {
//         field: "Band",
//         headerName: "Band",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Power",
//         headerName: "Power",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Peak",
//         headerName: "Peak",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Be",
//         headerName: "PosPeak",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "End",
//         headerName: "End",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Duration",
//         headerName: "Duration",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "ValNegPeak",
//         headerName: "ValNegPeak",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "ValPosPeak",
//         headerName: "ValPosPeak",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "PTP",
//         headerName: "PTP",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Slope",
//         headerName: "Slope",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Frequency",
//         headerName: "Frequency",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "SigmaPeak",
//         headerName: "SigmaPeak",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "PhaseAtSigmaPeak",
//         headerName: "PhaseAtSigmaPeak",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "ndPAC",
//         headerName: "ndPAC",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Stage",
//         headerName: "Stage",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "Channel",
//         headerName: "Channel",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
//     {
//         field: "IdxChannel",
//         headerName: "IdxChannel",
//         width: '10%',
//         align: "center",
//         headerAlign: "center",
//         flex:1
//     },
// ]



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


class PowerSpectralDensityPage extends React.Component {
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

            //Values selected currently on the form
            selected_type_psd: "welch",

            // All
            selected_channel: "",

            // Periodogram Values
            selected_periodogram_window: "hann",
            selected_periodogram_nfft: "256",
            selected_periodogram_return_onesided: true,
            selected_periodogram_scaling: "density",
            selected_periodogram_axis: "-1",

            //Periodogram Alpha Delta Ratio
            result_periodogram_alpha_delta_ratio: "",
            result_periodogram_alpha_delta_ratio_dataframe: [],

            // Welch Values
            selected_welch_window: "hann",
            selected_welch_nperseg: "256",
            selected_welch_noverlap: "",
            selected_welch_nfft: "256",
            selected_welch_return_onesided: true,
            selected_welch_scaling: "density",
            selected_welch_axis: "-1",
            selected_welch_average: "mean",

            result_welch_alpha_delta_ratio: "",
            result_welch_alpha_delta_ratio_dataframe: [],

            result_welch_alpha_variability: "",
            // Multitaper Values
            selected_multitaper_fmin: "0",
            selected_multitaper_fmax: "",
            selected_multitaper_bandwidth: "",
            selected_multitaper_adaptive: false,
            selected_multitaper_low_bias: true,
            selected_multitaper_normalization: "length",
            selected_multitaper_output: "power",
            selected_multitaper_n_jobs: "1",
            selected_multitaper_verbose: "",

            // Values to pass to visualisations
            periodogram_chart_data : [],

            // Visualisation Hide/Show values
            periodogram_chart_show : false,

            //Info from selector
            file_used: null,
            periodogram_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/periodogram_plot.png',
            welch_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/welch_plot.png',
            multitaper_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/multitaper_plot.png',
        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectTypePSDChange = this.handleSelectTypePSDChange.bind(this);
        this.handleSelectChannelChange = this.handleSelectChannelChange.bind(this);

        // Periodogram
        this.handleSelectPeriodogramWindowChange = this.handleSelectPeriodogramWindowChange.bind(this);
        this.handleSelectPeriodogramNfftChange = this.handleSelectPeriodogramNfftChange.bind(this);
        this.handleSelectPeriodogramReturnonesidedChange = this.handleSelectPeriodogramReturnonesidedChange.bind(this);
        this.handleSelectPeriodogramScalingChange = this.handleSelectPeriodogramScalingChange.bind(this);
        this.handleSelectPeriodogramAxisChange = this.handleSelectPeriodogramAxisChange.bind(this);

        // Welch
        this.handleSelectWelchWindowChange = this.handleSelectWelchWindowChange.bind(this);
        this.handleSelectWelchNpersegChange = this.handleSelectWelchNpersegChange.bind(this);
        this.handleSelectWelchNoverlapChange = this.handleSelectWelchNoverlapChange.bind(this);
        this.handleSelectWelchNfftChange = this.handleSelectWelchNfftChange.bind(this);
        this.handleSelectWelchReturnonesidedChange = this.handleSelectWelchReturnonesidedChange.bind(this);
        this.handleSelectWelchScalingChange = this.handleSelectWelchScalingChange.bind(this);
        this.handleSelectWelchAxisChange = this.handleSelectWelchAxisChange.bind(this);
        this.handleSelectWelchAverageChange = this.handleSelectWelchAverageChange.bind(this);

        // Multitaper
        this.handleSelectMultitaperFMinChange = this.handleSelectMultitaperFMinChange.bind(this);
        this.handleSelectMultitaperFMaxChange = this.handleSelectMultitaperFMaxChange.bind(this);
        this.handleSelectMultitaperBandwidthChange = this.handleSelectMultitaperBandwidthChange.bind(this);
        this.handleSelectMultitaperAdaptiveTypeChange = this.handleSelectMultitaperAdaptiveTypeChange.bind(this);
        this.handleSelectMultitaperLowBiasChange = this.handleSelectMultitaperLowBiasChange.bind(this);
        this.handleSelectMultitaperNormalizationChange = this.handleSelectMultitaperNormalizationChange.bind(this);
        this.handleSelectMultitaperOutputChange = this.handleSelectMultitaperOutputChange.bind(this);
        this.handleSelectMultitaperNJobsChange = this.handleSelectMultitaperNJobsChange.bind(this);
        this.handleSelectMultitaperVerboseChange = this.handleSelectMultitaperVerboseChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);

        this.handleChannelChange = this.handleChannelChange.bind(this);
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

        if (this.state.selected_type_psd === "periodogram"){
            // Convert nfft from string to int
            let to_send_input_nfft = null;

            if (!!this.state.selected_periodogram_nfft){
                to_send_input_nfft = parseInt(this.state.selected_periodogram_nfft)
            }

            //Reset view of optional visualisations preview
            this.setState({periodogram_chart_show: false})

            console.log(
                    {input_name: this.state.selected_channel,
                        input_window: this.state.selected_window,
                        input_nfft: to_send_input_nfft,
                        input_return_onesided: this.state.selected_return_onesided,
                        input_scaling: this.state.selected_scaling,
                        input_axis: this.state.selected_axis}
            )

            // Send the request
            API.get("return_periodogram",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"),
                            run_id: params.get("run_id"),
                            step_id: params.get("step_id"),
                            input_name: this.state.selected_channel,
                            input_window: this.state.selected_periodogram_window,
                            input_nfft: to_send_input_nfft,
                            input_return_onesided: this.state.selected_periodogram_return_onesided,
                            input_scaling: this.state.selected_periodogram_scaling,
                            input_axis: this.state.selected_periodogram_axis,
                            file_used: this.state.file_used
                        }
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

            // Retrieve alpha variability periodogram information
            API.get("return_alpha_delta_ratio_periodogram",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"),
                            run_id: params.get("run_id"),
                            step_id: params.get("step_id"),
                            input_name: this.state.selected_channel,
                            input_window: this.state.selected_periodogram_window,
                            input_nfft: to_send_input_nfft,
                            input_return_onesided: this.state.selected_periodogram_return_onesided,
                            input_scaling: this.state.selected_periodogram_scaling,
                            input_axis: this.state.selected_periodogram_axis,
                            file_used: this.state.file_used
                        }
                    }
            ).then(res => {
                const resultJson = res.data;
                console.log('return_alpha_delta_ratio_periodogram')
                console.log(resultJson)
                this.setState({result_periodogram_alpha_delta_ratio: resultJson['alpha_delta_ratio']})
                this.setState({result_periodogram_alpha_delta_ratio_dataframe:  JSON.parse(resultJson['alpha_delta_ratio_df'])})
                // Clear alpha variability since it isn't returned in this case
                this.setState({result_welch_alpha_variability: 0})

            });

        }else if (this.state.selected_type_psd === "welch")
        {
            let to_send_input_nperseg = null;
            let to_send_input_noverlap = null;
            let to_send_input_nfft = null;

            if (!!this.state.selected_welch_nperseg){
                to_send_input_nperseg = parseInt(this.state.selected_welch_nperseg)
            }

            if (!!this.state.selected_welch_noverlap){
                to_send_input_noverlap = parseInt(this.state.selected_welch_noverlap)
            }

            if (!!this.state.selected_welch_nfft){
                to_send_input_nfft = parseInt(this.state.selected_welch_nfft)
            }

            //Reset view of optional visualisations preview
            // this.setState({welch_chart_show: false})




            // Send the request
            API.get("return_welch",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"),
                            run_id: params.get("run_id"),
                            step_id: params.get("step_id"),
                            input_name: this.state.selected_channel,
                            input_window: this.state.selected_welch_window,
                            input_nperseg: to_send_input_nperseg,
                            input_noverlap: to_send_input_noverlap,
                            input_nfft: to_send_input_nfft,
                            input_return_onesided: this.state.selected_welch_return_onesided,
                            input_scaling: this.state.selected_welch_scaling,
                            input_axis: this.state.selected_welch_axis,
                            input_average: this.state.selected_welch_average,
                            file_used: this.state.file_used
                        }
                    }
            ).then(res => {
                const resultJson = res.data;
                console.log(resultJson)
                console.log('Test')
                // let temp_array_welch = []
                // for ( let it =0 ; it < resultJson['power spectral density'].length; it++){
                //     let temp_object = {}
                //     temp_object["category"] = resultJson['frequencies'][it]
                //     temp_object["yValue"] = resultJson['power spectral density'][it]
                //     temp_array_welch.push(temp_object)
                // }
                // console.log("")
                // console.log(temp_array)
                // this.setState({welch_chart_data: temp_array_welch})
                // this.setState({welch_chart_show: true})
            });

            API.get("return_alpha_variability",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"),
                            run_id: params.get("run_id"),
                            step_id: params.get("step_id"),
                            input_name: this.state.selected_channel,
                            input_window: this.state.selected_welch_window,
                            input_nperseg: to_send_input_nperseg,
                            input_noverlap: to_send_input_noverlap,
                            input_nfft: to_send_input_nfft,
                            input_return_onesided: this.state.selected_welch_return_onesided,
                            input_scaling: this.state.selected_welch_scaling,
                            input_axis: this.state.selected_welch_axis,
                            input_average: this.state.selected_welch_average,
                            file_used: this.state.file_used
                        }
                    }
            ).then(res => {
                const resultJson = res.data;
                console.log(resultJson)
                console.log('Test')

                this.setState({result_welch_alpha_variability: resultJson['alpha_variability']})
            });

            API.get("return_alpha_delta_ratio",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"),
                            run_id: params.get("run_id"),
                            step_id: params.get("step_id"),
                            input_name: this.state.selected_channel,
                            input_window: this.state.selected_welch_window,
                            input_nperseg: to_send_input_nperseg,
                            input_noverlap: to_send_input_noverlap,
                            input_nfft: to_send_input_nfft,
                            input_return_onesided: this.state.selected_welch_return_onesided,
                            input_scaling: this.state.selected_welch_scaling,
                            input_axis: this.state.selected_welch_axis,
                            input_average: this.state.selected_welch_average,
                            file_used: this.state.file_used
                        }
                    }
            ).then(res => {
                const resultJson = res.data;
                this.setState({result_periodogram_alpha_delta_ratio: resultJson['alpha_delta_ratio']})
                this.setState({result_periodogram_alpha_delta_ratio_dataframe:  JSON.parse(resultJson['alpha_delta_ratio_df'])})

                // this.setState({result_welch_alpha_delta_ratio: resultJson['alpha_delta_ratio']})
                // this.setState({result_welch_alpha_delta_ratio_dataframe:  JSON.parse(resultJson['alpha_delta_ratio_df'])})
            });
        }else if (this.state.selected_type_psd === "multitaper")
        {
            let to_send_input_fmin = null;     //float
            let to_send_input_fmax = null;  //float
            let to_send_input_bandwidth = null;  //float
            let to_send_input_n_jobs = null;  //float
            // let to_send_input_verbose = null;  //bool|str|int


            if (!!this.state.selected_multitaper_fmin){
                to_send_input_fmin = parseFloat(this.state.selected_multitaper_fmin)
            }

            if (!!this.state.selected_multitaper_fmax){
                to_send_input_fmax = parseFloat(this.state.selected_multitaper_fmax)
            }else{
                to_send_input_fmax = null
            }

            if (!!this.state.selected_multitaper_bandwidth){
                to_send_input_bandwidth = parseFloat(this.state.selected_multitaper_bandwidth)
            }

            if (!!this.state.selected_multitaper_n_jobs){
                to_send_input_n_jobs = parseFloat(this.state.selected_multitaper_n_jobs)
            }

            console.log("Test")
            console.log({
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                input_name: this.state.selected_channel,
                input_fmin: to_send_input_fmin,
                input_fmax: to_send_input_fmax,
                input_bandwidth: to_send_input_bandwidth,
                input_adaptive: this.state.selected_multitaper_adaptive ,
                input_low_bias: this.state.selected_multitaper_low_bias,
                input_normalization: this.state.selected_multitaper_normalization,
                input_output: this.state.selected_multitaper_output,
                input_n_jobs: to_send_input_n_jobs,
                input_verbose: this.state.selected_multitaper_verbose
            })
            API.get("return_power_spectral_density",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"),
                            run_id: params.get("run_id"),
                            step_id: params.get("step_id"),
                            input_name: this.state.selected_channel,
                            input_fmin: to_send_input_fmin,
                            input_fmax: to_send_input_fmax,
                            input_bandwidth: to_send_input_bandwidth,
                            input_adaptive: this.state.selected_multitaper_adaptive ,
                            input_low_bias: this.state.selected_multitaper_low_bias,
                            input_normalization: this.state.selected_multitaper_normalization,
                            input_output: this.state.selected_multitaper_output,
                            input_n_jobs: to_send_input_n_jobs,
                            input_verbose: this.state.selected_multitaper_verbose

                        }
                    }
            ).then(res => {
                const resultJson = res.data;
                console.log("--- Results ---")
                console.log(resultJson)

                // let temp_array_psd = []
                // for ( let it =0 ; it < resultJson['power spectral density'].length; it++){
                //     if(it > 1000){
                //         break;
                //     }
                //     let temp_object = {}
                //     temp_object["category"] = resultJson['frequencies'][it]
                //     temp_object["yValue"] = resultJson['power spectral density'][it]
                //     temp_array_psd.push(temp_object)
                // }
                // // console.log("")
                // // console.log(temp_array)
                //
                //
                // this.setState({psd_chart_data: temp_array_psd})
                // this.setState({psd_chart_show: true})
            });
        }





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
    handleSelectTypePSDChange(event){
        this.setState( {selected_type_psd: event.target.value})
    }
    handleSelectChannelChange(event){
        this.setState( {selected_channel: event.target.value})
    }

    // Periodogram
    handleSelectPeriodogramWindowChange(event){
        this.setState( {selected_periodogram_window: event.target.value})
    }
    handleSelectPeriodogramNfftChange(event){
        this.setState( {selected_periodogram_nfft: event.target.value})
    }
    handleSelectPeriodogramReturnonesidedChange(event){
        this.setState( {selected_periodogram_return_onesided: event.target.value})
    }
    handleSelectPeriodogramScalingChange(event){
        this.setState( {selected_periodogram_scaling: event.target.value})
    }
    handleSelectPeriodogramAxisChange(event){
        this.setState( {selected_periodogram_axis: event.target.value})
    }

    // Welch
    handleSelectWelchWindowChange(event){
        this.setState( {selected_welch_window: event.target.value})
    }
    handleSelectWelchNpersegChange(event){
        this.setState( {selected_welch_nperseg: event.target.value})
    }
    handleSelectWelchNoverlapChange(event){
        this.setState( {selected_welch_noverlap: event.target.value})
    }
    handleSelectWelchNfftChange(event){
        this.setState( {selected_welch_nfft: event.target.value})
    }
    handleSelectWelchReturnonesidedChange(event){
        this.setState( {selected_welch_return_onesided: event.target.value})
    }
    handleSelectWelchScalingChange(event){
        this.setState( {selected_welch_scaling: event.target.value})
    }
    handleSelectWelchAxisChange(event){
        this.setState( {selected_welch_axis: event.target.value})
    }
    handleSelectWelchAverageChange(event){
        this.setState( {selected_welch_average: event.target.value})
    }

    // Multitaper
    handleSelectMultitaperFMinChange(event){
        this.setState( {selected_multitaper_fmin: event.target.value})
    }
    handleSelectMultitaperFMaxChange(event){
        this.setState( {selected_multitaper_fmax: event.target.value})
    }
    handleSelectMultitaperBandwidthChange(event){
        this.setState( {selected_multitaper_bandwidth: event.target.value})
    }
    handleSelectMultitaperAdaptiveTypeChange(event){
        this.setState( {selected_multitaper_adaptive: event.target.value})
    }
    handleSelectMultitaperLowBiasChange(event){
        this.setState( {selected_multitaper_low_bias: event.target.value})
    }
    handleSelectMultitaperNormalizationChange(event){
        this.setState( {selected_multitaper_normalization: event.target.value})
    }
    handleSelectMultitaperOutputChange(event){
        this.setState( {selected_multitaper_output: event.target.value})
    }
    handleSelectMultitaperNJobsChange(event){
        this.setState( {selected_multitaper_n_jobs: event.target.value})
    }
    handleSelectMultitaperVerboseChange(event){
        this.setState( {selected_multitaper_verbose: event.target.value})
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
                            Power Spectral Density Parameterisation
                        </Typography>
                        <Divider/>
                        <EEGSelectModal handleChannelChange={this.handleChannelChange} handleFileUsedChange={this.handleFileUsedChange}/>
                        <Divider/>
                        <form onSubmit={this.handleSubmit} style={{ display: (this.state.channels.length != 0 ? 'block' : 'none') }}>

                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="psd-type-selector-label">PSD Type</InputLabel>
                                <Select
                                        labelId="psd-type-selector-label"
                                        id="psd-type-selector"
                                        value= {this.state.selected_type_psd}
                                        label="PSD Type"
                                        onChange={this.handleSelectTypePSDChange}
                                >
                                    <MenuItem value="welch">
                                        <em>Welch</em>
                                    </MenuItem>
                                    <MenuItem value="periodogram">
                                        <em>Periodogram</em>
                                    </MenuItem>
                                    <MenuItem value="multitaper">
                                        <em>Multitaper</em>
                                    </MenuItem>

                                </Select>
                                <FormHelperText>Select type of PSD</FormHelperText>
                            </FormControl>
                            <Divider/>

                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
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
                                <FormHelperText>Select Channel for PSD</FormHelperText>
                            </FormControl>
                            <Divider/>

                            {/*Periodogram*/}
                            <div style={{ display: (this.state.selected_type_psd === "periodogram" ? 'block' : 'none' )}}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="window-selector-label">Window</InputLabel>
                                <Select
                                        labelId="window-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_periodogram_window}
                                        label="Window"
                                        onChange={this.handleSelectPeriodogramWindowChange}
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
                            <FormControl sx={{m: 1, width:'90%'}}>
                                <TextField
                                        // labelId="nfft-selector-label"
                                        id="nfft-selector"
                                        value= {this.state.selected_periodogram_nfft}
                                        label="Nfft"
                                        size={"small"}
                                        onChange={this.handleSelectPeriodogramNfftChange}
                                />
                                <FormHelperText>Nfft </FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="return-onesided-selector-label">Return Onesided</InputLabel>
                                <Select
                                        labelId="return-onesided-selector-label"
                                        id="return-onesided-selector"
                                        value= {this.state.selected_periodogram_return_onesided}
                                        label="Return-onesided"
                                        onChange={this.handleSelectPeriodogramReturnonesidedChange}
                                >
                                    <MenuItem value={"true"}><em>True</em></MenuItem>
                                    <MenuItem value={"false"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>If True, return a one-sided spectrum</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="scaling-selector-label">Scaling</InputLabel>
                                <Select
                                        // labelId="scaling-selector-label"
                                        id="scaling-selector"
                                        value= {this.state.selected_periodogram_scaling}
                                        label="Scaling"
                                        onChange={this.handleSelectPeriodogramScalingChange}
                                >
                                    <MenuItem value={"density"}><em>Density</em></MenuItem>
                                    <MenuItem value={"spectrum"}><em>Spectrum</em></MenuItem>
                                </Select>
                                <FormHelperText>Selects between computing the power spectral density or the power spectrum</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}}>
                                <TextField
                                        // labelId="nfft-selector-label"
                                        id="axis-selector"
                                        value= {this.state.selected_periodogram_axis}
                                        label="Axis"
                                        size={"small"}
                                        onChange={this.handleSelectPeriodogramAxisChange}
                                />
                                <FormHelperText>Axis along which the periodogram is computed</FormHelperText>
                            </FormControl>
                            </div>

                            {/*Welch*/}
                            <div style={{ display: (this.state.selected_type_psd === "welch" ? 'block' : 'none' )}}>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="window-selector-label">Window</InputLabel>
                                    <Select
                                            labelId="window-selector-label"
                                            id="method-selector"
                                            value= {this.state.selected_welch_window}
                                            label="Window"
                                            onChange={this.handleSelectWelchWindowChange}
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
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <TextField
                                            labelId="nperseg-selector-label"
                                            id="nperseg-selector"
                                            value= {this.state.selected_welch_nperseg}
                                            label="Nperseg"
                                            size={"small"}
                                            onChange={this.handleSelectWelchNpersegChange}
                                    />
                                    <FormHelperText>Length of each segment</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    {/*<InputLabel id="noverlap-selector-label">Alpha</InputLabel>*/}
                                    <TextField
                                            labelId="noverlap-selector-label"
                                            id="noverlap-selector"
                                            value= {this.state.selected_welch_noverlap}
                                            label="Noverlap"
                                            size={"small"}
                                            onChange={this.handleSelectWelchNoverlapChange}
                                    />
                                    <FormHelperText>Number of points to overlap between segments</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <TextField
                                            // labelId="nfft-selector-label"
                                            id="nfft-selector"
                                            value= {this.state.selected_welch_nfft}
                                            label="Nfft"
                                            size={"small"}
                                            onChange={this.handleSelectWelchNfftChange}
                                    />
                                    <FormHelperText>Length of the FFT used, Nfft must be equal or higher than Nperseg</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="return-onesided-selector-label">Return Onesided</InputLabel>
                                    <Select
                                            labelId="return-onesided-selector-label"
                                            id="return-onesided-selector"
                                            value= {this.state.selected_welch_return_onesided}
                                            label="Return-onesided"
                                            onChange={this.handleSelectWelchReturnonesidedChange}
                                    >
                                        <MenuItem value={"true"}><em>True</em></MenuItem>
                                        <MenuItem value={"false"}><em>False</em></MenuItem>
                                    </Select>
                                    <FormHelperText>If True, return a one-sided spectrum</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="scaling-selector-label">Scaling</InputLabel>
                                    <Select
                                            // labelId="scaling-selector-label"
                                            id="scaling-selector"
                                            value= {this.state.selected_welch_scaling}
                                            label="Scaling"
                                            size={"small"}
                                            onChange={this.handleSelectWelchScalingChange}
                                    >
                                        <MenuItem value={"density"}><em>Density</em></MenuItem>
                                        <MenuItem value={"spectrum"}><em>Spectrum</em></MenuItem>
                                    </Select>
                                    <FormHelperText>Selects between computing the power spectral density or the power spectrum</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <TextField
                                            // labelId="nfft-selector-label"
                                            id="axis-selector"
                                            value= {this.state.selected_welch_axis}
                                            label="Axis"
                                            size={"small"}
                                            onChange={this.handleSelectWelchAxisChange}
                                    />
                                    <FormHelperText>Axis along which the periodogram is computed</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="average-selector-label">Average</InputLabel>
                                    <Select
                                            // labelId="nfft-selector-label"
                                            id="average-selector"
                                            value= {this.state.selected_welch_average}
                                            label="Average"
                                            onChange={this.handleSelectWelchAverageChange}
                                    >
                                        <MenuItem value={"mean"}><em>Mean</em></MenuItem>
                                        <MenuItem value={"median"}><em>Median</em></MenuItem>
                                    </Select>
                                    <FormHelperText>Method to use when averaging periodograms</FormHelperText>
                                </FormControl>
                            </div>

                            {/*Multitaper*/}
                            <div style={{ display: (this.state.selected_type_psd === "multitaper" ? 'block' : 'none' )}}>
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <TextField
                                            id="fmin-selector"
                                            value= {this.state.selected_multitaper_fmin}
                                            label="FMin"
                                            onChange={this.handleSelectMultitaperFMinChange}
                                    />
                                    <FormHelperText> The lower frequency of interest </FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <TextField
                                            id="fmax-selector"
                                            value= {this.state.selected_multitaper_fmax}
                                            label="FMax"
                                            onChange={this.handleSelectMultitaperFMaxChange}
                                    />
                                    <FormHelperText> The upper  frequency of interest (Leave empty for infinity) </FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <TextField
                                            id="bandwidth-selector"
                                            value= {this.state.selected_multitaper_bandwidth}
                                            label="Bandwidth"
                                            onChange={this.handleSelectMultitaperBandwidthChange}
                                    />
                                    <FormHelperText>     The bandwidth of the multi taper windowing function in Hz. </FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <InputLabel id="adaptive-selector-label">Adaptive</InputLabel>
                                    <Select
                                            labelId="adaptive-selector-label"
                                            id="adaptive-selector"
                                            value= {this.state.selected_multitaper_adaptive}
                                            label="Adaptive"
                                            onChange={this.handleSelectMultitaperAdaptiveTypeChange}
                                    >
                                        <MenuItem value={"true"}><em>True</em></MenuItem>
                                        <MenuItem value={"false"}><em>False</em></MenuItem>
                                    </Select>
                                    <FormHelperText>Use adaptive weights to combine the tapered spectra into PSD</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <InputLabel id="low-bias-selector-label">Low Bias</InputLabel>
                                    <Select
                                            labelId="low-bias-selector-label"
                                            id="low-bias-selector"
                                            value= {this.state.selected_multitaper_low_bias}
                                            label="Low Bias"
                                            onChange={this.handleSelectMultitaperLowBiasChange}
                                    >
                                        <MenuItem value={"true"}><em>True</em></MenuItem>
                                        <MenuItem value={"false"}><em>False</em></MenuItem>
                                    </Select>
                                    <FormHelperText>Only use tapers with more than 90% spectral concentration within bandwidth.</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120}}>
                                    <InputLabel id="normalization-selector-label">Normalization</InputLabel>
                                    <Select
                                            labelId="normalization-selector-label"
                                            id="normalization-selector"
                                            value= {this.state.selected_multitaper_normalization}
                                            label="Normalization"
                                            onChange={this.handleSelectMultitaperNormalizationChange}
                                    >
                                        <MenuItem value={"full"}><em>Full</em></MenuItem>
                                        <MenuItem value={"length"}><em>Length</em></MenuItem>
                                    </Select>
                                    <FormHelperText>Normalization strategy. If “full”, the PSD will be normalized by the sampling rate as well as the length of the signal </FormHelperText>
                                </FormControl>
                            </div>

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
                                    <Tab label="Periodogram Results" {...a11yProps(1)} />
                                    <Tab label="Welch Results" {...a11yProps(2)} />
                                    <Tab label="Multitaper Results" {...a11yProps(3)} />
                                    <Tab label="AlphaDeltaRatio Results" {...a11yProps(4)} />
                                    <Tab label="AlphaVariability Results" {...a11yProps(5)} />
                                </Tabs>
                            </Box>

                        </Box>
                        <TabPanel value={this.state.tabvalue} index={0}>
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={1}>
                            <img src={this.state.periodogram_path + "?random=" + new Date().getTime()}
                                 srcSet={this.state.periodogram_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                 loading="lazy"
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={2}>
                            <img src={this.state.welch_path + "?random=" + new Date().getTime()}
                                 srcSet={this.state.welch_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                 loading="lazy"
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={3}>
                            <img src={this.state.multitaper_path + "?random=" + new Date().getTime()}
                                 srcSet={this.state.multitaper_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                 loading="lazy"
                            />
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={4}>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Alpha Delta Ratio: {this.state.result_periodogram_alpha_delta_ratio}</Typography>
                            <JsonTable className="jsonResultsTable" rows = {this.state.result_periodogram_alpha_delta_ratio_dataframe}/>
                            {/*Alpha Delta Ratio: {this.state.result_periodogram_alpha_delta_ratio}*/}
                        </TabPanel>
                        <TabPanel value={this.state.tabvalue} index={5}>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Alpha Delta Ratio: {this.state.result_welch_alpha_variability}</Typography>
                        </TabPanel>
                        {/*<hr/>*/}

                        {/*<div style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}><PointChartCustom chart_id="peridogram_chart_id" chart_data={ this.state.peridogram_chart_data}/></div>*/}
                        {/*<hr style={{ display: (this.state.peridogram_chart_show ? 'block' : 'none') }}/>*/}
                    </Grid>
                </Grid>
        )
    }
}

export default PowerSpectralDensityPage;
