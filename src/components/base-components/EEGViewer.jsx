import React from 'react';
import API from "../../axiosInstance";
import {
    Button, Divider,
    Grid, Modal,
    Typography
} from "@mui/material";
import {Box} from "@mui/system";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";

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

const itemData = [
    {
        img: 'http://localhost:8000/static/1.png',
        title: 'Breakfast',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: 'Burger',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: 'Camera',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: 'Coffee',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: 'Hats',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: 'Honey',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: 'Basketball',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: 'Fern',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: 'Mushrooms',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: 'Tomato basil',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: 'Sea star',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: 'Bike',
    },
];

class EEGViewer extends React.Component {
        constructor(props) {
        super(props);
        this.state = {
            //Channel Select order modal
            open_modal: false
        };

        //Binding functions of the class
        this.handleProcessOpenEEG = this.handleProcessOpenEEG.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);

        // Initialise component
        this.handleProcessOpenEEG();
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

    handleModalOpen(){
        this.setState({open_modal: true})
        this.handleGetChannelSignal()
    }

    handleModalClose(){
        this.setState({open_modal: false})
    }


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

                            <Button onClick={this.handleProcessOpenEEG} variant="contained" color="secondary"
                                    sx={{margin: "8px", float: "right"}}>
                                Restart View App >
                            </Button>

                            <Button variant="contained" color="primary" onClick={this.handleModalOpen}>How to: Tutorial</Button>
                            <Modal
                                    open={this.state.open_modal}
                                    onClose={this.handleModalClose}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                            >
                                <Box sx={style}>
                                    <Typography id="modal-modal-title" variant="h6" component="h2">
                                        How to: Tutorial example
                                    </Typography>
                                    <ImageList sx={{ width: '100%', height: '95%' }} cols={1} rowHeight={"100%"}>
                                        {itemData.map((item) => (
                                                <ImageListItem key={item.img}>
                                                    <img
                                                            src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                                                            srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                            // src={`${item.img}`}
                                                            // srcSet={`${item.img}`}
                                                            alt={item.title}
                                                            loading="lazy"
                                                    />
                                                </ImageListItem>
                                        ))}
                                    </ImageList>

                                </Box>
                            </Modal>
                            </Grid>
                        </Grid>

                        <Grid item xs={10} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black", height: "92vh"}}>
                                    <iframe src="http://localhost:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>
                        </Grid>

                    </Grid>

                </Grid>

        )
    }
}

export default EEGViewer;
