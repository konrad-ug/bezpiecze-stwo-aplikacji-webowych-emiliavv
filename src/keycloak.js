import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  realm: 'e-commerce',
  clientId: 'react-app',
  url: 'http://localhost:8080'
});

export default keycloak;
