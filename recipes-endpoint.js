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
                PgHelper.makeQuery('SELECT * FROM recipes WHERE id=$1;', [req.params.id])
                    .then(dbRes => {
                        res.json(dbRes.rows[0]);
                        res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/recipes/create')
            .post((req, res) => {
                var name = req.body.name;
                const description = req.body.description;
                const image = req.body.image;
                const steps = req.body.steps;
                PgHelper.makeQuery(`INSERT INTO recipes (name, description, image, steps) 
                                            VALUES ($1, $2, $3, $4)
                                            RETURNING *;`, [name, description, image, steps])
                    .then(dbRes => {
                        res.json(dbRes.rows[0]);
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/recipes/delete')
            .post((req, res) => {
                var id = req.body.id;
                PgHelper.makeQuery(`DELETE FROM recipes WHERE id=$1;`, [id])
                    .then(dbRes => {
                        res.json(dbRes);
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
                                        name='$1', description='$2',
                                        image='$3', steps='$4'
                                        WHERE id=$5;`, [name, description, image, steps, id])
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