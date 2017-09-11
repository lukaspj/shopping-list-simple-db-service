const PgHelper = require('./pg-helper');

module.exports = {
    list: (app) => {
        app.route('/recipes')
            .get((req, res) =>{
                PgHelper.makeQuery('SELECT * FROM recipes;')
                    .then(dbRes => {
                        res.json(dbRes.rows);
                        res.end();
                    });
            });
    },
    get: (app) => {
        app.route('/recipes/:id')
            .get((req, res) =>{
                PgHelper.makeQuery(`SELECT * FROM recipes WHERE id=${req.params.id};`)
                    .then(dbRes => {
                        res.json(dbRes.rows);
                        res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/recipes/create')
            .post((req, res) => {
                var name = req.body.name;
                PgHelper.makeQuery(`INSERT INTO recipes (name) VALUES ('${name}');`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/recipes/delete')
            .post((req, res) => {
                var id = req.body.id;
                PgHelper.makeQuery(`DELETE FROM recipes WHERE id=${id};`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    update: (app) => {
        app.route('/recipes/update')
            .post((req, res) => {
                const id = req.body.id;
                const name = req.body.name;
                const description = req.body.description;
                const image = req.body.image;
                const steps = req.body.steps;
                PgHelper.makeQuery(`UPDATE recipes SET
                                        name='${name}', description='${description}',
                                        image='${image}', steps='${steps}'
                                        WHERE id=${id};`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    initDBstatement: () => {
        return `
          CREATE TABLE IF NOT EXISTS recipes (
            id SERIAL,
            name TEXT NOT NULL,
            description TEXT,
            image TEXT,
            steps TEXT,
            created_at TIMESTAMP DEFAULT now(),
            PRIMARY KEY (id)
          );`
    }
};