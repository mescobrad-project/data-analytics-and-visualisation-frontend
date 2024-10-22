import '../../style-sheets/App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {ReactKeycloakProvider, useKeycloak} from "@react-keycloak/web";

// Import all layouts
import LayoutMain from "../../layout/LayoutMain";

// Import Route Components
import WelcomePage from "./WelcomePage";
import PageError from "./PageError";
import AutoCorrelationFunctionPage from "./AutoCorrelationFunctionPage";
import LayoutSimpleFunctions from "../../layout/LayoutSimpleFunctions";
import PartialAutoCorrelationFunctionPage from "./PartialAutoCorrelationFunctionPage";
import FiltersFunctionPage from "./FiltersFunctionPage";
import WelchFunctionPage from "./WelchFunctionPage";
import StftFunctionPage from "./StftFunctionPage"
import PeriodogramFunctionPage from "./PeriodogramFunctionPage";

// Import Material UI Customising
import {ThemeProvider, StyledEngineProvider, createTheme} from '@mui/material/styles';
import FindPeaksPage from "./FindPeaksPage";
import PowerSpectralDensity from "./PowerSpectralDensity";
import FreesurferReconFunctionPage from "./FreesurferReconFunctionPage";
import EEGAnalysisFunctionPage from "./EEGAnalysisFunctionPage";
import Freesurfer_ReconAll_ResultsPage from "../../pages/freesurfer/ReconAllResults";
import Freesurfer_Samseg_ResultsPage from "../../pages/freesurfer/SamsegResults";
import {CssBaseline} from "@mui/material";
import '@fontsource/roboto/400.css';
import Transform_data from "../../pages/hypothesis_testing/transform_data";
import Normality_Tests from "../../pages/hypothesis_testing/Normality_Tests";
import Normality_Tests_And from "../../pages/hypothesis_testing/Normality_Tests_And";
import Pearson_correlation from "../../pages/hypothesis_testing/Pearson_correlation"
import Spearman_correlation from "../../pages/hypothesis_testing/Spearman_correlation";
import PointBiserialCorrelation from "../../pages/hypothesis_testing/PointBiserialCorrelation"
import DataTransformationForANOVA from "../../pages/hypothesis_testing/DataTransformationForANOVA";
import Homoscedasticity from "../../pages/hypothesis_testing/Homoscedasticity";
import AlphaDeltaRatioFunctionPage from "./AlphaDeltaRatioFunctionPage";
import PredictionsFunctionPage from "./PredictionsFunctionPage";
import AlphaVariabilityFunctionPage from "./AlphaVariabilityFunctionPage";
import AsymmetryIndicesFunctionPage from "./AsymmetryIndicesFunctionPage";
import Kendalltau_correlation from "../../pages/hypothesis_testing/Kendalltau_correlation"
import Welch_t_test from "../../pages/hypothesis_testing/Welch_t_test";
import Independent_t_test from "../../pages/hypothesis_testing/Independent_t_test";
import DashboardPage from "./DashboardPage";
import Two_Related_samples_t_test from "../../pages/hypothesis_testing/Two_Related_samples_t_test";
import Mann_Whitney from "../../pages/hypothesis_testing/Mann_Whitney";
import Wilcoxon_signed_rank_test from "../../pages/hypothesis_testing/Wilcoxon_signed_rank_test";
import Alexander_Govern_test from "../../pages/hypothesis_testing/Alexander_Govern_test";
import Kruskal_Wallis_H_test from "../../pages/hypothesis_testing/Kruskal_Wallis_H_test";
import One_way_ANOVA from "../../pages/hypothesis_testing/One_way_ANOVA";
import Wilcoxon_rank_sum_statistic from "../../pages/hypothesis_testing/Wilcoxon_rank_sum_statistic";
import One_way_chi_square_test from "../../pages/hypothesis_testing/One_way_chi_square_test";
import Multiple_comparisons from "../../pages/hypothesis_testing/Multiple_comparisons";
import SpindleDetection from "./SpindleDetection";

import SlowWaves from "./SlowWaves";
import ActrigraphyViewer from "./ActrigraphyViewer";
import ActigraphyFunctionPage from "./ActigraphyFunctionPage";
import ActigraphyStatistics from "./ActigraphyStatistics";
import Level from "./Level";
import ActrigraphyGeneralViewer from "./ActrigraphyGeneralViewer";
import ArtifactsFunctionPage from "./ArtifactsFunctionPage";
import EEGViewer from "./EEGViewer";
import EnvelopeTrendAnalysis from "./Envelope_Trend_Analysis";
import LDAFunctionPage from "./LDAFunctionPage";
import SVCFunctionPage from "./SVCFunctionPage";
import PCAFunctionPage from "./PCAFunctionPage";
import KMeansFunctionPage from "./KMeansFunctionPage";
import LinearRegressionFunctionPage from "./LinearRegressionFunctionPage";
import ElasticNetFunctionPage from "./ElasticNetFunctionPage";
import LassoRegressionFunctionPage from "./LassoRegressionFunctionPage";
import RidgeRegressionFunctionPage from "./RidgeRegressionFunctionPage";
import SGDRegressionFunctionPage from "./SGDRegressionFunctionPage";
import HuberRegressionFunctionPage from "./HuberRegressionFunctionPage";
import MRIViewer from "./MRIViewer";
import Biweight_midcorrelation from "../../pages/hypothesis_testing/Biweight_midcorrelation";
import Percentage_bend_correlation from "../../pages/hypothesis_testing/Percentage_bend_correlation";
import Shepherd_pi_correlation from "../../pages/hypothesis_testing/Shepherd_pi_correlation";
import LinearSVRRegressionFunctionPage from "./LinearSVRRegressionFunctionPage";
import LinearSVCRegressionFunctionPage from "./LinearSVCRegressionFunctionPage";
import LogisticRegressionPinguinFunctionPage from "./LogisticRegressionPinguinFunctionPage";
import LogisticRegressionStatsmodelsFunctionPage from "./LogisticRegressionStatsmodelsFunctionPage";
import LogisticRegressionSklearnFunctionPage from "./LogisticRegressionSklearnFunctionPage";
import Skipped_spearman_correlation from "../../pages/hypothesis_testing/Skipped_spearman_correlation";
import SurvivalAnalysisRiskRatioSimple from "../../pages/hypothesis_testing/SurvivalAnalysisRiskRatioSimple";
import SurvivalAnalysisRiskRatioDataset from "../../pages/hypothesis_testing/SurvivalAnalysisRiskRatioDataset";
import SurvivalAnalysisRiskDifferenceSimple from "../../pages/hypothesis_testing/SurvivalAnalysisRiskDifferenceSimple"
import SurvivalAnalysisRiskDifferenceDataset from "../../pages/hypothesis_testing/SurvivalAnalysisRiskDifferenceDataset"
import SurvivalAnalysisNNTSimple from "../../pages/hypothesis_testing/SurvivalAnalysisNNTSimple"
import SurvivalAnalysisNNTDataset from "../../pages/hypothesis_testing/SurvivalAnalysisNNTDataset"
import SurvivalAnalysisOddsRatioSimple from "../../pages/hypothesis_testing/SurvivalAnalysisOddsRatioSimple";
import SurvivalAnalysisOddsRatioDataset from "../../pages/hypothesis_testing/SurvivalAnalysisOddsRatioDataset";
import SurvivalAnalysisIncidenceRateRatioSimple
    from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateRatioSimple";
import SurvivalAnalysisIncidenceRateRatioDataset
    from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateRatioDataset"
import SurvivalAnalysisIncidenceRateDifferenceDataset
    from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateDifferenceDataset"
import SurvivalAnalysisIncidenceRateDifferenceSimple
    from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateDifferenceSimple";
import FisherExact from "../../pages/hypothesis_testing/FisherExact";
import McNemar from "../../pages/hypothesis_testing/McNemar";
import Ancova from "../../pages/hypothesis_testing/Ancova"
import Welch_Anova from "../../pages/hypothesis_testing/Welch_Anova"
import Anova_RM from "../../pages/hypothesis_testing/Anova_RM"
import Pairwise_test from "../../pages/hypothesis_testing/Pairwise_test"
import Anova from "../../pages/hypothesis_testing/Anova"
import LinearMixedEffectsModel from "../../pages/hypothesis_testing/LinearMixedEffectsModel";
import SurvivalAnalysisCoxRegression from "../../pages/hypothesis_testing/SurvivalAnalysisCoxRegression"
import SurvivalAnalysisTimeVaryingCovariates from "../../pages/hypothesis_testing/SurvivalAnalysisTimeVaryingCovariates"
import PrincipalComponentAnalysis from "../../pages/hypothesis_testing/PrincipalComponentAnalysis"
import SlowwaveSpindleFunctionPage from "./SlowwaveSpindleFunctionPage";
import TestingPage from "./TestingPage";
import FactorAnalysisFunctionPage from "./FactorAnalysisFunctionPage";
import SleepStatisticsFunctionPage from "./SleepStatisticsFunctionPage";
import SpectogramBandpowerFunctionPage from "./SpectogramBandpowerFunctionPage";
import PowerSpectralDensityPage from "./PowerSpectralDensityPage";
import Canonical_correlation from "../../pages/hypothesis_testing/Canonical_correlation"
import SurvivalAnalysisKaplanMeier from "../../pages/hypothesis_testing/SurvivalAnalysisKaplanMeier";
import Mediation_Analysis from '../../pages/hypothesis_testing/Mediation_Analysis'
import GeneralizedEstimatingEquationsFunctionPage from "./GeneralizedEstimatingEquationsFunctionPage";
import Structural_Equation_Models_Optimization
    from "../../pages/hypothesis_testing/Structural_Equation_Models_Optimization";
import Exploratory_Factor_Analysis_extract_latent_structure
    from "../../pages/hypothesis_testing/Exploratory_Factor_Analysis_extract_latent_structure";
import Mixed_Anova from "../../pages/hypothesis_testing/Mixed_Anova"
import General_Stats_Average from "../../pages/hypothesis_testing/General_Stats_Average"
import BackAveragePage from "./BackAveragePage";
import General_Stats_Min from "../../pages/hypothesis_testing/General_Stats_Min"
import General_Stats_Max from "../../pages/hypothesis_testing/General_Stats_Max"
import ActigraphyMasking from "./ActigraphyMasking";
import ActigraphyFunctionalLinearModelling from "./ActigraphyFunctionalLinearModelling";
import ActigraphySingularSpectrumAnalysis from "./ActigraphySingularSpectrumAnalysis";
import ActigraphyDetrendedFluctuationAnalysis from "./ActigraphyDetrendedFluctuationAnalysis";
import ActigraphyEDFViewer from "./ActigraphyEDFViewer";
// import ActigraphyStatistics from "./ActigraphyStatistics";
import ActigraphySummary from "./ActigraphySummary";
import Actigraphy_Cosinor from "./Actigraphy_Cosinor";
import Actigraphy_Metrics from "./Actigraphy_Metrics";
import ChooseFactorsFunctionPage from "./ChooseFactorsFunctionPage";
import GrangerAnalysisFunctionPage from "./GrangerAnalysisFunctionPage";
import General_Stats_Zscore from "../../pages/hypothesis_testing/General_Stats_Zscore";
import General_Stats_Std from "../../pages/hypothesis_testing/General_Stats_Std";
import General_Stats_Cov from "../../pages/hypothesis_testing/General_Stats_Cov";
import PoissonRegressionFunctionPage from "./PoissonRegressionFunctionPage";
import SleepStageClassificationPage from "./SleepStageClassificationPage";
import ManualSleepStagePage from "./ManualSleepStagePage";
import TSNE from "../../pages/hypothesis_testing/TSNE";
import GroupSleepSensitivityAnalysisPage from "./GroupSleepSensitivityAnalysisPage";
import ValuesImputation from "../../pages/hypothesis_testing/ValuesImputation";
import EEGHypnoUpsampling from "./EEGHypnoUpsampling";
import SlowwaveFunctionPage from "./SlowwaveFunctionPage";
import SpindleFunctionPage from "./SpindleFunctionPage";
// import keycloak from "../../Keycloak";
import keycloakConfig from "./Keycloak";
import Keycloak from "keycloak-js";
import * as httpClient from "browserslist";
import LinearRegressionModelCreation from "../../pages/AI/LinearRegressionModelCreation";
import LinearRegressionModelLoad from "../../pages/AI/LinearRegressionModelLoad";
import LogisticRegressionModelCreation from "../../pages/AI/LogisticRegressionModelCreation";
import LogisticRegressionModelLoad from "../../pages/AI/LogisticRegressionModelLoad";
import SVCModelCreation from "../../pages/AI/SVCModelCreation";
import SVCModelLoad from "../../pages/AI/SVCModelLoad";
import XGBoostModelLoad from "../../pages/AI/XGBoostModelLoad";
import XGBoostModelCreation from "../../pages/AI/XGBoostModelCreation";
import AutoencoderModelCreation from "../../pages/AI/AutoencoderModelCreation";
import AutoencoderModelLoad from "../../pages/AI/AutoencoderModelLoad";
import DatasetConcat from "../../pages/hypothesis_testing/DatasetConcat";



// Theme Colors Declaration
let firstColor = '#59C7F3'
let secondColor = '#FFFFFF'

// Create custom theme for material UI
const theme = createTheme({
    // palette: {
    //     primary: {
    //         main: firstColor
    //     },
    //     secondary: {
    //         main: secondColor
    //     },
    //     barBackgroundFirst: {
    //         main: `linear-gradient(to right, ${firstColor}, ${secondColor})`
    //     }
    // },
    // typography: {
    //     fontFamily: [
    //         'Poppins',
    //         'Roboto',
    //     ].join(','),
    // }
});


// const mykeycloak = new Keycloak({
//     "realm": "mescobrad",
//     "url": "https://idm.digital-enabler.eng.it/auth/",
//     "clientId": "data-analytics"
// })
// console.log("hey")
// mykeycloak.init({onLoad: 'login-required', checkLoginIframe: false}).then(authenticated => {
//     console.log("initialised")
//     // setAuthenticated(authenticated)
//     // setKeycloak(keycloak)
//     // this.setState(({keycloak: keycloak, authenticated: authenticated}))
//     if (authenticated) {
//         window.accessToken = mykeycloak.token;
//     }
//     httpClient.defaults.headers.common["Authorization"] = `Bearer ${mykeycloak.token}`
//     console.log(mykeycloak)
// }).catch(error => console.error("Keycloak initialization error:", error));


const App = () => {
    return (
            // <ReactKeycloakProvider authClient={keycloakConfig}>
                <StyledEngineProvider injectFirst>
                    <ThemeProvider theme={theme}>
                        <CssBaseline/>

                        {/*<BrowserRouter basename={"/analytics"}>*/}
                        <BrowserRouter>
                            <Routes>
                                <Route exact path="/" element={(<LayoutMain><WelcomePage/></LayoutMain>)}/>
                                <Route exact path="/auto_correlation"
                                       element={(<LayoutMain><AutoCorrelationFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/partial_auto_correlation"
                                       element={(<LayoutMain><PartialAutoCorrelationFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/filters"
                                       element={(<LayoutMain><FiltersFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/welch" element={(<LayoutMain><WelchFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/stft" element={(<LayoutMain><StftFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/find_peaks" element={(<LayoutMain><FindPeaksPage/></LayoutMain>)}/>
                                <Route exact path="/periodogram"
                                       element={(<LayoutMain><PeriodogramFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/power_spectral_density"
                                       element={(<LayoutMain><PowerSpectralDensity/></LayoutMain>)}/>
                                <Route exact path="/freesurfer/recon"
                                       element={(<LayoutMain><FreesurferReconFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/eeg/old"
                                       element={(<LayoutMain><EEGAnalysisFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/eeg" element={(<LayoutMain><EEGViewer/></LayoutMain>)}/>
                                {/*TODO*/}
                                <Route exact path="/mri" element={(<LayoutMain><MRIViewer/></LayoutMain>)}/>
                                <Route exact path="/eeg/pre"
                                       element={(<LayoutMain><EEGAnalysisFunctionPage/></LayoutMain>)}/>
                                {/*<Route exact path="/spindles" element={(<LayoutMain><SpindleDetection/></LayoutMain>)}/>*/}
                                {/*<Route exact path="/slowwaves" element={(<LayoutMain><SlowWaves/></LayoutMain>)}/>*/}
                                {/*<Route exact path="/auto_correlation" element={(<LayoutMain> <LayoutSimpleFunctions mainContent={<AutoCorrelationFunctionPage/>}></LayoutSimpleFunctions></LayoutMain>)}/>*/}
                                <Route exact path="/error" element={(<LayoutMain><PageError/></LayoutMain>)}/>
                                <Route exact path="/Freesurfer_ReconAll_Results"
                                       element={(<LayoutMain><Freesurfer_ReconAll_ResultsPage/></LayoutMain>)}/>
                                <Route exact path="/Freesurfer_Samseg_Results"
                                       element={(<LayoutMain><Freesurfer_Samseg_ResultsPage/></LayoutMain>)}/>
                                <Route exact path="/normality_Tests"
                                       element={(<LayoutMain><Normality_Tests/></LayoutMain>)}/>
                                <Route exact path="/normality_Tests_And"
                                       element={(<LayoutMain><Normality_Tests_And/></LayoutMain>)}/>
                                <Route exact path="/transform_data"
                                       element={(<LayoutMain><Transform_data/></LayoutMain>)}/>
                                <Route exact path="/Pearson_correlation"
                                       element={(<LayoutMain><Pearson_correlation/></LayoutMain>)}/>
                                <Route exact path="/Spearman_correlation"
                                       element={(<LayoutMain><Spearman_correlation/></LayoutMain>)}/>
                                <Route exact path="/Biweight_midcorrelation"
                                       element={(<LayoutMain><Biweight_midcorrelation/></LayoutMain>)}/>
                                <Route exact path="/Percentage_bend_correlation"
                                       element={(<LayoutMain><Percentage_bend_correlation/></LayoutMain>)}/>
                                <Route exact path="/Shepherd_pi_correlation"
                                       element={(<LayoutMain><Shepherd_pi_correlation/></LayoutMain>)}/>
                                <Route exact path="/Skipped_spearman_correlation"
                                       element={(<LayoutMain><Skipped_spearman_correlation/></LayoutMain>)}/>
                                <Route exact path="/PointBiserialCorrelation"
                                       element={(<LayoutMain><PointBiserialCorrelation/></LayoutMain>)}/>
                                <Route exact path="/Kendalltau_correlation"
                                       element={(<LayoutMain><Kendalltau_correlation/></LayoutMain>)}/>
                                <Route exact path="/Canonical_correlation"
                                       element={(<LayoutMain><Canonical_correlation/></LayoutMain>)}/>
                                <Route exact path="/Mediation_Analysis"
                                       element={(<LayoutMain><Mediation_Analysis/></LayoutMain>)}/>
                                <Route exact path="/DataTransformationForANOVA"
                                       element={(<LayoutMain><DataTransformationForANOVA/></LayoutMain>)}/>
                                <Route exact path="/Welch_t_test" element={(<LayoutMain><Welch_t_test/></LayoutMain>)}/>
                                <Route exact path="/Independent_t_test"
                                       element={(<LayoutMain><Independent_t_test/></LayoutMain>)}/>
                                <Route exact path="/Two_Related_samples_t_test"
                                       element={(<LayoutMain><Two_Related_samples_t_test/></LayoutMain>)}/>
                                <Route exact path="/Mann_Whitney" element={(<LayoutMain><Mann_Whitney/></LayoutMain>)}/>
                                <Route exact path="/Wilcoxon_signed_rank_test"
                                       element={(<LayoutMain><Wilcoxon_signed_rank_test/></LayoutMain>)}/>
                                <Route exact path="/Alexander_Govern_test"
                                       element={(<LayoutMain><Alexander_Govern_test/></LayoutMain>)}/>
                                <Route exact path="/Kruskal_Wallis_H_test"
                                       element={(<LayoutMain><Kruskal_Wallis_H_test/></LayoutMain>)}/>
                                <Route exact path="/One_way_ANOVA"
                                       element={(<LayoutMain><One_way_ANOVA/></LayoutMain>)}/>
                                <Route exact path="/Wilcoxon_rank_sum_statistic"
                                       element={(<LayoutMain><Wilcoxon_rank_sum_statistic/></LayoutMain>)}/>
                                <Route exact path="/One_way_chi_square_test"
                                       element={(<LayoutMain><One_way_chi_square_test/></LayoutMain>)}/>
                                <Route exact path="/Multiple_comparisons"
                                       element={(<LayoutMain><Multiple_comparisons/></LayoutMain>)}/>
                                <Route exact path="/Homoscedasticity"
                                       element={(<LayoutMain><Homoscedasticity/></LayoutMain>)}/>
                                <Route exact path="/alpha_delta_ratio"
                                       element={(<LayoutMain><AlphaDeltaRatioFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/alpha_variability"
                                       element={(<LayoutMain><AlphaVariabilityFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/asymmetry_indices"
                                       element={(<LayoutMain><AsymmetryIndicesFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/dashboard" element={(<LayoutMain><DashboardPage/></LayoutMain>)}/>
                                <Route exact path="/back_average"
                                       element={(<LayoutMain><BackAveragePage/></LayoutMain>)}/>
                                <Route exact path="/sleep_stage_classification"
                                       element={(<LayoutMain><SleepStageClassificationPage/></LayoutMain>)}/>
                                <Route exact path="/manual_sleep_stage_classification"
                                       element={(<LayoutMain><ManualSleepStagePage/></LayoutMain>)}/>
                                <Route exact path="/group_sleep_analysis"
                                       element={(<LayoutMain><GroupSleepSensitivityAnalysisPage/></LayoutMain>)}/>
                                <Route exact path="/eeg_hypno_upsampling"
                                       element={(<LayoutMain><EEGHypnoUpsampling/></LayoutMain>)}/>
                                {/*<Route exact path="/group_sleep_sensitivity_analysis" element={(<LayoutMain><ManualSleepStagePage/></LayoutMain>)}/>*/}
                                {/*<Route exact path="/group_sleep_sensitivity_analysis_add_subject" element={(<LayoutMain><ManualSleepStagePage/></LayoutMain>)}/>*/}
                                {/*<Route exact path="/group_sleep_sensitivity_analysis_add_subject_final" element={(<LayoutMain><ManualSleepStagePage/></LayoutMain>)}/>*/}
                                {/*<Route exact path="/group_common_channels_across_subjects" element={(<LayoutMain><ManualSleepStagePage/></LayoutMain>)}/>*/}
                                {/*<Route exact path="/group_sleep_analysis_sensitivity_add_subject_add_channels_final" element={(<LayoutMain><ManualSleepStagePage/></LayoutMain>)}/>*/}
                                {/*TODO LEVEL*/}
                                <Route exact path="/level" element={(<LayoutMain><Level/></LayoutMain>)}/>
                                <Route exact path="/actigraphy" element={(<LayoutMain><ActrigraphyViewer/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_test" element={(<LayoutMain><test/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_page" element={(<LayoutMain><ActigraphyFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_masking" element={(<LayoutMain><ActigraphyMasking/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_functional_linear_modelling" element={(<LayoutMain><ActigraphyFunctionalLinearModelling/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_singular_spectrum_analysis" element={(<LayoutMain><ActigraphySingularSpectrumAnalysis/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_detrended_fluctuation_analysis" element={(<LayoutMain><ActigraphyDetrendedFluctuationAnalysis/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_edf_viewer" element={(<LayoutMain><ActigraphyEDFViewer/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_statistics" element={(<LayoutMain><ActigraphyStatistics/></LayoutMain>)}/>
                                <Route exact path="/actigraphy_summary_table" element={(<LayoutMain><ActigraphySummary/></LayoutMain>)}/>
                                <Route exact path="/actigraphy/general" element={(<LayoutMain><ActrigraphyGeneralViewer/></LayoutMain>)}/>
                                <Route exact path="/predictions"
                                       element={(<LayoutMain><PredictionsFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/artifacts"
                                       element={(<LayoutMain><ArtifactsFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/envelope_trend"
                                       element={(<LayoutMain><EnvelopeTrendAnalysis/></LayoutMain>)}/>
                                <Route exact path="/LDA" element={(<LayoutMain><LDAFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/SVC" element={(<LayoutMain><SVCFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/PCA" element={(<LayoutMain><PCAFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/KMeans" element={(<LayoutMain><KMeansFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/linear_regression"
                                       element={(<LayoutMain><LinearRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/ElasticNet"
                                       element={(<LayoutMain><ElasticNetFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/LassoRegression"
                                       element={(<LayoutMain><LassoRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/RidgeRegression"
                                       element={(<LayoutMain><RidgeRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/SGDRegression"
                                       element={(<LayoutMain><SGDRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/LinearSVR"
                                       element={(<LayoutMain><LinearSVRRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/HuberRegression"
                                       element={(<LayoutMain><HuberRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/LinearSVC"
                                       element={(<LayoutMain><LinearSVCRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/LogisticRegressionPinguin"
                                       element={(<LayoutMain><LogisticRegressionPinguinFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/LogisticRegressionStatsmodels" element={(
                                        <LayoutMain><LogisticRegressionStatsmodelsFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/LogisticRegressionSklearn"
                                       element={(<LayoutMain><LogisticRegressionSklearnFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisRiskRatioSimple"
                                       element={(<LayoutMain><SurvivalAnalysisRiskRatioSimple/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisRiskRatioDataset"
                                       element={(<LayoutMain><SurvivalAnalysisRiskRatioDataset/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisRiskDifferenceSimple"
                                       element={(<LayoutMain><SurvivalAnalysisRiskDifferenceSimple/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisRiskDifferenceDataset"
                                       element={(<LayoutMain><SurvivalAnalysisRiskDifferenceDataset/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisNNTSimple"
                                       element={(<LayoutMain><SurvivalAnalysisNNTSimple/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisNNTDataset"
                                       element={(<LayoutMain><SurvivalAnalysisNNTDataset/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisOddsRatioSimple"
                                       element={(<LayoutMain><SurvivalAnalysisOddsRatioSimple/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisOddsRatioDataset"
                                       element={(<LayoutMain><SurvivalAnalysisOddsRatioDataset/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisIncidenceRateRatioSimple" element={(
                                        <LayoutMain><SurvivalAnalysisIncidenceRateRatioSimple/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisIncidenceRateRatioDataset" element={(
                                        <LayoutMain><SurvivalAnalysisIncidenceRateRatioDataset/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisIncidenceRateDifferenceSimple" element={(
                                        <LayoutMain><SurvivalAnalysisIncidenceRateDifferenceSimple/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisIncidenceRateDifferenceDataset" element={(
                                        <LayoutMain><SurvivalAnalysisIncidenceRateDifferenceDataset/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisKaplanMeier"
                                       element={(<LayoutMain><SurvivalAnalysisKaplanMeier/></LayoutMain>)}/>
                                <Route exact path="/FisherExact" element={(<LayoutMain><FisherExact/></LayoutMain>)}/>
                                <Route exact path="/McNemar" element={(<LayoutMain><McNemar/></LayoutMain>)}/>
                                <Route exact path="/Ancova" element={(<LayoutMain><Ancova/></LayoutMain>)}/>
                                <Route exact path="/Anova_RM" element={(<LayoutMain><Anova_RM/></LayoutMain>)}/>
                                <Route exact path="/Pairwise_test"
                                       element={(<LayoutMain><Pairwise_test/></LayoutMain>)}/>
                                <Route exact path="/Anova" element={(<LayoutMain><Anova/></LayoutMain>)}/>
                                <Route exact path="/Welch_Anova" element={(<LayoutMain><Welch_Anova/></LayoutMain>)}/>
                                <Route exact path="/LinearMixedEffectsModel"
                                       element={(<LayoutMain><LinearMixedEffectsModel/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisCoxRegression"
                                       element={(<LayoutMain><SurvivalAnalysisCoxRegression/></LayoutMain>)}/>
                                <Route exact path="/SurvivalAnalysisTimeVaryingCovariates"
                                       element={(<LayoutMain><SurvivalAnalysisTimeVaryingCovariates/></LayoutMain>)}/>
                                <Route exact path="/PrincipalComponentAnalysis"
                                       element={(<LayoutMain><PrincipalComponentAnalysis/></LayoutMain>)}/>
                                <Route exact path="/TSNE" element={(<LayoutMain><TSNE/></LayoutMain>)}/>
                                <Route exact path="/sleep_statistic"
                                       element={(<LayoutMain><SleepStatisticsFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/spectogram_bandpower"
                                       element={(<LayoutMain><SpectogramBandpowerFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/slowwave_spindle"
                                       element={(<LayoutMain><SlowwaveSpindleFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/slowwaves"
                                       element={(<LayoutMain><SlowwaveFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/spindles"
                                       element={(<LayoutMain><SpindleFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/testing" element={(<LayoutMain><TestingPage/></LayoutMain>)}/>
                                <Route exact path="/power_spectral_density_main"
                                       element={(<LayoutMain><PowerSpectralDensityPage/></LayoutMain>)}/>
                                <Route exact path="/FactorAnalysis"
                                       element={(<LayoutMain><FactorAnalysisFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/GeneralizedEstimatingEquations" element={(
                                        <LayoutMain><GeneralizedEstimatingEquationsFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/Structural_Equation_Models_Optimization"
                                       element={(<LayoutMain><Structural_Equation_Models_Optimization/></LayoutMain>)}/>
                                <Route exact path="/Exploratory_Factor_Analysis_extract_latent_structure" element={(
                                        <LayoutMain><Exploratory_Factor_Analysis_extract_latent_structure/></LayoutMain>)}/>
                                <Route exact path="/Mixed_Anova" element={(<LayoutMain><Mixed_Anova/></LayoutMain>)}/>
                                <Route exact path="/General_Stats_Average"
                                       element={(<LayoutMain><General_Stats_Average/></LayoutMain>)}/>
                                <Route exact path="/General_Stats_Min"
                                       element={(<LayoutMain><General_Stats_Min/></LayoutMain>)}/>
                                <Route exact path="/General_Stats_Max"
                                       element={(<LayoutMain><General_Stats_Max/></LayoutMain>)}/>
                                <Route exact path="/General_Stats_Zscore"
                                       element={(<LayoutMain><General_Stats_Zscore/></LayoutMain>)}/>
                                <Route exact path="/General_Stats_Std"
                                       element={(<LayoutMain><General_Stats_Std/></LayoutMain>)}/>
                                <Route exact path="/General_Stats_Cov"
                                       element={(<LayoutMain><General_Stats_Cov/></LayoutMain>)}/>
                                <Route exact path="/Actigraphy_Cosinor"
                                       element={(<LayoutMain><Actigraphy_Cosinor/></LayoutMain>)}/>
                                <Route exact path="/Actigraphy_Metrics"
                                       element={(<LayoutMain><Actigraphy_Metrics/></LayoutMain>)}/>
                                <Route exact path="/ChooseFactors"
                                       element={(<LayoutMain><ChooseFactorsFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/GrangerAnalysis"
                                       element={(<LayoutMain><GrangerAnalysisFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/PoissonRegression"
                                       element={(<LayoutMain><PoissonRegressionFunctionPage/></LayoutMain>)}/>
                                <Route exact path="/ValuesImputation"
                                       element={(<LayoutMain><ValuesImputation/></LayoutMain>)}/>
                                <Route exact path="/LinearRegressionModelCreation"
                                       element={(<LayoutMain><LinearRegressionModelCreation/></LayoutMain>)}/>
                                <Route exact path="/LogisticRegressionModelCreation"
                                       element={(<LayoutMain><LogisticRegressionModelCreation/></LayoutMain>)}/>
                                <Route exact path="/SVCModelCreation"
                                       element={(<LayoutMain><SVCModelCreation/></LayoutMain>)}/>
                                <Route exact path="/LinearRegressionModelLoad"
                                       element={(<LayoutMain><LinearRegressionModelLoad/></LayoutMain>)}/>
                                <Route exact path="/LogisticRegressionModelLoad"
                                       element={(<LayoutMain><LogisticRegressionModelLoad/></LayoutMain>)}/>
                                <Route exact path="/SVCModelLoad"
                                       element={(<LayoutMain><SVCModelLoad/></LayoutMain>)}/>
                                <Route exact path="/XGBoostModelCreation"
                                       element={(<LayoutMain><XGBoostModelCreation/></LayoutMain>)}/>
                                <Route exact path="/XGBoostModelLoad"
                                       element={(<LayoutMain><XGBoostModelLoad/></LayoutMain>)}/>
                                <Route exact path="/AutoencoderModelCreation"
                                       element={(<LayoutMain><AutoencoderModelCreation/></LayoutMain>)}/>
                                <Route exact path="/AutoencoderModelLoad"
                                       element={(<LayoutMain><AutoencoderModelLoad/></LayoutMain>)}/>
                                <Route exact path="/DatasetConcat"
                                       element={(<LayoutMain><DatasetConcat/></LayoutMain>)}/>
                            </Routes>
                        </BrowserRouter>
                    </ThemeProvider>
                </StyledEngineProvider>
            // </ReactKeycloakProvider>
    );
}

export default App;
