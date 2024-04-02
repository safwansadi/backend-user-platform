const { API_KEY } = require("../utils/env");

const apikeyAuthMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Assuming API key is sent in the 'x-api-key' header

    if (apiKey !== API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};

module.exports = apikeyAuthMiddleware;
