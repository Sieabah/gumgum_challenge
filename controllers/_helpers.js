module.exports = {
    getDB(req) {
        return req.app.get('db');
    },
    formatResult(result) {
        const {user_id, user_name, ...remaining} = result;
        remaining.user = {
            id: user_id,
            name: user_name
        };
        return remaining;
    }
}
