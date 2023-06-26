import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, Tab, Tabs, TextareaAutosize, TextField,
    Typography
} from "@mui/material";
import qs from "qs";
import {DataGrid} from "@mui/x-data-grid";
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
const userColumns = [
    { field: "Variable", headerName: "Variable", width: '50%',
        align: "left",
        headerAlign: "left",
        flex:2,
        sortable: true},
    {
        field: "Variance",
        headerName: "Variance",
        width: '50%',
        align: "left",
        headerAlign: "left",
        flex:2
    }];

class Homoscedasticity extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                status:'',
                statistic: "",
                p_value: "",
                variance: []
            },
            //Values selected currently on the form
            selected_file_name: "",
            selected_method: "Bartlett",
            selected_center: "median",
            selected_independent_variables: [],
            selected_variables: [],
            center_show:false,
            stats_show:false
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectCenterChange = this.handleSelectCenterChange.bind(this);

        this.onClickButton = this.onClickButton.bind(this)
        this.handleSelectIndependentVariableChange = this.handleSelectIndependentVariableChange.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);

        // // Initialise component
        // // - values of channels from the backend
        this.fetchColumnNames();
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
        API.get("check_homoscedasticity",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        columns: this.state.selected_variables,
                        name_of_test: this.state.selected_method,
                        center: this.state.selected_center},
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                }}
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
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
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

    onClickButton(event) {
        const cnt = this.state.selected_variables.map((item) => ({item}.length))
        console.log(cnt)
        if (cnt<2)
        {
            alert('At least TWO variables must be selected!')
            event.preventDefault();
        }
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_variables=[]
        })
    }

    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
        if (event.target.value=="Bartlett"){
            this.setState({center_show:false})
        }
        else {
            this.setState({center_show:true});
        }
        this.setState({stats_show: false})
    }
    handleSelectCenterChange(event){
        this.setState( {selected_center: event.target.value})
        this.setState({stats_show: false})
    }
    handleSelectIndependentVariableChange(event){
        this.setState( {selected_independent_variables: event.target.value})
        var newArray = this.state.selected_variables.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_variables:newArray})
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
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Select method for Homoscedasticity check
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
                                        value= {this.state.selected_independent_variables}
                                        // multiple
                                        label="Column"
                                        onChange={this.handleSelectIndependentVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Variables</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="method-selector-label">Method</InputLabel>
                                <Select
                                        labelId="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    <MenuItem value={"Bartlett"}><em>Bartlett</em></MenuItem>
                                    <MenuItem value={"Fligner-Killeen"}><em>Fligner-Killeen</em></MenuItem>
                                    <MenuItem value={"Levene"}><em>Levene</em></MenuItem>
                                </Select>
                                <FormHelperText>Specify which method to use.</FormHelperText>
                            </FormControl>
                            <FormControl style={{ display: (this.state.center_show ? 'block' : 'none') }}>
                                <InputLabel id="center-selector-label">Function</InputLabel>
                                <Select sx={{m: 1, width:'90%'}} size={"small"}
                                        labelid="center-selector-label"
                                        id="center-selector"
                                        value= {this.state.selected_center}
                                        label="Center parameter"
                                        onChange={this.handleSelectCenterChange}
                                >
                                    <MenuItem value={"trimmed"}><em>trimmed</em></MenuItem>
                                    <MenuItem value={"median"}><em>median</em></MenuItem>
                                    <MenuItem value={"mean"}><em>mean</em></MenuItem>
                                </Select>
                                <FormHelperText>Keyword argument controlling which function of the data is used in computing the test statistic. The default is ‘median’.</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    type="submit" onClick={this.onClickButton}
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
                        <hr className="result"/>
                        <Grid sx={{ width: '100%' }}>
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
                                            <div className="datatable">
                                                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} >
                                                    Variance of Selected Variables
                                                </Typography>
                                                <DataGrid sx={{width:'80%', height:'210px', display: 'flex', marginLeft: 'auto', marginRight: 'auto'}}
                                                        rowHeight={30}
                                                        className="datagrid"
                                                        rows= {this.state.test_data.variance}
                                                        columns= {userColumns}
                                                        pageSize= {12}
                                                        rowsPerPageOptions={[5]}
                                                />
                                                <hr className="result"
                                                    />
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >{this.state.selected_method}{"'s test statistic:"}  { this.state.test_data.statistic}</Typography>
                                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >P-value: {this.state.test_data.p_value}</Typography>
                                            </div>
                                        </Grid>
                                )}
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default Homoscedasticity;
