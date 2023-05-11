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
    Select, TextField, Typography
} from "@mui/material";
import JsonTable from "ts-react-json-table";
import ActigraphyDatatable from "../freesurfer/datatable/ActrigraphyDatatable";
import {LoadingButton} from "@mui/lab";
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

class ActigraphyFunctionPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
        };
        //Binding functions of the class
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitCK = this.handleSubmitCK.bind(this);
        this.handleSubmitSadehScripp = this.handleSubmitSadehScripp.bind(this);
        this.handleSubmitOakley = this.handleSubmitOakley.bind(this);
        this.handleSubmitCrespo = this.handleSubmitCrespo.bind(this);
    }

    async handleSubmit() {
        const params = new URLSearchParams(window.location.search);
        API.get("/return_weekly_activity", {
            params: {
                workflow_id: params.get("workflow_id"),
                run_id: params.get("run_id"),
                step_id: params.get("step_id")
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
                    <FormHelperText>Selected Dates</FormHelperText>
                    {/*<List style={{fontSize:'9px', backgroundColor:"powderblue", borderRadius:'10%'}}>*/}
                    {/*    {this.state.selected_independent_variables.map((column) => (*/}
                    {/*            <ListItem disablePadding*/}
                    {/*            >*/}
                    {/*                <ListItemText*/}
                    {/*                        primaryTypographyProps={{fontSize: '10px'}}*/}
                    {/*                        primary={'•  ' + column}*/}
                    {/*                />*/}
                    {/*            </ListItem>*/}
                    {/*    ))}*/}
                    {/*</List>*/}
                </FormControl>
                <hr/>
                <hr/>
                <form onSubmit={(event) => {event.preventDefault(); this.handleSubmit();this.handleSubmitCK();this.handleSubmitSadehScripp();this.handleSubmitOakley();this.handleSubmitCrespo()}}>
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
                        <InputLabel id="rotation-label">Start Date</InputLabel>
                        <Select
                                labelId="rotation-label"
                                id="rotation-selector"
                                value= {this.state.selected_rotation}
                                label="rotation"
                                onChange={this.handleSelectRotationChange}
                        >
                            <MenuItem value={"2022-07-18 12:00:00"}><em>2022-07-18 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-19 12:00:00"}><em>2022-07-19 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-20 12:00:00"}><em>2022-07-20 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-21 12:00:00"}><em>2022-07-21 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-22 12:00:00"}><em>2022-07-22 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-23 12:00:00"}><em>2022-07-23 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-24 12:00:00"}><em>2022-07-24 12:00:00</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
                    </FormControl>
                    <FormControl sx={{m: 1, width:'90%'}} size={"small"}>
                        <InputLabel id="rotation-label">End Date</InputLabel>
                        <Select
                                labelId="rotation-label"
                                id="rotation-selector"
                                value= {this.state.selected_rotation}
                                label="rotation"
                                onChange={this.handleSelectRotationChange}
                        >
                            <MenuItem value={"2022-07-18 12:00:00"}><em>2022-07-18 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-19 12:00:00"}><em>2022-07-19 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-20 12:00:00"}><em>2022-07-20 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-21 12:00:00"}><em>2022-07-21 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-22 12:00:00"}><em>2022-07-22 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-23 12:00:00"}><em>2022-07-23 12:00:00</em></MenuItem>
                            <MenuItem value={"2022-07-24 12:00:00"}><em>2022-07-24 12:00:00</em></MenuItem>
                        </Select>
                        <FormHelperText>Select the dates to visualise the actigraphy data.</FormHelperText>
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
                <Grid item xs={5} sx={{ borderRight: "1px solid grey"}}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Assessment Algorithms
                    </Typography>
                    <hr/>
                    {/*<img src={this.state.cole_kripke_assessment} align={'center'}/>*/}
                    {/*<img src={this.state.sadeh_scripp_assessment} align={'center'}/>*/}
                    {/*<img src={this.state.oakley_assessment} align={'center'}/>*/}
                    {/*<img src={this.state.crespo_assessment} align={'center'}/>*/}
                </Grid>
                <Grid item xs={4} sx={{ borderRight: "1px solid grey"}} alignContent={'right'}>
                    <Typography variant="h5" sx={{ flexGrow: 1, textAlign: "center" }} noWrap>
                        Actigraphy Visualisations
                    </Typography>
                    <hr/>
                    {/*<img src={this.state.actigraphy_visualisation_1} srcSet={this.state.actigraphy_visualisation_1} align={'right'} loading="lazy"/>*/}
                    <img src={this.state.actigraphy_visualisation_1 + "?random=" + new Date().getTime()}
                         srcSet={this.state.actigraphy_visualisation_1 + "?random=" + new Date().getTime() +'?w=164&h=164&fit=crop&auto=format&dpr=2 2x'}
                         loading="lazy"
                    />
                    {/*<img src={this.state.actigraphy_visualisation_2} align={'right'} loading="lazy"/>*/}
                    {/*<img src={this.state.actigraphy_visualisation_3} align={'right'} loading="lazy"/>*/}
                    {/*<img src={this.state.actigraphy_visualisation_4} align={'right'} loading="lazy"/>*/}
                    {/*<img src={this.state.actigraphy_visualisation_5} align={'right'} loading="lazy"/>*/}
                    {/*<img src={this.state.actigraphy_visualisation_6} align={'right'} loading="lazy"/>*/}
                    {/*<img src={this.state.actigraphy_visualisation_7} align={'right'} loading="lazy"/>*/}
                </Grid>
        </Grid>
        );
    }
}

export default ActigraphyFunctionPage;
