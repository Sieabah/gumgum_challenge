const { getDB, formatResult } = require('./_helpers');

module.exports = {
    trades: (req, stockSymbol) => {
        return new Promise((resolve, reject) => {
            const DB = getDB(req);
            const { type, start, end } = req.query;

            const select = DB.prepare(
                `SELECT * FROM trades WHERE symbol=? AND type=? AND timestamp >= date(?) AND timestamp <= date(?) ORDER BY id`,
                [
                    stockSymbol,
                    type || 'buy',
                    start || new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
                    end || (new Date(Date.now())).toISOString(),
                ]
            );

            DB.get(`SELECT id FROM trades WHERE symbol=? LIMIT 1`, stockSymbol, (err, result) => {
                if(err) return void reject(err);

                select.all((err, results) => {
                    resolve(results.map(formatResult));
                });
            });
        })
    },
    price: (req, stockSymbol) => {
        return new Promise((resolve, reject) => {
            const DB = getDB(req);

            const { type, start, end } = req.query;

            const select = DB.prepare(
                `SELECT symbol, MIN(price), MAX(price), COUNT(id) FROM trades WHERE symbol=? AND timestamp >= date(?) AND timestamp <= date(?)`,
                [
                    stockSymbol,
                    start || new Date(Date.UTC(0, 0, 0, 0, 0, 0)),
                    end || (new Date(Date.now())).toISOString(),
                ]
            );

            DB.get(`SELECT id FROM trades WHERE symbol=? LIMIT 1`, stockSymbol, (err, result) => {
                if(err) return void reject(err);

                select.get((err, results) => {
                    if(results['COUNT(id)'] === 0)
                        return void resolve({ message: 'There are no trades in the given date range' });

                    resolve({
                        symbol: results.symbol,
                        highest: results['MAX(price)'],
                        lowest: results['MIN(price)'],
                    });
                });
            });
        })
    }
}
