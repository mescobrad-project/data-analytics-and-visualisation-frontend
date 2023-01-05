import React from 'react';
import PropTypes from 'prop-types';

import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5xy from "@amcharts/amcharts5/xy";
import {Button, Divider, Grid, Modal, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import {Box} from "@mui/system";
import EEGSelector from "../base-components/EEGSelector";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import API from "../../axiosInstance";
import DescriptionIcon from '@mui/icons-material/Description';
import EditIcon from '@mui/icons-material/Edit';

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
    static propTypes = {
        handleChannelChange: PropTypes.func
    }

    constructor(props) {
        super(props);
        this.state = {
            open_modal: false,
            open_modal_help: false,
            file_used_visual: null
        };
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpenHelp = this.handleModalOpenHelp.bind(this);
        this.handleModalCloseHelp = this.handleModalCloseHelp.bind(this);
        this.fetchChannels = this.fetchChannels.bind(this);
        this.handleFileUsedChangeInner = this.handleFileUsedChangeInner.bind(this);
    }

    handleModalOpen() {
        this.setState({open_modal: true})
        // this.handleGetChannelSignal()
    }

    handleModalClose() {
        this.setState({open_modal: false})
        this.fetchChannels()
    }

    handleModalOpenHelp() {
        this.setState({open_modal_help: true})
        // this.handleGetChannelSignal()
    }

    handleModalCloseHelp() {
        this.setState({open_modal_help: false})
    }

    handleFileUsedChangeInner(event, newFileUsed){
        // This functions triggers a reload of the channels if the user wants to use the original files and clears
        // the data of the channels in any other case after state has been updated
        this.setState({file_used_visual: newFileUsed},
                () => {
                    if(newFileUsed === "original"){
                        console.log("TRIGGERED")
                        this.fetchChannels()
                    }else{
                        this.props.handleChannelChange([])
                    }
                }
                )
        this.props.handleFileUsedChange(newFileUsed)

    }

    async fetchChannels() {
        const params = new URLSearchParams(window.location.search);
        API.get("list/channels", {
            params: {
                workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                file_used: this.state.file_used_visual
            }

        }).then(res => {
            // this.setState({channels: res.data.channels})
            this.props.handleChannelChange(res.data.channels)
        });
    }

    render() {
        return (
                <React.Fragment>
                    <Grid container direction="row">
                        <ToggleButtonGroup
                                color="primary"
                                value={this.state.file_used_visual}
                                exclusive
                                onChange={this.handleFileUsedChangeInner}
                                sx={{width: "100%"}}
                                aria-label="text alignment"
                        >
                            <ToggleButton value="original"  sx={{width: "50%"}} aria-label="left aligned" size={"small"}>
                                <DescriptionIcon/>
                                Use original file
                            </ToggleButton>
                            <ToggleButton value="printed" sx={{width: "50%"}} aria-label="right aligned" size={"small"}>
                                <EditIcon/>
                                Select specific timeframe/channels
                            </ToggleButton>
                        </ToggleButtonGroup>
                        {/*<Button variant="contained" color="primary"*/}
                        {/*        sx ={{width: '50%'}}*/}
                        {/*        // disabled={(this.state.selected_part_channel === "" ? true : false)}*/}
                        {/*        onClick={this.handleModalOpen}>*/}
                        {/*    Use original file*/}
                        {/*</Button>*/}
                        {/*<Button variant="contained" color="primary"*/}
                        {/*        // disabled={(this.state.selected_part_channel === "" ? true : false)}*/}
                        {/*        sx ={{width: '50%'}}*/}
                        {/*        onClick={this.handleModalOpen}>*/}
                        {/*    Select specific timeframe/channels*/}
                        {/*</Button>*/}
                    </Grid>
                    <Divider/>
                    <Divider/>
                    <Divider/>
                    <Grid container direction="row">
                        <Button variant="contained" color="primary" size={"small"}
                                disabled={(this.state.file_used_visual === "printed" ? null : true)}
                                // style={{ disa: (this.state.file_used_visual === "printed" ? 'block' : 'none') }}
                                onClick={this.handleModalOpen}>Open EDF File Editor</Button>
                        <Button variant="contained" color="primary" size={"small"}
                                disabled={(this.state.file_used_visual === "printed" ? null : true)}
                                // style={{ display: (this.state.file_used_visual === "printed" ? 'block' : 'none') }}
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
                                <ImageList sx={{width: '100%', height: '95%'}} cols={1} rowHeight={"100%"}>
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
                </React.Fragment>
        )
    }
}

export default EEGSelectModal;
