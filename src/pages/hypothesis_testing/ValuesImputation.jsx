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

class ValuesImputation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            file_names:[],
            test_data: {
                status: '',
                newdataFrame:''
            },
            //Values selected currently on the form
            newdataset:'',
            selected_columns: [],
            selected_variables: [],
            selected_file_name: "",
            selected_method:"mean",
            stats_show:false,
            tabvalue:0
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchFileNames = this.fetchFileNames.bind(this);
        this.handleSelectFileNameChange = this.handleSelectFileNameChange.bind(this);
        this.fetchDatasetContent = this.fetchDatasetContent.bind(this);
        this.handleProceed = this.handleProceed.bind(this);
        // this.handleListDelete = this.handleListDelete.bind(this);
        // this.handleDeleteVariable = this.handleDeleteVariable.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleSelectColumnsChange = this.handleSelectColumnsChange.bind(this);
        this.handleChildSelectVariableNameChange = this.handleChildSelectVariableNameChange.bind(this);
        this.handleSelectMethodChange = this.handleSelectMethodChange.bind(this);

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
        API.get("return_entire_dataset",
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
        API.get("Dataframe_preparation",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        variables: this.state.selected_variables,
                        method: this.state.selected_method,
                        file: this.state.selected_file_name},
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({newdataset: JSON.parse(res.data.newdataFrame)})
            this.setState({test_data: res.data})
            this.setState({stats_show: true})
            this.setState({tabvalue:1})
            // console.log(JSON.parse(res.data.newdataFrame))
            // console.log(res.data.status)
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
        // window.location.replace("/")
    }
    /**
     * Update state when selection changes in the form
     */
    // handleSelectColumnsChange(event){
    //     this.setState( {selected_columns: event.target.value})
    //     var newArray = this.state.selected_variables.slice();
    //     if (newArray.indexOf(event.target.value) === -1)
    //     {
    //         newArray.push(event.target.value);
    //     }
    //     this.setState({selected_variables:newArray})
    // }
    handleChildSelectVariableNameChange(checkedValues){
        this.setState({selected_variables:checkedValues})
    }
    // handleListDelete(event) {
    //     var newArray = this.state.selected_variables.slice();
    //     const ind = newArray.indexOf(event.target.id);
    //     let newList = newArray.filter((x, index)=>{
    //         return index!==ind
    //     })
    //     this.setState({selected_variables:newList})
    // }
    // handleDeleteVariable(event) {
    //     this.setState({selected_variables:[]})
    // }
    handleSelectMethodChange(event){
        this.setState( {selected_method: event.target.value})
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
                            Select Imputation variables & strategy
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
                            {/*    <InputLabel id="column-selector-label">Column</InputLabel>*/}
                            {/*    <Select*/}
                            {/*            labelId="column-selector-label"*/}
                            {/*            id="column-selector"*/}
                            {/*            value= {this.state.selected_columns}*/}
                            {/*            label="Column"*/}
                            {/*            onChange={this.handleSelectColumnsChange}*/}
                            {/*    >*/}
                            {/*        {this.state.column_names.map((column) => (*/}
                            {/*                <MenuItem value={column}>{column}</MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </Select>*/}
                            {/*    <FormHelperText>Select Variable</FormHelperText>*/}
                            {/*</FormControl>*/}
                            <SelectorWithCheckBoxes
                                    key={this.state.FrenderChild}
                                    data={this.state.column_names}
                                    onChildClick={this.handleChildSelectVariableNameChange}
                            />
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="method-selector-label">Method</InputLabel>
                                <Select
                                        labelid="method-selector-label"
                                        id="method-selector"
                                        value= {this.state.selected_method}
                                        label="Method"
                                        onChange={this.handleSelectMethodChange}
                                >
                                    <MenuItem value={"mean"}><em>mean</em></MenuItem>
                                    <MenuItem value={"median"}><em>median</em></MenuItem>
                                    <MenuItem value={"most_frequent"}><em>most_frequent</em></MenuItem>
                                    <MenuItem value={"constant"}><em>constant</em></MenuItem>
                                    <MenuItem value={"KNN"}><em>KNN</em></MenuItem>
                                    <MenuItem value={"iterative"}><em>iterative</em></MenuItem>
                                </Select>
                                <FormHelperText>Defines the imputation strategy.</FormHelperText>
                            </FormControl>
                            <hr/>
                            <Button sx={{float: "left", marginRight: "2px"}}
                                    variant="contained" color="primary"
                                    disabled={this.state.selected_variables.length < 1}
                                    type="submit"
                            >
                                Run analysis
                            </Button>
                        </form>

                        <br/>
                        <br/>
                        <hr/>
                        <FormControl sx={{m: 1, width:'95%'}} size={"small"} >
                            <FormHelperText>Selected variables</FormHelperText>
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
                        </FormControl>
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
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    {this.state.test_data['status']!=='Success' ? (
                                            <Typography variant="h6" color='indianred' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}}>Status :  { this.state.test_data['status']}</Typography>
                                    ) : (
                                            <Grid>
                                                {/*<CSVLink data={this.state.newdataset}*/}
                                                {/*         filename={"Imputation.csv"}>Download</CSVLink>*/}
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

export default ValuesImputation;
