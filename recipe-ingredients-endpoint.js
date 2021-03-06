const PgHelper = require('./pg-helper');

module.exports = {
    list: (app) => {
        app.route('/recipe_ingredients')
            .get((req, res) =>{
                PgHelper.makeQuery('SELECT * FROM recipe_ingredients;')
                    .then(dbRes => {
                        res.json(dbRes.rows.map(row => {row.amount = parseFloat(row.amount); return row;}));
                        res.end();
                    });
            });
    },
    listFor: (app) => {
        app.route('/recipe_ingredients/:id')
            .get((req, res) =>{
                PgHelper.makeQuery(`SELECT * FROM recipe_ingredients WHERE recipe_id=$1;`, [req.params.id])
                    .then(dbRes => {
                        res.json(dbRes.rows.map(row => {row.amount = parseFloat(row.amount); return row;}));
                        res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/recipe_ingredients/create')
            .post((req, res) => {
                const recipe_id = req.body.recipe_id;
                const ingredient_id = req.body.ingredient_id;
                const unit = req.body.unit;
                const amount = req.body.amount;
                PgHelper.makeQuery(`INSERT INTO recipe_ingredients VALUES ($1, $2, $3, $4);`, [recipe_id, ingredient_id, amount, unit])
                    .then(dbRes => {
                        res.json(dbRes);
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/recipe_ingredients/delete')
            .post((req, res) => {
                const recipe_id = req.body.recipe_id;
                const ingredient_id = req.body.ingredient_id;
                PgHelper.makeQuery(`DELETE FROM recipe_ingredients WHERE recipe_id=$1 AND ingredient_id=$2;`, [recipe_id, ingredient_id])
                    .then(dbRes => {
                        res.send(dbRes.rowsAffected);
                        res.end();
                    });
            });
    },
    update: (app) => {
        app.route('/recipe_ingredients/update')
            .post((req, res) => {
                const recipe_id = req.body.recipe_id;
                const ingredient_id = req.body.ingredient_id;
                const unit = req.body.unit;
                const amount = req.body.amount;
                PgHelper.makeQuery(`UPDATE recipe_ingredients 
                                            SET amount=$1, unit=$2
                                            WHERE recipe_id=$3 AND ingredient_id=$4;`,
                                        [amount, unit, recipe_id, ingredient_id])
                    .then(dbRes => {
                        res.send(dbRes.rowsAffected);
                        res.end();
                    });
            });
    },
    initDBstatement: () => {
        return `
          CREATE TABLE IF NOT EXISTS recipe_ingredients (
            recipe_id INTEGER NOT NULL,
            ingredient_id INTEGER NOT NULL,
            amount NUMERIC NOT NULL,
            unit TEXT,
            FOREIGN KEY (recipe_id) REFERENCES recipes (id) ON DELETE CASCADE,
            FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE RESTRICT
          );`
    }
};