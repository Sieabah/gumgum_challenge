const express = require('express');
const router = express.Router();
const trades = require('../controllers/trades');

// Route to delete all trades
router.delete('/', (req, res) => {
    trades.truncate(req)
        .then(() => res.sendStatus(200))
        .catch(() => res.sendStatus(400));
});

module.exports = router;
