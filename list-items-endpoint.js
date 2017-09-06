const { Client } = require('pg');

module.exports = {
    list: (app) => {
        app.route('/list_items')
            .get((req, res) =>{
                const client = new Client();
                client.connect();
                client.query('SELECT * FROM list_items')
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                    });
            });
    },
    get: (app) => {
        app.route('/list_items/:id')
            .get((req, res) =>{
                const client = new Client();
                client.connect();
                client.query(`SELECT * FROM list_items WHERE list_id = ${req.params.id}`)
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
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
                const client = new Client();
                client.connect();
                client.query(`INSERT INTO list_items VALUES (DEFAULT, ${list_id}, ${item_id}, ${amount}, '${notes}')`)
                    .then((dbRes) => {
                        res.send("success");
                        client.end();
                    })
                    .catch((err) => {
                        res.json(err);
                        client.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/list_items/delete')
            .post((req, res) => {
                var id = req.body.id;
                const client = new Client();
                client.connect();
                client.query(`DELETE FROM list_items WHERE list_item_id=${id}`)
                    .then((dbRes) => {
                        res.send("success");
                        client.end();
                    })
                    .catch((err) => {
                        res.json(err);
                        console.log(req.body);
                        client.end();
                    });
            });
    }
};