define(
[
	'happy/app/BaseApp',
	_HOST + '/socket.io/socket.io.js',
	'NotifierSocketInterface'
],
function (
	BaseApp,
	socketio,
	NotifierSocketInterface
){

	var touchstart =  ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
	var touchend =  ('ontouchend' in document.documentElement) ? 'touchend' : 'click';

	var App = function(){
		var 
		self = this,
		socketInterface,
		screens;

		self.setup = function(){

			var controls = document.createElement('div');
			controls.id = 'controls';
			self.container.appendChild(controls);

			var minutes = document.createElement('input');
			minutes.id = 'minutes';
			minutes.placeholder = 'Minutes ago';
			controls.appendChild(minutes);

			var go = document.createElement('button');
			go.id = 'go';
			go.innerHTML = 'GET ACTIVE USERS';
			controls.appendChild(go);

			go.addEventListener('click', function(e){
				e.preventDefault();
				socketInterface.requestActiveUsers(parseInt(minutes.value));
			});



			// Screen
			screens = {};
			setupAnnouncementScreen();
			self.container.appendChild(screens.announcement.container);
			setupGiftScreen();
			self.container.appendChild(screens.gift.container);


			
		
			// Socket Interface
			socketInterface = new NotifierSocketInterface(socketio);
			socketInterface.connect(_HOST);

			socketInterface.usersSignal.add(onUsers);
		}

		var setupAnnouncementScreen = function () {
			var container = document.createElement('div');
			container.id = 'announcement';
			container.className = 'screen';
			container.title = 'Message';
		
			var screen = {
				container: container
			}
			screens.announcement = screen;

			screen.title = document.createElement('input');
			screen.title.className = 'title';
			screen.title.placeholder = 'Title';
			container.appendChild(screen.title);

			screen.content = document.createElement('textarea');
			screen.content.className = 'content';
			screen.content.placeholder = 'Content';
			container.appendChild(screen.content);
	
			
			screen.to = document.createElement('textarea');
			screen.to.className = 'to';
			screen.to.placeholder = 'Send to specific phone? Enter the IDs, separated by space.';
			container.appendChild(screen.to);

			var urlVars = getUrlVars();
			if(typeof urlVars['to'] != 'undefined') screen.to.value = urlVars['to'];

			screen.send = document.createElement('button');
			screen.send.className = 'send';
			screen.send.innerHTML = 'Send';
			container.appendChild(screen.send);
			screen.send.addEventListener(touchend, function(){
				if(!screen.title.value) return;

				var to = (screen.to.value) ? screen.to.value.split(' ') : '';
				socketInterface.announce(screen.title.value, screen.content.value, '', to);
				screen.title.value = '';
				screen.content.value = '';
				screen.to.value = '';
			});
		}
		var setupGiftScreen = function () {
			var container = document.createElement('div');
			container.id = 'gift';
			container.className = 'screen';
			container.title = 'Gift';
		
			var screen = {
				container: container
			}
			screens.gift = screen;

			screen.title = document.createElement('input');
			screen.title.className = 'title';
			screen.title.placeholder = 'Title';
			container.appendChild(screen.title);

			screen.content = document.createElement('textarea');
			screen.content.className = 'content';
			screen.content.placeholder = 'Content';
			container.appendChild(screen.content);
	
			
			screen.to = document.createElement('textarea');
			screen.to.className = 'to';
			screen.to.placeholder = 'Send to specific phone? Enter the IDs, separated by space.';
			container.appendChild(screen.to);


			var urlVars = getUrlVars();
			if(typeof urlVars['to'] != 'undefined')screen.to.value = urlVars['to'];

			screen.send = document.createElement('button');
			screen.send.className = 'send';
			screen.send.innerHTML = 'Send';
			container.appendChild(screen.send);
			screen.send.addEventListener(touchend, function(){
				if(!screen.title.value) return;

				var needsCheck = (screen.to.value == '');
				var allow = true;
				if(needsCheck){
					allow = confirm('Are you sure you want to send a gift to everyone?');
				}
				if(!allow) return;

				var to = (screen.to.value) ? screen.to.value.split(' ') : '';
				socketInterface.gift(screen.title.value, screen.content.value, '', 	to);
				screen.title.value = '';
				screen.content.value = '';
				screen.to.value = '';
			});
		}

		var onUsers = function(users){
			alert(users.length + ' users found.' + ((users.length > 10) ? ' But only 10 will be selected' : ''));

			var total = (users.length > 10) ? 10: users.length;
			screens.announcement.to.value = '';
			screens.gift.to.value = '';

			for (var i = 0; i < total; i++) {
				var s = users[i];
				if(i != (total -1)) s += ' ';
				screens.announcement.to.value += s;
				screens.gift.to.value += s;
			};
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