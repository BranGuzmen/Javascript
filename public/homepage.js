

let lat,log,weather;
document.getElementById('submit').addEventListener('click',async event =>{
		//Sending data to database
		const data = await {lat,log,weather};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};
		//Response is a promise
		const response = await fetch('/turkey', options).then(async response =>{
			const josn_data = await response.json();
			console.log(josn_data);

		});
});

//Run only if geolocation is allowed
if ('geolocation' in navigator){
  console.log('Geolocation available.');
  navigator.geolocation.getCurrentPosition(async position => { 
      lat = await position.coords.latitude;
      log = await position.coords.longitude;

      //Getting weather data
      const api_url = `/weather/${lat},${log}`;
      const fetch_response = await fetch(api_url);
      weather = await fetch_response.json();

      //Getting Air Quality data
      const aq_api_url = `/aq/${lat},${log}`;
      const fetch_aq_response = await fetch(aq_api_url);
      air_quality = await fetch_aq_response.json();
      console.log(air_quality);
      for(result of air_quality.results){
        for (measurement of result.measurements){
          console.log(measurement.parameter);

          //Make elements for each mesurement
          const root = document.createElement('p');
          const value = document.createElement('div');
          const unit = document.createElement('div');

          value.textContent = measurement.value;
          unit.textContent = measurement.unit;

          root.append(value,unit);
          document.body.append(root);
        }

      }

      // Filling in <p> elements
      document.getElementById('latitude').textContent = lat;
      document.getElementById('longitude').textContent = log;
      document.getElementById('summary').textContent = weather.currently.summary;
      document.getElementById('temp').textContent = weather.currently.apparentTemperature;
  });

} else{
  console.log('Geolocation is not available.');
}