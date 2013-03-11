
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

var authSession = require('./controllers/authSession.js');

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
	var ret = authSession.auth(req, res);
  res.render('index', {title: 'ADUS DATA', group: 'agencies', page: req.params.id, status: ret.status, user: ret.user})
});

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

	var ret = authSession.auth(req, res, function(ret){
	
		
		
		var loggedIn = ret.status;
		var user = ret.user;
	
		var cookies = new Cookies(req,res);
		var expDate = new Date(new Date().getDate() + 3);
		var randId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			  var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			  return v.toString(16);
		});

	
		if (!loggedIn) {

			User.findOne({userName: req.body.userName, password: req.body.password}, function(err, login){
				if (!err) {
				
					if (login) {
						cookies.set("session", randId);//, { expires: expDate });

						var sesh = new Session({key: randId, user: login.userName});
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

						loggedIn = true;

						res.render('index', {title: 'ADUS DATA', group: 'index', page: 'Success', status: loggedIn, user: user})
						
					}
					else {
						
						res.render('index', {title: 'ADUS DATA', group: 'index', page: 'Fail', status: loggedIn})
						loggedIn = false;
					}
				}
				else {
					res.render('index', {title: 'ADUS DATA', group: 'index', page: 'Fail', status: loggedIn})
					loggedIn = false;			
				}		

			});

		}	
	else {
		res.render('index', {title: 'ADUS DATA', group: 'index', page: 'Success', status: loggedIn, user: user})
	}	
	
	});

	
});	

app.get('/queries/:id', function(req, res){
  res.render('index', {title: 'ADUS DATA', group: 'queries', page: req.params.id, status: loggedIn})});

app.post('/queries/Post', function(req, res, next){

	if (req.body.type == "TurnMovement"){
	
		//var intersection, before, after, agencies;
		var filter = {}	

		if (req.body.intersection != "All") {
			filter.intersection = req.body.intersection;
		}

		if ((req.body.before != "All") && (req.body.after == "All")) {
			filter.endTime = {$lte: Number(req.body.before)};
		}

		else if ((req.body.after != "All") && (req.body.before == "All")) {
			filter.endTime = {$gte: Number(req.body.after)};
		}
		else if ((req.body.after != "All") && (req.body.before != "All")) {
			filter.endTime = {$lte: Number(req.body.before), $gte: Number(req.body.after)};
		}

		if (req.body.agency != "All") {
			filter.agency = req.body.agency;
		}

		TurnMovement.find(filter, function(error, results) {

			if (error){
				console.log(error);
				//callback(error,null);
			}else{
			
			var csv = require('csv');
			
			csv()
			.from(results)
			.toPath(__dirname+'/public/data/out.csv', {
				columns: ['intersection','time', 'eastStreet', 'eastLeft', 'eastThrough', 'eastRight', 'eastPeds', 'northStreet', 'northLeft', 'northThrough', 'northRight', 'northPeds', 'westStreet', 'westLeft', 'westThrough', 'westRight', 'westPeds', 'southStreet', 'southLeft', 'southThrough', 'southRight', 'southPeds', 'agency', 'id'],
				header: true
			})
			.transform(function(data) {

				//console.log('transforming');

				data.time = String(data.endTime);

				data.eastStreet = data.east.street;
				data.eastLeft =  String(data.east.left);
				data.eastThrough = String(data.east.through);
				data.eastRight = String(data.east.right);
				data.eastPeds = String(data.east.peds);

				data.northStreet = data.north.street;
				data.northLeft =  String(data.north.left);
				data.northThrough = String(data.north.through);
				data.northRight = String(data.north.right);
				data.northPeds = String(data.north.peds);

				data.westStreet = data.west.street;
				data.westLeft =  String(data.west.left);
				data.westThrough = String(data.west.through);
				data.westRight = String(data.west.right);
				data.westPeds = String(data.west.peds);

				data.southStreet = data.south.street;
				data.southLeft =  String(data.south.left);
				data.southThrough = String(data.south.through);
				data.southRight = String(data.south.right);
				data.southPeds = String(data.south.peds);


				return data;
			})

			console.log(results);
			//console.log(__dirname);
			res.render('index', {title: 'ADUS DATA', group: 'queries', page: 'Post', status: loggedIn});
			}
		});
	}
});

app.post('/index/Logoff', function(req, res, next){

	var cookies = new Cookies(req,res);
	cookies.set("session", '');

	res.render('index', {title: 'ADUS DATA', group: 'index', page: 'Home', status: loggedIn})
	loggedIn = false;
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
