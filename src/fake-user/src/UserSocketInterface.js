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
		listens = ['announcement', 'gift'],
		reports = ['clap', 'wow', 'booh', 'question'],
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

			socket.on('connect', onConnect);
			socket.on('login', onLogin);
			socket.on('announcement', onAnnouncement);
			socket.on('gift', onGift);

			loginSignal = new Signal();
			annoucementSignal = new Signal();
			giftSignal = new Signal();
			giftCollectedSignal = new Signal();
		}
		var clap = function () {
			socket.emit('clap');
			console.log('clap');
		}
		var wow = function() {
			socket.emit('wow');
			console.log('wow');
		}
		var booh = function() { 
			socket.emit('booh');
			console.log('booh');
		}
		var question = function(question) { 
			socket.emit('question', {question:question});
			console.log('question', {question:question});
		}
		var collectGift = function() { 
			removeItem('user_gift');
			console.log('Gift Collected');
			giftCollectedSignal.dispatch();
		}
		var onConnect = function () {
			socket.emit('identity', {
				uuid: '',
				listens: listens,
				reports: reports
			});
		}
		var onLogin = function(_uuid){
			uuid = _uuid;
			console.log('login', uuid);
			loginSignal.dispatch();

			var gift = getItem('user_gift');
			if(gift)onGift(gift);
		}
		var onAnnouncement = function(data, acknowledgement){
			if(acknowledgement)acknowledgement(uuid);
			console.log('announcement', data, acknowledgement);
			annoucementSignal.dispatch(data);
		}
		var onGift = function(data, acknowledgement){
			if(acknowledgement)acknowledgement(uuid);
			console.log('gift', data);
			giftSignal.dispatch(data);
		}

		var setItem = function(key, object){
			localStorage.setItem(key, JSON.stringify(object));
		}
		var getItem = function(key){
			var item;
			try{
				item = JSON.parse(localStorage.getItem(key))
			}
			catch(e){console.log(e)}
			
			return item;
		}
		var removeItem = function(key){
			localStorage.removeItem(key);
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