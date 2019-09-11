const express = require('express');
const router = express.Router();

const Users = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const UserController = require('../controllers/UserController');



router.get('/', UserController.index);

router.post('/create', UserController.store);

router.post('/auth', UserController.auth);

module.exports = router;


/**
 * 
 * Códigos 
 * 
 * 200 - OK
 * 201 - Created
 * 202 - Accepted
 *  
 * 400 - Bad request
 * 401 - Unauthorized -- Autenticação. Tem caráter temporário.
 * 403 - Forbidden  -- Autorização, tem caráter permanente
 * 404 - Not found.
 * 
 * 
 * 500 - internal server error
 * 501 - Not implemented - A API não suporta essa funcionalidade
 * 503 - Service unavailable - A API executa essa operação, mas no momento está indisponível.
 * 
 * 
 * 
 * 
 */