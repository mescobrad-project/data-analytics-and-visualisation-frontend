import Keycloak from "keycloak-js";
const keycloak = new Keycloak({
    url: "https://idm.digital-enabler.eng.it/auth/",
    realm: "mescobrad",
    // clientId: "home-app",
    clientId: "data-analytics",
});

export default keycloak;
