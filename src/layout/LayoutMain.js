import React, {useState, useContext, useEffect} from 'react';
import {Grid, Container} from '@mui/material'
import AppBarCustom from "../components/ui-components/AppBarCustom";
import Keycloak from "keycloak-js";
import "../components/css/loading.css"

const LayoutMain = ({children}) => {
    const [keycloak, setKeycloak] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // console.log(this.state.keycloak)
        // console.log(this.state.authenticated)

        const keycloak = new Keycloak({
            "realm": "mescobrad",
            "url": "https://idm.digital-enabler.eng.it/auth/",
            "clientId": "data-analytics"
        })
        keycloak.init({onLoad: 'login-required'}).then(authenticated => {
            setAuthenticated(authenticated)
            setKeycloak(keycloak)
            // this.setState(({keycloak: keycloak, authenticated: authenticated}))
            if (authenticated) {
                window.accessToken = keycloak.token;
            }
        })
    }, []);

    // TODO add a variable to check if file is downloaded from backend when applicable
    if (true) {
        if (true) return (
                <Grid container spacing={0} direction= "column">
                    <Grid item xs={12}>
                        <AppBarCustom/>
                    </Grid>
                    <Grid item container spacing={0} direction="row">
                        {/*<Grid item xs={1}>*/}
                        {/*</Grid>*/}
                        <Grid item xs={12} >
                            {children}
                        </Grid>
                        {/*<Grid item xs={1}>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
        )
        else return (
                <React.Fragment>
                    <div><p>Unable to login</p></div>
                </React.Fragment>
        )
    }
    return (
            <React.Fragment>
                <AppBarCustom/>
                <div>
                {/*Initializing keycloak...*/}
                <div className="lds-dual-ring"></div>
                </div>
            </React.Fragment>
                )


    // return (
    //     <Grid container spacing={0} direction= "column">
    //         <Grid item xs={12}>
    //             <AppBarCustom/>
    //         </Grid>
    //         <Grid item container spacing={0} direction="row">
    //             {/*<Grid item xs={1}>*/}
    //             {/*</Grid>*/}
    //             <Grid item xs={12} >
    //                 {children}
    //             </Grid>
    //             {/*<Grid item xs={1}>*/}
    //             {/*</Grid>*/}
    //         </Grid>
    //     </Grid>
    // )
        ;
}

export default LayoutMain;
