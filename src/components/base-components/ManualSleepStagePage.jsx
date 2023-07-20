import React from 'react';
import API from "../../axiosInstance";
import {
    Button, Divider, FormControl, FormHelperText,
    Grid, IconButton, ImageListItemBar, InputLabel, List, ListItem, ListItemText, MenuItem, Modal, Select, TextField,
    Typography
} from "@mui/material";
import {Box, Stack} from "@mui/system";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import * as PropTypes from "prop-types";
import EEGSelector from "./EEGSelector";
import {Autocomplete} from "@mui/lab";
import ProceedButton from "../ui-components/ProceedButton";

const style = {
    position: 'absolute',
    display: 'flex',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "90%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    overflowX: 'scroll',
    overflowY: 'visible',
    p: 4,
};

const root = {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    // backgroundColor: theme.palette.background.paper,
};

const imageList = {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
};
const title = {
    // color: theme.palette.primary.light,
};

const titleBar = {
    background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
};

var static_tutorial_ip = "http://127.0.0.1:8000/static/tutorials/";
if (process.env.REACT_APP_BASEURL)
{
    static_tutorial_ip = process.env.REACT_APP_BASEURL + "static/tutorials/";
}

const itemData = [
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_1.png',
        title: 'Tutorial Guide | Available Hypnograms',
        description: 'Manual Sleep Scoring Tutorial\n\n' +
                'Click here and use the arrow keys to navigate this tutorial\n\n' +
                "First in the highlighted section you can see available hypnograms"
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_2.png',
        title: 'Importing hypnogram',
        description: 'Proceed by going to "Tools" -> "Import Annotations/Events'
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_3.png',
        title: 'Applying correct settings for importing the files',
        description: 'If its the first time importing a hypnogram the settings need to be inserted manually \n\n' +
                'If its not the first time, the settings should be saved \n\n' +
                'In this case simple press "Import" \n\n' +
                'The settings (can also be seen on the left) are as follows: \n\n' +
                "0. Select ASCII/CSV tab \n\n" +
                '1. Column separator = "," \n\n' +
                '2. Onset Column = "1" \n\n' +
                '3. Duration Column = "Checked" + "2" \n\n' +
                '4. End Column = "Unchecked" \n\n' +
                '5. Description Column =  "Checked" + "3" \n\n' +
                '6. Manual Description = "Unchecked" \n\n' +
                '7. Date starts at line = "3" \n\n' +
                '8. Onset time coding is = in seconds, relative to start of file \n\n' +
                '9. Text encoding = "UTF-8" \n\n' +
                '10. Must have equal filename = "Unchecked" \n\n' +
                '11. Ignore consecutive events with the same description = "Unchecked" \n\n' +
                'Press Import \n\n'
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_4.png',
        title: 'File Selection',
        description: 'Select the hypnogram file you want to import \n\n' +
                'Hypnogram files should be in the format of .txt \n\n' +
                'If no files are present in the first directory mone in the directory" \n\n' +
                ' "neurodesk_interim_storage" \n\n' +
                ' and press from there'
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_5.png',
        title: 'File Selection Success',
        description: 'If the settings and files are correct you should see this message \n\n' +
                'Press "OK" to continue'
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_6.png',
        title: 'Opening Hypnogram Viewer 1',
        description: 'Press "Window" -> "Hypnogram" to open the hypnogram viewer \n\n'
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_7.png',
        title: 'Opening Hypnogram Viewer 2',
        description: 'The following page configures the which annoations descriptions \n\n' +
                'represent each sleep stage in the viewer \n\n' +
                'There should be no need for changes \n\n' +
                'If by accident any settings are changed use the image on the right as a reference \n\n' +
                'To reapply them \n\n' +
                'Press Start'
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_8.png',
        title: 'Opening Hypnogram Viewer 4',
        description: 'The opened Hypnogram Viewer that displays the full length of the file',
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_9.png',
        title: 'Hypnogram Editing 1',
        description: 'To edit the hypnogram also open the annotation editor \n\n' +
                'Press "Window" -> "Annotation Editor" \n\n' +
                'This will open the annotation editor as shown in the image in the right\n\n'
    },
    {
        img: static_tutorial_ip + 'manual_sleep_scoring_10.png',
        title: 'Hypnogram Editing 2',
        description: 'In the opened editor simply press from the annotation editor the sleep period you want to change  \n\n' +
                'Simply change the description to the desired sleep stage \n\n' +
                'And press "Modify" \n\n'
    }
];

function StarBorderIcon(props) {
    return null;
}

StarBorderIcon.propTypes = {};

class ManualSleepStagePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //Channel Select order modal
            open_modal: false,
            saved_montages: [],
            selected_montage: "",
            available_hypnograms: [],
        };

        const params = new URLSearchParams(window.location.search);

        //Binding functions of the class
        this.handleProcessOpenEEG = this.handleProcessOpenEEG.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.fetchMontages = this.fetchMontages.bind(this);
        this.handleSelectMontage = this.handleSelectMontage.bind(this);
        this.fetchAvailableHypnograms = this.fetchAvailableHypnograms.bind(this);
        this.fetchAndInitialiseAvailableHypnograms = this.fetchAndInitialiseAvailableHypnograms.bind(this);

        // Initialise component
        // this.handleProcessOpenEEG();
        this.fetchMontages()
        // this.fetchAvailableHypnograms()

        if(params.get("redirected") !== null) {
            this.fetchAvailableHypnograms()
        }else {
            this.fetchAndInitialiseAvailableHypnograms()
        }
    }


    async handleProcessOpenEEG() {
        //Parameter are only placeholder

        const params = new URLSearchParams(window.location.search);
        API.get("/mne/open/eeg",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        selected_montage: this.state.selected_montage
                    }
                }
        ).then(res => {
        });

    }

    async fetchAndInitialiseAvailableHypnograms() {
        const params = new URLSearchParams(window.location.search);
        API.get("/initialise_hypnograms",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }
        ).then(res => {
            console.log("Data")
            console.log(res.data)
            this.setState({available_hypnograms: res.data["available_hypnograms"]})
        });
    }

    async fetchAvailableHypnograms() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_available_hypnograms",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }
                }
        ).then(res => {
            console.log("Data")
            console.log(res.data)
            this.setState({available_hypnograms: res.data["available_hypnograms"]})
        });
    }

    async fetchMontages() {
        API.get( "/get/montages").then(res =>{
            this.setState({saved_montages: res.data})
        })
    }
    handleModalOpen() {
        this.setState({open_modal: true})
        // this.handleGetChannelSignal()
    }

    handleModalClose() {
        this.setState({open_modal: false})
    }

    handleSelectMontage(event){
        this.setState({selected_montage: event.target.value})
    }

    render() {
        return (
                <Grid container direction="column">
                    <Grid container direction="row">
                        <Grid item xs={2} sx={{borderRight: "1px solid grey"}}>
                            <Grid container direction="column">
                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Load File with Montage
                                </Typography>
                                <Divider sx={{bgcolor: "black", marginTop: "5px", marginBottom: "5px"}}/>
                                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                    <InputLabel id="load-montage-label">Load montage</InputLabel>
                                    <Select
                                            labelId="montage-selector-label"
                                            id="montage-selector"
                                            value= {this.state.selected_montage}
                                            label="Montage"
                                            onChange={this.handleSelectMontage}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {this.state.saved_montages.map((montage) => (
                                                <MenuItem value={montage}>{montage}</MenuItem>
                                        ))}
                                    </Select>
                                    {/*<FormHelperText>Select Channel for Periodogram</FormHelperText>*/}
                                </FormControl>
                                <ProceedButton></ProceedButton>


                                {/*<Autocomplete*/}
                                {/*        disablePortal*/}
                                {/*        id="saved-montage-load"*/}
                                {/*        options={this.state.saved_montages}*/}
                                {/*        sx={{width: 300}}*/}
                                {/*        defaultValue={"None"}*/}
                                {/*        onchange={this.handleSelectMontage}*/}
                                {/*        value={this.state.selected_montage}*/}
                                {/*        renderInput={(params) => <TextField {...params} label="Montage"/>}*/}
                                {/*/>*/}
                                <Button onClick={this.handleProcessOpenEEG} variant="contained" color="secondary"
                                        sx={{margin: "8px", float: "right"}}>
                                    Reload with selected montage
                                </Button>

                                <Divider sx={{bgcolor: "black", marginTop: "5px", marginBottom: "5px"}}/>
                                <Button onClick={this.handleProcessOpenEEG} variant="contained" color="secondary"
                                        sx={{margin: "8px", float: "right"}}>
                                    Restart View App >
                                </Button>
                                <Divider sx={{bgcolor: "black", marginTop: "5px", marginBottom: "5px"}}/>
                                <Button variant="contained" sx= {{backgroundColor: "#07822c"}} onClick={this.handleModalOpen}>Sleep Scoring
                                    Tutorial</Button>
                                <Divider sx={{bgcolor: "black", marginTop: "5px", marginBottom: "5px"}}/>
                                <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                    Available Hypnograms
                                </Typography>
                                <List>
                                    {this.state.available_hypnograms.map((hypnogram) => (
                                            <ListItem> <ListItemText primary={hypnogram}/></ListItem>
                                    ))}
                                </List>


                                <Modal
                                        open={this.state.open_modal}
                                        onClose={this.handleModalClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                        // style = {{height:'100vh', width:'100vw'}}
                                >
                                    <Box sx={style}>
                                        {/*<Typography id="modal-modal-title" variant="h6" component="h2">*/}
                                        {/*    Manual Sleep Scoring Tutorial*/}
                                        {/*    Click here and use the arrow keys to navigate this tutorial*/}
                                        {/*</Typography>*/}
                                        <Stack direction="row" spacing={2}>
                                            {itemData.map((item, index) => (
                                                    <React.Fragment>
                                                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                                                            <h3>{`${item.title}`}</h3>
                                                            <p style={{whiteSpace: 'pre-line'}}> {`${item.description}`}</p>
                                                        </Typography>
                                                        <img key={index}
                                                             style={{height:'85vh', width:'85vw', fit: "fill"}}
                                                             src={`${item.img}`}
                                                             alt="Missing Tutorial Img"/>
                                                        <Divider orientation="vertical"/>
                                                    </React.Fragment>
                                            ))}
                                        </Stack>

                                        {/*<div sx={root}>*/}
                                        {/*    <ImageList sx={imageList} cols={1.3}>*/}
                                        {/*        {itemData.map((item) => (*/}
                                        {/*                // <Typography id="modal-modal-title" variant="h6" component="h2">*/}
                                        {/*                //     How to: Tutorial example*/}
                                        {/*                // </Typography>*/}
                                        {/*            <ImageListItem>*/}
                                        {/*            <img src={`${item.img}?w=164&h=164&fit=crop&auto=format`} />*/}
                                        {/*            <ImageListItemBar*/}
                                        {/*                    title={item.title}*/}
                                        {/*                    sx={*/}
                                        {/*                        titleBar*/}
                                        {/*                    }*/}
                                        {/*            />*/}
                                        {/*        </ImageListItem>*/}
                                        {/*        ))}*/}
                                        {/*    </ImageList>*/}
                                        {/*</div>*/}
                                        {/*<Grid container direction="row">*/}

                                        {/*    /!*<Grid item xs={12} sx={{borderRight: "1px solid grey"}}>*!/*/}
                                        {/*{itemData.map((item) => (*/}
                                        {/*        <img*/}
                                        {/*                src={`${item.img}?w=164&h=164&fit=crop&auto=format`}*/}
                                        {/*                srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                                        {/*                // src={`${item.img}`}*/}
                                        {/*                // srcSet={`${item.img}`}*/}
                                        {/*                alt={item.title}*/}
                                        {/*                loading="lazy"*/}
                                        {/*        />*/}
                                        {/*// <ImageList sx={{ width: '100%', height: '95%' }} cols={1} rowHeight={"100%"}>*/}
                                        {/*//             <ImageListItem key={item.img}>*/}
                                        {/*//                 <img*/}
                                        {/*//                         src={`${item.img}?w=164&h=164&fit=crop&auto=format`}*/}
                                        {/*//                         srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                                        {/*//                         // src={`${item.img}`}*/}
                                        {/*//                         // srcSet={`${item.img}`}*/}
                                        {/*//                         alt={item.title}*/}
                                        {/*//                         loading="lazy"*/}
                                        {/*//                 />*/}
                                        {/*//             </ImageListItem>*/}
                                        {/*//*/}
                                        {/*// </ImageList>*/}
                                        {/*))}*/}
                                        {/*    /!*</Grid>*!/*/}
                                        {/*</Grid>*/}
                                        {/*<ImageList sx={{ width: '100%', height: '95%' }} cols={1} rowHeight={"100%"}>*/}
                                        {/*    {itemData.map((item) => (*/}
                                        {/*            <ImageListItem key={item.img}>*/}
                                        {/*                <img*/}
                                        {/*                        src={`${item.img}?w=164&h=164&fit=crop&auto=format`}*/}
                                        {/*                        srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}*/}
                                        {/*                        // src={`${item.img}`}*/}
                                        {/*                        // srcSet={`${item.img}`}*/}
                                        {/*                        alt={item.title}*/}
                                        {/*                        loading="lazy"*/}
                                        {/*                />*/}
                                        {/*            </ImageListItem>*/}
                                        {/*    ))}*/}
                                        {/*</ImageList>*/}
                                    </Box>
                                </Modal>
                            </Grid>
                        </Grid>

                        <Grid item xs={10}
                              sx={{borderRight: "1px solid grey", borderLeft: "2px solid black", height: "92vh"}}>
                            <EEGSelector/>
                            {/*<iframe src="http://localhost:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>*/}
                        </Grid>

                    </Grid>

                </Grid>

        )
    }
}

export default ManualSleepStagePage;
