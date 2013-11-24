define(
[
	'happy/app/BaseApp',
	_HOST + '/socket.io/socket.io.js',
	'UserSocketInterface'
],
function (
	BaseApp,
	socketio,
	UserSocketInterface
){

	var touchstart =  ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
	var touchend =  ('ontouchend' in document.documentElement) ? 'touchend' : 'click';

	var App = function(){
		var 
		self = this,
		socketInterface,
		currentScreen,
		screens;

		self.setup = function(){
			var wowCount = localStorage.getItem('user_wowCount');
			if(!wowCount && wowCount !== 0) {
				wowCount = 5;
				localStorage.setItem('user_wowCount', wowCount)
			}
			var boohCount = localStorage.getItem('user_boohCount');
			if(!boohCount && boohCount !== 0) {
				boohCount = 5;
				localStorage.setItem('user_boohCount', boohCount)
			}

			// Screens
			screens = {};
			setupMainScreen();
			setupQuestionScreen();
			setupGiftScreen();			
			setupAnnouncementScreen();
		
			// Socket Interface
			socketInterface = new UserSocketInterface(socketio);
			socketInterface.connect(_HOST);

			socketInterface.loginSignal.add(function(data) {
				if(socketInterface.gift){
					fillGift(socketInterface.gift);
					self.container.classList.add('has-gift')
				}
				switchScreen('main');
			})
			socketInterface.announcementSignal.add(function(data) {
				fillAnnouncement(data);
				switchScreen('announcement')
			})
			socketInterface.giftSignal.add(function(data) {
				fillGift(data);
				self.container.classList.add('has-gift')
				switchScreen('gift');
				
			})
			socketInterface.giftCollectedSignal.add(function(data) {
				self.container.classList.remove('has-gift')
			})

		}


		var setupMainScreen = function () {
			var container = document.createElement('div');
			container.id = 'main-screen';
			container.className = 'screen';
		
			var screen = {
				container: container
			}
			screens.main = screen;

			screen.clap = document.createElement('div');
			screen.clap.className = 'clap main-button';
			screen.clap.innerHTML = 'clap';
			container.appendChild(screen.clap);
			screen.clap.addEventListener(touchstart, function(){
				socketInterface.clap();
			});
			screen.wow = document.createElement('div');
			screen.wow.className = 'wow main-button';
			screen.wow.innerHTML = 'wow';
			container.appendChild(screen.wow);
			screen.wow.addEventListener(touchstart, function(){
				var count = localStorage.getItem('user_wowCount');
				if(count > 0){
					socketInterface.wow();
					count--;
					screen.wowCount.innerHTML = count;
					localStorage.setItem('user_wowCount', count)
				}
				
			});

			screen.wowCount = document.createElement('div');
			screen.wowCount.className = 'count';
			screen.wowCount.innerHTML = localStorage.getItem('user_wowCount');
			screen.wow.appendChild(screen.wowCount);
	
			screen.booh = document.createElement('div');
			screen.booh.className = 'booh main-button';
			screen.booh.innerHTML = 'booh';
			container.appendChild(screen.booh);
			screen.booh.addEventListener(touchstart, function(){
				var count = localStorage.getItem('user_boohCount');
				if(count > 0){
					socketInterface.booh();
					count--;
					screen.boohCount.innerHTML = count;
					localStorage.setItem('user_boohCount', count)
				}
				
			});
			screen.boohCount = document.createElement('div');
			screen.boohCount.className = 'count';
			screen.boohCount.innerHTML = localStorage.getItem('user_boohCount');
			screen.booh.appendChild(screen.boohCount);

			screen.question = document.createElement('div');
			screen.question.className = 'question tab-button';
			screen.question.innerHTML = 'ask question';
			container.appendChild(screen.question);
			screen.question.addEventListener(touchend, function(){
				switchScreen('question')
			});
			screen.gift = document.createElement('div');
			screen.gift.className = 'gift tab-button';
			screen.gift.innerHTML = 'collect gift';
			container.appendChild(screen.gift);
			screen.gift.addEventListener(touchend, function(){
				switchScreen('gift')
			});
		}
		var setupQuestionScreen = function () {
			var container = document.createElement('div');
			container.id = 'question-screen';
			container.className = 'screen';

			var screen = {
				container: container
			}
			screens.question = screen;

			screen.close = document.createElement('div');
			screen.close.className = 'close';
			screen.close.innerHTML = 'close';
			container.appendChild(screen.close);
			screen.close.addEventListener(touchend, function(){
				switchScreen('main');
			});

			screen.text = document.createElement('textarea');
			screen.text.className = 'text';
			screen.text.placeholder = 'What do want to know?';
			container.appendChild(screen.text);
	
			screen.ask = document.createElement('div');
			screen.ask.className = 'ask push-button';
			screen.ask.innerHTML = 'ask';
			container.appendChild(screen.ask);
			screen.ask.addEventListener(touchend, function(){
				if(text.value){
					socketInterface.question(text.value);
					switchScreen('main');
				}

			});
		}
		var setupAnnouncementScreen = function () {
			var container = document.createElement('div');
			container.id = 'announcement-screen';
			container.className = 'screen';

			var screen = {
				container: container
			};
			screens.announcement = screen;

			screen.close = document.createElement('div');
			screen.close.className = 'close';
			screen.close.innerHTML = 'close';
			container.appendChild(screen.close);
			screen.close.addEventListener(touchend, function(){
				switchScreen('main');
			});

			screen.title = document.createElement('div');
			screen.title.className = 'title';
			container.appendChild(screen.title);

			screen.content = document.createElement('div');
			screen.content.className = 'content';
			container.appendChild(screen.content);
		}
		var setupGiftScreen = function () {
			var container = document.createElement('div');
			container.id = 'gift-screen';
			container.className = 'screen';
			
			var screen = {
				container: container
			};
			screens.gift = screen;

			screen.close = document.createElement('div');
			screen.close.className = 'close';
			screen.close.innerHTML = 'close';
			container.appendChild(screen.close);
			screen.close.addEventListener(touchend, function(){
				switchScreen('main');
			});

			screen.title = document.createElement('div');
			screen.title.className = 'title';
			container.appendChild(screen.title);

			screen.content = document.createElement('div');
			screen.content.className = 'content';
			container.appendChild(screen.content);

			screen.collect = document.createElement('div');
			screen.collect.className = 'collect push-button';
			screen.collect.innerHTML = 'collect';
			container.appendChild(screen.collect);
			screen.collect.addEventListener(touchend, function(){
				socketInterface.collectGift();
				switchScreen('main');
			});
		}

		var fillAnnouncement = function(data){
			screens.announcement.title = data.title;
			screens.announcement.content = data.content;
			screens.announcement.container.style.backgroundColor = data.color;
		}
		var fillGift = function(data){
			screens.gift.title = data.title;
			screens.gift.content = data.content;
			screens.gift.container.style.backgroundColor = data.color;
		}

		var switchScreen = function (screen) {
			if(currentScreen) self.container.removeChild(currentScreen.container);
			currentScreen = screens[screen];
			self.container.appendChild(currentScreen.container);
		}
	}
	App.prototype = new BaseApp();
	return App;
});