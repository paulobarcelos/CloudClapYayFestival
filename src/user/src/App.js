define(
[
	'happy/app/BaseApp',
	'http://cloudclapserver.herokuapp.com/socket.io/socket.io.js',
	'UserSocketInterface'
],
function (
	BaseApp,
	socketio,
	UserSocketInterface
){

	var App = function(){
		var 
		self = this,
		socketInterface,
		socket;

		self.setup = function(){
			window.scrollTo(0,1);
			document.ontouchmove = function(event){
				event.preventDefault();
			}

			socketInterface = new UserSocketInterface(socketio);
			socketInterface.connect('http://cloudclapserver.herokuapp.com');

			var touchstart =  ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';

			var clapButton = document.createElement('div');
			clapButton.id = 'clap';
			clapButton.innerHTML = 'clap!';
			self.container.appendChild(clapButton);
			clapButton.addEventListener(touchstart, function(){
				socketInterface.clap();

			});
		
		}
	}
	App.prototype = new BaseApp();
	return App;
});