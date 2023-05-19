import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Table, TableCell, TableContainer, TableHead, TableRow, TextField,
    Typography
} from "@mui/material";
import {DataGrid, GridValueFormatterParams} from "@mui/x-data-grid";
import json from "qs";
import Paper from "@mui/material/Paper";

class Actigraphy_Metrics extends React.Component {
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
            test_data: {
                status: '',
                Result:[]
            },
            selected_file_name: "",
            selected_number_of_offsets: 1,
            selected_number_of_periods: 1,
            selected_binarize: true,
            selected_period_offset:'Day',
            selected_threshold:4,
            // selected_metric:'Is',
            selected_freq_offset: 'Hour',
            stats_show:false,
        };
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleSelectNoOffsets = this.handleSelectNoOffsets.bind(this);
        this.handleSelectNoPeriods = this.handleSelectNoPeriods.bind(this);
        this.handleSelectThreshold = this.handleSelectThreshold.bind(this);
        this.handleSelectBinarize = this.handleSelectBinarize.bind(this);
        this.handleSelectPeriodOffset = this.handleSelectPeriodOffset.bind(this);
        this.handleSelectFreqOffset = this.handleSelectFreqOffset.bind(this);
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

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})
        // Send the request
        API.get("actigraphy_metrics",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        number_of_offsets: this.state.selected_number_of_offsets,
                        number_of_periods: this.state.selected_number_of_periods,
                        binarize: this.state.selected_binarize,
                        period_offset: this.state.selected_period_offset,
                        threshold: this.state.selected_threshold,
                        // metric: this.state.selected_metric,
                        freq_offset: this.state.selected_freq_offset,
                        file: this.state.selected_file_name},
                    // paramsSerializer : params => {
                    //     return qs.stringify(params, { arrayFormat: "repeat" })
                    // }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
        });
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            // this.setState({stats_show: false})
        })
    }
    handleSelectNoOffsets(event){
        this.setState( {selected_number_of_offsets: event.target.value})
    }
    handleSelectNoPeriods(event){
        this.setState( {selected_number_of_periods: event.target.value})
    }
    handleSelectBinarize(event){
        this.setState( {selected_binarize: event.target.value})
    }
    handleSelectThreshold(event){
        this.setState( {selected_threshold: event.target.value})
    }
    handleSelectPeriodOffset(event){
        this.setState( {selected_period_offset: event.target.value})
    }
    handleSelectFreqOffset(event){
        this.setState( {selected_freq_offset: event.target.value})
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
                            Select Variables
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
                                <InputLabel id="freq_offset-label">Frequency</InputLabel>
                                <Select
                                        labelId="freq_offset-label"
                                        id="freq_offset"
                                        value= {this.state.selected_freq_offset}
                                        label="Frequency"
                                        onChange={this.handleSelectFreqOffset}
                                >
                                    <MenuItem value={"Hour"}><em>Hour</em></MenuItem>
                                    <MenuItem value={"Minute"}><em>Minute</em></MenuItem>
                                    <MenuItem value={"Second"}><em>Second</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Frequency offset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="number_of_offsets-selector-label"
                                        id="number_of_offsets-selector"
                                        value= {this.state.selected_number_of_offsets}
                                        inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                        label="Frequency offsets"
                                        onChange={this.handleSelectNoOffsets}
                                />
                                <FormHelperText>Number of frequency offsets.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="period_offset-label">Period</InputLabel>
                                <Select
                                        labelId="period_offset-label"
                                        id="period_offset"
                                        value= {this.state.selected_period_offset}
                                        label="Period"
                                        onChange={this.handleSelectPeriodOffset}
                                >
                                    <MenuItem value={"Day"}><em>Day</em></MenuItem>
                                    <MenuItem value={"Week"}><em>Week</em></MenuItem>
                                    <MenuItem value={"Month"}><em>Month</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Period.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="number_of_periods-selector-label"
                                        id="number_of_periods-selector"
                                        value= {this.state.selected_number_of_periods}
                                        inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                        label="Period offsets"
                                        onChange={this.handleSelectComponentsChange}
                                />
                                <FormHelperText>Number of Period offsets.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="Binarize-label">Binarize</InputLabel>
                                <Select
                                        labelId="Binarize-label"
                                        id="Binarize-selector"
                                        value= {this.state.selected_binarize}
                                        label="Binarize"
                                        onChange={this.handleSelectBinarize}
                                >
                                    <MenuItem value={"true"}><em>True</em></MenuItem>
                                    <MenuItem value={"false"}><em>False</em></MenuItem>
                                </Select>
                                <FormHelperText>Select Frequency offset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="Threshold-selector-label"
                                        id="Threshold-selector"
                                        value= {this.state.selected_threshold}
                                        inputProps={{ inputmode: 'numeric', pattern: '[0-9]*' }}
                                        label="Threshold"
                                        onChange={this.handleSelectThreshold}
                                />
                                <FormHelperText>Threshold.</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_file_name.length==0}
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>
                                Proceed
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>

                        <hr className="result"/>
                        <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                            {this.state.test_data['status']!=='Success' ? (
                                    <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                        Status :  { this.state.test_data['status']}</Typography>
                            ) : (
                                <div>
                                    <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                        {this.state.selected_file_name}   + Metrics
                                    </Typography>
                                    <Grid container direction="row" style={{ display: (this.state.stats_show ? 'block' : 'none') }}>
                                        <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{alignContent:"right"}}>
                                                        <TableCell className="tableHeadCell" sx={{width:'20%'}}>Subject’s name</TableCell>
                                                        <TableCell className="tableHeadCell" sx={{width:'20%'}}>Start time of the data acquisition</TableCell>
                                                        <TableCell className="tableHeadCell" sx={{width:'20%'}}>Duration of the data acquisition</TableCell>
                                                        <TableCell className="tableHeadCell" sx={{width:'20%'}}>Serial number of the device</TableCell>
                                                        <TableCell className="tableHeadCell" sx={{width:'20%'}}>Acquisition frequency</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                { this.state.test_data.Result.map((item) => {
                                                    return (
                                                            <TableRow>
                                                                <TableCell className="tableCell">{item.Name}</TableCell>
                                                                <TableCell className="tableCell">{item.Start_time}</TableCell>
                                                                <TableCell className="tableCell">{item.Duration}</TableCell>
                                                                <TableCell className="tableCell">{item.Serial}</TableCell>
                                                                <TableCell className="tableCell">{item.frequency}</TableCell>
                                                            </TableRow>
                                                    );
                                                })}
                                            </Table>
                                        </TableContainer>
                                        { this.state.test_data.Result.map((item) => {return (
                                                <Grid>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        IS:   {item.IS}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        ISm:   {item.ISm}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        IV:   {item.IV}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        IVm:   {item.IVm}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        L5:   {item.L5}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        M10:   {item.M10}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        RA:   {item.RA}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        ADAT:   {item.ADAT}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        kRA:   {item.kRA}</Typography>
                                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        kAR:   {item.kAR}</Typography>
                                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}></TableCell>*/}
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>IS</TableCell>*/}
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>ISm</TableCell>*/}
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>ISp</TableCell>
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>IV</TableCell>*/}
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>IVm</TableCell>*/}
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>IVp</TableCell>
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>L5</TableCell>*/}
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>L5p</TableCell>
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>M10</TableCell>*/}
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>M10p</TableCell>
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>RA</TableCell>*/}
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>RAp</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>pRA</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>pAR</TableCell>
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>ADAT</TableCell>*/}
                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>ADATp</TableCell>
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>kRA</TableCell>*/}
                                                                    {/*<TableCell className="tableHeadCell" sx={{width:'10%'}}>kAR</TableCell>*/}
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableRow>
                                                                {/*<TableCell className="tableCell">{item.id}</TableCell>*/}
                                                                {/*<TableCell className="tableCell">{item.IS}</TableCell>*/}
                                                                {/*<TableCell className="tableCell">{item.ISm}</TableCell>*/}
                                                                <TableCell className="tableCell">{item.ISp.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                {/*<TableCell className="tableCell">{item.IV}</TableCell>*/}
                                                                {/*<TableCell className="tableCell">{item.IVm}</TableCell>*/}
                                                                <TableCell className="tableCell">{item.IVp.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                {/*<TableCell className="tableCell">{item.L5}</TableCell>*/}
                                                                <TableCell className="tableCell">{item.L5p.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                {/*<TableCell className="tableCell">{item.M10}</TableCell>*/}
                                                                <TableCell className="tableCell">{item.M10p.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                {/*<TableCell className="tableCell">{item.RA}</TableCell>*/}
                                                                <TableCell className="tableCell">{item.RAp.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                <TableCell className="tableCell">{item.pRA.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                <TableCell className="tableCell">{item.pAR.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                {/*<TableCell className="tableCell">{item.ADAT}</TableCell>*/}
                                                                <TableCell className="tableCell">{item.ADATp.map((item2)=>{return <pre>{item2}</pre>})}</TableCell>
                                                                {/*<TableCell className="tableCell">{item.kRA}</TableCell>*/}
                                                                {/*<TableCell className="tableCell">{item.kAR}</TableCell>*/}
                                                            </TableRow>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                        )})}
                                    </Grid>
                                </div>
                                    )}
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}
export default Actigraphy_Metrics;
