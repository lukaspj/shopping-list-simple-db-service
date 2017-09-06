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

const ListsEndpoint = require('./lists-endpoint');
const ItemsEndpoint = require('./items-endpoint');
const ListItemsEndpoint = require('./list-items-endpoint');

const { Client } = require('pg');
const client = new Client();

client.connect();

app.route('/reset')
    .get((req, res) =>{
        client.query(`
              DROP TABLE items;
              DROP TABLE lists;
              DROP TABLE list_items;
              CREATE TABLE IF NOT EXISTS items (
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
                list_item_id serial,
                list_id integer,
                item_id integer,
                amount numeric,
                notes text
              )`)
            .then(res.send("OK"));
    });

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
                list_item_id serial,
                list_id integer,
                item_id integer,
                amount numeric,
                notes text
              )`)
    .then(() => {
        client.end();

        ItemsEndpoint.list(app);
        ItemsEndpoint.create(app);
        ItemsEndpoint.delete(app);

        ListItemsEndpoint.list(app);
        ListItemsEndpoint.get(app);
        ListItemsEndpoint.create(app);
        ListItemsEndpoint.delete(app);

        ListsEndpoint.list(app);
        ListsEndpoint.create(app);
        ListsEndpoint.delete(app);

        app.listen(port);

        console.log(`Started listening on ${port}`);
    });

