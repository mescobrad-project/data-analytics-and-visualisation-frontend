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
// import { install } from '@material-ui/styles';
//
// install();

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
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
