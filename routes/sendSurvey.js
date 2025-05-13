const express = require('express');
const axios = require('axios');
const getAccessToken = require('../utils/getAccessToken');

const router = express.Router();

router.post('/send-email', async (req, res) => {
    try {
        const accessToken = await getAccessToken();

        // Use your actual internal user address (from Microsoft 365 / Azure AD)
        const userEmail = 'austin@austinjonnyqgmail.onmicrosoft.com'

        const emailData = {
            message: {
                subject: 'Hello from Outlook API',
                body: {
                    contentType: 'Text',
                    content: 'This is a test email sent using the Outlook API.'
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: 'austin.jonnyq@gmail.com'
                        }
                    }
                ]
            },
            saveToSentItems: 'true'
        };

        console.log('Access Token:', accessToken);


        const response = await axios.post(
            `https://graph.microsoft.com/v1.0/users/${userEmail}/sendMail`,
            emailData,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.status(200).json({ message: 'Email sent successfully!', status: response.status });
    } catch (error) {
        console.error('Error sending email:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to send email', details: error.response?.data || error.message });
    }
});

module.exports = router;
