import React from "react";
// import actigraph1 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/1actigraphy_visualisation.png";
// import actigraph2 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/2actigraphy_visualisation.png";
// import actigraph3 from "C:/Users/George Ladikos/WebstormProjects/data-analytics-and-visualisation-frontend2/src/3actigraphy_visualisation.png";
// import act from "C:/neurodesktop-storage/runtime_config/workflow_1/run_1/step_1/output/actigraphy_visualisation.png"
//import "./styles.css";
import Plot from "react-plotly.js";
import API from "../../axiosInstance";
// import InnerHTML from 'dangerously-set-html-content'

// import PropTypes from 'prop-types';
import {
    Button, Divider,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select, Tab, Tabs, TextField, Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import {LoadingButton} from "@mui/lab";
import {Box} from "@mui/system";
import PropTypes from "prop-types";
//import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
const params = new URLSearchParams(window.location.search);

async function redirectToPage(workflow_id, run_id, step_id, function_name, bucket, file) {
    // Send the request
    let files_to_send = []
    for (let it=0 ; it< bucket.length;it++){
        files_to_send.push([bucket[it], file[it]])
    }

    API.put("function/navigation/",
            {
                workflow_id: workflow_id,
                run_id: run_id,
                step_id: step_id,
                function: function_name,
                metadata: {
                    // [["saved"] , "demo_sample_questionnaire.csv"],
                    "files": files_to_send
                },
            }
    ).then(res => {
        window.location.assign(res.data.url)
    });
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
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

class ActigraphyFunctionPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabvalue: 0,
            results_show: false,
            start_date: "None",
            end_date: "None",
            algorithm: "None",
            actigraphy_visualisation_1: 'http://localhost:8000/static/runtime_config/workflow_'
                                        + params.get("workflow_id") + '/run_' + params.get("run_id")
                                        + '/step_' + params.get("step_id") + '/output/1_actigraphy_visualisation.png',
            actigraphy_visualisation_2: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/2_actigraphy_visualisation.png',
            actigraphy_visualisation_3: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/3_actigraphy_visualisation.png',
            actigraphy_visualisation_4: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/4_actigraphy_visualisation.png',
            actigraphy_visualisation_5: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/5_actigraphy_visualisation.png',
            actigraphy_visualisation_6: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/6_actigraphy_visualisation.png',
            actigraphy_visualisation_7: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/7_actigraphy_visualisation.png',
            cole_kripke_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/ck_assessment.png',
            sadeh_scripp_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/sadeh_scripp_assessment.png',
            oakley_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/oakley_assessment.png',
            crespo_assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/crespo_assessment.png',
            assessment: 'http://localhost:8000/static/runtime_config/workflow_'
                    + params.get("workflow_id") + '/run_' + params.get("run_id")
                    + '/step_' + params.get("step_id") + '/output/assessment.png',
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitCK = this.handleSubmitCK.bind(this);
        this.handleSubmitSadehScripp = this.handleSubmitSadehScripp.bind(this);
        this.handleSubmitOakley = this.handleSubmitOakley.bind(this);
        this.handleSubmitCrespo = this.handleSubmitCrespo.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleSubmitAssessment = this.handleSubmitAssessment.bind(this);
        this.handleSelectAssessmentChange = this.handleSelectAssessmentChange.bind(this);
        this.handleSelectStartDateChange = this.handleSelectStartDateChange.bind(this);
        this.handleSelectEndDateChange = this.handleSelectEndDateChange.bind(this);
    }

    async handleSubmit() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_weekly_activity", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
            // this.setState({result_spindles: res.data})
            // this.setState({result_spindles_dataframe_1_table: JSON.parse(res.data.data_frame_1)})
            // // this.setState({result_spindles_dataframe_2_table: JSON.parse(res.data.data_frame_2)})
            //
            // console.log( JSON.parse(res.data["data_frame_1"]))

        });
    }

    async handleSubmitAssessment() {
        const params = new URLSearchParams(window.location.search);
        this.setState({results_show: true})
        API.get("/return_assessment_algorithm", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id"),
                algorithm: this.state.algorithm
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
            // this.setState({result_spindles: res.data})
            // this.setState({result_spindles_dataframe_1_table: JSON.parse(res.data.data_frame_1)})
            // // this.setState({result_spindles_dataframe_2_table: JSON.parse(res.data.data_frame_2)})
            //
            // console.log( JSON.parse(res.data["data_frame_1"]))

        });
    }

    async handleSubmitCK() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_cole_kripke", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
        });
    }

    async handleSubmitSadehScripp() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_sadeh_scripp", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
        });
    }

    async handleSubmitOakley() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_oakley", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
        });
    }

    async handleSubmitCrespo() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_crespo", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
            }
        }).then(res => {
            console.log("ACTIGRAPHIES")
            console.log(res.data)
        });
    }

    handleSelectAssessmentChange(event){
        this.setState({algorithm: event.target.value})
    }

    handleSelectStartDateChange(event){
        this.setState({start_date: event.target.value})
    }

    handleSelectEndDateChange(event){
        this.setState({end_date: event.target.value})
    }

    handleTabChange(event, newvalue){
        this.setState({tabvalue: newvalue})
    }

    render() {
        return (
        <Grid container direction="row">
            <Grid item xs={3} sx={{ borderRight: "1px solid grey"}}>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Actigraphies Parameterisation
                </Typography>
                <hr/>
                <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                    Data Preview
                </Typography>
                <hr/>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        File Name:
                    </Typography>
                    <Typography variant="p" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        actigraphy_test_data.csv
                    </Typography>
                <hr/>
                <FormControl sx={{m: 1, width:'90%'}} size={"small"} >
                    <FormHelperText><span style={{fontWeight: 'bold'}}>Selected Variables</span></FormHelperText>
                    <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                        Dates: {this.state.start_date} - {this.state.end_date}
                    </List>
                    <List style={{fontSize:'10px', backgroundColor:"powderblue", borderRadius:'10%'}}>
                        Assessment Algorithm: {this.state.algorithm}
                    </List>
                </FormControl>
                <hr/>
                <hr/>
                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmit();this.handleSubmitAssessment()}}>
                    {/*<FormControl sx={{m: 1, width:'90%'}} size={"small"}>*/}
                    {/*    <InputLabel id="column-selector-label">Columns</InputLabel>*/}
                    {/*    <Select*/}
                    {/*            labelId="column-selector-label"*/}
                    {/*            id="column-selector"*/}
                    {/*            value= {this.state.selected_independent_variables}*/}
                    {/*            multiple*/}
                    {/*            label="Column"*/}
                    {/*            onChange={this.handleSelectIndependentVariableChange}*/}
                    {/*    >*/}

                    {/*        {this.state.columns.map((column) => (*/}
                    {/*                <MenuItem value={column}>*/}
                    {/*                    {column}*/}
                    {/*                </MenuItem>*/}
                    {/*        ))}*/}
                    {/*    </Select>*/}
                    {/*    <FormHelperText>Select Independent Variables</FormHelperText>*/}
                    {/*    <Button onClick={this.selectAll}>*/}
                    {/*        Select All Variables*/}
                    {/*    </Button>*/}
                    {/*    <Button onClick={this.clear}>*/}
                    {/*        Clear Selections*/}
                    {/*    </Button>*/}
                    {/*</FormControl>*/}
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="startdate-label">Start Date</InputLabel>
                        <Select
                                labelId="startdate-label"
                                id="startdate-selector"
                                value= {this.state.start_date}
                                label="startdate"
                                onChange={this.handleSelectStartDateChange}
                        >
                            <MenuItem value={"2022/07/18 12:00:00"}><em>2022-07-18 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/19 12:00:00"}><em>2022-07-19 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07-20 12:00:00"}><em>2022-07-20 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/21 12:00:00"}><em>2022-07-21 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/22 12:00:00"}><em>2022-07-22 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/23 12:00:00"}><em>2022-07-23 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/24 12:00:00"}><em>2022-07-24 12:00:00</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="enddate-label">End Date</InputLabel>
                        <Select
                                labelId="enddate-label"
                                id="enddate-selector"
                                value= {this.state.end_date}
                                label="enddate"
                                onChange={this.handleSelectEndDateChange}
                        >
                            <MenuItem value={"2022/07/18 12:00:00"}><em>2022-07-18 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/19 12:00:00"}><em>2022-07-19 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/20 12:00:00"}><em>2022-07-20 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/21 12:00:00"}><em>2022-07-21 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/22 12:00:00"}><em>2022-07-22 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/23 12:00:00"}><em>2022-07-23 12:00:00</em></MenuItem>
                            <MenuItem value={"2022/07/24 12:00:00"}><em>2022-07-24 12:00:00</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="rotation-label">Assessment Algorithm</InputLabel>
                        <Select
                                labelId="assessment-label"
                                id="assessment-selector"
                                value= {this.state.algorithm}
                                label="assessment"
                                onChange={this.handleSelectAssessmentChange}
                        >
                            <MenuItem value={"Cole - Kripke"}><em>Cole - Kripke</em></MenuItem>
                            <MenuItem value={"Sadeh - Scripp"}><em>Sadeh - Scripp</em></MenuItem>
                            <MenuItem value={"Oakley"}><em>Oakley</em></MenuItem>
                            <MenuItem value={"Crespo"}><em>Crespo</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the assessment algorithm to run on the dataset.</FormHelperText>
                    </FormControl>
                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                    {/*<script>*/}
                    {/*    var btn = document.getElementById("myBtn");*/}
                    {/*    btn.addEventListener("click", this.handleSubmit);*/}
                    {/*    btn.addEventListener("click", this.handleSubmitCK);*/}
                    {/*</script>*/}
                    <hr/>
                </form>
                <Button variant="contained" color="primary" type="button" size="large"
                        onClick={redirectToPage.bind(this,1, 1, 6, "actigraphy_page", ["saved"], ["psg1 anonym2.edf"])}
                >
                    Show results
                </Button>
            </Grid>
                <Grid item xs={9} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Assessment Algorithms Results
                    </Typography>
                    <hr/>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs scrollable={true} value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">
                                <Tab label="Initial" {...a11yProps(0)} />
                                <Tab label="Results" {...a11yProps(1)} />
                            </Tabs>
                        </Box>

                    </Box>
                    <TabPanel value={this.state.tabvalue} index={0}>
                    </TabPanel>
                    <TabPanel value={this.state.tabvalue} index={1}>
                        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>
                            {this.state.algorithm} Results Day 1
                        </Typography>
                        {/*<Grid item xs={2}*/}
                        {/*      style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}} alignContent={'right'}>*/}
                        <img src={this.state.assessment + "?random=" + new Date().getTime()}
                             srcSet={this.state.assessment + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                             loading="lazy"
                        />
                        <hr className="result"/>
                    </TabPanel>
                </Grid>
                {/*<Grid item xs={4} sx={{ borderRight: "1px solid grey"}} alignContent={'right'}>*/}
                {/*    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>*/}
                {/*        Actigraphy Visualisations*/}
                {/*    </Typography>*/}
                {/*    <hr/>*/}
                {/*    <Box sx={{ width: '100%' }}>*/}
                {/*        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>*/}
                {/*            <Tabs variant="scrollable" scrollButtons="auto" value={this.state.tabvalue} onChange={this.handleTabChange} aria-label="basic tabs example">*/}
                {/*                <Tab label="Initial" {...a11yProps(0)} />*/}
                {/*                <Tab label="Visualisation Results Day 1" {...a11yProps(1)} />*/}
                {/*                <Tab label="Visualisation Results Day 2" {...a11yProps(2)} />*/}
                {/*                <Tab label="Visualisation Results Day 3" {...a11yProps(3)} />*/}
                {/*                <Tab label="Visualisation Results Day 4" {...a11yProps(4)} />*/}
                {/*                <Tab label="Visualisation Results Day 5" {...a11yProps(5)} />*/}
                {/*                <Tab label="Visualisation Results Day 6" {...a11yProps(6)} />*/}
                {/*                <Tab label="Visualisation Results Day 7" {...a11yProps(7)} />*/}
                {/*            </Tabs>*/}
                {/*        </Box>*/}

                {/*    </Box>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={0}>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={1}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 1*/}
                {/*        </Typography>*/}
                {/*        /!*<Grid item xs={2}*!/*/}
                {/*        /!*      style={{display: (this.state.results_show ? 'block' : 'none'), padding: '20px'}} alignContent={'right'}>*!/*/}
                {/*        <img src={this.state.actigraphy_visualisation_1 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_1 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={2}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 2*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_2 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_2 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={3}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 3*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_3 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_3 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={4}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 4*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_4 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_4 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={5}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 5*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_5 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_5 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={6}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 6*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_6 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_6 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}
                {/*    <TabPanel value={this.state.tabvalue} index={7}>*/}
                {/*        <Typography variant="h5" sx={{flexGrow: 1, textAlign: "center"}} noWrap>*/}
                {/*            Visualisation Results Day 7*/}
                {/*        </Typography>*/}
                {/*        <img src={this.state.actigraphy_visualisation_7 + "?random=" + new Date().getTime()}*/}
                {/*             srcSet={this.state.actigraphy_visualisation_7 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}*/}
                {/*             loading="lazy"*/}
                {/*        />*/}
                {/*        <hr className="result"/>*/}
                {/*    </TabPanel>*/}

                {/*    /!*<img src={this.state.actigraphy_visualisation_1} srcSet={this.state.actigraphy_visualisation_1} align={'right'} loading="lazy"/>*!/*/}

                {/*    /!*<img src={this.state.actigraphy_visualisation_2} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_3} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_4} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_5} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_6} align={'right'} loading="lazy"/>*!/*/}
                {/*    /!*<img src={this.state.actigraphy_visualisation_7} align={'right'} loading="lazy"/>*!/*/}
                {/*</Grid>*/}
        </Grid>
        );
    }
}

export default ActigraphyFunctionPage;
