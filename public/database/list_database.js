document.getElementById('get_data').addEventListener('click', event =>{
	get_data();
})

	async function get_data(){
		const response = await fetch('/turkey');
		const data = await response.json();
		console.log(data);

		//Does not account for data that has been deleted while the server is running
		for (item of data){
			const root = document.createElement('p');
			const date = document.createElement('div');
			const geo = document.createElement('div');
			const weather = document.createElement('div');

			geo.textContent = `${item.lat}°, ${item.log}°`;
			date.textContent = new Date(item.timestamp).toLocaleString();
			weather.textContent = `${item.weather.currently}`;
			
			root.append(geo,date,weather);
			document.body.append(root);

		}
	}