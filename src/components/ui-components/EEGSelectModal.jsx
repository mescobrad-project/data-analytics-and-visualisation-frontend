import React from 'react';
import PropTypes from 'prop-types';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import {Button, Grid, Modal, Typography} from "@mui/material";
import {Box} from "@mui/system";
import EEGSelector from "../base-components/EEGSelector";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

/**
 * Component returns a range area style am5chart
 */

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "95%",
    height: "95%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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
];

class EEGSelectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open_modal: false
        };
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpenHelp = this.handleModalOpenHelp.bind(this);
        this.handleModalCloseHelp = this.handleModalCloseHelp.bind(this);
    }

    handleModalOpen(){
        this.setState({open_modal: true})
        this.handleGetChannelSignal()
    }

    handleModalClose(){
        this.setState({open_modal: false})
    }

    handleModalOpenHelp(){
        this.setState({open_modal_help: true})
        this.handleGetChannelSignal()
    }

    handleModalCloseHelp(){
        this.setState({open_modal_help: false})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Button variant="contained" color="primary"
                            disabled={(this.state.selected_part_channel === "" ? true : false)}
                            onClick={this.handleModalOpen}>Select EEG channels and time</Button>
                    <Button variant="contained" color="primary"
                            disabled={(this.state.selected_part_channel === "" ? true : false)}
                            onClick={this.handleModalOpenHelp}><HelpOutlineIcon/> </Button>
                    <Modal
                            open={this.state.open_modal}
                            onClose={this.handleModalClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            // disableEnforceFocus={true}
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Select channels and time range | Print to EDF and Save
                            </Typography>
                            <EEGSelector/>
                        </Box>
                    </Modal>
                    <Modal
                            open={this.state.open_modal_help}
                            onClose={this.handleModalCloseHelp}
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
        )
    }
}

export default EEGSelectModal;
