const PgHelper = require('./pg-helper');

module.exports = {
    list: (app) => {
        app.route('/items')
            .get((req, res) =>{
                PgHelper.makeQuery('SELECT * FROM items')
                    .then(dbRes => {
                        res.send(JSON.stringify(dbRes));
                        res.json(dbRes.rows);
                        res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/items/create')
            .post((req, res) => {
                var name = req.body.name;
                var estprice = req.body.estprice;
                PgHelper.makeQuery(`INSERT INTO items VALUES (DEFAULT, '${name}', ${estprice})`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/items/delete')
            .post((req, res) => {
                var id = req.body.id;
                PgHelper.makeQuery(`DELETE FROM items WHERE item_id=${id}`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    initDBstatement: () => {
        return `
          CREATE TABLE IF NOT EXISTS items (
            item_id serial,
            name text,
            estprice numeric,
            PRIMARY KEY (item_id)
          );`
    }
};