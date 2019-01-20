const express = require('express');
const router = express.Router();
const trades = require('../controllers/trades');

// Routes related to trades
router.post('/', (req, res) => {
    trades.create(req)
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(400));
});

router.get('/', (req, res) => {
    trades.all(req)
        .then((results) => res.json(results))
        .catch((err) => res.sendStatus(400));
})

router.get('/users/:userID', (req, res) => {
    trades.userTrade(req, req.params.userID)
        .then((results) => res.json(results))
        .catch(() => res.sendStatus(400));
})

module.exports = router;
