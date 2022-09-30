import React, {useContext, useEffect} from 'react';
import {
    Button,
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
import { useNavigate } from "react-router-dom";
import {withRouter} from '../withRouter';
import Kruskal_Wallis_H_test from "../../pages/hypothesis_testing/Kruskal_Wallis_H_test";
import One_way_ANOVA from "../../pages/hypothesis_testing/One_way_ANOVA";
import Wilcoxon_rank_sum_statistic from "../../pages/hypothesis_testing/Wilcoxon_rank_sum_statistic";
import One_way_chi_square_test from "../../pages/hypothesis_testing/One_way_chi_square_test";
import Multiple_comparisons from "../../pages/hypothesis_testing/Multiple_comparisons";
import DataTransformationForANOVA from "../../pages/hypothesis_testing/DataTransformationForANOVA";


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
                                href="/alpha_variability"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Alpha Variability>
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
                                href="/slowwaves"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Slowwaves>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/spindles"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Spindles>
                            </ListItemButton>
                        </Link>
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
                        <p>alpha_variability</p>
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
                                    <h2>Actigraphy</h2>
                                </ListSubheader>
                            }>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/actigraphy"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Actigraphy Viewer>
                            </ListItemButton>
                        </Link>
                        <Link
                                component={Link}
                                variant="h6"
                                href="/actigraphy/general/"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Actigraphy General Viewer>
                            </ListItemButton>
                        </Link>
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
                                href="/Level"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Level >
                            </ListItemButton>
                        </Link>
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
                                href="/normality_Tests_And"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Normality test Anderson>
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
                        <Link
                                component={Link}
                                variant="h6"
                                href="/Multiple_comparisons"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Multiple Comparisons >
                            </ListItemButton>
                        </Link>
                        <p>calculate_SpO2 from eeg_router</p>
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
                        <Link
                                component={Link}
                                variant="h6"
                                href="/dashboard"
                        >
                            <ListItemButton sx={{borderBottom: "1px solid #1976d2", borderRadius: "10px"}} component={"a"}>
                                Dashboard>
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
                                    <h2>Pending pages</h2>
                                </ListSubheader>
                            }></List>
                </div>
            </React.Fragment>
    );
}

export default WelcomePage;
