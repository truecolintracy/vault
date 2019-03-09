const graph = require("@microsoft/microsoft-graph-client");

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  try {
    const user = await client.api("/me").get();
    const manager = await client.api("/me/manager").get();
    const userAvatar = await client.api("/me/photo/$value").responseType(graph.ResponseType.BLOB).get();
    const groups = await client.api("/me/memberOf").get();
    
    return {
      me: user,
      manager: manager,
      avatar: userAvatar,
      groups: groups
    }
  } catch (err) {
    throw err
  }
}