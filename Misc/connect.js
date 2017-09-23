var docusign = require('docusign-esign');
var async = require('async');

var integratorKey  = 'a98a0b2e-b9f6-4fa7-ac04-212c45ee0246',    // Integrator Key associated with your DocuSign Integration
  email            = 'vcphng@hotmail.com',             // Email for your DocuSign Account
  password         = 'Bulbasaur92',          // Password for your DocuSign Account
  recipientName    = 'Victor Phung',    // Recipient's Full Name
  recipientEmail   = 'vcphng@hotmail.com';   // Recipient's Email

var basePath = "https://demo.docusign.net/restapi";

// initialize the api client
var apiClient = new docusign.ApiClient();
apiClient.setBasePath(basePath);

// create JSON formatted auth header
var creds = JSON.stringify({
  Username: email,
  Password: password,
  IntegratorKey: integratorKey
});

// configure DocuSign authentication header
apiClient.addDefaultHeader("X-DocuSign-Authentication", creds);

// assign api client to the Configuration object
docusign.Configuration.default.setDefaultApiClient(apiClient);

async.waterfall([
  function login (next) {
    // login call available off the AuthenticationApi
    var authApi = new docusign.AuthenticationApi();

    // login has some optional parameters we can set
    var loginOps = new authApi.LoginOptions();
    loginOps.setApiPassword("true");
    loginOps.setIncludeAccountIdGuid("true");
    authApi.login(loginOps, function (err, loginInfo, response) {
      if (err) {
        return next(err);
      }
      if (loginInfo) {
        // list of user account(s)
        // note that a given user may be a member of multiple accounts
        var loginAccounts = loginInfo.getLoginAccounts();
        console.log("LoginInformation: " + JSON.stringify(loginAccounts));
        next(null, loginAccounts);
      }
    });
  }
]);