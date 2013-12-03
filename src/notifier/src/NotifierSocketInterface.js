define(
[
	'happy/_libs/signals'
],
function (
	Signal
){
	var NotifierSocketInterface = function(socketio) {
		var self = this,
		uuid,
		listens = [],
		reports = ['announcement', 'gift'],
		socket,
		loginSignal;

		var connect = function (host) {
			socket = socketio.connect(host);
			socket.on('error', function () {
				setTimeout(function () {
					socket.socket.connect();
				}, 1000);
			});

			socket.on('connect', onConnect);
			socket.on('login', onLogin);

			loginSignal = new Signal();
		}
		var announce = function (title, content, color, to) {
			var data = {
				title: title,
				content: content,
				color: color,
				to: to
			}
			socket.emit('announcement', data);
			console.log('announcement', data);
		}
		var gift = function (title, content, color, to) {
			var data = {
				title: title,
				content: content,
				color: color,
				to: to
			}
			socket.emit('gift', data);
			console.log('gift', data);
		}
		var onConnect = function () {
			socket.emit('identity', {
				uuid: localStorage.getItem('notifier_uuid'),
				listens: listens,
				reports: reports
			});
		}
		var onLogin = function(_uuid){
			uuid = _uuid;
			localStorage.setItem('notifier_uuid', uuid);
			console.log('login', uuid);
			loginSignal.dispatch();
		}
		

		var getLoginSignal = function(){
			return loginSignal;
		}

		Object.defineProperty(self, 'connect', {
			value: connect
		});
		Object.defineProperty(self, 'announce', {
			value: announce
		});
		Object.defineProperty(self, 'gift', {
			value: gift
		});

		Object.defineProperty(self, 'loginSignal', {
			get: getLoginSignal
		});
		
		
	}
	return NotifierSocketInterface;
});