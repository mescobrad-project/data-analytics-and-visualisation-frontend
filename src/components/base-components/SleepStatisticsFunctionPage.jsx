import React from 'react';
import API from "../../axiosInstance";
import PropTypes from 'prop-types';
import "../../pages/hypothesis_testing/linearmixedeffectsmodel.scss";
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem, Modal,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography
} from "@mui/material";

// Amcharts
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import PointChartCustom from "../ui-components/PointChartCustom";
import RangeAreaChartCustom from "../ui-components/RangeAreaChartCustom";
import EEGSelector from "./EEGSelector";
import {Box} from "@mui/system";
import ChannelSignalPeaksChartCustom from "../ui-components/ChannelSignalPeaksChartCustom";
import EEGSelectModal from "../ui-components/EEGSelectModal";
import {useLocation} from "react-router-dom";
import {GridCell} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import InnerHTML from "dangerously-set-html-content";

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

class SleepStatisticsFunctionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // Utils
            channels: [],

            // Parameters
            general_sampling_freuency_hypno: 1/30,

            // Results
            results_show: false,
            result_sleep_statistic_hypnogram: {
                "sleep_statistics": null,
            },
            result_sleep_transition_matrix: {
                "counts_transition_matrix": null,
                "conditional_probability_transition_matrix": null,
                "figure": {"figure": []}
            },
            result_sleep_stability_extraction: {
                "sleep_stage_stability" : null,
            },

            //Values selected currently on the form
            selected_channel: "",

        };

        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchSleepStatisticHypnogram = this.fetchSleepStatisticHypnogram.bind(this);
        this.fetchSleepTransitionMatrix = this.fetchSleepTransitionMatrix.bind(this);
        this.fetchSleepStabilityExtraction = this.fetchSleepStabilityExtraction.bind(this);

        this.handleChangeSamplingFrequencyHypnogram = this.handleChangeSamplingFrequencyHypnogram.bind(this);
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();

        await this.fetchSleepStatisticHypnogram();
        await this.fetchSleepTransitionMatrix();
        await this.fetchSleepStabilityExtraction();


        this.setState({results_show: true})

        // const params = new URLSearchParams(window.location.search);
        // // Send the request
        // console.log("STUFF")
        // console.log(this.state.file_used)
        // API.get("return_autocorrelation",
        //         {
        //             params: {
        //
        //             }
        //         }
        // ).then(res => {
        //
        // });

    }


    async fetchSleepStatisticHypnogram() {
        const params = new URLSearchParams(window.location.search);
        API.get("/sleep_statistics_hypnogram", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                // sampling_frequency: 1/30,
            }
        }).then(res => {
            console.log("HYPNOGRAM")
            console.log(res.data)
            this.setState({result_sleep_statistic_hypnogram: res.data})
        });
    }

    async fetchSleepTransitionMatrix() {
        const params = new URLSearchParams(window.location.search);
        API.get("/sleep_transition_matrix", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }
        }).then(res => {
            console.log("TRANSITION MATRIX")
            console.log(res.data)
            this.setState({result_sleep_transition_matrix: res.data})
            // this.setState({sleep_statistic_hypnogram: res.data.sleep_statistic_hypnogram})
        });
    }

    async fetchSleepStabilityExtraction() {
        const params = new URLSearchParams(window.location.search);
        API.get("/sleep_stability_extraction", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }
        }).then(res => {
            console.log("STABILITY EXTRACTION")
            console.log(res.data)
            this.setState({result_sleep_stability_extraction: res.data})
            // this.setState({sleep_statistic_hypnogram: res.data.sleep_statistic_hypnogram})
        });
    }



    /**
     * Update state when selection changes in the form
     */
    handleChangeSamplingFrequencyHypnogram(event) {
        this.setState({general_sampling_freuency_hypno: event.target.value})
    }


    debug = () => {
        console.log("DEBUG")
        // console.log(this.state.result_sleep_transition_matrix["figure"]["figure"])
        // console.log(JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"]))
        // console.log(JSON.parse(this.state.result_sleep_transition_matrix["counts_transition_matrix"]))
        // console.log(JSON.parse(this.state.result_sleep_transition_matrix["conditional_probability_transition_matrix"]))
        // console.log(JSON.parse(this.state.result_sleep_stability_extraction["sleep_stage_stability"]))
        console.log(JSON.parse(this.state.result_band_power["bandpower"]))
        // console.log(JSON.parse(this.state.result_spectogram["figure"]["figure"]))
        console.log(this.state.result_spectogram["figure"]["figure"])

    };

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={4} sx={{borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            Slowwave/Spindle Parameterisation
                        </Typography>
                        <Divider sx={{bgcolor: "black"}}/>

                        {/*<Button variant="contained" color="primary" sx={{marginLeft: "25%"}} disabled={(this.state.selected_part_channel === "" ? true : false)} onClick={this.handleModalOpen}>Open modal</Button>*/}
                        {/*<Modal*/}
                        {/*        open={this.state.open_modal}*/}
                        {/*        onClose={this.handleModalClose}*/}
                        {/*        aria-labelledby="modal-modal-title"*/}
                        {/*        aria-describedby="modal-modal-description"*/}
                        {/*        // disableEnforceFocus={true}*/}
                        {/*>*/}
                        {/*    <Box sx={style}>*/}
                        {/*        <Typography id="modal-modal-title" variant="h6" component="h2">*/}
                        {/*            Select channels and time range | Print to EDF and Save*/}
                        {/*        </Typography>*/}
                        {/*        <EEGSelector/>*/}
                        {/*    </Box>*/}
                        {/*</Modal>*/}
                        <Divider/>
                        {/* The form only appears when this.state.channels has any value which happens only when the forms
                    knows what file to access*/}
                        <form onSubmit={this.handleSubmit}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                General Parameterisation
                            </Typography>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        id="sampling-frequency-hypnogram"
                                        value= {this.state.general_sampling_freuency_hypno}
                                        label="Sampling Frequency of Hypnogram"
                                        size={"small"}
                                        onChange={this.handleSelectNlagsChange}
                                />
                                <FormHelperText>Current Sampling Frequency of Hypnogram</FormHelperText>
                            </FormControl>
                            <Divider/>
                            <Divider/>
                            <Button sx={{float: "left", marginLeft: "2px"}} variant="contained" color="primary"
                                    type="submit">
                                Submit
                            </Button>
                            <Button onClick={this.debug} variant="contained" color="secondary"
                                    sx={{margin: "8px", float: "right"}}>
                                Debug
                            </Button>
                        </form>
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            window.location.replace("/")
                            // Send the request
                        }}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary"
                                    type="submit">
                                Proceed >
                            </Button>
                        </form>
                    </Grid>

                    {/*<Divider/>*/}
                    <Grid xs={8} direction='column'>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            Result Visualisation
                        </Typography>
                        <Divider sx={{bgcolor: "black"}}/>
                        {/*<Grid item xs={12} container direction='row'>*/}

                        {/*</Grid>*/}
                        <Grid container direction="row" style={{display: (this.state.results_show ? 'block' : 'none')}}>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Sleep statistics Results
                            </Typography>
                            <Divider/>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width: '90%'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{alignContent: "right"}}>
                                            <TableCell className="tableHeadCell">TIB</TableCell>
                                            <TableCell className="tableHeadCell">SPT</TableCell>
                                            <TableCell className="tableHeadCell">WASO</TableCell>
                                            <TableCell className="tableHeadCell">TST</TableCell>
                                            <TableCell className="tableHeadCell">N1</TableCell>
                                            <TableCell className="tableHeadCell">N2</TableCell>
                                            <TableCell className="tableHeadCell">N3</TableCell>
                                            <TableCell className="tableHeadCell">REM</TableCell>
                                            <TableCell className="tableHeadCell">NREM</TableCell>
                                            <TableCell className="tableHeadCell">SOL</TableCell>
                                            <TableCell className="tableHeadCell">Lat_N1</TableCell>
                                            <TableCell className="tableHeadCell">Lat_N2</TableCell>
                                            <TableCell className="tableHeadCell">Lat_N3</TableCell>
                                            <TableCell className="tableHeadCell">Lat_REM</TableCell>
                                            <TableCell className="tableHeadCell">%N1</TableCell>
                                            <TableCell className="tableHeadCell">%N2</TableCell>
                                            <TableCell className="tableHeadCell">%N3</TableCell>
                                            <TableCell className="tableHeadCell">%REM</TableCell>
                                            <TableCell className="tableHeadCell">%NREM</TableCell>
                                            <TableCell className="tableHeadCell">SE</TableCell>
                                            <TableCell className="tableHeadCell">SME</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            {/*<TableCell className="tableCell">{item.id}</TableCell>*/}
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][0] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][1] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][2] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][3] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][4] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][5] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][6] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][7] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][8] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][9] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][10] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][11] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][12] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][13] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][14] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][15] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][16] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][17] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][18] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][19] : 0} </TableCell>
                                            <TableCell
                                                    className="tableCell"> { this.state.result_sleep_statistic_hypnogram["sleep_statistics"] ? JSON.parse(this.state.result_sleep_statistic_hypnogram["sleep_statistics"])["data"][20] : 0} </TableCell>

                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Sleep Transition Matrix Results
                            </Typography>
                            <Divider/>
                            <Grid item xs={6} style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}}>
                                <img
                                        src={`http://localhost:8000/static/sleep_transition_matrix.png?w=164&h=164&fit=crop&auto=format`}
                                        srcSet={`http://localhost:8000/static/sleep_transition_matrix.png?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        // alt={item.title}
                                        loading="lazy"
                                />
                                {/*{*/}
                                {/*    this.state.result_sleep_transition_matrix["figure"]["figure"] ?*/}
                                {/*            <InnerHTML html={this.state.result_sleep_transition_matrix["figure"]["figure"]}*/}
                                {/*                                                                     style={{zoom: '50%'}}/>*/}
                                {/*            : <div/>*/}
                                {/* }*/}

                                <hr className="result"/>
                            </Grid>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Sleep transition matrix
                            </Typography>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width: '90%'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{alignContent: "right"}}>
                                            <TableCell className="tableHeadCell">0</TableCell>
                                            <TableCell className="tableHeadCell">1</TableCell>
                                            <TableCell className="tableHeadCell">2</TableCell>
                                            <TableCell className="tableHeadCell">3</TableCell>
                                            <TableCell className="tableHeadCell">4</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                    { (  this.state.result_sleep_transition_matrix["counts_transition_matrix"] ? JSON.parse(this.state.result_sleep_transition_matrix["counts_transition_matrix"])["data"] : []).map((item) => {
                                            return (
                                        <TableRow>
                                            {/*<TableCell className="tableCell">{item.id}</TableCell>*/}
                                            <TableCell
                                                    className="tableCell"> {  item[0] } </TableCell>
                                            <TableCell
                                                    className="tableCell"> { item[1] } </TableCell>
                                            <TableCell
                                                    className="tableCell"> { item[2] } </TableCell>
                                            <TableCell
                                                    className="tableCell"> { item[3] } </TableCell>
                                            <TableCell
                                                    className="tableCell"> {  item[4] } </TableCell>

                                        </TableRow>
                                        );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography variant="h6" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Conditional Probability Transition Matrix
                            </Typography>
                            <TableContainer component={Paper} className="ExtremeValues" sx={{width: '90%'}}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{alignContent: "right"}}>
                                            <TableCell className="tableHeadCell">0</TableCell>
                                            <TableCell className="tableHeadCell">1</TableCell>
                                            <TableCell className="tableHeadCell">2</TableCell>
                                            <TableCell className="tableHeadCell">3</TableCell>
                                            <TableCell className="tableHeadCell">4</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        { ( this.state.result_sleep_transition_matrix["conditional_probability_transition_matrix"] ? JSON.parse(this.state.result_sleep_transition_matrix["conditional_probability_transition_matrix"])["data"] : []).map((item) => {
                                            return (
                                                    <TableRow>
                                                        {/*<TableCell className="tableCell">{item.id}</TableCell>*/}
                                                        <TableCell
                                                                className="tableCell"> { item[0] } </TableCell>
                                                        <TableCell
                                                                className="tableCell"> {  item[1]} </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[2]} </TableCell>
                                                        <TableCell
                                                                className="tableCell"> { item[3]} </TableCell>
                                                        <TableCell
                                                                className="tableCell"> {item[4]} </TableCell>

                                                    </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>
                            <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                                Sleep Stage Stability Results
                            </Typography>
                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Sleep Stage Stability: { this.state.result_sleep_stability_extraction["sleep_stage_stability"]}</Typography>
                            <hr className="result" style={{display: (this.state.results_show ? 'block' : 'none')}}/>

                        </Grid>
                        {/*<NewWindow>*/}
                        {/*    <EEGSelector/>*/}
                        {/*</NewWindow>*/}
                    </Grid>
                </Grid>
        )
    }
}

export default SleepStatisticsFunctionPage;
