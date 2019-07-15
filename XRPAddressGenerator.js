const RippleAPI = require('ripple-lib').RippleAPI;
const axios = require("axios");
const mysql = require("mysql")
const api = new RippleAPI();

const con = mysql.createConnection({
    host: "crypto-scanner.ca2iecww9r6d.ap-south-1.rds.amazonaws.com",
    user: "trading_bot",
    password: "Rspl123#",
    database: "crypto_world"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    const getBalance = async address => {
        try {
            const url = `https://data.ripple.com/v2/accounts/${address}/balances`
            const response = await axios.get(url);
            return Promise.resolve(response.data.balances[0].value)
        } catch (error) {
            return Promise.resolve(0);
        }
    };

    const run = async () => {
        let wallets = []
        while (true) {
            const xrp = api.generateAddress()
            const balance = await getBalance(xrp.address)
            if (balance > 0) {
                axios.post('https://hooks.slack.com/services/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', {
                    "text": `Found XRP address ${xrp.address} with balance ${balance}`
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
            }
            let sql = `INSERT INTO address (coin, address, secret, balance) VALUES ('XRP', '${xrp.address}', '${xrp.secret}', '${balance}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
    }
    run()
});
