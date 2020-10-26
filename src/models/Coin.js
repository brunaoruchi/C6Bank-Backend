const mongoose = require('../database');

const CoinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Coin = mongoose.model('Coin', CoinSchema);

module.exports = Coin;