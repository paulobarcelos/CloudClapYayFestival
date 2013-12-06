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

	var touchstart =  ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';
	var touchend =  ('ontouchend' in document.documentElement) ? 'touchend' : 'mouseup';

	var App = function(){
		var 
		self = this,
		socketInterface,
		portraitWarning,
		mainContainer,
		currentScreen,
		screens,
		totalWows = 10,
		totalBoohs = 5;

		self.setup = function(){
			var urlVars = getUrlVars();
			if('refreshid'){
				localStorage.removeItem('user_uuid');
			}

			/*var wowCount = localStorage.getItem('user_wowCount');
			if(!wowCount && wowCount !== 0) {
				wowCount = totalWows;
				localStorage.setItem('user_wowCount', wowCount)
			}
			var boohCount = localStorage.getItem('user_boohCount');
			if(!boohCount && boohCount !== 0) {
				boohCount = totalBoohs;
				localStorage.setItem('user_boohCount', boohCount)
			}*/

			// Screens
			portraitWarning = document.createElement('div');
			portraitWarning.id = 'portrait-warning';
			self.container.appendChild(portraitWarning);

			screens = {};
			setupMainScreen();
			setupQuestionScreen();
			setupGiftScreen();			
			setupAnnouncementScreen();
			setupInfoScreen();

			self.container.appendChild(screens.main.container);
		
			// Socket Interface
			socketInterface = new UserSocketInterface(socketio);
			socketInterface.connect(_HOST);

			socketInterface.loginSignal.add(function(data) {
				if(socketInterface.gift){
					fillGift(socketInterface.gift);
					self.container.classList.add('has-gift')
				}
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


			screen.logo = document.createElement('div');
			screen.logo.id = 'logo';
			container.appendChild(screen.logo);

			/*var resetCountTimer;
			screen.logo.addEventListener(touchstart, function(){
				resetCountTimer = setTimeout(function(){
					localStorage.setItem('user_wowCount', totalWows)
					screen.wowCount.innerHTML = totalWows;
					localStorage.setItem('user_boohCount', totalBoohs)
					screen.boohCount.innerHTML = totalBoohs;
						
				}, 5000);
			});

			screen.logo.addEventListener(touchend, function(){
				clearTimeout(resetCountTimer);
			});*/



			screen.clap = document.createElement('div');
			screen.clap.className = 'clap main-button';
			screen.clap.innerHTML = '<span>clap</span>';
			container.appendChild(screen.clap);
			var clapBlock = false;
			screen.clap.addEventListener(touchstart, function(){
				screen.clap.className = 'clap main-button pressed';
				if(clapBlock) return;
				clapBlock = true;
				setTimeout(function(){
					clapBlock = false;
				}, 150)
				socketInterface.clap();
				
			});
			screen.clap.addEventListener(touchend, function(){
				screen.clap.className = 'clap main-button';
			});

			screen.spacer = document.createElement('div');
			screen.spacer.className = 'spacer';
			container.appendChild(screen.spacer);

			screen.wow = document.createElement('div');
			screen.wow.className = 'wow main-button';
			screen.wow.innerHTML = '<span>yay</span>';
			container.appendChild(screen.wow);
			var wowBlock = false;
			screen.wow.addEventListener(touchstart, function(){
				screen.wow.className = 'wow main-button pressed';
									
				if(wowBlock) return;
				wowBlock = true;
				setTimeout(function(){
					wowBlock = false;
				}, 200)
				socketInterface.wow();				
				
			});
			screen.wow.addEventListener(touchend, function(){
				screen.wow.className = 'wow main-button';
			});

			/*screen.wowCount = document.createElement('div');
			screen.wowCount.className = 'count';
			screen.wowCount.innerHTML = localStorage.getItem('user_wowCount');
			screen.wow.appendChild(screen.wowCount);*/
	
			screen.booh = document.createElement('div');
			screen.booh.className = 'booh main-button';
			screen.booh.innerHTML = '<span>boo</span>';
			container.appendChild(screen.booh);
			var boohBlock = false;
			screen.booh.addEventListener(touchstart, function(){
				screen.booh.className = 'booh main-button pressed';
					
				if(boohBlock) return;
				boohBlock = true;
				setTimeout(function(){
					boohBlock = false;
				}, 200)
				socketInterface.booh();

				
				
			});
			screen.booh.addEventListener(touchend, function(){
				screen.booh.className = 'booh main-button';
			});
			/*screen.boohCount = document.createElement('div');
			screen.boohCount.className = 'count';
			screen.boohCount.innerHTML = localStorage.getItem('user_boohCount');
			screen.booh.appendChild(screen.boohCount);*/


			screen.tab = document.createElement('div');
			screen.tab.id = 'tab';
			container.appendChild(screen.tab);

			screen.spacer2 = document.createElement('div');
			screen.spacer2.className = 'spacer2';
			screen.tab.appendChild(screen.spacer2);

			screen.questionButton = document.createElement('div');
			screen.questionButton.className = 'question tab-button';
			screen.questionButton.innerHTML = '<span>ask question</span>';
			screen.tab.appendChild(screen.questionButton);
			screen.questionButton.addEventListener(touchend, function(){
				switchScreen('question')
			});
			screen.giftButton = document.createElement('div');
			screen.giftButton.className = 'gift tab-button';
			screen.giftButton.innerHTML = '<span>get gift</span>';
			screen.tab.appendChild(screen.giftButton);
			screen.giftButton.addEventListener(touchend, function(){
				switchScreen('gift')
			});

			screen.infoButton = document.createElement('div');
			screen.infoButton.className = 'info tab-button';
			screen.infoButton.innerHTML = '<span>i</span>';
			screen.tab.appendChild(screen.infoButton);
			screen.infoButton.addEventListener(touchend, function(){
				switchScreen('info')
			});

		}
		var setupQuestionScreen = function () {
			var container = document.createElement('form');
			container.id = 'question-screen';
			container.className = 'screen';

			var screen = {
				container: container
			}
			screens.question = screen;

			screen.close = document.createElement('div');
			screen.close.className = 'close';
			screen.close.innerHTML = '<span>close</span>';
			container.appendChild(screen.close);
			screen.close.addEventListener(touchstart, function(){
				screen.container.parentNode.removeChild(screen.container);
				currentScreen = null;
			});

			screen.text = document.createElement('textarea');
			screen.text.required= "required" ;
			screen.text.rows = 6;
			screen.text.setAttribute('maxlength', 140);
			screen.text.className = 'text';
			screen.text.placeholder = 'Write your question in maximum 140 characters.';

			container.appendChild(screen.text);
	
			screen.ask = document.createElement('div');
			screen.ask.className = 'ask push-button';
			screen.ask.innerHTML = '<span>ask</span>';
			container.appendChild(screen.ask);
			
			screen.ask.addEventListener(touchstart, function(e){
				e.preventDefault()
				if(screen.text.value){
					socketInterface.question(screen.text.value);
					screen.text.value = '';
					var oldPlaceholder = screen.text.placeholder;
					screen.text.placeholder = 'Thank you for your question!';
					setTimeout(function(){
						screen.text.placeholder = oldPlaceholder;
					}, 4000);
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
			screen.close.innerHTML = '<span>close</span>';
			container.appendChild(screen.close);
			screen.close.addEventListener(touchstart, function(){
				screen.container.parentNode.removeChild(screen.container);
				currentScreen = null;
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
				screen.container.parentNode.removeChild(screen.container);
				currentScreen = null;
			});

			screen.title = document.createElement('div');
			screen.title.className = 'title';
			container.appendChild(screen.title);

			screen.content = document.createElement('div');
			screen.content.className = 'content';
			container.appendChild(screen.content);

			var collectTimer;
			screen.container.addEventListener(touchstart, function(){
				collectTimer = setTimeout(function(){
					if(confirm('Remove gift?')){
						console.log('aaaa')
						socketInterface.collectGift();
						screen.container.parentNode.removeChild(screen.container);
						currentScreen = null;
					}
				}, 1000);
			});

			screen.container.addEventListener(touchend, function(){
				clearTimeout(collectTimer);
			});
		}
		var setupInfoScreen = function () {
			var container = document.createElement('div');
			container.id = 'info-screen';
			container.className = 'screen';

			var screen = {
				container: container
			};
			screens.info = screen;

			screen.close = document.createElement('div');
			screen.close.className = 'close';
			screen.close.innerHTML = '<span>close</span>';
			container.appendChild(screen.close);
			screen.close.addEventListener(touchstart, function(){
				screen.container.parentNode.removeChild(screen.container);
				currentScreen = null;
			});

			screen.title = document.createElement('div');
			screen.title.className = 'title';
			screen.title.innerHTML = 'The Silent Swede';
			container.appendChild(screen.title);

			screen.content = document.createElement('div');
			screen.content.className = 'content';
			screen.content.innerHTML = '<b>The Silent Swede</b> is a tool created to make it easier for you to speak up! Give your instant feedback to the speaker and/or ask a question!';
			container.appendChild(screen.content);
		}

		var fillAnnouncement = function(data){
			screens.announcement.title.innerHTML = data.title;
			screens.announcement.content.innerHTML = data.content;
			if(data.color) screens.announcement.container.style.backgroundColor = data.color;
		}
		var fillGift = function(data){
			screens.gift.title.innerHTML = data.title;
			screens.gift.content.innerHTML = data.content;
			if(data.color) screens.gift.container.style.backgroundColor = data.color;
		}

		var switchScreen = function (screen) {
			if(currentScreen) self.container.removeChild(currentScreen.container);
			currentScreen = screens[screen];
			self.container.appendChild(currentScreen.container);
		}

		self.onResize = function(size){
			if(size.width > size.height){
				self.container.className = 'landscape';
			}
			else{
				self.container.className = '';
			}
		}

		function getUrlVars() {
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