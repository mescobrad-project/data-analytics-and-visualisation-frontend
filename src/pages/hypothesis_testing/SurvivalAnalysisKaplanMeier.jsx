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

class SurvivalAnalysisKaplanMeier extends React.Component {
    constructor(props){
        super(props);
        const params = new URLSearchParams(window.location.search);
        this.state = {
            test_data: {
                survival_function:"",
                confidence_interval:"",
                event_table:"",
            },
            binary_columns: [],
            columns: [],
            SurvivalFunction:[],
            ConfidenceInterval:[],
            EventTable:[],
            Conditional_time_to_event:[],
            Confidence_interval_cumulative_density:[],
            Cumulative_density:[],
            Timeline:[],
            Median_survival_time:"",
            selected_exposure_variable: "",
            selected_outcome_variable: "",
            selected_at_risk_counts: 'True',
            selected_alpha: 0.05,
            selected_label: null,
            stats_show: false,
            svg_path : 'http://localhost:8000/static/runtime_config/workflow_' + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/survival_function.svg',
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.fetchBinaryColumnNames = this.fetchBinaryColumnNames.bind(this);
        this.handleSelectOutcomeVariableChange = this.handleSelectOutcomeVariableChange.bind(this);
        this.handleSelectExposureVariableChange = this.handleSelectExposureVariableChange.bind(this);
        this.handleSelectAlphaChange = this.handleSelectAlphaChange.bind(this);
        this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);
        this.handleSelectAtRiskCountsChange = this.handleSelectAtRiskCountsChange.bind(this);
        // this.fetchBinaryColumnNames();
        this.fetchColumnNames = this.fetchColumnNames.bind(this);
        this.fetchColumnNames();
        this.handleTabChange = this.handleTabChange.bind(this);
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

    // async fetchBinaryColumnNames(url, config) {
    //     const params = new URLSearchParams(window.location.search);
    //     API.get("return_binary_columns",
    //             {params: {
    //                     workflow_id: params.get("workflow_id"), run_id: params.get("run_id"),
    //                     step_id: params.get("step_id")
    //                 }}).then(res => {
    //         // console.log(res.data.columns)
    //         this.setState({binary_columns: res.data.columns})
    //     });
    // }

    async handleSubmit(event) {
        event.preventDefault();
        const params = new URLSearchParams(window.location.search);
        this.setState({stats_show: false})

        // Send the request
        API.get("kaplan_meier",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        column_1: this.state.selected_exposure_variable,
                        column_2: this.state.selected_outcome_variable,
                        at_risk_counts: this.state.selected_at_risk_counts,
                        label:this.state.selected_label,
                        alpha: this.state.selected_alpha,
                        }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({SurvivalFunction:JSON.parse(res.data.survival_function)})
            this.setState({ConfidenceInterval:JSON.parse(res.data.confidence_interval)})
            this.setState({EventTable:JSON.parse(res.data.event_table)})
            this.setState({Conditional_time_to_event:JSON.parse(res.data.conditional_time_to_event)})
            this.setState({Confidence_interval_cumulative_density:JSON.parse(res.data.confidence_interval_cumulative_density)})
            this.setState({Cumulative_density:JSON.parse(res.data.cumulative_density)})
            this.setState({Timeline:JSON.parse(res.data.timeline)})
            this.setState({Median_survival_time:res.data.median_survival_time})
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
    handleSelectAtRiskCountsChange(event){
        this.setState( {selected_at_risk_counts: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }
    handleSelectLabelChange(event){
        this.setState({selected_label:event.target.value})
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
                                <InputLabel id="column-selector-label">Status</InputLabel>
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
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Status Variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Duration</InputLabel>
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
                                    {this.state.columns.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Select Duration variable</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="alpha-selector-label"
                                        id="alpha-selector"
                                        value= {this.state.selected_alpha}
                                        label="Alpha parameter"
                                        onChange={this.handleSelectAlphaChange}
                                />
                                <FormHelperText>The alpha value associated with the confidence intervals.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <TextField
                                        labelid="label-selector-label"
                                        id="label-selector"
                                        value= {this.state.selected_label}
                                        label="Label"
                                        onChange={this.handleSelectLabelChange}
                                />
                                <FormHelperText>Provide a new label for the estimate.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="alpha-selector-label">at_risk_counts</InputLabel>
                                <Select
                                        labelid="at_risk_counts-selector-label"
                                        id="at_risk_counts-selector"
                                        value= {this.state.selected_at_risk_counts}
                                        label="at risk counts parameter"
                                        onChange={this.handleSelectAtRiskCountsChange}
                                >
                                    <MenuItem value={"False"}><em>False</em></MenuItem>
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                </Select>
                                <FormHelperText>Show group sizes at time points.</FormHelperText>
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
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <Grid container>
                                        <Grid item xs={7} >
                                        <img src={this.state.svg_path + "?random=" + new Date().getTime()}
                                                // srcSet={this.state.svg_path + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                                             loading="lazy"
                                        />
                                        </Grid>
                                        <Grid item xs={5} >
                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                Survival Function. </Typography>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.SurvivalFunction}/>
                                            <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                                Cumulative density. </Typography>
                                            <JsonTable className="jsonResultsTable" rows = {this.state.Cumulative_density}/>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <hr className="result"/>
                                <Grid>
                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                        Event Table. </Typography>
                                    <JsonTable className="jsonResultsTable" rows = {this.state.EventTable}/>
                                </Grid>
                                <hr className="result"/>
                                <Grid>
                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                        Conditional time to event. </Typography>
                                    <JsonTable className="jsonResultsTable" rows = {this.state.Conditional_time_to_event}/>

                                    <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                        Median survival time = {this.state.Median_survival_time} </Typography>
                                </Grid>
                                <hr className="result"/>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                            Confidence Interval. </Typography>
                                        <JsonTable className="jsonResultsTable" rows = {this.state.ConfidenceInterval}/>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                            Confidence Interval cumulative density. </Typography>
                                        <JsonTable className="jsonResultsTable" rows = {this.state.Confidence_interval_cumulative_density}/>
                                    </Grid>
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

export default SurvivalAnalysisKaplanMeier;
