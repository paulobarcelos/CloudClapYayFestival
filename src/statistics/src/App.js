define(
[
	'happy/app/BaseApp',
	_HOST + '/socket.io/socket.io.js',
	'StatisticsSocketInterface'
],
function (
	BaseApp,
	socketio,
	StatisticsSocketInterface
){

	var App = function(){
		var 
		self = this,
		socketInterface;

		self.setup = function(){
			var urlVars = getUrlVar();
			var today = new Date();
			var from, to;
			if(urlVars['from_h']){
				var h = urlVars['from_h'];
				var m = urlVars['from_m'] || 0;
				from = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
			}
			if(urlVars['to_h']){
				var h = urlVars['to_h'];
				var m = urlVars['to_m'] || 0;
				to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);
			}
			
			// Socket Interface
			socketInterface = new StatisticsSocketInterface(socketio);
			socketInterface.connect(_HOST);

			socketInterface.loginSignal.add(function(){
				socketInterface.request(from, to);
			});


		}

		var setItem = function(key, object){
			localStorage.setItem(key, JSON.stringify(object));
		}
		var getItem = function(key){
			return JSON.parse(localStorage.getItem(key));
		}
		var getUrlVar = function() {
			var vars = {};
			var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
				vars[key] = value;
			});
			return vars;
		}

	}
	App.prototype = new BaseApp();
	return App;
});