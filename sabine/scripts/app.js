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
	setWeather(data.weather);
	setStresslevel(data.stresslevel);
	setLoudness(data.loudness);
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
	itemWidth = window.getComputedStyle(detailEl.querySelector('.foodList', null)).width;
	for (var i = 0; food.length > i; i++) {
		list.appendChild(buildSlideItem(food[i], itemWidth));
	};
}

// Weather Element
// TODO
function setWeather(weather){
	el = document.querySelector('#barometer figcaption');

	// todo
}

// Stresslevel Element
function setStresslevel(stresslevel){

	// Tile
	el = document.getElementById('stresslevel');
	el.classList.remove('stresslevel-1', 'stresslevel-2', 'stresslevel-3');
	el.classList.add('stresslevel-' + stresslevel);

	// DetailView
	detailEl.querySelector('.stresslevel h2').innerText = 'Lorem Ipsum set dolor et ament sum: ' + stresslevel;
}

// Loudness Element
function setLoudness(loudness){

	// Tile
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

	// DetailView
	detailEl.querySelector('.loudness data').innerText = loudness.indoor + ' db';
}

// Airquality Element
function setAirquality(airquality){

	// Tile
	el = document.getElementById('airquality');
	el.classList.remove('airquality-1', 'airquality-2', 'airquality-3');
	el.classList.add('airquality-' + airquality);

	// DetailView
	detailEl.querySelector('.airquality h2').innerText = 'Lorem Ipsum set dolor et ament sum: ' + airquality;
}

function buildSlideItem(data, itemWidth){
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