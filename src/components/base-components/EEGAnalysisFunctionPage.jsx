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
    MenuItem, Modal,
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
import {Box} from "@mui/system";
import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "80%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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
            selected_part_channel: "",
            added_bipolar_references: [],
            added_channel_references: [],
            selected_reference_channel: "",
            mne_notebook_config: {
                bipolar_references: [],
                average_channel: "",
                notches_enabled: false,
                notches_length: 0
            },
            // bipolar_chips:[],
            //Values selected currently on the form
            selected_test_name: "runId",
            selected_slice: "",
            open_modal: false,

            select_signal_chart_show: false,
            signal_chart_data: [],

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
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleGetChannelSignal = this.handleGetChannelSignal.bind(this);
        this.getSelectionOfSignal = this.getSelectionOfSignal.bind(this);
        this.handleSelectChannelPartChange = this.handleSelectChannelPartChange.bind(this);
        this.handleSendSelectionSignal = this.handleSendSelectionSignal.bind(this);
        this.handleSendMNENotebookConfig = this.handleSendMNENotebookConfig.bind(this);

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

    async handleGetChannelSignal(){
        if (this.state.selected_part_channel === "") {
            return
        }

        API.get("return_signal",
                {
                    params: {input_name: this.state.selected_part_channel,
                    // params: {input_name: this.state.selected_channel,
                    }
                }
        ).then(res => {
            const resultJson = res.data;
            let temp_array_signal = []
            for ( let it =0 ; it < resultJson.signal.length; it++){
                let temp_object = {}
                let adjusted_time = ""
                // First entry is 0 so no need to add any milliseconds
                // Time added is as millisecond/100 so we multiply by 10000
                if(it === 0){
                    adjusted_time = resultJson.start_date_time
                }else{
                    adjusted_time = resultJson.start_date_time + resultJson.signal_time[it]*10000
                }

                let temp_date = new Date(adjusted_time )
                temp_object["date"] = temp_date
                temp_object["yValue"] = resultJson.signal[it]

                temp_array_signal.push(temp_object)
            }

            this.setState({signal_chart_data: temp_array_signal})
            this.setState({select_signal_chart_show: true});
        });
    }

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

    async handleProcessOpenEEG() {
        //Parameter are only placeholder

        //THIS IS A TEST
        this.handleSendMNENotebookConfig()

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

    async handleSendSelectionSignal(event) {
    }

    async handleSendMNENotebookConfig(event) {
        API.post("receive_mne_notebook_configuration",
                {
                    params: this.state.mne_notebook_config
                }
        ).then(res => {
        //   Must reload the notebook from the frontend or trigger it here otherwise

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

    handleSelectChannelPartChange(event) {
        this.setState({selected_part_channel: event.target.value})
    }

    handleModalOpen(){
        this.setState({open_modal: true})
        this.handleGetChannelSignal()
    }

    handleModalClose(){
        this.setState({open_modal: false})
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

    getSelectionOfSignal() {
        let selection_array_from = document.getElementsByClassName('amcharts-range-selector-from-input');
        let selection_array_to = document.getElementsByClassName('amcharts-range-selector-to-input');

        // We assume that only one of this class exists, if more selector amcharts exists in one page this needs to change
        let selection_from_div = selection_array_from[0]
        let selection_to_div = selection_array_to[0]
        console.log(selection_from_div.value)
        console.log(selection_to_div.value)
        this.handleSendSelectionSignal(selection_from_div.value, selection_to_div.value)
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
                                <Button onClick={this.addChannelReference} disabled={(this.state.selected_reference_channel !== "" ? false : true)} variant="contained" color="primary"
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
                                {/* Nested ternary operator that enables button only if both values have a value*/}
                                {/* TODO: Change this to a more readable format and add more condition if necessary like resetting when pressed */}
                                <Button onClick={this.addBipolarReference} disabled={(this.state.selected_channel_cathode !== "" ? this.state.selected_channel_anode === "" ? true : false : true)} variant="contained" color="primary"
                                        sx={{marginLeft: "25%"}}>
                                    Add reference >
                                </Button>
                                <hr/>
                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Select part in channel
                                </Typography>
                                <FormControl sx={{m: 1, width: "80%"}}>
                                    <InputLabel id="channel-part-selector-label">Channel</InputLabel>
                                    <Select
                                            labelId="channel-part-selector-label"
                                            id="channel-part-selector"
                                            value= {this.state.selected_part_channel}
                                            label="Channel"
                                            onChange={this.handleSelectChannelPartChange}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {this.state.channels_anode.map((channel) => (
                                                <MenuItem value={channel}>{channel}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Select channel to select</FormHelperText>
                                </FormControl>
                                <Button variant="contained" color="primary" sx={{marginLeft: "25%"}} disabled={(this.state.selected_part_channel === "" ? true : false)} onClick={this.handleModalOpen}>Open modal</Button>
                                <Modal
                                        open={this.state.open_modal}
                                        onClose={this.handleModalClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        disableEnforceFocus={true}
                                >
                                    <Box sx={style}>
                                        <Typography id="modal-modal-title" variant="h6" component="h2">
                                            Select range of signal
                                        </Typography>
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            To select zoom on the selection you want and when the view matches the wanted selection press select
                                        </Typography>
                                        <div style={{ display: (this.state.select_signal_chart_show ? 'block' : 'none') }}><ChannelSignalPeaksChartCustom chart_id="singal_chart_id" chart_data={ this.state.signal_chart_data}/></div>
                                        <Button onClick={this.getSelectionOfSignal} variant="contained" color="primary"
                                                sx={{marginLeft: "25%"}}>
                                            Get Selection
                                        </Button>
                                    </Box>
                                </Modal>
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
                                    <iframe src="http://localhost:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>

        )
    }
}

export default EEGAnalysisFunctionPage;
