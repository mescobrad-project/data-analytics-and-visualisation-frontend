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
import Pearson_correlation from "../../pages/hypothesis_testing/Pearson_correlation"
import Spearman_correlation from "../../pages/hypothesis_testing/Spearman_correlation";
import PointBiserialCorrelation from "../../pages/hypothesis_testing/PointBiserialCorrelation"
import DataTransformationForANOVA from "../../pages/hypothesis_testing/DataTransformationForANOVA";
import Homoscedasticity from "../../pages/hypothesis_testing/Homoscedasticity";
import AlphaDeltaRatioFunctionPage from "./AlphaDeltaRatioFunctionPage";
import AsymmetryIndicesFunctionPage from "./AsymmetryIndicesFunctionPage";
import Kendalltau_correlation from "../../pages/hypothesis_testing/Kendalltau_correlation"
import Welch_t_test from "../../pages/hypothesis_testing/Welch_t_test";
import Independent_t_test from "../../pages/hypothesis_testing/Independent_t_test";
import Two_Related_samples_t_test from "../../pages/hypothesis_testing/Two_Related_samples_t_test";
import Mann_Whitney from "../../pages/hypothesis_testing/Mann_Whitney";
import Wilcoxon_signed_rank_test from "../../pages/hypothesis_testing/Wilcoxon_signed_rank_test";
import Alexander_Govern_test from "../../pages/hypothesis_testing/Alexander_Govern_test";
import Kruskal_Wallis_H_test from "../../pages/hypothesis_testing/Kruskal_Wallis_H_test";
import One_way_ANOVA from "../../pages/hypothesis_testing/One_way_ANOVA";
import Wilcoxon_rank_sum_statistic from "../../pages/hypothesis_testing/Wilcoxon_rank_sum_statistic";
import One_way_chi_square_test from "../../pages/hypothesis_testing/One_way_chi_square_test";

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
                        <Route exact path="/eeg" element={(<LayoutMain><EEGAnalysisFunctionPage/></LayoutMain>)}/>
                        {/*<Route exact path="/auto_correlation" element={(<LayoutMain> <LayoutSimpleFunctions mainContent={<AutoCorrelationFunctionPage/>}></LayoutSimpleFunctions></LayoutMain>)}/>*/}
                        <Route exact path="/error" element={(<LayoutMain><PageError /></LayoutMain>)}/>
                        <Route exact path="/Freesurfer_ReconAll_Results" element={(<LayoutMain><Freesurfer_ReconAll_ResultsPage/></LayoutMain>)}/>
                        <Route exact path="/Freesurfer_Samseg_Results" element={(<LayoutMain><Freesurfer_Samseg_ResultsPage/></LayoutMain>)}/>
                        <Route exact path="/normality_Tests" element={(<LayoutMain><Normality_Tests/></LayoutMain>)}/>
                        <Route exact path="/transform_data" element={(<LayoutMain><Transform_data/></LayoutMain>)}/>
                        <Route exact path="/Pearson_correlation" element={(<LayoutMain><Pearson_correlation/></LayoutMain>)}/>
                        <Route exact path="/Spearman_correlation" element={(<LayoutMain><Spearman_correlation/></LayoutMain>)}/>
                        <Route exact path="/PointBiserialCorrelation" element={(<LayoutMain><PointBiserialCorrelation/></LayoutMain>)}/>
                        <Route exact path="/Kendalltau_correlation" element={(<LayoutMain><Kendalltau_correlation/></LayoutMain>)}/>
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
                        <Route exact path="/Homoscedasticity" element={(<LayoutMain><Homoscedasticity/></LayoutMain>)}/>
                        <Route exact path="/alpha_delta_ratio" element={(<LayoutMain><AlphaDeltaRatioFunctionPage/></LayoutMain>)}/>
                        <Route exact path="/asymmetry_indices" element={(<LayoutMain><AsymmetryIndicesFunctionPage/></LayoutMain>)}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
