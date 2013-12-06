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
		loginSignal,
		usersSignal;

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
			usersSignal = new Signal();
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

		var requestActiveUsers = function(minutesAgo){
			minutesAgo = minutesAgo || 10;
			socket.emit('interaction-query-distinct', 
				{
					field:'clientUuid',
					query:
					{ 
						created: {
							'$gte' : new Date(Date.now() - 60000 * minutesAgo )
						}
					}
				},
				function(data){
					usersSignal.dispatch(data);
				}
			);
		}
		

		var getLoginSignal = function(){
			return loginSignal;
		}
		var getUsersSignal = function(){
			return usersSignal;
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
		Object.defineProperty(self, 'requestActiveUsers', {
			value: requestActiveUsers
		});

		Object.defineProperty(self, 'loginSignal', {
			get: getLoginSignal
		});
		Object.defineProperty(self, 'usersSignal', {
			get: getUsersSignal
		});
		
		
	}
	return NotifierSocketInterface;
});