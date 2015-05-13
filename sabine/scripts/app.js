// Execute when DOM fully loaded and parsed
document.addEventListener("DOMContentLoaded", function(event) {

// DomElements and Variables
var gridEl			= document.getElementById('grid'),
		buttonEl		= document.getElementById('clsBtn'),
		detailEl 		= document.getElementById('detail');

var data = {},
		settings = {};
		// Default Settings
		settings.temperature = 20;

var idleTime = 0;
		idelInterval = setInterval(timerIncrement, 60 * 1000);

// Initialize Interface and load Data
getData();
//setInterval(getData, 5 * 60 * 1000)

// Clock, Update Every 60 Seconds (60 * 1000 Milliseconds)
clock();
setInterval( clock, 60 * 1000);

// Eventlisteners
gridEl.addEventListener('click', activate, false);
buttonEl.addEventListener('click', deactivate, false);


// Functions
// Active Tile  For Detail View
function activate(evt) {
	idleTime = 0;

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

		// Add Detail Class to Grid
		el.classList.toggle('active');
		if(!gridEl.classList.contains('detail')){
			gridEl.classList.add('detail');
		}

		// Display DetailView
		if(detailEl.classList.contains('hide')){
			detailEl.classList.remove('hide');
		}

		els = detailEl.children;
		for (var i = 0; i < els.length; i++) {
			if(!els[i].classList.contains('hide') && els[i].nodeName == 'DIV'){
				els[i].classList.add('hide');
			}
			if(els[i].classList.contains(el.id)){
				els[i].classList.remove('hide');
			}
		};
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

	// Hide DetailView
	if(!detailEl.classList.contains('hide')){
		detailEl.classList.add('hide');
	}

	els = detailEl.children;
	for (var i = 0; i < els.length; i++) {
		if(!els[i].classList.contains('hide') && els[i].classList.contains('tile')){
			els[i].classList.add('hide');
		}
	};
}

// Get NetAtmo Data
function getData() {

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

      initializeData(data);

    } else {
      console.log('Fehler: ' + this);
    }
  }

  request.send();
}

// Insert NetAtmo Data Into Elements
function initializeData(data){
	setTemperature(data.temperature);
	setFood(data.food);
	setWeather(data.forecast);
	setStresslevel(data.stresslevel);
	setNoise(data.noise);
	setAirquality(data.airquality);
}

// Temperature Element
function setTemperature(temperature){

 	// Tile
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

	// DetailView
	detailEl.querySelector('.temperature .indoor').innerText = temperature.indoor + '°C';
	detailEl.querySelector('.temperature .outdoor').innerText = temperature.outdoor + '°C';
}

// Food Element
function setFood(food){

	// Tile
	// toDo?

	//DetailView
	list = detailEl.querySelector('.food ul');
	list.style.width = food.length * 100 + '%';
	itemWidth = window.getComputedStyle(detailEl.querySelector('.slider', null)).width;
	for (var i = 0; food.length > i; i++) {
		list.appendChild(foodListItem(food[i], itemWidth));
	};
}

// Weather Element
// TODO
function setWeather(forecast){
	el = document.querySelector('#weather figcaption');

	// todo
	list = detailEl.querySelector('.weather ul');
	list.style.width = forecast.length * 100 + '%';
	itemWidth = window.getComputedStyle(detailEl.querySelector('.slider', null)).width;
	for (var i = 0; forecast.length > i; i++) {
		list.appendChild(weatherListItem(forecast[i], itemWidth));
	};
}

// Stresslevel Element
function setStresslevel(stresslevel){

	// Tile
	el = document.getElementById('stresslevel');
	el.classList.remove('stresslevel-1', 'stresslevel-2', 'stresslevel-3');
	el.classList.add('stresslevel-' + stresslevel.indoor);

	// DetailView
	dEl = detailEl.querySelector('.stresslevel');
	dEl.querySelector('h2').innerText = stresslevel.message;
	//dEl.querySelector('.ampel .active').classList.toggle('active');
	dEl.querySelector('.ampel-' + stresslevel.indoor).classList.toggle('active');
}

// noise Element
function setNoise(noise){

	// Tile
	el = document.getElementById('noise');
	el.querySelector('data').innerText = noise.indoor + 'dB';
	el.classList.remove('noise-low', 'noise-medium', 'noise-height');

	if(noise.indoor <= 63){
		domClass = 1;
	} else if(noise.indoor > 63 && noise.indoor < 81){
		domClass = 2;
	} else if(noise.indoor >= 81){
		domClass = 3;
	}

	el.classList.add('noise-' + domClass);

	// DetailView
	dEl = detailEl.querySelector('.noise');
	dEl.querySelector('data').innerText = noise.indoor + ' db';
	//dEl.querySelector('.ampel .active').classList.toggle('active');
	dEl.querySelector('.ampel-' + domClass).classList.toggle('active');
}

// Airquality Element
function setAirquality(airquality){

	// Tile
	el = document.getElementById('airquality');
	el.classList.remove('airquality-1', 'airquality-2', 'airquality-3');
	el.classList.add('airquality-' + airquality.indoor);

	// DetailView
	dEl = detailEl.querySelector('.airquality')
	dEl.querySelector('h2').innerText = airquality.message;
	//dEl.querySelector('.ampel .active').classList.toggle('active');
	dEl.querySelector('.ampel-' + airquality.indoor).classList.toggle('active');
}

function foodListItem(data, itemWidth){
	item = document.createElement('li');
	item.style.width = itemWidth;
	figure = document.createElement('figure');
	figure.classList.add('slide');
	img = document.createElement('img');
	name = data.replace(' ', '-').replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue');
	img.src = 'images/food/' + name + '.jpg';
	figcaption = document.createElement('figcaption');
	h2 = document.createElement('h2');
	h2.innerText = data;

	figcaption.appendChild(h2);
	figure.appendChild(img);
	figure.appendChild(figcaption);
	item.appendChild(figure);

	return item
}

function weatherListItem(data, itemWidth){
	item = document.createElement('li');
	//item.style.width = itemWidth;
	figure = document.createElement('figure');
	figure.classList.add('slide');
	h2Day = document.createElement('h2');
	date = new Date(data.dt * 1000);
	h2Day.innerText = date.getDate() + '.' + date.getMonth();

	imgWeather = document.createElement('img');
	imgWeather.src = 'images/weather/' + data.weather.icon + '.svg';
	figcaption = document.createElement('figcaption');

	h3Temp = document.createElement('h3');
	h3Temp.innerText = Math.floor(data.temp.max) + '°C / ' + Math.floor(data.temp.min) + '°C';
	h3Descr = document.createElement('h3');
	h3Descr.innerText = data.weather.description;
	h3Rain = document.createElement('h3');
	h3Rain.innerText = Math.floor(data.rain) + '%';
	h3Rain.classList.add('rain');

	figure.appendChild(h2Day);
	figcaption.appendChild(h3Temp);
	figcaption.appendChild(h3Descr);
	figcaption.appendChild(h3Rain);
	figure.appendChild(imgWeather);
	figure.appendChild(figcaption);
	item.appendChild(figure);

	return item
}

// Clock
function clock () {
	var date = new Date();
	document.getElementById('date').innerText = date.toLocaleDateString();
	document.getElementById('time').innerText = date.toLocaleTimeString().substring(0,5);
}

// IdleTimer
function timerIncrement(){
	idleTime ++;
	if(idleTime == 15){
		deactivate();
	}
}

});