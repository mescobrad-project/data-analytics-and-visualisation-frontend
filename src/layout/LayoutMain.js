import React, {useState, useContext, useEffect} from 'react';
import {Grid, Container} from '@mui/material'
import AppBarCustom from "../components/ui-components/AppBarCustom";
import Keycloak from "keycloak-js";


const LayoutMain = ({children}) => {
    const [keycloak, setKeycloak] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        // console.log(this.state.keycloak)
        // console.log(this.state.authenticated)
        console.log("HELLO TEST")

        const keycloak = new Keycloak({
            "realm": "mescobrad",
            "url": "http://localhost:8081/auth/",
            "clientId": "qbr"
        })
        keycloak.init({onLoad: 'login-required'}).then(authenticated => {
            console.log(keycloak)
            console.log(authenticated)

            setAuthenticated(authenticated)
            setKeycloak(keycloak)
            // this.setState(({keycloak: keycloak, authenticated: authenticated}))
            if (authenticated) {
                window.accessToken = keycloak.token;
            }
        })
    });

    // if (keycloak) {
    //     if (authenticated) return (
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
                Initializing keycloak...
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
