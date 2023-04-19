import React, {useContext, useEffect} from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Button, ButtonGroup, Divider, Typography,
} from "@mui/material";
import {display} from "@mui/system";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import API from "../../axiosInstance";
import {useNavigate} from "react-router-dom";
import {withRouter} from '../withRouter';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import {red} from "@mui/material/colors";
import SurvivalAnalysisKaplanMeier from "../../pages/hypothesis_testing/SurvivalAnalysisKaplanMeier";
import General_Stats_Average from "../../pages/hypothesis_testing/General_Stats_Average";


// import {useHistory} from "react-router-dom";
// import {AuthContext} from "../contexts/AuthContext";
//
// import {servicesInfo} from "../servicesInfo";
// import InitialPageService from "./InitialPageService";


function SendIcon() {
    return null;
}

function DraftsIcon() {
    return null;
}

function InboxIcon() {
    return null;
}

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


function WelcomePage() {
    useEffect(() => {
        document.title = ' MES-CoBraD | Analytics Engine'
    }, [])
    const navigate = useNavigate();
    const [dashboardMode, setDashboardMode] = React.useState("dev");
    const [notdashboardMode, setNotDashboardMode] = React.useState("user");

    const changeMode = () => {
        if (dashboardMode === "dev"){
            setDashboardMode("user")
            setNotDashboardMode("dev")
        }
        else{
            setDashboardMode("dev")
            setNotDashboardMode("user")

        }
    }

    return (
            <React.Fragment>
                {/*<h1>{document.title}</h1>*/}
                <h1>MES-CoBraD | Analytics Engine</h1>
                <h2 style={{color: dashboardMode === "dev" ? "red" : "#1976d2"}}> {dashboardMode} Dashboard </h2>
                <h4>To change it please press the button below</h4>
                <Button
                        variant="contained"
                        size="medium"
                        endIcon={<DashboardIcon sx={{right: "0%", top: "20%", position: "absolute"}} />}
                        // endIcon={}
                        sx={{backgroundColor: dashboardMode !== "dev" ? "red" : "default"}}
                        onClick= {changeMode}
                >
                    Change to {notdashboardMode} dashboard
                    {/*<SendIcon/>*/}
                </Button>
                <div class="list-container" style={{display: 'flex'}}>
                    {/*<form onSubmit={async (event) => {*/}
                    {/*    event.preventDefault();*/}

                    {/*    // Send the request*/}
                    {/*    API.put("function/navigation/",*/}
                    {/*            {*/}
                    {/*                run_id: "1",*/}
                    {/*                step_id: "1",*/}
                    {/*                function : "normality",*/}
                    {/*                metadata: {*/}
                    {/*                    // [["saved"] , "demo_sample_questionnaire.csv"],*/}
                    {/*                    "files" : [ [["saved"] , ["psg1 anonym2.edf"]]]*/}
                    {/*                },*/}
                    {/*            }*/}
                    {/*    ).then(res => {*/}
                    {/*        console.log("BACK_________________________")*/}
                    {/*        console.log("BACK")*/}
                    {/*        console.log(res.data.url)*/}
                    {/*        window.location.assign(res.data.url)*/}
                    {/*        // navigate(res.data.url);*/}
                    {/*    });*/}
                    {/*}}>*/}
                    {/*    <Button variant="contained" color="primary" type="submit">*/}
                    {/*        Submit*/}
                    {/*    </Button>*/}
                    {/*</form>*/}

                    <ButtonGroup
                            orientation="vertical"
                            sx={{width: '25%', bgcolor: 'background.paper', padding:'5px'}}
                            // component="nav"
                            aria-label="vertical outlined button group"
                            // aria-labelledby="nested-list-subheader"
                           >
                        <h2 sx= {{color: "grey"}}>
                            Timeseries Techniques
                        </h2>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                // endIcon={}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick= {redirectToPage.bind(this,1, 1, 1, "auto_correlation", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Auto Correlation
                            {/*<SendIcon/>*/}
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}

                                onClick={redirectToPage.bind(this,1, 1, 1, "partial_auto_correlation", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Partial Auto Correlation
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}

                                onClick={redirectToPage.bind(this,1, 1, 1, "welch", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            (OLD) Power Spectral Density - Welch
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}

                                onClick={redirectToPage.bind(this,1, 1, 1, "find_peaks", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Find Peaks
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "power_spectral_density_main", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Power Spectral Density - Main
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "power_spectral_density_periodogram", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            (OLD)Power Spectral Density - Periodogram
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "stft", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Short Time Fourier Transform
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "power_spectral_density_multitaper", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            (OLD)Power Spectral Density - Multitaper
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "alpha_delta_ratio", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            (OLD) Alpha Delta Ratio
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "predictions", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Predictions
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "artifacts", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Artifacts
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "alpha_variability", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            (OLD?)  Alpha Variability
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "asymmetry_indices", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Asymmetry Indices
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "sleep_statistic", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"])}
                        >
                            Sleep Statistic
                        </Button>
                        <Button
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "spectogram_bandpower", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"])}
                        >
                            Spectogram Bandpower
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "slowwave_spindle", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"])}
                        >
                            Slow Waves / Spindles
                        </Button>
                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "slow_waves", ["saved"], ["psg1 anonym2.edf"])}*/}
                        {/*>*/}
                        {/*    Slow waves*/}
                        {/*</Button>*/}
                        {/*/!*<Divider/>*!/*/}
                        {/*<Button*/}
                        {/*        // variant="outlined"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "spindles", ["saved"], ["psg1 anonym2.edf"])}*/}
                        {/*>*/}
                        {/*    Spindles*/}
                        {/*</Button>*/}
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "eeg_viewer", ["saved"], ["ps_case_edf.edf"])}
                        >
                            EEG Viewer
                        </Button>
                        {/*<Divider/>*/}
                        {/*<Button*/}
                        {/*        // variant="outlined"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "eeg_viewer_old", ["saved"], ["psg1 anonym2.edf"])}*/}
                        {/*>*/}
                        {/*    EEG Viewer Old*/}
                        {/*</Button>*/}
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "envelop_trend_analysis", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Envelope Trend Analysis
                        </Button>
                        {/*<Link*/}
                        {/*        component={Link}*/}
                        {/*        variant="h6"*/}
                        {/*        href="/periodogram"*/}
                        {/*        // href="/eeg?eeg_function=periodogram"*/}
                        {/*>*/}
                        {/*    <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}}*/}
                        {/*                    component={"a"}>*/}
                        {/*        Power Spectral Density - Periodogram>*/}
                        {/*    </ListItemButton>*/}
                        {/*</Link>*/}


                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "actigraphy_viewer", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Actigraphy Viewer
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "actigraphy_viewer_general", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Actigraphy General Viewer
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup
                            orientation="vertical"
                            sx={{width: '25%', bgcolor: 'background.paper', padding:'5px'}}

                            // sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            // component="nav"
                            // aria-labelledby="nested-list-subheader"
                            >
                        <h2 sx= {{color: "grey"}}>
                            MRI Techniques
                        </h2>

                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1,1, 3, "mri_viewer", ["saved"], ["ucl_test.nii"])}
                        >
                           MRI Viewer
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 3, "free_surfer", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Free Surfer
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 3, "recon_all_results", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Recon-All Results
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 3, "samseg_results", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Samseg Results
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup
                            orientation="vertical"
                            sx={{width: '25%', bgcolor: 'background.paper', padding:'5px'}}
                            >
                        <h2> Hypothesis Testing</h2>
                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        onClick={redirectToPage.bind(this,1,1, 2, "level", ["saved"], ["demo_sample_questionnaire.csv"])}*/}
                        {/*>*/}
                        {/*    Level >*/}
                        {/*</Button>*/}
                        {/*<Divider/>*/}
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>General Statistics</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "general_stats_average", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Average
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Normality & Homoscedasticity</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "normality", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Normality test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}

                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality_anderson", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "normality_anderson", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Normality test Anderson
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "data_transform", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "data_transform", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Transform data
                                </Button>
                                {/*<Divider/>*/}

                                {/*<Divider/>*/}
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "data_transform_anova", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Data Transformation for use in ANOVA
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "homoscedasticity", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "homoscedasticity", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Homoscedasticity check
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Correlation</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "spearman_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Spearman Correlation
                                </Button>

                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "pearson_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Pearson Correlation
                                </Button>
                                <Button
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "biweight_midcorrelation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Biweight midcorrelation
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "percentage_bend_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Percentage bend correlation
                                </Button>
                                <Button
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "shepherd_pi_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Shepherd’s pi correlation
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "skipped_spearman_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Skipped spearman correlation
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "point_biserial_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Point Biserial Correlation
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "kendalltau_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Kendalltau Correlation
                                </Button>
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "canonical_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Canonical Correlation
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mediation_analysis", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Mediation Analysis
                                </Button>

                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Statistical Tests</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "welch_t_test", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Welch t-test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "independent_t_test", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Independent t-test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "t_test_two_samples", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    t-test on TWO RELATED samples of scores
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "mann_whitney_u_rank", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Mann-Whitney U rank test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "wilcoxon_signed_rank", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Wilcoxon signed-rank test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "alexander_govern", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Alexander Govern test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "kruskal_wallis_h", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Kruskal-Wallis H-test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "one_way_anova", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    one-way ANOVA
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "wilcoxon_rank_statistic", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    Wilcoxon rank-sum statistic
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "one_way_chi_square", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    One-way chi-square test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,1,1, 2, "mutliple_comparisons", ["saved"], ["demo_sample_questionnaire.csv"])}
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                        Multiple Comparisons
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        size="medium"
                                        variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "fisherexact",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Fisher Exact
                                </Button>
                                <Button
                                        size="medium"
                                        // variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mcnemar",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    McNemar
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mixed_anova",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Mixed ANOVA
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Classification</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        variant="contained"
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LDA", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Classification analysis (LDA)
                                </Button>
                                {/*<Button*/}
                                {/*        // component={Link}*/}
                                {/*        // variant="h6"*/}
                                {/*        // href="/SVC"*/}
                                {/*        size="medium"*/}
                                {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}*/}
                                {/*        onClick={redirectToPage.bind(this,1,1, 2, "SVC", ["saved"], ["demo_sample_questionnaire.csv"])}*/}

                                {/*>*/}
                                {/*    /!*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*!/*/}
                                {/*        SVC*/}
                                {/*    /!*</ListItemButton>/*!/*/}
                                {/*</Button>*/}
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Clustering</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                        <Button
                                size="medium"
                                fullWidth
                                variant="contained"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1,1, 2, "KMeans", ["saved"], ["demo_sample_questionnaire.csv"])}

                        >
                            KMeans
                        </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Regression</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        fullWidth
                                        variant = "contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "linear_regression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}

                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    Linear Regression
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LassoRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}

                                >
                                    Lasso Regression
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        fullWidth
                                        variant = "contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "ElasticNet", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}

                                >
                                    ElasticNet
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "GeneralizedEstimatingEquations", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}

                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    Generalized Estimating Equations
                                    {/*</ListItemButton>*/}
                                </Button>

                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        variant = "contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "RidgeRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    Ridge Regression
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "SGDRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                        fullWidth
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    SGD Regression
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        variant = "contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "HuberRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                        fullWidth
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    Huber Regression
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LinearSVR", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    LinearSVR
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        variant = "contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LinearSVC", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}

                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    LinearSVC
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LogisticRegressionPinguin", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                        fullWidth
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    Logistic Regression Pinguin
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        variant = "contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LogisticRegressionStatsmodels", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                        fullWidth
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    Logistic Regression Statsmodels
                                    {/*</ListItemButton>*/}
                                </Button>


                                <Button
                                        size="medium"

                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysiscoxregression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Cox regression
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "linearmixedeffectsmodel", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Linear Mixed Effects Model
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Survival Analysis (frequencies)</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        size="medium"
                                        variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisriskratiosimple", "", "")}
                                >
                                    Risk Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisriskdifferencesimple", "", "")}
                                >
                                    Risk Difference
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisNNTsimple", "", "")}
                                >
                                    Number needed to treat
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisoddsratiosimple", "", "")}
                                >
                                    Odds Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisincidencerateratiosimple","","")}
                                >
                                    Incidence rate ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisincidenceratedifferencesimple","","")}
                                >
                                    Incidence rate difference
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Survival Analysis</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                                <Button
                                        size="medium"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisriskratiodataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Risk Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        // variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisriskdifferencedataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Risk Difference
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisNNTdataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Number needed to treat
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        // variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisoddsratiodataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Odds Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisincidencerateratiodataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Incidence Rate Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        // variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisincidenceratedifferencedataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Incidence Rate Difference
                                </Button>
                                <Button
                                        size="medium"
                                        variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysistimevaryingcovariates", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Time Varying Covariates
                                </Button>
                                <Button
                                        size="medium"
                                        // variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysiskaplanmeier", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                >
                                    Kaplan-Meier
                                </Button>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                            >
                                <Typography>Factor Analysis</Typography>
                            </AccordionSummary>
                            <Button
                                    // component={Link}
                                    // variant="h6"
                                    // href="/LinearRegression"
                                    size="medium"
                                    variant="contained"
                                    endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                    // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"])}
                                    onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "FactorAnalysis", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                                    fullWidth
                            >
                                {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                Factor Analysis
                                {/*</ListItemButton>*/}
                            </Button>
                            <AccordionDetails orientation="vertical">
                            </AccordionDetails>
                        </Accordion>
                        <Button
                                // component={Link}
                                // variant="h6"
                                size="medium"
                                fullWidth
                                // href="/PCA"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1,1, 2, "PCA", ["saved"], ["demo_sample_questionnaire.csv"])}

                        >
                            Principal Component Analysis
                        </Button>
                        <Button
                                size="medium"
                                variant="contained"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "ancova",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                        >
                            Ancova
                        </Button>
                        <Button
                                size="medium"
                                // variant="contained"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "principalcomponentanalysis",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"])}
                        >
                            Principal Component Analysis
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "slowwave_spindle", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"])}
                        >
                            Slow Waves / Spindles
                        </Button>
                    </ButtonGroup>
                    <ButtonGroup
                            orientation="vertical"
                            sx={{width: '25%', bgcolor: 'background.paper', padding:'5px'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                    >
                        <h2 sx= {{color: "grey"}}>
                            Miscellaneous
                        </h2>
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1,1, 3, "dashboard", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Dashboard
                        </Button>
                    </ButtonGroup>

                    {/*<List*/}
                    {/*        sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}*/}
                    {/*        component="nav"*/}
                    {/*        aria-labelledby="nested-list-subheader"*/}
                    {/*        subheader={*/}
                    {/*            <ListSubheader component="div" id="nested-list-subheader">*/}
                    {/*                <h2>Pending pages</h2>*/}
                    {/*            </ListSubheader>*/}
                    {/*        }></List>*/}
                </div>
            </React.Fragment>
    );
}

export default WelcomePage;
