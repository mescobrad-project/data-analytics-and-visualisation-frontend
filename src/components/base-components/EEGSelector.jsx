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
import PropTypes from "prop-types";

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

class EEGSelector extends React.Component {
    // static propTypes = {
    //     step_id: PropTypes.string,
    //     run_id: PropTypes.string
    // }
    constructor(props) {
        const params = new URLSearchParams(window.location.search);
        let ip = "https://gui.platform.mes-cobrad.eu/"
        if (process.env.NEURODESK_BASEURL)
        {
            ip = process.env.NEURODESK_BASEURL
        }
        super(props);
        this.state = {
            path : ip + "#/?username=user&password=password&hostname=Desktop Auto-Resolution",
        };

        //Binding functions of the class
        this.handleProcessOpenEEG = this.handleProcessOpenEEG.bind(this);

        // Initialise component
        this.handleProcessOpenEEG();
    }


    async handleProcessOpenEEG() {
        //Parameter are only placeholder

        const params = new URLSearchParams(window.location.search);
        API.get("/mne/open/eeg",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }
                }
        ).then(res => {
        });

    }

    render() {
        return (
                <Grid container sx={{height: "100%"}} direction="column">
                    <Grid item xs={12}
                          sx={{borderRight: "1px solid grey", borderLeft: "2px solid black", height: "100vh"}}>
                        <iframe src={this.state.path}
                                style={{width: "100%", height: "100%", marginLeft: "0%"}}></iframe>
                    </Grid>
                </Grid>

        )
    }
}

export default EEGSelector;
