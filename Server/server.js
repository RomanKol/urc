var http = require('http')
	, domain = require('domain')
  	, serverDomain = domain.create()
var https = require('https');
var url  = require('url')
var fs = require('fs');
var obst = new Array();
var gemuese = new Array();
var salat = new Array();
var pollen = new Array();

var feelgood_temp = 20.1;
var feelgood_humidity = 50;
var feelgood_co2 = 650;
var flow_barometer_indoor 	= [];
var flow_barometer_outdoor 	= [];
var flow_co2			 	= [];
var flow_humidity_indoor	= [];
var flow_humidity_outdoor	= [];
var flow_noise				= [];
var flow_temperatur_indoor 	= [];
var flow_temperatur_outdoor	= [];
var RequestCounter = 0;
var RequestCounterForMeasurment = 0;
var accessToken = "";
var expTimer = 10800;
var resfreshToken = "";
var dataTimestampOfRequest = "";

retrieveAccessTokenInital();
//-------------------PARSE CSV DATA --------------
var csv = require('csv');

var handler_obst = function(error, content){
   
    if (error){
      console.log(error);
    }
    else{
      csv.parse(content,{delimiter: ';'}, function(err, output){
 		 obst = output;
		});
    } 
  }
 var handler_gemuese = function(error, content){
   
    if (error){
      console.log(error);
    }
    else{
     csv.parse(content, {delimiter: ';',comment: '#'}, function(err, output){
 		 gemuese = output;
 		 
		});
    }
  }
 var handler_salat = function(error, content){
   
    if (error){
      console.log(error);
    }
    else{
      csv.parse(content, {delimiter: ';',comment: '#'}, function(err, output){
 		 salat = output;

		});
    }
  }
var handler_pollen = function(error, content){
   
    if (error){
      console.log(error);
    }
    else{
      csv.parse(content, {delimiter: ';',comment: '#'}, function(err, output){
 		 pollen = output;

		});
    }
  }
fs.readFile('Server/obst_gemuese/obst.csv','utf-8', handler_obst);
fs.readFile('Server/obst_gemuese/gemuese.csv','utf-8', handler_gemuese);
fs.readFile('Server/obst_gemuese/salat.csv','utf-8', handler_salat);
fs.readFile('Server/pollen/pollen.csv','utf-8', handler_pollen);
//-------------------Create Server --------------
serverDomain.run(function () {
	http.createServer(function (req, res) {
	  res.setHeader("Content-Type", "text/html");
	  var http = require("http");
	    urlOfOpenHab = "http://192.168.33.33:8080/rest/items";

		// get is a simple wrapper for request()
		// which sets the http method to GET
		if(req.url=='/index.html' || req.url=='/') {
			res.setHeader("Content-Type", "text/html");
			var runningPath = 'frontend'
				    var pathname = 'index.html';
				  	//console.log(url.format(pathname));
					//css(res,runningPath+"\\"+url.format(pathname))
					var handler = function(error, content){

					    if (error){
					      console.log(error);
					    }
					    else{
					      res.write(content);
					      res.end()
					    }
					    //if(count == 1){
					    //	response.end();
					   // }
					    
					}

				  fs.readFile(runningPath+"\\"+url.format(pathname), handler);


	  	 }else
			{

				//if(req.url=='/update' ){
				if(req.url.indexOf('/update') > -1  ){
					res.setHeader('Content-Type','application/json');
					var http = require("http");
				     urlOfOpenHab = "http://192.168.33.33:8080/rest/items";
					var request = http.get(urlOfOpenHab, function (response) {	
					    // data is streamed in chunks from the server
					    // so we have to handle the "data" event    
					    var buffer = "", 
					        data,
					        route;

					    response.on("data", function (chunk) {
					        buffer += chunk;
					    }); 

					    response.on("end", function (err) {			
							var parseString = require('xml2js').parseString;
							var xml = buffer
							var dataArray = new Array();
							var returnObject = {
								"airquality": 0,
								"barometer": {"indoor" : 0, "flow_indoor": new Array()},
								"co2": {"indoor" : 0, "flow_indoor": new Array()},
								"food": [],
								"humidity": {"indoor" : 0, "flow_indoor": new Array(), "outdoor" : 0, "flow_outdoor": new Array()},
							    "loudness": {"indoor" : 0, "flow_indoor": new Array()},
							    "pollen": new Object,
							    "settings" : {"battery": 0,"fstate": 0,"lat": 0,"lng": 0},
							    "stresslevel": 0,
							    "temperature": {"indoor" : 0, "flow_indoor": new Array(), "outdoor" : 0, "flow_outdoor": new Array()},
							}
							parseString(xml, function (err, result) {
								
								if(req.url == '/update/test/stress'){
									result = JSON.parse(fs.readFileSync('smartHomeServer/test/stress.json','utf8'));
								}
								if(req.url == '/update/test/airquality-co2'){
									result = JSON.parse(fs.readFileSync('smartHomeServer/test/airquality-co2.json','utf8'));
								}
								if(req.url == '/update/test/extrem-carbon'){
									result = JSON.parse(fs.readFileSync('smartHomeServer/test/extrem-carbon.json','utf8'));
								}
								if(req.url == '/update/test/extrem-humidity'){
									result = JSON.parse(fs.readFileSync('smartHomeServer/test/extrem-humidity.json','utf8'));
								}
								if(req.url == '/update/test/extrem-noise'){
									result = JSON.parse(fs.readFileSync('smartHomeServer/test/extrem-noise.json','utf8'));
								}
								if(req.url == '/update/test/extrem-temp'){
									result = JSON.parse(fs.readFileSync('smartHomeServer/test/extrem-temp.json','utf8'));
								}
								
								for (var it = 0; it < result.items.item.length; it++){
									var name = result.items.item[it].name[0];
									if(name.indexOf("Netatmo_Indoor_Temperature") > -1){
										returnObject.temperature.indoor = Number(result.items.item[it].state[0]);
										returnObject.temperature.flow_indoor = flow_temperatur_indoor;
									}
									if(name.indexOf("Netatmo_Outdoor_Temperature") > -1){
										returnObject.temperature.outdoor = Number(result.items.item[it].state[0]);
										returnObject.temperature.flow_outdoor = flow_temperatur_outdoor;
									}
									if(name.indexOf("Netatmo_Indoor_Pressure") > -1){
										returnObject.barometer.indoor = Number(result.items.item[it].state[0]);
										returnObject.barometer.flow_indoor = flow_barometer_indoor;
									}
									if(name.indexOf("Netatmo_Indoor_Noise") > -1){
										returnObject.loudness.indoor = Number(result.items.item[it].state[0]);
										returnObject.loudness.flow_indoor = flow_noise;
									}
									if(name.indexOf("Netatmo_Indoor_CO2") > -1){
										returnObject.co2.indoor = Number(result.items.item[it].state[0]);
										returnObject.co2.flow_indoor = flow_co2;
									}
									if(name.indexOf("Netatmo_Indoor_Humidity") > -1){
										returnObject.humidity.indoor = Number(result.items.item[it].state[0]);
										returnObject.humidity.flow_indoor = flow_humidity_indoor;
									}
									if(name.indexOf("Netatmo_Outdoor_Humidity") > -1){
										returnObject.humidity.outdoor = Number(result.items.item[it].state[0]);
										returnObject.humidity.flow_outdoor = flow_humidity_outdoor;
									}
									if(name.indexOf("Netatmo_Indoor_latitude") > -1){
										returnObject.settings.lat = Number(result.items.item[it].state[0]);
									}
									if(name.indexOf("Netatmo_Indoor_longitude") > -1){
										returnObject.settings.lng = Number(result.items.item[it].state[0]);
									}
									if(name.indexOf("Netatmo_Outdoor_Batteryvp") > -1){
										returnObject.settings.battery = Number(result.items.item[it].state[0]);
									}
									if(name.indexOf("Netatmo_Outdoor_Rfstatus") > -1){
										returnObject.settings.fstate = Number(result.items.item[it].state[0]);
									}

								}
								//---------------------FOOD----------------------
									

								var d = new Date();
								var n = d.getMonth();
								n = n+1;
								console.log("month: "+n);
								for (var obstIndex = 1; obstIndex < obst.length-1; obstIndex++){
									//console.log(obst[obstIndex]+"-->"+obst[obstIndex][n])
									if(obst[obstIndex][n] == 'ja' ||obst[obstIndex][n] == '(ja)' ){
										returnObject.food.push(obst[obstIndex][0]);
									}
								}
								for (var gemueseIndex = 1; gemueseIndex < gemuese.length-1; gemueseIndex++){
									//console.log(obst[obstIndex]+"-->"+obst[obstIndex][n])
									if(gemuese[gemueseIndex][n] == 'ja' ||gemuese[gemueseIndex][n] == '(ja)' ){
										returnObject.food.push(gemuese[gemueseIndex][0]);
									}
								}
								for (var salatIndex = 1; salatIndex < salat.length-1; salatIndex++){
									//console.log(obst[obstIndex]+"-->"+obst[obstIndex][n])
									if(salat[salatIndex][n] == 'ja' ||salat[salatIndex][n] == '(ja)' ){
										returnObject.food.push(salat[salatIndex][0]);
									}
								}
							
								//---------------------airquality_indoor---------
								var airquality = 0;
								var maxValue_airquality = 16;
								var temparatur_indoor = Number(returnObject.temperature.indoor);
								var humidity_indoor = Number(returnObject.humidity.indoor);
								var co2 = Number(returnObject.co2.indoor);
								var humidity_diff = Math.abs(feelgood_humidity - humidity_indoor);
								var temp_diff = Math.abs(temparatur_indoor - feelgood_temp);
								//----normierung humidity
								if(temp_diff>=15){
									airquality = maxValue_airquality;
								}
								else{
									if(temp_diff>=10){
										airquality+=4;
									}
									else{
										if(temp_diff>=5){
											airquality+=3;
										}else{
											if(temp_diff>=2){
												airquality+=2;
											}else{
												airquality+=1;
											}
										}
									}
								}
								console.log("after temp:"+airquality)
								//----normierung humidity
								if(humidity_diff>=30){
									airquality = maxValue_airquality;
								}
								else{
									if(humidity_diff>=10){
										airquality+=4;
									}
									else{
										if(humidity_diff>=7){
											airquality+=3;
										}else{
											if(humidity_diff>=3){
												airquality+=2;
											}else{
												airquality+=1;
											}
										}
									}
								}
								console.log("after humidity:"+airquality)
								console.log("co2:"+co2)
								//----normierung Co2
								if(co2>=2000){
									airquality = maxValue_airquality;
								}
								else{
									if(co2>=1500){
										airquality+=8;
									}
									else{
										if(co2>=1000){
											airquality+=6;
										}else{
											if(co2>=800){
												airquality+=4;
											}else{
												airquality+=1;
											}
										}
									}
								}
								console.log("after co2:"+airquality)
								var proz = 100/maxValue_airquality*airquality;
								console.log("Proz Wert: "+proz);
								if(proz<= 30){
									returnObject.airquality = Number(1);
								}else{
									if(proz> 30 && proz<= 60){
										returnObject.airquality = Number(2);
									}else{
										returnObject.airquality = Number(3);
									}
								}
									//---------------------Stresslevel---------------
								//Werte die Einfließen sollen:
								//		- Temperatur check
								//		- Luftfeuchtigkeitcheck
								//		- Luftdruck 
								//		- Co2 check
								//		- Sonometer check
								//	47 db
								//	1130 ppm
								//	1027 mb
								//	46%
								//	21 C
								// -- genau in der Mitte Orange
								var stresslevel = airquality;
								var maxValue_stresslevel = maxValue_airquality+12;
								var noise = returnObject.loudness.indoor;
								if(noise >=70){
									stresslevel = maxValue_stresslevel;
								}else{
									if(noise >=60){
										stresslevel += 12;
									}else{
										if(noise >=50){
											stresslevel += 10;
										}else{
											if(noise >=45){
												stresslevel += 8;
											}else{
												if(noise >=40){
													stresslevel += 6;
												}else{
													if(noise >=35){
														stresslevel += 4;
													}else{
														if(noise >=30){
															stresslevel += 2;
														}else{
															stresslevel += 1;
														}
													}	
												}
											}
										}
									}
								}
								proz = 100/maxValue_stresslevel*stresslevel;
								if(proz<= 30){
									returnObject.stresslevel = Number(1);
								}else{
									if(proz> 30 && proz<= 60){
										returnObject.stresslevel = Number(2);
									}else{
										returnObject.stresslevel = Number(3);
									}
								}
								


								//---------------------pollen--------------------
								//console.log(pollen)
								for (var pollenIndex = 1; pollenIndex < pollen.length-1; pollenIndex++){
									//console.log(obst[obstIndex]+"-->"+obst[obstIndex][n])
									if(pollen[pollenIndex][n] == '1' || pollen[pollenIndex][n] == '2' ||pollen[pollenIndex][n] == '3' ){
										returnObject.pollen[pollen[pollenIndex][0]] = Number(pollen[pollenIndex][n]);
									}
								}
								//------start request for weather forcast
								var urlOfweatherAPI = "http://api.openweathermap.org/data/2.5/forecast/daily?lat="+returnObject.settings.lng+"&lon="+returnObject.settings.lat+"&APPID=a1226a9bd9130f264545304f7738c10c&units=metric&lang=de&cnt=3";
								
								var request = http.get(urlOfweatherAPI, function (response) {	
								    // data is streamed in chunks from the server
								    // so we have to handle the "data" event    
								    var buffer2 = ""

								    response.on("data", function (chunk) {
								        buffer2 += chunk;
								    }); 

								    response.on("end", function (err) {
								    	//console.log(buffer2);
								    	returnObject["forcast"] = JSON.parse(buffer2);

							
									    res.write(JSON.stringify(returnObject));
										res.end()
								    });
								 });	





								
							});
					    });
				 
					}); 
				}
				else
				{
					var runningPath = 'frontend'
				    var pathname = req.url;
				  	console.log(url.format(pathname));
					//css(res,runningPath+"\\"+url.format(pathname))
					var handler = function(error, content){

					    if (error){
					      console.log(error);
					    }
					    else{
					      res.write(content);
					      res.end()
					    }
					    //if(count == 1){
					    //	response.end();
					   // }
					    
					}

				  fs.readFile(runningPath+"\\"+url.format(pathname), handler);
					
				}
			} 
	  
	}).listen(1337, 'localhost');
})
function css(response,path) {
  response.writeHead(200, {"Content-Type": "text/css"});

  var count = 0;
  var handler = function(error, content){
    count++;
    if (error){
      console.log(error);
    }
    else{
      response.write(content);
    }
    //if(count == 1){
    //	response.end();
   // }
    
  }

  fs.readFile(path, handler);
 
}

function retrieveAccessTokenInital(){
	//return ;
	console.log("retrieveAccessTokenInital called")
	//var url = "https://api.netatmo.net/oauth2/token/"
	//var grant = "grant_type=password&clienat_id=552d1ba21e7759ef905d9b6a&client_secret=ghffFwPKUKLGhlGX8mY5dwwX4UGFa9mk&username=kk114%40hdm-stuttgart.de&password=HdMurc2015zPq7!&scope=read_station";
	//var urlOfNetAtmoAPiForMeasurements = url + grant;
	var post_data = "grant_type=password&client_id=552d1ba21e7759ef905d9b6a&client_secret=ghffFwPKUKLGhlGX8mY5dwwX4UGFa9mk&username=kk114%40hdm-stuttgart.de&password=HdMurc2015zPq7!&scope=read_station"
	var post_options = {
      host: 'api.netatmo.net',
      port: '443',
      accept: '*/*',
      path: '/oauth2/token',
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(post_data)
      }
  };
  	console.log("retrieveAccessTokenInital start post request")
	var post_req = https.request(post_options, function (response) {	
	    // data is streamed in chunks from the server
	    // so we have to handle the "data" event    
	   
  		console.log('Start Request for access_token ['+RequestCounter+']');
  		RequestCounter+=1;
  		var getAccessToken = ""
	    response.on('error', function(e) {
		  console.log("Got error: " + e.message);
		});
	    response.on("data", function (chunk) {
	        getAccessToken += chunk;
	    }); 

	    response.on("end", function (err) {
	    	console.log("get AccessCode Response");
	    	var parsedJSON = JSON.parse(getAccessToken);
	    	 accessToken= parsedJSON.access_token;
	    	 expTimer = parsedJSON.expires_in;
	    	 resfreshToken = parsedJSON.refresh_token;
	    	console.log("Set Accesstoken: "+accessToken);
	    	console.log("Set expTimer: "+expTimer);
	    	console.log("Set resfreshToken: "+resfreshToken);	
	 	});
	});
	post_req.write(post_data);
  	post_req.end();
}

setInterval(function(){
	    		console.log("inside refresh Token function!!")
	    		var post_data_refresh = "grant_type=refresh_token&refresh_token="+resfreshToken+"&client_id=552d1ba21e7759ef905d9b6a&client_secret=ghffFwPKUKLGhlGX8mY5dwwX4UGFa9mk"
				var post_options_refresh = {
			      host: 'api.netatmo.net',
			      port: '443',
			      accept: '*/*',						//<-- hier den einen Slash raus!!!!
			      path: '/oauth2/token',
			      method: 'POST',
			      headers: {
			          'Content-Type': 'application/x-www-form-urlencoded',
			          'Content-Length': Buffer.byteLength(post_data_refresh)
			      }
			  };
			  console.log('Start Request for access_token ['+RequestCounter+']');
  			  RequestCounter+=1;
  			  var getAccessToken = "";
			  var post_req = https.request(post_options_refresh, function (response) {	
			    // data is streamed in chunks from the server
			    // so we have to handle the "data" event    
			   response.on('error', function(e) {
				  console.log("Got error: " + e.message);
				});
		  		//console.log('Start Request for access_token ['+RequestCounter+']');
		  		//RequestCounter+=1;
			    response.on("data", function (chunk) {
			        getAccessToken += chunk;
			    }); 

			    response.on("end", function (err) {
			    	console.log(getAccessToken);
			    	var parsedJSON = JSON.parse(getAccessToken);
			    	accessToken= parsedJSON.access_token;
			    	expTimer = parsedJSON.expires_in;
			    	resfreshToken = parsedJSON.refresh_token;
			    	console.log("Set Accesstoken: "+accessToken);
			    	console.log("Set expTimer: "+expTimer);
			    	console.log("Set resfreshToken: "+resfreshToken);
			    });
			  
	    	});
	    	post_req.write(post_data_refresh);
  			post_req.end(); 
	    	
}, (expTimer-3600)*1000); // eine stunde vor ablauf wird der access token erneuert

setInterval(function(){
	console.log("Interval for history data called")
	//var url = "https://api.netatmo.net/oauth2/token/"
	//var grant = "grant_type=password&clienat_id=552d1ba21e7759ef905d9b6a&client_secret=ghffFwPKUKLGhlGX8mY5dwwX4UGFa9mk&username=kk114%40hdm-stuttgart.de&password=HdMurc2015zPq7!&scope=read_station";
	
	//var urlOfNetAtmoAPiForMeasurements = url + grant;
	//var post_data = "grant_type=password&client_id=552d1ba21e7759ef905d9b6a&client_secret=ghffFwPKUKLGhlGX8mY5dwwX4UGFa9mk&username=kk114%40hdm-stuttgart.de&password=HdMurc2015zPq7!&scope=read_station"
	//var post_options = {
    //// host: 'api.netatmo.net',
    //  port: '443',
    //  accept: '*/',
    //  path: '/oauth2/token',
    //  method: 'POST',
    //  headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //      'Content-Length': post_data.length
    //  }
 // };

/*	var post_req = https.request(post_options, function (response) {	
	    // data is streamed in chunks from the server
	    // so we have to handle the "data" event    
	    var getAccessToken = ""
  		console.log('Start Request for access_token ['+RequestCounter+']');
  		RequestCounter+=1;
	    response.on("data", function (chunk) {
	        getAccessToken += chunk;
	    }); 

	    response.on("end", function (err) {
	    	console.log(getAccessToken);
	    	var parsedJSON = JSON.parse(getAccessToken);
	    	var temp_accessToken= parsedJSON.access_token;
	    	console.log("access_token: "+temp_accessToken)*/
	    	var device_id = "70:ee:50:12:be:10";
	    	var urlOfNetAtmoAPiForMeasurements = "https://api.netatmo.net/api/getmeasure?access_token="+accessToken+"&device_id="+device_id+"&type=Temperature,Humidity,Co2,Pressure,Noise&scale=3hours";
			console.log("do request to get history: "+urlOfNetAtmoAPiForMeasurements)
			console.log("Measurement Request Counter : ["+RequestCounterForMeasurment+"]")
			RequestCounterForMeasurment += 1;				
			var request = https.get(urlOfNetAtmoAPiForMeasurements, function (response) {	
			    // data is streamed in chunks from the server
			    // so we have to handle the "data" event    
			    var measurment = ""
			    //console.log('Start Request for measurment');
			    
			    response.on('error', function(e) {
				  console.log("Got error: " + e.message);
				});

			    response.on("data", function (chunk) {
			        measurment += chunk;
			    }); 

			    response.on("end", function (err) {
			    	console.log("Get Result from history API "+measurment);
			    	if(measurment.indexOf('{"error":') === 0){
			    		if(dataTimestampOfRequest.length == 0){
			    			console.log("Can't retrieve data because of error, next try in 5 minutes last successfull request was never");
			    		}else{
			    			console.log("Can't retrieve data because of error, next try in 5 minutes last successfull request was:"+dataTimestampOfRequest);
			    		}
			    	}
			    	else{
						flow_barometer_indoor 	= [];
						flow_barometer_outdoor 	= [];
					 	flow_co2			 	= [];
						flow_humidity_indoor	= [];
						flow_humidity_outdoor	= [];
						flow_noise				= [];
						flow_temperatur_indoor 	= [];
						flow_temperatur_outdoor	= [];
			    		
				    	var parsedJSONFromMeasurement = JSON.parse(measurment);
				    	for(var counter = 0; counter < parsedJSONFromMeasurement.body[0].value.length;counter++){
				    		var step =  parsedJSONFromMeasurement.body[0].value[counter];
				    		console.log("step"+step)
				    		flow_temperatur_indoor.push(step[0]);
				    		flow_humidity_indoor.push(step[1]);
				    		flow_co2.push(step[2]);
				    		flow_barometer_indoor.push(step[3]);
				    		flow_noise.push(step[4]);
				    	}
				    	var currentdate = new Date(); 
						dataTimestampOfRequest = currentdate.getDate() + "/"
		                + (currentdate.getMonth()+1)  + "/" 
		                + currentdate.getFullYear() + " @ "  
		                + currentdate.getHours() + ":"  
		                + currentdate.getMinutes() + ":" 
		                + currentdate.getSeconds();
					    	}
			    });
			 });
			request.end();
//	    });
//	 });
//	post_req.write(post_data);
//  	post_req.end();
}, 5*60*1000); //alle 5 mimnuten werden die abgeholt
console.log('Server running at http://localhost:1337/');