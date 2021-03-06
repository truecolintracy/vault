import * as Msal from 'msal';
import jsCookie from 'js-cookie';

export default class Authentication {
  constructor() {
    const redirectUri = process.env.URL_REDIRECT;

    this.applicationConfig = {
      auth: {
        clientId: process.env.CLIENT_ID,
        authority: process.env.AUTHORITY,
        redirectUri: redirectUri
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true
      }
    }

    this.applicationScope = {
      scopes: ['openid', 'user.read', 'mail.send']
    }

    this.app = typeof window === 'undefined' ? null : new Msal.UserAgentApplication(this.applicationConfig)
    this.handleRedirect = typeof window === 'undefined' ? null : this.app.handleRedirectCallback((error, response) => {
      if(error) {
        console.log(error);
      } else {
        jsCookie.set('token', response.idToken.rawIdToken, { expires: 1 });
      }
  });
  }

  acquireTokenRedirect = () => {
    //Always start with acquireTokenSilent to obtain a token in the signed in user from cache
    this.app.acquireTokenSilent(this.applicationScope).then((tokenResponse) => {
      tokenResponse;
    }).catch((error) => {
        console.log(error);
        // Upon acquireTokenSilent failure (due to consent or interaction or login required ONLY)
        // Call acquireTokenRedirect
        if (requiresInteraction(error.errorCode)) {
            this.app.acquireTokenRedirect(this.applicationScope);
        }
    });
  }

  authRedirectCallBack = (error, response) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`token type is: ${response.tokenType}`)
    }
  }

  requiresInteraction = (errorCode) => {
    if (!errorCode || !errorCode.length) {
        return false;
    }
    return errorCode === "consent_required" || errorCode === "interaction_required" || errorCode === "login_required";
  }

  login = () => {
    this.app.loginRedirect(this.applicationScope);

    
    // if(this.app.getAccount() && !this.app.isCallback(window.location.hash)) {
    //   this.app.acquireTokenRedirect();
    // }
  }

  logout = () => {
    this.app.logout();
  }
  
  getToken = () => {
    let cachedToken = this.app.getCachedToken(this.applicationScope);
    if(cachedToken) {
      return cachedToken.accessToken;
    } else {
      return this.app.acquireTokenSilent(this.applicationScope).then((tokenResponse) => {
        return tokenResponse.accessToken;
      }).catch((err) => {
          if (this.requiresInteraction(err.errorCode)) {
            this.app.acquireTokenRedirect(this.applicationScope);
          }
      }); 
    }
  }

  callMSGraph = (isBlob, token, endpoint) => {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append('Authorization', bearer);
    const options = {
      method: 'GET',
      headers: headers
    };

    return fetch(endpoint, options).then((res) => {
      if (!isBlob) {
        return res.json().then((data) => {        
          return data;
        });  
      } else {
        return res.arrayBuffer().then((data) => {
          const arrayBufferView = new Uint8Array(data)
          const blob = new Blob( [ arrayBufferView ], { type: "image/jpg" } );
          const urlCreator = window.URL || window.webkitURL;
          const imageUrl = urlCreator.createObjectURL( blob );
          return imageUrl;
        })
      }
    });
  }

  sendEmail = (token, message) => {
    const endpoint = 'https://graph.microsoft.com/v1.0/me/sendMail';
    const headers = new Headers();
    const bearer = `Bearer ${token}`;
    headers.append('Authorization', bearer);
    headers.append('Content-Type', 'application/json');
    const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        message: message
      })
    };

    return fetch(endpoint, options).then((res) => {
      return res;
    });
  }

  getUser = () => {
    return this.app.getUser();
  }
}