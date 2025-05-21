import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html'
    },
    url: 'http://localhost:8080',
    realm: 'e-commerce',
    clientId: 'react-app'
});

export default keycloak;
