const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());


app.get('/compare', (req, res) => {
	let todayRate;
	let yesterdayRate;
	let diff;
	fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
	.then(price => price.json())
	.then(price => {
		// console.log(price);
		todayRate = price.bpi.USD.rate;
		let arr = todayRate.split('');
		arr = arr.filter(num => num != ',');
		todayRate = arr.join('');
		todayRate = Number(todayRate);
		console.log('currentPrice -> ', todayRate);
		// res.send(todayRate);
	})
	.catch(err => {
		console.log('There was an error: ', err);
		res.send({ error: err });
	});
	fetch('https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday')
	.then(price => price.json())
	.then(price => {
		// console.log('yesterday info ->', price);
		yesterdayRate = Object.values(price.bpi);
		yesterdayRate = yesterdayRate[0];
		console.log('yesterdayPrice -> ', yesterdayRate);
		diff = currentPrice - yesterdayRate;
		res.send({ title: 'Bitcoin value difference since yesterday', value: diff });
	})
	.catch(err => {
		console.log('There was an error: ', err);
		res.send({ error: err });
	});
});

app.listen(PORT, err => {
	if (err) {
		console.log(`There was an error starting the server: ${err}`);
	} else {
		console.log(`Server listening on port: ${PORT}`);
	}
});
