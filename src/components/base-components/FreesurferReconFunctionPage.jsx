import React from 'react';
import {CircularProgress} from "@mui/material";
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import MRIViewerWin from './MRIViewerWin';
import {
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    Link,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Select,
    Tab,
    Table,
    TableCell,
    TableContainer,
    TableRow,
    Tabs,
    TextareaAutosize,
    TextField,
    Toolbar,
    Typography,
    TableHead,
    TableBody
} from "@mui/material";
import '../css/recon_all.css';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem'

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import ProceedButton from "../ui-components/ProceedButton";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import ScatterPlot from "../ui-components/ScatterPlot";

function TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
            <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
            >
                {value === index && (
                        <Box sx={{p: 3}}>
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class FreesurferReconFunctionPage extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL) {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of channels sent by the backend
            slices: [],
            file_names: [],

            // Running status
            recon_started: false,
            samseg_started: false,
            synthseg_started: false,

            coreg_started: false,
            vol2vol_started: false,
            coreg_finished: false,
            vol2vol_finished: false,
            coreg_results: false,

            // Logs status
            recon_finished: false,
            samseg_finished: false,
            synthseg_finished: false,
            recon_log_text: "",
            samseg_log_text: "",
            vol2vol_log_text: "",
            coreg_log_text: "",
            synthseg_log_text: "",

            //Values selected currently on the form
            selected_test_name: "runId",
            selected_slice: "",

            selected_test_name_check: "",

            // Function of the page used
            // Values: None|New|Old
            selected_page_function: "None",

            //Variable that is used to inquire about the current state and to send the command for the finalisation
            //Variable that is either set by creating new process or checking status old one.
            selected_freesurfer_function_id_to_log: "",

            selected_ref_file_name: "",
            selected_target_file_name: "",
            selected_flair_file_name: "None",
            selected_synthseg_input_file_name: "",
            selected_parc: "false",
            selected_robust: "false",
            selected_fast: "false",
            selected_vol_save: "false",
            selected_qc_save: "false",
            selected_post_save: "false",
            selected_resample_save: "false",
            selected_input_file_name: "None",
            selected_input_flair_file_name: "",
            selected_lession: "false",
            selected_lession_mask_pattern_file: "0",
            selected_lession_mask_pattern_flair: "0",
            selected_threshold: "0.3",

            foldersExist: {
                samseg_results_folder: false,
                ucl_test: false,
                coreg_results_folder: false,
                synthseg_results_folder: false
            },

            loading: false,
            current_execution: "",
            processCompleted: false,


            //Function to show/hide
            show_neurodesk: true,

            //Returned variables
            returned_status: "",
            tabvalue: 0,

            itemData: [
                {
                    img: ip + 'static/screenshots/lh.pial.T1_127.png',
                },
                {
                    img: ip + 'static/screenshots/rh.pial.T1_127.png',
                    // title: 'Burger',
                }
            ]
        };

        //Binding functions of the class
        // this.fetchSlices = this.fetchSlices.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleSubmitCheck = this.handleSubmitCheck.bind(this);
        // this.handleProcessFinished = this.handleProcessFinished.bind(this);
        // this.handleProcessUpdate = this.handleProcessUpdate.bind(this);
        // this.handleSelectTestNameChange = this.handleSelectTestNameChange.bind(this);
        // this.handleSelectTestNameCheckChange = this.handleSelectTestNameCheckChange.bind(this);
        // this.handleSelectSliceChange = this.handleSelectSliceChange.bind(this);
        // this.sendToBottom = this.sendToBottom.bind(this);
        // this.sendToTop = this.sendToTop.bind(this);
        this.startRecon = this.startRecon.bind(this);
        this.startSamseg = this.startSamseg.bind(this);
        this.startCoreg = this.startCoreg.bind(this);
        this.startVol2vol = this.startVol2vol.bind(this);
        this.startCoregistration = this.startCoregistration.bind(this);
        this.fetchReconLog = this.fetchReconLog.bind(this);
        this.fetchSamsegLog = this.fetchSamsegLog.bind(this);
        this.redirectToPage = this.redirectToPage.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.checkFoldersExistence = this.checkFoldersExistence.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFlairFileNameChange = this.handleSelectFlairFileNameChange.bind(this);
        this.handleSelectTargetFileNameChange = this.handleSelectTargetFileNameChange.bind(this);
        this.handleSelectRefFileNameChange = this.handleSelectRefFileNameChange.bind(this);
        this.fetchCoregLog = this.fetchCoregLog.bind(this);
        this.fetchVol2volLog = this.fetchVol2volLog.bind(this);
        this.upload_to_trino = this.upload_to_trino.bind(this);
        this.handleCoregProceed = this.handleCoregProceed.bind(this);
        this.handleSelectInputFileNameChange = this.handleSelectInputFileNameChange.bind(this);
        this.handleSelectInputFlairFileNameChange = this.handleSelectInputFlairFileNameChange.bind(this);
        this.handleSelectLessionChange = this.handleSelectLessionChange.bind(this);
        this.handleSelectLessionMaskPatternFileChange = this.handleSelectLessionMaskPatternFileChange.bind(this);
        this.handleSelectLessionMaskPatternFlairChange = this.handleSelectLessionMaskPatternFlairChange.bind(this);
        this.handleSelectThreshold = this.handleSelectThreshold.bind(this);
        this.startSynthSeg = this.startSynthSeg.bind(this);
        this.handleSelectSynthsegInputFileNameChange = this.handleSelectSynthsegInputFileNameChange.bind(this);
        this.handleParcChange = this.handleParcChange.bind(this);
        this.handleRobustChange = this.handleRobustChange.bind(this);
        this.handleFastChange = this.handleFastChange.bind(this);
        this.handleVolPathChange = this.handleVolPathChange.bind(this);
        this.handleQCPathChange = this.handleQCPathChange.bind(this);
        this.handlePostPathChange = this.handlePostPathChange.bind(this);
        this.handleRessamplePathChange = this.handleRessamplePathChange.bind(this);
        this.fetchSynthSegLog = this.fetchSynthSegLog.bind(this);
        this.handleProceedCalls = this.handleProceedCalls.bind(this);
        this.callSamesegTrino = this.callSamesegTrino.bind(this);
        this.callReconallTrino = this.callReconallTrino.bind(this);
        this.fetchFileNames();
        // Initialise component
        // - values of channels from the backend

        // this.fetchSlices();


    }

    //
    // /**
    //  * Call backend endpoint to get channels of eeg
    //  */
    // async fetchSlices(url, config) {
    //     API.get("list/mri/slices", {}).then(res => {
    //         this.setState({slices: res.data.slices})
    //     });
    // }

    // /**
    //  * Process and send the request for auto correlation and handle the response
    //  */
    // async handleSubmit(event) {
    //     event.preventDefault();
    //     // Set the freesurfer process id to log and the appropriate page function
    //     this.setState({selected_freesurfer_function_id_to_log: this.state.selected_test_name})
    //     this.setState({selected_page_function:"New"})
    //
    //     console.log("this.state.selected_test_name")
    //     console.log(this.state.selected_test_name)
    //     console.log(this.state.selected_slice)
    //
    //     const params = new URLSearchParams(window.location.search);
    //
    //     API.get("free_surfer/recon",
    //             {
    //                 params: {
    //                     workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
    //                     step_id: params.get("step_id"),
    //                     input_test_name: this.state.selected_test_name,
    //                     // input_slices: this.state.selected_slice
    //                 }
    //             }
    //     ).then(res => {
    //         const result = res.data;
    //         console.log("Recon")
    //         console.log(result)
    //         if (result === "Success") {
    //             this.setState({
    //                 returned_status: "Process has commenced: \n" +
    //                         "Press  the \" Get Status \" button to get its logs and check its progress \n" +
    //                         "When application is finished press on the \" Check Progress \" button to finalise the results "
    //             })
    //         }
    //
    //     });
    //
    //
    // }
    //
    // async handleSubmitCheck(event) {
    //     event.preventDefault();
    //
    //     // Set the freesurfer process id to log and the appropriate page function
    //     // No need to do any calls to  backend here since they are done by the get "check progress"button
    //     this.setState({selected_freesurfer_function_id_to_log: this.state.selected_test_name_check})
    //     this.setState({selected_page_function:"Old"})
    //     this.setState({
    //         returned_status: "Process's status can be queried: \n" +
    //                 "Press  the \" Get Status \" button to get its logs and check its progress \n" +
    //                 "When application is finished press on the \" Check Progress \" button to finalise the results "
    //     })
    //
    // }

    async fetchFileNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("/list_nii_files",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }
                }).then(res => {
            this.setState({file_names: res.data.files})
        });
    }

    async startRecon(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        API.get("/free_surfer/recon",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }).then(res => {
            const result = res.data;
            if (result === "Success") {
                this.setState({recon_started: true})
                console.log(" Recon Success")
            } else {
                console.log(" Recon Failed")
            }
        });
    }

    async startCoreg(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        console.log(" Coreg Start")
        API.get("/free_surfer/coreg",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        ref_file_name: this.state.selected_ref_file_name,
                        flair_file_name: this.state.selected_flair_file_name,
                    }
                }).then(res => {
            const result = res.data;
            if (result === "Success") {
                this.setState({coreg_started: true})
                console.log(" Coreg Success")
            } else {
                console.log(" Coreg Failed")
            }
        });

    }

    async startVol2vol(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        API.get("/free_surfer/vol2vol",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        ref_file_name: this.state.selected_ref_file_name,
                        flair_file_name: this.state.selected_flair_file_name,
                        target_file_name: this.state.selected_target_file_name,
                    }
                }).then(res => {
            const result = res.data;
            if (result === "Success") {
                this.setState({vol2vol_started: true})
                console.log(" vol2vol Success")
            } else {
                console.log(" vol2vol Failed")
            }
        });
    }

    async startCoregistration(event) {
        event.preventDefault();
        this.startCoreg(event)
                .then(() => this.startVol2vol(event))
                .then(() => {
                    console.log("Coregistrtion functions completed successfully.");
                })
                .catch(error => {
                    console.error("An error occurred:", error);
                });
    }

    handleTabChange(event, newvalue) {
        this.setState({tabvalue: newvalue}, () => {
            if (newvalue === 4) {
                this.checkFoldersExistence();
            }
        });

    }

    async checkFoldersExistence() {
        const params = new URLSearchParams(window.location.search);
        const folderStatuses = await API.get('/check_mri_folders_existence', {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        })
        console.log(folderStatuses)
        this.setState({
            foldersExist: {
                samseg_results_folder: folderStatuses.data.samseg_results_folder,
                ucl_test: folderStatuses.data.ucl_test,
                coreg_results_folder: folderStatuses.data.coreg_results_folder,
                synthseg_results_folder: folderStatuses.data.synthseg_results_folder
            }
        });
    }

    async startSamseg(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        API.get("/free_surfer/samseg",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        input_file_name: this.state.selected_input_file_name,
                        input_flair_file_name: this.state.selected_input_flair_file_name,
                        lession: this.state.selected_lession,
                        lession_mask_pattern_file: this.state.selected_lession_mask_pattern_file,
                        lession_mask_pattern_flair: this.state.selected_lession_mask_pattern_flair,
                        threshold: this.state.selected_threshold

                    }
                }).then(res => {
            const result = res.data;
            if (result === "Success") {
                this.setState({samseg_started: true})
                console.log(" Samseg Success")
            } else {
                console.log(" Samseg Failed")
            }
        });
    }

    async startSynthSeg(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.get("/free_surfer/synthseg",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        input_file_name: this.state.selected_synthseg_input_file_name,
                        parc: this.state.selected_parc,
                        robust: this.state.selected_robust,
                        fast: this.state.selected_fast,
                        vol_save: this.state.selected_vol_save,
                        qc_save: this.state.selected_qc_save,
                        post_save: this.state.selected_post_save,
                        resample_save: this.state.selected_resample_save,
                    }
                }).then(res => {
            const result = res.data;
            if (result === "Success") {
                this.setState({synthseg_started: true})
                console.log(" SynthSeg Success")
            } else {
                console.log(" SynthSeg Failed")
            }
        });
    }

    async fetchReconLog(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        API.get("/free_surfer/log/recon",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }).then(res => {
            const result = res.data;
            if (result === true) {
                this.setState({recon_finished: true})
                this.setState({
                    recon_log_text: "Function has finished please press the \" Process \" button to" +
                            " proceed after both functions have completed successfully"
                })

            } else {
                this.setState({recon_finished: false})
                this.setState({
                    recon_log_text: "Function has not finished yet please press the \" Check Progress \"" +
                            " button to check its progress again after a while"
                })
            }
        });
    }

    async fetchSamsegLog(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        API.get("/free_surfer/log/samseg",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }).then(res => {
            const result = res.data;
            if (result === true) {
                this.setState({samseg_finished: true})
                this.setState({
                    samseg_log_text: "Function has finished press the \" Process \" button to" +
                            " proceed to check the results"
                })
            } else {
                this.setState({samseg_finished: false})
                this.setState({
                    samseg_log_text: "Function has not finished yet please press the \" Check Progress \" " +
                            "button to check its progress again after a while"
                })
            }
        });
    }


    async fetchSynthSegLog(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        API.get("/free_surfer/log/synthseg",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        output_file: "converted_nii_".concat(this.state.selected_synthseg_input_file_name),
                    }
                }).then(res => {
            const result = res.data;
            if (result === true) {
                this.setState({synthseg_finished: true})
                this.setState({
                    synthseg_log_text: "Function has finished press the \" Process \" button to" +
                            " proceed to check the results"
                })
            } else {
                this.setState({synthseg_finished: false})
                this.setState({
                    synthseg_log_text: "Function has not finished yet please press the \" Check Progress \" " +
                            "button to check its progress again after a while"
                })
            }
        });
    }

    async fetchCoregLog(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        console.log("flairToT1_".concat(this.state.selected_ref_file_name.slice(0, -4), ".lta"))
        API.get("/free_surfer/log/vol2vol",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        output_file: "flairToT1_".concat(this.state.selected_ref_file_name.slice(0, -4), ".lta")
                    }
                }).then(res => {
            const result = res.data;
            if (result === true) {
                this.setState({coreg_finished: true})
                this.setState({coreg_log_text: "coreg function has finished. Press \" Start vol2vol \" to proceed to vol2vol"})
            } else {
                this.setState({coreg_finished: false})
                this.setState({
                    coreg_log_text: "coreg function has not finished yet, press \"Check coreg Progress\" " +
                            "to check its progress again after a while"
                })
            }
        });
    }

    async fetchVol2volLog(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);

        API.get("/free_surfer/log/vol2vol",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        output_file: "flair_reg_".concat(this.state.selected_ref_file_name)
                    }
                }).then(res => {
            const result = res.data;
            if (result === true) {
                this.setState({vol2vol_finished: true})
                this.setState({vol2vol_log_text: "vol2vol function has finished. Proceed to check the results"})
            } else {
                this.setState({vol2vol_finished: false})
                this.setState({
                    vol2vol_log_text: "vol2vol function has not finished yet, press \"Check vol2vol Progress\" " +
                            "to check its progress again after a while"
                })
            }
        });
    }

    async upload_to_trino(event) {
        event.preventDefault();
        // Send the request
        const params = new URLSearchParams(window.location.search);
        API.put("csv_stats_to_trino_", {
            workflow_id: params.get("workflow_id"),
            run_id: params.get("run_id"),
            step_id: params.get("step_id"),
            source_file: "source_file",
            workspace_id: "123123",
        })
    };

    async callSamesegTrino() {
        const params = new URLSearchParams(window.location.search);
        this.setState({loading: true, current_execution: "Uploading Samseg data to trino"});
        API.put("/samseg_stats_to_trino", {
            workflow_id: params.get("workflow_id"),
            run_id: params.get("run_id"),
            step_id: params.get("step_id"),
            samseg_source_file: "testtest", //from folder name
            workspace_id: "123123" // from workflow manager
        })
    }

    async callReconallTrino() {
        const params = new URLSearchParams(window.location.search);
        this.setState({current_execution: "Uploading Reconall data to trino"});

        try {
            API.put("/reconall_stats_to_trino", {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                reconall_source_file: "testtest", //from folder name
                workspace_id: "123123", // from workflow manager
                folder_name: "ucl_test", // always ucl_test?
            })
        } catch (error) {
            ;
        }
    }

    async handleProceedCalls(event) {
        event.preventDefault();
        // this.setState({ loading: true, current_execution: "Uploading samseg stats to trino" });
        // await this.upload_to_trino();

        const params = new URLSearchParams(window.location.search);
        let function_type_to_send = "mri"
        this.setState({loading: true, current_execution: "Uploading Samseg data to trino..."});
        API.put("/samseg_stats_to_trino", {
            workflow_id: params.get("workflow_id"),
            run_id: params.get("run_id"),
            step_id: params.get("step_id"),
            samseg_source_file: "testtest", //from folder name
            workspace_id: "123123" // from workflow manager
        }).then(res => {
            if (res.status === 200) {
                this.setState({current_execution: "Uploading Reconall data to trino. This might take a while..."});
                API.put("/reconall_stats_to_trino", {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                    reconall_source_file: "testtest", //from folder name
                    workspace_id: "123123", // from workflow manager
                    folder_name: "ucl_test", // always ucl_test?
                }).then(res => {
                    if (res.status === 200) {
                        this.setState({current_execution: "Uploading all available mri data to the datalake..."});
                        API.post("/function/save_data/", null, {
                                    params: {
                                        workflow_id: params.get("workflow_id"),
                                        run_id: params.get("run_id"),
                                        step_id: params.get("step_id"),
                                        function_type: function_type_to_send
                                    }
                                }
                        ).then(res => {
                            // this.setState({output_return_data: res.data})
                            // If the data was saved to the datalake, then complete the task and redirect
                            // Otherwise, alert the user that there was an error
                            if (res.status === 200) {
                                API.get("/task/complete", {
                                    params: {
                                        workflow_id: params.get("workflow_id"),
                                        run_id: params.get("run_id"),
                                        step_id: params.get("step_id"),
                                    }
                                }).then(res => {
                                    if (res.status === 200) {
                                        // If succesfull follow up in the next step page in the workflow manager
                                        console.log("Task completed succesfully")
                                        this.setState({current_execution: "", loading: false, processCompleted: true});
                                        window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
                                    } else {
                                        // If there is an error completing the task iin the datalake we are probably
                                        // in a test case, so redirect to the home page
                                        console.log("Error in completing task, please try again 1.")
                                        this.setState({
                                            current_execution: "Error in completing task, please try again.",
                                            loading: false
                                        });
                                        window.location.replace("/")
                                    }
                                    console.log(res)
                                    // this.setState({channels: res.data.channels})
                                    // this.props.handleChannelChange(res.data.channels)
                                }).catch(function (error) {
                                    if (error.status === 500) {
                                        console.log("Error in completing task, please try again 2.")
                                        this.setState({
                                            current_execution: "Error in completing task, please try again.",
                                            loading: false
                                        });
                                        window.location.replace("/")
                                    }
                                });
                            } else {
                                console.log("Error in uploading produced mri data to datalake. Please check the produced data and try again.")
                                this.setState({
                                    current_execution: "Error in uploading produced mri data to datalake. Please check the produced data and try again.",
                                    loading: false
                                });
                            }
                        })
                    } else {
                        console.log("Error in uploading reconall data to trino. Please check the produced data and try again.")
                        this.setState({
                            current_execution: "Error in uploading reconall data to trino. Please check the produced data and try again.",
                            loading: false
                        });
                    }
                })
            } else {
                console.log("Error in uploading samseg data to trino. Please check the produced data and try again")
                this.setState({
                    current_execution: "Error in uploading samseg data to trino. Please check the produced data and try again.",
                    loading: false
                });
            }
        })
    }

    handleSelectRefFileNameChange(event) {
        this.setState({selected_ref_file_name: event.target.value})
    }

    handleCoregProceed(event) {
        console.log(this.state.coreg_results)
        this.setState({coreg_results: true})
    }

    handleSelectTargetFileNameChange(event) {
        this.setState({selected_target_file_name: event.target.value})
    }


    handleSelectFlairFileNameChange(event) {
        this.setState({selected_flair_file_name: event.target.value})
    }

    handleSelectInputFileNameChange(event) {
        this.setState({selected_input_file_name: event.target.value})
    }

    handleSelectSynthsegInputFileNameChange(event) {
        this.setState({selected_synthseg_input_file_name: event.target.value})
    }

    handleSelectInputFlairFileNameChange(event) {
        this.setState({selected_input_flair_file_name: event.target.value})
    }

    handleSelectLessionChange(event) {
        this.setState({selected_lession: event.target.value})
    }

    handleSelectLessionMaskPatternFileChange(event) {
        this.setState({selected_lession_mask_pattern_file: event.target.value})
    }

    handleSelectLessionMaskPatternFlairChange(event) {
        this.setState({selected_lession_mask_pattern_flair: event.target.value})
    }

    handleSelectThreshold(event) {
        this.setState({selected_threshold: event.target.value})
    }

    handleParcChange(event) {
        this.setState({selected_parc: event.target.value})
    }

    handleRobustChange(event) {
        this.setState({selected_robust: event.target.value})
    }

    handleFastChange(event) {
        this.setState({selected_fast: event.target.value})
    }

    handleVolPathChange(event) {
        this.setState({selected_vol_save: event.target.value})
    }

    handleQCPathChange(event) {
        this.setState({selected_qc_save: event.target.value})
    }

    handlePostPathChange(event) {
        this.setState({selected_post_save: event.target.value})
    }

    handleRessamplePathChange(event) {
        this.setState({selected_resample_save: event.target.value})
    }


    async redirectToPage(function_name, bucket, file) {
        // Send the request
        const params = new URLSearchParams(window.location.search);
        let files_to_send = []
        for (let it = 0; it < bucket.length; it++) {
            files_to_send.push([bucket[it], file[it]])
        }
        console.log(files_to_send)

        API.put("function/navigation/",
                {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                    function: function_name,
                    metadata: {
                        // [["saved"] , "demo_sample_questionnaire.csv"],
                        "files": files_to_send
                    },
                }
        ).then(res => {
            window.location.assign(res.data.url)
        });
    }

    // async handleProcessUpdate(event) {
    //     event.preventDefault();
    //     // This function should in the future call the free_surfer/recon/check endpoint and provide the name
    //     API.get("freesurfer/status/",
    //             {
    //                 params: {}
    //             }
    //     ).then(res => {
    //         const resultJson = res.data;
    //         console.log("status")
    //         console.log(resultJson)
    //         let prevstate = this.state.returned_status + res.data.status
    //         this.setState({returned_status: prevstate})
    //
    //     });
    //
    // }
    //
    // async handleProcessFinished() {
    //     // event.preventDefault();
    //     // let confirmAction = window.confirm("Are you sure the process is finalised? \n The output will be sent to the datalake regardless of the output \n If fore some reason you believe the process has failed either no new logs for a significant amount of time or logs have explicitly stated failure contact the administrators and send the logs");
    //     // if (confirmAction) {
    //     //     alert("Action successfully executed");
    //     // } else {
    //     //     alert("Action canceled");
    //     // }
    //
    //     // Show neurodesk
    //     this.setState({show_neurodesk: true});
    //     console.log("show_neurodesk")
    //     console.log(this.state.show_neurodesk)
    //     // Finally scroll to bottom where iframe is
    //     window.scrollTo(0, document.body.scrollHeight);
    //     API.get("free_view",
    //             {
    //                 params: {
    //                     input_test_name: this.state.selected_test_name,
    //                     input_slices: this.state.selected_slice
    //                 }
    //             }
    //     ).then(res => {
    //         const result = res.data;
    //         console.log("Freeview")
    //         console.log(result)
    //         if (result === "Success") {
    //             this.setState({
    //                 returned_status: "Process has commenced: \n" +
    //                         "Press  the \" Get Status \" button to get its logs and check its progress \n" +
    //                         "When application is finished press on the \" Process Finished \" button to finalise the results "
    //             })
    //         }
    //
    //     });
    //
    // }
    //
    // /**
    //  * Update state when selection changes in the form
    //  */
    // handleSelectTestNameChange(event) {
    //     this.setState({selected_test_name: event.target.value})
    // }
    //
    // handleSelectSliceChange(event) {
    //     this.setState({selected_slice: event.target.value})
    // }
    //
    // handleSelectTestNameCheckChange(event) {
    //     this.setState({selected_test_name_check: event.target.value})
    // }
    //
    // sendToBottom() {
    //     window.scrollTo(0, document.body.scrollHeight);
    // }
    //
    // sendToTop() {
    //     window.scrollTo(0, 0)
    // }


    render() {
        return (
                <Box sx={{width: '100%'}}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                        <Tabs value={this.state.tabvalue} onChange={this.handleTabChange}
                              aria-label="basic tabs example">
                            <Tab label="Recon-All" {...a11yProps(0)} />
                            <Tab label="Co-Registration" {...a11yProps(1)} />
                            <Tab label="SAMSEG" {...a11yProps(2)} />
                            <Tab label="SynthSeg" {...a11yProps(3)} />
                            <Tab label="Proceed" {...a11yProps(4)} />
                        </Tabs>
                    </Box>
                    <TabPanel value={this.state.tabvalue} index={0}>
                        <Grid item xs={6} sx={{borderRight: "1px solid grey", align: "center"}}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Freesurfer Cortical Reconstruction Process: recon-all
                            </Typography>
                            <Divider/>
                            <div style={{display: (this.state.recon_started ? 'none' : 'block')}}>
                                <form onSubmit={this.startRecon}>
                                    <Button variant="contained" color="primary" type="submit">
                                        Start Process
                                    </Button>
                                </form>
                                <Divider/>
                            </div>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Recon-All Output Status
                            </Typography>
                            <Divider/>
                            <form onSubmit={this.fetchReconLog}>
                                <Button variant="contained" color="primary" type="submit" sx={{margin: "8px"}}>
                                    Check progress
                                </Button>
                            </form>

                            <br/>
                            <TextareaAutosize
                                    id="recon-status-text"
                                    aria-label="Status Log"
                                    placeholder="Status Log of recon function"
                                    value={this.state.recon_log_text}
                                    style={{
                                        width: "90%",
                                        backgroundColor: "black",
                                        color: "white",
                                        padding: "10px",
                                        margin: "8px"
                                    }}
                            />
                            <ProceedButton></ProceedButton>
                            {/* #TODO Button Should redirect to specific page denoted by workflowid, stepid, runid */}
                            <Button variant="contained" color="primary"
                                    onClick={this.redirectToPage.bind(this, "recon_all_results", [], [])}
                                    disabled={(this.state.recon_finished ? false : "disabled")}
                                    sx={{margin: "8px"}}>
                                Check out Results
                            </Button>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={this.state.tabvalue} index={1}>
                        <Grid container direction="row">
                            <Grid item xs={4} sx={{borderRight: "1px solid grey"}}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Co-registration
                                </Typography>
                                <hr/>
                                <form onSubmit={this.startCoreg}>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="ref_file_name-selector-label">File</InputLabel>
                                        <Select
                                                labelId="ref_file_name-selector-label"
                                                id="ref_file_name-selector"
                                                value={this.state.selected_ref_file_name}
                                                label="Reference File name"
                                                onChange={this.handleSelectRefFileNameChange}
                                        >
                                            {this.state.file_names.map((column) => (
                                                    <MenuItem value={column}>{column}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Select reference File name.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="target_file_name-selector-label">File</InputLabel>
                                        <Select
                                                labelId="target_file_name-selector-label"
                                                id="target_file_name-selector"
                                                value={this.state.selected_target_file_name}
                                                label="Target File name"
                                                onChange={this.handleSelectTargetFileNameChange}
                                        >
                                            {this.state.file_names.map((column) => (
                                                    <MenuItem value={column}>{column}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Select target File name.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="flair_file_name-selector-label">File</InputLabel>
                                        <Select
                                                labelId="flair_file_name-selector-label"
                                                id="flair_file_name-selector"
                                                value={this.state.selected_flair_file_name}
                                                label="Flair File name"
                                                onChange={this.handleSelectFlairFileNameChange}
                                        >
                                            {this.state.file_names.map((column) => (
                                                    <MenuItem value={column}>{column}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Select flair File name.</FormHelperText>
                                        <Button variant="contained" color="primary" type="submit"
                                                disabled={this.state.coreg_started}>
                                            Start Coreg
                                        </Button>
                                        <Divider/>
                                    </FormControl>
                                </form>
                                <form onSubmit={this.startVol2vol}>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <Button variant="contained" color="primary" type="submit"
                                                disabled={!this.state.coreg_finished || this.state.vol2vol_started}>
                                            Start Vol2vol
                                        </Button>
                                    </FormControl>
                                </form>
                                <div className="button-container">
                                    <Button variant="contained" color="primary"
                                            onClick={this.handleCoregProceed}
                                            disabled={(this.state.vol2vol_finished ? false : "disabled")}>
                                        Check out Results
                                    </Button>
                                    <ProceedButton></ProceedButton>
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Co-registration Results
                                </Typography>
                                <hr/>

                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Coreg Output Status
                                </Typography>
                                <Divider/>
                                <br/>
                                <TextareaAutosize
                                        id="coreg-status-text"
                                        aria-label="Status Log"
                                        placeholder="Status Log of coreg function"
                                        value={this.state.coreg_log_text}
                                        style={{
                                            width: "90%",
                                            backgroundColor: "black",
                                            color: "white",
                                            padding: "10px",
                                            margin: "8px"
                                        }}
                                />
                                <br/>
                                <form onSubmit={this.fetchCoregLog}>
                                    <Button variant="contained" color="primary" type="submit" sx={{margin: "8px"}}>
                                        Check Coreg progress
                                    </Button>
                                </form>
                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Vol2vol Output Status
                                </Typography>
                                <Divider/>
                                <br/>
                                <TextareaAutosize
                                        id="vol2vol-status-text"
                                        aria-label="Status Log"
                                        placeholder="Status Log of vol2vol function"
                                        value={this.state.vol2vol_log_text}
                                        style={{
                                            width: "90%",
                                            backgroundColor: "black",
                                            color: "white",
                                            padding: "10px",
                                            margin: "8px"
                                        }}
                                />
                                <br/>
                                <form onSubmit={this.fetchVol2volLog}>
                                    <Button variant="contained" color="primary" type="submit" sx={{margin: "8px"}}>
                                        Check Vol2vol progress
                                    </Button>
                                </form>
                                {/* #TODO Button Should redirect to specific page denoted by workflowid, stepid, runid */}
                                {this.state.coreg_results && (
                                        <MRIViewerWin requested_file_1={this.state.selected_ref_file_name}
                                                      requested_file_2={"flair_reg_".concat(this.state.selected_ref_file_name)}/>
                                )}
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={this.state.tabvalue} index={2}>
                        <Grid container direction="row">
                            <Grid item xs={4} sx={{borderRight: "1px solid grey"}}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    SAMSEG
                                </Typography>
                                <Typography variant="subtitle1" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Sequence Adaptive Multimodal SEGmentation
                                </Typography>
                                <hr/>
                                <form onSubmit={this.startSamseg}>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="input_file_name-selector-label">File</InputLabel>
                                        <Select
                                                labelId="input_file_name-selector-label"
                                                id="input_file_name-selector"
                                                value={this.state.selected_input_file_name}
                                                label="input File name"
                                                onChange={this.handleSelectInputFileNameChange}
                                        >
                                            {this.state.file_names.map((column) => (
                                                    <MenuItem value={column}>{column}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Select Input File name.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="input_flair_file_name-selector-label">File</InputLabel>
                                        <Select
                                                labelId="input_flair_file_name-selector-label"
                                                id="input_flair_file_name-selector"
                                                value={this.state.selected_input_flair_file_name}
                                                label="input_flair File name"
                                                onChange={this.handleSelectInputFlairFileNameChange}
                                        >
                                            <MenuItem value={"None"}><em>None</em></MenuItem>
                                            {this.state.file_names.map((column) => (
                                                    <MenuItem value={column}>{column}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Select input flair File name.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="lession-selector-label">Segment white matter
                                            lessions</InputLabel>
                                        <Select
                                                labelId="lession-selector-label"
                                                id="lession-selector"
                                                value={this.state.selected_lession}
                                                label="Segment white matter lessions"
                                                onChange={this.handleSelectLessionChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>If True, segment white matter lessions</FormHelperText>
                                    </FormControl>
                                    <div style={{display: (this.state.selected_lession === "true" ? 'block' : 'none')}}>
                                        <div style={{display: (this.state.selected_input_file_name === "None" ? 'none' : 'block')}}>
                                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                                <InputLabel id="lession_mask_pattern_file-selector-label">Lession mask
                                                    pattern for input file</InputLabel>
                                                <Select
                                                        labelId="lession_mask_pattern_file-selector-label"
                                                        id="lession_mask_pattern_file-selector"
                                                        value={this.state.selected_lession_mask_pattern_file}
                                                        label="Lession mask pattern for input file"
                                                        onChange={this.handleSelectLessionMaskPatternFileChange}
                                                >
                                                    <MenuItem value={"-1"}><em>-1</em></MenuItem>
                                                    <MenuItem value={"0"}><em>0</em></MenuItem>
                                                    <MenuItem value={"1"}><em>1</em></MenuItem>
                                                </Select>
                                                <FormHelperText>Lession mask pattern for input file. -1 or 1 indicates
                                                    the voxels should be darker or brighter than cortical gray matter,
                                                    respectively. 0 means that no intensity constraint is applied to
                                                    input file</FormHelperText>
                                            </FormControl>
                                        </div>
                                        <div style={{display: (this.state.selected_input_flair_file_name === "None" ? 'none' : 'block')}}>
                                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                                <InputLabel id="lession_mask_pattern_flair-selector-label">Lession mask
                                                    pattern for input flair</InputLabel>
                                                <Select
                                                        labelId="lession_mask_pattern_flair-selector-label"
                                                        id="lession_mask_pattern_flair-selector"
                                                        value={this.state.selected_lession_mask_pattern_flair}
                                                        label="Lession mask pattern for input flair"
                                                        onChange={this.handleSelectLessionMaskPatternFlairChange}
                                                >
                                                    <MenuItem value={"-1"}><em>-1</em></MenuItem>
                                                    <MenuItem value={"0"}><em>0</em></MenuItem>
                                                    <MenuItem value={"1"}><em>1</em></MenuItem>
                                                </Select>
                                                <FormHelperText>Lession mask pattern for input flair. -1 or 1 indicates
                                                    the voxels should be darker or brighter than cortical gray matter,
                                                    respectively. 0 means that no intensity constraint is applied to
                                                    input flair</FormHelperText>
                                            </FormControl>
                                        </div>
                                        <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                            <TextField
                                                    labelId="threshold-label"
                                                    id="threshold-selector"
                                                    value={this.state.selected_threshold}
                                                    label="threshold"
                                                    onChange={this.handleSelectThreshold}
                                            />
                                            <FormHelperText>Threshold applied to the probability of a voxel being
                                                lesion. Default is 0.3, tweaking this value (between 0.0 and 1.0)
                                                changes the balance between false positive (low threshold value) and
                                                false negative (high threshold value) lesion
                                                detections.</FormHelperText>
                                        </FormControl>
                                    </div>
                                    <div className="button-container">
                                        <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                disabled={this.state.samseg_started}
                                                style={{width: '100%'}}
                                        >
                                            Start Samseg
                                        </Button>
                                        <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.redirectToPage.bind(this, "samseg_results", [], [])}
                                                disabled={this.state.samseg_finished ? false : true}
                                        >
                                            Check Results
                                        </Button>
                                        <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={this.upload_to_trino}
                                        >
                                            Upload to trino
                                        </Button>
                                        <ProceedButton></ProceedButton>
                                    </div>
                                    <Divider/>
                                </form>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    SAMSEG Output Status
                                </Typography>
                                <Divider/>
                                <form onSubmit={this.fetchSamsegLog}>
                                    <Button variant="contained" color="primary" type="submit" sx={{margin: "8px"}}>
                                        Check progress
                                    </Button>
                                </form>
                                <br/>
                                <TextareaAutosize
                                        id="recon-status-text"
                                        aria-label="Status Log"
                                        placeholder="Status Log of recon function"
                                        value={this.state.samseg_log_text}
                                        style={{
                                            width: "90%",
                                            backgroundColor: "black",
                                            color: "white",
                                            padding: "10px",
                                            margin: "8px"
                                        }}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={this.state.tabvalue} index={3}>
                        <Grid container direction="row">
                            <Grid item xs={4} sx={{borderRight: "1px solid grey"}}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    SynthSeg
                                </Typography>
                                <hr/>
                                <form onSubmit={this.startSynthSeg}>
                                    <FormControl sx={{m: 1, width: '90%'}} size="small">
                                        <InputLabel id="input_file_name-selector-label">File</InputLabel>
                                        <Select
                                                labelId="input_file_name-selector-label"
                                                id="input_file_name-selector"
                                                value={this.state.selected_synthseg_input_file_name}
                                                label="Input File name"
                                                onChange={this.handleSelectSynthsegInputFileNameChange}
                                        >
                                            {this.state.file_names.map((fileName) => (
                                                    <MenuItem value={fileName}>{fileName}</MenuItem>
                                            ))}
                                        </Select>
                                        <FormHelperText>Select Input File name.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size="small">
                                        <InputLabel id="parc-selector-label">Parcelation</InputLabel>
                                        <Select
                                                labelId="parc-selector-label"
                                                id="parc-selector"
                                                value={this.state.selected_parc}
                                                label="Parcelation"
                                                onChange={this.handleParcChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Whether to perform cortical parcellation alongside whole-brain
                                            segmentation.</FormHelperText>
                                    </FormControl>

                                    <FormControl sx={{m: 1, width: '90%'}} size="small">
                                        <InputLabel id="robust-selector-label">Robust</InputLabel>
                                        <Select
                                                labelId="robust-selector-label"
                                                id="robust-selector"
                                                value={this.state.selected_robust}
                                                label="Robust"
                                                onChange={this.handleRobustChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Whether to use the variant for increased robustness in clinical
                                            data with large space gaps, may slow down processing.</FormHelperText>
                                    </FormControl>

                                    <FormControl sx={{m: 1, width: '90%'}} size="small">
                                        <InputLabel id="fast-selector-label">Fast</InputLabel>
                                        <Select
                                                labelId="fast-selector-label"
                                                id="fast-selector"
                                                value={this.state.selected_fast}
                                                label="Fast"
                                                onChange={this.handleFastChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Speeds up prediction by disabling some postprocesses. Not
                                            applicable if Robust is True.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="vol-save">Save volume</InputLabel>
                                        <Select
                                                labelId="vol-save"
                                                id="vol-save"
                                                value={this.state.selected_vol_save}
                                                label="Save volume"
                                                onChange={this.handleVolPathChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Whether to save segmented regions' volumes. Matches input type
                                            for single or multiple subjects.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                        <InputLabel id="qc-save">Save Qc Scores</InputLabel>
                                        <Select
                                                labelId="qc-save"
                                                id="qc-save"
                                                value={this.state.selected_qc_save}
                                                label="Save Qc Scores"
                                                onChange={this.handleQCPathChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Whether to save QC scores, following the same formatting as Save
                                            Volume.</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size="small">
                                        <InputLabel id="post-save">Save 3D posterior probabilities</InputLabel>
                                        <Select
                                                labelId="post-save"
                                                id="post-save"
                                                value={this.state.selected_post_save}
                                                label="Save 3D posterior probabilities"
                                                onChange={this.handlePostPathChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Whether to save output 3D posterior probabilities, matching the
                                            input type</FormHelperText>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width: '90%'}} size="small">
                                        <InputLabel id="resample-save">Save resampled images</InputLabel>
                                        <Select
                                                labelId="resample-save"
                                                id="resample-save"
                                                value={this.state.selected_resample_save}
                                                label="Save resampled images"
                                                onChange={this.handleRessamplePathChange}
                                        >
                                            <MenuItem value={"true"}><em>True</em></MenuItem>
                                            <MenuItem value={"false"}><em>False</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Whether to save the resampled images. Applies to returning
                                            segmentations at 1mm resolution.</FormHelperText>
                                    </FormControl>
                                    <Divider/>
                                    <Button variant="contained" color="primary" type="submit"
                                            disabled={this.state.synthseg_started} sx={{margin: "8px", width: "90%"}}>
                                        Start SynthSeg
                                    </Button>
                                </form>
                                <div className="button-container">
                                    {/*TODO Button Should redirect to specific page denoted by workflowid, stepid, runid*/}
                                    <Button variant="contained" color="primary"
                                            onClick={this.redirectToPage.bind(this, "synthseg_results", [], [])}
                                            disabled={(this.state.synthseg_finished ? false : "disabled")}>
                                        Check out Results
                                    </Button>
                                    <ProceedButton></ProceedButton>
                                </div>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    SynthSeg Output Status
                                </Typography>
                                <Divider/>
                                <form onSubmit={this.fetchSynthSegLog}>
                                    <Button variant="contained" color="primary" type="submit" sx={{margin: "8px"}}>
                                        Check progress
                                    </Button>
                                </form>
                                <br/>
                                <TextareaAutosize
                                        id="synthseg-status-text"
                                        aria-label="Status Log"
                                        placeholder="Status Log of SynthSeg function"
                                        value={this.state.synthseg_log_text}
                                        style={{
                                            width: "90%",
                                            backgroundColor: "black",
                                            color: "white",
                                            padding: "10px",
                                            margin: "8px"
                                        }}
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={this.state.tabvalue} index={4}>
                        <Grid container direction="row">
                            <Grid item xs={4} sx={{borderRight: "1px solid grey"}}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Folders to be uploaded
                                </Typography>
                                <Divider/>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Folder</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Object.keys(this.state.foldersExist).map((folder) => (
                                                    <TableRow key={folder}>
                                                        <TableCell>{folder}</TableCell>
                                                        <TableCell>
                                                            {this.state.foldersExist[folder] ?
                                                                    <CheckIcon color="success"/> :
                                                                    <CloseIcon color="error"/>}
                                                        </TableCell>
                                                    </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                            <Grid item xs={8}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Proceed
                                </Typography>
                                <Divider/>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'column',
                                    minHeight: '200px'
                                }}>
                                    {this.state.loading ? (
                                            <>
                                                <CircularProgress size={100}/>
                                                <Typography variant="body1"
                                                            sx={{flexGrow: 1, textAlign: "center", marginTop: "16px"}}
                                                            noWrap>
                                                    {this.state.current_execution ? `${this.state.current_execution}` : ""}
                                                </Typography>
                                            </>
                                    ) : this.state.processCompleted ? (
                                            <Typography variant="body1"
                                                        sx={{flexGrow: 1, textAlign: "center", marginTop: "16px"}}
                                                        noWrap>
                                                Redirecting to the next step of the workflow manager...
                                            </Typography>
                                    ) : (
                                            <Typography variant="body1"
                                                        sx={{flexGrow: 1, textAlign: "center", marginTop: "16px"}}
                                                        noWrap>
                                                Press the Proceed button to upload all your executed data. The available
                                                data can be seen in the 'Folders to be uploaded' table
                                            </Typography>
                                    )}
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', marginTop: '16px'}}>
                                    <Button variant="contained" color="primary" onClick={this.handleProceedCalls}
                                            sx={{margin: "8px", padding: "12px 24px", fontSize: '16px'}}>
                                        PROCEED
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </TabPanel>
                </Box>
                // <Grid container direction="column">
                //             <Grid container direction="row" >
                //                 {/*<Grid item xs={2} sx={{borderRight: "1px solid grey"}}>*/}
                //                 {/*    <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                //                 {/*        Data Preview*/}
                //                 {/*    </Typography>*/}
                //                 {/*    <Divider/>*/}
                //                 {/*    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                //                 {/*        File Name:*/}
                //                 {/*    </Typography>*/}
                //                 {/*    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                //                 {/*        mri_example*/}
                //                 {/*    </Typography>*/}
                //                 {/*    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                //                 {/*        File Type:*/}
                //                 {/*    </Typography>*/}
                //                 {/*    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                //                 {/*        DICOM*/}
                //                 {/*    </Typography>*/}
                //                 {/*    <Divider/>*/}
                //                 {/*    /!*Not sure if slices need to be displayed*!/*/}
                //                 {/*    /!*<Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*!/*/}
                //                 {/*    /!*    Slices:*!/*/}
                //                 {/*    /!*</Typography>*!/*/}
                //                 {/*    /!*<List>*!/*/}
                //                 {/*    /!*    {this.state.channels.map((channel) => (*!/*/}
                //                 {/*    /!*            <ListItem> <ListItemText primary={channel}/></ListItem>*!/*/}
                //                 {/*    /!*    ))}*!/*/}
                //                 {/*    /!*</List>*!/*/}
                //                 {/*</Grid>*/}
                //
                //
                //
                //             </Grid>
                //             {/*{this.state.show_neurodesk ? <Grid container direction="row">*/}
                //             {/*    <Grid item xs={12} sx={{height: "10vh", borderTop: "1px solid grey", borderBottom: "1px solid grey", backgroundColor: "#0099cc"}}>*/}
                //             {/*        <AppBar position="relative">*/}
                //             {/*            <Toolbar>*/}
                //             {/*                <Button onClick={this.sendToTop} variant="contained" color="secondary"*/}
                //             {/*                        sx={{margin: "8px", float: "right"}}>*/}
                //             {/*                    Back to Top >*/}
                //             {/*                </Button>*/}
                //             {/*            </Toolbar>*/}
                //             {/*        </AppBar>*/}
                //             {/*    </Grid>*/}
                //             {/*</Grid> : ""}*/}
                //             {/*{this.state.show_neurodesk ?*/}
                //             {/*<Grid container direction="row">*/}
                //             {/*    <Grid item xs={12} sx={{height: "90vh"}}>*/}
                //             {/*        <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>*/}
                //             {/*            {this.state.itemData.map((item) => (*/}
                //             {/*                    <ImageListItem key={item.img}>*/}
                //             {/*                        <img*/}
                //             {/*                                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}*/}
                //             {/*                                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                //             {/*                                alt={item.title}*/}
                //             {/*                                loading="lazy"*/}
                //             {/*                        />*/}
                //             {/*                    </ImageListItem>*/}
                //             {/*            ))}*/}
                //             {/*        </ImageList>*/}
                //             {/*        <iframe src="http://localhost:8080/#/?username=user&password=password" style={{width: "95%", height: "100%" , marginLeft: "2.5%"}}></iframe>*/}
                //
                //             {/*    </Grid>*/}
                //             {/*</Grid> : "a"*/}
                //             {/*}*/}
                //         </Grid>

        )
    }
}

export default FreesurferReconFunctionPage;
