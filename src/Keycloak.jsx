import Keycloak from "keycloak-js";
const keycloakConfig = new Keycloak({
    // onLoad: 'check-sso',
    url: "https://idm.digital-enabler.eng.it/auth/",
    realm: "mescobrad",
    // clientId: "home-app",
    clientId: "data-analytics",
});

export default keycloakConfig;
