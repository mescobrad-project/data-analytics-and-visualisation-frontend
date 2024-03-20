import React from 'react';
import PropTypes from 'prop-types';

import {Button, Divider, Grid, Modal, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import API from "../../axiosInstance";
import ReactLoading from "react-loading";

class LoadingWidget extends React.Component {
    static propTypes = {
        resultsExist: PropTypes.bool,
    }

    constructor(props) {
        super(props);
        this.state = {

        };
        this.handleProceed = this.handleProceed.bind(this);
    }


    async handleProceed() {
        const params = new URLSearchParams(window.location.search);
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
    }

    render() {
        return (
                <div className="loadingContainer">
                    <div className="reactLoading">
                        <ReactLoading
                                type={"spinningBubbles"}
                                color={"#61dafb"}
                                height={80}
                                width={80}
                        />
                    </div>
                    <br/>
                    <div className="reactLoading">
                        <Typography variant="h7" sx={{flexGrow: 2, float: "center"}} noWrap>
                            <b>Loading...</b>
                        </Typography>
                    </div>
                </div>
        )
    }
}

export default LoadingWidget;
