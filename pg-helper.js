const { Client } = require('pg');

module.exports = {
    makeQuery: query => {
        return new Promise((resolve, reject) => {
            const client = new Client();
            client.connect();
            console.log("Doing query:");
            console.log(query);

            client.query(query)
                .then(dbRes => {
                    client.end();
                    resolve(dbRes);
                })
                .catch(err => reject(err));
        });
    }
};