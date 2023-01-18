// import React, {Component} from "react";
// import Keycloak, {KeycloakConfig} from "keycloak-js";
// import Main from "./Main";
//
//
// class SecuredKeyCloak extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {keycloak: null, authenticated: false}
//     }
//
//     componentDidMount() {
//         const keycloak = new Keycloak({
//             "realm": "mescobrad",
//             "url": "http://localhost:8081/auth/",
//             "clientId": "qbr"
//         })
//         keycloak.init({onLoad: 'login-required'}).then(authenticated => {
//             this.setState(({keycloak: keycloak, authenticated: authenticated}))
//             if (authenticated) {
//                 window.accessToken = keycloak.token;
//             }
//         })
//     }
//
//     render() {
//         if (this.state.keycloak) {
//             if (this.state.authenticated) return (
//                     <Main/>
//             )
//             else return (<div><p>Unable to login</p></div>)
//         }
//         return (<div>
//             Initializing keycloak...
//         </div>)
//     }
// }
//
// export default SecuredKeyCloak;
