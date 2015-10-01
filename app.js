var express = require('express'),
	app = express(),
	http = require('http').Server(app);


var playersOnServer = [];
//add dependencies for html script calls
app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


http.listen(3000, function(){
  console.log('listening on \'localhost:3000\'');
});

