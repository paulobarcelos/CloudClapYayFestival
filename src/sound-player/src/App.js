define(
[
	'happy/app/BaseApp',
	_HOST + '/socket.io/socket.io.js',
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
			socketInterface.connect(_HOST);			
		}
	}
	App.prototype = new BaseApp();
	return App;
});