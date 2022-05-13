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


// Import Material UI Customising
import {ThemeProvider, StyledEngineProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import FindPeaksPage from "./FindPeaksPage";


// Theme Colors Declaration
let firstColor = '#59C7F3'
let secondColor = '#FFFFFF'

// Create custom theme for material UI
const theme = createTheme({
    palette: {
        primary: {
            main: firstColor
        },
        secondary: {
            main: secondColor
        },
        barBackgroundFirst: {
            main: `linear-gradient(to right, ${firstColor}, ${secondColor})`
        }
    },
    typography: {
        fontFamily: [
            'Poppins',
            'Roboto',
        ].join(','),
    }
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
                        <Route exact path="/find_peaks" element={(<LayoutMain><FindPeaksPage/></LayoutMain>)}/>
                        {/*<Route exact path="/auto_correlation" element={(<LayoutMain> <LayoutSimpleFunctions mainContent={<AutoCorrelationFunctionPage/>}></LayoutSimpleFunctions></LayoutMain>)}/>*/}
                        <Route exact path="/error" element={(<LayoutMain><PageError /></LayoutMain>)}/>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
