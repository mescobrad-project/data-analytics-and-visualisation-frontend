import React from 'react';
import PropTypes from 'prop-types';

import {Button, Divider, Grid, Modal, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import API from "../../axiosInstance";

class ProceedButton extends React.Component {
    static defaultProps = {
        outputType: "",
    }

    static propTypes = {
        outputType: PropTypes.string,
    }

    constructor(props) {
        super(props);
        this.state = {};
        this.handleProceed = this.handleProceed.bind(this);
    }


    async handleProceed() {
        const params = new URLSearchParams(window.location.search);

        API.post("/function/save_data/", null,{
                params: {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
            }
        ).then(res => {
            // this.setState({output_return_data: res.data})
            // If the data was saved to the datalake, then complete the task and redirect
            // Otherwise, alert the user that there was an error
            if (res.status === 200) {
                API.get("/task/complete", {
                    params: {
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                    }

                }).then(res => {
                    console.log(res)
                    window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
                    // this.setState({channels: res.data.channels})
                    // this.props.handleChannelChange(res.data.channels)
                });
            } else {
                console.log("Error saving data to datalake, please try again")
            }
        });
        // window.location.replace("/")


        // API.get("/task/complete", {
        //     params: {
        //         run_id: params.get("run_id"),
        //         step_id: params.get("step_id"),
        //     }
        //
        // }).then(res => {
        //     console.log(res)
        //     window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
        //     // this.setState({channels: res.data.channels})
        //     // this.props.handleChannelChange(res.data.channels)
        // });
    }

    render() {
        return (
            <Button onClick={this.handleProceed} sx={{float: "right", marginRight: "2px"}} variant="contained"
                    color="primary" type="submit"
                // disabled={!this.props.resultsExist}
            >
                Proceed >
            </Button>
        )
    }
}

export default ProceedButton;
