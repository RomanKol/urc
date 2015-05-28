// DOM Elements

var mainEl = document.getElementById('main'),
		navEl = document.getElementById('navbar'),
		navBtnEl = document.getElementById('navBtn'),
		navListEl = document.getElementById('navList'),
		sttngBtnEl = document.getElementById('settingsBtn');

var settings = {},
		json = {};

// Initialize Functions
update();
//loadSettings();



// Eventlisteners

	// Nav Toggle
	navEl.addEventListener('click', function(evt){
		var el = evt.target;

		while(el.parentElement){
			if(el.nodeName === 'LI'){

				// Remove active from prev El
				navToggle(el);

				break;
			} else if(el === navBtnEl){
				//navEl.classList.remove('settings');
				navEl.classList.toggle('active');
				break;
			} else if(el === sttngBtnEl){
				navEl.classList.toggle('settings');
			}
			el = el.parentElement;
		}
	}, false);

	function navToggle (element) {
		var activeElement = navEl.querySelector('.active');
		if(activeElement) activeElement.classList.remove('active');
		element.classList.add('active');
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
      json = JSON.parse(this.response);

      build();
    } else {
      console.log('Fehler: ' + this);
    }
  }

  request.send();

}

function build(){

	for(item in json){
		buildNavItem(item);
		buildSection(item, json[item]);
	}
}

// Navigation
function buildNavItem(key){

	var li = document.createElement('li');
	var a = document.createElement('a');
	a.href = '#' +  key;

	var img = document.createElement('img');
	img.src = 'images/' + key + '.svg';

	var h = document.createElement('h3');
	h.innerText = key;

	a.appendChild(img);
	a.appendChild(h);
	li.appendChild(a);

	navListEl.appendChild(li);
}

// Sections
function buildSection(key, data){
	var section = document.createElement('section');
	section.id = item;

	section.appendChild(addSectionHeader(item));
	section.appendChild(addSectionContent(item, data));

	mainEl.appendChild(section);
}

function addSectionHeader(key){
	var header = document.createElement('header');

	var h = document.createElement('h1');
	h.innerText = item;

	var img = document.createElement('img');
	img.src = 'images/' + item + '.svg';

	header.appendChild(img);
	header.appendChild(h);

	return header;
}

function addSectionContent(item, data){

	var main = undefined;

	if(item === 'forecast' || item === 'device'){
		// Cusom FORECAST || DEVICE
		main = addCustom(item, data);
	} else	if(typeof data === 'object' && Array.isArray(data) ){
		// Food ||  Pollen
		main = addArray(item, data);
	} else {
		// REST = airquality || barometer || co2 || humidity || noise || stresslevel || temperature
		main = addObject(item, data);
	}

	return main;
}


function addCustom(item, data){

	var main = document.createElement('main');

	console.log('FORECAST || DEVICE');
	console.log(item);
	console.log('************');

	main.appendChild(buildDevice(item, data));
	main.appendChild(buildMap(item, data));

	return main;
}

function buildMap(item, data){

	var section = document.createElement('section');
	section.classList.add('map');

	var map = document.createElement('div');

	section.appendChild(map);

	initMap(map, data.lat, data.lng);

	return section;
}

function initMap(element, lat, lng){
	var map;

	var mapOptions = {
	  zoom: 16
	};

	map = new google.maps.Map(element, mapOptions);

	var pos = new google.maps.LatLng(lat, lng);

	var marker = new google.maps.Marker({
		position: pos,
		map: map
	});

	map.setCenter(pos);

}


function buildDevice(item, data){

	console.log(data);

	var wifi = document.createElement('img');
	wifi.src = 'images/wifistate_' + data.wifiState + '.svg';

	var fstate = document.createElement('img');
	fstate.src = 'images/fstate_' + data.fstate + '.svg';

	var battery = document.createElement('data');
	battery.classList.add('battery');
	battery.innerText = data.battery + '%';

	var section = document.createElement('section');
	section.appendChild(wifi);
	section.appendChild(fstate);
	section.appendChild(battery);

	return section;
}


function addArray(item, data){

	var main = document.createElement('main');
	main.classList.add('list');

	data.forEach(function(value){
		main.appendChild(buildFigure(value));
	});

	return main;
}

function buildFigure(value){
	for (key in value){
		var figure = document.createElement('figure');

		var img = document.createElement('img');
		img.src = 'images/food/' + key + '.jpg';

		var figcaption = document.createElement('figcaption');
		var h = document.createElement('h2');
		h.innerText = key;

		var a = document.createElement('a');
		a.href = value[key];
		a.target = "_blank";

		figcaption.appendChild(h);
		figcaption.appendChild(a);
		figure.appendChild(img);
		figure.appendChild(figcaption);
	}

	return figure;
}


function addObject(item, data){

	var main = document.createElement('main');

	if(data.indoor){
		main.appendChild(buildValue(data.indoor, data.unit, 'indoor'));
	}

	if(data.outdoor){
		main.appendChild(buildValue(data.outdoor, data.unit, 'outdoor'));
	}

	if(data.percentage){
		main.appendChild(buildProgressBar(data.percentage))
	}

	return main;
}

function buildValue(value, unit, location){

	var data = document.createElement('data');
	data.classList.add(location);
	var text = value;
	if(unit) text += unit;
	data.innerText = text;

	return data;
}

function buildProgressBar(value){

	var progress = document.createElement('progress');
	progress.min = 0;
	progress.max = 1;
	progress.value = value;

	return progress;
}


// Settings
// Load Settings
function loadSettings(){
	settings = JSON.parse(localStorage.getItem('settings'));

	if(settings === null) settings = {};

	//console.log(settings);

	for( var setting in settings){
		if(settings[setting] === true){
			document.getElementById('settings_' + setting).checked = true;
			addElement(setting);
		} else {
			document.getElementById('settings_' + setting).checked = false;
		}
	}
}

// Toggle Settings
function toggleSettings(){
	settingsEl.classList.toggle('active');
}

// Setting Settings
function modifySettings(){
	var children = 	settingsEl.children;

	for (var i = 0; i < children.length; i++) {
		if(children[i].tagName.toLowerCase() === 'input' && children[i].checked === true){
			settings[children[i].id.substring(9)] = true;
		} else if (children[i].tagName.toLowerCase() === 'input'){
			settings[children[i].id.substring(9)] = false;
		}

	};

	// Remove All Child Elements Of ListElement
	while (listEl.firstChild) {
    listEl.removeChild(listEl.firstChild);
	}

	// Add Active Elements To ListElement
	for( var setting in settings){
		if(settings[setting] === true){
			addElement(setting);
		}
	}

	localStorage.setItem('settings', JSON.stringify(settings));

	toggleSettings();
}