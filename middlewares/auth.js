const jwt = require('jsonwebtoken');
const config = require('../config/config');

const auth = async (req, res, next) => {
    const header_token = req.headers.auth;

    if (!header_token)
      return res.status(401).send({ error: 'Token não enviado!' });
      
    try {
        const decoded = await jwt.verify(header_token, config.jwt_pass)
        
        res.locals.auth_data = decoded;

        return next();
    }
    catch(err) {
        return res.status(401).send({ error: 'Token inválido' });
    }
    
}

module.exports = auth;