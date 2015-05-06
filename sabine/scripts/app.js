// Comment


// Variables
var gridEl			= document.getElementById('grid'),
		buttonEl		= document.getElementById('clsBtn'),
		detailEl 		= document.getElementById('detail');

var data = {},
		settings = {};

		// Default Settings
		settings.temperature = 20;

// Clock Initial
update();

// Clock, Update Every 60 Seconds (60 * 1000 Milliseconds)
clock();
setInterval( clock, 60 * 1000);

// Eventlisteners
gridEl.addEventListener('click', activate, false);
buttonEl.addEventListener('click', deactivate, false);

// Functions
// Active Tile  For Detail View
function activate(evt) {
	if(evt.target !== evt.currentTarget){
		el = evt.target;

		// Bubble To Clicked Tile Element
		while( !el.classList.contains('tile') ){
			el = el.parentElement;
		}

		// Remove Active Class From All Other Tiles
		els = document.getElementsByClassName('tile');
		for (var i = 0; i < els.length; i++) {
		  if(els[i].classList.contains('active')){
		  	els[i].classList.remove('active');
		  }
		}

		// Add Detail Class From Grid
		el.classList.toggle('active');
		if(!gridEl.classList.contains('detail')){
			gridEl.classList.add('detail');
		}

		// Add Active Class to DetailView
		if(!detailEl.classList.contains('active')){
			detailEl.classList.add('active');
		}

		// Copy Content To DetailView
		detailEl.querySelector('div').innerHTML = el.querySelector('figcaption').innerHTML;
	}
	evt.stopPropagation();
}

// Close Detail View
function deactivate (evt) {

	// Remove Active Class From All Tile Elements
	els = document.getElementsByClassName('tile');
	for (var i = 0; i < els.length; i++) {
	  if(els[i].classList.contains('active')){
	  	els[i].classList.remove('active');
	  }
	}

	// Remove Detail Class From Grid
	if(gridEl.classList.contains('detail')){
		gridEl.classList.remove('detail');
	}

	// Add Active Class to DetailView
	if(detailEl.classList.contains('active')){
		detailEl.classList.remove('active');
	}
}

// Get NetAtmo Data
function update() {

	// AJAX Request
  var	request = new XMLHttpRequest();
      request.open('GET', 'data.json');

  // ErrorHandling
  request.onerror = function() {
    console.log('Fehler beim Senden der Daten');
  };

  // Status Handling
  request.onload = function() {
    if (this.status >= 200 && this.status < 400){
      data = JSON.parse(this.response);

      insertData(data);

    } else {
      console.log('Fehler: ' + this);
    }
  }

  request.send();
}


// Insert NetAtmo Data Into Elements
function insertData(data){

	console.log(data);

	setTemperature(data.temperature);
	setFood(data.food);
	setWeather(data.weather);
	setStresslevel(data.stresslevel);
	setLoudness(data.loudness);
	setAirquality(data.airquality);
}

// Temperature Element
function setTemperature(temperature){

	el = document.getElementById('temperature');

	el.querySelector('data').innerText = temperature.indoor + 'C°';
	el.classList.remove('temp-low', 'temp-good', 'temp-warm', 'temp-hot');

	// Temperature less than 15
	if(temperature.indoor < settings.temperature - 5){
		el.classList.add('temp-low');
	} else if(temperature.indoor > settings.temperature - 5 && temperature.indoor < settings.temperature +5){
		el.classList.add('temp-good');
	} else if(temperature.indoor > settings.temperature + 5 && temperature.indoor < settings.temperature + 10){
		el.classList.add('temp-warm');
	} else if(temperature.indoor > settings.temperature + 10){
		el.classList.add('temp-hot');
	}

	//todo
	// Image
}

// Food Element
function setFood(food){
	el = document.querySelector('#food figcaption'),
	list = document.createElement('ul');

	for (var i = food.length - 1; i >= 0; i--) {
		item = document.createElement('li');
		item.innerText = food[i];
		list.appendChild(item);
	};

	el.appendChild(list);
}

// Weather Element
// TODO
function setWeather(weather){
	el = document.querySelector('#barometer figcaption');

	// todo
}

// Stresslevel Element
function setStresslevel(stresslevel){
	el = document.getElementById('stresslevel');
	el.classList.remove('stresslevel-1', 'stresslevel-2', 'stresslevel-3');
	el.classList.add('stresslevel-' + stresslevel);
}

// Loudness Element
function setLoudness(loudness){
	el = document.getElementById('loudness');

	el.querySelector('data').innerText = loudness.indoor + 'dB';
	el.classList.remove('loudness-low', 'loudness-medium', 'loudness-height');

	if(loudness.indoor <= 63){
		el.classList.add('loudness-low');
	} else if(loudness.indoor > 63 && loudness.indoor < 81){
		el.classList.add('loudness-medium');
	} else if(loudness.indoor >= 81){
		el.classList.add('loudness-high');
	}
}

// Airquality Element
function setAirquality(airquality){
	el = document.getElementById('airquality');
	el.classList.remove('airquality-1', 'airquality-2', 'airquality-3');
	el.classList.add('airquality-' + airquality);
}


// Clock
function clock () {
	var date = new Date();
	document.getElementById('date').innerText = date.toLocaleDateString();
	document.getElementById('time').innerText = date.toLocaleTimeString().substring(0,5);
}
