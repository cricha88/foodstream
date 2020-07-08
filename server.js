const express = require('express');
const request = require('axios');

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;



// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
	res.send({ result: 'Express backend connected to react.' });
});



app.get('/get_existing', (req, res) =>  {

	res.send({ result: "blob"});
});


app.post('/add_new', (req, res) =>  {

	console.log(req.body.query);


	// var text = "";
	// var rJSON = 

	// var r = request.post("https://trackapi.nutritionix.com/v2/natural/tags", { json: {query : "bananas and apples"}}, function(error, response, body) {
	// 	if (!error && response.statusCode == 200) {
	// 		console.log(body);
	// 	}
	// });

	// for (var i=0; i<rJSON.length;i++){
	// 	console.log(rJSON[i].TAG_NAME);

	const options = {
		headers: {"content-type": "application/json"}
	};

	const body = {
		query: req.body.query,
	}


	async function axiosTest(body) {
		try {
			const {data: response} = await request.post("https://trackapi.nutritionix.com/v2/natural/tags", body, options)
			return response;
		}
		catch (error) {
			console.log(error);
			throw Error(body.message)
		}

	}

	axiosTest(body).then(data => {
		var items = new Array();
		for (var i=0; i<data.length; i++) {
			console.log(data[i].TAG_NAME);
			console.log(data[i].TAG_IMAGE);
			console.log(data[i].QUANTITY);
			var array_1 = new Array(data[i].TAG_NAME, data[i].TAG_IMAGE, data[i].QUANTITY)
			items.push(array_1)
		}
		console.log(items)

		res.send({ result: items});
	}).catch(error => {
		console.log(error);
		res.send({ result: "error"});
	})


});

