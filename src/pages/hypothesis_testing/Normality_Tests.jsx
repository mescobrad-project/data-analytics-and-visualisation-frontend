import React, { Component } from 'react';
import API from "../../axiosInstance";
import "./normality_tests.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    Tabs, Tab
} from "@mui/material";
import InnerHTML from "dangerously-set-html-content";
import Paper from "@mui/material/Paper";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import JsonTable from "ts-react-json-table";

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

class Normality_Tests extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        const empty_state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                status:'',
                statistic: 0,
                critical_values:[],
                significance_level:[],
                p_value: 0,
                Description:[],
                data:[],
                results: {
                    plot_column:"",
                    skew: "",
                    kurtosis: "",
                    standard_deviation: "",
                    median:"",
                    mean:"",
                    sample_N:"",
                    top_5:[],
                    last_5:[]
                }
            },
            test_chart_data : [],
            test_boxplot_chart_data: [],
            test_qqplot_chart_data : [],
            test_probplot_chart_data : [],
            test_Hplot_chart_data: [],
            alpha:"",
            //Values selected currently on the form
            selected_column: "",
            selected_variable: "",
            selected_file_name: "",
            selected_method: "Shapiro-Wilk",
            selected_alternative: "two-sided",
            selected_nan_policy:"propagate",
            selected_axis:"0",
            alternative_show:false,
            nan_policy_show:false,
            axis_show:false,
            histogram_chart_show: false,
            boxplot_chart_show: false,
            qqplot_chart_show: false,
            probplot_chart_show: false,
            stats_show:false,
            output_return_data:''
        };
        this.state = empty_state
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
        this.handleSelectNaNpolicyChange = this.handleSelectNaNpolicyChange.bind(this);
        this.handleSelectAxisChange = this.handleSelectAxisChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.fetchFileNames();
        this.fetchColumnNames();
    }

    /**
     * Call backend endpoint to get column names
     */

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
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
            this.setState({tabvalue:1})
        });
    }
    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({histogram_chart_show: false})
        this.setState({boxplot_chart_show: false})
        this.setState({qqplot_chart_show: false})
        this.setState({probplot_chart_show: false})
        this.setState({stats_show: false})
        // Send the request
        API.get("normality_tests",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        column: this.state.selected_variable,
                        name_test: this.state.selected_method,
                        alternative: this.state.selected_alternative,
                        nan_policy: this.state.selected_nan_policy, axis: this.state.selected_axis}
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState( {alpha:0.05})

            const resultJson = res.data;
            this.setState({tabvalue:0})
            this.setState({histogram_chart_show: true})
            this.setState({boxplot_chart_show: true})
            this.setState({qqplot_chart_show: true})
            this.setState({probplot_chart_show: true})
            this.setState({stats_show: true})

            this.setState({test_qqplot_chart_data: resultJson['results']['qqplot']})
            this.setState({test_Hplot_chart_data: resultJson['results']['histogramplot']})
            this.setState({test_boxplot_chart_data: resultJson['results']['boxplot']})
            this.setState({test_probplot_chart_data: resultJson['results']['probplot']})

            // We changed info file uploading process to the DataLake
            // const output_info = {
            //     date_created: new Date().toLocaleString(),
            //     workflow_id: params.get("run_id"),
            //     run_id: params.get("run_id"),
            //     step_id: params.get("step_id"),
            //     test_name: 'Normality test',
            //     test_params: {
            //         selected_method: this.state.selected_method,
            //         selected_variable: this.state.selected_column,
            //         selected_alternative: this.state.selected_alternative,
            //         selected_nan_policy: this.state.selected_nan_policy
            //     },
            //     test_results: {
            //         statistic: res.data.statistic,
            //         critical_values: res.data.critical_values,
            //         significance_level: res.data.significance_level,
            //         p_value: res.data.p_value,
            //         skew: res.data.results.skew,
            //         kurtosis: res.data.results.kurtosis,
            //         standard_deviation: res.data.results.standard_deviation,
            //         median: res.data.results.median,
            //         mean: res.data.results.mean,
            //         sample_N: res.data.results.sample_N,
            //         top_5: res.data.results.top_5,
            //         last_5: res.data.results.last_5,
            //         Description: res.data.results.description,
            //     },
            //     selected_dataset:{
            //         bucket:"demo",
            //         object: "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1_output.csv"
            //     },
            //     output_dataset:{
            //         bucket:"",
            //         object:""
            //     }
            // };
            // localStorage.setItem('MY_APP_STATE', JSON.stringify(output_info));
            // alert('Params to output: ' + JSON.stringify(output_info));
        });
    }

    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        // We changed info file uploading process to the DataLake
        // const file_to_output= window.localStorage.getItem('MY_APP_STATE');
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

    resetResultArea(){
        this.setState({histogram_chart_show: false})
        this.setState({boxplot_chart_show: false})
        this.setState({qqplot_chart_show: false})
        this.setState({probplot_chart_show: false})
        this.setState({stats_show: false})
    }
    handleSelectColumnChange(event){
        this.setState( {selected_column: event.target.value})
        this.setState( {selected_variable: this.state.selected_file_name+"--"+event.target.value})
        this.resetResultArea()
    }
    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
        this.resetResultArea()
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
        this.resetResultArea()
        if (event.target.value==="Kolmogorov-Smirnov"){
            this.setState({alternative_show: true});
            this.setState({axis_show: false});
            this.setState({nan_policy_show: false})}
        else if (event.target.value==="D’Agostino’s K^2"){
            this.setState({alternative_show: false});
            this.setState({axis_show: true});
            this.setState({nan_policy_show: true})}
        else {this.setState({alternative_show: false});
            this.setState({axis_show: false});
            this.setState({nan_policy_show: false})}
    }
    handleSelectNaNpolicyChange(event){
        this.setState( {selected_nan_policy: event.target.value})
        this.resetResultArea()
    }
    handleSelectAxisChange(event){
        this.setState( {selected_axis: event.target.value})
        this.resetResultArea()
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
        })
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Select Normality Test
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
                                <InputLabel id="column-selector-label">Column</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_column}
                                        label="Column"
                                        onChange={this.handleSelectColumnChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Column for Normality test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="method-selector-label">Test</InputLabel>
                                <Select
                                        labelId="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"Shapiro-Wilk"}><em>Shapiro-Wilk</em></MenuItem>
                                    <MenuItem value={"Kolmogorov-Smirnov"}><em>Kolmogorov-Smirnov</em></MenuItem>
                                    <MenuItem value={"Jarque-Bera"}><em>Jarque-Bera</em></MenuItem>
                                    <MenuItem value={"D’Agostino’s K^2"}><em>D’Agostino’s K^2</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}
                                         style={{ display: (this.state.nan_policy_show ? 'block' : 'none') }}>
                                <InputLabel id="nanpolicy-selector-label">Nan policy</InputLabel>
                                <Select
                                        labelid="nanpolicy-selector-label"
                                        id="nanpolicy-selector"
                                        value= {this.state.selected_nan_policy}
                                        label="Nan_policy"
                                        onChange={this.handleSelectNaNpolicyChange}
                                >
                                    <MenuItem value={"propagate"}><em>propagate</em></MenuItem>
                                    <MenuItem value={"raise"}><em>raise</em></MenuItem>
                                    <MenuItem value={"omit"}><em>omit</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines how to handle when input contains NaNs.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}
                                         style={{ display: (this.state.alternative_show ? 'block' : 'none') }}>
                                <InputLabel id="alternative-selector-label">Alternative</InputLabel>
                                <Select
                                        labelid="alternative-selector-label"
                                        id="alternative-selector"
                                        value= {this.state.selected_alternative}
                                        label="Alternative parameter"
                                        onChange={this.handleSelectAlternativeChange}
                                >
                                    <MenuItem value={"two-sided"}><em>two-sided</em></MenuItem>
                                    <MenuItem value={"less"}><em>less</em></MenuItem>
                                    <MenuItem value={"greater"}><em>greater</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines the alternative hypothesis. </FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}
                                         style={{ display: (this.state.axis_show ? 'block' : 'none') }}>
                                <TextField
                                        labelid="axis-selector-label"
                                        id="axis-selector"
                                        value= {this.state.selected_axis}
                                        label="axis parameter"
                                        onChange={this.handleSelectAxisChange}
                                />
                                <FormHelperText>Axis along which to compute test.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_column}>
                                {/*|| !this.state.selected_method*/}
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
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr class="result"/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    {/*<Tab label="Transformed" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                {this.state.test_data['status']!=='Success' ? (
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                ) : (
                                        <Grid>
                                            <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", padding:"15px"}}>
                                                    Sample characteristics
                                                </Typography>
                                                <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell className="tableHeadCell">Name</TableCell>
                                                                <TableCell className="tableHeadCell">N</TableCell>
                                                                <TableCell className="tableHeadCell">Mean</TableCell>
                                                                <TableCell className="tableHeadCell">Median</TableCell>
                                                                <TableCell className="tableHeadCell">Std. Deviation</TableCell>
                                                                <TableCell className="tableHeadCell">Skewness</TableCell>
                                                                <TableCell className="tableHeadCell">Kurtosis</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell className="tableCell" >{this.state.test_data.results.plot_column}</TableCell>
                                                                <TableCell className="tableCell">{this.state.test_data.results.sample_N}</TableCell>
                                                                <TableCell className="tableCell">{ Number.parseFloat(this.state.test_data.results.mean).toFixed(5)}</TableCell>
                                                                <TableCell className="tableCell">{ Number.parseFloat(this.state.test_data.results.median).toFixed(5)}</TableCell>
                                                                <TableCell className="tableCell">{ Number.parseFloat(this.state.test_data.results.standard_deviation).toFixed(5)}</TableCell>
                                                                <TableCell className="tableCell">{ Number.parseFloat(this.state.test_data.results.skew).toFixed(5)}</TableCell>
                                                                <TableCell className="tableCell">{ Number.parseFloat(this.state.test_data.results.kurtosis).toFixed(5)}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </div>
                                            <hr class="result" style={{display: (this.state.stats_show ? 'block' : 'none') }}/>
                                            <div style={{display: (this.state.stats_show ? 'block' : 'none') }}>
                                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", padding:"15px"}}>
                                                    Extreme Values
                                                </Typography>
                                                <TableContainer component={Paper} className="ExtremeValues" sx={{width:'80%'}}>
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell className="tableHeadCell" sx={{width:'40%'}}></TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'20%'}}></TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'20%'}}></TableCell>
                                                                <TableCell className="tableHeadCell" sx={{width:'20%'}}>Value</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        {this.state.test_data.results.top_5.map((item, index) => {
                                                            if (index === 0) {
                                                                return (
                                                                        <TableRow>
                                                                            <TableCell className="tableCell">{this.state.test_data.results.plot_column}</TableCell>
                                                                            <TableCell className="tableCell">Highest</TableCell>
                                                                            <TableCell className="tableCell">{index + 1}</TableCell>
                                                                            <TableCell className="tableCell">{item}</TableCell>
                                                                        </TableRow>
                                                                )
                                                            } else {
                                                                return (
                                                                        <TableRow>
                                                                            <TableCell className="tableCell"></TableCell>
                                                                            <TableCell className="tableCell"></TableCell>
                                                                            <TableCell className="tableCell">{index + 1}</TableCell>
                                                                            <TableCell className="tableCell">{item}</TableCell>
                                                                        </TableRow>
                                                            )}
                                                        })}
                                                        {this.state.test_data.results.last_5.reverse().map((item, index) => {
                                                            if (index === 0) {
                                                                return (
                                                                        <TableRow>
                                                                            <TableCell className="tableCell">{this.state.test_data.results.plot_column}</TableCell>
                                                                            <TableCell className="tableCell2">Lowest</TableCell>
                                                                            <TableCell className="tableCell2">{index + 1}</TableCell>
                                                                            <TableCell className="tableCell2">{item}</TableCell>
                                                                        </TableRow>
                                                                )
                                                            } else {
                                                                return (
                                                                        <TableRow>
                                                                            <TableCell className="tableCell"></TableCell>
                                                                            <TableCell className="tableCell"></TableCell>
                                                                            <TableCell className="tableCell">{index + 1}</TableCell>
                                                                            <TableCell className="tableCell">{item}</TableCell>
                                                                        </TableRow>
                                                                )}
                                                        })}

                                                    </Table>
                                                </TableContainer>
                                            </div>
                                            <hr class="result" style={{display: (this.state.stats_show ? 'block' : 'none') }}/>
                                            <div style={{display: (this.state.stats_show ? 'block' : 'none') }}>
                                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", padding:"15px"}}>
                                                    Test of Normality
                                                </Typography>
                                                <TableContainer component={Paper} className="SampleCharacteristics" sx={{width:'80%'}}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className="tableHeadCell">Sample Name</TableCell>
                                                            <TableCell className="tableHeadCell">Statistic</TableCell>
                                                            <TableCell className="tableHeadCell">df</TableCell>
                                                            <TableCell className="tableHeadCell">Compared to significance level</TableCell>
                                                            <TableCell className="tableHeadCell">Significance</TableCell>
                                                            <TableCell className="tableHeadCell">Description</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell className="tableCell" >{this.state.test_data.results.plot_column}</TableCell>
                                                            <TableCell className="tableCell" >{Number.parseFloat(this.state.test_data.statistic).toFixed(5)}</TableCell>
                                                            <TableCell className="tableCell" >{ this.state.test_data.results.sample_N - 1}</TableCell>
                                                            <TableCell className="tableCell" >{ Number.parseFloat(this.state.alpha).toFixed(5)}</TableCell>
                                                            <TableCell className="tableCell" >{ Number.parseFloat(this.state.test_data.p_value).toFixed(5)}</TableCell>
                                                            <TableCell className="tableCell"  style={{ color: (this.state.test_data.Description==="Sample looks Gaussian (fail to reject H0)" ? 'Red' : 'Green') }}>{this.state.test_data.Description}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                                </TableContainer>
                                            </div>
                                            <hr class="result" style={{ display: (this.state.stats_show ? 'block' : 'none')}}/>
                                            <Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.histogram_chart_show ? 'block' : 'none')  }}>
                                                        Histogram of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.histogram_chart_show ? 'block' : 'none') }}>
                                                        <InnerHTML html={this.state.test_Hplot_chart_data} style={{zoom:'50%'}}/>
                                                        {/*<HistogramChartCustom chart_id="histogram_chart_id" chart_data={ this.state.test_chart_data}/>*/}
                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.histogram_chart_show ? 'block' : 'none') }}/>
                                                </Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.boxplot_chart_show ? 'block' : 'none')  }}>
                                                        Box Plot of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.boxplot_chart_show ? 'block' : 'none') }}>
                                                        <InnerHTML html={this.state.test_boxplot_chart_data} style={{zoom:'50%'}}/>
                                                        {/*<ClusteredBoxPlot chart_id="boxplot_chart_id" chart_data={ this.state.test_boxplot_chart_data}/>*/}
                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.boxplot_chart_show ? 'block' : 'none') }}/>
                                                </Grid>
                                            </Grid>
                                            <Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.qqplot_chart_show ? 'block' : 'none')  }}>
                                                        Q-Q Plot of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.qqplot_chart_show ? 'block' : 'none') }} >
                                                        <InnerHTML html={this.state.test_qqplot_chart_data} style={{zoom:'50%'}}/>

                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.qqplot_chart_show ? 'block' : 'none') }}/>
                                                </Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.qqplot_chart_show ? 'block' : 'none')  }}>
                                                        Probability Plot of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.probplot_chart_show ? 'block' : 'none') }} >
                                                        <InnerHTML html={this.state.test_probplot_chart_data} style={{zoom:'50%'}}/>

                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.probplot_chart_show ? 'block' : 'none') }}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        )}
                                <hr className="result" style={{display: (this.state.stats_show ? 'block' : 'none')}}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.initialdataset}/>
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}
export default Normality_Tests;

{/*<Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>*/}
{/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>*/}
{/*        Dataset  Preview*/}
{/*    </Typography>*/}
{/*    <hr/>*/}
{/*    <List>*/}
{/*        {this.state.column_names.map((column) => (*/}
{/*                <ListItem> <ListItemText primary={column}/></ListItem>*/}
{/*        ))}*/}
{/*    </List>*/}
{/*</Grid>*/}


//region functionality for AmCharts
// var maxCols = 10;
// function getHistogramData(source) {
//     // Init
//     var data = [];
//     var min = Math.min.apply(null, source);
//     var max = Math.max.apply(null, source);
//     var range = max - min;
//     var step = range / maxCols;
//     // console.log(min, max, range, step, source)
//     // Create items
//     for(var i = 0; i < maxCols; i++) {
//         var from = min + i * step;
//         var to = min + (i + 1) * step;
//         data.push({
//             from: from,
//             to: to,
//             count: 0
//         });
//     }
//     // Calculate range of the values
//     for(var i = 0; i < source.length; i++) {
//         var value = source[i];
//         var item = data.find(function(el) {
//             return (value >= el.from) && (value <= el.to);
//         });
//         item.count++;
//     }
//     return data;
// }
// let temp_array_chart = getHistogramData(resultJson['data'])
// let temp_array_histograme = []
// if (temp_array_chart.length) {
//     for (let it = 0; it < temp_array_chart.length; it++) {
//         let temp_object = {}
//         temp_object["category"] = [it]
//         temp_object["yValue"] = temp_array_chart[it]['count']
//         temp_array_histograme.push(temp_object)
//     }
//     this.setState({test_chart_data: temp_array_histograme})
// }
// const temp_boxplot_array_chart = resultJson['boxplot_data']
// // const arr = []
// // Object.keys(temp_boxplot_array_chart).forEach(key => arr.push({name: key, value: temp_boxplot_array_chart[key]}))
// let temp_array_boxplot = []
// if (temp_boxplot_array_chart.length){
//     for (let it = 0; it < temp_boxplot_array_chart.length; it++) {
//         let temp_object = {}
//         temp_object["date"] = temp_boxplot_array_chart[it]['date']
//         temp_object["min"] = temp_boxplot_array_chart[it]['min']
//         temp_object["q1"] = temp_boxplot_array_chart[it]['q1']
//         temp_object["q2"] = temp_boxplot_array_chart[it]['q2']
//         temp_object["q3"] = temp_boxplot_array_chart[it]['q3']
//         temp_object["max"] = temp_boxplot_array_chart[it]['max']
//         // temp_object["name"] = temp_boxplot_array_chart[it]['name']
//         temp_array_boxplot.push(temp_object)
//     }
// }
// // this.setState({test_boxplot_chart_data: temp_array_boxplot})
//endregion
