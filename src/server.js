const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');

const serverValidationErrors = require('./serverValidationErrors');
const sendEmail = require('./sendEmail');

const app = express()

const port = process.env.PORT || 8081;
const urlencodedParser = bodyParser.urlencoded({extended: true});

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['https://rosem.netlify.app']);
    res.append('Access-Control-Allow-Methods', 'POST');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(urlencodedParser);
app.use(bodyParser.json());


app.post('/contact', urlencodedParser, [
    check(['name'])
    .exists().withMessage(serverValidationErrors.valueMissing)
    .notEmpty().withMessage(serverValidationErrors.valueMissing)
    .bail()
    .isLength({min: 2, max: 15}).withMessage(serverValidationErrors.tooShort)
    .isLength({max: 40}).withMessage(serverValidationErrors.tooLong),

    check(['lastName',])
    .exists().withMessage(serverValidationErrors.valueMissing)
    .notEmpty().withMessage(serverValidationErrors.valueMissing)
    .bail()
    .isLength({min: 2, max: 15}).withMessage(serverValidationErrors.tooShort)
    .isLength({max: 40}).withMessage(serverValidationErrors.tooLong),

    check(['email'])
    .exists().withMessage(serverValidationErrors.valueMissing)
    .notEmpty().withMessage(serverValidationErrors.valueMissing)
    .bail()
    .isEmail().withMessage(serverValidationErrors.invalidEmail)
    .normalizeEmail(),

    check(['phone'])
    .optional({checkFalsy: true})
    .isNumeric().withMessage(serverValidationErrors.invalidNumberField),


    check('message')
    .exists().withMessage(serverValidationErrors.valueMissing)
    .notEmpty().withMessage(serverValidationErrors.valueMissing)    
    
], (req, res) => {   
    
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    res.status(200).send(req.body);

    const template_params = {
        to_name: 'Romanna',
        from_name: `${req.body.name} ${req.body.lastName}`,
        from_last_name: req.body.lastName,
        from_email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
        reply_to: req.body.email
    }

    sendEmail(template_params);

});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})

