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
const RecipesEndpoint = require('./recipes-endpoint');
const IngredientsEndpoint = require('./ingredients-endpoint');
const RecipeIngredientsEndpoint = require('./recipe-ingredients-endpoint');

const PgHelper = require('./pg-helper');

const createTablesStmt = ListsEndpoint.initDBstatement() +
                         ItemsEndpoint.initDBstatement() +
                         ListItemsEndpoint.initDBstatement() +
                         RecipesEndpoint.initDBstatement() +
                         IngredientsEndpoint.initDBstatement() +
                         RecipeIngredientsEndpoint.initDBstatement();

app.route('/reset')
    .get((req, res) => {
        PgHelper.makeQuery(`
                    DROP TABLE items;
                    DROP TABLE lists;
                    DROP TABLE list_items;
                    DROP TABLE recipes;
                    DROP TABLE ingredients;
                    DROP TABLE recipe_ingredients;` + createTablesStmt)
            .then(() => res.send('OK'));
    });

app.route('/migrate')
    .get((req, res) => {
        PgHelper.makeQuery(`
            ALTER TABLE lists ADD COLUMN status integer DEFAULT 0;
        `)
            .then(() => res.send('OK'));
    });

PgHelper.makeQuery(createTablesStmt)
    .then(() => {
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
        ListsEndpoint.update(app);

        RecipesEndpoint.list(app);
        RecipesEndpoint.get(app);
        RecipesEndpoint.create(app);
        RecipesEndpoint.delete(app);
        RecipesEndpoint.update(app);

        IngredientsEndpoint.list(app);
        IngredientsEndpoint.get(app);
        IngredientsEndpoint.create(app);
        IngredientsEndpoint.delete(app);
        IngredientsEndpoint.update(app);

        RecipeIngredientsEndpoint.list(app);
        RecipeIngredientsEndpoint.listFor(app);
        RecipeIngredientsEndpoint.create(app);
        RecipeIngredientsEndpoint.delete(app);

        app.listen(port);

        console.log(`Started listening on ${port}`);
    });

