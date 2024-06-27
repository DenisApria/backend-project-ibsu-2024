const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
const configData = fs.readFileSync('.env');
const buf = Buffer.from(configData);
const config = dotenv.parse(buf);

module.exports = {
    requireLogin: (req, res, next) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: 'missing_token' });
        }

        jwt.verify(token.split(' ')[1], config.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'invalid_session' });
            }
            req.user = decoded;
            next();
        });
    },
    requirePermits: function () {

        const permits = [];
        for (let i = 0, l = arguments.length; i < l; i++) {
            if (typeof arguments[i] == 'string') {
                permits.push(arguments[i]);
            }
        }
    
        return (req, res, next) => {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                console.log('No authorization header provided');
                return res.status(401).json({ message: 'Authorization header is missing' });
            }
            const parts = authHeader.split(' ');

            const token = authHeader.split(' ')[1]; // Extract the token part

            jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
                if (err) {
                    console.log('Token verification failed:', err);
                    return res.status(401).json({ message: 'invalid_session' });
                }
                
                req.user = decoded;
    
                for (const permit of permits) {
                    if ((req.user.permits || []).includes(permit)) {
                        return next();
                    }
                }
                return res.status(403).json({ message: 'invalid_access' });
            });
    
        }
    }
};
