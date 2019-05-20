const axios = require("axios");
const web3 = require("web3");
const mysql = require("mysql")

const con = mysql.createConnection({
    host: "crypto.ca2iecww9r6d.ap-south-1.rds.amazonaws.com",
    user: "trading_bot",
    password: "Rspl123#",
    database: "crypto_world"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    const getBalance = async address => {
        try {
            const url = `https://ethplorer.io/service/service.php?data=${address}`
            const response = await axios.get(url);
            return Promise.resolve(response.data.balance + response.data.pager.transfers.records)
        } catch (error) {
            return Promise.resolve(0);
        }
    };

    const run = async () => {

        while (true) {
            const eth = new web3().eth.accounts.create();
            const balance = await getBalance(eth.address)
            if (balance > 0) {
                axios.post('https://hooks.slack.com/services/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', {
                    "text": `Found Ether address ${eth.address} with balance ${balance}`
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                });
            }
            let sql = `INSERT INTO address (coin, address, secret, balance) VALUES ('ETH', '${eth.address}', '${eth.privateKey}', '${balance}')`;
            con.query(sql, function (err, result) {
                if (err) throw err;
            });
        }
    }
    run()
});
