const request = require('./request');
const path = require('path');
const result = require('dotenv').config({ path: path.resolve(process.cwd(), './config/dev.env') });


const options = {
    hostname: 'api.emailjs.com',
    path: '/api/v1.0/email/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    }
};


const sendEmail = (template_params) => {

    const emailData = JSON.stringify({
        service_id: process.env.SERVICE_ID,
        template_id: process.env.TEMPLATE_ID,
        user_id: process.env.USER_ID,
        template_params,
    });
    
    request(options, emailData);
};


module.exports = sendEmail;
 



