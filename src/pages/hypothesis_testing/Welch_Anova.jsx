import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select, Tab, Tabs,
    Typography
} from "@mui/material";
import qs from "qs";
import {DataGrid} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import JsonTable from "ts-react-json-table";
import PropTypes from "prop-types";
import SelectorWithCheckBoxes from "../../components/ui-components/SelectorWithCheckBoxes";

const userColumns = [
    { field: "Source",
        headerName: "Factor names",
        align: "left",
        headerAlign: "left",
        flex:1,
        resizable:false,
        sortable: true},
    {
        field: "ddof1",
        headerName: "DoF (numerator)",
        // width: '5%',
        align: "center",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "ddof2",
        headerName: "DoF (denominator)",
        // width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "F",
        headerName: "F-values",
        // width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "p-unc",
        headerName: "Uncorrected p-values",
        // width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    },
    {
        field: "np2",
        headerName: "Partial eta-squared",
        // width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1,
        type: "number"
    }];
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
class Welch_Ancova extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            column_names_for_checkbox: [],
            file_names:[],
            initialdataset:[],
            test_data: {
                status:'',
                DataFrame:[]
            },
            //Values selected currently on the form
            selected_file_name: "",
            selected_dependent_variable: "",
            // selected_dependent_variable_wf: "",
            selected_between_factor: "",
            // selected_between_factor_wf: "",
            stats_show:false,
            tabvalue:0
        };

        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectBetweenFactorChange = this.handleSelectBetweenFactorChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.fetchFileNames();
    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
            this.setState({column_names_for_checkbox: res.data.columns})
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
                        file_name: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
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

        // TODO Add checks here

        // Send the request
        API.get("calculate_one_way_welch_anova",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dv: this.state.selected_dependent_variable,
                        file: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                        between: this.state.selected_between_factor,
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
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
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
        // this.setState( {selected_dependent_variable_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleSelectBetweenFactorChange(event){
        this.setState( {selected_between_factor: event.target.value})
        // this.setState( {selected_between_factor_wf: this.state.selected_file_name+"--"+event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            // this.state.selected_dependent_variable_wf=""
            // this.state.selected_between_factor_wf=""
            this.state.stats_show= false})
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Welch Anova Parameterisation
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
                                    {this.state.file_names.map((column, item) => (
                                            <MenuItem key={item} value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select dataset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Dependent Variable</InputLabel>
                                <Select
                                        labelId="dependent-selector-label"
                                        id="dependent-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Dependent Variable"
                                        onChange={this.handleSelectDependentVariableChange}
                                >
                                    {this.state.column_names.map((column,item) => (
                                            <MenuItem key= {item} value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the dependent variable.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Between factor</InputLabel>
                                <Select
                                        labelId="Between-selector-label"
                                        id="Between-selector"
                                        value= {this.state.selected_between_factor}
                                        label="Between factor"
                                        onChange={this.handleSelectBetweenFactorChange}
                                >
                                    {this.state.column_names.map((column, item) => (
                                            <MenuItem key= {item} value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the between factor.</FormHelperText>
                            </FormControl>
                            <SelectorWithCheckBoxes
                                    data={this.state.column_names}
                            />

                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_dependent_variable.length===0 || this.state.selected_between_factor.length===0 }
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show || !(this.state.test_data.status==='Success')}>
                                Proceed >
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <hr/>
                        <Grid>
                            <FormHelperText>Dependent variable =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_dependent_variable}>
                                {this.state.selected_dependent_variable}
                            </Button>
                        </Grid>
                        <Grid>
                            <FormHelperText>Between factor =</FormHelperText>
                            <Button variant="outlined" size="small"
                                    sx={{marginRight: "2px", m:0.5}} style={{fontSize:'10px'}}
                                    id={this.state.selected_between_factor}>
                                {this.state.selected_between_factor}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    {/*<Tab label="Transformed" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid sx={{ flexGrow: 1, textAlign: "center"}}
                                      style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>
                                                Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <div className="datatable">
                                                {/*<p className="result_texts">Pearson’s correlation coefficient :  { this.state.test_data.DataFrame}</p>*/}
                                                    <DataGrid sx={{width:'90%', height:'700px', display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}
                                                              zeroMinWidth
                                                              rowHeight={40}
                                                              className="datagrid"
                                                              rows= {this.state.test_data.DataFrame}
                                                              columns= {userColumns}
                                                              pageSize= {15}
                                                              rowsPerPageOptions={[15]}
                                                    />
                                                </div>
                                    )}
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
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

export default Welch_Ancova;
