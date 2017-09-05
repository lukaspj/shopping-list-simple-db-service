const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const { Client } = require('pg');
const client = new Client();

client.connect();

client.query(`CREATE TABLE IF NOT EXISTS items (
                item_id serial,
                name text,
                estprice numeric
              );
              CREATE TABLE IF NOT EXISTS lists (
                list_id serial
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

        app.route('/items/create')
            .post((req, res) => {
                var name = req.body.name;
                var estprice = req.body.estprice;
                const client = new Client();
                client.connect();
                client.query(`INSERT INTO items (name, estprice) VALUES ("${name}", ${estprice})`)
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                    });
            });

        app.listen(port);

        console.log(`Started listening on ${port}`);
    });

