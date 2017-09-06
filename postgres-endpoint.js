const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const { Client } = require('pg');
const client = new Client();

client.connect();

client.query(`CREATE TABLE IF NOT EXISTS items (
                item_id serial,
                name text,
                estprice numeric,
                PRIMARY KEY (item_id)
              );
              CREATE TABLE IF NOT EXISTS lists (
                list_id serial,
                PRIMARY KEY (list_id)
              );
              CREATE TABLE IF NOT EXISTS list_items (
                list_id integer,
                item_id integer,
                amount numeric,
                notes text
              )`)
    .then(() => {
        client.end();

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

        app.route('/lists')
            .get((req, res) =>{
                const client = new Client();
                client.connect();
                client.query('SELECT * FROM lists')
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                    });
            });

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

        app.route('/items/create')
            .post((req, res) => {
                var name = req.body.name;
                var estprice = req.body.estprice;
                const client = new Client();
                client.connect();
                client.query(`INSERT INTO items VALUES (DEFAULT, '${name}', ${estprice})`)
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                    })
                    .catch((err) => {
                        res.json(err);
                        console.log(req.body);
                        client.end();
                    });
            });

        app.route('/lists/create')
            .post((req, res) => {
                const client = new Client();
                client.connect();
                client.query(`INSERT INTO lists VALUES (DEFAULT)`)
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                    })
                    .catch((err) => {
                        res.json(err);
                        client.end();
                    });
            });

        app.route('/list_items/create')
            .post((req, res) => {
                var list_id = req.body.list_id;
                var item_id = req.body.item_id;
                var amount = req.body.amount;
                var notes = req.body.notes;
                const client = new Client();
                client.connect();
                client.query(`INSERT INTO list_items VALUES (${list_id}, ${item_id}, ${amount}, '${notes}')`)
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                    })
                    .catch((err) => {
                        res.json(err);
                        client.end();
                    });
            });

        app.listen(port);

        console.log(`Started listening on ${port}`);
    });

