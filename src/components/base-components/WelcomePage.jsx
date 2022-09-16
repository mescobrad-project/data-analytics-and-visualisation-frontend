import React, {useContext, useEffect} from 'react';
import {Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader} from "@mui/material";
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

async function handleSubmit(event) {
    event.preventDefault();

    // Send the request
    API.put("function/navigation/",
            {
                    run_id: "1",
                    step_id: "1",
                    metadata: [{"function" : "auto_correlation"}],
            }
    ).then(res => {
       console.log("BACK_________________________")
       console.log("BACK")
       console.log(res)
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
                {/*                metadata: [{"function" : "auto_correlation"}],*/}
                {/*            }*/}
                {/*    ).then(res => {*/}
                {/*        console.log("BACK_________________________")*/}
                {/*        console.log("BACK")*/}
                {/*        console.log(res.data.url)*/}
                {/*        navigate(res.data.url);*/}
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
                                    <h2>Existing pages</h2>
                                </ListSubheader>
                            }>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/auto_correlation"
                                href="/eeg?eeg_function=auto_correlation"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Auto Correlation >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/partial_auto_correlation"
                                href="/eeg?eeg_function=partial_auto_correlation"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Partial Auto Correlation >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/filters"
                                href="/eeg?eeg_function=filters"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Filters>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/welch"
                                href="/eeg?eeg_function=welch"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Welch>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/find_peaks"
                                href="/eeg?eeg_function=find_peaks"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Find Peaks>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/periodogram"
                                href="/eeg?eeg_function=periodogram"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Periodogram>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/stft"
                                href="/eeg?eeg_function=stft"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius:"10px"}} component={"a"}>
                                Short Time Fourier Transform>
                                  </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/power_spectral_density"
                                href="/eeg?eeg_function=power_spectral_density"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Power Spectral Density>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                // href="/alpha_delta_ratio"
                                href="/eeg?eeg_function=alpha_delta_ratio"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Alpha Delta Ratio>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/asymmetry_indices"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Asymmetry Indices>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/spindle_detection"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Spindle Detection>
                            </ListItemButton>
                        </Link>
                        <p>alpha_variability</p>

                        <p>Slowwaves</p>
                        <p>Multitaper</p>
                        <p>Predictions (ARIMA)</p>
                        <p>Discrete Wavelet Transform</p>
                    </List>
                    <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <h2>Existing EEG pages</h2>
                                </ListSubheader>
                            }>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/eeg"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                EEG Analysis>
                                {/*   0) Open File and see all channels*/}
                                {/*   1)  List of annotations in our UI*/}
                                {/*   2) New annotation */}
                                {/*   2.1) Annotations by user*/}
                                {/*   2) New aggregate channels */}
                                {/*   3) Montage */}
                            </ListItemButton>
                        </Link>
                        {/*   1) Find how to create and how different users act in neurodesk */}
                        {/*   2) Show the right eeg channels  */}

                    </List>
                    <List
                            sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    <h2>Existing MRI pages</h2>
                                </ListSubheader>
                            }>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/freesurfer/recon"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Free Surfer >
                                {/*   1) Freeview screenshots*/}
                                {/*   1.5) Altenrate MRI screenshots with nilearn*/}
                                {/*   2) Other files produced by freesurfer */}
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Freesurfer_ReconAll_Results"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Recon-All Results >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Freesurfer_Samseg_Results"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Samseg Results >
                            </ListItemButton>
                        </Link>
                    </List>
                    <List
                        sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                            <h2>Existing Hypothesis pages</h2>
                        </ListSubheader>
                    }>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/normality_Tests"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Normality test >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/transform_data"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Transform data >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Pearson_correlation"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Pearson Correlation >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/PointBiserialCorrelation"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Point Biserial Correlation >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/DataTransformationForANOVA"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Data Transformation for use in ANOVA >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Homoscedasticity"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Homoscedasticity check >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Spearman_correlation"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Spearman Correlation >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Kendalltau_correlation"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Kendalltau Correlation >
                            </ListItemButton>
                        </Link>
                        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "left", padding: "10px" }} noWrap>
                            Statistical Tests
                        </Typography>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Welch_t_test"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Welch t-test >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Independent_t_test"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Independent t-test >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Two_Related_samples_t_test"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                t-test on TWO RELATED samples of scores >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Mann_Whitney"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Mann-Whitney U rank test >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Wilcoxon_signed_rank_test"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Wilcoxon signed-rank test >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Alexander_Govern_test"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Alexander Govern test >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Kruskal_Wallis_H_test"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Kruskal-Wallis H-test >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/One_way_ANOVA"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                one-way ANOVA >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Wilcoxon_rank_sum_statistic"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Wilcoxon rank-sum statistic >
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/One_way_chi_square_test"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                One-way chi-square test >
                            </ListItemButton>
                        </Link>

            </React.Fragment>
    );
}

export default WelcomePage;
