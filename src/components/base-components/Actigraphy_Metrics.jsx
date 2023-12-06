import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    Typography
} from "@mui/material";
import {DataGrid, GridValueFormatterParams} from "@mui/x-data-grid";
import json from "qs";
import Paper from "@mui/material/Paper";
import JsonTable from "ts-react-json-table";

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
            svg_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/pRA.svg',
            svg_path2 : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/pAR.svg',

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
                                        onChange={this.handleSelectNoPeriods}
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
                        <ProceedButton></ProceedButton>
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
                                        {this.state.selected_file_name}    Metrics
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
                                        <hr className="result"/>
                                        { this.state.test_data.Result.map((item) => {return (
                                                <Grid>
                                                    <Typography variant="h5" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        Total activity</Typography>
                                                    <Grid sx={{width:'95%'}}>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Total average daily activity (ADAT):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                               {Number.parseFloat(item.ADAT)}</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <div>
                                                                <p style={{padding:'10px'}}>Total average daily activity per period (ADATp):</p>
                                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}} direction="row">
                                                                    {item.ADATp.map((index, item2)=>{return(
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>Period {item2+1}</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell className="tableCell">{Number.parseFloat(index)}</TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    )})}
                                                                </TableContainer>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <hr className="result"/>
                                                    <Typography variant="h5" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        Non-parametric methods</Typography>
                                                    <Grid sx={{width:'95%'}}>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Interdaily stability (IS):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                            {Number.parseFloat(item.IS).toFixed(4)}</Typography></Grid>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Average interdaily stability (ISm):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                            {Number.parseFloat(item.ISm).toFixed(4)}</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <div>
                                                                <p style={{paddingLeft:'10px'}}>Interdaily stability per period:</p>
                                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}} direction="row">
                                                                    {item.ISp.map((index, item2)=>{return(
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>Period {item2+1}</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell className="tableCell">{Number.parseFloat(index).toFixed(4)}</TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    )})}
                                                                </TableContainer>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <hr/>
                                                    <Grid sx={{width:'95%'}}>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Intradaily variability (IV):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                                {Number.parseFloat(item.IV).toFixed(4)}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Average intradaily variability (IVm): </p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                                {Number.parseFloat(item.IVm).toFixed(4)}</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <div>
                                                                <p style={{paddingLeft:'10px'}}>Intradaily variability per period:</p>
                                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}} direction="row">
                                                                    {item.IVp.map((index, item2)=>{return(
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>Period {item2+1}</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell className="tableCell">{Number.parseFloat(index).toFixed(4)}</TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    )})}
                                                                </TableContainer>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <hr/>
                                                    <Grid sx={{width:'95%'}}>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Mean activity during the 5 least active hours of the day (L5):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                                {Number.parseFloat(item.L5).toFixed(4)}</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <div>
                                                                <p style={{paddingLeft:'10px'}}>L5 per period:</p>
                                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}} direction="row">
                                                                    {item.L5p.map((index, item2)=>{return(
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>Period {item2+1}</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell className="tableCell">{Number.parseFloat(index).toFixed(4)}</TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    )})}
                                                                </TableContainer>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <hr/>
                                                    <Grid sx={{width:'95%'}}>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Mean activity during the 10 most active hours of the day (M10):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                                {Number.parseFloat(item.M10).toFixed(4)}</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <div>
                                                                <p style={{paddingLeft:'10px'}}>M10 per period:</p>
                                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}} direction="row">
                                                                    {item.M10p.map((index, item2)=>{return(
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>Period {item2+1}</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell className="tableCell">{Number.parseFloat(index).toFixed(4)}</TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    )})}
                                                                </TableContainer>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <hr/>
                                                    <Grid sx={{width:'95%'}}>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Relative rest/activity amplitude (RA):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                               {Number.parseFloat(item.RA).toFixed(4)}</Typography>
                                                        </Grid>
                                                        <Grid>
                                                            <div>
                                                                <p style={{paddingLeft:'10px'}}>RA per period:</p>
                                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'90%'}} direction="row">
                                                                    {item.RAp.map((index, item2)=>{return(
                                                                        <Table>
                                                                            <TableHead>
                                                                                <TableRow>
                                                                                    <TableCell className="tableHeadCell" sx={{width:'10%'}}>Period {item2+1}</TableCell>
                                                                                </TableRow>
                                                                            </TableHead>
                                                                            <TableBody>
                                                                                <TableRow>
                                                                                    <TableCell className="tableCell">{Number.parseFloat(index).toFixed(4)}</TableCell>
                                                                                </TableRow>
                                                                            </TableBody>
                                                                        </Table>
                                                                    )})}
                                                                </TableContainer>
                                                            </div>
                                                        </Grid>
                                                    </Grid>
                                                    <hr className="result"/>
                                                    <Typography variant="h5" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                        Transition probabilities</Typography>
                                                    <Grid sx={{width:'95%'}}>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Rest->Activity transition probability (kRA):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                                {Number.parseFloat(item.kRA).toFixed(4)}</Typography>
                                                        </Grid>
                                                        <Grid container>
                                                            <p style={{paddingLeft:'10px'}}>Rest->Activity transition probability (kAR):</p>
                                                            <Typography variant="h6" color='black' sx={{ flexGrow: 1, textAlign: "Left", padding:'10px'}}>
                                                                {Number.parseFloat(item.kAR).toFixed(4)}</Typography>
                                                        </Grid>
                                                        <Grid container direction='rows'>
                                                            <div>
                                                                <p style={{paddingLeft:'10px'}}>Rest->Activity transition probability distribution (pRA):</p>
                                                                <JsonTable className="jsonResultsTable"
                                                                           rows = {JSON.parse(item.pRA)}/>
                                                            </div>
                                                            <div style={{padding:'20px', display: (this.state.stats_show ? 'block' : 'none')}}>
                                                                <img src={this.state.svg_path + "?random=" + new Date().getTime()}
                                                                     srcSet={this.state.svg_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                                     loading="lazy"
                                                                />
                                                            </div>
                                                            <div style={{paddingLeft:'50px'}}>
                                                                <p style={{paddingLeft:'10px'}}>Activity->Rest transition probability distribution (pAR):</p>
                                                                <JsonTable className="jsonResultsTable"
                                                                           rows = {JSON.parse(item.pAR)}/>
                                                            </div>
                                                            <div style={{padding:'20px', display: (this.state.stats_show ? 'block' : 'none')}}>
                                                                <img src={this.state.svg_path2 + "?random=" + new Date().getTime()}
                                                                     srcSet={this.state.svg_path2 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                                     loading="lazy"
                                                                />
                                                            </div>
                                                        </Grid>
                                                    </Grid>
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
