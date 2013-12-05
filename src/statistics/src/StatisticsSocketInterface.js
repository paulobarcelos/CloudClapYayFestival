define(
[
	'happy/_libs/signals'
],
function (
	Signal
){
	var StatisticsSocketInterface = function(socketio) {
		var self = this,
		uuid,
		listens = ['clap', 'wow', 'booh', 'stats-data'],
		reports = [],
		socket,
		loginSignal,
		dataSignal,
		clapCountSignal,
		wowCountSignal,
		boohCountSignal,
		questionCountSignal;

		var connect = function (host) {
			socket = socketio.connect(host);
			socket.on('error', function () {
				setTimeout(function () {
					socket.socket.connect();
				}, 1000);
			});

			socket.on('connect', onConnect);
			socket.on('login', onLogin);
			socket.on('stats-data', onData)

			loginSignal = new Signal();
			dataSignal = new Signal();
			clapCountSignal = new Signal();
			wowCountSignal = new Signal();
			boohCountSignal = new Signal();
			questionCountSignal = new Signal();
		}
		var request = function(from, to){
			var clapQuery = {
				type: 'clap'
			}
			var wowQuery = {
				type: 'wow'
			}
			var boohQuery = {
				type: 'booh'
			}
			var questionQuery = {
				type: 'question'
			}
			if(!from && to){
				clapQuery.created = {
					'$lte' : to
				};
				wowQuery.created = {
					'$lte' : to
				}
				boohQuery.created = {
					'$lte' : to
				}
				questionQuery.created = {
					'$lte' : to
				}
			}
			else if(from && !to){
				clapQuery.created = {
					'$gte' : from
				};
				wowQuery.created = {
					'$gte' : from
				}
				boohQuery.created = {
					'$gte' : from
				}
				questionQuery.created = {
					'$gte' : from
				}
			}
			else if(from && to){
				clapQuery.created = {
					'$gte' : from,
					'$lte' : to
				};
				wowQuery.created = {
					'$gte' : from,
					'$lte' : to
				}
				boohQuery.created = {
					'$gte' : from,
					'$lte' : to
				}
				questionQuery.created = {
					'$gte' : from,
					'$lte' : to
				}
			}

			socket.emit('interaction-query-count', clapQuery, onClapCount );
			socket.emit('interaction-query-count', wowQuery, onWowCount );
			socket.emit('interaction-query-count', boohQuery, onBoohCount );
			socket.emit('interaction-query-count', questionQuery, onQuestionCount );
		}
		var onConnect = function () {
			socket.emit('identity', {
				uuid: localStorage.getItem('statistics_uuid'),
				listens: listens,
				reports: reports
			});
		}
		var onLogin = function(_uuid){
			uuid = _uuid;
			localStorage.setItem('statistics_uuid', uuid);
			console.log('login', uuid);
			loginSignal.dispatch();
		}
		var onData = function(data){
			console.log('data', data);
			dataSignal.dispatch(data);
		}
		var onClapCount = function(count){
			console.log('clap count', count);
			clapCountSignal.dispatch(count);
		}
		var onWowCount = function(count){
			console.log('wow count', count);
			wowCountSignal.dispatch(count);
		}
		var onBoohCount = function(count){
			console.log('booh count', count);
			boohCountSignal.dispatch(count);
		}
		var onQuestionCount = function(count){
			console.log('quesion count', count);
			questionCountSignal.dispatch(count);
		}
	
		var getLoginSignal = function(){
			return loginSignal;
		}
		var getDataSignal = function(){
			return dataSignal;
		}
		var getClapCountSignal = function(){
			return clapCountSignal;
		}
		var getWowCountSignal = function(){
			return wowCountSignal;
		}
		var getBoohCountSignal = function(){
			return boohCountSignal;
		}
		var getQuetionCountSignal = function(){
			return questionCountSignal;
		}
		
		Object.defineProperty(self, 'connect', {
			value: connect
		});
		Object.defineProperty(self, 'request', {
			value: request
		});
		Object.defineProperty(self, 'loginSignal', {
			get: getLoginSignal
		});
		Object.defineProperty(self, 'dataSignal', {
			get: getDataSignal
		});
		Object.defineProperty(self, 'clapCountSignal', {
			get: getClapCountSignal
		});
		Object.defineProperty(self, 'wowCountSignal', {
			get: getWowCountSignal
		});
		Object.defineProperty(self, 'boohCountSignal', {
			get: getBoohCountSignal
		});
		Object.defineProperty(self, 'questionCountSignal', {
			get: getQuetionCountSignal
		});
	}
	return StatisticsSocketInterface;
});