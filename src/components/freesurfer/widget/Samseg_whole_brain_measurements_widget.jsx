import React from 'react';
import NumberFormat from 'react-number-format';
import API from "../../../axiosInstance";
import "./samseg_whole_brain_measurements_widget.scss"
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

class Samseg_whole_brain_measurements_widget extends React.Component {
    requested_file
    constructor(props) {
        super(props);
        this.state = {
            // List of data sent by the backend
            whole_brain_measurements_data: []
        };

        this.fetchData = this.fetchData.bind(this);
        // Initialise component
        // - values of channels from the backend
        this.requested_file = this.props.requested_file
        this.fetchData();
    }

    /**
     * Call backend endpoint to get whole_brain_measurements
     */
    async fetchData() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_reconall_stats/measures",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name: this.requested_file
                    }
                }).then(res => {
            this.setState({whole_brain_measurements_data: res.data["measurements"]})
        });
    }


    render() {
            return (
                    <div className="samseg_whole_brain_measurements_widget">
                        <div className="left">
                            <span className="title">Whole Brain Measurements</span>
                            {
                                Object.keys(this.state.whole_brain_measurements_data).map((key, index) => (
                                        <p className="left"><strong>{key} : </strong>{this.state.whole_brain_measurements_data[key]}</p>
                                ))
                            }
                        </div>
                        <div className="right">
                            <PsychologyOutlinedIcon
                                    className="icon"
                                    style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color:"green"}}
                            />
                        </div>
                    </div>
            );
    }
}
export default Samseg_whole_brain_measurements_widget;
