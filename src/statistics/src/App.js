define(
[
	'happy/app/BaseApp',
	_HOST + '/socket.io/socket.io.js',
	'StatisticsSocketInterface'
],
function (
	BaseApp,
	socketio,
	StatisticsSocketInterface
){

	var App = function(){
		var 
		self = this,
		socketInterface,
		container,
		title,
		clapCount,
		wowCount,
		boohCount,
		questions,
		chartElement,
		chart,

		chartCounter;

		self.setup = function(){
			container = document.createElement('div');
			container.id = "app";
			self.container.appendChild(container);

			title = document.createElement('div');
			title.id = "title";
			container.appendChild(title);

			clapCount = document.createElement('div');
			clapCount.id = "clap-count";
			clapCount.className = 'number';
			container.appendChild(clapCount);

			wowCount = document.createElement('div');
			wowCount.id = "wow-count";
			wowCount.className = 'number';
			container.appendChild(wowCount);

			boohCount = document.createElement('div');
			boohCount.id = "booh-count";
			boohCount.className = 'number';
			container.appendChild(boohCount);

			questions = document.createElement('div');
			questions.id = "questions";
			container.appendChild(questions);

			chartElement = document.createElement('canvas');
			chartElement.id = "chart";
			chartElement.width = 240;
			chartElement.height = 240;
			container.appendChild(chartElement);

			var ctx = chartElement.getContext("2d");
			chart = new Chart(ctx);
			
			// Socket Interface
			socketInterface = new StatisticsSocketInterface(socketio);
			socketInterface.connect(_HOST);

			socketInterface.loginSignal.add(function(){
			
			});
			socketInterface.dataSignal.add(function(data){
				title.innerHTML = data.title;
				questions.innerHTML = '';

				for (var i = 0; i < data.questions.length; i++) {
				 	questions.innerHTML += '<p>' + data.questions[i] + '</p>';
				 }

				var today = new Date();

				var h = data.time_from[0];
				var m = data.time_from[1]|| 0;
				var from = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);

				h = data.time_to[0];
				m = data.time_to[1]|| 0;
				var to = new Date(today.getFullYear(), today.getMonth(), today.getDate(), h, m);

				socketInterface.request(from, to);
			});
			chartCounter = 0;
			socketInterface.clapCountSignal.add(function(count){
				chartCounter++;
				clapCount.innerHTML = count;
				if(chartCounter == 3) createChart();
				
			});
			socketInterface.wowCountSignal.add(function(count){
				chartCounter++;
				wowCount.innerHTML = count;
				if(chartCounter == 3) createChart();
				
			});
			socketInterface.boohCountSignal.add(function(count){
				chartCounter++;
				boohCount.innerHTML = count;
				if(chartCounter == 3) createChart();
				
			});

		}

		var createChart = function(){
			chartCounter = 0;
			var data = [
				{
					value: parseInt(clapCount.innerHTML),
					color:"#0F5ED6"
				},
				{
					value : parseInt(wowCount.innerHTML),
					color : "#10D93C"
				},
				{
					value : parseInt(boohCount.innerHTML),
					color : "#EBBF0E"
				}			
			];
			chart.Pie(data, {segmentShowStroke:false, animationEasing:'easeOutQuart'})
		}

		self.onKeyDown = function(e){
			if(e.keyCode == 32){
				self.toggleFullscreen();
			}
			
		}

		
		var getUrlVar = function() {
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