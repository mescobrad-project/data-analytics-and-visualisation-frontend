import React from 'react';
import API from "../../axiosInstance";
import {
    Button, Card, CardContent,
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
import PropTypes from "prop-types";
import General_Stats_Cov from "./General_Stats_Cov";
import ProceedButton from "../../components/ui-components/ProceedButton";

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

class Exploratory_Factor_Analysis_extract_latent_structure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names: [],
            test_data: {
                status: '',
                test_result: ""
            },
            //Values selected currently on the form
            selected_variables: [],
            selected_file_name: "",
            selected_variable_name: "",
            selected_test: 'explore_cfa_model',
            selected_min_loadings:2,
            selected_pval:0.01,
            selected_levels:1,
            Results:'',
            stats_show: false,
        };
        //Binding functions of the class
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectVariableNameChange = this.handleSelectVariableNameChange.bind(this);
        this.handleSelectTestChange = this.handleSelectTestChange.bind(this);
        this.handleSelectMinLoadingsChange = this.handleSelectMinLoadingsChange.bind(this);
        this.handleSelectPvalChange = this.handleSelectPvalChange.bind(this);
        this.handleSelectLevelsChange = this.handleSelectLevelsChange.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);
        this.handleDownloadModel = this.handleDownloadModel.bind(this);
        this.fetchFileNames();
    }

    async fetchColumnNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null
                    }
                }).then(res => {
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
                    }
                }).then(res => {
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
                    }
                }).then(res => {
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
            this.setState({tabvalue: 0})
        });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})
        // Send the request
        API.get("EFA_extract_latent_structure",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        test:this.state.selected_test,
                        file: this.state.selected_file_name.length > 0 ? this.state.selected_file_name : null,
                        variables: this.state.selected_variables.length> 0 ? this.state.selected_variables : null,
                        min_loadings: this.state.selected_min_loadings,
                        pval: this.state.selected_pval,
                        levels:this.state.selected_levels
                    },
                    paramsSerializer: params => {
                        return qs.stringify(params, {arrayFormat: "repeat"})
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({Results:res.data.test_result});
            this.setState({stats_show: true})
            this.setState({tabvalue: 1})
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
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_variables=[]
        })
    }
    handleSelectVariableNameChange(event){
        this.setState( {selected_variables: event.target.value})
    }
    handleDeleteVariable(event) {
        this.setState({selected_variables:[]})
    }
    handleListDelete(event) {
        var newArray = this.state.selected_variables.slice();
        const ind = newArray.indexOf(event.target.id);
        let newList = newArray.filter((x, index)=>{
            return index!==ind
        })
        this.setState({selected_variables:newList})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectTestChange(event){
        this.setState( {selected_test: event.target.value})
    }
    handleSelectMinLoadingsChange(event){
        this.setState( {selected_min_loadings: event.target.value})
    }
    handleSelectPvalChange(event){
        this.setState( {selected_pval: event.target.value})
    }
    handleSelectLevelsChange(event){
        this.setState( {selected_levels: event.target.value})
    }
    handleDownloadModel(event){
        console.log(this.state.Results)
        var fileData = this.state.Results.toString()
        const blob = new Blob([fileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "user-info.txt";
        link.href = url;
        link.click();
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            EFA Parameterisation
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="file-selector-label">File</InputLabel>
                                <Select
                                        labelId="file-selector-label"
                                        id="file-selector"
                                        value={this.state.selected_file_name}
                                        label="File Variable"
                                        onChange={this.handleSelectFileNameChange}
                                >
                                    {this.state.file_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select dataset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width: '90%'}} size={"small"}>
                                <InputLabel id="selected_test-selector-label">
                                    Select Operator
                                </InputLabel>
                                <Select
                                        labelId="selected_test-selector-label"
                                        id="selected_test-selector"
                                        value={this.state.selected_test}
                                        label="Test"
                                        onChange={this.handleSelectTestChange}

                                >
                                    <MenuItem value={"explore_cfa_model"}><em>Confirmatory Factor Analysis model</em></MenuItem>
                                    <MenuItem value={"explore_pine_model"}><em>Pine model</em></MenuItem>
                                </Select>
                                <FormHelperText>Select method for extracting latent structure from the data.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Select Variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        multiple
                                        value= {this.state.selected_variables}
                                        label="Select Variable"
                                        onChange={this.handleSelectVariableNameChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select variable in the selected dataset.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        type="number"
                                        labelId="selected_min_loadings-selector-label"
                                        id="selected_min_loadings-selector"
                                        value={this.state.selected_min_loadings}
                                        label="Min loadings"
                                        onChange={this.handleSelectMinLoadingsChange}
                                />
                                <FormHelperText>Expected minimal number of indicators per latent factor.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        type="number"
                                        labelId="selected_pval-selector-label"
                                        id="selected_pval-selector"
                                        value={this.state.selected_pval}
                                        label="p-value cutoff"
                                        onChange={this.handleSelectPvalChange}
                                />
                                <FormHelperText>The p-value cutoff value.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        type="number"
                                        labelId="selected_levels-selector-label"
                                        id="selected_levels-selector"
                                        value={this.state.selected_levels}
                                        label="selected levels"
                                        onChange={this.handleSelectLevelsChange}
                                />
                                <FormHelperText>The number of levels. Higher values allow for a more hierarchical model.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <hr/>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_file_name.length < 1}
                                    type="submit">
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={this.handleProceed}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary"
                                    type="submit"
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
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}}>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <Grid sx={{width: '100%'}}>
                            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange}
                                      aria-label="basic tabs example">
                                    <Tab label="Initial Dataset" {...a11yProps(0)} />
                                    <Tab label="Results" {...a11yProps(1)} />
                                    {/*<Tab label="Results" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                {this.state.test_data['status'] !== 'Success' ? (
                                        <TextField sx={{
                                            flexGrow: 1,
                                            textAlign: "Left",
                                            padding: '20px',
                                            width: '100%',
                                            borderRadius: '25px'
                                        }}
                                                   value={'Status :  ' + this.state.test_data['status']}
                                                   multiline={2}
                                                   variant="outlined"
                                                   label='Error'
                                                   InputProps={{
                                                       inputProps: {
                                                           style: {
                                                               backgroundColor: 'lightgrey',
                                                               color: 'darkred'
                                                           }
                                                       }
                                                   }}>
                                        </TextField>
                                ) : (
                                        <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                            <Grid>
                                                <Card>
                                                    <CardContent>
                                                        <Typography variant="h5" component="div">
                                                            Fitted model optimization results
                                                        </Typography>
                                                        <TextField
                                                                sx={{m: 1, width: '100%'}}
                                                                multiline={5}
                                                                value={this.state.test_data.test_result}
                                                        />
                                                        <Button onClick={this.handleDownloadModel}>
                                                            Download
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        </Grid>
                                )}
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Box>
                                    <JsonTable className="jsonResultsTable"
                                               rows={this.state.initialdataset}/>
                                </Box>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}
export default Exploratory_Factor_Analysis_extract_latent_structure;
