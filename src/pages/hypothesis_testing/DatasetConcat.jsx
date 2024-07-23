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
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import qs from "qs";
import JsonTable from "ts-react-json-table";
import ProceedButton from "../../components/ui-components/ProceedButton";
import {CSVLink} from "react-csv";
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

class DatasetConcat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                status: '',
                Datasets_concat:''
            },
            //Values selected currently on the form
            newdataset:'',
            selected_file_name1: "",
            selected_file_name2: "",
            stats_show:false,
            tabvalue:0
        };
        //Binding functions of the class
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleSelectFile1NameChange = this.handleSelectFile1NameChange.bind(this);
        this.handleSelectFile2NameChange = this.handleSelectFile2NameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.fetchFileNames();
    }

    /**
     * Call backend endpoint to get column names
     */
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
    async fetchDatasetContent(file_name, file_no) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_entire_dataset",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file_name:file_name.length > 0 ? file_name : null
                    }}).then(res => {
                        if (file_no===1){
                            this.setState({initialdataset1: JSON.parse(res.data.dataFrame)})
                        }else{
                            this.setState({initialdataset2: JSON.parse(res.data.dataFrame)})
                        }
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
        API.get("concat_csvs",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        file1: this.state.selected_file_name1,
                        file2: this.state.selected_file_name2},
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({newdataset: JSON.parse(res.data.Datasets_concat)})
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
            // console.log(JSON.parse(res.data.Datasets_concat))
            // console.log(res.data.status)
        });
    }

    /**
     * Update state when selection changes in the form
     */

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectFile1NameChange(event){
        this.setState( {selected_file_name1: event.target.value}, ()=>{
            this.fetchDatasetContent(event.target.value,1)
            this.setState({stats_show: false})
        })
    }
    handleSelectFile2NameChange(event){
        this.setState( {selected_file_name2: event.target.value}, ()=>{
            this.fetchDatasetContent(event.target.value,2)
            this.setState({stats_show: false})
        })
    }
    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Select files
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="file-selector-label">File 1</InputLabel>
                                <Select
                                        labelId="file-selector-label"
                                        id="file-selector"
                                        value= {this.state.selected_file_name1}
                                        label="File Variable"
                                        onChange={this.handleSelectFile1NameChange}
                                >
                                    {this.state.file_names.map((column) => (
                                            <MenuItem key={column} value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select dataset 1.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="file-selector-label">File 2</InputLabel>
                                <Select
                                        labelId="file-selector-label"
                                        id="file-selector"
                                        value= {this.state.selected_file_name2}
                                        label="File Variable"
                                        onChange={this.handleSelectFile2NameChange}
                                >
                                    {this.state.file_names.map((column) => (
                                            <MenuItem key={column} value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select dataset 2.</FormHelperText>
                            </FormControl>

                            <hr/>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_file_name1.length < 1 || this.state.selected_file_name2.length < 1}
                                    type="submit"
                            >
                                Run analysis
                            </Button>
                        </form>
                        <br/>
                        <br/>
                        <hr/>
                        <ProceedButton></ProceedButton>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <Grid sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Initial Dataset 1" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset 2" {...a11yProps(1)} />
                                    <Tab label="New Dataset" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset1}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <JsonTable className="jsonResultsTable"
                                           rows = {this.state.initialdataset2}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Grid>
                                                <JsonTable className="jsonResultsTable"
                                                       rows = {this.state.newdataset}/></Grid>
                                    )}
                                </Grid>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Grid>
        )
    }
}

export default DatasetConcat;
