// Comment


// Variables
var gridEl			= document.getElementById('theGrid'),
		buttonEl		= document.getElementById('theButton'),
		detailEl 		= document.getElementById('detail'),
		settingsEl	= document.getElementById('settings');

var data = {};

// Clock Initai
update();
//clock();

gridEl.addEventListener('click', activate, false);
buttonEl.addEventListener('click', deactivate, false);
settingsEl.querySelector('img').addEventListener('click', settings, false);

//
clock();
setInterval( clock, 60 * 1000);

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

function insertData(data){

	console.log(data);

	// Temperature
	el = gridEl.querySelector('#temperature')


	if(data.temperature_indoor < 15){
		el.classList.add('temp-low');
	} else if(data.temperature_indoor > 15 && data.temperature_indoor < 25){
		el.classList.add('temp-ok');
	} else if(data.temperature_indoor > 25 && data.temperature_indoor < 30){
		el.classList.add('temp-warm');
	} else if(data.temperature_indoor > 30){
		el.classList.add('temp-hot');
	}

	el.querySelector('h2').innerText = data.temperature_indoor + ' C°';

	// Food
	var foodEl = gridEl.querySelector('#food figcaption');
	var list = document.createElement('ul');
	for (var i = 0; i < data.food.length; i++) {
		item = document.createElement('li')
		item.innerText = data.food[i];
		list.appendChild(item);
	};
	foodEl.appendChild(list);

	// Weather
	gridEl.querySelector('#barometer h2').innerText = data.barometer + ' Pa';

	// Stresslevel
	var stessLevelEl = gridEl.querySelector('#stresslevel h2').innerText = data.stresslevel;

	// Loudness
	el = gridEl.querySelector('#loudness')

	if(data.loudness < 62){
		el.classList.add('loudness-low');
	} else if(data.loudness > 62 && data.loudness < 81){
		el.classList.add('loudness-medium');
	} else if(data.loudness > 81){
		el.classList.add('loudness-high');
	}

	el.querySelector('h2').innerText = data.loudness + ' dB';

	// Airquality
	gridEl.querySelector('#airquality h2').innerText = data.airquality_indoor;

}

function settings (argument) {
	settingsEl.classList.toggle('active');
}


function clock () {
	var date = new Date();
	settingsEl.querySelector('#date').innerText = date.toLocaleDateString();
	settingsEl.querySelector('#time').innerText = date.toLocaleTimeString();
	console.log('tick');
}
