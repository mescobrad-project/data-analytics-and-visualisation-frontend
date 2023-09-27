import React from 'react';
import NumberFormat from 'react-number-format';
import API from "../../../axiosInstance";
import "./samseg_whole_brain_measurements_widget.scss"
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

class Samseg_whole_brain_measurements_widget extends React.Component {
    requested_file;
    hemisphere;
    constructor(props) {
        super(props);
        this.state = {
            // List of data sent by the backend
            whole_brain_measurements_data: []
        };

        this.fetchData = this.fetchData.bind(this);
        this.renderIconColor = this.renderIconColor.bind(this);
        this.hemisphereName = this.hemisphereName.bind(this)

        // Initialise component
        // - values of channels from the backend
        this.requested_file = this.props.requested_file
        this.hemisphere = this.props.hemisphere
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

    renderIconColor = (hemisphere) => {
        let icon_color = "red"
        if (hemisphere == 'Right')
        { icon_color="green"}
        return icon_color
    }

    hemisphereName = (hemisphere) => {
        if (hemisphere == 'Right')
        { return " - Right Hemisphere"}
        else if (hemisphere == 'Left')
        { return " - Left Hemisphere"}
        else return ""
    }

    render() {
            return (
                    <div className="samseg_whole_brain_measurements_widget">
                        <div className="left">
                            <span className="title">Whole Brain Measurements{this.hemisphereName(this.hemisphere)}</span>
                            {
                                Object.keys(this.state.whole_brain_measurements_data).map((key, index) => (
                                        <p className="left"><strong>{key} : </strong>{this.state.whole_brain_measurements_data[key]}</p>
                                ))
                            }
                        </div>
                        <div className="right">
                            <PsychologyOutlinedIcon
                                    className="icon"
                                    style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color:this.renderIconColor(this.hemisphere)}}
                            />
                        </div>
                    </div>
            );
    }
}
export default Samseg_whole_brain_measurements_widget;
