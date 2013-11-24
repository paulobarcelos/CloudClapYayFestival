define(
[
	'happy/_libs/signals'
],
function (
	Signal
){
	var UserSocketInterface = function(socketio) {
		var self = this,
		id,
		socket,
		annoucementSignal,
		loginSignal,
		giftSignal,
		giftCollectedSignal;

		var connect = function (host) {
			socket = socketio.connect(host);
			socket.on('error', function () {
				setTimeout(function () {
					socket.socket.connect();
				}, 1000);
			});

			socket.on('connect', onReportIdentity);
			socket.on('Login', onLogin);

			loginSignal = new Signal();
			annoucementSignal = new Signal();
			giftSignal = new Signal();
			giftCollectedSignal = new Signal();
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
		var collectGift = function() { 
			localStorage.clearItem('user_gift');
			console.log('Gift Collected');
			giftCollectedSignal.dispatch();
		}
		var onReportIdentity = function () {
			socket.emit('I am a user', localStorage.getItem('user_id'));
		}
		var onLogin = function(_id){
			id = _id;
			localStorage.setItem('user_id', id);
			console.log('Login', id);
			loginSignal.dispatch();
		}
		var onAnnouncement = function(data){
			console.log('Annoucement', data);
			annoucementSignal.dispatch(data);
		}
		var onGift = function(data){
			localStorage.setItem('user_gift', data);
			console.log('Gift', data);
			giftSignal.dispatch(data);
		}
		var getGift = function(){
			return localStorage.getItem('user_gift');
		}
		var getLoginSignal = function(){
			return loginSignal;
		}
		var getAnnouncementSignal = function(){
			return annoucementSignal;
		}
		var getGiftSignal = function(){
			return giftSignal;
		}
		var getGiftCollectedSignal = function(){
			return giftCollectedSignal;
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
		Object.defineProperty(self, 'collectGift', {
			value: collectGift
		});
		Object.defineProperty(self, 'gift', {
			get: getGift
		});
		Object.defineProperty(self, 'loginSignal', {
			get: getLoginSignal
		});
		Object.defineProperty(self, 'announcementSignal', {
			get: getAnnouncementSignal
		});
		Object.defineProperty(self, 'giftCollectedSignal', {
			get: getGiftCollectedSignal
		});
		Object.defineProperty(self, 'giftSignal', {
			get: getGiftSignal
		});
		
		
	}
	return UserSocketInterface;
});