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
import {Box} from "@mui/system";
import {CSVLink} from "react-csv";
import JsonTable from "ts-react-json-table";
import PropTypes from "prop-types";

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

class DataTransformationForANOVA extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                Dataframe:""
            },
            //Values selected currently on the form
            selected_file_name: "",
            selected_variable_name: [],
            selected_variables: [],
            Results:[],
            stats_show: false
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectVariableNameChange = this.handleSelectVariableNameChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.fetchFileNames();
        // this.fetchColumnNames();
    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames() {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
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
        API.get("transformed_data_for_use_in_an_ANOVA",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        variables: this.state.selected_variables,
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({Results:JSON.parse(res.data.Dataframe)});
            this.setState({stats_show: true})
            this.setState({tabvalue:1})

            // const resultJson = res.data;
            // let temp_array1=[]
            // let temp_array2=[]
            // // let temp_array_chart = []
            // for ( let it =0 ; it < resultJson['transformed_1'].length; it++){
            //     temp_array1.push(resultJson['transformed_1'][it])}
            // for ( let it =0 ; it < resultJson['transformed_2'].length; it++){
            //     temp_array2.push(resultJson['transformed_2'][it])
            //     // let temp_object = {}
            //     // temp_object["category"] = it
            //     // temp_object["yValue"] = resultJson['Box-Cox power transformed array'][it]
            //     // temp_array_chart.push(temp_object)
            // }
            // this.setState({transformed_data_1: temp_array1})
            // this.setState({transformed_data_2: temp_array2})
        });
    }
    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"),
                    run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
                }
        ).then(res => {
            this.setState({output_return_data: res.data})
        });
        window.location.replace("/")
    }
    /**
     * Update state when selection changes in the form
     */
    handleSelectVariableNameChange(event){
        this.setState( {selected_variable_name: event.target.value})
        var newArray = this.state.selected_variables.slice();
        if (newArray.indexOf(this.state.selected_file_name+"--"+event.target.value) === -1)
        {
            newArray.push(this.state.selected_file_name+"--"+event.target.value);
        }
        this.setState({selected_variables:newArray})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_variables=[]
        })
    }
    handleDeleteVariable(event) {
        this.setState({selected_variables:[]})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleListDelete(event) {
        var newArray = this.state.selected_variables.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_variables:newList})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Select columns
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
                                <InputLabel id="column-selector-label">Select Variable</InputLabel>
                                <Select
                                        // multiple
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_variable_name}
                                        label="Select Variable"
                                        onChange={this.handleSelectVariableNameChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variables</FormHelperText>
                            </FormControl>
                            <Button sx={{float: "left"}} variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit"
                                    disabled={!this.state.stats_show}>
                                Proceed >
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
                                    {/*<Tab label="Results" {...a11yProps(0)} />*/}
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Transformed" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows = {this.state.initialdataset}/>
                                </Box>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <Grid>
                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                            Transformed variables. </Typography>
                                        <div style={{textAlign:"center"}}>
                                            <CSVLink data={this.state.Results}
                                                     filename={"Results.csv"}>Download</CSVLink>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.Results}/>
                                        </div>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </Grid>
                        {/*<div style={{display:"flex"}}>*/}
                        {/*    /!*<p className="result_texts">Transformed data 1 : { this.state.transformed_data_1}</p>*!/*/}
                        {/*    <List style={{flex:2, width: "fit-content"}}>*/}
                        {/*        Transformed column 1 data:*/}
                        {/*        {this.state.transformed_data_1.map((channel) => (*/}
                        {/*                <ListItem> <ListItemText primary={channel}/></ListItem>*/}
                        {/*        ))}*/}
                        {/*    </List>*/}
                        {/*    /!*<p className="result_texts">Transformed data 2 : { this.state.transformed_data_2}</p>*!/*/}
                        {/*    <List style={{flex:2, width: "fit-content"}}>*/}
                        {/*        Transformed column 2 data:*/}
                        {/*        {this.state.transformed_data_2.map((channel) => (*/}
                        {/*                <ListItem> <ListItemText primary={channel}/></ListItem>*/}
                        {/*        ))}*/}
                        {/*    </List>*/}
                        {/*</div>*/}
                    </Grid>
                </Grid>
        )
    }
}

export default DataTransformationForANOVA;
