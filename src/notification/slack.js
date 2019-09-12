const axios = require("axios");

const url = 'https://hooks.slack.com/services/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'

exports.notify = async (coin, address, key, balance) => {
  console.log(`Found ${coin} address ${address}, key: ${key} with balance ${balance}`)
  axios.post(url, {
    "text": `Found ${coin} address ${address}, key: ${key} with balance ${balance}`
  }).catch(function (error) {
    console.log(error);
  })
}

exports.alert = async (message) => {
  axios.post(url, {
    "text": `${message}`
  }).catch(function (error) {
    console.log(error);
  })
}