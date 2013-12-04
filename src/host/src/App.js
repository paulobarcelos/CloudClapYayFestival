define(
[
	'happy/app/BaseApp',
	_HOST + '/socket.io/socket.io.js',
	'HostSocketInterface'
],
function (
	BaseApp,
	socketio,
	HostSocketInterface
){

	var touchstart =  ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
	var touchend =  ('ontouchend' in document.documentElement) ? 'touchend' : 'click';

	var App = function(){
		var 
		self = this,
		socketInterface,
		screens,
		feed,
		unmoderatedQuestions,
		topQuestions,
		deletedQuestions;

		self.setup = function(){
			feed = [];

			unmoderatedQuestions = getItem('host_unmoderatedQuestions');
			if(!unmoderatedQuestions) unmoderatedQuestions = {};

			topQuestions = getItem('host_topQuestions');
			if(!topQuestions) topQuestions = {};

			deletedQuestions = getItem('host_deletedQuestions');
			if(!deletedQuestions) deletedQuestions = {};

			// Screen
			screens = {};
			setupFeedScreen();
			self.container.appendChild(screens.feed.container);
			setupTopScreen();
			self.container.appendChild(screens.top.container);
		
			// Socket Interface
			socketInterface = new HostSocketInterface(socketio);
			socketInterface.connect(_HOST);

			socketInterface.loginSignal.add(function(){
				socketInterface.update();
				setInterval(socketInterface.update, 1000 * 10);
			});

			socketInterface.feedSignal.add(function(data){
				if(data.length > feed.length){
					if(!feed.length) populateScreens(data);
					else updateScreens(data);
					feed = data;
				}
			});

		}

		var setupFeedScreen = function () {
			var container = document.createElement('div');
			container.id = 'feed';
			container.className = 'screen';
			container.title = 'Incoming';
		
			var screen = {
				container: container
			}
			screens.feed = screen;

			screen.list = document.createElement('div');
			screen.list.className = 'list';
			container.appendChild(screen.list);
			
		}
		var setupTopScreen = function () {
			var container = document.createElement('div');
			container.id = 'top';
			container.className = 'screen';
			container.title = 'Top';
		
			var screen = {
				container: container
			}
			screens.top = screen;

			screen.list = document.createElement('div');
			screen.list.className = 'list';
			container.appendChild(screen.list);
		}

		var generateItemNode = function(data) {
			var item = document.createElement('div');
			item.className = 'item';

			var date = new Date(data.created);
			var time = document.createElement('div');
			time.className = 'time';
			time.innerHTML = '<b>' + date.getHours() + ':' + date.getMinutes()+ ':' + date.getSeconds() + '</b>';
			item.appendChild(time);

			time.innerHTML += ' ' + data.data.from;


			var question = document.createElement('div');
			question.className = 'question';
			question.innerHTML = data.data.question;
			item.appendChild(question);

			var approve = document.createElement('button');
			approve.className = 'approve';
			approve.innerHTML = 'Approve';
			item.appendChild(approve);
			approve.addEventListener('click', function(){
				topQuestions[data._id] = true;
				delete unmoderatedQuestions[data._id];
				setItem('host_topQuestions', topQuestions);
				setItem('host_unmoderatedQuestions', unmoderatedQuestions);
				item.parentNode.removeChild(item);
				screens.top.list.insertBefore(item, screens.top.list.firstChild);
			});

			var sendMessage = document.createElement('button');
			sendMessage.className = 'send-message';
			sendMessage.innerHTML = 'Message';
			item.appendChild(sendMessage);
			sendMessage.addEventListener('click', function(){
				window.location = '/notifier/?to=' + data.data.from;
			});



			var remove = document.createElement('button');
			remove.className = 'remove';
			remove.innerHTML = 'Remove';
			item.appendChild(remove);
			remove.addEventListener('click', function(){
				deletedQuestions[data._id] = true;
				delete unmoderatedQuestions[data._id];
				setItem('host_deletedQuestions', deletedQuestions);
				setItem('host_unmoderatedQuestions', unmoderatedQuestions);
				item.parentNode.removeChild(item);
			});

			

			return item;
		}

		var populateScreens = function(data){
			console.log('populate')
			screens.feed.list.innerHTML = '';
			screens.top.list.innerHTML = '';
			unmoderatedQuestions = {};
			for (var i = data.length - 1; i >= 0; i--) {
				var id = data[i]._id;
				if( deletedQuestions[id] ) continue;
				var item = generateItemNode( data[i]);
				var container;
				if( topQuestions[id] ) container = screens.top.list;
				else {
					unmoderatedQuestions[id] = true;
					container = screens.feed.list;
				}
				container.appendChild(item);
			};
			setItem('host_unmoderatedQuestions', unmoderatedQuestions);
		}
		var updateScreens = function(data){
			console.log('update')
			var firstChild = screens.feed.list.firstChild;
			for (var i = data.length - 1; i >= 0; i--) {
				var id = data[i]._id;
				if( deletedQuestions[id] ) continue;
				if( topQuestions[id] ) continue;
				if( unmoderatedQuestions[id] ) continue;

				unmoderatedQuestions[id] = true;
				var item = generateItemNode( data[i]);
	
				screens.feed.list.insertBefore(item, firstChild);
				firstChild = screens.feed.list.firstChild;
			};
			setItem('host_unmoderatedQuestions', unmoderatedQuestions);
		}

		var setItem = function(key, object){
			localStorage.setItem(key, JSON.stringify(object));
		}
		var getItem = function(key){
			return JSON.parse(localStorage.getItem(key));
		}

	}
	App.prototype = new BaseApp();
	return App;
});