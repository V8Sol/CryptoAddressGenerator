const axios = require("axios");
const mysql = require("mysql")
const util = require('util');

const con = mysql.createConnection({
    host: "crypto.ca2iecww9r6d.ap-south-1.rds.amazonaws.com",
    user: "trading_bot",
    password: "Rspl123#",
    database: "crypto_world"
});

const query = util.promisify(con.query).bind(con);

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
	var balance = parseFloat(response.data)
	if(coin == 'ETH') {
		balance = parseFloat(response.data.balance)
	}
        return Promise.resolve(balance)
    } catch (error) {
        return Promise.resolve(0);
    }
};

const run = async () => {
    let index = 0
    try {
        while (true) {
            let sql = `SELECT * FROM address where balance is null limit 1`;
            let results = await query(sql)
            const balance = await getBalance(results[0].address, results[0].coin)
	    console.log(balance)
            if (balance > 0) {
                axios.post('https://hooks.slack.com/services/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', {
                    "text": `Found ${results[0].coin} address ${results[0].address} with balance ${balance}`
                }).then(function (response) {
                    console.log(response);
                }).catch(function (error) {
                    console.log(error);
                })
            }
            let updateSql = `UPDATE address set balance = ${balance} where id = ${results[0].id}`
            query(updateSql)
            index++
        }
    } catch(err) {
        console.log(err)
        index--;
    }
}
run()
