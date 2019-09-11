const mongoose = require('mongoose');

//const Users  = mongoose.model('User');

const Users = require('../model/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function createUserToken (userId) {
    return jwt.sign({ id: userId }, config.jwt_pass, { expiresIn: config.jwt_expires_in });
}

module.exports = {

    async index (req, res) {

        try {
            const users = await Users.find({});
    
            return res.send(users);
        }
        catch(err) {
            return res.status(500).send({ error: "Erro na consulta de usuários" });
        }
    },

    async store (req, res)  {
        const { email, password } = req.body;
    
        if(!email || !password) 
            return res.status(400).send({ error: "Dados insuficientes!" });
        
            try {
                
                const user = await Users.findOne({email});
    
                if (user) 
                  return res.status(400).send({ error: 'Usuário já  registrado!' });
    
                try {
                    const user = await Users.create({ email, password });
                    user.password = undefined;
    
    
                    return res.status(201).send({user, token: createUserToken(user.id)});
                }
                catch(err) {
                    return res.status(500).send({ error: 'Erro ao criar usuário!' });
                }
            } 
            catch (err) {
                return res.status(500).send({error: "Erro ao buscar usuário!"});
    
            }
    },

    async auth (req, res) {
        const { email, password } = req.body;
    
        if (!email || !password) 
          return res.status(400).send({error: "Dados insuficientes!"});
    
        try {
            const user = await  Users.findOne({email}).select("+password");
            if(!user) 
              return res.status(400).send({error: "Usuário não registrado!"});
    
            const same = await bcrypt.compare(password, user.password);// poderia colocar dentro de um try-catch
            
            if (!same) 
                return res.status(401).send({ error: 'Erro ao autenticar usuário!' });
    
            user.password = undefined;
            return res.send({user, token: createUserToken(user.id)});    
        }
        catch (err) {
            return res.status(500).send({error: "Erro ao buscar usuário"});
        }
    },

};