import React, {useContext, useEffect} from 'react';
// import {useHistory} from "react-router-dom";
// import {AuthContext} from "../contexts/AuthContext";
//
// import {servicesInfo} from "../servicesInfo";
// import InitialPageService from "./InitialPageService";


function WelcomePage() {
    useEffect(() => {
        document.title = ' MES-CoBraD | Analytics Engine'
    }, [])

    return (
        <React.Fragment>
            {/*<h1>{document.title}</h1>*/}
            <h1>MES-CoBraD | Analytics Engine</h1>
            <h3>Welcome to MES-CoBraDs' Analytics Module</h3>
        </React.Fragment>
    );
}

export default WelcomePage;
