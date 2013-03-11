// node samples/sample.js
var csv = require('csv');



var mongoose = require('mongoose');


var User = require('../models/userModel').User;


dsn = "mongodb://localhost/test";

mongoose.connect(dsn);



var columns = ['userName','agencyName','email','password','id']; 

var users = User.find({}, function(err, result){
		console.log(result);
		console.log('Number of objects: ' + result.length);
		
	if (err){
		callback(err,null);
	}else{
console.log ("here");

csv()
.from(result)
.toPath(__dirname+'/users.csv', {
	columns: ['userName','agencyName','email','password','id'],
	header: true
})
.transform(function(data) {
	return data;
})
//.transform(function(data){
    //data.unshift(data.pop());
    //return data;
//	console.log('finishing transform');
//	return data;
//})
.on('data',function(data,index){
	console.log('Index on data: ' + index);
	console.log(data);
    //console.log('#'+index+' '+JSON.stringify(data));
})
.on('end',function(count){
    console.log('Number of lines: '+count);
})
.on('error',function(error){
    console.log(error.message);
})
}
});
