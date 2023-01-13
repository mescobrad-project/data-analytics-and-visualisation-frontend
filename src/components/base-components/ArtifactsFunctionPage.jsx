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

class ArtifactsFunctionPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            //Channel Select order modal
            checked: [],
            leftChecked: [],
            rightChecked: [],
            left:[],
            right:[],
            eeg_function: "",


            channels_cathode: [],


            selected_components_type: "",
            selected_components: "",
            selected_repair_method: ""
        };

        //Binding functions of the class
        this.fetchChannels = this.fetchChannels.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.sendToBottom = this.sendToBottom.bind(this);
        this.sendToTop = this.sendToTop.bind(this);
        this.handleProcessOpenMNE = this.handleProcessOpenMNE.bind(this);
        this.handleSendNotebookAndSelectionConfig = this.handleSendNotebookAndSelectionConfig.bind(this);
        this.handleSelectComponentsChange = this.handleSelectComponentsChange.bind(this);
        this.handleSelectComponentsTypeChange = this.handleSelectComponentsTypeChange.bind(this);
        this.handleSelectRepairMethodChange = this.handleSelectRepairMethodChange.bind(this);
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
        // this.handleProcessOpenMNE();
        setInterval(this.handleGetAnnotations, 5000);
        this.fetchChannels();
    }

    async handleProcessOpenMNE() {
        //Parameter are only placeholder
        const params = new URLSearchParams(window.location.search);
        API.get("/mne/open/mne",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }
        ).then(res => {
        });

    }



    async handleSendNotebookAndSelectionConfig() {
        const params = new URLSearchParams(window.location.search);

        let data_to_send = {
            bipolar_references: [],
            type_of_reference: "",
            channels_reference: [],
            notches_enabled: false,
            notches_length: "",
            selection_channel: "",
            selection_start_time: "0",
            selection_end_time: "0",
            repairing_artifacts_ica: true,
            n_components: this.state.selected_components,
            list_exclude_ica: this.state.right,
            ica_method: this.state.selected_repair_method,
        }

        console.log("SEND DATA")
        console.log(data_to_send)
        API.post("receive_notebook_and_selection_configuration",
                data_to_send
                , {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_used: "original",
                    }
                }
        ).then(res => {
        //   Must reload the notebook from the frontend or trigger it here otherwise
            const params = new URLSearchParams(window.location.search);
            API.get("/mne/open/mne",
                    {
                        params: {
                            workflow_id: params.get("workflow_id"),
                            run_id: params.get("run_id"),
                            step_id: params.get("step_id")
                        }
                    }
            ).then(res => {
            });
        });
    }

    async fetchChannels() {
        const params = new URLSearchParams(window.location.search);
        API.get("list/channels", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                file_used: "original"
            }
        }).then(res => {
            this.setState({
                channels_cathode: res.data.channels})
            // this.setState({left: res.data.channels})
        });
    }



    /**
     * Update state when selection changes in the form
     */
    handleSelectComponentsChange(event) {
        this.setState({selected_components: event.target.value})
        let tempToAdd = [];
        console.log("IT")
        console.log(event.target.value)
        for(let it=0; it<  parseInt(event.target.value); it++){
            // console.log(it)
            tempToAdd.push(String(it))
        }
        this.setState({left: tempToAdd})
        this.setState({right: []})
        this.setState({leftChecked: []})
        this.setState({rightChecked: []})
        this.setState({checked: []})

    }

    handleSelectComponentsTypeChange(event) {
        this.setState({selected_components_type: event.target.value})
    }

    handleSelectRepairMethodChange(event) {
        this.setState({selected_repair_method: event.target.value})
    }


    sendToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    sendToTop() {
        window.scrollTo(0, 0)
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
                        {/*<Grid item xs={2} sx={{borderRight: "1px solid grey"}}>*/}
                        {/*    <Grid container direction="column">*/}
                        {/*    <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        File preview*/}
                        {/*    </Typography>*/}
                        {/*    <Divider sx={{bgcolor: "black"}}/>*/}
                        {/*    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        File Name:*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        trial_av.edf*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        File Type:*/}
                        {/*    </Typography>*/}
                        {/*    <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                        {/*        EDF*/}
                        {/*    </Typography>*/}
                        {/*    <Divider sx={{bgcolor: "black"}}/>*/}
                        {/*    </Grid>*/}
                        {/*</Grid>*/}
                        <Grid item xs={4} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black"}}>
                            <form>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    EEG Artifact Repair
                                </Typography>
                                <Divider sx={{bgcolor: "black"}}/>
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Component Setup
                                </Typography>

                                <FormControl sx={{m: 1, width: "80%"}}>
                                    <InputLabel id="channel-components-pre-label">Component Type</InputLabel>
                                    <Select
                                            labelId="channel-components-pre-label"
                                            id="channel-components-pre-selector"
                                            value= {this.state.selected_components_type}
                                            label="Components"
                                            onChange={this.handleSelectComponentsTypeChange}
                                    >
                                        <MenuItem value="float"> Between 0 -1</MenuItem>
                                        <MenuItem value="int"> Equal or more than one</MenuItem>

                                    </Select>
                                    <FormHelperText>Type of components</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_components_type === "int" ? 'none' : this.state.selected_components_type === "float" ? 'block' : 'none')}}>
                                    <InputLabel id="channel-components-label">Number of Components</InputLabel>
                                    <Select
                                            labelId="channel-components-label"
                                            id="channel-components-selector"
                                            value= {this.state.selected_components}
                                            label="Components"
                                            onChange={this.handleSelectComponentsChange}
                                    >

                                        {this.state.channels_cathode.map((channel, index) => (
                                                <MenuItem value={index}>{index}</MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>Number of components: is at most the numbers of the total channels</FormHelperText>
                                </FormControl>
                                <FormControl sx={{m: 1, minWidth: 120, display: (this.state.selected_components_type === "float" ? 'none' : this.state.selected_components_type === "int" ? 'block' : 'none')}}>
                                    <TextField
                                            labelId="channel-components-float-label"
                                            id="channel-components-float"
                                            value= {this.state.selected_components}
                                            label="Channel components"
                                            onChange={this.handleSelectComponentsChange}
                                    />
                                    <FormHelperText>Channel Components Number 0-x-1 </FormHelperText>
                                </FormControl>
                                <Divider />
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Artifact repair method
                                </Typography>
                                <FormControl sx={{m: 1, width: "80%"}}>
                                    <InputLabel id="channel-components-label">Methods</InputLabel>
                                    <Select
                                            labelId="channel-components-label"
                                            id="channel-components-selector"
                                            value= {this.state.selected_repair_method}
                                            label="Components"
                                            onChange={this.handleSelectRepairMethodChange}
                                    >
                                        <MenuItem value="fastica"> Fastica</MenuItem>
                                        <MenuItem value="infomax"> Infomax</MenuItem>
                                        <MenuItem value="picard"> Picard</MenuItem>

                                    </Select>
                                    <FormHelperText>Method to use</FormHelperText>
                                </FormControl>
                                <Divider />
                                <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Channel to exclude
                                </Typography>
                                <Grid container spacing={0} justifyContent="center" alignItems="center">
                                    <Grid item><Typography id="modal-modal-title" component="h2">
                                         Included Channels
                                    </Typography>{this.customList(this.state.left)}</Grid>
                                    <Grid item>
                                        <Grid container direction="column" alignItems="center">
                                            <Button
                                                    sx={{ my: 0.5 }}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={this.handleAllRight}
                                                    disabled={this.state.left.length === 0}
                                                    aria-label="move all right"
                                            >
                                                ≫
                                            </Button>
                                            <Button
                                                    sx={{ my: 0.5 }}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={this.handleCheckedRight}
                                                    disabled={this.state.leftChecked.length === 0}
                                                    aria-label="move selected right"
                                            >
                                                &gt;
                                            </Button>
                                            <Button
                                                    sx={{ my: 0.5 }}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={this.handleCheckedLeft}
                                                    disabled={this.state.rightChecked.length === 0}
                                                    aria-label="move selected left"
                                            >
                                                &lt;
                                            </Button>
                                            <Button
                                                    sx={{ my: 0.5 }}
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={this.handleAllLeft}
                                                    disabled={this.state.right.length === 0}
                                                    aria-label="move all left"
                                            >
                                                ≪
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Grid item><Typography id="modal-modal-title" component="h2">
                                        Excluded Channels
                                    </Typography>{this.customList(this.state.right)}</Grid>
                                    <Typography id="modal-modal-title" component="h2">

                                    </Typography>
                                </Grid>

                            </form>
                            <Button onClick={this.handleSendNotebookAndSelectionConfig} variant="contained" color="secondary"
                                    sx={{margin: "8px", float: "right"}}>
                                Apply Changes>
                            </Button>
                        </Grid>
                        <Grid item xs={8} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black"}}>
                            <Grid container direction="row">
                                <Grid item xs={12} sx={{height: "auto", borderTop: "2px solid black"}}>
                                    <AppBar position="relative">
                                        <Toolbar>
                                            <Button onClick={this.handleGetAnnotations} variant="contained" color="secondary"
                                                    sx={{margin: "8px", float: "center"}}>
                                                Get Annotations>
                                            </Button>
                                            <Button onClick={this.handleProcessOpenMNE} variant="contained" color="secondary"
                                                    sx={{margin: "8px", float: "right"}}>
                                                Restart View App >
                                            </Button>

                                        </Toolbar>
                                    </AppBar>
                                </Grid>
                            </Grid>

                            <Grid container direction="row">
                                <Grid item xs={12} sx={{height: "85vh"}}>
                                    <iframe src="http://localhost:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>
                                    {/*<iframe src="http://10.129.150.120:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>*/}
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>

        )
    }
}

export default withRouter(ArtifactsFunctionPage);
