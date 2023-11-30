import React from 'react';
import PropTypes from 'prop-types';

import {Button} from "@mui/material";
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
