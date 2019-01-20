var express = require('express');
var router = express.Router();

// Route to delete all trades
router.delete('/', (req, res) => {
    const DB = req.app.get('db');
    DB.run(`DELETE FROM tables; VACUUM;`);
    res.sendStatus(200); 
});


module.exports = router;
