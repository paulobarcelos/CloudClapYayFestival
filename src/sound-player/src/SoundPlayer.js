define(
[
	'happy/_libs/datgui',
	'WAAX'
],
function (
	Gui,
	WX
){
	var SoundPlayer = function(socketio) {
		var self = this,
		uuid,
		listens = ['clap', 'wow', 'booh'],
		reports = [],
		socket,

		currentClapSampler,
		claps,

		wps,
		wowCounter,
		currentWowSampler,
		wows,

		bps,
		boohCounter,
		currentBoohSampler,
		claps,

		crowds,
		crowdLevel,
		clapCounter,
		cps,
		estimatedPeople,

		gui,
		guiData;

		// globals
		boohVolume = 1;
		wowVolume = 1;

		var init = function () {
			claps = [];
			currentClapSampler = 0;
			var verb1 = new WX.ConVerb({source:"audio/ir/960-BigEmptyChurch.wav", mix:0.1 });
			var verb2 = new WX.ConVerb({source:"audio/ir/960-BigEmptyChurch.wav", mix:0.1 });
			var verb3 = new WX.ConVerb({source:"audio/ir/960-BigEmptyChurch.wav", mix:0.1 });
			for (var i = 0; i < 10; i++) {
				var sound = {};
				sound.sampler = new WX.Sampler({ source:"audio/clap"+(i%4) +".wav" });
				sound.verb = new WX.ConVerb({source:"audio/ir/960-BigEmptyChurch.wav", mix:0.1 });
				WX.link(sound.sampler, sound.verb,  WX.DAC);
				claps.push(sound);
			};
			//WX.link( verb1, verb2, verb3,  WX.DAC);

			wows = [];
			currentWowSampler = 0;
			for (var i = 0; i < 10; i++) {
				var sound = {};
				sound.sampler = new WX.Sampler({ source:"audio/wow"+i+".wav" });
				sound.verb = new WX.ConVerb({source:"audio/ir/960-BigEmptyChurch.wav", mix:0.1 });
				WX.link(sound.sampler,  sound.verb , WX.DAC);
				wows.push(sound);
			};

			boohs = [];
			currentBoohSampler = 0;
			for (var i = 0; i < 5; i++) {
				var sound = {};
				sound.sampler = new WX.Sampler({ source:"audio/booh"+i+".wav" });
				sound.verb = new WX.ConVerb({source:"audio/ir/960-BigEmptyChurch.wav", mix:0.1 });
				WX.link(sound.sampler, sound.verb , WX.DAC);
				boohs.push(sound);
			};

			crowds = [];
			for (var i = 1; i < 6; i++) {
				(function(){
					var sound = {};
					sound.sampler = new WX.Sampler({ source:"audio/crowd"+i+".wav" });
					
					WX.link(sound.sampler,  WX.DAC);
					crowds[i] = sound;
					setTimeout(function(){
						sound.sampler.noteOn(60);
						sound.sampler._player.loop = true
						sound.sampler._outputGain.gain.value = 0;
						sound.sampler._outputGain.gain.linearRampToValueAtTime(0, WX.now + 1);
					}, 2000);
				})();
				
				
			};
			
			wowCounter = 0;
			wps = 0;
			boohCounter = 0;
			bps = 0;
			clapCounter = 0;
			estimatedPeople = 0;
			crowdLevel = 0;
			setInterval(measureSpeed, 1000);

			guiData = {
				'Master Gain': 1,
				'Wow Gain': 1,
				'Booh Gain': 1
			}
			gui = new Gui();
			gui.remember(guiData);

			gui.add(guiData, 'Master Gain', 0, 1).step(0.00000000000000001).onChange(function(value){
				WX.DAC.gain = value;
			});
			WX.DAC.gain = guiData['Master Gain'];
			gui.add(guiData, 'Wow Gain', 0, 1).step(0.00000000000000001);
			gui.add(guiData, 'Booh Gain', 0, 1).step(0.00000000000000001);
		}

		var measureSpeed = function(){
			cps = clapCounter;
			clapCounter = 0;
			estimatedPeople = Math.round(cps / 3.21);

			bps = boohCounter;
			boohCounter = 0;

			wps = wowCounter;
			wowCounter = 0;

			console.log('cps', cps, 'bps', bps, 'wps', wps, 'estimatedPeople', estimatedPeople);

			var level
			if(estimatedPeople < 15){
				level = 0;
			}
			else if(estimatedPeople >= 15 && estimatedPeople < 20){
				level = 1;
			}
			else if(estimatedPeople >= 20 && estimatedPeople < 30){
				level = 2;
			}
			else if(estimatedPeople >= 30 && estimatedPeople < 40){
				level = 3;
			}
			else if(estimatedPeople >= 40 && estimatedPeople < 50){
				level = 4;
			}
			else if(estimatedPeople >= 50 ){
				level = 5;
			}

			if(level != crowdLevel){
				crowdLevel = level;
				setCrowdLevel(crowdLevel)
			}
		}
		var connect = function (host) {
			socket = socketio.connect(host);
			socket.on('error', function () {
				setTimeout(function () {
					socket.socket.connect();
				}, 1000);
			});

			socket.on('connect', onConnect);
			socket.on('login', onLogin);
			socket.on('clap', clap);
			socket.on('wow', wow);
			socket.on('booh', booh);
		}		
		var clap = function () {
			clapCounter++;
			
			if(crowdLevel > 0) return;

			claps[currentClapSampler].verb.mix = 0.1;//0.05 + Math.random() * 0.1;
			var g = Math.random() * 2;
			claps[currentClapSampler].sampler.gain =  g;
			claps[currentClapSampler].sampler.noteOn(Math.random() * 2 + 59);
			currentClapSampler++;
			if(currentClapSampler == claps.length) currentClapSampler = 0;
		}
		var wow = function () {
			wowCounter++;
			console.log('Wow');
			if(wps > 10 && wowCounter % 2 != 0) return;
			if(wps > 20 && wowCounter % 2 != 0) return;

			var i = Math.round(Math.random() * 9);

			wows[i].verb.mix = 0.05 + Math.random() * 0.1;
			var g = 1 - Math.random() * 0.4;
			wows[i].sampler.gain = (g*g) *  guiData['Wow Gain'];
			wows[i].sampler.noteOn(Math.random() * 7 + 57);
			//currentWowSampler++;
			//if(currentWowSampler == wows.length) currentWowSampler = 0;
		}
		var booh = function () {
			boohCounter++;
			console.log('Booh');

			if(bps > 10 && boohCounter % 2 != 0) return;
			if(bps > 20 && boohCounter % 2 != 0) return;

			boohs[currentBoohSampler].verb.mix = 0.05 + Math.random() * 0.1;
			var g = 1 - Math.random() * 0.4;
			boohs[currentBoohSampler].sampler.gain =  (g*g) *  guiData['Booh Gain'];;
			boohs[currentBoohSampler].sampler.noteOn(Math.random() * 7 + 57);
			currentBoohSampler++;
			if(currentBoohSampler == boohs.length) currentBoohSampler = 0;
		}

		var setCrowdLevel = function(level){
			for (var i = 1; i < 6; i++) {
				if(i == level) continue;
				crowds[i].sampler._outputGain.gain.linearRampToValueAtTime(0, WX.now + 1);
			};

			if(!level) return;
			console.log(crowds[level ], level)
			crowds[level].sampler._outputGain.gain.linearRampToValueAtTime(1, WX.now + 1);
		}

		var onConnect = function () {
			socket.emit('identity', {
				uuid: localStorage.getItem('player_uuid'),
				listens: listens,
				reports: reports
			});
		}
		var onLogin = function(_uuid){
			uuid = _uuid;
			localStorage.setItem('player_uuid', uuid)
			console.log('Login', uuid);
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

		init();
	}
	return SoundPlayer;
});