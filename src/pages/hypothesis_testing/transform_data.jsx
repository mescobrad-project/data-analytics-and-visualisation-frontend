import React from 'react';
import API from "../../axiosInstance";
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
class Transform_data extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                status:'',
                statistic: 0,
                min_confidence:"",
                max_confidence:"",
                lamda_value:"",
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
            // Values to pass to visualisations
            test_boxplot_chart_data: [],
            test_qqplot_chart_data : [],
            test_probplot_chart_data : [],
            test_Hplot_chart_data: [],
            test_transf_plot_chart_data: [],
            //Values selected currently on the form
            selected_column: "",
            selected_variable: "",
            selected_file_name: "",
            selected_method: "Box-Cox",
            selected_lmbda: "",
            selected_alpha: "",
            // Visualisation Hide/Show values
            lmbda_show:true,
            alpha_show:true,
            stats_show:false
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange = this.handleSelectColumnChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectLmbdaChange = this.handleSelectLmbdaChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.renderArrayValues = this.renderArrayValues.bind(this)
        this.fetchColumnNames();
        this.fetchFileNames();
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
     * Get result values
     */
    renderArrayValues = (List_to_render) => {
        let temp_list = []
        if (!List_to_render) {List_to_render=temp_list}
        return(
                List_to_render.map( (item, index) => {
                    return(
                            <p key={index} className="mr-1 text-default">{index+1}: {item}</p>
                    )
                })
        )
    }

    /**
     * Process and send the request for auto correlation and handle the response
     */
    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        let to_send_input_lmbda = null;
        let to_send_input_alpha = null;

        if (!!this.state.selected_lmbda){
            to_send_input_lmbda = parseFloat(this.state.selected_lmbda)
        }
        if (!!this.state.selected_alpha){
            to_send_input_alpha = parseFloat(this.state.selected_alpha)
        }

        //Reset view of optional visualisations preview
        this.setState({transformation_chart_show: false})

        // Send the request
        API.get("transform_data",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        column: this.state.selected_variable,
                        name_transform: this.state.selected_method,
                        lmbd: to_send_input_lmbda,
                        alpha: to_send_input_alpha}
                }
        ).then(res => {
            this.setState({test_data: res.data})
            const resultJson = res.data;
            this.setState({tabvalue:0})
            // console.log(resultJson)
            // console.log('Test')
            // let temp_array = []
            // let temp_array_chart = []
            // for ( let it =0 ; it < resultJson['Box-Cox power transformed array'].length; it++){
            //     // for testing
            //     // -----------
            //     // temp_array.push(resultJson['Box-Cox power transformed array'][it])
            //     let temp_object = {}
            //     temp_object["category"] = it
            //     temp_object["yValue"] = resultJson['Box-Cox power transformed array'][it]
            //     temp_array_chart.push(temp_object)
            // }
            // // for testing
            // // -----------
            // // this.setState({transformation_data: temp_array})
            this.setState({lamda_value: resultJson['lambda that maximizes the log-likelihood function']})
            this.setState({min_confidence: resultJson['minimum confidence limit']})
            this.setState({max_confidence: resultJson['maximum confidence limit']})

            this.setState({stats_show: true})
            this.setState({test_qqplot_chart_data: resultJson['results']['qqplot']})
            this.setState({test_Hplot_chart_data: resultJson['results']['histogramplot']})
            this.setState({test_boxplot_chart_data: resultJson['results']['boxplot']})
            this.setState({test_probplot_chart_data: resultJson['results']['probplot']})
            this.setState({test_transf_plot_chart_data: resultJson['results']['transf_plot']})
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

    /**
     * Update state when selection changes in the form
     */
    handleSelectColumnChange(event){
        this.setState( {selected_column: event.target.value})
        this.setState( {selected_variable: this.state.selected_file_name+"--"+event.target.value})
        this.setState({stats_show: false})
    }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
        this.setState({stats_show: false})
        if (event.target.value=="Box-Cox"){
            this.setState({alpha_show:true});
            this.setState({lmbda_show:true});
        }
        else if (event.target.value=="Yeo-Johnson") {
            this.setState({alpha_show:false});
            this.setState({lmbda_show:true});
        }
        else {
            this.setState({alpha_show:false});
            this.setState({lmbda_show:false});
        }
    }
    handleSelectLmbdaChange(event){
        this.setState( {selected_lmbda: event.target.value})
        this.setState({stats_show: false})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
        this.setState({stats_show: false})
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
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", minWidth: 120}} noWrap>
                            Select Dataset for Transformation
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
                                        labelid="column-selector-label"
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
                                <FormHelperText>Select Column for Transformation</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="method-selector-label">Method</InputLabel>
                                <Select
                                        labelid="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    {/*<MenuItem value={"none"}><em>None</em></MenuItem>*/}
                                    <MenuItem value={"Box-Cox"}><em>Box-Cox</em></MenuItem>
                                    <MenuItem value={"Yeo-Johnson"}><em>Yeo-Johnson</em></MenuItem>
                                    <MenuItem value={"Log"}><em>Log</em></MenuItem>
                                    <MenuItem value={"Squared-root"}><em>Squared-root</em></MenuItem>
                                    <MenuItem value={"Cube-root"}><em>Cube-root</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl style={{ display: (this.state.lmbda_show ? 'block' : 'none') }}>
                                <TextField sx={{m: 1, width:'90%'}} size={"small"}
                                        labelid="lmbda-selector-label"
                                        id="lmbda-selector"
                                        value= {this.state.selected_lmbda}
                                        label="Lmbda parameter"
                                        onChange={this.handleSelectLmbdaChange}
                                />
                                <FormHelperText>If lmbda is None (default), find the value of lmbda that maximizes the log-likelihood function and return it as the second output argument.
                                    If lmbda is not None, do the transformation for that value.</FormHelperText>
                            </FormControl>
                            <FormControl style={{ display: (this.state.alpha_show ? 'block' : 'none') }}>
                                <TextField sx={{m: 1, width:'90%'}} size={"small"}
                                           labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="Alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>If lmbda is None and alpha is not None (default), return the 100 * (1-alpha)% confidence interval for lmbda as the third output argument. Must be between 0.0 and 1.0.
                                    If lmbda is not None, alpha is ignored.</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.selected_column}>
                                {/*|| !this.state.selected_method*/}
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>
                            Proceed >
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Results" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset" {...a11yProps(1)} />
                                    {/*<Tab label="Transformed" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                {this.state.test_data['status']!=='Success' ? (
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                ) : (
                                        <Grid>
                                            <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                                <p className="result_texts" style={{display: (this.state.lamda_value ? 'block' : 'none')}}> Lamda parameter: {this.state.lamda_value}</p>
                                                <p className="result_texts" style={{display: (this.state.min_confidence ? 'block' : 'none')}}> Minimum confidence limit: {this.state.min_confidence}</p>
                                                <p className="result_texts" style={{display: (this.state.max_confidence ? 'block' : 'none')}}> Maximum confidence limit: {this.state.max_confidence}</p>
                                            </div>
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
                                            <hr className="result" style={{display: (this.state.stats_show ? 'block' : 'none')}}/>
                                            <Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.stats_show ? 'block' : 'none')  }}>
                                                        Histogram of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.stats_show ? 'block' : 'none') }}>
                                                        <InnerHTML html={this.state.test_Hplot_chart_data} style={{zoom:'50%'}}/>
                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.stats_show ? 'block' : 'none') }}/>
                                                </Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.stats_show ? 'block' : 'none')  }}>
                                                        Box Plot of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.stats_show ? 'block' : 'none') }}>
                                                        <InnerHTML html={this.state.test_boxplot_chart_data} style={{zoom:'50%'}}/>
                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.stats_show ? 'block' : 'none') }}/>
                                                </Grid>
                                            </Grid>
                                            <Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.stats_show ? 'block' : 'none')  }}>
                                                        Q-Q Plot of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.stats_show ? 'block' : 'none') }} >
                                                        <InnerHTML html={this.state.test_qqplot_chart_data} style={{zoom:'50%'}}/>

                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.stats_show ? 'block' : 'none') }}/>
                                                </Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.stats_show ? 'block' : 'none')  }}>
                                                        Probability Plot of Selected data
                                                    </Typography>
                                                    <div style={{ display: (this.state.stats_show ? 'block' : 'none') }} >
                                                        <InnerHTML html={this.state.test_probplot_chart_data} style={{zoom:'50%'}}/>

                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.stats_show ? 'block' : 'none') }}/>
                                                </Grid>
                                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.stats_show ? 'block' : 'none')  }}>
                                                        Comparison of Data Transformation
                                                    </Typography>
                                                    <div style={{ display: (this.state.stats_show ? 'block' : 'none') }} >
                                                        <InnerHTML html={this.state.test_transf_plot_chart_data} style={{zoom:'50%'}}/>
                                                    </div>
                                                    <hr  class="result" style={{ display: (this.state.stats_show ? 'block' : 'none') }}/>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                )}
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

export default Transform_data;
