import React from 'react';
import API from "../../axiosInstance";
import {
    Button, Divider,
    Grid, IconButton, ImageListItemBar, Modal,
    Typography
} from "@mui/material";
import {Box, Stack} from "@mui/system";
import ImageListItem from "@mui/material/ImageListItem";
import ImageList from "@mui/material/ImageList";
import * as PropTypes from "prop-types";
import EEGSelector from "./EEGSelector";

const style = {
    position: 'absolute',
    display: 'flex',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "80%",
    height: "80%",
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

const titleBar= {
    background:
            'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
};

const itemData = [
    {
        img: 'http://localhost:8000/static/1.png',
        title: '1',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: '2',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: '3',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: '4',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: '5',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: '6',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: '7',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: '8',
    },
    {
        img: 'http://localhost:8000/static/1.png',

        title: '9',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: '10',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: '11',
    },
    {
        img: 'http://localhost:8000/static/1.png',
        title: '12',
    },
];

function StarBorderIcon(props) {
    return null;
}

StarBorderIcon.propTypes = {};

class MRIViewer extends React.Component {
    constructor(props) {
        super(props);
        let ip = "https://gui.platform.mes-cobrad.eu/"
        if (process.env.NEURODESK_BASEURL)
        {
            ip = process.env.NEURODESK_BASEURL
        }
        this.state = {
            //Channel Select order modal
            open_modal: false,
            path : ip + "#/?username=user&password=password&hostname=Desktop Auto-Resolution",

        };

        //Binding functions of the class
        this.handleProcessOpenMRI = this.handleProcessOpenMRI.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);

        // Initialise component
        // this.handleProcessOpenEEG();
        this.handleProcessOpenMRI();
    }


    async handleProcessOpenMRI() {
        //Parameter are only placeholder

        const params = new URLSearchParams(window.location.search);

        API.get("free_view/simple",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_to_open: "test.nii",
                        // input_slices: this.state.selected_slice
                    }
                }
        ).then(res => {
            // const result = res.data;
            console.log("Freeview Success")


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
                                test.nii
                            </Typography>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                File Type:
                            </Typography>
                            <Typography variant="p" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                NIfTI
                            </Typography>
                            <Divider sx={{bgcolor: "black"}}/>

                            <Button onClick={this.handleProcessOpenMRI} variant="contained" color="secondary"
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
                                    <Stack direction="row" spacing={2}>
                                        {itemData.map((item) => (
                                        <React.Fragment>
                                            <img src={`${item.img}?w=164&h=164&fit=crop&auto=format`} />
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

                        <Grid item xs={10} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black", height: "92vh"}}>
                            <Grid container sx={{height: "100%"}} direction="column">
                                <Grid item xs={12} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black", height: "100vh"}}>
                                    <iframe src={this.state.path}
                                            style={{width: "100%", height: "100%", marginLeft: "0%"}}></iframe>
                                </Grid>
                            </Grid>
                                    {/*<iframe src="http://localhost:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>*/}
                        </Grid>

                    </Grid>

                </Grid>

        )
    }
}

export default MRIViewer;
