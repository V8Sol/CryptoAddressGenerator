const mysql = require('./db/mysql')
const util = require('util');

const con = mysql.getConnection()

const query = util.promisify(con.query).bind(con);

const getBalance = async (address, coin) => {
  try {
    let url = ''
    if (coin == 'BTC') {
      url = `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`
    } else if (coin == 'ETH') {
      url = `https://ethplorer.io/service/service.php?data=${address}`
    } else if (coin == 'XRP') {
      url = `https://data.ripple.com/v2/accounts/${address}/balances`
    }
    const response = await axios.get(url);
    if (coin == 'BTC') {
      var balance = parseFloat(response.data.balance + response.data.total_received)
    } else if (coin == 'ETH') {
      var balance = parseFloat(response.data.balance) + parseFloat(response.data.transfers.length)
    } else {
      balance = parseFloat(response.data.balances[0].value)
    }
    return Promise.resolve(balance)
  } catch (error) {
    return Promise.resolve(0);
  }
};

const run = async () => {
  let index_sql = `SELECT * FROM address where id > 2871561 and balance is null limit 1`;
  let first_record = await query(index_sql)
  let index = first_record[0].id
  try {
    axios.post('https://hooks.slack.com/services/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', {
      "text": "Address scanning started..."
    }).then(function (response) {
      console.log(response);
    }).catch(function (error) {
      console.log(error);
    })
    while (true) {
      let sql = `SELECT * FROM address where id = ${index}`;
      let results = await query(sql)
      const balance = await getBalance(results[0].address, results[0].coin)
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
  } catch (err) {
    console.log(err)
    index--;
  }
}
run()
