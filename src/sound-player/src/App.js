define(
[
	'happy/app/BaseApp',
	'http://cloudclapserver.herokuapp.com/socket.io/socket.io.js',
	'SoundPlayer'
],
function (
	BaseApp,
	socketio,
	SoundPlayer
){
	var App = function(){
		var 
		self = this;

		self.setup = function(){
			socketInterface = new SoundPlayer(socketio);
			socketInterface.connect('http://cloudclapserver.herokuapp.com');			
		}
	}
	App.prototype = new BaseApp();
	return App;
});