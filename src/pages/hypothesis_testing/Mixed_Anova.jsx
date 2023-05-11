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
import qs from "qs";
import JsonTable from "ts-react-json-table";
import {CSVLink} from "react-csv";
import {Box} from "@mui/system";
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

class Mixed_Anova extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            // List of columns in dataset
            column_names: [],
            test_data: {
                Dataframe:""
            },
            //Values selected currently on the form
            selected_dependent_variable: "",
            selected_subject_variable: "",
            selected_within_variable: "",
            selected_between_factor: "",
            selected_correction_factor:'True',
            selected_effsize:"np2",
            Results:"",
            stats_show: false,
        };
        //Binding functions of the class
        this.fetchColumnNames = this.fetchColumnNames.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectDependentVariableChange = this.handleSelectDependentVariableChange.bind(this);
        this.handleSelectSubjectVariableChange = this.handleSelectSubjectVariableChange.bind(this);
        this.handleSelectWithinVariableChange = this.handleSelectWithinVariableChange.bind(this);
        this.handleSelectBetweenFactorChange = this.handleSelectBetweenFactorChange.bind(this);
        this.handleSelectCorrectionFactorChange = this.handleSelectCorrectionFactorChange.bind(this);
        this.handleSelectEffsizeChange = this.handleSelectEffsizeChange.bind(this);
        // // Initialise component
        // // - values of channels from the backend
        this.handleTabChange = this.handleTabChange.bind(this);
        this.fetchColumnNames();
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
        this.setState({stats_show: false})

        if (this.state.selected_dependent_variable===this.state.selected_between_factor)
        {
            alert("Variable <" + this.state.selected_dependent_variable +"> can not be selected as " +
                    "Dependent variable and Between factor. Please change your selection.")
            return
        }
        // Send the request
        API.get("calculate_mixed_anova",
                {
                    params: {
                        workflow_id: params.get("workflow_id"),
                        run_id: params.get("run_id"),
                        step_id: params.get("step_id"),
                        dependent_variable: this.state.selected_dependent_variable,
                        subject:this.state.selected_subject_variable,
                        within:this.state.selected_within_variable,
                        between: this.state.selected_between_factor,
                        correction:this.state.selected_correction_factor,
                        effsize: this.state.selected_effsize
                    },
                    paramsSerializer : params => {
                        return qs.stringify(params, { arrayFormat: "repeat" })
                    }
                }
        ).then(res => {
            this.setState({test_data: res.data})
            this.setState({Results:JSON.parse(res.data.Dataframe)});
            // console.log(res.data.DataFrame)
            this.setState({stats_show: true})
            this.setState({tabvalue:0})
        });
    }


    /**
     * Update state when selection changes in the form
     */
    handleSelectDependentVariableChange(event){
        this.setState( {selected_dependent_variable: event.target.value})
    }
    handleSelectSubjectVariableChange(event){
        this.setState( {selected_subject_variable: event.target.value})
    }
    handleSelectWithinVariableChange(event){
        this.setState( {selected_within_variable: event.target.value})
    }
    handleSelectBetweenFactorChange(event){
        this.setState( {selected_between_factor: event.target.value})
    }
    handleSelectCorrectionFactorChange(event){
        this.setState( {selected_correction_factor: event.target.value})
    }
    handleSelectEffsizeChange(event){
        this.setState( {selected_effsize: event.target.value})
    }
    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
                <Grid container direction="row">
                    <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                        <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                            Ancova Parameterisation
                        </Typography>
                        <hr/>
                        <form onSubmit={this.handleSubmit}>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Dependent Variable</InputLabel>
                                <Select
                                        labelId="dependent-selector-label"
                                        id="dependent-selector"
                                        value= {this.state.selected_dependent_variable}
                                        label="Dependent Variable"
                                        onChange={this.handleSelectDependentVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column in data with the dependent variable.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Subject Variable</InputLabel>
                                <Select
                                        labelId="Subject-selector-label"
                                        id="Subject-selector"
                                        value= {this.state.selected_subject_variable}
                                        label="Subject Variable"
                                        onChange={this.handleSelectSubjectVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column containing the between-subject identifier.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Within Variable</InputLabel>
                                <Select
                                        labelId="Within-selector-label"
                                        id="Within-selector"
                                        value= {this.state.selected_within_variable}
                                        label="Within Variable"
                                        onChange={this.handleSelectWithinVariableChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column containing the within-subject factor (repeated measurements).</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="column-selector-label">Between factor</InputLabel>
                                <Select
                                        labelId="Between-selector-label"
                                        id="Between-selector"
                                        value= {this.state.selected_between_factor}
                                        label="Between factor"
                                        onChange={this.handleSelectBetweenFactorChange}
                                >
                                    {this.state.column_names.map((column) => (
                                            <MenuItem value={column}>{column}</MenuItem>
                                    ))}
                                </Select>
                                <FormHelperText>Name of column containing the between factor.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="correction-selector-label">Correction</InputLabel>
                                <Select
                                        labelid="correction-selector-label"
                                        id="correction-selector"
                                        value= {this.state.selected_correction_factor}
                                        label="correction parameter"
                                        onChange={this.handleSelectCorrectionFactorChange}
                                >
                                    <MenuItem value={"True"}><em>True</em></MenuItem>
                                    <MenuItem value={"auto"}><em>auto</em></MenuItem>
                                </Select>
                                <FormHelperText>If True, return Greenhouse-Geisser corrected p-value.
                                    If ‘auto’ (default), compute Mauchly’s test of sphericity to determine whether the p-values needs to be corrected.</FormHelperText>
                            </FormControl>
                            <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                                <InputLabel id="effsize-selector-label">effsize</InputLabel>
                                <Select
                                        labelid="effsize-selector-label"
                                        id="effsize-selector"
                                        value= {this.state.selected_effsize}
                                        label="effsize parameter"
                                        onChange={this.handleSelectEffsizeChange}
                                >
                                    <MenuItem value={"np2"}><em>np2</em></MenuItem>
                                    <MenuItem value={"n2"}><em>n2</em></MenuItem>
                                    <MenuItem value={"ng2"}><em>ng2</em></MenuItem>
                                </Select>
                                <FormHelperText>Effect size. Must be one of ‘np2’ (partial eta-squared), ‘n2’ (eta-squared) or ‘ng2’(generalized eta-squared).</FormHelperText>
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
                                    <Tab label="Transformed" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <TabPanel value={this.state.tabvalue} index={0}>
                                <Grid style={{display: (this.state.stats_show ? 'block' : 'none')}}>
                                    <Grid>
                                        <Typography variant="h6" color='royalblue' sx={{ flexGrow: 1, textAlign: "center", padding:'20px'}} >
                                            Compute a two-way mixed model ANOVA. </Typography>
                                        <div style={{textAlign:"center"}}>
                                            <CSVLink data={this.state.Results}
                                                     filename={"Results.csv"}>Download</CSVLink>
                                        <JsonTable className="jsonResultsTable" rows = {this.state.Results}/>
                                        </div>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={this.state.tabvalue} index={1}>
                                <JsonTable className="jsonResultsTable" rows = {this.state.initialdataset}/>
                            </TabPanel>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}

export default Mixed_Anova;
