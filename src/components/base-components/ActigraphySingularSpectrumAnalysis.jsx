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
    Grid, InputLabel,
    List, MenuItem, Select,
    Tab, Tabs, Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import {LoadingButton} from "@mui/lab";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import ProceedButton from "../ui-components/ProceedButton";
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

class ActigraphySingularSpectrumAnalysis extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabvalue: 0,
            selected_file_name: "",
            file_names: [],
            results_show: false,
            start_date: "None",
            end_date: "None",
            selected: "None",
            dataset: "None",

            data_fml: [],
            layout_fml: [],

            data_dfa_1: [],
            layout_dfa_1: [],
            data_dfa_2: [],
            layout_dfa_2: [],
            data_dfa_3: [],
            layout_dfa_3: [],

            data_ssa_1: [],
            layout_ssa_1: [],
            data_ssa_2: [],
            layout_ssa_2: [],
            data_ssa_3: [],
            layout_ssa_3: [],
            data_ssa_4: [],
            layout_ssa_4: [],

            configObj: {
                displayModeBar: true,
                displaylogo: true,
            },
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleSSA = this.handleSSA.bind(this);
        this.handleSelectDatasetChange = this.handleSelectDatasetChange.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchFileNames();
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
    }

    handleSelected = (selected) => {
        console.log("Selected points", selected);
        this.setState({x_points:selected.range.x})
    };

    handleSelectDatasetChange(event){
        this.setState({dataset: event.target.value})
    }


    async fetchFileNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_all_files",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }
                }).then(res => {
            this.setState({file_names: res.data.files})
        });
    }
    async handleSSA() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_singular_spectrum_analysis", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_DFA")

            console.log(res.data.ssa_figure_1)
            let json_response_1 = JSON.parse(res.data.ssa_figure_1)
            this.setState({data_ssa_1: json_response_1["data"]})
            this.setState({layout_ssa_1: json_response_1["layout"]})

            console.log(res.data.ssa_figure_2)
            let json_response_2 = JSON.parse(res.data.ssa_figure_2)
            this.setState({data_ssa_2: json_response_2["data"]})
            this.setState({layout_ssa_2: json_response_2["layout"]})

            console.log(res.data.ssa_figure_3)
            let json_response_3 = JSON.parse(res.data.ssa_figure_3)
            this.setState({data_ssa_3: json_response_3["data"]})
            this.setState({layout_ssa_3: json_response_3["layout"]})

            console.log(res.data.ssa_figure_4)
            let json_response_4 = JSON.parse(res.data.ssa_figure_4)
            this.setState({data_ssa_4: json_response_4["data"]})
            this.setState({layout_ssa_4: json_response_4["layout"]})
        });
    }

    handleSelectStartDateChange(event){
        this.setState({start_date: event.target.value})
    }

    handleSelectEndDateChange(event){
        this.setState({end_date: event.target.value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            // this.setState({stats_show: false})
        })
    }

    render() {
        return (
        <Grid container direction="row">
            <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Actigraphies Analysis Parameterisation
                </Typography>
                <hr/>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Data Preview
                    </Typography>
                </FormControl>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                    <InputLabel id="file-selector-label">File</InputLabel>
                    <Select
                            labelId="file-selector-label"
                            id="file-selector"
                            value= {this.state.selected_file_name}
                            label="File Variable"
                            onChange={this.handleSelectFileNameChange}
                    >
                        {this.state.file_names.map((column) => (
                                <MenuItem value={column}>{column}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Select dataset.</FormHelperText>
                </FormControl>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                        Click here to run SSA on the selected dataset above.
                    </Typography>
                </FormControl>
                <form onSubmit={(event) => {event.preventDefault();this.handleSSA();}}>
                    <FormControl sx={{m: 1, width:'20%'}} size={"small"} >
                        <Button variant="contained" color="primary" type="submit">
                            Submit
                        </Button>
                    </FormControl>
                    <hr/>
                </form>
                <ProceedButton></ProceedButton>
            </Grid>
                <Grid item xs={9} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Analysis Results
                    </Typography>
                    <hr/>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Singular Spectrum Analysis" {...a11yProps(1)} />
                            </Tabs>
                        </Box>

                    </Box>

                    <TabPanel value={this.state.tabvalue} index={0}>
                        <Plot layout={this.state.layout_ssa_1} data={this.state.data_ssa_1} config={this.state.configObj} onSelected={this.handleSelected}/>
                        <Plot layout={this.state.layout_ssa_2} data={this.state.data_ssa_2} config={this.state.configObj} onSelected={this.handleSelected}/>
                        <Plot layout={this.state.layout_ssa_3} data={this.state.data_ssa_3} config={this.state.configObj} onSelected={this.handleSelected}/>
                        <Plot layout={this.state.layout_ssa_4} data={this.state.data_ssa_4} config={this.state.configObj} onSelected={this.handleSelected}/>
                    </TabPanel>

                </Grid>
        </Grid>
        );
    }
}

export default ActigraphySingularSpectrumAnalysis;
