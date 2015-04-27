// DON Elements
var gridEl			= document.getElementById('theGrid'),
	buttonEl		= document.getElementById('theButton'),
	detailEl 		= document.getElementById('detail'),
	headerEl		= document.getElementById('header'),
	settingsEl 		= document.getElementById('settings'),
	settingsBtnEl	= document.getElementById('settingsBtn'),
	settingsImgEl = document.getElementById('settingsImg');

var listEl = document.getElementById('list');


var settings = {},
	data = {};

// Clock Initai
update();

// Clock, Update Every 60 Seconds (60 * 1000 Milliseconds)
clock();
setInterval( clock, 1000);

// Eventlisteners
settingsBtnEl.addEventListener('click', modifySettings, false);
settingsImgEl.addEventListener('click', toggleSettings, false);
listEl.addEventListener('click', loadElement, false);


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

      console.log(data);

    } else {
      console.log('Fehler: ' + this);
    }
  }

  request.send();

}


// Clock
function clock () {
	var date = new Date();
	headerEl.querySelector('#date').innerText = date.toLocaleDateString();
	headerEl.querySelector('#time').innerText = date.toLocaleTimeString();
}


// Load Settings
function loadSettings(){
	settings = JSON.parse(localStorage.getItem('settings'));

	if(settings === null) settings = {};

	console.log(settings);

	for( var setting in settings){
		if(settings[setting] === true){
			document.getElementById('settings_' + setting).checked = true;
			addElement(setting);
		} else {
			document.getElementById('settings_' + setting).checked = false;
		}
	};

}

loadSettings();

function addElement(key){

	el = document.createElement('li');

	img = document.createElement('img');
	img.src = 'images/' + key + '.svg';

	p = document.createElement('p');
	p.innerText = key;

	el.appendChild(img);
	el.appendChild(p);

	listEl.appendChild(el);
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

// Toggle Settings
function toggleSettings(){
	settingsEl.classList.toggle('active');
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



		el.classList.add('active');

	}
	evt.stopPropagation();
}
