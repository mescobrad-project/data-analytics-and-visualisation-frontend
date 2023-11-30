import React from "react";
// import Plot from 'react-plotly.js';
// import actigraph1 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/1actigraphy_visualisation.png";
// import actigraph2 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/2actigraphy_visualisation.png";
// import actigraph3 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/3actigraphy_visualisation.png";
// import act from "C:/neurodesktop-storage/runtime_config/workflow_1/run_1/step_1/output/actigraphy_visualisation.png"
//import "./styles.css";
import Plot from "react-plotly.js";
import API from "../../axiosInstance";
import {GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
// import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
import {
    Button, FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    MenuItem,
    Select, Tab, Tabs, Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import {LoadingButton} from "@mui/lab";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
//import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
const params = new URLSearchParams(window.location.search);
const slowave_table_1_columns = [
    {
        field: "Start",
        headerName: "Start",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "NegPeak",
        headerName: "NegPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "MidCrossing",
        headerName: "MidCrossing",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PosPeak",
        headerName: "PosPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "End",
        headerName: "End",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Duration",
        headerName: "Duration",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValNegPeak",
        headerName: "ValNegPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ValPosPeak",
        headerName: "ValPosPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PTP",
        headerName: "PTP",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Slope",
        headerName: "Slope",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Frequency",
        headerName: "Frequency",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "SigmaPeak",
        headerName: "SigmaPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "PhaseAtSigmaPeak",
        headerName: "PhaseAtSigmaPeak",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "ndPAC",
        headerName: "ndPAC",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Stage",
        headerName: "Stage",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "Channel",
        headerName: "Channel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "IdxChannel",
        headerName: "IdxChannel",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
]

function CustomToolbar() {
    return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
    );
}

async function redirectToPage(workflow_id, run_id, step_id, function_name, bucket, file) {
    // Send the request
    let files_to_send = []
    for (let it=0 ; it< bucket.length;it++){
        files_to_send.push([bucket[it], file[it]])
    }

    API.put("function/navigation/",
            {
                workflow_id: workflow_id,
                run_id: run_id,
                step_id: step_id,
                function: function_name,
                metadata: {
                    // [["saved"] , "demo_sample_questionnaire.csv"],
                    "files": files_to_send
                },
            }
    ).then(res => {
        window.location.assign(res.data.url)
    });
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
            <div
                    role="tabpanel"
                    hidden={value !== index}
                    id={`simple-tabpanel-${index}`}
                    aria-labelledby={`simple-tab-${index}`}
                    {...other}
            >
                {value === index && (
                        <Box sx={{ p: 3 }}>
                            <Typography>{children}</Typography>
                        </Box>
                )}
            </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

class ActigraphyFunctionPage extends React.Component {



    constructor(props) {
        super(props);
        this.state = {
            tabvalue: 0,
            results_show: false,
            start_date: "None",
            end_date: "None",
            activity_status: "REST",
            algorithm: "None",
            selected: "None",
            mask_period_start: "None",
            mask_period_end: "None",
            x_points: [],
            x2: "",
            layoutObj: {
                title: 'Line Chart',
                width: 800,
                height: 600,
            },
            dataArray: [
                {
                    type: 'scatter',
                    y: [1, 2, 1, 4, 3, 6],
                    mode: 'lines',
                },
                {
                    type: 'scatter',
                    y: [2, 7, 0, 4, 6, 2],
                    mode: 'markers',
                },
            ],
            layout_cole_kripke: [{
                title: 'Cole Kripke',
                width: 800,
                height: 600,
            }],
            // layout_daily: {
            //     title: 'Daily Activity',
            //     width: 1200,
            //     height: 1000,
            // },
            data_plot_kripke: [],
            // data_plot_daily: [[{type: 'scatter',
            //     y: [1, 2, 1, 4, 3, 6],
            //     mode: 'markers',},]],
            data_plot_daily: [],
            layout_daily: [],
            final_data_plot_daily: [],
            final_layout_daily: [],
            data_day_1: [],
            layout_day_1: [],
            data_day_2: [],
            layout_day_2: [],
            data_day_3: [],
            layout_day_3: [],
            data_day_4: [],
            layout_day_4: [],
            data_day_5: [],
            layout_day_5: [],
            data_day_6: [],
            layout_day_6: [],
            data_day_7: [],
            layout_day_7: [],
            data_fml: [],
            layout_fml: [],
            data_inactivity_mask: [],
            layout_inactivity_mask: [],
            data_add_mask_period: [],
            layout_add_mask_period: [],
            configObj: {
                displayModeBar: true,
                displaylogo: true,
            },
            initial_results_dataframe: [],
            final_results_dataframe: [],
            actigraphy_visualisation_1: 'http://localhost:8000/static/runtime_config/workflow_'
                                        + params.get("workflow_id") + '/run_' + params.get("run_id")
                                        + '/step_' + params.get("step_id") + '/output/1_actigraphy_visualisation.png',
            actigraphy_visualisation_2: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/2_actigraphy_visualisation.png',
            actigraphy_visualisation_3: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/3_actigraphy_visualisation.png',
            actigraphy_visualisation_4: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/4_actigraphy_visualisation.png',
            actigraphy_visualisation_5: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/5_actigraphy_visualisation.png',
            actigraphy_visualisation_6: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/6_actigraphy_visualisation.png',
            actigraphy_visualisation_7: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/7_actigraphy_visualisation.png',
            cole_kripke_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/ck_assessment.png',
            sadeh_scripp_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/sadeh_scripp_assessment.png',
            oakley_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/oakley_assessment.png',
            crespo_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/crespo_assessment.png',
            assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/assessment.png',
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitCK = this.handleSubmitCK.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSubmitAssessment = this.handleSubmitAssessment.bind(this);
        this.handleSelectAssessmentChange = this.handleSelectAssessmentChange.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleSelectActivityStatusChange = this.handleSelectActivityStatusChange.bind(this);
        this.handleSubmitActivityStatus = this.handleSubmitActivityStatus.bind(this);
        this.handleSubmit_daily = this.handleSubmit_daily.bind(this);
        this.handleSubmitInitialDataset = this.handleSubmitInitialDataset.bind(this);
        this.handleSubmitFinalDataset = this.handleSubmitFinalDataset.bind(this);
        this.handleSubmitVisualisationResults = this.handleSubmitVisualisationResults.bind(this);
        this.handleSubmitFinalVisualisationResults = this.handleSubmitFinalVisualisationResults.bind(this);
        this.handleFML = this.handleFML.bind(this);
        this.handleInactivityMask = this.handleInactivityMask.bind(this);
        this.handleMaskPeriodStartDateChange = this.handleMaskPeriodStartDateChange.bind(this);
        this.handleMaskPeriodEndDateChange = this.handleMaskPeriodEndDateChange.bind(this);
        this.handleAddMaskPeriod = this.handleAddMaskPeriod.bind(this);
    }

    handleSelected = (selected) => {
        console.log("Selected points", selected);
        this.setState({x_points:selected.range.x})
    };
    data_daily = [];

    async handleSubmit() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_weekly_activity", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                start_date: this.state.start_date,
                end_date: this.state.end_date
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

    async handleSubmitVisualisationResults() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_daily_activity_activity_status_area", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("VisualisationResults")
            console.log(res.data.visualisation_figure)
            let json_response = JSON.parse(res.data.visualisation_figure)
            this.setState({data_plot_daily: json_response["data"]})
            this.setState({layout_daily: json_response["layout"]})
            this.setState({tabvalue:1})
        });
    }

    async handleSubmitFinalVisualisationResults() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_final_daily_activity_activity_status_area", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("VisualisationResults")
            console.log(res.data.visualisation_figure_final)
            let json_response = JSON.parse(res.data.visualisation_figure_final)
            this.setState({final_data_plot_daily: json_response["data"]})
            this.setState({final_layout_daily: json_response["layout"]})
        });
    }

    async handleSubmitAssessment() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_assessment_algorithm", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                algorithm: this.state.algorithm
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

    async handleSubmitActivityStatus() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/change_activity_status", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                activity_status: this.state.activity_status,
                start_date: this.state.x_points[0],
                end_date: this.state.x_points[1]
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

    async handleSubmitCK() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_cole_kripke", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
            let json_response = JSON.parse(res.data.figure)
            this.setState({data_plot_kripke: json_response["data"]})
        });
    }

    async handleSubmitInitialDataset() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_initial_dataset", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_INITIAL_DATASET")
            console.log(res.data)
            let json_response = JSON.parse(res.data.dataframe)
            console.log(json_response)
            this.setState({initial_results_dataframe: JSON.parse(res.data.dataframe)})
            console.log(this.state.initial_results_dataframe)
        });
    }

    async handleSubmitFinalDataset() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_final_dataset", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_FINAL_DATASET")
            console.log(res.data)
            let json_response = JSON.parse(res.data.dataframe)
            console.log(json_response)
            this.setState({final_results_dataframe: JSON.parse(res.data.dataframe)})
            console.log(this.state.final_results_dataframe)
        });
    }

    async handleChangeFinalCSV() {
        const params = new URLSearchParams(window.location.search);
        API.get("/change_final_csv", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_CHANGE_FINAL_CSV")
        });
    }

    async handleFML() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_functional_linear_modelling", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_FML")
            console.log(res.data.flm_figure)
            let json_response = JSON.parse(res.data.flm_figure)
            this.setState({data_fml: json_response["data"]})
            this.setState({layout_fml: json_response["layout"]})
        });
    }

    async handleInactivityMask() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_inactivity_mask_visualisation", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_INACTIVE_MASK")
            console.log(res.data.visualisation_inactivity_mask)
            let json_response = JSON.parse(res.data.visualisation_inactivity_mask)
            this.setState({data_inactivity_mask: json_response["data"]})
            this.setState({layout_inactivity_mask: json_response["layout"]})
        });
    }

    async handleAddMaskPeriod() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_inactivity_mask_visualisation", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                mask_period_start: this.state.mask_period_start,
                mask_period_end: this.state.mask_period_end
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_ADD_MASK_PERIOD")
            console.log(res.data.visualisation_add_mask_period)
            let json_response = JSON.parse(res.data.visualisation_add_mask_period)
            this.setState({data_add_mask_period: json_response["data"]})
            this.setState({layout_add_mask_period: json_response["layout"]})
        });
    }

    async handleSubmit_daily() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_daily_activity", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                algorithm: this.state.algorithm,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_DAILY_PLOT")
            console.log(res.data.figure)

            let json_response_day_1 = JSON.parse(res.data.figure[0])
            console.log("json_response_day_1")
            console.log(json_response_day_1)
            this.setState({data_day_1: json_response_day_1["data"]})
            this.setState({layout_day_1: json_response_day_1["layout"]})

            let json_response_day_2 = JSON.parse(res.data.figure[1])
            console.log("json_response_day_2")
            console.log(json_response_day_2)
            this.setState({data_day_2: json_response_day_2["data"]})
            this.setState({layout_day_2: json_response_day_2["layout"]})

            let json_response_day_3 = JSON.parse(res.data.figure[2])
            console.log("json_response_day_3")
            console.log(json_response_day_3)
            this.setState({data_day_3: json_response_day_3["data"]})
            this.setState({layout_day_3: json_response_day_3["layout"]})

            let json_response_day_4 = JSON.parse(res.data.figure[3])
            console.log("json_response_day_4")
            console.log(json_response_day_4)
            this.setState({data_day_4: json_response_day_4["data"]})
            this.setState({layout_day_4: json_response_day_4["layout"]})

            let json_response_day_5 = JSON.parse(res.data.figure[4])
            console.log("json_response_day_5")
            console.log(json_response_day_5)
            this.setState({data_day_5: json_response_day_5["data"]})
            this.setState({layout_day_5: json_response_day_5["layout"]})

            let json_response_day_6 = JSON.parse(res.data.figure[5])
            console.log("json_response_day_6")
            console.log(json_response_day_6)
            this.setState({data_day_6: json_response_day_6["data"]})
            this.setState({layout_day_6: json_response_day_6["layout"]})

            let json_response_day_7 = JSON.parse(res.data.figure[6])
            console.log("json_response_day_7")
            console.log(json_response_day_7)
            this.setState({data_day_7: json_response_day_7["data"]})
            this.setState({layout_day_7: json_response_day_7["layout"]})
        });
    }

    handleSelectAssessmentChange(event){
        this.setState({algorithm: event.target.value})
    }

    handleSelectStartDateChange(event){
        this.setState({start_date: event.target.value})
    }

    handleSelectEndDateChange(event){
        this.setState({end_date: event.target.value})
    }

    handleSelectActivityStatusChange(event){
        this.setState({activity_status: event.target.value})
    }

    handleMaskPeriodStartDateChange(event){
        this.setState({mask_period_start: event.target.value})
    }

    handleMaskPeriodEndDateChange(event){
        this.setState({mask_period_end: event.target.value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
        <Grid container direction="row">
            <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Actigraphies Parameterisation
                </Typography>
                <hr/>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Data Preview
                </Typography>
                <hr/>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        File Name:
                    </Typography>
                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        0345-024_18_07_2022_13_00_00_New_Analysis.csv
                    </Typography>
                <hr/>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Variables</span></FormHelperText>
                    <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                        Dates: {this.state.start_date} - {this.state.end_date}
                    </List>
                    <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                        Assessment Algorithm: {this.state.algorithm}
                    </List>
                </FormControl>
                <hr/>
                <hr/>
                <form onSubmit={(event) => {event.preventDefault();this.handleSubmit_daily();this.handleSubmitInitialDataset();this.handleSubmitVisualisationResults();this.handleFML();this.handleInactivityMask();}}>
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="startdate-label">Start Date</InputLabel>
                        <Select
                                labelId="startdate-label"
                                id="startdate-selector"
                                value= {this.state.start_date}
                                label="startdate"
                                onChange={this.handleSelectStartDateChange}
                        >
                            <MenuItem value={"2022/07/18 12:00:00"}><em>2022-07-18 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/19 12:00:00"}><em>2022-07-19 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07-20 12:00:00"}><em>2022-07-20 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/21 12:00:00"}><em>2022-07-21 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/22 12:00:00"}><em>2022-07-22 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/23 12:00:00"}><em>2022-07-23 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/24 12:00:00"}><em>2022-07-24 12:00:00</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="enddate-label">End Date</InputLabel>
                        <Select
                                labelId="enddate-label"
                                id="enddate-selector"
                                value= {this.state.end_date}
                                label="enddate"
                                onChange={this.handleSelectEndDateChange}
                        >
                            <MenuItem value={"2022/07/18 12:00:00"}><em>2022-07-18 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/19 12:00:00"}><em>2022-07-19 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/20 12:00:00"}><em>2022-07-20 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/21 12:00:00"}><em>2022-07-21 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/22 12:00:00"}><em>2022-07-22 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/23 12:00:00"}><em>2022-07-23 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/24 12:00:00"}><em>2022-07-24 12:00:00</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="rotation-label">Assessment Algorithm</InputLabel>
                        <Select
                                labelId="assessment-label"
                                id="assessment-selector"
                                value= {this.state.algorithm}
                                label="assessment"
                                onChange={this.handleSelectAssessmentChange}
                        >
                            <MenuItem value={"Cole - Kripke"}><em>Cole - Kripke</em></MenuItem>
                            <MenuItem value={"Sadeh - Scripp"}><em>Sadeh - Scripp</em></MenuItem>
                            <MenuItem value={"Oakley"}><em>Oakley</em></MenuItem>
                            <MenuItem value={"Crespo"}><em>Crespo</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the assessment algorithm to run on the dataset.</FormHelperText>
                    </FormControl>
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                    <hr/>
                </form>
                {/*<Button variant="contained" color="primary" type="button" size="large"*/}
                {/*        onClick={redirectToPage.bind(this,1, 1, 6, "actigraphy_page", ["saved"], ["psg1 anonym2.edf"])}*/}
                {/*>*/}
                {/*    Show results*/}
                {/*</Button>*/}
            </Grid>
                <Grid item xs={9} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Assessment Algorithms Results
                    </Typography>
                    <hr/>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Initial Dataset" {...a11yProps(0)} />
                                <Tab label="Initial Visualisation Results" {...a11yProps(1)} />
                                <Tab label="Assessment Algorithms" {...a11yProps(2)} />
                                <Tab label="Final Dataset" {...a11yProps(3)} />
                                <Tab label="Final Visualisation Results" {...a11yProps(4)} />
                                {/*<Tab label="Functional Linear Modelling" {...a11yProps(5)} />*/}
                                {/*<Tab label="Automatic Inactivity Mask (20m)" {...a11yProps(6)} />*/}
                                {/*<Tab label="Add Mask Period" {...a11yProps(7)} />*/}
                            </Tabs>
                        </Box>

                    </Box>
                    <TabPanel value={this.state.tabvalue} index={0}>
                        <JsonTable className="jsonResultsTable"
                                   rows = {this.state.initial_results_dataframe}
                                   noRowsMessage="No dataset selected" />
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={1}>
                        <Plot layout={this.state.layout_daily} data={this.state.data_plot_daily} config={this.state.configObj} onSelected={this.handleSelected}/>
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={2}>
                        <Grid container direction="row">
                            <Grid item xs={12} sx={{ borderRight: "1px solid grey"}}>
                                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                    Activity & Assessment
                                </Typography>
                                <Plot layout={this.state.layout_day_1} data={this.state.data_day_1} config={this.state.configObj} onSelected={this.handleSelected}/>
                                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleChangeFinalCSV();this.handleSubmitFinalVisualisationResults();}}>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                        <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                        <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                            Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                        </List>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                        <InputLabel id="enddate-label">Activity Status</InputLabel>
                                        <Select
                                                labelId="activitystatus-label"
                                                id="activitystatus-selector"
                                                value= {this.state.activity_status}
                                                label="activitystatus"
                                                onChange={this.handleSelectActivityStatusChange}
                                        >
                                            <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                            <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                            <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                            <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                                <hr/>

                                <Plot layout={this.state.layout_day_2} data={this.state.data_day_2} config={this.state.configObj} onSelected={this.handleSelected}/>
                                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleChangeFinalCSV();this.handleSubmitFinalVisualisationResults();}}>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                        <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                        <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                            Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                        </List>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                        <InputLabel id="enddate-label">Activity Status</InputLabel>
                                        <Select
                                                labelId="activitystatus-label"
                                                id="activitystatus-selector"
                                                value= {this.state.activity_status}
                                                label="activitystatus"
                                                onChange={this.handleSelectActivityStatusChange}
                                        >
                                            <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                            <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                            <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                            <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                                <hr/>

                                <Plot layout={this.state.layout_day_3} data={this.state.data_day_3} config={this.state.configObj} onSelected={this.handleSelected}/>
                                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleChangeFinalCSV();this.handleSubmitFinalVisualisationResults();}}>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                        <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                        <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                            Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                        </List>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                        <InputLabel id="enddate-label">Activity Status</InputLabel>
                                        <Select
                                                labelId="activitystatus-label"
                                                id="activitystatus-selector"
                                                value= {this.state.activity_status}
                                                label="activitystatus"
                                                onChange={this.handleSelectActivityStatusChange}
                                        >
                                            <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                            <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                            <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                            <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                                <hr/>

                                <Plot layout={this.state.layout_day_4} data={this.state.data_day_4} config={this.state.configObj} onSelected={this.handleSelected}/>
                                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleChangeFinalCSV();this.handleSubmitFinalVisualisationResults();}}>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                        <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                        <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                            Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                        </List>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                        <InputLabel id="enddate-label">Activity Status</InputLabel>
                                        <Select
                                                labelId="activitystatus-label"
                                                id="activitystatus-selector"
                                                value= {this.state.activity_status}
                                                label="activitystatus"
                                                onChange={this.handleSelectActivityStatusChange}
                                        >
                                            <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                            <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                            <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                            <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                                <hr/>

                                <Plot layout={this.state.layout_day_5} data={this.state.data_day_5} config={this.state.configObj} onSelected={this.handleSelected}/>
                                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleChangeFinalCSV();this.handleSubmitFinalVisualisationResults();}}>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                        <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                        <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                            Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                        </List>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                        <InputLabel id="enddate-label">Activity Status</InputLabel>
                                        <Select
                                                labelId="activitystatus-label"
                                                id="activitystatus-selector"
                                                value= {this.state.activity_status}
                                                label="activitystatus"
                                                onChange={this.handleSelectActivityStatusChange}
                                        >
                                            <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                            <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                            <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                            <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                                <hr/>

                                <Plot layout={this.state.layout_day_6} data={this.state.data_day_6} config={this.state.configObj} onSelected={this.handleSelected}/>
                                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleChangeFinalCSV();this.handleSubmitFinalVisualisationResults();}}>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                        <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                        <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                            Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                        </List>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                        <InputLabel id="enddate-label">Activity Status</InputLabel>
                                        <Select
                                                labelId="activitystatus-label"
                                                id="activitystatus-selector"
                                                value= {this.state.activity_status}
                                                label="activitystatus"
                                                onChange={this.handleSelectActivityStatusChange}
                                        >
                                            <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                            <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                            <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                            <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                                <hr/>

                                <Plot layout={this.state.layout_day_7} data={this.state.data_day_7} config={this.state.configObj} onSelected={this.handleSelected}/>
                                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmitActivityStatus();this.handleSubmitFinalDataset();this.handleChangeFinalCSV();this.handleSubmitFinalVisualisationResults();}}>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                        <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Points</span></FormHelperText>
                                        <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                            Points: {this.state.x_points[0]} - {this.state.x_points[1]}
                                        </List>
                                    </FormControl>
                                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                        <InputLabel id="enddate-label">Activity Status</InputLabel>
                                        <Select
                                                labelId="activitystatus-label"
                                                id="activitystatus-selector"
                                                value= {this.state.activity_status}
                                                label="activitystatus"
                                                onChange={this.handleSelectActivityStatusChange}
                                        >
                                            <MenuItem value={"ACTIVE"}><em>ACTIVE</em></MenuItem>
                                            <MenuItem value={"REST"}><em>REST</em></MenuItem>
                                            <MenuItem value={"REST-S"}><em>REST-S</em></MenuItem>
                                            <MenuItem value={"Excluded"}><em>Excluded</em></MenuItem>
                                        </Select>
                                        <FormHelperText>Select the activity status to set for the range of dates above.</FormHelperText>
                                    </FormControl>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </form>
                                <hr/>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={3}>
                        <JsonTable className="jsonResultsTable"
                                   rows = {this.state.final_results_dataframe}/>
                    </TabPanel>

                    <TabPanel value={this.state.tabvalue} index={4}>
                        <Plot layout={this.state.final_layout_daily} data={this.state.final_data_plot_daily} config={this.state.configObj} onSelected={this.handleSelected}/>
                    </TabPanel>

                    {/*<TabPanel value={this.state.tabvalue} index={5}>*/}
                    {/*    <Plot layout={this.state.layout_fml} data={this.state.data_fml} config={this.state.configObj} onSelected={this.handleSelected}/>*/}
                    {/*</TabPanel>*/}

                    {/*<TabPanel value={this.state.tabvalue} index={6}>*/}
                    {/*    <Plot layout={this.state.layout_inactivity_mask} data={this.state.data_inactivity_mask} config={this.state.configObj} onSelected={this.handleSelected}/>*/}
                    {/*</TabPanel>*/}

                    {/*<TabPanel value={this.state.tabvalue} index={7}>*/}
                    {/*    <form onSubmit={(event) => {event.preventDefault();this.handleAddMaskPeriod();}}>*/}
                    {/*        <FormControl sx={{m: 1, width:'90%'}} size={"small"} >*/}
                    {/*            <FormHelperText><span style={{fontWeight: 'bold'}}>Select the period you want to mask (from start date to end date) (inclusive)</span></FormHelperText>*/}
                    {/*            Start Date:*/}
                    {/*            <input type={"text"} value={this.state.mask_period_start} onChange={this.handleMaskPeriodStartDateChange}/>*/}
                    {/*            End Date:*/}
                    {/*            <input type={"text"} value={this.state.mask_period_end} onChange={this.handleMaskPeriodEndDateChange}/>*/}
                    {/*        </FormControl>*/}
                    {/*        <Button variant="contained" color="primary" type="submit">*/}
                    {/*            Submit*/}
                    {/*        </Button>*/}
                    {/*    </form>*/}
                    {/*    <Plot layout={this.state.layout_add_mask_period} data={this.state.data_add_mask_period} config={this.state.configObj} onSelected={this.handleSelected}/>*/}
                    {/*</TabPanel>*/}
                </Grid>
                {/*<Grid item xs={4} sx={{ borderRight: "1px solid grey"}} alignContent={'right'}>*/}
                {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        Actigraphy Visualisations*/}
                {/*    </Typography>*/}
                {/*    <hr/>*/}
                {/*    <Box sx={{ width: '100%' }}>*/}
                {/*        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>*/}
                {/*            <Tabs variant="scrollable" scrollButtons="auto" value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">*/}
                {/*                <Tab label="Initial" {...a11yProps(0)} />*/}
                {/*                <Tab label="Visualisation Results Day 1" {...a11yProps(1)} />*/}
                {/*                <Tab label="Visualisation Results Day 2" {...a11yProps(2)} />*/}
                {/*                <Tab label="Visualisation Results Day 3" {...a11yProps(3)} />*/}
                {/*                <Tab label="Visualisation Results Day 4" {...a11yProps(4)} />*/}
                {/*                <Tab label="Visualisation Results Day 5" {...a11yProps(5)} />*/}
                {/*                <Tab label="Visualisation Results Day 6" {...a11yProps(6)} />*/}
                {/*                <Tab label="Visualisation Results Day 7" {...a11yProps(7)} />*/}
                {/*            </Tabs>*/}
                {/*        </Box>*/}

                {/*    </Box>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={0}>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={1}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 1*/}
                {/*        </Typography>*/}
                {/*        /!*<Grid item xs={2}*!/*/}
                {/*        /!*      style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}} alignContent={'right'}>*!/*/}
                {/*        <img src={this.state.actigraphy_visualisation_1 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_1 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={2}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 2*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_2 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_2 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={3}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 3*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_3 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_3 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={4}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 4*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_4 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_4 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={5}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 5*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_5 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_5 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={6}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 6*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_6 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_6 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={7}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 7*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_7 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_7 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}

                {/*    /!*<img src={this.state.actigraphy_visualisation_1} srcSet={this.state.actigraphy_visualisation_1} align={'right'} loading="lazy"/>*!/*/}

                {/*    /!*<img src={this.state.actigraphy_visualisation_2} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_3} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_4} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_5} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_6} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_7} align={'right'} loading="lazy"/>*!/*/}
                {/*</Grid>*/}
        </Grid>
        );
    }
}

export default ActigraphyFunctionPage;
