import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs,
    Typography
} from "@mui/material";
import {GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import JsonTable from "ts-react-json-table";
import Paper from "@mui/material/Paper";
import ProceedButton from "../../components/ui-components/ProceedButton";

// function CustomToolbar() {
//     return (
//             <GridToolbarContainer>
//                 <GridToolbarExport />
//             </GridToolbarContainer>
//     );
// }

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class PointBiserialCorrelation extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        let ip = "http://127.0.0.1:8000/"
        if (process.env.REACT_APP_BASEURL)
        {
            ip = process.env.REACT_APP_BASEURL
        }
        this.state = {
            // List of columns in dataset
            column_names: [],
            binary_columns: [],
            file_names:[],
            initialdataset:[],
            outputdataset:[],
            outliers_A:[],
            outliers_B:[],
            test_data: {
                status:'',
                sample_A: {
                    value: '',
                    N: '',
                    N_clean:  '',
                    outliers: [],
                    Norm_statistic: '',
                    Norm_p_value: '',
                    Hom_statistic: '',
                    Hom_p_value: '',
                },
                sample_B: {
                    value: '',
                    N: '',
                    N_clean:  '',
                    outliers: [],
                    Norm_statistic: '',
                    Norm_p_value: '',
                },
                correlation: '',
                p_value: '',
                new_dataset:[]
            },
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",
            selected_variable: "",
            selected_variable2: "",
            selected_file_name: "",
            stats_show: false,
            tabvalue:0,
            svg_Scatter_Two_Variables : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/Scatter_Two_Variables.svg',
            svg_BoxPlot : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/BoxPlot_1st.svg',
            svg_BoxPlot2 : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/BoxPlot_2nd.svg',
            svg_HistogramPlot_GroupA : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/HistogramPlot_GroupA.svg',
            svg_HistogramPlot_GroupB : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/HistogramPlot_GroupB.svg',
// remove_outliers: true
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleSelectColumnChange1 = this.handleSelectColumnChange1.bind(this);
        this.handleSelectColumnChange2 = this.handleSelectColumnChange2.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.fetchFileNames();
        this.fetchColumnNames();
        this.fetchBinaryColumnNames();
        this.handleTabChange = this.handleTabChange.bind(this);

    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
                    });
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
    async fetchDatasetContent() {
        const params = new URLSearchParams(window.location.search);
        API.get("return_dataset",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue:0})
        });
    }
    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("compute_point_biserial_correlation",
                {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                        variable_binary: this.state.selected_variable,
                        variable: this.state.selected_variable2,
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({outputdataset: JSON.parse(res.data.new_dataset)})
            this.setState({outliers_A: JSON.parse(res.data.sample_A.outliers)})
            this.setState({outliers_B: JSON.parse(res.data.sample_B.outliers)})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
        });
    }

    async fetchBinaryColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_binary_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({binary_columns: res.data.columns})
        });
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
        API.get("/task/complete", {
            params: {
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
            }

    }).then(res => {
            window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
        });
    }
    /**
     * Update state when selection changes in the form
     */
    handleSelectColumnChange1(event){
        this.setState( {selected_column: event.target.value})
        this.setState( {selected_variable: event.target.value})
    }
    handleSelectColumnChange2(event){
        this.setState( {selected_column2: event.target.value})
        this.setState( {selected_variable2: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.fetchBinaryColumnNames()
            this.state.selected_variable=""
            this.state.selected_variable2=""
            this.setState({stats_show: false})

        })
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Point Biserial Correlation
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
                                            <MenuItem key={column} value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select dataset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Dichotomous</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_column}
                                        label="Column"
                                        onChange={this.handleSelectColumnChange1}
                                >
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Dichotomous for correlation</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column2-selector-label">Variable</InputLabel>
                                <Select
                                        labelId="column2-selector-label"
                                        id="column2-selector"
                                        value= {this.state.selected_column2}
                                        label="Second column"
                                        onChange={this.handleSelectColumnChange2}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Second column for correlation</FormHelperText>
                            </FormControl>
                            {/*<FormControlLabel sx={{m: 1, minWidth: 120}}*/}
                            {/*        control={*/}
                            {/*    <Checkbox*/}
                            {/*            checked={this.state.remove_outliers}*/}
                            {/*            onChange={this.handleOutliersRemovalChange}*/}
                            {/*            inputProps={{ 'aria-label': 'controlled' }}*/}
                            {/*    />} label="Remove Outliers" />*/}
                            <hr/>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_variable && !this.state.selected_variable2}>
                                {/*|| !this.state.selected_method*/}
                                Run Analysis
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <Grid>
                            Dichotomous variable =
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_variable}
                                    onClick={this.handleListDelete}>
                                {this.state.selected_variable}
                            </Button>
                        </Grid>
                        <Grid>
                            Variable =
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_variable2}
                                    onClick={this.handleListDelete}>
                                {this.state.selected_variable2}
                            </Button>
                        </Grid>
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    <Tab label="New Dataset" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                {this.state.test_data['status']!=='Success' ? (
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                ) : (
                                        <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                            <Grid container direction="row">
                                                <Grid item xs={7} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>Point biserial correlation</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>p-value</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.correlation).toFixed(6)}</TableCell>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.p_value).toFixed(6)}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                                <Grid item xs={5} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                        <img src={this.state.svg_Scatter_Two_Variables + "?random=" + new Date().getTime()}
                                                             srcSet={this.state.svg_Scatter_Two_Variables + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                        />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <hr className="result"/>
                                            <Grid container direction="row">
                                                <Grid item xs={7} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography>
                                                        Outliers of the selected variable for each category of the dichotomous variable
                                                    </Typography>
                                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>Dichotomous value</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>Size</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>Size (without outliers)</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_A.value}</TableCell>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_A.N}</TableCell>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_A.N_clean}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_B.value}</TableCell>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_B.N}</TableCell>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_B.N_clean}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    {/*{this.state.outliers_A.map((item, index) => {*/}
                                                    {/*        return (*/}
                                                    {/*                <TableRow>*/}
                                                    {/*                    <TableCell className="tableCell">{index}</TableCell>*/}
                                                    {/*                    <TableCell className="tableCell">{item}</TableCell>*/}
                                                    {/*                </TableRow>*/}
                                                    {/*        )*/}
                                                    {/*    })}*/}
                                                    {/*<Typography>{this.state.outliers_A}</Typography>*/}
                                                </Grid>
                                                <Grid item xs={5} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center"}}>
                                                        Box plot for each category of the dichotomous
                                                    </Typography>
                                                    <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                        <img src={this.state.svg_BoxPlot + "?random=" + new Date().getTime()}
                                                             srcSet={this.state.svg_BoxPlot + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                        />
                                                        <img src={this.state.svg_BoxPlot2 + "?random=" + new Date().getTime()}
                                                             srcSet={this.state.svg_BoxPlot2 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                        />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <hr className="result"/>
                                            <Grid container direction="row">
                                                <Grid item xs={7} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography>
                                                        Normally distribution test for each category of the dichotomous variable
                                                    </Typography>
                                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>Dichotomous value</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>Normality test (Shapiro-Wilk) statistic</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>Normality test (Shapiro-Wilk) p-value</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_A.value}</TableCell>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.sample_A.Norm_statistic).toFixed(6)}</TableCell>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.sample_A.Norm_p_value).toFixed(6)}</TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell className="tableCell">{this.state.test_data.sample_B.value}</TableCell>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.sample_B.Norm_statistic).toFixed(6)}</TableCell>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.sample_B.Norm_p_value).toFixed(6)}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                </Grid>
                                                <Grid item xs={5} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center"}}>
                                                        Histogram of category {this.state.test_data.sample_A.value} of the dichotomous
                                                    </Typography>
                                                    <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                        <img src={this.state.svg_HistogramPlot_GroupA + "?random=" + new Date().getTime()}
                                                             srcSet={this.state.svg_HistogramPlot_GroupA + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                        />
                                                    </div>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center"}}>
                                                        Histogram of category {this.state.test_data.sample_B.value} of the dichotomous
                                                    </Typography>
                                                    <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                        <img src={this.state.svg_HistogramPlot_GroupB + "?random=" + new Date().getTime()}
                                                             srcSet={this.state.svg_HistogramPlot_GroupB + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                                             loading="lazy"
                                                        />
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <hr className="result"/>
                                            <Grid container direction="row">
                                                <Grid item xs={7} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}} direction="row">
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}> Equal variances test (Levene) statistic</TableCell>
                                                                    <TableCell className="tableHeadCell" sx={{width:'20%'}}>p-value</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.sample_A.Hom_statistic).toFixed(6)}</TableCell>
                                                                    <TableCell className="tableCell">{Number.parseFloat(this.state.test_data.sample_A.Hom_p_value).toFixed(6)}</TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    {/*<p>{this.state.test_data.sample_A.Hom_statistic}</p>*/}
                                                    {/*<p>{this.state.test_data.sample_A.Hom_p_value}</p>*/}
                                                </Grid>

                                            </Grid>
                                        </Grid>
                                )}
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.outputdataset}/>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default PointBiserialCorrelation;
