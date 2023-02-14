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
            test_data: {
                status: '',
                error_descr: '',
                scatter_plot: '',
                html_box_1: '',
                html_box_2: '',
                html_hist_1: '',
                html_hist_2: '',
                correlation: '',
                p_value: ''
            },
            //Values selected currently on the form
            selected_column: "",
            selected_column2: "",

        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);

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
            this.setState({tabvalue:1})
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
                        column_1: this.state.selected_column, column_2: this.state.selected_column2}
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({tabvalue:0})
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
    render() {
        return (
                <Grid container direction="row">
                    {/*<Grid item xs={2}  sx={{ borderRight: "1px solid grey"}}>*/}
                    {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                    {/*        Data Preview*/}
                    {/*    </Typography>*/}
                    {/*    <hr/>*/}
                    {/*    <List>*/}
                    {/*        {this.state.column_names.map((column) => (*/}
                    {/*                <ListItem> <ListItemText primary={column}/></ListItem>*/}
                    {/*        ))}*/}
                    {/*    </List>*/}
                    {/*</Grid>*/}
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
                            <Button variant="contained" color="primary" type="submit">
                                Submit
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
                                    <Tab label="Results" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset" {...a11yProps(1)} />
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <p className="result_texts">Point biserial correlation :  { this.state.test_data.correlation}</p>
                                <p className="result_texts">p-value :    { this.state.test_data.p_value}</p>

                                <Grid item xs={6} style={{ display: 'inline-block', padding:'20px'}}>
                                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", display: (this.state.qqplot_chart_show ? 'block' : 'none')  }}>
                                        Q-Q Plot of Selected data
                                    </Typography>
                                    <div>
                                        <InnerHTML html={this.state.test_data.scatter_plot} style={{zoom:'50%'}}/>
                                        <InnerHTML html={this.state.test_data.html_box_1} style={{zoom:'50%'}}/>
                                        <InnerHTML html={this.state.test_data.html_box_2} style={{zoom:'50%'}}/>
                                        <InnerHTML html={this.state.test_data.html_hist_1} style={{zoom:'50%'}}/>
                                        <InnerHTML html={this.state.test_data.html_hist_2} style={{zoom:'50%'}}/>
                                    </div>
                                    <hr  class="result" style={{ display: (this.state.qqplot_chart_show ? 'block' : 'none') }}/>
                                </Grid>

                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
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

export default PointBiserialCorrelation;
