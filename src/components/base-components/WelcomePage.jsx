import React, {useEffect} from 'react';
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
import General_Stats_Min from "../../pages/hypothesis_testing/General_Stats_Min";
import Actigraphy_Cosinor from "./Actigraphy_Cosinor";
import Actigraphy_Metrics from "./Actigraphy_Metrics";
import General_Stats_Zscore from "../../pages/hypothesis_testing/General_Stats_Zscore";
import General_Stats_Std from "../../pages/hypothesis_testing/General_Stats_Std";
import General_Stats_Cov from "../../pages/hypothesis_testing/General_Stats_Cov";
import Exploratory_Factor_Analysis_extract_latent_structure
    from "../../pages/hypothesis_testing/Exploratory_Factor_Analysis_extract_latent_structure";


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

async function redirectToPage(workflow_id, run_id, step_id, function_name, bucket, file, group = []) {
    // Send the request
    let files_to_send = []
    for (let it=0 ; it< bucket.length;it++){
        if (group === undefined || group.length == 0){
            files_to_send.push({'bucket': bucket[it], 'file': file[it], 'group_name': ""})
        } else {
            files_to_send.push({'bucket': bucket[it], 'file': file[it], 'group_name': group[it]})
        }
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
    const [dashboardMode, setDashboardMode] = React.useState("user");
    const [notdashboardMode, setNotDashboardMode] = React.useState("dev");

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
                                // sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick= {redirectToPage.bind(this,1, 1, 1, "auto_correlation", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Auto Correlation
                            {/*<SendIcon/>*/}
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}

                                onClick={redirectToPage.bind(this,1, 1, 1, "partial_auto_correlation", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Partial Auto Correlation
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,1, 1, 1, "welch", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            (OLD) Power Spectral Density - Welch
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,1, 1, 1, "find_peaks", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Find Peaks
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "back_average", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Back Average
                        </Button>
                        <Button
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "power_spectral_density_main", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Power Spectral Density - Main
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,1, 1, 1, "power_spectral_density_periodogram", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            (OLD)Power Spectral Density - Periodogram
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "stft", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Short Time Fourier Transform
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,1, 1, 1, "power_spectral_density_multitaper", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            (OLD)Power Spectral Density - Multitaper
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,1, 1, 1, "alpha_delta_ratio", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            (OLD) Alpha Delta Ratio
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "predictions", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Predictions
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "artifacts", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Artifacts
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,1, 1, 1, "alpha_variability", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            (OLD?)  Alpha Variability
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "asymmetry_indices", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Asymmetry Indices
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "sleep_statistic", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"], [])}
                        >
                            Sleep Statistic
                        </Button>
                        <Button
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "spectogram_bandpower", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"], [])}
                        >
                            Spectrogram Bandpower
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "slowwave_spindle", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"], [])}
                        >
                            Slow Waves / Spindles
                        </Button>
                        <Button
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 5, "sleep_stage_classification", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Sleep Stage Classification
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 7, "manual_sleep_stage_classification", ["saved", "saved", "saved", "saved"], ["psg1 anonym2.edf", "auto_hypno_annotations.txt", "auto_hypno_annotations1.txt", "auto_hypno_annotations2.txt"], [])}
                        >
                            Manual Sleep Stage Classification
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "slowwaves", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"], [])}
                        >
                            Slow waves
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 4, "spindles", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"], [])}
                        >
                            Spindles
                        </Button>
                        <Divider/>
                        <Button
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "eeg_viewer", ["saved"], ["ps_case_edf.edf"], [])}
                        >
                            EEG Viewer
                        </Button>
                        {/*<Divider/>*/}
                        {/*<Button*/}
                        {/*        // variant="outlined"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "eeg_viewer_old", ["saved"], ["psg1 anonym2.edf"], [])}*/}
                        {/*>*/}
                        {/*    EEG Viewer Old*/}
                        {/*</Button>*/}
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "envelop_trend_analysis", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Envelope Trend Analysis
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                // sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,5, 3, 8, "group_sleep_analysis",
                                        ["saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved",
                                    "saved"], ["uu_sleep/Subject A_Sessio01.csv",
                                            "uu_sleep/Subject A_Sessio01.fif",
                                            "uu_sleep/Subject A_Sessio02.csv",
                                            "uu_sleep/Subject A_Sessio02.fif",
                                            "uu_sleep/Subject B_Sessio01.csv",
                                            "uu_sleep/Subject B_Sessio01.fif",
                                            "uu_sleep/Subject B_Sessio02.csv",
                                            "uu_sleep/Subject B_Sessio02.fif",
                                            "uu_sleep/Subject C_Sessio01.csv",
                                            "uu_sleep/Subject C_Sessio01.fif",
                                            "uu_sleep/Subject C_Sessio02.csv",
                                            "uu_sleep/Subject C_Sessio02.fif",
                                            "uu_sleep/Subject D_Sessio01.csv",
                                            "uu_sleep/Subject D_Sessio01.fif",
                                            "uu_sleep/Subject D_Sessio02.csv",
                                            "uu_sleep/Subject D_Sessio02.fif",
                                        ], ["1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                        ])}
                        >
                            Group Sleep Sensitivity Analysis
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                // sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,2, 2, 8, "eeg_hypno_upsampling",
                                        ["saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved",
                                            "saved"], ["uu_sleep/Subject A_Sessio01.csv",
                                            "uu_sleep/Subject A_Sessio01.fif",
                                            "uu_sleep/Subject A_Sessio02.csv",
                                            "uu_sleep/Subject A_Sessio02.fif",
                                            "uu_sleep/Subject B_Sessio01.csv",
                                            "uu_sleep/Subject B_Sessio01.fif",
                                            "uu_sleep/Subject B_Sessio02.csv",
                                            "uu_sleep/Subject B_Sessio02.fif",
                                            "uu_sleep/Subject C_Sessio01.csv",
                                            "uu_sleep/Subject C_Sessio01.fif",
                                            "uu_sleep/Subject C_Sessio02.csv",
                                            "uu_sleep/Subject C_Sessio02.fif",
                                            "uu_sleep/Subject D_Sessio01.csv",
                                            "uu_sleep/Subject D_Sessio01.fif",
                                            "uu_sleep/Subject D_Sessio02.csv",
                                            "uu_sleep/Subject D_Sessio02.fif",
                                        ], ["1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "1",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                            "2",
                                        ])}
                        >
                            EEG Upsampling - Group
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                // sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,2, 3, 14, "eeg_hypno_upsampling",
                                        ["saved", "saved"], ["uu_sleep/Subject A_Sessio01.csv" , "uu_sleep/Subject A_Sessio01.fif"], [])}
                        >
                            EEG Upsampling - Single
                        </Button>
                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "group_sleep_sensitivity_analysis", ["saved"], ["psg1 anonym2.edf"], [])}*/}
                        {/*>*/}
                        {/*    Group Sleep Sensitivity Analysis*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "group_sleep_sensitivity_analysis_add_subject", ["saved"], ["psg1 anonym2.edf"], [])}*/}
                        {/*>*/}
                        {/*    Group Sleep Sensitivity Analysis Add Subject*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "group_sleep_sensitivity_analysis_add_subject_final", ["saved"], ["psg1 anonym2.edf"], [])}*/}
                        {/*>*/}
                        {/*    Group Sleep Sensitivity Analysis Add Subject Final*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "group_common_channels_across_subjects", ["saved"], ["psg1 anonym2.edf"], [])}*/}
                        {/*>*/}
                        {/*    Group Sleep Sensitivity Analysis Across Subjects*/}
                        {/*</Button>*/}
                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 1, "group_sleep_analysis_sensitivity_add_subject_add_channels_final", ["saved"], ["psg1 anonym2.edf"], [])}*/}
                        {/*>*/}
                        {/*    Group Sleep Sensitivity Analysis Add Subject Add Channels Final*/}
                        {/*</Button>*/}
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
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "actigraphy_viewer", ["saved"], ["psg1 anonym2.edf"], [])}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                        >
                            Actigraphy Viewer
                        </Button>
                        <Divider/>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 1, "actigraphy_viewer_general", ["saved"], ["psg1 anonym2.edf"], [])}
                                sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                        >
                            Actigraphy General Viewer
                        </Button>
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 15, "actigraphy_page", ["saved"], ["0345-024_18_07_2022_13_00_00_New_Analysis.csv"], [])}
                        >
                            Actigraphy Assessment Page
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "actigraphy_cosinor", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/0345-024_18_07_2022_13_00_00_New_Analysis.csv"], [])}
                        >
                            Actigraphy Cosinor
                        </Button>
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 15, "actigraphy_masking", ["saved"], ["0345-024_18_07_2022_13_00_00_New_Analysis.csv"])}
                        >
                            Actigraphy Masking
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 15, "actigraphy_functional_linear_modelling", ["saved"], ["0345-024_18_07_2022_13_00_00_New_Analysis.csv"], [])}
                        >
                            Actigraphy Functional Linear Modelling
                       </Button>
                        <Button
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 15, "actigraphy_singular_spectrum_analysis", ["saved"], ["0345-024_18_07_2022_13_00_00_New_Analysis.csv"])}
                        >
                            Actigraphy Singular Spectrum Analysis
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 15, "actigraphy_detrended_fluctuation_analysis", ["saved"], ["0345-024_18_07_2022_13_00_00_New_Analysis.csv"])}
                        >
                            Actigraphy Detrended Fluctuation Analysis
                        </Button>
                        <Button
                                // variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "actigraphy_metrics", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/0345-024_18_07_2022_13_00_00_New_Analysis.csv"], [])}
                        >
                            Actigraphy Metrics
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
                                onClick={redirectToPage.bind(this,1,1, 3, "mri_viewer", ["saved", "saved", "saved", "saved"], ["006662_SpcIR-T2w_FLR.nii", "006662_T1w_MPR_RL.nii", "006984_SpcIR-T2w_FLR.nii" ,"006984_T1w_MPR_RL.nii"], [])}
                        >
                           MRI Viewer
                        </Button>
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,1, 1, 12, "free_surfer", ["saved", "saved", "saved", "saved"], ["006662_SpcIR-T2w_FLR.nii", "006662_T1w_MPR_RL.nii", "006984_SpcIR-T2w_FLR.nii" ,"006984_T1w_MPR_RL.nii"], [])}
                        >
                            Free Surfer
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,2, 2, 1, "recon_all_results", ["saved"], ["psg1 anonym2.edf"], [])}
                        >
                            Recon-All Results
                        </Button>
                        {/*<Divider/>*/}
                        <Button
                                variant="contained"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,2, 2, 3, "samseg_results", ["saved"], ["psg1 anonym2.edf"], [])}
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
                        {/*        onClick={redirectToPage.bind(this,1,1, 2, "level", ["saved"], ["demo_sample_questionnaire.csv"], [])}*/}
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
                                <Typography>Data</Typography>
                            </AccordionSummary>
                            <AccordionDetails orientation="vertical">
                            <Button
                                    variant="contained"
                                    size="medium"
                                    endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                    fullWidth
                                    onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "valuesimputation", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                            >
                                Missing values Imputation
                            </Button>
                            </AccordionDetails>
                        </Accordion>
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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "general_stats_average", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Average
                                </Button>
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "general_stats_min", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Min
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "general_stats_max", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Max
                                </Button>
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "general_stats_Std", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Standard Deviation
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "general_stats_Cov", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Covariance Matrix
                                </Button>
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "general_stats_zscore", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Z score
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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "normality", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Normality test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}

                                        // onClick={redirectToPage.bind(this,1,1, 2, "normality_anderson", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "normality_anderson", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Normality test Anderson
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "data_transform", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "data_transform", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
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
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "data_transform_anova", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Data Transformation for use in ANOVA
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        // onClick={redirectToPage.bind(this,1,1, 2, "homoscedasticity", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "homoscedasticity", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
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
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "spearman_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Spearman Correlation
                                </Button>

                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "pearson_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Pearson Correlation
                                </Button>
                                <Button
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "biweight_midcorrelation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Biweight midcorrelation
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "percentage_bend_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Percentage bend correlation
                                </Button>
                                <Button
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "shepherd_pi_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Shepherd’s pi correlation
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "skipped_spearman_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Skipped spearman correlation
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "point_biserial_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Point Biserial Correlation
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "kendalltau_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Kendalltau Correlation
                                </Button>
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "canonical_correlation", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Canonical Correlation
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mediation_analysis", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Mediation Analysis
                                </Button>
                                <Button
                                        // variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "structural_equation_models_optimization", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Structural Equation Models Optimization
                                </Button>
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "exploratory_factor_analysis_extract_latent_structure", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Exploratory Factor Analysis extract latent structure
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
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "welch_t_test", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Welch t-test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "independent_t_test", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Independent t-test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "t_test_two_samples", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    t-test on TWO RELATED samples of scores
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mann_whitney_u_rank", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Mann-Whitney U rank test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "wilcoxon_signed_rank", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Wilcoxon signed-rank test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "alexander_govern", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Alexander Govern test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "kruskal_wallis_h", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Kruskal-Wallis H-test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "one_way_anova", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    one-way ANOVA
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "wilcoxon_rank_statistic", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    Wilcoxon rank-sum statistic
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "one_way_chi_square", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    One-way chi-square test
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        // variant="outlined"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mutliple_comparisons", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                        Multiple Comparisons
                                    {/*</ListItemButton>*/}
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        variant="contained"
                                        size="medium"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mixed_anova",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Mixed ANOVA
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        size="medium"
                                        variant="outlined"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "ancova",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Ancova
                                </Button>
                                {/*<Divider/>*/}
                                <Button
                                        size="medium"
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "welch_anova",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Welch Anova
                                </Button>
                                <Button
                                        size="medium"
                                        variant="outlined"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "anova_rm",["saved"], ["Sample_rep_measures.csv"], [])}
                                >
                                    Anova Repeated Measures
                                </Button>
                                <Button
                                        size="medium"
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "anova",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    One and M Way Anova
                                </Button>
                                <Button
                                        size="medium"
                                        variant="outlined"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        fullWidth
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "pairwise_tests",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Pairwise tests
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
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LDA", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Classification analysis (LDA)
                                </Button>
                                {/*<Button*/}
                                {/*        size="medium"*/}
                                {/*        fullWidth*/}
                                {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}*/}
                                {/*        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "SVC", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}*/}
                                {/*>*/}
                                {/*    Classification analysis (SVC)*/}
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
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "KMeans", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}

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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "linear_regression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}

                                >
                                    {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                    Linear Regression
                                    {/*</ListItemButton>*/}
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LassoRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}

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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "ElasticNet", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}

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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "GeneralizedEstimatingEquations", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}

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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "RidgeRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "SGDRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "HuberRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LinearSVR", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LinearSVC", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}

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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LogisticRegressionPinguin", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
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
                                        // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "LogisticRegressionStatsmodels", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
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
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysiscoxregression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
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
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "linearmixedeffectsmodel", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Linear Mixed Effects Model
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "GrangerAnalysis", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Granger Analysis
                                </Button>
                                <Button
                                        // component={Link}
                                        // variant="h6"
                                        // href="/LinearRegression"
                                        size="medium"
                                        variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "PoissonRegression", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset.csv"], [])}
                                >
                                    Poisson Regression
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
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisriskratiodataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Risk Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        // variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisriskdifferencedataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Risk Difference
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisNNTdataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Number needed to treat
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        // variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisoddsratiodataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Odds Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisincidencerateratiodataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Incidence Rate Ratio
                                </Button>
                                <Button
                                        size="medium"
                                        fullWidth
                                        // variant="contained"
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysisincidenceratedifferencedataset", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Incidence Rate Difference
                                </Button>
                                <Button
                                        size="medium"
                                        variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysistimevaryingcovariates", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Time Varying Covariates
                                </Button>
                                <Button
                                        size="medium"
                                        // variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "survivalanalysiskaplanmeier", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Kaplan-Meier
                                </Button>
                                <Button
                                        size="medium"
                                        variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "fisherexact",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    Fisher Exact
                                </Button>
                                <Button
                                        size="medium"
                                        // variant="contained"
                                        fullWidth
                                        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                        onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "mcnemar",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                >
                                    McNemar
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
                                    // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                    onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "FactorAnalysis", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                    fullWidth
                            >
                                {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                Factor Analysis
                                {/*</ListItemButton>*/}
                            </Button>
                            <Button
                                    // component={Link}
                                    // variant="h6"
                                    // href="/LinearRegression"
                                    size="medium"
                                    endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                    // onClick={redirectToPage.bind(this,1,1, 2, "LinearRegression", ["saved"], ["demo_sample_questionnaire.csv"], [])}
                                    onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "ChooseFactors", ["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                                    fullWidth
                            >
                                {/*<ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                                Choose Number of Factors
                                {/*</ListItemButton>*/}
                            </Button>
                            <AccordionDetails orientation="vertical">
                            </AccordionDetails>
                        </Accordion>
                        {/*<Button*/}
                        {/*        // component={Link}*/}
                        {/*        // variant="h6"*/}
                        {/*        size="medium"*/}
                        {/*        fullWidth*/}
                        {/*        // href="/PCA"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        onClick={redirectToPage.bind(this,1,1, 2, "PCA", ["saved"], ["demo_sample_questionnaire.csv"], [])}*/}

                        {/*>*/}
                        {/*    Principal Component Analysis*/}
                        {/*</Button>*/}

                        <Button
                                size="medium"
                                // variant="contained"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "principalcomponentanalysis",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                        >
                            Principal Component Analysis
                        </Button>
                        <Button
                                size="medium"
                                variant="contained"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "tsne",["demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv"], [])}
                        >
                            t-distributed Stochastic Neighbor Embedding
                        </Button>

                        {/*<Button*/}
                        {/*        variant="contained"*/}
                        {/*        size="medium"*/}
                        {/*        endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                        {/*        onClick={redirectToPage.bind(this,1, 1, 4, "slowwave_spindle", ["saved", "saved"], ["XX_Firsthalf_raw.fif", "XX_Firsthalf_Hypno.csv"], [])}*/}
                        {/*>*/}
                        {/*    Slow Waves / Spindles*/}
                        {/*</Button>*/}
                    </ButtonGroup>
                    {/*<ButtonGroup*/}
                    {/*        orientation="vertical"*/}
                    {/*        sx={{width: '25%', bgcolor: 'background.paper', padding:'5px'}}*/}
                    {/*        component="nav"*/}
                    {/*        aria-labelledby="nested-list-subheader"*/}
                    {/*>*/}
                    {/*    <h2 sx= {{color: "grey"}}>*/}
                    {/*        Demo*/}
                    {/*    </h2>*/}
                    {/*    <Button*/}
                    {/*            variant="contained"*/}
                    {/*            size="medium"*/}
                    {/*            endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}*/}
                    {/*            fullWidth*/}
                    {/*            onClick={redirectToPage.bind(this,"7e0b8959-8103-490b-8600-951ed6b5d706", "e5451f16-1c42-4670-a9d6-95c40cd0d67f", "ffa5b983-4754-41c0-91e9-0abf532f4e2b", "alexander_govern", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}*/}
                    {/*    >*/}
                    {/*        Alexander Govern test*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*            variant="contained"*/}
                    {/*            size="medium"*/}
                    {/*            endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%",borderLeft : "1px solid black", position: "absolute"}} />}*/}
                    {/*            // endIcon={}*/}
                    {/*            // sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}*/}
                    {/*            onClick= {redirectToPage.bind(this,"7e0b8959-8103-490b-8600-951ed6b5d706", "09c0e105-3ada-4dd9-9b5d-bf78ea2b0b04", "d0e425b0-e9a1-4358-a9de-f5c6bebeea12", "auto_correlation", ["saved"], ["psg1 anonym2.edf"], [])}*/}
                    {/*    >*/}
                    {/*        Auto Correlation*/}
                    {/*        /!*<SendIcon/>*!/*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*            variant="contained"*/}
                    {/*            size="medium"*/}
                    {/*            endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                    {/*            onClick={redirectToPage.bind(this,2, 2, 2, "eeg_viewer", ["saved"], ["anon14.edf"], [])}*/}
                    {/*    >*/}
                    {/*        EEG Viewer - EDF with marks (anon14.edf)*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*            variant="contained"*/}
                    {/*            size="medium"*/}
                    {/*            endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                    {/*            onClick={redirectToPage.bind(this,3, 3, 3, "back_average", ["saved"], ["anon14.edf"], [])}*/}
                    {/*    >*/}
                    {/*        Back Average*/}
                    {/*    </Button>*/}
                    {/*    <Button*/}
                    {/*            // variant="contained"*/}
                    {/*            size="medium"*/}
                    {/*            endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                    {/*            onClick={redirectToPage.bind(this,4, 4, 4, "power_spectral_density_main", ["saved"], ["anon14.edf"], [])}*/}
                    {/*    >*/}
                    {/*        Power Spectral Density - Main*/}
                    {/*    </Button>*/}
                    {/*</ButtonGroup>*/}
                    {/*<ButtonGroup*/}
                    {/*        orientation="vertical"*/}
                    {/*        sx={{width: '25%', bgcolor: 'background.paper', padding:'5px'}}*/}
                    {/*        component="nav"*/}
                    {/*        aria-labelledby="nested-list-subheader"*/}
                    {/*>*/}
                    {/*    <h2 sx= {{color: "grey"}}>*/}
                    {/*        Miscellaneous*/}
                    {/*    </h2>*/}
                    {/*    <Button*/}
                    {/*            // variant="outlined"*/}
                    {/*            size="medium"*/}
                    {/*            endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}*/}
                    {/*            sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}*/}
                    {/*            onClick={redirectToPage.bind(this,1,1, 3, "dashboard", ["saved"], ["demo_sample_questionnaire.csv"], [])}*/}
                    {/*    >*/}
                    {/*        Dashboard*/}
                    {/*    </Button>*/}
                    {/*</ButtonGroup>*/}
                    <ButtonGroup
                            orientation="vertical"
                            sx={{width: '25%', bgcolor: 'background.paper', padding:'5px'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                    >
                        <h2 sx= {{color: "grey"}}>
                            AI
                        </h2>
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                // sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "linearregressionmodelcreation", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                        >
                            Linear Regression Model Creation
                        </Button>
                        <Button
                                // variant="outlined"
                                size="medium"
                                endIcon={<NavigateNextIcon sx={{right: "0%", top: "20%", borderLeft : "1px solid black", position: "absolute"}} />}
                                // sx = {{display: dashboardMode === "dev" ? "block" : "none", backgroundColor: dashboardMode === "dev" ? "red" : "default"}}
                                onClick={redirectToPage.bind(this,"3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "3fa85f64-5717-4562-b3fc-2c963f66afa6", "linearregressionmodelload", ["demo","demo"], ["expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/mescobrad_dataset_1.csv", "expertsystem/workflow/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/3fa85f64-5717-4562-b3fc-2c963f66afa6/test_dataset_01.csv"], [])}
                        >
                            Linear Regression Load Model
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
