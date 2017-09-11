const PgHelper = require('./pg-helper');

module.exports = {
    list: (app) => {
        app.route('/list_items')
            .get((req, res) => {
                PgHelper.makeQuery('SELECT * FROM list_items')
                    .then(dbRes => {
                        res.json(dbRes.rows);
                        res.end();
                    });
            });
    },
    get: (app) => {
        app.route('/list_items/:id')
            .get((req, res) =>{
                PgHelper.makeQuery(`SELECT * FROM list_items WHERE list_id = ${req.params.id}`)
                    .then(dbRes => {
                        res.json(dbRes.rows);
                        res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/list_items/create')
            .post((req, res) => {
                var list_id = req.body.list_id;
                var item_id = req.body.item_id;
                var amount = req.body.amount;
                var notes = req.body.notes;
                PgHelper.makeQuery(`INSERT INTO list_items VALUES (DEFAULT, ${list_id}, ${item_id}, ${amount}, '${notes}')`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/list_items/delete')
            .post((req, res) => {
                var id = req.body.id;
                PgHelper.makeQuery(`DELETE FROM list_items WHERE list_item_id=${id}`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    initDBstatement: () => {
        return `
            CREATE TABLE IF NOT EXISTS list_items (
                list_item_id serial,
                list_id integer,
                item_id integer,
                amount numeric,
                notes text
            );`;
    }
};