import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import API from "../../axiosInstance";
import {DataGrid, GridCell, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
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
    Select, Tab, Tabs, TextField, Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import {LoadingButton} from "@mui/lab";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import ReactLoading from "react-loading";
import Samseg_Whole_Brain_Measurements_Widget from "../freesurfer/widget/Samseg_whole_brain_measurements_widget";
import ReconallVolumeDatatable from "../freesurfer/datatable/ReconallVolumeDatatable";
import Aseg from "../freesurfer/datatable/Aseg";
import LoadingWidget from "../ui-components/LoadingWidget";
const params = new URLSearchParams(window.location.search);

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

class ActigraphyFunctionalLinearModelling extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            done: true,
            tabvalue: 0,
            selected_file_name: "",
            file_names: [],
            results_show: false,
            dataset: "None",
            multiple_datasets: [],
            end_date: "None",
            selected: "None",

            data_fml: [],
            layout_fml: [],

            data_multi_fml: [],
            layout_multi_fml: [],

            configObj: {
                displayModeBar: true,
                displaylogo: true,
            },
        };
        //Binding functions of the class
        this.handleSelected = this.handleSelected.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSelectSingleDatasetChange = this.handleSelectSingleDatasetChange.bind(this);
        this.handleSelectMultiDatasetsChange = this.handleSelectMultiDatasetsChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleFML = this.handleFML.bind(this);
        this.handleMultiFML = this.handleMultiFML.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchFileNames();
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
    }

    handleSelected = (selected) => {
        console.log("Selected points", selected);
        this.setState({x_points:selected.range.x})
    };

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

    async handleFML() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_functional_linear_modelling", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                dataset: this.state.selected_file_name
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_FML")
            console.log(res.data.flm_figure)
            let json_response = JSON.parse(res.data.flm_figure)
            this.setState({data_fml: json_response["data"]})
            this.setState({layout_fml: json_response["layout"]})
            this.setState({done: true})
        });
    }

    async handleMultiFML() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_multi_functional_linear_modelling", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                multiple_datasets: this.state.multiple_datasets
            }
        }).then(res => {
            console.log("ACTIGRAPHIES_MULTI_FML")
            console.log(res.data.multi_flm_figure)
            let json_response = JSON.parse(res.data.multi_flm_figure)
            this.setState({data_multi_fml: json_response["data"]})
            this.setState({layout_multi_fml: json_response["layout"]})
        });
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            // this.setState({stats_show: false})
        })
    }

    handleSelectSingleDatasetChange(event){
        this.setState({selected_file_name: event.target.value})
    }

    handleSelectMultiDatasetsChange(event){
        this.setState({multiple_datasets: event.target.value})
    }

    handleSelectEndDateChange(event){
        this.setState({end_date: event.target.value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
                <>
                                    <Grid container direction="row">
                                        <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                                            <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                                Actigraphy Analysis Parameterisation
                                            </Typography>
                                            <hr/>
                                            <form onSubmit={(event) => {event.preventDefault();this.handleFML();}}>
                                                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                                        FML on a single dataset
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
                                                    {/*<FormHelperText><span style={{fontWeight: 'bold'}}>Selected Variables</span></FormHelperText>*/}
                                                    <List style={{fontSize:'13px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                                        Dataset selected: {this.state.selected_file_name}
                                                    </List>
                                                </FormControl>
                                                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                                                        Click here if you want to run FML on a single dataset.
                                                    </Typography>
                                                </FormControl>
                                                <FormControl sx={{m: 1, width:'20%'}} size={"small"} >

                                                       <Button variant="contained" color="primary" type="submit" onClick={() => {
                                                           this.setState({done: false});
                                                       }}>
                                                                Submit
                                                            </Button>


                                                </FormControl>
                                                <hr/>
                                            </form>
                                            <form onSubmit={(event) => {event.preventDefault();this.handleMultiFML();}}>
                                                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                                        FML on multiple datasets
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
                                                    {/*<FormHelperText><span style={{fontWeight: 'bold'}}>Selected Variables</span></FormHelperText>*/}
                                                    <List style={{fontSize:'13px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                                                        Dataset selected: {this.state.multiple_datasets}
                                                    </List>
                                                </FormControl>
                                                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                                                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "left" }} noWrap>
                                                        Click here if you want to run FML on multiple datasets.
                                                    </Typography>
                                                </FormControl>
                                                <FormControl sx={{m: 1, width:'20%'}} size={"small"} >
                                                    <Button variant="contained" color="primary" type="submit">
                                                        Submit
                                                    </Button>
                                                </FormControl>
                                                <hr/>
                                            </form>
                                        </Grid>
                                        {!this.state.done ? (
                                                <LoadingWidget/>
                                        ) : (   <Grid item xs={9} sx={{ borderRight: "1px solid grey"}}>
                                                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                                                        Actigraphy Analysis Results
                                                    </Typography>
                                                    <hr/>
                                                    <Box sx={{ width: '100%' }}>
                                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                                                <Tab label="Single Functional Linear Modelling" {...a11yProps(0)} />
                                                                <Tab label="Multi Functional Linear Modelling" {...a11yProps(1)} />
                                                            </Tabs>
                                                        </Box>

                                                    </Box>
                                                    <TabPanel value={this.state.tabvalue} index={0}>
                                                        <Plot layout={this.state.layout_fml} data={this.state.data_fml} config={this.state.configObj} onSelected={this.handleSelected}/>
                                                    </TabPanel>
                                                    <TabPanel value={this.state.tabvalue} index={1}>
                                                        <Plot layout={this.state.layout_multi_fml} data={this.state.data_multi_fml} config={this.state.configObj} onSelected={this.handleSelected}/>
                                                    </TabPanel>
                                                </Grid>
                                        )}

                                    </Grid>
                </>
        );
    }
}

export default ActigraphyFunctionalLinearModelling;
