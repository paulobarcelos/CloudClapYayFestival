define(
[
	'happy/app/BaseApp',
	_HOST + '/socket.io/socket.io.js',
	'FakeUserSocketInterface'
],
function (
	BaseApp,
	socketio,
	FakeUserSocketInterface
){

	var App = function(){
		var 
		self = this,
		socketInterface

		self.setup = function(){
			
			socketInterface = new FakeUserSocketInterface(socketio);
			socketInterface.connect(_HOST);

			socketInterface.loginSignal.add(function(data) {
				makeClap();
				//makeWow();
			})	
			numPeople = 1;	// Global for console access

		}
		var makeClap = function(){
			socketInterface.clap();
			setTimeout(makeClap, 300 / numPeople + Math.random() * 20 / numPeople);
		}
		var makeWow = function(){
			socketInterface.wow();
			setTimeout(makeWow, 500 / numPeople + Math.random() * 20 / numPeople);
		}
	}
	App.prototype = new BaseApp();
	return App;
});