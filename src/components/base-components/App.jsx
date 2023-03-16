import '../../style-sheets/App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';

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
import SurvivalAnalysisIncidenceRateRatioSimple from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateRatioSimple";
import SurvivalAnalysisIncidenceRateRatioDataset from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateRatioDataset"
import SurvivalAnalysisIncidenceRateDifferenceDataset from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateDifferenceDataset"
import SurvivalAnalysisIncidenceRateDifferenceSimple
    from "../../pages/hypothesis_testing/SurvivalAnalysisIncidenceRateDifferenceSimple";
import FisherExact from "../../pages/hypothesis_testing/FisherExact";
import McNemar from "../../pages/hypothesis_testing/McNemar";
import Ancova from "../../pages/hypothesis_testing/Ancova"
import LinearMixedEffectsModel from "../../pages/hypothesis_testing/LinearMixedEffectsModel";
import SurvivalAnalysisCoxRegression from "../../pages/hypothesis_testing/SurvivalAnalysisCoxRegression"
import SurvivalAnalysisTimeVaryingCovariates from "../../pages/hypothesis_testing/SurvivalAnalysisTimeVaryingCovariates"
import PrincipalComponentAnalysis from "../../pages/hypothesis_testing/PrincipalComponentAnalysis"
import SlowwaveSpindleFunctionPage from "./SlowwaveSpindleFunctionPage";
import TestingPage from "./TestingPage";
import SleepStatisticsFunctionPage from "./SleepStatisticsFunctionPage";
import SpectogramBandpowerFunctionPage from "./SpectogramBandpowerFunctionPage";
import Canonical_correlation from "../../pages/hypothesis_testing/Canonical_correlation"
import SurvivalAnalysisKaplanMeier from "../../pages/hypothesis_testing/SurvivalAnalysisKaplanMeier";

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



const App = () => {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/" element={(<LayoutMain><WelcomePage/></LayoutMain>)}/>
                        <Route exact path="/auto_correlation" element={(<LayoutMain><AutoCorrelationFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/partial_auto_correlation" element={(<LayoutMain><PartialAutoCorrelationFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/filters" element={(<LayoutMain><FiltersFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/welch" element={(<LayoutMain><WelchFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/stft" element={(<LayoutMain><StftFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/find_peaks" element={(<LayoutMain><FindPeaksPage/></LayoutMain>)}/>
                        <Route exact path="/periodogram" element={(<LayoutMain><PeriodogramFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/power_spectral_density" element={(<LayoutMain><PowerSpectralDensity/></LayoutMain>)}/>
                        <Route exact path="/freesurfer/recon" element={(<LayoutMain><FreesurferReconFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/eeg/old" element={(<LayoutMain><EEGAnalysisFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/eeg" element={(<LayoutMain><EEGViewer/></LayoutMain>)}/>
                        {/*TODO*/}
                        <Route exact path="/mri" element={(<LayoutMain><MRIViewer/></LayoutMain>)}/>
                        <Route exact path="/eeg/pre" element={(<LayoutMain><EEGAnalysisFunctionPage/></LayoutMain>)}/>

                        <Route exact path="/spindles" element={(<LayoutMain><SpindleDetection/></LayoutMain>)}/>
                        <Route exact path="/slowwaves" element={(<LayoutMain><SlowWaves/></LayoutMain>)}/>
                        {/*<Route exact path="/auto_correlation" element={(<LayoutMain> <LayoutSimpleFunctions mainContent={<AutoCorrelationFunctionPage/>}></LayoutSimpleFunctions></LayoutMain>)}/>*/}
                        <Route exact path="/error" element={(<LayoutMain><PageError /></LayoutMain>)}/>
                        <Route exact path="/Freesurfer_ReconAll_Results" element={(<LayoutMain><Freesurfer_ReconAll_ResultsPage/></LayoutMain>)}/>
                        <Route exact path="/Freesurfer_Samseg_Results" element={(<LayoutMain><Freesurfer_Samseg_ResultsPage/></LayoutMain>)}/>
                        <Route exact path="/normality_Tests" element={(<LayoutMain><Normality_Tests/></LayoutMain>)}/>
                        <Route exact path="/normality_Tests_And" element={(<LayoutMain><Normality_Tests_And/></LayoutMain>)}/>
                        <Route exact path="/transform_data" element={(<LayoutMain><Transform_data/></LayoutMain>)}/>
                        <Route exact path="/Pearson_correlation" element={(<LayoutMain><Pearson_correlation/></LayoutMain>)}/>
                        <Route exact path="/Spearman_correlation" element={(<LayoutMain><Spearman_correlation/></LayoutMain>)}/>
                        <Route exact path="/Biweight_midcorrelation" element={(<LayoutMain><Biweight_midcorrelation/></LayoutMain>)}/>
                        <Route exact path="/Percentage_bend_correlation" element={(<LayoutMain><Percentage_bend_correlation/></LayoutMain>)}/>
                        <Route exact path="/Shepherd_pi_correlation" element={(<LayoutMain><Shepherd_pi_correlation/></LayoutMain>)}/>
                        <Route exact path="/Skipped_spearman_correlation" element={(<LayoutMain><Skipped_spearman_correlation/></LayoutMain>)}/>
                        <Route exact path="/PointBiserialCorrelation" element={(<LayoutMain><PointBiserialCorrelation/></LayoutMain>)}/>
                        <Route exact path="/Kendalltau_correlation" element={(<LayoutMain><Kendalltau_correlation/></LayoutMain>)}/>
                        <Route exact path="/Canonical_correlation" element={(<LayoutMain><Canonical_correlation/></LayoutMain>)}/>
                        <Route exact path="/DataTransformationForANOVA" element={(<LayoutMain><DataTransformationForANOVA/></LayoutMain>)}/>
                        <Route exact path="/Welch_t_test" element={(<LayoutMain><Welch_t_test/></LayoutMain>)}/>
                        <Route exact path="/Independent_t_test" element={(<LayoutMain><Independent_t_test/></LayoutMain>)}/>
                        <Route exact path="/Two_Related_samples_t_test" element={(<LayoutMain><Two_Related_samples_t_test/></LayoutMain>)}/>
                        <Route exact path="/Mann_Whitney" element={(<LayoutMain><Mann_Whitney/></LayoutMain>)}/>
                        <Route exact path="/Wilcoxon_signed_rank_test" element={(<LayoutMain><Wilcoxon_signed_rank_test/></LayoutMain>)}/>
                        <Route exact path="/Alexander_Govern_test" element={(<LayoutMain><Alexander_Govern_test/></LayoutMain>)}/>
                        <Route exact path="/Kruskal_Wallis_H_test" element={(<LayoutMain><Kruskal_Wallis_H_test/></LayoutMain>)}/>
                        <Route exact path="/One_way_ANOVA" element={(<LayoutMain><One_way_ANOVA/></LayoutMain>)}/>
                        <Route exact path="/Wilcoxon_rank_sum_statistic" element={(<LayoutMain><Wilcoxon_rank_sum_statistic/></LayoutMain>)}/>
                        <Route exact path="/One_way_chi_square_test" element={(<LayoutMain><One_way_chi_square_test/></LayoutMain>)}/>
                        <Route exact path="/Multiple_comparisons" element={(<LayoutMain><Multiple_comparisons/></LayoutMain>)}/>
                        <Route exact path="/Homoscedasticity" element={(<LayoutMain><Homoscedasticity/></LayoutMain>)}/>
                        <Route exact path="/alpha_delta_ratio" element={(<LayoutMain><AlphaDeltaRatioFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/alpha_variability" element={(<LayoutMain><AlphaVariabilityFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/asymmetry_indices" element={(<LayoutMain><AsymmetryIndicesFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/dashboard" element={(<LayoutMain><DashboardPage/></LayoutMain>)}/>
                        {/*TODO LEVEL*/}
                        <Route exact path="/level" element={(<LayoutMain><Level/></LayoutMain>)}/>
                        <Route exact path="/actigraphy" element={(<LayoutMain><ActrigraphyViewer/></LayoutMain>)}/>
                        <Route exact path="/actigraphy/general" element={(<LayoutMain><ActrigraphyGeneralViewer/></LayoutMain>)}/>
                        <Route exact path="/predictions" element={(<LayoutMain><PredictionsFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/artifacts" element={(<LayoutMain><ArtifactsFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/envelope_trend" element={(<LayoutMain><EnvelopeTrendAnalysis/></LayoutMain>)}/>
                        <Route exact path="/LDA" element={(<LayoutMain><LDAFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/SVC" element={(<LayoutMain><SVCFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/PCA" element={(<LayoutMain><PCAFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/KMeans" element={(<LayoutMain><KMeansFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/linear_regression" element={(<LayoutMain><LinearRegressionFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/ElasticNet" element={(<LayoutMain><ElasticNetFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/LassoRegression" element={(<LayoutMain><LassoRegressionFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/RidgeRegression" element={(<LayoutMain><RidgeRegressionFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/SGDRegression" element={(<LayoutMain><SGDRegressionFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/LinearSVR" element={(<LayoutMain><LinearSVRRegressionFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/HuberRegression" element={(<LayoutMain><HuberRegressionFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/LinearSVC" element={(<LayoutMain><LinearSVCRegressionFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/LogisticRegressionPinguin" element={(<LayoutMain><LogisticRegressionPinguinFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/LogisticRegressionStatsmodels" element={(<LayoutMain><LogisticRegressionStatsmodelsFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/LogisticRegressionSklearn" element={(<LayoutMain><LogisticRegressionSklearnFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisRiskRatioSimple" element={(<LayoutMain><SurvivalAnalysisRiskRatioSimple/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisRiskRatioDataset" element={(<LayoutMain><SurvivalAnalysisRiskRatioDataset/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisRiskDifferenceSimple" element={(<LayoutMain><SurvivalAnalysisRiskDifferenceSimple/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisRiskDifferenceDataset" element={(<LayoutMain><SurvivalAnalysisRiskDifferenceDataset/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisNNTSimple" element={(<LayoutMain><SurvivalAnalysisNNTSimple/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisNNTDataset" element={(<LayoutMain><SurvivalAnalysisNNTDataset/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisOddsRatioSimple" element={(<LayoutMain><SurvivalAnalysisOddsRatioSimple/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisOddsRatioDataset" element={(<LayoutMain><SurvivalAnalysisOddsRatioDataset/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisIncidenceRateRatioSimple" element={(<LayoutMain><SurvivalAnalysisIncidenceRateRatioSimple/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisIncidenceRateRatioDataset" element={(<LayoutMain><SurvivalAnalysisIncidenceRateRatioDataset/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisIncidenceRateDifferenceSimple" element={(<LayoutMain><SurvivalAnalysisIncidenceRateDifferenceSimple/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisIncidenceRateDifferenceDataset" element={(<LayoutMain><SurvivalAnalysisIncidenceRateDifferenceDataset/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisKaplanMeier" element={(<LayoutMain><SurvivalAnalysisKaplanMeier/></LayoutMain>)}/>
                        <Route exact path="/FisherExact" element={(<LayoutMain><FisherExact/></LayoutMain>)}/>
                        <Route exact path="/McNemar" element={(<LayoutMain><McNemar/></LayoutMain>)}/>
                        <Route exact path="/Ancova" element={(<LayoutMain><Ancova/></LayoutMain>)}/>
                        <Route exact path="/LinearMixedEffectsModel" element={(<LayoutMain><LinearMixedEffectsModel/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisCoxRegression" element={(<LayoutMain><SurvivalAnalysisCoxRegression/></LayoutMain>)}/>
                        <Route exact path="/SurvivalAnalysisTimeVaryingCovariates" element={(<LayoutMain><SurvivalAnalysisTimeVaryingCovariates/></LayoutMain>)}/>
                        <Route exact path="/PrincipalComponentAnalysis" element={(<LayoutMain><PrincipalComponentAnalysis/></LayoutMain>)}/>
                        <Route exact path="/sleep_statistic" element={(<LayoutMain><SleepStatisticsFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/spectogram_bandpower" element={(<LayoutMain><SpectogramBandpowerFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/slowwave_spindle" element={(<LayoutMain><SlowwaveSpindleFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/testing" element={(<LayoutMain><TestingPage/></LayoutMain>)}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
