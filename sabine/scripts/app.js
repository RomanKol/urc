// Comment

var grid = document.getElementById('theGrid'),
		btn = document.getElementById('theButton'),
		detail = document.getElementById('detail');

var data = {};

//update();

grid.addEventListener('click', activate, false);
btn.addEventListener('click', deactivate, false);

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
		if(!grid.classList.contains('detail')){
			grid.classList.add('detail');
		}

		// Add Active Class to DetailView
		if(!detail.classList.contains('active')){
			detail.classList.add('active');
		}

		// Copy Content To DetailView
		detail.querySelector('img').src = el.querySelector('img').src;
		detail.querySelector('h1').innerText = el.querySelector('h1').innerText;

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
	if(grid.classList.contains('detail')){
		grid.classList.remove('detail');
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

      for(item in data){
      	console.log(typeof item);
		  	el = document.getElementById(item);
		  	el = el.querySelector('.data');
		  	el.innerText = data[item];
		  }

    } else {
      console.log('Fehler: ' + this);
    }
  }

  request.send();

}