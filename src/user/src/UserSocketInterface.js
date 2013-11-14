define(
[],
function (
){
	var UserSocketInterface = function(socketio) {
		var self = this,
		id,
		socket;

		var connect = function (host) {
			socket = socketio.connect(host);
			socket.on('error', function () {
				setTimeout(function () {
					socket.socket.connect();
				}, 1000);
			});

			socket.on('Who are you?', onReportIdentity);
			socket.on('Login', onLogin);
		}
		var clap = function () {
			socket.emit('Request Clap');
			console.log('Clap');
		}
		var wow = function() {
			socket.emit('Resquest Wow');
			console.log('Wow');
		}
		var booh = function() { 
			socket.emit('Request Booh');
			console.log('Booh');
		}
		var question = function(question) { 
			socket.emit('Ask Question', question);
			console.log('Ask', question);
		}
		var onReportIdentity = function () {
			socket.emit('I am a user', localStorage.getItem('user_id'));
		}
		var onLogin = function(_id){
			id = _id;
			localStorage.setItem('user_id', id);
			console.log('Login', id);
		}
		
		Object.defineProperty(self, 'connect', {
			value: connect
		});
		Object.defineProperty(self, 'clap', {
			value: clap
		});
		Object.defineProperty(self, 'wow', {
			value: wow
		});
		Object.defineProperty(self, 'booh', {
			value: booh
		});
		Object.defineProperty(self, 'question', {
			value: question
		});
		
	}
	return UserSocketInterface;
});