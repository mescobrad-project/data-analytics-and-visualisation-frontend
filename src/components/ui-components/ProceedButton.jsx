import React from 'react';
import PropTypes from 'prop-types';

import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
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
        this.state = {
            selected_reply:false,
            open_dialog:false
        };
        this.handleProceed = this.handleProceed.bind(this);
        this.handleDialogClose = this.handleDialogClose.bind(this);
        this.handleDialogOpen = this.handleDialogOpen.bind(this);
    }
    handleDialogClose (event, reply_value) {
        this.setState({open_dialog:false})
        this.setState({selected_reply:reply_value});
        if (reply_value===false){
            return
        } else{
            this.handleProceed()
        }
    };
    handleDialogOpen(event) {
        this.setState({open_dialog:true})
    };
    async handleProceed() {
        const params = new URLSearchParams(window.location.search);
        let function_type_to_send = null
        if (this.props.outputType !== ""){
            function_type_to_send = this.props.outputType
        }
        API.post("/function/save_data/", null,{
                params: {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                    function_type: function_type_to_send
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
                    if(res.status === 200){
                        // If succesfull follow up in the next step page in the workflow manager
                        console.log("Task completed succesfully")
                        window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
                    }else{
                        // If there is an error completing the task iin the datalake we are probably
                        // in a test case, so redirect to the home page
                        console.log("Error completing task, please try again 1")
                        window.location.replace("/")
                    }
                    console.log(res)
                    // this.setState({channels: res.data.channels})
                    // this.props.handleChannelChange(res.data.channels)
                }).catch(function (error) {
                    if(error.status === 500) {
                        console.log("Error completing task, please try again 2")
                        window.location.replace("/")
                    }

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
                <React.Fragment>
                    <Button onClick={this.handleDialogOpen} sx={{float: "right", marginRight: "5px"}} variant="contained"
                            color="secondary"
                            type="submit"
                        // disabled={!this.props.resultsExist}
                    >
                        Send results to Wf>
                    </Button>
                    <Dialog
                            open={this.state.open_dialog}
                            onClose={this.handleDialogClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">
                            {"Proceed back to the Workflow Manager?"}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                By proceeding you will close the current page and redirect back to the Workflow Manager.
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>

                            <Button onClick={(e) => {this.handleDialogClose(e, false)}}>Disagree</Button>
                            <Button onClick={(e) => {this.handleDialogClose(e, true)}} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                </React.Fragment>
        )
    }
}

export default ProceedButton;
