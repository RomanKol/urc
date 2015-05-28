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

	li = document.createElement('li');
	a = document.createElement('a');
	a.href = '#' +  key;

	img = document.createElement('img');
	img.src = 'images/' + key + '.svg';

	h = document.createElement('h3');
	h.innerText = key;

	a.appendChild(img);
	a.appendChild(h);
	li.appendChild(a);

	navListEl.appendChild(li);
}

// Sections
function buildSection(key, data){
	section = document.createElement('section');
	section.id = item;

	section.appendChild(addSectionHeader(item));
	section.appendChild(addSectionContent(item, data));

	mainEl.appendChild(section);
}

function addSectionHeader(key){
	header = document.createElement('header');

	h = document.createElement('h1');
	h.innerText = item;

	img = document.createElement('img');
	img.src = 'images/' + item + '.svg';

	header.appendChild(img);
	header.appendChild(h);

	return header;
}

function addSectionContent(item, data){

	main = undefined;

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

	main = document.createElement('main');

	console.log('FORECAST || DEVICE');
	console.log(item);
	console.log('************');

	return main;
}

function addArray(item, data){

	main = document.createElement('main');

	console.log('FOOD');
	console.log(item);
	console.log('************');

	data.forEach(function(value){
		console.log(value);
		main.appendChild(buildFigure(value));
	});

	return main;
}

function buildFigure(value){
	for (key in value){
		figure = document.createElement('figure');

		img = document.createElement('img');
		img.src = 'images/food/' + key + '.jpg';

		figcaption = document.createElement('figcaption');
		h = document.createElement('h2');
		h.innerText = key;

		a = document.createElement('a');
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

	main = document.createElement('main');

	console.log('airquality || barometer || co2 || humidity || noise || stresslevel || temperature ||');
	console.log(item);
	console.log('************');

	return main;
}


// Active Clicked List Element
function loadElement(evt){
	if(evt.target !== evt.currentTarget){
		el = evt.target;

		// Bubble To Clicked Tile Element
		while( el.nodeName !== 'LI' ){
			el = el.parentElement;
		}

		// Remove Active Class From All Other Tiles
		for (var i = 0; i < list.children.length; i++) {
	  	if(list.children[i].classList.contains('active')){
	  		list.children[i].classList.remove('active');
	  	}
		}

		// Add Active Class To Clicked Element
		el.classList.add('active');

		while (mainEl.firstChild) {
	    mainEl.removeChild(mainEl.firstChild);
		}

		//Selected Element
		element = el.querySelector('p').innerText;
		console.log(element);

		h1 = document.createElement('h1');
		h1.innerText = element;

		mainEl.appendChild(h1);

		// Array // Food
		if(typeof data[element] === 'object' && Array.isArray(data[element]) ){

			ul = document.createElement('ul');

			data[element].forEach(function(item){
				li = document.createElement('li');
				li.innerText = item;
				ul.appendChild(li);
			});

			mainEl.appendChild(ul);

		//
		} else if(typeof data[element] === 'object'){

			// Barometer, Co2, Humidity, Loudness, Temperature
			if(data[element]['indoor']){
				indoor = document.createElement('h2');
				indoor.innerText = 'Indoor: ' + data[element]['indoor'];
				mainEl.appendChild(indoor);
			}

			// Baromter, Humidity, Temperature
			if(data[element]['outdoor']){
				outdoor = document.createElement('h2');
				outdoor.innerText = 'Outdoor: ' + data[element]['outdoor'];
				mainEl.appendChild(outdoor);
			}

			// Pollen
			if(!data[element]['indoor'] && !data[element]['outdoor']){
				ul = document.createElement('ul');
				for (item in data[element]) {
			  	li = document.createElement('li');
					li.innerText = item + ': ' + data[element][item];
					ul.appendChild(li);
				}
				mainEl.appendChild(ul);
			}
		// NUmber // Airquality
		} else if(typeof data[element] === 'number'){

			data = document.createElement('h2');
			value.innerText = data[element];
			mainEl.appendChild(value);

		// Settings
		} else {

			ul = document.createElement('ul');
				for (item in data[element]) {
			  	li = document.createElement('li');
					li.innerText = item + ': ' + data[element][item];
					ul.appendChild(li);
				}
				mainEl.appendChild(ul);

		}
	}
	evt.stopPropagation();
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