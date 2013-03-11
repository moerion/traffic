
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');


require('./node_modules/formidable/test/common');

var http = require('http'),
    util = require('util'),
    formidable = require('formidable'),
    server;

var mongoose = require('mongoose');
		
var inXls = require('./controllers/inXls.js');
var parseTurnMovement = require('./controllers/parseTurnMovement.js');

var User = require('./models/userModel').User;

var TurnMovement = require('./models/turnMovementModel').TurnMovement;

var Session = require('./models/sessionModel').Session;

var loggedIn = false;

var Cookies = require('cookies');

dsn = "mongodb://localhost/test";

mongoose.connect(dsn);

//console.log ("here");

var app = module.exports = express.createServer(/*function(req, res) {
	var cookies = new Cookies(req,res);
	var sesh = Session.find({ key: cookies.get('session') });

	if (sesh) {
		console.log('logged in');
	}
}*/
);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser({uploadDir:'./public/data/uploads'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


// Routes

app.get('/', routes.index);

//app.get('/:id', function(req, res){
  //res.render('user', { title: 'Based World', user: req.params.id})});

app.get('/:id', function(req, res){
  res.render('index', {title: 'ADUS DATA', group: 'index', page: req.params.id, status: loggedIn})});

app.get('/index/:id', function(req, res){
  res.render('index', {title: 'ADUS DATA', group: 'index', page: req.params.id, status: loggedIn})});

app.get('/agencies/:id', function(req, res){
  res.render('index', {title: 'ADUS DATA', group: 'agencies', page: req.params.id, status: loggedIn})});

app.get('/types/:id', function(req, res){
  res.render('index', {title: 'ADUS DATA', group: 'types', page: req.params.id, status: loggedIn})});

app.get('/upload/:id', function(req, res){
  res.render('index', {title: 'ADUS DATA', group: 'upload', page: req.params.id, status: loggedIn})});

app.get('/queries/:id', routes.queries);

app.post('/upload/Done', function(req, res, next){
	res.render('index', {title: 'ADUS DATA', group: 'upload', page: 'Done'})
//	console.log(req.body);
	console.log(req.files);
//	console.log(req.files.upload);
//	console.log(req.files.upload.length);


	var uploadedFiles = [];
	if (Array.isArray(req.files.upload)) {
		//console.log("Found an array!");
		for(var idx in req.files.upload) {
			//console.log(typeof(req.files.upload[idx]) + ': ' + req.files.upload[idx].path);
			uploadedFiles.push({ path: req.files.upload[idx].path, type: req.files.upload[idx].type });
		}
	}
	else {
		//console.log("Found a hash!");
		//console.log(req.files.upload.path);
		uploadedFiles.push({ path: req.files.upload.path, type: req.files.upload.type });
	}

	for(var idx in uploadedFiles) {
		console.log('file: ' + uploadedFiles[idx].path);
				if (uploadedFiles[idx].type == 'application/vnd.ms-excel'){
			console.log('XLS FILE!!');
			inXls.convertXlsToCsv(uploadedFiles[idx].path);
		}
	}
});

app.post('/index/Success', function(req, res, next){
	
	var cookies = new Cookies(req,res);
	var expDate = new Date(new Date().getDate() + 3);
	var randId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		  var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		  return v.toString(16);
	});

	
if (!loggedIn){
	//var cookies = new Cookies(req,res);
	Session.findOne({ key: cookies.get('session') }, 'key', function(err, sesh) {
		if (!err) {
			console.log('logged in: ' + sesh.key);
			loggedIn = true;
		}
	});

	/*if (sesh) {
		console.log('logged in: ' + sesh.key);
	}*/
	
	if (!loggedIn) {
		cookies.set("session", randId);//, { expires: expDate });

		var sesh = new Session({key: randId});
		sesh.save(function(err, item) {
				if (err) {
					return console.log(err);
				} else {
					return console.log(item);
				}
			});
		console.log('cookies are done');
		console.log(cookies.get("session"));
		console.log(expDate);
	}
	res.render('index', {title: 'ADUS DATA', group: 'index', page: 'Success', status: loggedIn})}

else{
	res.render('index', {title: 'ADUS DATA', group: 'index', page: 'Logged In', status: loggedIn})}
});

app.get('/queries/:id', function(req, res){
  res.render('index', {title: 'ADUS DATA', group: 'queries', page: req.params.id, status: loggedIn})});

app.post('/queries/Post', function(req, res, next){

	if (req.body.type == "TurnMovement"){
	
		//var intersection, before, after, agencies;
		var filter = {}	

		/*if (req.body.intersection == "All"){
			//intersection = TurnMovement.collection.find();		
		}
		else if {	
			filter.intersection = req.body.intersection;
			//intersection = TurnMovement.collection.find({ intersection: req.body.intersection});
		}*/

		if (req.body.intersection != "All") {
			filter.intersection = req.body.intersection;
		}

		if (req.body.before != "All") {
			filter.before = { endTime: {$lte: Number(req.body.before)} };
		}

		if (req.body.after != "All") {
			filter.after = { endTime: {$gte: Number(req.body.after)} };
		}

		if (req.body.agency != "All") {
			filter.agency = req.body.agency;
		}
		
		/*
		console.log('Filtering with conditions: ');
		for(var p in filter) {
			console.log(p);
		}
		*/

		TurnMovement.find(filter, function(error, results) {

			if (error){
				callback(error,null);
			}else{
			
			var csv = require('csv');
			
			csv()
			.from(results)
			.toPath(__dirname+'/public/data/out.csv', {
				columns: ['intersection','agency','id'],
				header: true
			})
			.transform(function(data) {
				return data;
			})

			console.log(results);
			console.log(__dirname);
			res.render('index', {title: 'ADUS DATA', group: 'queries', page: 'Post', status: loggedIn});
			}
		});
























		/*TurnMovement.collection.find(filter, function(error, records) {

			var results = records.totalNumberOfRecords === 0 ? [] : records;
			console.log(results);	

			if (!error) {
				res.render('index', {title: 'ADUS DATA', group: 'queries', page: 'Post', status: loggedIn})
			} else {
				
			}
		});*/

	}


});


app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
