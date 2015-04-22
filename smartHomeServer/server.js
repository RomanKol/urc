var http = require('http');
var url  = require('url')
var fs = require('fs');
var obst = new Array();
var gemuese = new Array();
var salat = new Array();
var pollen = new Array();

var feelgood_temp = 20.1;
var feelgood_humidity = 50;
var feelgood_co2 = 650;

//-------------------PARSE CSV DATA --------------
var csv = require('csv');

var handler_obst = function(error, content){
   
    if (error){
      console.log(error);
    }
    else{
      csv.parse(content,{delimiter: ';'}, function(err, output){
 		 obst = output;
 		 console.log(obst)
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
fs.readFile('smartHomeServer/obst_gemuese/obst.csv','utf-8', handler_obst);
fs.readFile('smartHomeServer/obst_gemuese/gemuese.csv','utf-8', handler_gemuese);
fs.readFile('smartHomeServer/obst_gemuese/salat.csv','utf-8', handler_salat);
fs.readFile('smartHomeServer/pollen/pollen.csv','utf-8', handler_pollen);
//-------------------Create Server --------------
http.createServer(function (req, res) {
  res.setHeader("Content-Type", "text/html");
  var http = require("http");
    urlOfOpenHab = "http://192.168.33.33:8080/rest/items";

	// get is a simple wrapper for request()
	// which sets the http method to GET
	if(req.url=='/index.html' || req.url=='/') {
		res.setHeader("Content-Type", "text/html");
		var runningPath = 'smartHomeServer'
			    var pathname = 'index.html';
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

/*		var request = http.get(urlOfOpenHab, function (response) {
		
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
				parseString(xml, function (err, result) {
					for (var it = 0; it < result.items.item.length; it++){
						dataArray.push(new Array(result.items.item[it].name[0],result.items.item[it].state[0]));
						//res.write(result.items.item[it].name[0] + " : " + result.items.item[it].state[0] + "\n")
					}
				    
				});
				var swig  = require('swig');
				res.write(swig.renderFile('smartHomeServer/template.html', {
				    pagename: 'awesome people',
				    authors: dataArray
				}));
				res.end();
		        //data = JSON.parse(buffer);
		        //route = data.routes[0];
		        // extract the distance and time
		        //console.log("Walking Distance: " + route.legs[0].distance.text);
		        //console.log("Time: " + route.legs[0].duration.text);
		    });
	 
		}); */
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
						    "temperature_indoor": 0,
						    "temperature_outdoor": 0,
						    "food": [],
						    "barometer": 0,
						    "stresslevel": 0,
						    "loudness": 0,
						    "airquality_indoor": 0,
						    "co2_indoor": 0,
						    "pollen": new Object,
						    "humidity_indoor": 0,
						    "humidity_outdoor": 0,
						    "lng": 0,
						    "lat": 0,
						    "battery": 0,
						    "fstate": 0
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
									returnObject.temperature_indoor = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Outdoor_Temperature") > -1){
									returnObject.temperature_outdoor = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Indoor_Pressure") > -1){
									returnObject.barometer = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Indoor_Noise") > -1){
									returnObject.loudness = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Indoor_CO2") > -1){
									returnObject.co2_indoor = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Indoor_Humidity") > -1){
									returnObject.humidity_indoor = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Outdoor_Humidity") > -1){
									returnObject.humidity_outdoor = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Indoor_latitude") > -1){
									returnObject.lat = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Indoor_longitude") > -1){
									returnObject.lng = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Outdoor_Batteryvp") > -1){
									returnObject.battery = Number(result.items.item[it].state[0]);
								}
								if(name.indexOf("Netatmo_Outdoor_Rfstatus") > -1){
									returnObject.fstate = Number(result.items.item[it].state[0]);
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
							var temparatur_indoor = Number(returnObject.temperature_indoor);
							var humidity_indoor = Number(returnObject.humidity_indoor);
							var co2 = Number(returnObject.co2_indoor);
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
								returnObject.airquality_indoor = Number(1);
							}else{
								if(proz> 30 && proz<= 60){
									returnObject.airquality_indoor = Number(2);
								}else{
									returnObject.airquality_indoor = Number(3);
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
							var noise = returnObject.loudness;
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
							console.log(pollen)
							for (var pollenIndex = 1; pollenIndex < pollen.length-1; pollenIndex++){
								//console.log(obst[obstIndex]+"-->"+obst[obstIndex][n])
								if(pollen[pollenIndex][n] == '1' || pollen[pollenIndex][n] == '2' ||pollen[pollenIndex][n] == '3' ){
									returnObject.pollen[pollen[pollenIndex][0]] = Number(pollen[pollenIndex][n]);
								}
							}
							res.write(JSON.stringify(returnObject));
						    res.end()
						});
				    });
			 
				}); 
			}
			else
			{
				var runningPath = 'smartHomeServer'
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
  
}).listen(1337, '127.0.0.1');

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


console.log('Server running at http://127.0.0.1:1337/');