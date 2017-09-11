const PgHelper = require('./pg-helper');

module.exports = {
    list: (app) => {
        app.route('/lists')
            .get((req, res) =>{
                PgHelper.makeQuery('SELECT * FROM lists')
                    .then(dbRes => {
                       res.json(dbRes.rows);
                       res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/lists/create')
            .post((req, res) => {
                PgHelper.makeQuery(`INSERT INTO lists VALUES (DEFAULT)`)
                    .then(dbRes => {
                        res.send("success");
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/lists/delete')
            .post((req, res) => {
                var id = req.body.id;
                PgHelper.makeQuery(`DELETE FROM lists WHERE list_id=${id}`)
                    .then(dbRes => {
                        res.send('success');
                        res.end();
                    });
            });
    },
    update: (app) => {
        app.route('/lists/update')
            .post((req, res) => {
               var id = req.body.id;
               var status = req.body.status;
               PgHelper.makeQuery(`UPDATE lists SET status=${status} WHERE list_id=${id};`)
                   .then(dbRes => {
                       res.send('success');
                       res.end();
                   });
            });
    },
    initDBstatement: () => {
        return `
            CREATE TABLE IF NOT EXISTS lists (
                list_id serial,
                status integer DEFAULT 0,
                PRIMARY KEY (list_id)
            );`;
    }
};