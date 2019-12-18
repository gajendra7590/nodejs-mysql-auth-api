const express = require('express');
const router = express.Router();
var jwt = require('jsonwebtoken');
var randomString = require('random-string');
var moment = require('moment');


const config = require('../config/app');
const authModel = require('../models/authModel');

function randomKey() {
    return randomString({ length: 48 });
}

function createTokenResponse(email) {
    var token = jwt.sign({ email: email }, config.API_KEY, { expiresIn: config.JWT_TOKEN_EXPIRE_IN });
    let userData = {
        access_token: token,
        token_type: 'bearer',
        expires_in: config.JWT_TOKEN_EXPIRE_IN
    };
    return userData;
}

function authMiddleWare(req, res, next) {
    if ((typeof (req.headers.authorization) != 'undefined') && (req.headers.authorization != '')) {
        let token = (req.headers.authorization).split(" ")[1];
        if (token != '') {
            jwt.verify(token, config.API_KEY, function (err, result) {
                if (err) {
                    res.status(401).json({ status: false, status_code: 401, message: 'Invalid token' });
                } else { next(); }
            });
        } else {
            res.status(401).json({ status: false, status_code: 401, message: 'UnAuthorised request' });
        }
    } else {
        res.status(401).json({ status: false, status_code: 401, message: 'UnAuthorised request' });
    }
}


//User Sign In Method
router.post('/login', async (req, res) => {
    let key = config.API_KEY;
    let Q = "SELECT id,firstName,lastName,email,phone FROM users WHERE email = '" + req.body.email + "' AND password ='" + req.body.password + "'";
    var result = await authModel.customQuery(Q);
    if (typeof (result.data) != 'undefined' && result.data.length > 0) {
        let refreshToken = randomKey(); // get new refresh token
        let cDate = moment().format('YYYY-DD-MM HH:mm:ss');

        //Update The Refresh Token in DataBase
        let updateRefreshToken = await authModel.updateData('users',
            { refresh_token: refreshToken, refresh_token_created_at: cDate },
            { id: { operator: '=', value: result.data[0].id } }
        );

        let newResponse = await createTokenResponse(result.data[0].email);
        newResponse.refresh_token = refreshToken;
        res.json({ status: true, status_code: 200, auth_data: newResponse });

    } else if (typeof (result.data) != 'undefined') {
        res.json({
            status: false,
            status_code: 200,
            message: 'Your Credentials do not match with any record'
        });
    } else {
        res.json({ "error": "something went wring" });
    }
});

//User Sign In Method
router.post('/register', async (req, res) => {
    let refreshToken = randomKey(); // get new refresh token
    let cDate = moment().format('YYYY-DD-MM HH:mm:ss');
    let insertData = {
        "firstName": (typeof (req.body.firstName) != 'undefined') ? req.body.firstName : null,
        "lastName": (typeof (req.body.lastName) != 'undefined') ? req.body.lastName : null,
        "email": (typeof (req.body.email) != 'undefined') ? req.body.email : null,
        "phone": (typeof (req.body.phone) != 'undefined') ? req.body.phone : null,
        "password": (typeof (req.body.password) != 'undefined') ? req.body.password : null,
        "refresh_token": refreshToken,
        "refresh_token_created_at": cDate,
        "createdAt": cDate,
        "status": 1
    }
    var result = await authModel.insertData('users', insertData);
    if ((typeof (result.status) != 'undefined') && result.status == true) {
        let newResponse = await createTokenResponse(req.body.email);
        newResponse.refresh_token = refreshToken;
        res.json({ status: true, status_code: 200, auth_data: newResponse });
    } else if ((typeof (result.status) != 'undefined') && result.status == false) {
        res.json(result)
    } else {
        res.json({ status: false, status_code: 200, message: 'Something went wrong' })
    }
});


//Logout function
router.post('/logout', authMiddleWare, async (req, res) => {
    let token = (req.headers.authorization).split(" ")[1];
    await jwt.verify(token, config.API_KEY, function (err, decoded) {
        if (!err) {
            // res.send(decoded.email)
        }
    });
    res.status(200).send({ status: true, status_code: 200, message: 'You have been logged out successfully' });
});


//Regenerate access_token via reFresh Token
router.post('/reGenerateToken', async (req, res) => {
    if ((typeof (req.body.refresh_token) != 'undefined') && req.body.refresh_token != '') {
        let Q = "SELECT * FROM users WHERE refresh_token = '" + req.body.refresh_token + "'";
        let result = await authModel.customQuery(Q);
        if ((typeof (result.data) != 'undefined') && result.data.length > 0) {
            let refreshToken = randomKey(); // get new refresh token
            let cDate = moment().format('YYYY-DD-MM HH:mm:ss');
            //Update Refresh Token
            let updateRefreshToken = await authModel.updateData('users',
                { refresh_token: refreshToken, refresh_token_created_at: cDate },
                { id: { operator: '=', value: result.data[0].id } }
            );
            let newResponse = createTokenResponse(result.data[0].email);
            newResponse.refresh_token = refreshToken;
            res.json({ status: true, status_code: 200, auth_data: newResponse });
        } else {
            res.status(401).json({ status: false, status_code: 401, message: "Invalid refresh token" })
        }
    }
});


module.exports = router;