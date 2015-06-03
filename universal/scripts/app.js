// DOM Elements

var mainEl = document.getElementById('main'),
		navEl = document.getElementById('navbar'),
		navBtnEl = document.getElementById('navBtn'),
		navListEl = document.getElementById('navList'),
		sttngBtnEl = document.getElementById('settingsBtn');

var settings = {},
		json = {},
		barCharts = {},
		lineCharts = {};

		// Global Charts Options
		Chart.defaults.global.animation = false;
		Chart.defaults.global.scaleLineColor = "#000";
		Chart.defaults.global.scaleLineWidth = 1;
		Chart.defaults.global.scaleFontFamily = "'Segoe UI', Arial, sans-serif",
		Chart.defaults.global.scaleFontSize = 24;
		Chart.defaults.global.scaleFontStyle = "bold";
		Chart.defaults.global.scaleFontColor = '#fff';

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

	var options = {
		scaleShowHorizontalLines: false,
		scaleShowVerticalLines: false
	}

	initBarCharts(options);
	initLineCharts(options);
}

// Navigation
function buildNavItem(key){

	var li = document.createElement('li'),
			a = document.createElement('a');
	a.href = '#' +	key;

	var img = document.createElement('img');
	img.src = 'images/' + key + '.svg';

	var h = document.createElement('h3');
	h.innerText = key.replace('_', ' ');

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
	h.innerText = item.replace('_', ' ');

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
		// Food ||	Pollen
		main = addArray(item, data);
	} else {
		// REST = airquality || barometer || co2 || humidity || noise || stresslevel || temperature
		main = addObject(item, data);
	}

	return main;
}

// Custom Sections
function addCustom(item, data){

	var main = document.createElement('main');

	if(item === 'device'){
		main.appendChild(buildDevice(item, data));
		main.appendChild(buildMap(item, data));
	} else if(item === 'forecast'){
		data.forEach(function(day){
			main.appendChild(buildForecast(day));
		});
	}

	return main;
}

function buildForecast(data){

	var section = document.createElement('section'),
			h = document.createElement('h2'),
			figure = document.createElement('figure'),
			img = document.createElement('img'),
			figcaption = document.createElement('figcaption'),
			hTemp = document.createElement('h3'),
			hDescr = document.createElement('h3'),
			hRain = document.createElement('h3'),
			date = date = new Date(data.dt * 1000);

	h.innerText = date.toLocaleDateString();
	img.src = 'images/weather/' + data.weather.icon + '.svg';
	hTemp.innerText = Math.floor(data.temp.max) + '°C / ' + Math.floor(data.temp.min) + '°C';
	hDescr.innerText = data.weather.description;
	hRain.innerText = Math.floor(data.rain) + '%';
	hRain.classList.add('rain');

	figure.appendChild(h);
	figcaption.appendChild(hTemp);
	figcaption.appendChild(hDescr);
	figcaption.appendChild(hRain);
	figure.appendChild(img);
	figure.appendChild(figcaption);
	section.appendChild(h);
	section.appendChild(figure);

	return section
}

function buildDevice(item, data){

	var wifi = document.createElement('img');
	wifi.src = 'images/wifi_' + data.wifiState + '.svg';

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

function buildMap(item, data){

	var section = document.createElement('section');
	section.classList.add('map');

	var map = document.createElement('div');

	var alt = document.createElement('data');
	alt.innerText = 'Alt: ' + data.alt + 'm';
	var lat = document.createElement('data');
	lat.innerText = 'Lat: ' + data.lat.toFixed(3);
	var lng = document.createElement('data');
	lng.innerText = 'Lng: ' + data.lng.toFixed(3);

	section.appendChild(map);
	section.appendChild(alt);
	section.appendChild(lat);
	section.appendChild(lng);

	//initMap(map, data.lat, data.lng);

	return section;
}

function initMap(element, lat, lng){
	var map;

	var mapOptions = {
		zoom: 16,
		mapTypeControl: false,
		scrollwheel: false
	};

	map = new google.maps.Map(element, mapOptions);

	var pos = new google.maps.LatLng(lat, lng);

	var marker = new google.maps.Marker({
		position: pos,
		map: map
	});

	map.setCenter(pos);
}

// Array Sections

function addArray(item, data){

	var main = document.createElement('main');
	main.classList.add('list');

	data.forEach(function(obj){
		for (value in obj){
			if(typeof obj[value] === 'string'){
				main.appendChild(buildFigure(obj));
			} else if(typeof obj[value] === 'number'){
				main.appendChild(buildProgressBar(obj[value], value));
			}
		}

	});

	return main;
}

function buildFigure(value){
	for (key in value){
		var figure = document.createElement('figure');

		var img = document.createElement('img');
		var path = 'images/food/' + key.replace(' ', '-').replace('ä', 'ae').replace('ö', 'oe').replace('ü', 'ue') + '.jpg';
		img.src = path;

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


//Object Sections
function addObject(item, data){

	var main = document.createElement('main');

	if(data.indoor && data.outdoor){
		main.appendChild(buildDoubleValue(data.indoor, data.outdoor, data.unit));
	} else if(data.indoor && data.unit){
		main.appendChild(buildValue(data.indoor, data.unit, 'indoor'));
	}

	if(data.percentage){
		main.appendChild(buildProgressBar(data.percentage))
	}

	if(data.flow_indoor && data.flow_outdoor){
		main.appendChild(buildDoubleFlow(item, data.flow_indoor, data.flow_outdoor, data.unit));
	} else if(data.flow_indoor){
		main.appendChild(buildFlow(item, data.flow_indoor, data.unit, 'indoor'));
	}

	if(data.origin){
		main.appendChild(buildOrigin(item, data.origin));
	}

	return main;
}

function buildDoubleValue(indoor, outdoor, unit){

	var data = document.createElement('data');
	data.classList.add(location);
	var unit = unit ? unit : '';
	var text = indoor + unit + ' | ' + outdoor + unit;
	data.innerText = text;

	return data;
}

function buildValue(value, unit, location){

	var data = document.createElement('data');
	data.classList.add(location);
	var text = value;
	if(unit) text += unit;
	data.innerText = text;

	return data;
}

function buildProgressBar(value, label){

	var div = document.createElement('div');

	if(label){
		var headline = document.createElement('h3');
		headline.innerText = label;
		div.appendChild(headline);
	}

	var progress = document.createElement('progress');
	progress.min = 0;
	progress.max = 1;
	progress.value = value;

	div.appendChild(progress)

	return div;
}

function buildOrigin(item, value){

	var canvas = document.createElement('canvas');
	canvas.classList.add('origin');
	canvas.width = window.innerWidth - 90;
	canvas.height = Math.round(canvas.width / 1.778, 2);

	if(Array.isArray(value)){

		var data = {
				labels: [],
				datasets: [
						{
								label: item,
								fillColor: "rgba(220,220,220,0.7)",
								strokeColor: "rgba(220,220,220, 0.9)",
								highlightFill: "rgba(220,220,220,0.75)",
								highlightStroke: "rgba(220,220,220,1)",
								data: []
						}
				]
		};

		value.forEach(function(origin){
			for(key in origin){
				data.labels.push(key.charAt(0).toUpperCase() + key.slice(1));
				data.datasets[0].data.push(origin[key]);
			}
		});

		barCharts[item] = data;

	}

	return canvas;
}

function buildDoubleFlow(item, indoor, outdoor, unit){

	var canvas = document.createElement('canvas');
	canvas.classList.add('flow', location);
	canvas.width = window.innerWidth - 90;
	canvas.height = Math.round(canvas.width / 1.778, 2);

	if(Array.isArray(indoor) && Array.isArray(outdoor)){

		var data = {
				labels: [],
				datasets: [
						{
								label: 'Indoor',
								fillColor: "rgba(52, 152, 219, 0.7)",
								strokeColor: "rgba(52, 152, 219, 0.9)",
								highlightFill: "rgba(52, 152, 219, 0.75)",
								highlightStroke: "rgba(52, 152, 219, 1)",
								data: []
						},
						{
								label: 'Outdoor',
								fillColor: "rgba(22, 160, 133, 0.7)",
								strokeColor: "rgba(22, 160, 133, 0.9)",
								highlightFill: "rgba(22, 160, 133, 0.75)",
								highlightStroke: "rgba(22, 160, 133, 1)",
								data: []
						}
				],
				unit: unit
		};

		for (var i = indoor.length - 1; i >= 0; i--) {
			//data.labels.push('t-' + i);
			data.labels.push('');
			data.datasets[0].data.push(indoor[i]);
			data.datasets[1].data.push(outdoor[i]);
		};

		lineCharts[item + '-' + location ] = data;

	}

	return canvas;
}

function buildFlow(item, value, unit, location){

	var canvas = document.createElement('canvas');
	canvas.classList.add('flow', location);
	canvas.width = window.innerWidth - 90;
	canvas.height = Math.round(canvas.width / 1.778, 2);

	if(Array.isArray(value)){

		var data = {
				labels: [],
				datasets: [
						{
								label: item,
								fillColor: "rgba(220,220,220,0.7)",
								strokeColor: "rgba(220,220,220, 0.9)",
								highlightFill: "rgba(220,220,220,0.75)",
								highlightStroke: "rgba(220,220,220,1)",
								data: []
						}
				],
				unit: unit
		};

		for (var i = value.length - 1; i >= 0; i--) {
			//data.labels.push('t-' + i);
			data.labels.push('');
			data.datasets[0].data.push(value[i]);
		};

		lineCharts[item + '-' + location ] = data;

	}

	return canvas;
}

function initBarCharts(options){
	for (chart in barCharts){
		var ctx = document.querySelector('#' + chart + ' .origin' ).getContext("2d"),
				chart = new Chart(ctx).Bar(barCharts[chart], options);
	}
}

function initLineCharts(options){
	console.log(lineCharts);
	for (chart in lineCharts){

		var classes = chart.split('-');

		console.log(chart);
		console.log('#' + classes[0] + ' .flow.' + classes[1]);

		var ctx = document.querySelector('#' + classes[0] + ' .flow').getContext("2d"),
				chart = new Chart(ctx).Line(lineCharts[chart], options);
	}
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