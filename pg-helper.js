const { Client } = require('pg');

module.exports = {
    makeQuery: (query, args) => {
        return new Promise((resolve, reject) => {
            const client = new Client();
            client.connect();
            console.log("Doing query:");
            console.log(query);
            console.log("With args");
            console.log(args);

            client.query(query, args)
                .then(dbRes => {
                    client.end();
                    resolve(dbRes);
                })
                .catch(err => reject(err));
        });
    }
};