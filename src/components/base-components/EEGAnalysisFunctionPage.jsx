import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    AppBar,
    Button, Checkbox, Chip,
    FormControl, FormControlLabel, FormGroup,
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextareaAutosize,
    TextField,
    Toolbar,
    Typography
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
            channels_anode: [],
            channels_cathode: [],
            selected_channel_anode: "",
            selected_channel_cathode: "",
            added_bipolar_references: [],
            added_channel_references: [],
            selected_reference_channel: "",
            // bipolar_chips:[],
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
            selected_notch_length: 0,
            selected_notch: false,
            //Returned variables
            returned_status: "",
            list_annotations: [],
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
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitCheck = this.handleSubmitCheck.bind(this);
        this.handleProcessFinished = this.handleProcessFinished.bind(this);
        this.handleProcessUpdate = this.handleProcessUpdate.bind(this);
        this.handleSelectTestNameChange = this.handleSelectTestNameChange.bind(this);
        this.handleSelectTestNameCheckChange = this.handleSelectTestNameCheckChange.bind(this);
        this.handleSelectSliceChange = this.handleSelectSliceChange.bind(this);
        this.sendToBottom = this.sendToBottom.bind(this);
        this.sendToTop = this.sendToTop.bind(this);
        this.handleProcessOpenEEG = this.handleProcessOpenEEG.bind(this);
        this.handleGetAnnotations = this.handleGetAnnotations.bind(this);
        this.handleSelectNotchLengthChange = this.handleSelectNotchLengthChange.bind(this);
        this.handleSelectNotchSelectedChange = this.handleSelectNotchSelectedChange.bind(this);
        this.addBipolarReference = this.addBipolarReference.bind(this);
        this.handleSelectChannelAnodeChange = this.handleSelectChannelAnodeChange.bind(this);
        this.handleSelectChannelCathodeChange = this.handleSelectChannelCathodeChange.bind(this);
        this.handleDeleteBipolarChip = this.handleDeleteBipolarChip.bind(this);
        this.handleSelectChannelReferenceChange = this.handleSelectChannelReferenceChange.bind(this);
        this.addChannelReference = this.addChannelReference.bind(this);
        this.handleDeleteReferenceChip = this.handleDeleteReferenceChip.bind(this);

        // Initialise component
        // - values of channels from the backend

        this.fetchSlices();
        this.handleProcessOpenEEG();
        setInterval(this.handleGetAnnotations, 5000);
        this.fetchChannels();
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

    async handleProcessOpenEEG() {
        //Parameter are only placeholder
        API.get("/mne/open/eeg",
                {
                    params: {
                        input_run_id: "a",
                        input_step_id: "b"
                    }
                }
        ).then(res => {
        });

    }

    async handleGetAnnotations() {
        //Parameter are only placeholder
        API.get("/mne/return_annotations",
                {

                }
        ).then(res => {
            // console.log(res.data)
            this.setState({list_annotations: res.data})
        });

    }

    // async autoLoadAnnotations() {
    //     const result = await api.getStock(props.item)
    //     console.log(props.item)
    //     const symbol = result.data.symbol
    //     const lastest = result.data.latestPrice
    //     const change = result.data.change
    //     setStock({symbol:symbol, lastest:lastest, change:change})
    // }

// Write this line

    async fetchChannels(url, config) {
        API.get("list/channels", {}).then(res => {
            this.setState({channels_cathode: res.data.channels})
            this.setState({channels_anode: res.data.channels})
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
    handleSelectChannelCathodeChange(event){
        this.setState({selected_channel_cathode: event.target.value})
    }
    handleSelectChannelAnodeChange(event){
        this.setState({selected_channel_anode: event.target.value})
    }
    handleSelectNotchSelectedChange(event) {
        this.setState({selected_notch: event.target.checked})
        // alert("hey")
        // console.log(this.state.selected_notch)
    }
    handleSelectNotchLengthChange(event) {
        this.setState({selected_notch_length: event.target.value})
    }
    handleSelectChannelReferenceChange(event) {
        this.setState({selected_reference_channel: event.target.value})
    }

    sendToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    sendToTop() {
        window.scrollTo(0, 0)
    }

    handleDeleteReferenceChip (channel_name) {
        for (let i=0; i < this.state.added_channel_references.length; i++){
            let temp_references = this.state.added_channel_references
            if(temp_references[i] === channel_name){
                console.log("temp_references")
                console.log(temp_references[i])
                temp_references.splice(i,1)
                console.log(temp_references)
                this.setState({added_channel_references: temp_references})
                return
            }
        }
    }

    handleDeleteBipolarChip (anode, cathode) {
        console.log(anode)
        console.log(cathode)
        for (let i=0; i < this.state.added_bipolar_references.length; i++){
            let temp_references = this.state.added_bipolar_references
            if(temp_references[i]["anode"] === anode && temp_references[i]["cathode"] === cathode){
                temp_references.splice(i,1)
                this.setState({added_bipolar_references: temp_references})
                return
            }
        }
    }

    addBipolarReference() {
        // Check if both fields are filled
        if(this.state.selected_channel_anode === "" || this.state.selected_channel_cathode === ""){
            console.log("cancel")
            return
        }

        this.setState({added_bipolar_references: [...this.state.added_bipolar_references,
                {"anode": this.state.selected_channel_anode,
                "cathode":this.state.selected_channel_cathode
                }]})
        // console.log(this.state.added_bipolar_references)

    }

    addChannelReference() {
        // Check if both fields are filled
        if(this.state.selected_reference_channel === "" ){
            // console.log("cancel")
            return
        }

        this.setState({added_channel_references: [...this.state.added_channel_references, this.state.selected_reference_channel]})
        // console.log(this.state.added_bipolar_references)
    }


    render() {
        return (
                <Grid container direction="column">
                    <Grid container direction="row">
                        <Grid item xs={2} sx={{borderRight: "1px solid grey"}}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                File preview
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
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Annotations in File
                            </Typography>
                            <TableContainer component={Paper}>
                                {/* sx={{ minWidth: 650 }}*/}
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="right">Creator</TableCell>
                                            <TableCell align="right">Description</TableCell>
                                            <TableCell align="right">Onset</TableCell>
                                            <TableCell align="right">Duration</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.list_annotations.map((row) => (
                                                <TableRow
                                                        key={row.name}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell align="right">{row.creator}</TableCell>
                                                    <TableCell align="right">{row.description}</TableCell>
                                                    <TableCell align="right">{row.onset}</TableCell>
                                                    <TableCell align="right">{row.duration}</TableCell>
                                                </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

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
                        <Grid item xs={2} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black"}}>
                            <form onSubmit={this.handleSubmit}>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    EEG Settings
                                </Typography>
                                <hr/>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Notch Filter
                                </Typography>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox onChange={this.handleSelectNotchSelectedChange} />} label="Enable Notches" />
                                    <FormControl sx={{m: 1, minWidth: 120}}>
                                        <TextField
                                                // labelId="nfft-selector-label"
                                                id="notch-length-selector"
                                                value= {this.state.selected_notch_length}
                                                label="Notch length"
                                                disabled={!this.state.selected_notch}
                                                onChange={this.handleSelectNotchLengthChange}
                                        />
                                        <FormHelperText>Length of the Notch</FormHelperText>
                                    </FormControl>
                                </FormGroup>
                                <hr/>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Reference Channels
                                </Typography>
                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Average Reference
                                </Typography>
                                <FormControl sx={{m: 1, width: "80%"}}>
                                    {this.state.added_channel_references.map((chip_data) => (
                                            <Chip label={chip_data} variant="outlined" onDelete={this.handleDeleteReferenceChip.bind(this, chip_data)} />
                                    ))}
                                    <InputLabel id="channel-reference-selector-label">Channel</InputLabel>
                                    <Select
                                            labelId="channel-reference-selector-label"
                                            id="channel-reference-selector"
                                            value= {this.state.selected_reference_channel}
                                            label="Channel"
                                            onChange={this.handleSelectChannelReferenceChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {this.state.channels_cathode.map((channel) => (
                                                <MenuItem value={channel}>{channel}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select reference channel</FormHelperText>
                                </FormControl>
                                <Button onClick={this.addChannelReference} variant="contained" color="primary"
                                        sx={{marginLeft: "10%"}}>
                                    Add reference channel >
                                </Button>
                                <hr/>
                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Bipolar Reference
                                </Typography>
                                {this.state.added_bipolar_references.map((chip_data) => (
                                        <Chip label={chip_data["anode"] + "||" + chip_data["cathode"]} variant="outlined" onDelete={this.handleDeleteBipolarChip.bind(this, chip_data["anode"], chip_data["cathode"])} />
                                ))}
                                <FormControl sx={{m: 1, width: "80%"}}>
                                    <InputLabel id="channel-anode-selector-label">Channel</InputLabel>
                                    <Select
                                            labelId="channel-anode-selector-label"
                                            id="channel-anode-selector"
                                            value= {this.state.selected_channel_anode}
                                            label="Channel"
                                            onChange={this.handleSelectChannelAnodeChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {this.state.channels_anode.map((channel) => (
                                                <MenuItem value={channel}>{channel}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select anode channel</FormHelperText>
                                </FormControl>

                                <FormControl sx={{m: 1, width: "80%"}}>
                                    <InputLabel id="channel-cathode-selector-label">Channel</InputLabel>
                                    <Select
                                            labelId="channel-cathode-selector-label"
                                            id="channel-cathode-selector"
                                            value= {this.state.selected_channel_cathode}
                                            label="Channel"
                                            onChange={this.handleSelectChannelCathodeChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {this.state.channels_cathode.map((channel) => (
                                                <MenuItem value={channel}>{channel}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select anode channel</FormHelperText>
                                </FormControl>
                                <Button onClick={this.addBipolarReference} variant="contained" color="primary"
                                        sx={{marginLeft: "25%"}}>
                                    Add reference >
                                </Button>
                                <hr/>
                                <Button onClick={this.handleProcessOpenEEG} variant="contained" color="secondary"
                                        sx={{margin: "8px", float: "right"}}>
                                    Apply Changes>
                                </Button>
                            </form>
                        </Grid>
                        <Grid item xs={8} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black"}}>
                            {/*<Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                            {/*    EEG Analysis*/}
                            {/*</Typography>*/}
                            {/*<hr/>*/}
                            <Grid container direction="row">
                                <Grid item xs={12}
                                      sx={{height: "10vh", borderTop: "2px solid black", backgroundColor: "#0099cc"}}>
                                    <AppBar position="relative">
                                        <Toolbar>
                                            <Button onClick={this.handleGetAnnotations} variant="contained" color="secondary"
                                                    sx={{margin: "8px", float: "center"}}>
                                                Get Annotations>
                                            </Button>
                                            <Button onClick={this.handleProcessOpenEEG} variant="contained" color="secondary"
                                                    sx={{margin: "8px", float: "right"}}>
                                                Restart View App >
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
