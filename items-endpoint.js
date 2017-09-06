const { Client } = require('pg');

module.exports = {
    list: (app) => {
        app.route('/items')
            .get((req, res) =>{
                const client = new Client();
                client.connect();
                client.query('SELECT * FROM items')
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                    });
            });
    },
    create: (app) => {
        app.route('/items/create')
            .post((req, res) => {
                var name = req.body.name;
                var estprice = req.body.estprice;
                const client = new Client();
                client.connect();
                client.query(`INSERT INTO items VALUES (DEFAULT, '${name}', ${estprice})`)
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
    },
    delete: (app) => {
        app.route('/items/delete')
            .post((req, res) => {
                var id = req.body.id;
                const client = new Client();
                client.connect();
                client.query(`DELETE FROM items WHERE item_id=${id}`)
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