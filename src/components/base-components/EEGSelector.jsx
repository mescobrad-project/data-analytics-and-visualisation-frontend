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

class EEGSelector extends React.Component {
        constructor(props) {
        super(props);
        this.state = {
        };

        //Binding functions of the class
        this.handleProcessOpenEEG = this.handleProcessOpenEEG.bind(this);

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

    render() {
        return (
                <Grid container sx={{height: "100%"}} direction="column">
                    <Grid item xs={12} sx={{borderRight: "1px solid grey", borderLeft: "2px solid black", height: "100vh"}}>
                        <iframe src="http://localhost:8080/#/?username=user&password=password&hostname=Desktop Auto-Resolution" style={{width: "100%", height: "100%" , marginLeft: "0%"}}></iframe>
                    </Grid>
                </Grid>

        )
    }
}

export default EEGSelector;
