const PgHelper = require('./pg-helper');

module.exports = {
    list: (app) => {
        app.route('/ingredients')
            .get((req, res) =>{
                PgHelper.makeQuery('SELECT * FROM ingredients;')
                    .then(dbRes => {
                        res.json(dbRes.rows);
                        res.end();
                    });
            });
    },
    get: (app) => {
        app.route('/ingredients/:id')
            .get((req, res) =>{
                PgHelper.makeQuery(`SELECT * FROM ingredients WHERE id=${req.params.id};`)
                    .then(dbRes => {
                        res.json(dbRes.rows[0]);
                        res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/ingredients/create')
            .post((req, res) => {
                const name = req.body.name;
                const description = req.body.description;
                const image = req.body.image;
                const estprice = req.body.estprice;
                PgHelper.makeQuery(`INSERT INTO ingredients (name, description, image, estprice) 
                                                VALUES ('${name}', '${description}', '${image}', ${estprice});`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/ingredients/delete')
            .post((req, res) => {
                var id = req.body.id;
                PgHelper.makeQuery(`DELETE FROM ingredients WHERE id=${id}`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    update: (app) => {
        app.route('/ingredients/update')
            .post((req, res) => {
                const id = req.body.id;
                const name = req.body.name;
                const description = req.body.description;
                const image = req.body.image;
                const estprice = req.body.estprice;
                PgHelper.makeQuery(`UPDATE ingredients SET 
                                        name='${name}', description='${description}',
                                        image='${image}', estprice=${estprice}
                                        WHERE id=${id};`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    initDBstatement: () => {
        return `
          CREATE TABLE IF NOT EXISTS ingredients (
            id SERIAL,
            name TEXT,
            description TEXT,
            image TEXT,
            estprice NUMERIC,
            created_at TIMESTAMP DEFAULT now(),
            PRIMARY KEY (id)
          );`
    }
};