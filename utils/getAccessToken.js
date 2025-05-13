const axios = require('axios');

async function getAccessToken() {
    const params = new URLSearchParams();
    params.append('client_id', process.env.CLIENT_ID);
    params.append('scope', 'https://graph.microsoft.com/.default');
    params.append('client_secret', process.env.CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    const response = await axios.post(
        `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
        params,
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data.access_token;
}

module.exports = getAccessToken;
