import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    AppBar,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel, Link,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, TextareaAutosize, TextField, Toolbar, Typography
} from "@mui/material";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem'

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";

class EEGAnalysisFunctionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // List of channels sent by the backend
            slices: [],

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

            itemData: [
                {
                    img: 'http://localhost:8000/static/screenshots/lh.pial.T1_127.png',
                },
                {
                    img: 'http://localhost:8000/static/screenshots/rh.pial.T1_127.png',
                    // title: 'Burger',
                }
            ]
        };

        //Binding functions of the class
        this.fetchSlices = this.fetchSlices.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitCheck = this.handleSubmitCheck.bind(this);
        this.handleProcessFinished = this.handleProcessFinished.bind(this);
        this.handleProcessUpdate = this.handleProcessUpdate.bind(this);
        this.handleSelectTestNameChange = this.handleSelectTestNameChange.bind(this);
        this.handleSelectTestNameCheckChange = this.handleSelectTestNameCheckChange.bind(this);
        this.handleSelectSliceChange = this.handleSelectSliceChange.bind(this);
        this.sendToBottom = this.sendToBottom.bind(this);
        this.sendToTop = this.sendToTop.bind(this);

        // Initialise component
        // - values of channels from the backend

        this.fetchSlices();


    }

    /**
     * Call backend endpoint to get channels of eeg
     */
    async fetchSlices(url, config) {
        API.get("list/mri/slices", {}).then(res => {
            this.setState({slices: res.data.slices})
        });
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        // Set the freesurfer process id to log and the appropriate page function
        this.setState({selected_freesurfer_function_id_to_log: this.state.selected_test_name})
        this.setState({selected_page_function: "New"})

        console.log("this.state.selected_test_name")
        console.log(this.state.selected_test_name)
        console.log(this.state.selected_slice)
        API.get("free_surfer/recon",
                {
                    params: {
                        input_test_name: this.state.selected_test_name,
                        input_slices: this.state.selected_slice
                    }
                }
        ).then(res => {
            const result = res.data;
            console.log("Recon")
            console.log(result)
            if (result === "Success") {
                this.setState({
                    returned_status: "Process has commenced: \n" +
                            "Press  the \" Get Status \" button to get its logs and check its progress \n" +
                            "When application is finished press on the \" Process Finished \" button to finalise the results "
                })
            }

        });


    }

    async handleSubmitCheck(event) {
        event.preventDefault();

        // Set the freesurfer process id to log and the appropriate page function
        // No need to do any calls to  backend here since they are done by the get "check progress"button
        this.setState({selected_freesurfer_function_id_to_log: this.state.selected_test_name_check})
        this.setState({selected_page_function: "Old"})
        this.setState({
            returned_status: "Process's status can be queried: \n" +
                    "Press  the \" Get Status \" button to get its logs and check its progress \n" +
                    "When application is finished press on the \" Process Finished \" button to finalise the results "
        })

    }

    async handleProcessUpdate(event) {
        event.preventDefault();
        // This function should in the future call the free_surfer/recon/check endpoint and provide the name
        API.get("freesurfer/status/",
                {
                    params: {}
                }
        ).then(res => {
            const resultJson = res.data;
            console.log("status")
            console.log(resultJson)
            let prevstate = this.state.returned_status + res.data.status
            this.setState({returned_status: prevstate})

        });

        // API.get("free_surfer/recon/check",
        //         {
        //             params: {
        //                 input_test_name_check: this.state.selected_test_name_check
        //             }
        //         }
        // ).then(res => {
        //     const result = res.data;
        //     console.log("Recon")
        //     console.log(result)
        //
        // });
    }

    async handleProcessFinished() {
        // event.preventDefault();
        // let confirmAction = window.confirm("Are you sure the process is finalised? \n The output will be sent to the datalake regardless of the output \n If fore some reason you believe the process has failed either no new logs for a significant amount of time or logs have explicitly stated failure contact the administrators and send the logs");
        // if (confirmAction) {
        //     alert("Action successfully executed");
        // } else {
        //     alert("Action canceled");
        // }

        // Show neurodesk
        this.setState({show_neurodesk: true});
        console.log("show_neurodesk")
        console.log(this.state.show_neurodesk)
        // Finally scroll to bottom where iframe is
        window.scrollTo(0, document.body.scrollHeight);
        API.get("free_view",
                {
                    params: {
                        input_test_name: this.state.selected_test_name,
                        input_slices: this.state.selected_slice
                    }
                }
        ).then(res => {
            const result = res.data;
            console.log("Freeview")
            console.log(result)
            if (result === "Success") {
                this.setState({
                    returned_status: "Process has commenced: \n" +
                            "Press  the \" Get Status \" button to get its logs and check its progress \n" +
                            "When application is finished press on the \" Process Finished \" button to finalise the results "
                })
            }

        });

    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectTestNameChange(event) {
        this.setState({selected_test_name: event.target.value})
    }

    handleSelectSliceChange(event) {
        this.setState({selected_slice: event.target.value})
    }

    handleSelectTestNameCheckChange(event) {
        this.setState({selected_test_name_check: event.target.value})
    }

    sendToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    sendToTop() {
        window.scrollTo(0, 0)
    }


    render() {
        return (
                <Grid container direction="column">
                    <Grid container direction="row">
                        <Grid item xs={2} sx={{borderRight: "1px solid grey"}}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Data Preview
                            </Typography>
                            <hr/>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                File Name:
                            </Typography>
                            <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                EDF_example
                            </Typography>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                File Type:
                            </Typography>
                            <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                EDF
                            </Typography>
                            <hr/>
                            {/*Not sure if slices need to be displayed*/}
                            {/*<Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                            {/*    Slices:*/}
                            {/*</Typography>*/}
                            {/*<List>*/}
                            {/*    {this.state.channels.map((channel) => (*/}
                            {/*            <ListItem> <ListItemText primary={channel}/></ListItem>*/}
                            {/*    ))}*/}
                            {/*</List>*/}
                        </Grid>
                        <Grid item xs={10} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black"}}>
                            {/*<Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                            {/*    EEG Analysis*/}
                            {/*</Typography>*/}
                            {/*<hr/>*/}
                            <Grid container direction="row">
                                <Grid item xs={12}
                                      sx={{height: "10vh", borderTop: "2px solid black", backgroundColor: "#0099cc"}}>
                                    <AppBar position="relative">
                                        <Toolbar>
                                            <Button onClick={this.sendToTop} variant="contained" color="secondary"
                                                    sx={{margin: "8px", float: "right"}}>
                                                Show EDF >
                                            </Button>
                                        </Toolbar>
                                    </AppBar>
                                </Grid>
                            </Grid>

                            <Grid container direction="row">
                                <Grid item xs={12} sx={{height: "82vh"}}>
                                    <iframe src="http://localhost:8080/#/?username=user&password=password" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>

        )
    }
}

export default EEGAnalysisFunctionPage;
