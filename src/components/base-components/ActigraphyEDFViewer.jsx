import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import {DataGrid, GridValueFormatterParams} from "@mui/x-data-grid";
import json from "qs";
import EEGSelector from "./EEGSelector";
import EEGViewer from "./EEGViewer";
import ActigraphyEEGViewer from "./ActigraphyEEGViewer";
import ProceedButton from "../ui-components/ProceedButton";

class ActigraphyEDFViewer extends React.Component {
    constructor(props) {
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            file_names:[],
            initial_test_data:{
                cos_params: []
            },
            test_data: {
                status: '',
                report:""
            },
            selected_file_name: "",
            cos_to_return:[],
            stats_show:false,
            start_date: "None",
            end_date: "None",
            dates_without_time: [],
        };
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.fetchFileNames();
    }
    async fetchFileNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_all_files",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({file_names: res.data.files})
        });
    }

    async fetchDates(url, config) {
        const params = new URLSearchParams(window.location.search);

        API.get("return_dates_without_time",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dataset:this.state.selected_file_name
                    }}).then(res => {
            this.setState({dates_without_time: res.data.dates_without_time})
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})
        // Send the request
        API.get("save_csv_as_edf",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dataset: this.state.selected_file_name,
                        start_date: this.state.start_date,
                        end_date: this.state.end_date
                    },
                    // paramsSerializer : params => {
                    //     return qs.stringify(params, { arrayFormat: "repeat" })
                    // }
                }
        ).then(res => {
            // this.setState({test_data: res.data})
            // this.setState({stats_show: true})
        });
    }
    handleSelectFileNameChange(event){

        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchDates()
            // this.setState({stats_show: false})
        })
    }

    handleSelectStartDateChange(event){
        this.setState({start_date: event.target.value})
    }

    handleSelectEndDateChange(event){
        this.setState({end_date: event.target.value})
    }

    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        console.log(this.state.output_return_data);
        window.location.replace("/")
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Select CSV dataset to convert to EDF file
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>

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
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="startdate-label">Start Date</InputLabel>
                                <Select
                                        labelId="startdate-label"
                                        id="startdate-selector"
                                        value= {this.state.start_date}
                                        label="startdate"
                                        onChange={this.handleSelectStartDateChange}
                                >
                                    {this.state.dates_without_time.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
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
                                    {this.state.dates_without_time.map((column) => (
                                            <MenuItem value={column}>
                                                {column}
                                            </MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_file_name.length==0}
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        {/*<form onSubmit={this.handleProceed}>*/}
                        {/*    <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"*/}
                        {/*            disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>*/}
                        {/*        Proceed*/}
                        {/*    </Button>*/}
                        {/*</form>*/}
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            EEG Viewer
                        </Typography>
                        <ActigraphyEEGViewer></ActigraphyEEGViewer>
                        {/*<hr className="result"/>*/}
                        {/*<Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>*/}
                        {/*    {this.state.test_data['status']!=='Success' ? (*/}
                        {/*            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>*/}
                        {/*                Status :  { this.state.test_data['status']}</Typography>*/}
                        {/*    ) : (*/}
                        {/*            <div>*/}
                        {/*                <span className="horizontal-line" />*/}
                        {/*                <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>*/}
                        {/*                    Report*/}
                        {/*                </Typography>*/}
                        {/*                <div >*/}
                        {/*                    {this.state.test_data['report'].split('[[').map((item) =>*/}
                        {/*                            <div> <strong style={{fontSize:'16px'}}>{item.split(']]')[0]}</strong>*/}
                        {/*                    { item.substring(item.indexOf(']]')+2).split('\n').map((subitem)=>*/}
                        {/*                        <Typography size={"small"} sx={{padding:'5px', fontSize:'16px',}}>{subitem.replace('^]]','')}</Typography>)}*/}
                        {/*                </div>)}*/}
                        {/*                </div>*/}
                        {/*                <hr className="result"/>*/}
                        {/*                <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>*/}
                        {/*                    Row data*/}
                        {/*                </Typography>*/}
                        {/*                <img src={this.state.svg_path + "?random=" + new Date().getTime()}*/}
                        {/*                     srcSet={this.state.svg_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                        {/*                     loading="lazy"*/}
                        {/*                />*/}
                        {/*            </div>*/}
                        {/*            )}*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
        )
    }
}
export default ActigraphyEDFViewer;
