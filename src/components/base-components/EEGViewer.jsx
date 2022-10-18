import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import {
    AppBar,
    Button, Checkbox, Chip, Divider,
    FormControl, FormControlLabel, FormGroup,
    FormHelperText,
    Grid,
    InputLabel,
    Link,
    List,
    ListItem, ListItemIcon,
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
// import { withRouter } from "react-router";
import withRouter from '../withRouter';
// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import {Box} from "@mui/system";
import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";
import { ReactSVG } from 'react-svg'
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

class EEGViewer extends React.Component {
    // static propTypes = {
    //     /** Prop "chart_id" provides the id of the chart and needs to be unique in each page */
    //     egg_function: PropTypes.string,
    //     /** Prop "chart_data" provides the data of the chart, inside the array there should be an object with two keys
    //      * yValue
    //      * category
    //      * */
    //     run_id: PropTypes.string,
    //     step_id: PropTypes.string
    // }

    constructor(props) {
        super(props);
        this.state = {
            //Channel Select order modal
            checked: [],
            leftChecked: [],
            rightChecked: [],
            left:[],
            right:[],
            // List of channels sent by the backend
            slices: [],
            eeg_function: "",

            //Values for selecting channel part
            selected_part_channel: "",
            selected_start_time: "",
            selected_stop_time: "",
            signal_original_start_seconds: 0,

            //Values For Bipolar Reference
            added_bipolar_references: [],
            channels_anode: [],
            channels_cathode: [],
            selected_channel_anode: "",
            selected_channel_cathode: "",

            //Values for Reference
            added_channel_references: [],
            selected_reference_type: "none",
            selected_reference_channel: "",

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
            selected_notch_length: 50,
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
        this.handleSendNotebookAndSelectionConfig = this.handleSendNotebookAndSelectionConfig.bind(this);
        this.handleSelectReferenceTypeChange = this.handleSelectReferenceTypeChange.bind(this);
        this.handleProcceed = this.handleProcceed.bind(this);
        this.not = this.not.bind(this);
        this.intersection = this.intersection.bind(this);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleAllRight = this.handleAllRight.bind(this);
        this.handleCheckedRight = this.handleCheckedRight.bind(this);
        this.handleCheckedLeft = this.handleCheckedLeft.bind(this);
        this.handleAllLeft = this.handleAllLeft.bind(this);
        this.customList = this.customList.bind(this);
        this.debug = this.debug.bind(this);

        // Initialise component
        // - values of channels from the backend

        this.fetchSlices();
        this.handleProcessOpenEEG();
        // setInterval(this.handleGetAnnotations, 5000);
        this.fetchChannels();
        // const location = useLocation();
        console.log("PROPS")
        // console.log(this.props.match.params)
        console.log(window.location.search)
        // const queryParams = new URLSearchParams(window.location.search)
        // for (const [key, value] of queryParams) {
        //     if(key === "eeg_function"){
        //         console.log("HEYHEYHAEYHYAID")
        //         console.log(value)
        //         this.setState({eeg_function: value});
        //     }
        //     console.log({ key, value }) // {key: 'term', value: 'pizza'} {key: 'location', value: 'Bangalore'}
        //
        // }


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
            console.log(res.data)
            console.log("ORIGINAL LENGTH")
            console.log(resultJson.signal.length)
            this.setState({signal_original_start_seconds: resultJson.start_date_time});

            let temp_array_signal = []
            for ( let it =0 ; it < resultJson.signal.length; it++){
                let temp_object = {}
                let adjusted_time = ""
                // First entry is 0 so no need to add any milliseconds
                // Time added is as millisecond/100 so we multiply by 1000
                if(it === 0){
                    adjusted_time = resultJson.start_date_time
                }else{
                    adjusted_time = resultJson.start_date_time + resultJson.signal_time[it]*1000
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

    async handleSendNotebookAndSelectionConfig() {
        // COnvert string to date time
        // console.log("TIME Was SECONDS")
        //
        // console.log(this.state.selected_start_time)
        // console.log(this.state.selected_stop_time)
        let start_time_seconds;
        let end_time_seconds;

        if(this.state.selected_part_channel !== "") {

            start_time_seconds = new Date(this.state.selected_start_time);
            end_time_seconds = new Date(this.state.selected_stop_time);

            // console.log("TIME Was")
            //
            // console.log(start_time_seconds)
            // console.log(end_time_seconds)

            //Convert datetime to seconds
            start_time_seconds = start_time_seconds.getTime() / 1000;
            end_time_seconds = end_time_seconds.getTime() / 1000;

            // console.log("TIME IS")
            // console.log(this.state.signal_original_start_seconds)
            // console.log(start_time_seconds)
            // console.log(end_time_seconds)

            //Convert to seconds from start of signal
            //Original time is in milliseconds by dividing by 1000 we convert to
            // seconds
            start_time_seconds = Math.abs(this.state.signal_original_start_seconds / 1000 - start_time_seconds);
            end_time_seconds = Math.abs(this.state.signal_original_start_seconds / 1000 - end_time_seconds);
        }else{
            start_time_seconds = 0
            end_time_seconds = 0
        }

        let data_to_send = {
            bipolar_references: this.state.added_bipolar_references,
            type_of_reference: this.state.selected_reference_type,
            channels_reference: this.state.added_channel_references,
            notches_enabled: this.state.selected_notch,
            notches_length: this.state.selected_notch_length,
            selection_channel: this.state.selected_part_channel,
            selection_start_time: start_time_seconds,
            selection_end_time: end_time_seconds,
            repairing_artifacts_ica: false,
            n_components: "",
            list_exclude_ica: [],
            ica_method: ""
        }
        console.log("data_to_send")
        console.log(data_to_send)
        API.post("receive_notebook_and_selection_configuration",
                data_to_send
                , {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
        ).then(res => {
        //   Must reload the notebook from the frontend or trigger it here otherwise
            API.get("/mne/open/eeg",
                    {
                        params: {
                            input_run_id: "a",
                            input_step_id: "b"
                        }
                    }
            ).then(res => {
            });
        });
    }

    async fetchChannels(url, config) {
        API.get("list/channels", {}).then(res => {
            this.setState({channels_cathode: res.data.channels})
            this.setState({channels_anode: res.data.channels})
            this.setState({left: res.data.channels})
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

    handleSelectReferenceTypeChange(event) {
        //Clear other values of references when changing
        this.setState({added_channel_references: []})


        this.setState({selected_reference_type: event.target.value})


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
    handleProcceed () {
        let send_page = "";
        const queryParams = new URLSearchParams(window.location.search)
        for (const [key, value] of queryParams) {
            if(key === "eeg_function"){
                console.log("HEYHEYHAEYHYAID")
                console.log(value)
                send_page = value
                // this.setState({eeg_function: value});
            }
            console.log({ key, value }) // {key: 'term', value: 'pizza'} {key: 'location', value: 'Bangalore'}

        }

        let to_send_to = "http://localhost:3000/" + send_page
        console.log("PROCEEDING")
        console.log(to_send_to)
        // console.log(this.state.eeg_function)
        window.location.replace(to_send_to);
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
        this.setState({selected_start_time: selection_from_div.value})
        this.setState({selected_stop_time: selection_to_div.value})

        // Close the Modal Afterwards
        this.setState({open_modal:false})
        // this.handleSendSelectionSignal(selection_from_div.value, selection_to_div.value)
    }


    not(a, b) {
        return a.filter((value) => b.indexOf(value) === -1);
    }

    intersection(a, b) {
        return a.filter((value) => b.indexOf(value) !== -1);
    }


    handleToggle = (value) => () => {
        const currentIndex = this.state.checked.indexOf(value);
        const newChecked = [...this.state.checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({checked: newChecked});
        // console.log("newChecked")
        // console.log(newChecked)
        // console.log(this.intersection(newChecked, this.state.left))
        // console.log(this.intersection(newChecked, this.state.right))
        this.setState({leftChecked: this.intersection(newChecked, this.state.left)});
        this.setState({rightChecked: this.intersection(newChecked, this.state.right)});

    };

    handleAllRight = () => {
        let tempRight = this.state.right;
        this.setState({right: tempRight.concat(this.state.left)});
        this.setState({left: []})
    };

    handleCheckedRight = () => {
        let tempRight = this.state.right;
        this.setState({right: tempRight.concat(this.state.leftChecked)});

        let tempLeft = this.state.left;
        this.setState({left: this.not(tempLeft, this.state.leftChecked)});


        this.setState({checked: this.not(this.state.checked, this.state.leftChecked)});
    };

    handleCheckedLeft = () => {
        let tempLeft = this.state.left;
        console.log("LEFT IS")
        console.log(this.state.left)
        console.log(this.state.right)
        console.log(this.state.rightChecked)
        console.log(this.state.leftChecked)
        this.setState({left: tempLeft.concat(this.state.rightChecked)});

        let tempRight = this.state.right;
        console.log(this.not(tempRight, this.state.rightChecked))
        this.setState({right: this.not(tempRight, this.state.rightChecked)});


        this.setState({checked: this.not(this.state.checked, this.state.rightChecked)});
    };

    handleAllLeft = () => {
        let tempLeft = this.state.left;
        this.setState({left: tempLeft.concat(this.state.right)});
        this.setState({right: []})
    };

    customList = (items) => (
            <Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
                <List dense component="div" role="list">
                    {items.map((value) => {
                        const labelId = `transfer-list-item-${value}-label`;

                        return (
                                <ListItem
                                        key={value}
                                        role="listitem"
                                        button
                                        onClick={this.handleToggle(value)}
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                                checked={this.state.checked.indexOf(value) !== -1}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={`${value}`} />
                                </ListItem>
                        );
                    })}
                    <ListItem />
                </List>
            </Paper>
    );

    debug = () => {
        console.log("DEBUG")
        console.log(this.state.left)
        console.log(this.state.right)
        console.log(this.state.rightChecked)
        console.log(this.state.leftChecked)
    };

    render() {
        return (
                <Grid container direction="column">
                    <Grid container direction="row">
                        <Grid item xs={2} sx={{borderRight: "1px solid grey"}}>
                            <Grid container direction="column">
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                File preview
                            </Typography>
                            <Divider sx={{bgcolor: "black"}}/>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                File Name:
                            </Typography>
                            <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                trial_av.edf
                            </Typography>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                File Type:
                            </Typography>
                            <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                EDF
                            </Typography>
                            <Divider sx={{bgcolor: "black"}}/>
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
                            <Button onClick={this.handleProcessOpenEEG} variant="contained" color="secondary"
                                    sx={{margin: "8px", float: "right"}}>
                                Restart View App >
                            </Button>
                        </Grid>

                        <Grid item xs={10} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black"}}>
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

export default EEGViewer;
