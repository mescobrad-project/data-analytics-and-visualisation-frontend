import React from 'react';
import API from "../../axiosInstance";
import {
    Button, Checkbox,
    FormControl, FormControlLabel,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, Tab, Tabs,
    Typography
} from "@mui/material";
import {DataGrid, GridToolbarContainer, GridToolbarExport} from "@mui/x-data-grid";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import JsonTable from "ts-react-json-table";
import InnerHTML from "dangerously-set-html-content";

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

class PointBiserialCorrelation extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            binary_columns: [],
            initialdataset:[],
            outputdataset:[],
            outliers_dataset_A:[],
            test_data: {
                status: '',
                error_descr: '',
                scatter_plot: '',
                html_box_1: '',
                outliersA: [],
                html_box_2: '',
                html_hist_1: '',
                html_hist_2: '',
                correlation: '',
                p_value: '',
                new_dataset:[]
            },
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",
            // remove_outliers: true
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        // this.handleOutliersRemovalChange = this.handleOutliersRemovalChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectColumnChange1 = this.handleSelectColumnChange1.bind(this);
        this.handleSelectColumnChange2 = this.handleSelectColumnChange2.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.fetchColumnNames();
        this.fetchBinaryColumnNames();
        this.handleTabChange = this.handleTabChange.bind(this);

    }

    /**
     * Call backend endpoint to get column names
     */
    async fetchColumnNames() {
        const params = new URLSearchParams(window.location.search);

        API.get("return_columns",
                {
                    params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({column_names: res.data.columns})
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

        // Send the request
        API.get("compute_point_biserial_correlation",
                {
                    params: {workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        column_1: this.state.selected_column, column_2: this.state.selected_column2,
                        // remove_outliers:this.state.remove_outliers
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({outputdataset: JSON.parse(res.data.new_dataset)})
            this.setState({outliers_dataset_A: JSON.parse(res.data.outliersA)})
            this.setState({tabvalue:1})
        });
    }

    async fetchBinaryColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_binary_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            // console.log(res.data.columns)
            this.setState({binary_columns: res.data.columns})
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectColumnChange1(event){
        this.setState( {selected_column: event.target.value})
    }
    handleSelectColumnChange2(event){
        this.setState( {selected_column2: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    // handleOutliersRemovalChange(event){
    //     this.setState( {remove_outliers: event.target.checked})
    // }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Select columns
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="column-selector-label">Column 1</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_column}
                                        label="Column"
                                        onChange={this.handleSelectColumnChange1}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select First column for correlation</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, minWidth: 120}}>
                                <InputLabel id="column2-selector-label">Column 2</InputLabel>
                                <Select
                                        labelId="column2-selector-label"
                                        id="column2-selector"
                                        value= {this.state.selected_column2}
                                        label="Second column"
                                        onChange={this.handleSelectColumnChange2}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Second column for correlation</FormHelperText>
                            </FormControl>
                            {/*<FormControlLabel sx={{m: 1, minWidth: 120}}*/}
                            {/*        control={*/}
                            {/*    <Checkbox*/}
                            {/*            checked={this.state.remove_outliers}*/}
                            {/*            onChange={this.handleOutliersRemovalChange}*/}
                            {/*            inputProps={{ 'aria-label': 'controlled' }}*/}
                            {/*    />} label="Remove Outliers" />*/}
                            <hr/>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                        <form onSubmit={async (event) => {
                            event.preventDefault();
                            window.location.replace("/")
                            // Send the request
                        }}>
                            <Button sx={{float: "right", marginRight: "2px"}} variant="contained" color="primary" type="submit">
                                Proceed >
                            </Button>
                        </form>
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
                                    <Tab label="New Dataset" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >Point biserial correlation :  { this.state.test_data.correlation}</Typography>
                                <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "Left", padding:'20px'}} >p-value :  { this.state.test_data.p_value}</Typography>
                                <hr className="result"/>
                                <Grid>
                                    <Grid>
                                        <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center"}}>
                                                Scatter plot of Selected variable and dichotomous
                                            </Typography>
                                            <InnerHTML html={this.state.test_data.scatter_plot} style={{zoom:'70%'}}/>
                                            <hr className="result"/>
                                        </Grid>
                                        <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center"}}>
                                                Box plot for each category of the dichotomous
                                            </Typography>
                                            <InnerHTML html={this.state.test_data.html_box_1} style={{zoom:'70%'}}/>
                                            <hr  class="result"/>
                                            <p>{this.state.outliers_dataset_A}</p>
                                            {/*<JsonTable className="jsonResultsTable" rows = {this.state.outliers_dataset_A}/>*/}
                                            <hr className="result"/>
                                        </Grid>
                                    </Grid>
                                    <Grid>
                                        <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center"}}>
                                                Histogram of category 0 of the dichotomous
                                            </Typography>
                                            <InnerHTML html={this.state.test_data.html_hist_1} style={{zoom:'70%'}}/>
                                            <hr  class="result"/>
                                        </Grid>
                                        <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                            <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center"}}>
                                                Histogram of category 1 of the dichotomous
                                            </Typography>
                                            <InnerHTML html={this.state.test_data.html_hist_2} style={{zoom:'70%'}}/>
                                            <hr className="result"/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={2}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.outputdataset}/>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default PointBiserialCorrelation;
