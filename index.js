const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch')

const app = express();
app.listen(3000,() => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({limit: '1mb'}));

const database = new Datastore('vulture.db');
database.loadDatabase();

// Defines a path for our database
app.post('/turkey', (request, response) => {
	console.log('Request received');
	const data = request.body;
	const timestamp = Date.now();
	data.timestamp = timestamp;
	database.insert(data);
	
	//Success msg sent back to client to notify success
	response.json({
		status: 200,
		timestamp: timestamp,
		latitude: request.body.lat,
		longitude: request.body.log,
		weather: request.body.weather
	});
});

//Set up server GET requests for database
app.get('/turkey', (request, response) => {
	database.find({},(err, data)=>{
		if (err){
			console.log(err);
			response.end();
			return;
		}

		response.json(data);
	});
});

//Set proxy server for weather GET
app.get('/weather/:latlog', async (request, response) => {
	const latlog = request.params.latlog.split(',');
	const lat = latlog[0];
	const log = latlog[1];
	const api_url = `https://api.darksky.net/forecast/a3684dde1b0085183f97ad7053bcbc3a/${lat},${log}`;
	const fetch_response = await fetch(api_url);
	const json = await fetch_response.json();
	response.json(json);
});

//Set proxy server for air quality GET
app.get('/aq/:latlog', async (request, response) =>{
	const latlog = request.params.latlog.split(',');
	const lat = latlog[0];
	const log = latlog[1];
	const api_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${log}&radius=17000`;
	console.log(api_url);
	// const api_url = `https://api.openaq.org/v1/latest`;
	const fetch_response = await fetch(api_url);
	const json = await fetch_response.json();
	response.json(json);

});