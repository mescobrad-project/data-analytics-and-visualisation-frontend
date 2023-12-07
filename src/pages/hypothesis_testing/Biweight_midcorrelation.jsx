import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    Box,
    MenuItem,
    Select,
    Typography, Tabs, Tab
} from "@mui/material";
import qs from "qs";
import {DataGrid, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../../components/ui-components/ProceedButton";

const userColumns = [
    { field: "Cor",
        headerName: "Variables",
        // width: '15%',
        align: "left",
        headerAlign: "left",
        flex:2,
        sortable: true,
    },
    {
        field: "n",
        headerName: "n",
        width: '5%',
        align: "center",
        headerAlign: "center",
        flex:0.5
    },
    {
        field: "r",
        headerName: "r",
        width: '10%',
        align: "right",
        headerAlign: "center",
        flex:1
    },
    {
        field: "CI95%",
        headerName: "CI95%",
        width: '10%',
        align: "center",
        headerAlign: "center",
        flex:1
    },
    {
        field: "p-val",
        headerName: "p-val",
        width: '20%',
        align: "right",
        headerAlign: "center",
        flex:1
    },
    {
        field: "power",
        headerName: "power",
        width: '20%',
        align: "right",
        headerAlign: "center",
        flex:1
    }];

function CustomToolbar() {
    return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
    );
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

class Biweight_midcorrelation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            initialdataset:[],
            test_data: {
                DataFrame:[]
            },
            //Values selected currently on the form
            selected_method: "bicor",
            selected_alternative: "two-sided",
            selected_independent_variables: [],
            selected_variables: []
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleSelectAlternativeChange = this.handleSelectAlternativeChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.fetchFileNames();
    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

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
        API.get("correlations_pingouin",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        column_2: this.state.selected_variables,
                        alternative: this.state.selected_alternative,
                        method: this.state.selected_method
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
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id")
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        window.location.replace("/")
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_variables.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_variables:newArray})
    }
    handleSelectAlternativeChange(event){
        this.setState( {selected_alternative: event.target.value})
    }
    handleListDelete(event) {
        var newArray = this.state.selected_variables.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_variables:newList})
    }
    handleDeleteVariable(event) {
        this.setState({selected_variables:[]})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.handleDeleteVariable()
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Biweight mid-correlation Parameterisation
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
                                <InputLabel id="column-selector-label">Variables</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_independent_variables}
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variables for correlation test</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
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
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_variables.length < 2}
                                    type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                        <ProceedButton></ProceedButton>
                        <br/>
                        <br/>
                        <hr/>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected variables [click to remove]</FormHelperText>
                            <div>
                                <span>
                                    {this.state.selected_variables.map((column) => (
                                            <Button variant="outlined" size="small"
                                                    sx={{m:0.5}} style={{fontSize:'10px'}}
                                                    id={column}
                                                    onClick={this.handleListDelete}>
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            <Button onClick={this.handleDeleteVariable}>
                                Clear all
                            </Button>
                        </FormControl>
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
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <Grid style={{display: (this.state.test_data['status']!=='Success' ? 'block' : 'none')}}>
                                        <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    </Grid>
                                    <Grid style={{display: (this.state.test_data['status']==='Success' ? 'block' : 'none')}}>
                                        <DataGrid sx={{width:'90%', height:'500px', display: 'flex', marginLeft: 'auto', marginRight: 'auto', fontSize:'11px'}}
                                                  zeroMinWidth
                                                  rowHeight={40}
                                                  className="datagrid"
                                                  rows= {this.state.test_data.DataFrame}
                                                  columns= {userColumns}
                                                  pageSize= {9}
                                                  rowsPerPageOptions={[9]}
                                                  components={{
                                                      Toolbar: CustomToolbar,
                                                  }}
                                        />
                                        <hr className="result"/>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                            {/*<TabPanel value={this.state.tabvalue} index={2}>*/}
                            {/*    Item Three*/}
                            {/*</TabPanel>*/}
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default Biweight_midcorrelation;
