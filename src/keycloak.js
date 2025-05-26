import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  realm: 'e-commerce',
  clientId: 'react-app',
  url: 'http://localhost:8080',
  resource: 'react-app'
});

keycloak.init({
  onLoad: 'check-sso',
  checkLoginIframe: false,
  pkceMethod: 'S256'
});

export default keycloak;
