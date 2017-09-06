const { Client } = require('pg');

module.exports = {
    list: (app) => {
        app.route('/lists')
            .get((req, res) =>{
                const client = new Client();
                client.connect();
                client.query('SELECT * FROM lists')
                    .then((dbRes) => {
                        res.json(dbRes.rows);
                        client.end();
                        res.end();
                    });
            });
    },
    create: (app) => {
        app.route('/lists/create')
            .post((req, res) => {
                const client = new Client();
                client.connect();
                client.query(`INSERT INTO lists VALUES (DEFAULT)`)
                    .then((dbRes) => {
                        res.send("success");
                        client.end();
                        res.end();
                    })
                    .catch((err) => {
                        res.json(err);
                        client.end();
                        res.end();
                    });
            });
    },
    delete: (app) => {
        app.route('/lists/delete')
            .post((req, res) => {
                var id = req.body.id;
                const client = new Client();
                client.connect();
                client.query(`DELETE FROM lists WHERE list_id=${id}`)
                    .then((dbRes) => {
                        res.send("success");
                        client.end();
                        res.end();
                    })
                    .catch((err) => {
                        res.json(err);
                        console.log(req.body);
                        client.end();
                        res.end();
                    });
            });
    },
    update: (app) => {
        app.route('/lists/update')
            .post((req, res) => {
               var id = req.body.id;
               var status = req.body.status;
               const client = new Client();
               client.connect();
               client.query(`UPDATE lists SET status=${status} WHERE id=${id};`)
                   .then(() => {
                        res.send("success");
                        client.end();
                       res.end();
                   })
                   .catch(err => {
                       res.json(err);
                       console.log(`UPDATE lists SET status=${status} WHERE id=${id};`);
                       console.log(err);
                       console.log(req.body);
                       client.end();
                       res.end();
                   })
            });
    }
};