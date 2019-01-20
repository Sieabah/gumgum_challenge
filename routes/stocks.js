var express = require('express');
var router = express.Router();
const stocks = require('../controllers/stocks');

// Routes related to stocks
router.get('/:stockSymbol/trades', (req, res) => {
    stocks.trades(req, req.params.stockSymbol)
        .then((results) => res.json(results))
        .catch(() => res.sendStatus(404));
});

router.get('/:stockSymbol/price', (req, res) => {
    stocks.price(req, req.params.stockSymbol)
        .then((result) => res.json(result))
        .catch(() => res.sendStatus(404));
});

module.exports = router;
