define(
[
	'happy/_libs/signals'
],
function (
	Signal
){
	var UserSocketInterface = function(socketio) {
		var self = this,
		uuid,
		listens = ['question'],
		reports = ['stats-data'],
		socket,
		feedSignal,
		questionSignal,
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
			socket.on('question', onQuestion);
			socket.on('interaction-query', onFeed);

			loginSignal = new Signal();
			questionSignal = new Signal();
			feedSignal = new Signal();
		}
		var update = function(){
			socket.emit('interaction-query', {
				type: 'question'
			});
		}
		var onConnect = function () {
			socket.emit('identity', {
				uuid: localStorage.getItem('host_uuid'),
				listens: listens,
				reports: reports
			});
		}
		var onLogin = function(_uuid){
			uuid = _uuid;
			localStorage.setItem('host_uuid', uuid);
			console.log('login', uuid);
			loginSignal.dispatch();

			socket.emit('interaction-query-distinct', {field:'uuid', query:{type:'clap'}}, function(data){console.log(data)} );
		}
		var onQuestion = function(data){
			console.log('question', data);
			questionSignal.dispatch(data);
		}
		var onFeed = function(data){
			console.log('feed', data);
			feedSignal.dispatch(data);
		}
		var sendData = function(data){
			console.log('emit stats-data', data)
			socket.emit('stats-data', data);
		}
		
		var getLoginSignal = function(){
			return loginSignal;
		}
		var getQuestionSignal = function(){
			return questionSignal;
		}
		var getFeedSignal = function(){
			return feedSignal;
		}
		
		Object.defineProperty(self, 'connect', {
			value: connect
		});
		Object.defineProperty(self, 'update', {
			value: update
		});
		Object.defineProperty(self, 'loginSignal', {
			get: getLoginSignal
		});
		Object.defineProperty(self, 'questionSignal', {
			get: getQuestionSignal
		});
		Object.defineProperty(self, 'feedSignal', {
			get: getFeedSignal
		});
		Object.defineProperty(self, 'sendData', {
			value: sendData
		});
	}
	return UserSocketInterface;
});