import React from 'react';
import API from "../../axiosInstance";
import "./normality_tests.scss"
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
    Select, Tab, Tabs, TextField,
    Typography
} from "@mui/material";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import qs from "qs";
import JsonTable from "ts-react-json-table";
import {CSVLink} from "react-csv";

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
class Multiple_comparisons extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                status:'',
                rejected:[],
                corrected_p_values:[]
            },
            //Values selected currently on the form
            selected_columns: [],
            selected_variables: [],
            selected_file_name: "",
            selected_alpha: 0.05,
            selected_method: "Bonferroni",
            stats_show:false
        };
        //Binding functions of the class
        // this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        this.handleListDelete = this.handleListDelete.bind(this);
        this.handleDeleteVariable = this.handleDeleteVariable.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnsChange = this.handleSelectColumnsChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        // // Initialise component
        // // - values of channels from the backend
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
        // let data_to_send = {
        //     workflow_id: params.get("workflow_id"),
        //     run_id: params.get("run_id"),
        //     step_id: params.get("step_id"),
        //     p_value: this.state.selected_variables,
        //     method: this.state.selected_method,
        //     alpha: this.state.selected_alpha
        // }

        API.get("multiple_comparisons",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        p_value: this.state.selected_variables,
                        method: this.state.selected_method,
                        alpha: this.state.selected_alpha},
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }).then(res =>{
            this.setState({Results: JSON.parse(res.data.result)})
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
        window.location.replace("https://es.platform.mes-cobrad.eu/workflow/" + params.get('workflow_id') + "/run/" + params.get("run_id"))
    }

    /**
     * Update state when selection changes in the form
     */
    // handleSelectColumnChange(event){
    //     this.setState( {selected_column: event.target.value})
    // }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    handleSelectColumnsChange(event){
        this.setState( {selected_columns: event.target.value})
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
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectFileNameChange(event){
        this.setState( {selected_file_name: event.target.value}, ()=>{
            this.fetchColumnNames()
            this.fetchDatasetContent()
            this.state.selected_variables=[]
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Select Variable for Multiple Tests and P-Value Correction
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
                                        value= {this.state.selected_columns}
                                        label="Column"
                                        onChange={this.handleSelectColumnsChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Variable</FormHelperText>
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
                                    <MenuItem value={"Bonferroni"}><em>Bonferroni: one-step correction</em></MenuItem>
                                    <MenuItem value={"sidak"}><em>Sidak</em></MenuItem>
                                    <MenuItem value={"holm-sidak"}><em>Holm-Sidak</em></MenuItem>
                                    <MenuItem value={"holm"}><em>Holm</em></MenuItem>
                                    <MenuItem value={"simes-hochberg"}><em>Simes-Hochberg</em></MenuItem>
                                    <MenuItem value={"benjamini-hochberg"}><em>Benjamini-Hochberg</em></MenuItem>
                                    <MenuItem value={"benjamini-yekutieli"}><em>Benjamini-Yekutieli</em></MenuItem>
                                    <MenuItem value={"fdr_tsbh"}><em>fdr_tsbh</em></MenuItem>
                                    <MenuItem value={"fdr_tsbky"}><em>fdr_tsbky: two stage fdr correction (non-negative)</em></MenuItem>
                                </Select>
                                <FormHelperText>Method used for testing and adjustment of pvalues.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                {/*<InputLabel id="alpha-selector-label">alpha</InputLabel>*/}
                                <TextField
                                        labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>Family-wise error rate, e.g. 0.1.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_variables.length !== 1}
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
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
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
                                            <Grid>
                                                <div style={{textAlign:"center"}}>
                                                    <CSVLink data={this.state.Results}
                                                             filename={"Results.csv"}>Download</CSVLink>
                                                    <JsonTable className="jsonResultsTable" rows = {this.state.Results}/>
                                                </div>
                                            </Grid>
                                        </Grid>
                                )}
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default Multiple_comparisons;
