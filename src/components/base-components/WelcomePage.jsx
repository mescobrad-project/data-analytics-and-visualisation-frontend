import React, {useContext, useEffect} from 'react';
import {
    Button, Divider,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    Typography
} from "@mui/material";
import {display} from "@mui/system";
import API from "../../axiosInstance";
import {useNavigate} from "react-router-dom";
import {withRouter} from '../withRouter';


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

async function redirectToPage(run_id, step_id, function_name, bucket, file) {
    // Send the request
    let files_to_send = []
    for (let it=0 ; it< bucket.length;it++){
        files_to_send.push([bucket[it], file[it]])
    }

    API.put("function/navigation/",
            {
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

    return (
            <React.Fragment>
                {/*<h1>{document.title}</h1>*/}
                <h1>MES-CoBraD | Analytics Engine</h1>
                <h3>Welcome to MES-CoBraDs' Analytics Module</h3>
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
                    <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <h2>EEG pages</h2>
                                </ListSubheader>
                            }>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick= {redirectToPage.bind(this,1, 1, "auto_correlation", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Auto Correlation >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "partial_auto_correlation", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Partial Auto Correlation >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "welch", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Welch >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "find_peaks", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Find Peaks >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "power_spectral_density_periodogram", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Power Spectral Density - Periodogram>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "stft", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Short Time Fourier Transform>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "power_spectral_density_multitaper", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Power Spectral Density - Multitaper> Is this Welch?
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "alpha_delta_ratio", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Alpha Delta Ratio>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "predictions", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Predictions>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "artifacts", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Artifacts>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "alpha_variability", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Alpha Variability>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "asymmetry_indices", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Asymmetry Indices>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "slow_waves", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Slow waves>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "spindles", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Spindles>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "eeg_viewer", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            EEG Viewer>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "eeg_viewer_old", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            EEG Viewer Old>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "envelop_trend_analysis", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Envelope Trend Analysis>
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


                        {/*<p>Multitaper</p>*/}
                    </List>
                    <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <h2>Actigraphy</h2>
                                </ListSubheader>
                            }>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "actigraphy_viewer", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Actigraphy Viewer>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "actigraphy_viewer_general", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Actigraphy General Viewer>
                        </Button>
                    </List>
                    <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <h2> MRI pages</h2>
                                </ListSubheader>
                            }>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "mri_viewer", ["saved"], ["psg1 anonym2.edf"])}
                        >
                           MRI Viewer >
                        </Button>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "freesurfer", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Free Surfer >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "recon_all_results", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Recon-All Results >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 1, "samseg_results", ["saved"], ["psg1 anonym2.edf"])}
                        >
                            Samseg Results >
                        </Button>
                    </List>
                    <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <h2> Hypothesis pages</h2>
                                </ListSubheader>
                            }>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "level", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Level >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "normality", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Normality test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "normality_anderson", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Normality test Anderson>
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "data_transform", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Transform data >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "pearson_correlation", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Pearson Correlation >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "point_biserial_correlation", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Point Biserial Correlation >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "data_transform_anova", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Data Transformation for use in ANOVA >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "homoscedasticity", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Homoscedasticity check >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "spearman_correlation", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Spearman Correlation >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "kendalltau_correlation", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Kendalltau Correlation >
                        </Button>
                        <Typography variant="h6" sx={{flexGrow: 1, textAlign: "left", padding: "10px"}} noWrap>
                            Statistical Tests
                        </Typography>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "welch_t_test", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Welch t-test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "independent_t_test", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Independent t-test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "t_test_two_samples", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            t-test on TWO RELATED samples of scores >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "mann_whitney_u_rank", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Mann-Whitney U rank test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "wilcoxon_signed_rank", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Wilcoxon signed-rank test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "alexander_govern", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Alexander Govern test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "kruskal_wallis_h", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Kruskal-Wallis H-test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "one_way_anova", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            one-way ANOVA >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "wilcoxon_rank_statistic", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Wilcoxon rank-sum statistic >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "one_way_chi_square", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            One-way chi-square test >
                        </Button>
                        <Divider/>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "mutliple_comparisons", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Multiple Comparisons >
                        </Button>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/LDA"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                LDA >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/SVC"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                SVC >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/PCA"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                PCA >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/KMeans"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                KMeans >
                            </ListItemButton>
                        </Link>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 2, "LinearRegressionFunctionPage", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Linear Regression >
                        </Button>
                        {/*<Link*/}
                        {/*        component={Link}*/}
                        {/*        variant="h6"*/}
                        {/*        href="/LinearRegression"*/}
                        {/*>*/}
                        {/*    <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>*/}
                        {/*        Linear Regression >*/}
                        {/*    </ListItemButton>*/}
                        {/*</Link>*/}
                        <Link
                                component={Link}
                                variant="h6"
                                href="/ElasticNet"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Elastic Net >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/LassoRegression"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Lasso Regression >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/RidgeRegression"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Ridge Regression >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/SGDRegression"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                SGD Regression >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/HuberRegression"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Huber Regression >
                            </ListItemButton>
                        </Link>


                        {/*<p>calculate_SpO2 from eeg_router</p>*/}

                    </List>
                    <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <h2>Dashboard Pages</h2>
                                </ListSubheader>
                            }>
                        <Button
                                // variant="outlined"
                                size="large"
                                onClick={redirectToPage.bind(this,1, 3, "dashboard", ["saved"], ["demo_sample_questionnaire.csv"])}
                        >
                            Dashboard >
                        </Button>
                        <Divider/>
                    </List>
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
