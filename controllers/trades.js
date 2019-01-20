const { getDB, formatResult } = require('./_helpers');

module.exports = {
    all: (req) => {
        return new Promise((resolve, reject) => {
            const DB = getDB(req);
            //Limitation on large scale index, does not explicitly state pagination is what is desired
            DB.all(`SELECT * FROM trades`, (err, results) => {
                if(err) return void reject(err);

                resolve(results.map(formatResult));
            });
        });
    },

    create: (req) => {
        return new Promise((resolve, reject) => {
            const DB = getDB(req);
            const cols = ['id', 'type', 'user_id', 'user_name', 'symbol', 'shares', 'price', 'timestamp'];
            //Prepare statement to accept all columns
            const insert = DB.prepare(`INSERT INTO trades (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`);

            const stmt = insert.bind(
                req.body.id,
                req.body.type,
                req.body.user.id,
                req.body.user.name,
                req.body.symbol,
                req.body.shares,
                req.body.price,
                req.body.timestamp,
            );

            DB.all(`SELECT id FROM trades WHERE id=? LIMIT 1`, stockSymbol, (err, result) => {
                if(result.length > 0) return void reject();

                stmt.run((err) => {
                    if(err) return void reject(err);

                    resolve();
                });
            });
        });
    },
    userTrade: (req, userID) => {
        return new Promise((resolve, reject) => {
            const DB = getDB(req);
            const stmt = DB.prepare(`SELECT * FROM trades WHERE user_id=? ORDER BY id`);
            stmt.all(userID, (err, results) => {
                if(err) return void reject(err);

                resolve(results.map(formatResult));
            })
        })
    },
    truncate: (req) => {
        return new Promise((resolve, reject) => {
            const DB = getDB(req);
            DB.run(`DELETE FROM trades; VACUUM;`, (err) => {
                if(err) return void reject(err);

                resolve();
            });
        });
    }
}
