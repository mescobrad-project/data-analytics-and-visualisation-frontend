import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    Button, Divider,
    Grid,
    TextareaAutosize, Typography
} from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem'

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import ProceedButton from "../ui-components/ProceedButton";

class FreesurferReconFunctionPage extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of channels sent by the backend
            slices: [],

            // Running status
            recon_started: false,
            samseg_started: false,

            // Logs status
            recon_finished: false,
            samseg_finished: false,
            recon_log_text: "",
            samseg_log_text: "",

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

            //Function to show/hide
            show_neurodesk: true,

            //Returned variables
            returned_status: "",

            itemData : [
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
        this.fetchReconLog = this.fetchReconLog.bind(this);
        this.fetchSamsegLog = this.fetchSamsegLog.bind(this);
        this.redirectToPage = this.redirectToPage.bind(this);

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
            if (result === "Success")
            {
                this.setState({recon_started: true})
                console.log(" Recon Success")
            }
            else
            {
                console.log(" Recon Failed")
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
                    }
                }).then(res => {
            const result = res.data;
            if (result === "Success")
            {
                this.setState({samseg_started: true})
                console.log(" Samseg Success")
            }
            else
            {
                console.log(" Samseg Failed")
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
            if (result === true)
            {
                this.setState({recon_finished: true})
                this.setState({recon_log_text: "Function has finished please press the \" Process \" button to" +
                            " proceed after both functions have completed successfully"})

            }
            else
            {
                this.setState({recon_finished: false})
                this.setState({recon_log_text: "Function has not finished yet please press the \" Check Progress \"" +
                            " button to check its progress again after a while"})
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
            if (result === true)
            {
                this.setState({samseg_finished: true})
                this.setState({samseg_log_text: "Function has finished please press the \" Process \" button to" +
                            " proceed after both functions have completed successfully"})
            }
            else
            {
                this.setState({samseg_finished: false})
                this.setState({samseg_log_text: "Function has not finished yet please press the \" Check Progress \" " +
                            "button to check its progress again after a while"})
            }
        });
    }


    async redirectToPage(workflow_id, run_id, step_id, function_name, bucket, file) {
        // Send the request
        let files_to_send = []
        for (let it=0 ; it< bucket.length;it++){
            files_to_send.push([bucket[it], file[it]])
        }

        API.put("function/navigation/",
                {
                    workflow_id: workflow_id,
                    run_id: run_id,
                    step_id: step_id,
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
                <Grid container direction="column">
                    <Grid container direction="row" >
                        {/*<Grid item xs={2} sx={{borderRight: "1px solid grey"}}>*/}
                        {/*    <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        Data Preview*/}
                        {/*    </Typography>*/}
                        {/*    <Divider/>*/}
                        {/*    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        File Name:*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        mri_example*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        File Type:*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        DICOM*/}
                        {/*    </Typography>*/}
                        {/*    <Divider/>*/}
                        {/*    /!*Not sure if slices need to be displayed*!/*/}
                        {/*    /!*<Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*!/*/}
                        {/*    /!*    Slices:*!/*/}
                        {/*    /!*</Typography>*!/*/}
                        {/*    /!*<List>*!/*/}
                        {/*    /!*    {this.state.channels.map((channel) => (*!/*/}
                        {/*    /!*            <ListItem> <ListItemText primary={channel}/></ListItem>*!/*/}
                        {/*    /!*    ))}*!/*/}
                        {/*    /!*</List>*!/*/}
                        {/*</Grid>*/}
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
                                    id = "recon-status-text"
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

                            {/* #TODO Button Should redirect to specific page denoted by workflowid, stepid, runid */}
                            <Button  variant="contained" color="primary"
                                     onClick={this.redirectToPage.bind(this,1, 1, 3, "recon_all_results", ["saved"], ["psg1 anonym2.edf"])}
                                     disabled={ (this.state.recon_finished ? false : "disabled")  }
                                    sx={{margin: "8px"}}>
                                Check out Results
                            </Button>
                            <ProceedButton></ProceedButton>

                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Sequence Adaptive Multimodal SEGmentation (SAMSEG)
                            </Typography>
                            <Divider/>
                            <div style={{display: (this.state.samseg_started ? 'none' : 'block')}}>
                                <form onSubmit={this.startSamseg}>
                                    <Button variant="contained" color="primary" type="submit">
                                        Start Process
                                    </Button>
                                </form>
                                <Divider/>
                            </div>
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
                                    id = "recon-status-text"
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
                            {/* #TODO Button Should redirect to specific page denoted by workflowid, stepid, runid */}
                            <Button  variant="contained" color="primary"
                                     onClick={this.redirectToPage.bind(this,1, 1, 3, "samseg_results", ["saved"], ["psg1 anonym2.edf"])}
                                     disabled={ (this.state.samseg_finished ? false : "disabled")  }
                                     sx={{margin: "8px"}}>
                                Check out Results
                            </Button>
                        </Grid>


                    </Grid>
                    {/*{this.state.show_neurodesk ? <Grid container direction="row">*/}
                    {/*    <Grid item xs={12} sx={{height: "10vh", borderTop: "1px solid grey", borderBottom: "1px solid grey", backgroundColor: "#0099cc"}}>*/}
                    {/*        <AppBar position="relative">*/}
                    {/*            <Toolbar>*/}
                    {/*                <Button onClick={this.sendToTop} variant="contained" color="secondary"*/}
                    {/*                        sx={{margin: "8px", float: "right"}}>*/}
                    {/*                    Back to Top >*/}
                    {/*                </Button>*/}
                    {/*            </Toolbar>*/}
                    {/*        </AppBar>*/}
                    {/*    </Grid>*/}
                    {/*</Grid> : ""}*/}
                    {/*{this.state.show_neurodesk ?*/}
                    {/*<Grid container direction="row">*/}
                    {/*    <Grid item xs={12} sx={{height: "90vh"}}>*/}
                    {/*        <ImageList sx={{ width: 500, height: 200 }} cols={3} rowHeight={164}>*/}
                    {/*            {this.state.itemData.map((item) => (*/}
                    {/*                    <ImageListItem key={item.img}>*/}
                    {/*                        <img*/}
                    {/*                                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}*/}
                    {/*                                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                    {/*                                alt={item.title}*/}
                    {/*                                loading="lazy"*/}
                    {/*                        />*/}
                    {/*                    </ImageListItem>*/}
                    {/*            ))}*/}
                    {/*        </ImageList>*/}
                    {/*        <iframe src="http://localhost:8080/#/?username=user&password=password" style={{width: "95%", height: "100%" , marginLeft: "2.5%"}}></iframe>*/}

                    {/*    </Grid>*/}
                    {/*</Grid> : "a"*/}
                    {/*}*/}
                </Grid>

        )
    }
}

export default FreesurferReconFunctionPage;
