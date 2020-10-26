const express = require('express');
const path = require('path');

const authMiddleware = require('../middlewares/auth');
const authRoleMiddleware = require('../middlewares/authRole');
const crypto = require('crypto');

const Coin = require('../models/Coin');

const router = express.Router();

const cors = require('cors')


router.use(cors());

router.use(authMiddleware);


//Requisição do obj através do nome
router.get('/:name', async (req, res) => {
    const name = req.params.name;

    Coin.findOne({ name }, function (err, docs) {
        if (err) {
            console.log(err);
        }
        else {
            res.send({ coin: docs });
        }
    });

});

//Requisição do role Admin
router.get('/admin', authRoleMiddleware, async (req, res) => {
    res.send({ ok: true, user: req.userId });
});

//Criação do obj Moeda
router.post('/admin', authRoleMiddleware, async (req, res) => {

    try {
        if (!req.files) {
            res.send({
                status: false,
                message: "No files"
            })
        } else {

            const { logo } = req.files
            const fileHash = crypto.randomBytes(10).toString('HEX');
            logo.mv(`${__dirname}/uploads/${fileHash}=${logo.name}`)

            const coin = await Coin.create({ name: req.body.name, logo: `${fileHash}=${logo.name}` });
            console.log(coin)
            res.send({
                status: true,
                message: "File is uploaded"
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
});

module.exports = app => app.use('/coins', router);