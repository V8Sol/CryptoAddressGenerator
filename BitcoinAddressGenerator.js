const bitcoin = require("bitcoinjs-lib")
const axios = require("axios");
const mysql = require("mysql")

const con = mysql.createConnection({
    host: "34.93.83.72",
    user: "root",
    password: "root",
    database: "crypto_world"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    const getBalance = async address => {
        try {
            const url = `https://blockchain.info/q/addressbalance/${address}`
            const response = await axios.get(url);
            return Promise.resolve(response.data / 100000000)
        } catch (error) {
            return Promise.resolve(0);
        }
    };

    const run = async () => {

        while (true) {
            const keyPair = bitcoin.ECPair.makeRandom();
            const balance = await getBalance(keyPair.getAddress())
            if (balance > 0) {
                axios.post('https://hooks.slack.com/services/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', {
                    "text": `Found Bitcoin address ${keyPair.getAddress()} with balance ${balance}`
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
            }
            let sql = `INSERT INTO address (coin, address, secret, balance) VALUES ('BTC', '${keyPair.getAddress()}', '${keyPair.toWIF()}', '${balance}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
    }
    run()
});
