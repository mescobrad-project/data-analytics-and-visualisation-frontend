import React from 'react';
import API from "../../axiosInstance";
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem, Select, Tab, Tabs, TextField,
    Typography
} from "@mui/material";
import qs from "qs";
import JsonTable from "ts-react-json-table";
import {CSVLink} from "react-csv";
import {Box} from "@mui/system";
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from "prop-types";
import ProceedButton from "../../components/ui-components/ProceedButton";
import SelectorWithCheckBoxes from "../../components/ui-components/SelectorWithCheckBoxes";

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

class General_Stats_Cov extends React.Component {
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
            file_names:[],
            FrenderChild:0,
            test_data: {
                Dataframe:""
            },
            //Values selected currently on the form
            selected_variables: [],
            selected_file_name: "",
            selected_variable_name: "",
            selected_ddof: 0,
            Results:[],
            stats_show: false,
            tabvalue:0,
            svg1_path : ip + 'static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/Cov.svg',
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChildSelectVariableNameChange = this.handleChildSelectVariableNameChange.bind(this);
        this.handleSelectDdofChange = this.handleSelectDdofChange.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
// // Initialise component
        // // - values of channels from the backend
        // this.fetchColumnNames();
        this.fetchFileNames();
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
        API.get("covariance_matrix",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                        ddof: this.state.selected_ddof,
                        independent_variables: this.state.selected_variables,
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
        });
    }

    async handleProceed(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        // const file_to_output= window.localStorage.getItem('MY_APP_STATE');
        // console.log(file_to_output)
        API.put("save_hypothesis_output",
                {
                    workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                    step_id: params.get("step_id"),
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
    handleChildSelectVariableNameChange(checkedValues){
        this.setState({selected_variables:checkedValues})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_variables=[]
            this.state.FrenderChild+=1
        })
    }
    handleDeleteVariable(event) {
        this.setState({selected_variables:[]})
    }
    handleSelectDdofChange(event){
        this.setState( {selected_ddof: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    // handleListDelete(event) {
    //     var newArray = this.state.selected_variables.slice();
    //     const ind = newArray.indexOf(event.target.id);
    //     let newList = newArray.filter((x, index)=>{
    //         return index!==ind
    //     })
    //     this.setState({selected_variables:newList})
    // }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Covariance Matrix Parameterisation
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
                            {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                            {/*    <InputLabel id="column-selector-label">Select Variable</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="column-selector-label"*/}
                            {/*            id="column-selector"*/}
                            {/*            value= {this.state.selected_variables}*/}
                            {/*            label="Select Variable"*/}
                            {/*            onChange={this.handleSelectVariableNameChange}*/}
                            {/*    >*/}
                            {/*        {this.state.column_names.map((column) => (*/}
                            {/*                <MenuItem value={column}>{column}</MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*    <FormHelperText>Select variable in the selected dataset.</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <SelectorWithCheckBoxes
                                    key={this.state.FrenderChild}
                                    data={this.state.column_names}
                                    // rerender={this.state.rerender_child}
                                    onChildClick={this.handleChildSelectVariableNameChange}
                            />
                            {console.log(this.state.selected_variables)}
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                {/*<InputLabel id="ddof-selector-label">alpha</InputLabel>*/}
                                <TextField
                                        labelid="ddof-selector-label"
                                        id="ddof-selector"
                                        value= {this.state.selected_ddof}
                                        label="ddof parameter"
                                        onChange={this.handleSelectDdofChange}
                                />
                                <FormHelperText>Degrees of freedom correction in the calculation of the standard deviation.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_variables.length < 1}
                                    type="submit">
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
                                                    // onClick={this.handleListDelete}
                                                    >
                                                {column}
                                            </Button>
                                    ))}
                                </span>
                            </div>
                            {/*<Button onClick={this.handleDeleteVariable}>*/}
                            {/*     Clear all*/}
                            {/*</Button>*/}
                        </FormControl>

                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    {/*<Tab label="Transformed" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <Grid>
                                        <div style={{alignSelf:'center'}}>
                                            <img src={this.state.svg1_path + "?random=" + new Date().getTime()}
                                                 loading="lazy"
                                                 style={{zoom:'90%'}}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid>
                                        <div >
                                            <CSVLink data={this.state.Results}
                                                     filename={"Results.csv"}>Download table (.csv)</CSVLink>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.Results}/>
                                        </div>
                                    </Grid>
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

export default General_Stats_Cov;
