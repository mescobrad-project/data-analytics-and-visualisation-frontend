import React from 'react';
import API from "../../axiosInstance";
import "./linearmixedeffectsmodel.scss"
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import Paper from "@mui/material/Paper";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
import InnerHTML from "dangerously-set-html-content";

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

class SurvivalAnalysisRiskRatioDataset extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            test_data: {
                table: ""
            },
            binary_columns: [],
            columns: [],
            RiskTable:[],
            selected_exposure_variable: "",
            selected_outcome_variable: "",
            selected_reference: 0,
            selected_alpha: 0.05,
            stats_show: false,
            svg_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/Risktest.svg',
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.handleSelectOutcomeVariableChange = this.handleSelectOutcomeVariableChange.bind(this);
        this.handleSelectExposureVariableChange = this.handleSelectExposureVariableChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectReferenceChange = this.handleSelectReferenceChange.bind(this);
        this.fetchBinaryColumnNames();
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchColumnNames();


    }

    async fetchColumnNames(url, config) {
        const params = new URLSearchParams(window.location.search);
        API.get("return_columns",
                {params: {
                        workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
                        step_id: params.get("step_id")
                    }}).then(res => {
            this.setState({columns: res.data.columns})
            this.setState({initialdataset: JSON.parse(res.data.dataFrame)})
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

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("risks",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        exposure: this.state.selected_exposure_variable,
                        outcome: this.state.selected_outcome_variable,
                        // time: 'None',
                        reference: this.state.selected_reference,
                        alpha: this.state.selected_alpha,
                        method:'risk_ratio'
                        }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({RiskTable:JSON.parse(res.data.table)})
            this.setState({stats_show: true})
            this.setState({tabvalue:0})
        });
    }

    /**
     * Update state when selection changes in the form
     */
    handleSelectExposureVariableChange(event){
        if (event.target.value !== this.state.selected_outcome_variable)
        {
            this.setState( {selected_exposure_variable: event.target.value})
        }else{
            alert("You must select a different variable.")
            return
        }
    }
    handleSelectOutcomeVariableChange(event){
        if (event.target.value !== this.state.selected_exposure_variable)
        {
            this.setState( {selected_outcome_variable: event.target.value})
        }else{
            alert("You must select a different variable.")
            return
        }
    }
    handleSelectAlphaChange(event){
        this.setState( {selected_alpha: event.target.value})
    }
    handleSelectReferenceChange(event){
        this.setState( {selected_reference: event.target.value})
    }

    render() {

        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center", minWidth: 120}} noWrap>
                            Insert Parameters
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Exposure Variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_exposure_variable}
                                        label="Column"
                                        onChange={this.handleSelectExposureVariableChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Exposure Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Outcome Variable</InputLabel>
                                <Select
                                        labelId="column-selector-label"
                                        id="column-selector"
                                        value= {this.state.selected_outcome_variable}
                                        label="Column"
                                        onChange={this.handleSelectOutcomeVariableChange}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {this.state.binary_columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Outcome variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="Alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>Alpha value to calculate two-sided Wald confidence intervals.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="alpha-selector-label">Reference</InputLabel>
                                <Select
                                        labelid="reference-selector-label"
                                        id="reference-selector"
                                        value= {this.state.selected_reference}
                                        label="Reference parameter"
                                        onChange={this.handleSelectReferenceChange}
                                >
                                    <MenuItem value={"0"}><em>0</em></MenuItem>
                                    <MenuItem value={"1"}><em>1</em></MenuItem>
                                </Select>
                                <FormHelperText>Reference category for comparisons.</FormHelperText>
                            </FormControl>
                            <Button variant="contained" color="primary" type="submit">
                                Submit
                            </Button>
                        </form>
                    </Grid>
                    <Grid item xs={9}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }}>
                            Result Visualisation
                        </Typography>
                        <hr className="result"/>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                    <Tab label="Results" {...a11yProps(0)} />
                                    <Tab label="Initial Dataset" {...a11yProps(1)} />
                                    {/*<Tab label="New Dataset" {...a11yProps(2)} />*/}
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                        Estimates of Incidence Rate Ratio with a (1-alpha)*100% Confidence interval. </Typography>
                                    <JsonTable className="jsonResultsTable" rows = {this.state.RiskTable}/>
                                </div>
                                <hr className="result"/>
                                <div style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <img src={this.state.svg_path + "?random=" + new Date().getTime()}
                                         srcSet={this.state.svg_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                         loading="lazy"
                                    />
                                </div>
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

export default SurvivalAnalysisRiskRatioDataset;
