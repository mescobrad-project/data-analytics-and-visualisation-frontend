import React, {useState, useEffect} from 'react';
import {Grid} from '@mui/material'
import AppBarCustom from "../components/ui-components/AppBarCustom";
import Keycloak from "keycloak-js";
import "../components/css/loading.css"
import {ReactKeycloakProvider, useKeycloak} from "@react-keycloak/web";
import keycloakConfig from "../Keycloak";


// import { useKeycloak } from "@react-keycloak/web";

const LayoutMainInner = ({children}) => {
    const {keycloak, initialized} = useKeycloak();
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    const isLoggedIn = keycloak.authenticated;

    keycloak.init({ onLoad: 'login-required' }).then(() => console.log("INITIALISED"))

    useEffect(() => {
        // keycloak.login()
        console.log("isLoggedIn")
        console.log(isLoggedIn)
        console.log("keycloak")
        console.log(keycloak)
        // keycloak.login()
    }, [isLoggedIn, keycloak]);

    if (!keycloak.authenticated) {
        return (
                <Grid container spacing={0} direction="column">
                    <Grid item xs={12}>
                        <AppBarCustom/>
                    </Grid>
                    <Grid item container spacing={0} direction="row">
                        {/*<Grid item xs={1}>*/}
                        {/*</Grid>*/}
                        <Grid item xs={12}>
                            {children}
                        </Grid>
                        {/*<Grid item xs={1}>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Grid>
        )
    } else {
        return (
                <Grid item container spacing={0} direction="row">
                    <button
                            type="button"
                            className="text-blue-800"
                            onClick={() => keycloak.login()}
                    >
                        Login
                    </button>
                    <button
                            type="button"
                            className="text-blue-800"
                            onClick={() => {
                                console.log(keycloak)
                            }}
                    >
                        Check
                    </button>
                </Grid>
        )
    }
};


// export default LayoutMain;

const LayoutMain = ({children}) => {
    return (
            <ReactKeycloakProvider authClient={keycloakConfig}>
            <LayoutMainInner></LayoutMainInner>
            </ReactKeycloakProvider>
    )
}

export default LayoutMain;

// const LayoutMain = ({children}) => {
//     // const [keycloak, setKeycloak] = useState(null);
//     // const [authenticated, setAuthenticated] = useState(false);
//
//     useEffect(() => {
//         // console.log(this.state.keycloak)
//         // console.log(this.state.authenticated)
//
//
//
//
//
//         // const keycloak = new Keycloak({
//         //     "realm": "mescobrad",
//         //     "url": "https://idm.digital-enabler.eng.it/auth/",
//         //     // "clientId": "data-analytics"
//         //     "clientId": "home-app"
//         // })
//         // console.log("Authentication Start")
//         //
//         // keycloak.init({onLoad: 'login-required'}).then(authenticated => {
//         //     setAuthenticated(authenticated)
//         //     setKeycloak(keycloak)
//         //     console.log("Authentication Start 2")
//         //
//         //     // this.setState(({keycloak: keycloak, authenticated: authenticated}))
//         //     if (authenticated) {
//         //         window.accessToken = keycloak.token;
//         //     }
//         //     console.log("Authentication info")
//         //     console.log(authenticated)
//         //     console.log(keycloak)
//         //     // console.log()
//         // })
//     }, []);
//
//     const { keycloak, initialized } = useKeycloak();
//     const isLoggedIn = keycloak.authenticated;
//     // TODO add a variable to check if file is downloaded from backend when applicable
//     // if (keycloak) {
//     //    if (authenticated) return (
//     return (
//         <Grid container spacing={0} direction= "column">
//             <Grid item xs={12}>
//                 <AppBarCustom/>
//             </Grid>
//             <Grid item container spacing={0} direction="row">
//                 {/*<Grid item xs={1}>*/}
//                 {/*</Grid>*/}
//                 <Grid item xs={12} >
//                     {!keycloak.authenticated && (
//                             <button
//                                     type="button"
//                                     className="text-blue-800"
//                                     onClick={() => keycloak.login()}
//                             >
//                                 Login
//                             </button>
//                     )}
//                     {!!keycloak.authenticated && (
//
//                             {children}
//                     )}
//                 </Grid>
//                 {/*<Grid item xs={1}>*/}
//                 {/*</Grid>*/}
//             </Grid>
//         </Grid>
//     )
//
//     // if (keycloak.authenticated) {
//     //     if (keycloak.authenticated) return (
//     //             <Grid container spacing={0} direction= "column">
//     //                 <Grid item xs={12}>
//     //                     <AppBarCustom/>
//     //                 </Grid>
//     //                 <Grid item container spacing={0} direction="row">
//     //                     {/*<Grid item xs={1}>*/}
//     //                     {/*</Grid>*/}
//     //                     <Grid item xs={12} >
//     //                         {!keycloak.authenticated && (
//     //                                 <button
//     //                                         type="button"
//     //                                         className="text-blue-800"
//     //                                         onClick={() => keycloak.login()}
//     //                                 >
//     //                                     Login
//     //                                 </button>
//     //                         )}
//     //
//     //                         {!!keycloak.authenticated && (
//     //                                 {children}
//     //                         )}
//     //                     </Grid>
//     //                     {/*<Grid item xs={1}>*/}
//     //                     {/*</Grid>*/}
//     //                 </Grid>
//     //             </Grid>
//     //     )
//     //     else return (
//     //             <React.Fragment>
//     //                 <div><p>Unable to login</p></div>
//     //             </React.Fragment>
//     //     )
//     // } else {
//     //     return (
//     //             <React.Fragment>
//     //                 <AppBarCustom/>
//     //                 <div>
//     //                     <button
//     //                             type="button"
//     //                             className="text-blue-800"
//     //                             onClick={() => {
//     //                                 console.log("Hello")
//     //                                 console.log(keycloak.authenticated)
//     //                                 keycloak.login()
//     //                             }
//     //                             }
//     //                     >
//     //                         Login
//     //                     </button>
//     //                     {/*Initializing keycloak...*/}
//     //                     {/*<div className="lds-dual-ring"></div>*/}
//     //                 </div>
//     //             </React.Fragment>
//     //     )
//     // }
//
//             // return (
//             //     <Grid container spacing={0} direction= "column">
//             //         <Grid item xs={12}>
//             //             <AppBarCustom/>
//             //         </Grid>
//             //         <Grid item container spacing={0} direction="row">
//     //             {/*<Grid item xs={1}>*/}
//     //             {/*</Grid>*/}
//     //             <Grid item xs={12} >
//     //                 {children}
//     //             </Grid>
//     //             {/*<Grid item xs={1}>*/}
//     //             {/*</Grid>*/}
//     //         </Grid>
//     //     </Grid>
//     // )
//         ;
// }
//
// export default LayoutMain;
