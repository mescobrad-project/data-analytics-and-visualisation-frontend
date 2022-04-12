import React from 'react';
import { render } from 'react-dom';
import { ThemeProvider } from "@chakra-ui/core";

import Header from "./components/Header";
import Autocorrelation from "./components/Autocorrelation";
import Channels from "./components/Channels";

function App() {
    return (
        <ThemeProvider>
            <Header />
            {/*<Autocorrelation />*/}
            <Channels />
        </ThemeProvider>
    )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)

// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
//
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
