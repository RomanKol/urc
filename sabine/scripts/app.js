// Comment


// DomElements and Variables
var gridEl			= document.getElementById('grid'),
		buttonEl		= document.getElementById('clsBtn'),
		detailEl 		= document.getElementById('detail');

var data = {},
		settings = {},
		slider;

		// Default Settings
		settings.temperature = 20;

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
				console.log('tick')
			}
			if(els[i].classList.contains(el.id)){
				els[i].classList.remove('hide');
				console.log('trick')
			}

		};

	}

	console.log(el.id);

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

      initializeTiles(data);
      initializeDetailView(data);

    } else {
      console.log('Fehler: ' + this);
    }
  }

  request.send();
}

// Insert NetAtmo Data Into Elements
function initializeTiles(data){
	setTemperatureTile(data.temperature);
	setFoodTile(data.food);
	setWeatherTile(data.weather);
	setStresslevelTile(data.stresslevel);
	setLoudnessTile(data.loudness);
	setAirqualityTile(data.airquality);
}

// Temperature Element
function setTemperatureTile(temperature, el){

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
function setFoodTile(food){
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
function setWeatherTile(weather){
	el = document.querySelector('#barometer figcaption');

	// todo
}

// Stresslevel Element
function setStresslevelTile(stresslevel){
	el = document.getElementById('stresslevel');
	el.classList.remove('stresslevel-1', 'stresslevel-2', 'stresslevel-3');
	el.classList.add('stresslevel-' + stresslevel);
}

// Loudness Element
function setLoudnessTile(loudness){
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
function setAirqualityTile(airquality){
	el = document.getElementById('airquality');
	el.classList.remove('airquality-1', 'airquality-2', 'airquality-3');
	el.classList.add('airquality-' + airquality);
}

// Initialize DetailView
function initializeDetailView(data){
	setTemperatureDetail(data.temperature);
	setFoodDetail(data.food);
	setWeatherDetail(data.forecast);
	setStresslevelDetail(data.stresslevel);
	setLoudnessDetail(data.loudness);
	setAirqualityDetail(data.airquality);
}

function setTemperatureDetail(temperature){
	detailEl.querySelector('.temperature .indoor').innerText = temperature.indoor + '°C';
	detailEl.querySelector('.temperature .outdoor').innerText = temperature.outdoor + '°C';
}

function setFoodDetail(food){
	list = detailEl.querySelector('.food ul');
	list.style.width = food.length * 100 + '%';
	itemWidth = window.getComputedStyle(detailEl.querySelector('.foodList', null)).width;
	for (var i = 0; food.length > i; i++) {
		list.appendChild(buildSlideItem(food[i], itemWidth));
	};
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

function setWeatherDetail(weather){
	// toDo
}

function setStresslevelDetail(stresslevel){
	detailEl.querySelector('.stresslevel p').innerText = 'Lorem Ipsum set dolor et ament sum: ' + stresslevel;
}

function setLoudnessDetail(loudness){
	detailEl.querySelector('.loudness data').innerText = loudness.indoor + ' db';
}

function setAirqualityDetail(airquality){
	detailEl.querySelector('.airquality p').innerText = 'Lorem Ipsum set dolor et ament sum: ' + airquality;
}

// Clock
function clock () {
	var date = new Date();
	document.getElementById('date').innerText = date.toLocaleDateString();
	document.getElementById('time').innerText = date.toLocaleTimeString().substring(0,5);
}

