const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth');

const User = require('../models/User');

const router = express.Router();
const cors = require('cors')
router.use(cors());
function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

//Cadastro
router.post('/register', async (req, res) => {
    const {email, name, password, role} = req.body;
    const regex_validation = /^.+@.+..+$/;

    try {
        if(name == null || name.length <= 3)
            return res.status(400).send({error: 'Invalid name'})

        if(password == null || password.length <= 3)
            return res.status(400).send({error: 'Invalid password'})

        if(!(role == 'admin' || role == 'user'))
            return res.status(400).send({error: 'Invalid role'})

        if(!regex_validation.test(email))
            return res.status(400).send({error: 'Invalid email'})

        if(await User.findOne({email}))
            return res.status(400).send({error: 'User already exists'})

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user.id }) });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Registration failed' });
        
    }
});

//Realiza o Login
router.post('/authenticate', async (req, res) => {
    const  {email, password} = req.body;
    const regex_validation = /^.+@.+..+$/;

    if(password == null || password.length <= 3)
        return res.status(400).send({error: 'Invalid password'})

    if(!regex_validation.test(email))
        return res.status(400).send({error: 'Invalid email'})
        
    const user = await User.findOne({email}).select('+password');

    if (!user)
        return res.status(400).send({error: 'User not found'});

    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Invalid password'})

    user.password = undefined;

    res.send({user, token: generateToken({ id: user.id })});
})

module.exports = app => app.use('/auth', router); 