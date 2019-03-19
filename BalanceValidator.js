const axios = require("axios");
const mysql = require("mysql")

const con = mysql.createConnection({
    host: "trading-bot.ca2iecww9r6d.ap-south-1.rds.amazonaws.com",
    user: "trading_bot",
    password: "Rspl123#",
    database: "crypto_world"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    const getBalance = async (address, coin) => {
        try {
            let url = ''
            if (coin == 'BTC') {
                url = `https://blockchain.info/q/addressbalance/${address}`
            } else if (coin == 'ETH') {
                url = `https://ethplorer.io/service/service.php?data=${address}`
            } else if (coin == 'XRP') {
                url = `https://data.ripple.com/v2/accounts/${address}/balances`
            }
            const response = await axios.get(url);
            return Promise.resolve(parseFloat(response.data))
        } catch (error) {
            return Promise.resolve(0);
        }
    };

    function sleep(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms)
        })
    }

    const run = async () => {
        let index = 0
        while (true) {
            let sql = `SELECT * FROM address limit ${index}, 1`;
            con.query(sql, async function (error, results, fields) {
                const balance = await getBalance(results[0].address, results[0].coin)
                console.log(`${results[0].address} has ${balance} balance`)
                if (balance > 0) {
                    axios.post('https://hooks.slack.com/services/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', {
                        "text": `Found ${results[0].coin} address ${results[0].address} with balance ${balance}`
                    }).then(function (response) {
                        console.log(response);
                    }).catch(function (error) {
                        console.log(error);
                    });
                }
                if (error) throw error;
            });
            await sleep(1000)
            if (index / 1000 > 1) {
                console.log(`checked ${index} addresses till now...`)
            }
            index++
        }
    }
    run()
});