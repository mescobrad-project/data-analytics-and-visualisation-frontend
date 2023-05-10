import React from "react";
import actigraph1 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/1actigraphy_visualisation.png";
import actigraph2 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/2actigraphy_visualisation.png";
import actigraph3 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/3actigraphy_visualisation.png";
// import act from "C:/neurodesktop-storage/runtime_config/workflow_1/run_1/step_1/output/actigraphy_visualisation.png"
//import "./styles.css";
import Plot from "react-plotly.js";
import API from "../../axiosInstance";
// import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, TextField, Typography
} from "@mui/material";
//import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
const params = new URLSearchParams(window.location.search);

class ActigraphyFunctionPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            actigraphy_visualisation_1: 'http://localhost:8000/static/runtime_config/workflow_'
                                        + params.get("workflow_id") + '/run_' + params.get("run_id")
                                        + '/step_' + params.get("step_id") + '/output/1_actigraphy_visualisation.png',
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    async handleSubmit() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_weekly_activity", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
            // this.setState({result_spindles: res.data})
            // this.setState({result_spindles_dataframe_1_table: JSON.parse(res.data.data_frame_1)})
            // // this.setState({result_spindles_dataframe_2_table: JSON.parse(res.data.data_frame_2)})
            //
            // console.log( JSON.parse(res.data["data_frame_1"]))

        });
    }

    // render() {
    //     return (
    //             <div>
    //                 <img
    //                         src="//C:/neurodesktop-storage/runtime_config/workflow_1/run_1/step_1/output/actigraphy_visualisation.svg"
    //                         alt="Actigraphy Visualisation"
    //                 />
    //             </div>
    //     );
    // }

    render() {
        return (
                <React.Fragment>
                    <div>
                        <Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>
                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                Data Preview
                            </Typography>
                            <hr/>
                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                File Name:
                            </Typography>
                            <Typography variant="p" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                actigraphy_test_data.csv
                            </Typography>
                            <hr/>
                        </Grid>
                    </div>
                    <div align={'right'}>
                        <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                Actigraphy Visualisations Viewer
                            </Typography>
                        <div align={'right'}>
                            <img src={this.state.actigraphy_visualisation_1} align={'right'}/>
                        </div>
                        <div align={'right'}>
                            <img src={actigraph2} align={'right'}/>
                        </div>
                        <div align={'right'}>
                            <img src={actigraph3} align={'right'}/>
                        </div>
                        </Grid>
                    </div>
                </React.Fragment>
        );
    }



    // render() {
    //     return (
    //
    //             <Plot
    //                     data={[
    //                         {
    //                             x: [1, 2, 3],
    //                             y: [2, 6, 3],
    //                             type: "scatter",
    //                             mode: "lines+markers",
    //                             marker: { color: "red" },
    //                         },
    //                         //{ type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
    //                     ]}
    //                     layout={{ width: 1000, height: 500, title: "Plotly with React" }}
    //             />
    //
    //     );
    // }
}

export default ActigraphyFunctionPage;
